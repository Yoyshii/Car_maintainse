const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

// Получить все автомобили
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getUserCars(req.user.userId);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Создать автомобиль
router.post('/', authenticateToken, async (req, res) => {
    try {
        const carId = await db.createCar(req.user.userId, req.body);
        const newCar = await db.getCarById(carId, req.user.userId);
        res.status(201).json(newCar);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Обновить пробег
router.post('/:id/mileage', authenticateToken, async (req, res) => {
    try {
        await db.updateCarMileage(req.params.id, req.user.userId, req.body.mileage, req.body.date);
        const updatedCar = await db.getCarById(req.params.id, req.user.userId);
        res.json(updatedCar);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;