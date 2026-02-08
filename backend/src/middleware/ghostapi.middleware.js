// GhostAPI Middleware - Core Tracking System
// This middleware intercepts every API call and logs metadata to the database

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GhostAPI Middleware
 * Intercepts all API requests and logs them for analysis
 * Non-blocking - doesn't slow down API responses
 */
const ghostApiMiddleware = async (req, res, next) => {
    const startTime = Date.now();

    // Capture original res.json to intercept response
    const originalJson = res.json.bind(res);

    // Override res.json to capture when response is sent
    res.json = function (data) {
        const responseTime = Date.now() - startTime;
        const statusCode = res.statusCode;

        // Log API hit asynchronously (non-blocking)
        logApiHit({
            path: req.path,
            method: req.method,
            statusCode,
            responseTime,
            authPresent: !!req.headers.authorization,
        }).catch(err => console.error('GhostAPI logging error:', err));

        // Send response immediately (don't wait for logging)
        return originalJson(data);
    };

    next();
};

/**
 * Log API Hit to Database
 * Creates or finds endpoint, then logs the hit
 */
async function logApiHit({ path, method, statusCode, responseTime, authPresent }) {
    try {
        // Skip logging for health check and GhostAPI's own endpoints
        if (path === '/health' || path.startsWith('/api/analytics')) {
            return;
        }

        // Find or create endpoint
        let endpoint = await prisma.apiEndpoint.findUnique({
            where: {
                path_method: { path, method }
            }
        });

        if (!endpoint) {
            endpoint = await prisma.apiEndpoint.create({
                data: { path, method }
            });
            console.log(`📝 New endpoint tracked: ${method} ${path}`);
        }

        // Create hit record
        await prisma.apiHit.create({
            data: {
                endpointId: endpoint.id,
                statusCode,
                responseTime,
                authPresent,
            }
        });

        console.log(`✅ Logged: ${method} ${path} - ${statusCode} (${responseTime}ms)`);
    } catch (error) {
        console.error('Error logging API hit:', error);
    }
}

module.exports = ghostApiMiddleware;
