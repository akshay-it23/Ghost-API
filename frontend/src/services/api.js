// API Service Layer
// Handles all HTTP requests to the backend

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const analyticsApi = {
    // Get overview statistics
    getOverview: () => axios.get(`${API_BASE}/analytics/overview`),

    // Get all detected risks
    getAllRisks: () => axios.get(`${API_BASE}/analytics/risks`),

    // Get all endpoints with stats
    getAllEndpoints: () => axios.get(`${API_BASE}/analytics/endpoints`),

    // Get specific endpoint details
    getEndpointDetails: (id) => axios.get(`${API_BASE}/analytics/endpoint/${id}`),

    // Get usage timeline for endpoint
    getTimeline: (id) => axios.get(`${API_BASE}/analytics/endpoint/${id}/timeline`),
};
