// Analytics Controller
// Provides REST APIs for dashboard data

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalyticsController {

    /**
     * GET /api/analytics/overview
     * Returns summary statistics for dashboard
     */
    getOverview = async (req, res) => {
        try {
            const totalApis = await prisma.apiEndpoint.count();
            const totalRisks = await prisma.apiRisk.count();

            const risksByType = await prisma.apiRisk.groupBy({
                by: ['riskType'],
                _count: true
            });

            const risksBySeverity = await prisma.apiRisk.groupBy({
                by: ['severity'],
                _count: true
            });

            res.json({
                totalApis,
                totalRisks,
                risksByType,
                risksBySeverity
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * GET /api/analytics/risks
   * Returns all detected risks with endpoint details
   */
    getAllRisks = async (req, res) => {
        try {
            const risks = await prisma.apiRisk.findMany({
                include: {
                    endpoint: true
                },
                orderBy: {
                    detectedAt: 'desc'
                }
            });

            res.json(risks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * GET /api/analytics/endpoint/:id
   * Returns detailed information about a specific endpoint
   */
    getEndpointDetails = async (req, res) => {
        try {
            const { id } = req.params;

            const endpoint = await prisma.apiEndpoint.findUnique({
                where: { id: parseInt(id) },
                include: {
                    hits: {
                        orderBy: { timestamp: 'desc' },
                        take: 100
                    },
                    risks: true
                }
            });

            if (!endpoint) {
                return res.status(404).json({ error: 'Endpoint not found' });
            }

            res.json(endpoint);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * GET /api/analytics/endpoint/:id/timeline
   * Returns usage timeline grouped by day
   */
    getUsageTimeline = async (req, res) => {
        try {
            const { id } = req.params;

            const hits = await prisma.apiHit.findMany({
                where: { endpointId: parseInt(id) },
                orderBy: { timestamp: 'asc' }
            });

            // Group by day
            const timeline = hits.reduce((acc, hit) => {
                const date = hit.timestamp.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = { date, count: 0, errors: 0 };
                }
                acc[date].count++;
                if (hit.statusCode >= 400) {
                    acc[date].errors++;
                }
                return acc;
            }, {});

            res.json(Object.values(timeline));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * GET /api/analytics/endpoints
   * Returns all endpoints with basic stats
   */
    getAllEndpoints = async (req, res) => {
        try {
            const endpoints = await prisma.apiEndpoint.findMany({
                include: {
                    _count: {
                        select: {
                            hits: true,
                            risks: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json(endpoints);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AnalyticsController();
