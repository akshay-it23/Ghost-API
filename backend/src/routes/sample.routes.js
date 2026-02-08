// Sample API routes for GhostAPI to track
// These endpoints will be monitored by the GhostAPI middleware

const express = require('express');
const router = express.Router();

// Sample endpoints to track
router.get('/users', (req, res) => {
    res.json({
        message: 'List of users',
        data: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
    });
});

router.post('/users', (req, res) => {
    res.json({
        message: 'User created',
        data: { id: 3, name: req.body.name || 'New User' }
    });
});

router.get('/products', (req, res) => {
    res.json({
        message: 'List of products',
        data: [
            { id: 1, name: 'Laptop', price: 999 },
            { id: 2, name: 'Phone', price: 699 }
        ]
    });
});

// Intentionally no auth check (to trigger security risk detection)
router.delete('/admin/delete', (req, res) => {
    res.json({ message: 'Admin delete executed' });
});

// This endpoint is marked for deprecation testing
router.get('/deprecated-endpoint', (req, res) => {
    res.json({ message: 'This endpoint is deprecated' });
});

// Endpoint that will simulate errors for testing
router.get('/unstable', (req, res) => {
    // 30% chance of error for testing unstable API detection
    if (Math.random() < 0.3) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Success' });
});

module.exports = router;
