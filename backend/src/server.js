// GhostAPI Backend Server
// Main Express.js application entry point

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// GhostAPI Tracking Middleware (MUST be before routes)
const ghostApiMiddleware = require('./middleware/ghostapi.middleware');
app.use(ghostApiMiddleware);

// Sample routes
const sampleRoutes = require('./routes/sample.routes');
app.use('/api', sampleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'GhostAPI server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 GhostAPI server running on port ${PORT}`);
    console.log(`🔍 Tracking middleware: ACTIVE`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Sample APIs: http://localhost:${PORT}/api/users`);
});

module.exports = app;
