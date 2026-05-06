import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import initSqlJs from 'sql.js';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;
let sqlJsDb = null;
let isReady = false;

export const initSqlite = async () => {
    if (isReady) return;
    try {
        if (Capacitor.getPlatform() === 'web') {
            const SQL = await initSqlJs({
                locateFile: file => `/assets/${file}`
            });
            const response = await fetch('/assets/databases/coffeedb.db');
            if (!response.ok) throw new Error(`Failed to fetch database: ${response.statusText}`);
            const buffer = await response.arrayBuffer();
            sqlJsDb = new SQL.Database(new Uint8Array(buffer));
            isReady = true;
            return;
        }
        
        try {
            await sqlite.copyFromAssets({ overwrite: true });
        } catch (e) {
            console.warn("copyFromAssets skipped or failed", e);
        }

        const isConn = (await sqlite.isConnection("coffeedb", false)).result;
        
        if (isConn) {
            db = await sqlite.retrieveConnection("coffeedb", false);
        } else {
            db = await sqlite.createConnection("coffeedb", false, "no-encryption", 1, false);
        }
        
        await db.open();
        isReady = true;
    } catch (err) {
        console.error("SQLite Init Error:", err);
    }
};

export const searchOfferings = async (query = '') => {
    if (!isReady) await initSqlite();
    
    try {
        let sql = `
            SELECT o.id, o.name, o.roast, o.process, o.description, o.intensity, s.name as store
            FROM offerings o
            LEFT JOIN stores s ON o.store_id = s.id
            WHERE 1=1
        `;
        const params = [];
        
        if (query) {
            sql += ` AND (o.name LIKE ? OR s.name LIKE ? OR o.description LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }
        
        let rows = [];

        if (Capacitor.getPlatform() === 'web') {
            if (!sqlJsDb) return [];
            const stmt = sqlJsDb.prepare(sql);
            stmt.bind(params);
            while(stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
        } else {
            if (!db) return [];
            const res = await db.query(sql, params);
            rows = res.values || [];
        }
        
        return rows.map(row => ({
            id: row.id,
            store: row.store || 'Unknown',
            name: row.name,
            roast: row.roast,
            process: row.process,
            description: row.description,
            price: 'N/A',
            flavors: []
        }));
    } catch (err) {
        console.error("Search Error:", err);
        return [];
    }
};
