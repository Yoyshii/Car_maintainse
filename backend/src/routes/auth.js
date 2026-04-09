const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../database');
const { hashPassword, verifyPassword, generateToken, authenticateToken } = require('../auth');

// REGISTER
router.post('/register', [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password, full_name, phone } = req.body;

    try {
        const existing = await db.getUserByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already exists' });

        const hashed = await hashPassword(password);
        const userId = await db.createUser({ username, email, password_hash: hashed, full_name, phone });

        const token = generateToken(userId, username, 'user');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db.saveSession(userId, token, expiresAt.toISOString());

        res.status(201).json({ token, user: { id: userId, username, email, full_name, role: 'user' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// LOGIN
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await db.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        await db.updateLastLogin(user.id);
        await db.deleteUserSessions(user.id);

        const token = generateToken(user.id, user.username, user.role);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db.saveSession(user.id, token, expiresAt.toISOString());

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET PROFILE
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserById(req.user.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// LOGOUT
router.post('/logout', authenticateToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) await db.deleteSession(token);
    res.json({ message: 'Logged out' });
});

module.exports = router;