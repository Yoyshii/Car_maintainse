const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

// Получить записи ТО для автомобиля
router.get('/car/:carId', authenticateToken, async (req, res) => {
    try {
        const records = await db.getMaintenanceRecords(req.params.carId, req.user.userId);
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки записей ТО' });
    }
});

// ДОБАВИТЬ НОВУЮ ЗАПИСЬ ТО
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { car_id, part_key, service_type, service_name, date, mileage, cost, description } = req.body;
        
        // Проверяем, что автомобиль принадлежит пользователю
        const car = await db.getCarById(car_id, req.user.userId);
        if (!car) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }
        
        const recordId = await db.addMaintenanceRecord(car_id, req.user.userId, {
            part_key,
            service_type,
            service_name,
            date: date || new Date().toISOString().split('T')[0],
            mileage: mileage || car.mileage,
            cost: cost || 0,
            description: description || ''
        });
        
        res.status(201).json({ id: recordId, message: 'Запись ТО добавлена' });
    } catch (err) {
        console.error('Ошибка добавления записи ТО:', err);
        res.status(500).json({ error: 'Ошибка добавления записи ТО' });
    }
});

// Получить все детали (справочник)
router.get('/parts', authenticateToken, async (req, res) => {
    try {
        const parts = await db.getAllParts();
        res.json(parts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки справочника деталей' });
    }
});

module.exports = router;