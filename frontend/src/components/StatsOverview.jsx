// StatsOverview Component
// Displays summary statistics cards

function StatsOverview({ overview }) {
    if (!overview) return null;

    const getCriticalCount = () => {
        const critical = overview.risksBySeverity?.find(r => r.severity === 'CRITICAL');
        return critical?._count || 0;
    };

    const getHighCount = () => {
        const high = overview.risksBySeverity?.find(r => r.severity === 'HIGH');
        return high?._count || 0;
    };

    return (
        <div className="stats-overview">
            <div className="stat-card">
                <h3>Total APIs</h3>
                <p className="stat-value">{overview.totalApis}</p>
                <span className="stat-label">Tracked Endpoints</span>
            </div>

            <div className="stat-card">
                <h3>Total Risks</h3>
                <p className="stat-value risk-count">{overview.totalRisks}</p>
                <span className="stat-label">Issues Detected</span>
            </div>

            <div className="stat-card critical">
                <h3>Critical Risks</h3>
                <p className="stat-value">{getCriticalCount()}</p>
                <span className="stat-label">Immediate Action Required</span>
            </div>

            <div className="stat-card high">
                <h3>High Priority</h3>
                <p className="stat-value">{getHighCount()}</p>
                <span className="stat-label">Needs Investigation</span>
            </div>
        </div>
    );
}

export default StatsOverview;
