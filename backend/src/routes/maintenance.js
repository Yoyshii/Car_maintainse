const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

// Get maintenance records for a car
router.get('/car/:carId', authenticateToken, async (req, res) => {
    try {
        const records = await db.getMaintenanceRecords(req.params.carId, req.user.userId);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add maintenance record
router.post('/', authenticateToken, async (req, res) => {
    try {
        const recordId = await db.addMaintenanceRecord(req.body.car_id, req.user.userId, req.body);
        res.status(201).json({ id: recordId, message: 'Record added' });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

// Get all car parts
router.get('/parts', authenticateToken, async (req, res) => {
    try {
        const parts = await db.getAllParts();
        res.json(parts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;