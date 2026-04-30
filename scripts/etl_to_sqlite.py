import json
import sqlite3
import os
import re
import glob
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

# Load environment variables from .env
load_dotenv()

# Configuration
DB_PATH = Path('public/coffee.sqlite')
DATA_ALIAS_PATH = Path('reference/data_alias.json')
STORES_DB_DIR = Path('reference/store_database')
FLAVOR_LEXICON_PATH = Path('src/data/flavorLexicon.json')

# AI Configuration
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
if GOOGLE_API_KEY and GOOGLE_API_KEY != 'your_api_key_here':
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("Warning: GOOGLE_API_KEY not set correctly. AI features will be disabled.")

def init_db():
    # If we want to fully rebuild every time, we unlink. 
    # For incremental, we would keep it. User said "Once I call this agent, agent will excute all workflow".
    # Usually ETL means full rebuild or sync. Let's stick to full rebuild for now to ensure consistency.
    if DB_PATH.exists():
        DB_PATH.unlink()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Stores table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
    )
    ''')
    
    # Offerings table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS offerings (
        id TEXT PRIMARY KEY,
        store_id TEXT,
        name TEXT,
        roast TEXT,
        process TEXT,
        intensity INTEGER,
        description TEXT,
        FOREIGN KEY (store_id) REFERENCES stores(id)
    )
    ''')
    
    # Flavor Taxonomy table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS flavor_taxonomy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES flavor_taxonomy(id)
    )
    ''')
    
    # Flavor Tags table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS flavor_tags (
        name TEXT PRIMARY KEY,
        taxonomy_id INTEGER,
        FOREIGN KEY (taxonomy_id) REFERENCES flavor_taxonomy(id)
    )
    ''')
    
    # User Entries table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_entries (
        id TEXT PRIMARY KEY,
        date TEXT,
        store_name TEXT,
        coffee_name TEXT,
        roast_level INTEGER,
        intensity INTEGER,
        acidity REAL,
        bitterness REAL,
        sweetness REAL,
        body REAL,
        score REAL,
        flavor_tags TEXT, 
        updated_at TEXT,
        is_active INTEGER DEFAULT 1
    )
    ''')
    
    conn.commit()
    return conn

def import_flavor_lexicon(conn, lexicon_data):
    cursor = conn.cursor()
    
    def process_node(node, parent_id=None):
        name = node.get('name')
        cursor.execute('INSERT INTO flavor_taxonomy (name, parent_id) VALUES (?, ?)', (name, parent_id))
        node_id = cursor.lastrowid
        cursor.execute('INSERT OR IGNORE INTO flavor_tags (name, taxonomy_id) VALUES (?, ?)', (name, node_id))
        for child in node.get('children', []):
            process_node(child, node_id)
            
    if isinstance(lexicon_data, dict) and 'children' in lexicon_data:
        for child in lexicon_data['children']:
            process_node(child)
    elif isinstance(lexicon_data, list):
        for item in lexicon_data:
            process_node(item)
    conn.commit()

def load_mappings():
    with open(DATA_ALIAS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def normalize_value(value, mapping):
    if not value or value == 'N/A':
        return 'Unknown'
    return mapping.get(value, value)

async def ai_predict_intensity(description: str) -> int:
    if not model or not description or description == 'N/A':
        return 3
    prompt = f"Analyze the following coffee tasting notes and predict the 'intensity' (1-5). Return ONLY the integer.\nDescription: {description}"
    try:
        response = await model.generate_content_async(prompt)
        match = re.search(r'\b[1-5]\b', response.text)
        return int(match.group(0)) if match else 3
    except Exception as e:
        return 3

async def main():
    print("Starting Data Keeper ETL Pipeline...")
    conn = init_db()
    
    # 1. Flavor Taxonomy
    print("Importing Flavor Lexicon...")
    with open(FLAVOR_LEXICON_PATH, 'r', encoding='utf-8') as f:
        import_flavor_lexicon(conn, json.load(f))
    
    # 2. Mappings
    mappings = load_mappings()
    roast_map = mappings.get('roast_mapping', {})
    process_map = mappings.get('process_mapping', {})
    
    # 3. Process all store databases
    json_files = glob.glob(str(STORES_DB_DIR / "*_database.json"))
    if not json_files:
        print("No store database files found in reference/store_database/")
        return

    cursor = conn.cursor()
    for file_path in json_files:
        store_id = Path(file_path).name.replace("_database.json", "")
        store_name = store_id.capitalize()
        print(f"Processing Store: {store_name} ({file_path})...")
        
        cursor.execute('INSERT OR IGNORE INTO stores (id, name) VALUES (?, ?)', (store_id, store_name))
        
        with open(file_path, 'r', encoding='utf-8') as f:
            store_data = json.load(f)
            
        for item in store_data:
            item_id = item.get('ID')
            name = item.get('豆名')
            roast = normalize_value(item.get('烘培'), roast_map)
            process = normalize_value(item.get('處理'), process_map)
            description = item.get('口感描述')
            flavors_raw = item.get('Flavor', '')
            
            intensity = 3
            if model and description and description != 'N/A':
                intensity = await ai_predict_intensity(description)
            
            cursor.execute('''
            INSERT INTO offerings (id, store_id, name, roast, process, intensity, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (item_id, store_id, name, roast, process, intensity, description))
            
            if flavors_raw and flavors_raw != 'N/A':
                flavor_list = [f.strip() for f in flavors_raw.split(',') if f.strip()]
                for flavor in flavor_list:
                    cursor.execute('INSERT OR IGNORE INTO flavor_tags (name, taxonomy_id) VALUES (?, ?)', (flavor, None))
    
    conn.commit()
    conn.close()
    print(f"ETL Complete. Database saved to {DB_PATH}")

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
