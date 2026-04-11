require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Подключаем базу данных
const db = require('./database');

// Импортируем роуты
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const maintenanceRoutes = require('./routes/maintenance');
const reportsRoutes = require('./routes/reports');

// Проверяем, что роуты загрузились правильно
console.log('✅ authRoutes loaded:', typeof authRoutes);
console.log('✅ carRoutes loaded:', typeof carRoutes);
console.log('✅ maintenanceRoutes loaded:', typeof maintenanceRoutes);
console.log('✅ reportsRoutes loaded:', typeof reportsRoutes);

// Используем роуты
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportsRoutes);

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
    res.json({ total_users: 1, total_cars: 1, total_services: 8 });
});

// Catch all - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// Запуск сервера
async function start() {
    try {
        await db.connect();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

start();