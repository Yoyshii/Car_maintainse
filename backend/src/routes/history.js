const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

// Получить историю ТО для всех автомобилей пользователя
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getUserCars(req.user.userId);
        let allRecords = [];
        
        for (const car of cars) {
            const records = await db.getMaintenanceRecords(car.id, req.user.userId);
            allRecords.push(...records.map(r => ({ ...r, car_brand: car.brand, car_model: car.model })));
        }
        
        res.json(allRecords);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки истории' });
    }
});

// Добавить запись ТО
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { car_id, part_key, service_type, service_name, date, mileage, cost, description } = req.body;
        
        const car = await db.getCarById(car_id, req.user.userId);
        if (!car) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }
        
        const recordId = await db.addMaintenanceRecord(car_id, req.user.userId, {
            part_key, service_type, service_name, date, mileage, cost, description
        });
        
        res.status(201).json({ id: recordId, message: 'Запись добавлена' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления записи' });
    }
});

module.exports = router;