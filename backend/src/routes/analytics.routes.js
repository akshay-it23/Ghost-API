// Analytics Routes
// REST API endpoints for dashboard

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Overview statistics
router.get('/overview', analyticsController.getOverview);

// All detected risks
router.get('/risks', analyticsController.getAllRisks);

// All endpoints with stats
router.get('/endpoints', analyticsController.getAllEndpoints);

// Specific endpoint details
router.get('/endpoint/:id', analyticsController.getEndpointDetails);

// Endpoint usage timeline
router.get('/endpoint/:id/timeline', analyticsController.getUsageTimeline);

module.exports = router;
