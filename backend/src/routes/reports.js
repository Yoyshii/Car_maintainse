const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getUserCars(req.user.userId);
        let totalMileage = 0;
        for (const car of cars) {
            totalMileage += car.mileage || 0;
        }
        res.json({ cars_count: cars.length, total_mileage: totalMileage });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;