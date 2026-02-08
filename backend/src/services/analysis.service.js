// GhostAPI Analysis Service
// Detects API risks based on usage patterns and metadata

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalysisService {

    /**
     * Run all analysis rules
     * This is the main function that detects all types of risks
     */
    async runAllAnalyses() {
        console.log('🔍 Starting API risk analysis...');

        // Clear old risks (optional - for fresh analysis each time)
        await prisma.apiRisk.deleteMany({});
        console.log('🗑️  Cleared old risks');

        await this.detectDeadApis();
        await this.detectUnsecuredApis();
        await this.detectUnstableApis();
        await this.detectLowUsageApis();
        await this.detectZombieApis();

        console.log('✅ Analysis complete!');

        // Show summary
        const riskCount = await prisma.apiRisk.count();
        console.log(`📊 Total risks detected: ${riskCount}`);
    }

    /**
     * RULE 1: Dead API Detection
     * Finds endpoints with no hits in the last 30 days
     */
    async detectDeadApis() {
        console.log('\n🔍 Checking for dead APIs...');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const endpoints = await prisma.apiEndpoint.findMany();

        for (const endpoint of endpoints) {
            const recentHit = await prisma.apiHit.findFirst({
                where: {
                    endpointId: endpoint.id,
                    timestamp: { gte: thirtyDaysAgo }
                }
            });

            if (!recentHit) {
                // Calculate days since last hit
                const lastHit = await prisma.apiHit.findFirst({
                    where: { endpointId: endpoint.id },
                    orderBy: { timestamp: 'desc' }
                });

                const daysSinceLastHit = lastHit
                    ? Math.floor((Date.now() - lastHit.timestamp.getTime()) / (1000 * 60 * 60 * 24))
                    : 'never';

                await this.createRisk({
                    endpointId: endpoint.id,
                    riskType: 'DEAD_API',
                    severity: 'MEDIUM',
                    explanation: `API ${endpoint.path} (${endpoint.method}) has not been called in 30+ days (last hit: ${daysSinceLastHit} days ago). Consider deprecating to reduce maintenance overhead.`
                });
            }
        }
    }

    /**
     * RULE 2: Unsecured API Detection
     * Finds sensitive endpoints accessed without authentication
     */
    async detectUnsecuredApis() {
        console.log('\n🔍 Checking for unsecured APIs...');

        const sensitivePatterns = ['/admin', '/delete', '/update', '/create'];

        const endpoints = await prisma.apiEndpoint.findMany();

        for (const endpoint of endpoints) {
            const isSensitive = sensitivePatterns.some(pattern =>
                endpoint.path.toLowerCase().includes(pattern)
            );

            if (isSensitive) {
                const unauthHit = await prisma.apiHit.findFirst({
                    where: {
                        endpointId: endpoint.id,
                        authPresent: false
                    }
                });

                if (unauthHit) {
                    await this.createRisk({
                        endpointId: endpoint.id,
                        riskType: 'UNSECURED_API',
                        severity: 'CRITICAL',
                        explanation: `API ${endpoint.path} (${endpoint.method}) is a sensitive endpoint but was accessed without authentication. This is a critical security vulnerability!`
                    });
                }
            }
        }
    }

    /**
     * RULE 3: Unstable API Detection
     * Finds endpoints with high error rates (>20% in last 7 days)
     */
    async detectUnstableApis() {
        console.log('\n🔍 Checking for unstable APIs...');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const endpoints = await prisma.apiEndpoint.findMany();

        for (const endpoint of endpoints) {
            const hits = await prisma.apiHit.findMany({
                where: {
                    endpointId: endpoint.id,
                    timestamp: { gte: sevenDaysAgo }
                }
            });

            if (hits.length === 0) continue;

            const errorHits = hits.filter(h => h.statusCode >= 400);
            const errorRate = errorHits.length / hits.length;

            if (errorRate > 0.20) {
                await this.createRisk({
                    endpointId: endpoint.id,
                    riskType: 'UNSTABLE_API',
                    severity: 'HIGH',
                    explanation: `API ${endpoint.path} (${endpoint.method}) has ${(errorRate * 100).toFixed(1)}% error rate in the last 7 days (${errorHits.length} errors out of ${hits.length} calls). Investigate immediately!`
                });
            }
        }
    }

    /**
     * RULE 4: Low Usage API Detection
     * Finds endpoints with very few calls in last 30 days
     */
    async detectLowUsageApis() {
        console.log('\n🔍 Checking for low usage APIs...');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const endpoints = await prisma.apiEndpoint.findMany();

        for (const endpoint of endpoints) {
            const hitCount = await prisma.apiHit.count({
                where: {
                    endpointId: endpoint.id,
                    timestamp: { gte: thirtyDaysAgo }
                }
            });

            if (hitCount > 0 && hitCount < 10) {
                await this.createRisk({
                    endpointId: endpoint.id,
                    riskType: 'LOW_USAGE_API',
                    severity: 'LOW',
                    explanation: `API ${endpoint.path} (${endpoint.method}) has only ${hitCount} calls in the last 30 days. Consider if this endpoint is still needed or if it can be consolidated.`
                });
            }
        }
    }

    /**
     * RULE 5: Zombie API Detection
     * Finds deprecated endpoints still being called
     */
    async detectZombieApis() {
        console.log('\n🔍 Checking for zombie APIs...');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const deprecatedEndpoints = await prisma.apiEndpoint.findMany({
            where: { deprecated: true }
        });

        for (const endpoint of deprecatedEndpoints) {
            const recentHits = await prisma.apiHit.count({
                where: {
                    endpointId: endpoint.id,
                    timestamp: { gte: sevenDaysAgo }
                }
            });

            if (recentHits > 0) {
                await this.createRisk({
                    endpointId: endpoint.id,
                    riskType: 'ZOMBIE_API',
                    severity: 'MEDIUM',
                    explanation: `API ${endpoint.path} (${endpoint.method}) is marked as deprecated but still receiving ${recentHits} calls in the last 7 days. Update clients before removing this endpoint.`
                });
            }
        }
    }

    /**
     * Helper: Create risk record
     * Avoids duplicates by checking if risk already exists
     */
    async createRisk({ endpointId, riskType, severity, explanation }) {
        // Check if risk already exists
        const existing = await prisma.apiRisk.findFirst({
            where: { endpointId, riskType }
        });

        if (!existing) {
            await prisma.apiRisk.create({
                data: { endpointId, riskType, severity, explanation }
            });
            console.log(`  ⚠️  ${riskType}: endpoint ${endpointId}`);
        }
    }
}

module.exports = new AnalysisService();
