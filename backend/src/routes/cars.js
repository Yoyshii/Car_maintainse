const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

// Get all cars
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getUserCars(req.user.userId);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create car
router.post('/', authenticateToken, async (req, res) => {
    try {
        const carId = await db.createCar(req.user.userId, req.body);
        res.status(201).json({ id: carId, message: 'Car added' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update mileage
router.post('/:id/mileage', authenticateToken, async (req, res) => {
    try {
        await db.updateCarMileage(req.params.id, req.user.userId, req.body.mileage, req.body.date);
        res.json({ message: 'Mileage updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;