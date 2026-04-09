const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getUserCars(req.user.userId);
        let totalMileage = 0;
        let totalCost = 0;
        let totalServices = 0;
        
        for (const car of cars) {
            totalMileage += car.mileage || 0;
            const records = await db.getMaintenanceRecords(car.id, req.user.userId);
            totalCost += records.reduce((sum, r) => sum + (r.cost || 0), 0);
            totalServices += records.length;
        }
        
        res.json({ cars_count: cars.length, total_mileage: totalMileage, total_cost: totalCost, total_services: totalServices });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;