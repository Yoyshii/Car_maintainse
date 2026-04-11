const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// БАЗА ДАННЫХ В ТЕКУЩЕЙ ПАПКЕ (где запускается сервер)
const dbPath = path.join(process.cwd(), 'car_maintenance.db');
const schemaPath = path.join(__dirname, '../schema.sql');

console.log('📁 Database path:', dbPath);
console.log('📁 Schema path:', schemaPath);

class Database {
    constructor() {
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('❌ Database error:', err.message);
                    reject(err);
                } else {
                    console.log('✅ SQLite connected at:', dbPath);
                    this.initSchema().then(resolve).catch(reject);
                }
            });
        });
    }

    async initSchema() {
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            const statements = schema.split(';').filter(s => s.trim());
            for (const stmt of statements) {
                try {
                    await this.run(stmt);
                } catch (e) {
                    if (!e.message.includes('already exists')) {
                        console.error('Schema warning:', e.message);
                    }
                }
            }
            console.log('✅ Database schema initialized');
        } else {
            console.warn('⚠️ schema.sql not found at:', schemaPath);
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ========== USER METHODS ==========
    async getUserByEmail(email) {
        return this.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    async getUserById(id) {
        return this.get('SELECT id, username, email, full_name, phone, role FROM users WHERE id = ?', [id]);
    }

    async createUser(userData) {
        const { username, email, password_hash, full_name, phone } = userData;
        const result = await this.run(
            'INSERT INTO users (username, email, password_hash, full_name, phone) VALUES (?, ?, ?, ?, ?)',
            [username, email, password_hash, full_name, phone]
        );
        return result.id;
    }

    async updateLastLogin(userId) {
        await this.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    }

    // ========== CAR METHODS ==========
    async getUserCars(userId) {
        return this.all('SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }

    async getCarById(id, userId) {
        return this.get('SELECT * FROM cars WHERE id = ? AND user_id = ?', [id, userId]);
    }

    async createCar(userId, data) {
        const { brand, model, year, license_plate, color, mileage, engine_type } = data;
        const result = await this.run(
            `INSERT INTO cars (user_id, brand, model, year, license_plate, color, mileage, engine_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, brand, model, year || new Date().getFullYear(), license_plate || '', color || '#dc2626', mileage || 0, engine_type || '']
        );
        return result.id;
    }

    async updateCarMileage(carId, userId, mileage, date) {
        await this.run('UPDATE cars SET mileage = ? WHERE id = ? AND user_id = ?', [mileage, carId, userId]);
        await this.run('INSERT INTO mileage_history (car_id, mileage, record_date) VALUES (?, ?, ?)', [carId, mileage, date]);
    }

    async getMaintenanceRecords(carId, userId) {
        return this.all(
            `SELECT * FROM maintenance_records WHERE car_id = ? 
             AND EXISTS (SELECT 1 FROM cars WHERE id = ? AND user_id = ?)
             ORDER BY date DESC`,
            [carId, carId, userId]
        );
    }

    async getAllParts() {
        return this.all('SELECT * FROM car_parts');
    }

    // ========== SESSION METHODS ==========
    async saveSession(userId, token, expiresAt) {
        await this.run('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, token, expiresAt]);
    }

    async deleteSession(token) {
        await this.run('DELETE FROM sessions WHERE token = ?', [token]);
    }

    async deleteUserSessions(userId) {
        await this.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
    }

    close() {
        if (this.db) this.db.close();
    }
}

module.exports = new Database();