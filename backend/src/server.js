require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/public/assets')));

// Импортируем роуты
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const maintenanceRoutes = require('./routes/maintenance');
const reportsRoutes = require('./routes/reports');
const historyRoutes = require('./routes/history');  // ДОБАВЛЯЕМ ИСТОРИЮ

// Проверяем, что роуты загрузились правильно
console.log('✅ authRoutes loaded:', typeof authRoutes);
console.log('✅ carRoutes loaded:', typeof carRoutes);
console.log('✅ maintenanceRoutes loaded:', typeof maintenanceRoutes);
console.log('✅ reportsRoutes loaded:', typeof reportsRoutes);
console.log('✅ historyRoutes loaded:', typeof historyRoutes);

// Используем роуты
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/history', historyRoutes);  // ДОБАВЛЯЕМ РОУТ ИСТОРИИ

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