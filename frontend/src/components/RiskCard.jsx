// RiskCard Component
// Displays individual risk with color-coded severity

function RiskCard({ risk }) {
    const severityColors = {
        CRITICAL: '#dc2626',
        HIGH: '#ea580c',
        MEDIUM: '#f59e0b',
        LOW: '#10b981'
    };

    const severityIcons = {
        CRITICAL: '🔴',
        HIGH: '🟠',
        MEDIUM: '🟡',
        LOW: '🟢'
    };

    const riskTypeLabels = {
        DEAD_API: 'Dead API',
        UNSECURED_API: 'Unsecured API',
        UNSTABLE_API: 'Unstable API',
        LOW_USAGE_API: 'Low Usage',
        ZOMBIE_API: 'Zombie API'
    };

    return (
        <div
            className="risk-card"
            style={{ borderLeft: `4px solid ${severityColors[risk.severity]}` }}
        >
            <div className="risk-header">
                <span className="risk-type">
                    {severityIcons[risk.severity]} {riskTypeLabels[risk.riskType] || risk.riskType}
                </span>
                <span
                    className="risk-severity"
                    style={{ color: severityColors[risk.severity] }}
                >
                    {risk.severity}
                </span>
            </div>

            <div className="risk-endpoint">
                <code>{risk.endpoint.method} {risk.endpoint.path}</code>
            </div>

            <p className="risk-explanation">{risk.explanation}</p>

            <div className="risk-footer">
                <small>Detected: {new Date(risk.detectedAt).toLocaleDateString()}</small>
            </div>
        </div>
    );
}

export default RiskCard;
