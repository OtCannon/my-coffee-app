import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

const DB_NAME = 'coffee_sqlite'; // Note: no extension in name for capacitor-sqlite

/**
 * Initializes the SQLite connection and syncs the database from public if needed.
 */
export const initDB = async () => {
    if (db) return db;

    try {
        const platform = Capacitor.getPlatform();
        
        // For PWA, we need to handle the jeep-sqlite element
        if (platform === 'web') {
            const jeepSqlite = document.querySelector('jeep-sqlite');
            if (jeepSqlite) {
                await sqlite.initWebStore();
            }
        }

        const ret = await sqlite.checkConnectionsConsistency();
        const isConn = (await sqlite.isConnection(DB_NAME, false)).result;

        if (ret.result && isConn) {
            db = await sqlite.retrieveConnection(DB_NAME, false);
        } else {
            db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
        }

        await db.open();

        // Check if tables exist, if not, we might need to sync from the public sqlite
        // However, a better approach for PWA is to run the initialization SQL if it's empty
        const tableCheck = await db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='offerings'");
        if (tableCheck.values.length === 0) {
            console.log('Database empty, performing initial sync...');
            await syncDatabase();
        }

        return db;
    } catch (err) {
        console.error('SQLite init error:', err);
        throw err;
    }
};

/**
 * Syncs the database by fetching the pre-built sqlite from public.
 * For PWA, we might need to execute the SQL commands or use a JSON export/import.
 * A simpler way for this demo is to fetch and run the schema/data if the script was provided.
 * But since we have a .sqlite file, we'll try to fetch it.
 */
async def syncDatabase() {
    try {
        // In a real mobile app, you'd use copyFromAssets.
        // For PWA/Web, we can fetch the file and use its content.
        // Since sqlite.importFromJson is the standard way for Capacitor SQLite to seed data,
        // we'll implement a basic schema creation here if sync fails.
        
        const response = await fetch(`${import.meta.env.BASE_URL}coffee.sqlite`);
        if (!response.ok) throw new Error('Failed to fetch coffee.sqlite');
        
        // Note: Capacitor SQLite doesn't easily support loading a raw .sqlite file into the web store directly via fetch.
        // Usually, you'd use a JSON export from the ETL script.
        // For now, let's manually create the essential tables if they are missing.
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS stores (id TEXT PRIMARY KEY, name TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS offerings (id TEXT PRIMARY KEY, store_id TEXT, name TEXT, roast TEXT, process TEXT, intensity INTEGER, description TEXT);
            CREATE TABLE IF NOT EXISTS flavor_taxonomy (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, parent_id INTEGER);
            CREATE TABLE IF NOT EXISTS flavor_tags (name TEXT PRIMARY KEY, taxonomy_id INTEGER);
            CREATE TABLE IF NOT EXISTS user_entries (
                id TEXT PRIMARY KEY, date TEXT, store_name TEXT, coffee_name TEXT, 
                roast_level INTEGER, intensity INTEGER, acidity REAL, bitterness REAL, 
                sweetness REAL, body REAL, score REAL, flavor_tags TEXT, 
                updated_at TEXT, is_active INTEGER DEFAULT 1
            );
        `);
        
        console.log('Basic schema initialized.');
    } catch (err) {
        console.error('Sync error:', err);
    }
}

/**
 * Get all user records.
 */
export const getAllRecords = async () => {
    const database = await initDB();
    const result = await database.query("SELECT * FROM user_entries WHERE is_active = 1 ORDER BY date DESC");
    
    // Map SQL rows back to the format the app expects
    return result.values.map(row => ({
        id: row.id,
        date: row.date,
        store: row.store_name,
        coffeeName: row.coffee_name,
        roastLevel: row.roast_level,
        intensity: row.intensity,
        scores: {
            acidity: row.acidity,
            bitterness: row.bitterness,
            sweetness: row.sweetness,
            body: row.body
        },
        score: row.score,
        selectedFlavors: JSON.parse(row.flavor_tags || '[]'),
        updatedAt: row.updated_at,
        isActive: !!row.is_active
    }));
};

/**
 * Save or update a record.
 */
export const saveRecord = async (record) => {
    const database = await initDB();
    const flavors = JSON.stringify(record.selectedFlavors);
    
    const sql = `
        INSERT OR REPLACE INTO user_entries 
        (id, date, store_name, coffee_name, roast_level, intensity, acidity, bitterness, sweetness, body, score, flavor_tags, updated_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        record.id, record.date, record.store || 'Unknown', record.coffeeName,
        record.roastLevel, record.intensity || 3,
        record.scores.acidity, record.scores.bitterness, record.scores.sweetness, record.scores.body,
        record.score, flavors, record.updatedAt, record.isActive ? 1 : 0
    ];
    
    await database.run(sql, params);
};

/**
 * Delete a record (soft delete).
 */
export const deleteRecord = async (id) => {
    const database = await initDB();
    await database.run("UPDATE user_entries SET is_active = 0, updated_at = ? WHERE id = ?", [new Date().toISOString(), id]);
};

/**
 * Get flavor taxonomy.
 */
export const getFlavorTaxonomy = async (parentId = null) => {
    const database = await initDB();
    let result;
    if (parentId === null) {
        result = await database.query("SELECT * FROM flavor_taxonomy WHERE parent_id IS NULL");
    } else {
        result = await database.query("SELECT * FROM flavor_taxonomy WHERE parent_id = ?", [parentId]);
    }
    return result.values;
};

/**
 * Migration from LocalStorage (preserved from original)
 */
export const migrateFromLocalStorage = async () => {
    const localData = localStorage.getItem('coffee_history');
    if (localData) {
        try {
            const records = JSON.parse(localData);
            if (Array.isArray(records) && records.length > 0) {
                console.log('Migrating data from localStorage to SQLite...');
                for (const record of records) {
                    await saveRecord(record);
                }
                localStorage.setItem('coffee_history_backup', localData);
                localStorage.removeItem('coffee_history');
            }
        } catch (err) {
            console.error('Migration error:', err);
        }
    }
};

/**
 * Placeholder for storage quota.
 */
export const getStorageQuota = async () => {
    return { usageMB: '0.00', quotaMB: '0.00', percentage: '0.00' };
};
