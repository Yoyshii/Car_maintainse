const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../auth');

router.get('/car/:carId', authenticateToken, async (req, res) => {
    try {
        const records = await db.getMaintenanceRecords(req.params.carId, req.user.userId);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/parts', authenticateToken, async (req, res) => {
    try {
        const parts = await db.getAllParts();
        res.json(parts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;