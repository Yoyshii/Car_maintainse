-- =============================================
-- Car Maintenance Visualizer - Database Schema
-- =============================================

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Таблица автомобилей
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    license_plate VARCHAR(20),
    color VARCHAR(50),
    mileage INTEGER DEFAULT 0,
    engine_type VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица деталей (справочник)
CREATE TABLE IF NOT EXISTS car_parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    icon VARCHAR(10),
    color VARCHAR(20),
    default_interval_km INTEGER DEFAULT 15000,
    description TEXT
);

-- Таблица записей ТО
CREATE TABLE IF NOT EXISTS maintenance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    part_key VARCHAR(50),
    service_type VARCHAR(100) NOT NULL,
    service_name VARCHAR(200),
    date DATE NOT NULL,
    mileage INTEGER NOT NULL,
    cost DECIMAL(10, 2),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Таблица истории пробега
CREATE TABLE IF NOT EXISTS mileage_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    record_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Таблица сессий
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_maintenance_car_id ON maintenance_records(car_id);
CREATE INDEX idx_mileage_car_id ON mileage_history(car_id);

-- Начальные данные (детали)
INSERT OR IGNORE INTO car_parts (part_key, name, category, icon, color, default_interval_km, description) VALUES
('engine', 'Engine / Hood', 'engine', '🔧', '#3b82f6', 15000, 'Engine, oil, filters, spark plugs'),
('wheel_fl', 'Front Left Wheel', 'wheels', '🛞', '#10b981', 15000, 'Tire, balancing, pressure'),
('wheel_fr', 'Front Right Wheel', 'wheels', '🛞', '#10b981', 15000, 'Tire, balancing, pressure'),
('wheel_rl', 'Rear Left Wheel', 'wheels', '🛞', '#10b981', 15000, 'Tire, balancing, pressure'),
('wheel_rr', 'Rear Right Wheel', 'wheels', '🛞', '#10b981', 15000, 'Tire, balancing, pressure'),
('door_fl', 'Front Left Door', 'body', '🚪', '#f59e0b', 20000, 'Hinges, seals, window regulator'),
('door_fr', 'Front Right Door', 'body', '🚪', '#f59e0b', 20000, 'Hinges, seals, window regulator'),
('trunk', 'Trunk / Boot', 'body', '📦', '#ec489a', 50000, 'Lock, struts, tail lights'),
('roof', 'Roof / Sunroof', 'body', '🏠', '#8b5cf6', 30000, 'Sunroof, seals, drains'),
('headlight_l', 'Left Headlight', 'lights', '💡', '#fbbf24', 10000, 'Bulb, beam alignment'),
('headlight_r', 'Right Headlight', 'lights', '💡', '#fbbf24', 10000, 'Bulb, beam alignment'),
('exhaust', 'Exhaust System', 'exhaust', '🔊', '#ef4444', 50000, 'Muffler, catalytic converter');