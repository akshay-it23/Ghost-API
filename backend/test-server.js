// Test Analytics Routes
const express = require('express');
const app = express();

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test works!' });
});

// Try to load analytics routes
try {
    const analyticsRoutes = require('./src/routes/analytics.routes');
    app.use('/api/analytics', analyticsRoutes);
    console.log('✅ Analytics routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading analytics routes:', error.message);
}

app.listen(3001, () => {
    console.log('Test server running on http://localhost:3001');
    console.log('Test: http://localhost:3001/test');
    console.log('Analytics: http://localhost:3001/api/analytics/overview');
});
