// Run Analysis Script
// Executes the analysis engine to detect API risks

const analysisService = require('../backend/src/services/analysis.service');

async function main() {
    try {
        console.log('🚀 GhostAPI Analysis Engine');
        console.log('============================\n');

        await analysisService.runAllAnalyses();

        console.log('\n✅ Analysis completed successfully!');
        console.log('💡 Check Prisma Studio to see detected risks');

        process.exit(0);
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(1);
    }
}

main();
