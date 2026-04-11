const express = require('express');
const router = express.Router();
const db = require('../database');
const { hashPassword, verifyPassword, generateToken } = require('../auth');

// Регистрация
router.post('/register', async (req, res) => {
    const { username, email, password, full_name, phone } = req.body;
    
    try {
        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        const hashedPassword = await hashPassword(password);
        const userId = await db.createUser({ username, email, password_hash: hashedPassword, full_name, phone });
        const token = generateToken(userId, username, 'user');
        
        res.json({ token, user: { id: userId, username, email, full_name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = generateToken(user.id, user.username, user.role);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;