// Dashboard Component
// Main container for the GhostAPI dashboard

import { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import StatsOverview from './StatsOverview';
import RiskCard from './RiskCard';

function Dashboard() {
    const [overview, setOverview] = useState(null);
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [overviewRes, risksRes] = await Promise.all([
                analyticsApi.getOverview(),
                analyticsApi.getAllRisks()
            ]);

            setOverview(overviewRes.data);
            setRisks(risksRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Failed to load dashboard data. Make sure the backend is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard loading">
                <div className="spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard error">
                <h2>⚠️ Error</h2>
                <p>{error}</p>
                <button onClick={loadData} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>🧟 GhostAPI Dashboard</h1>
                <p className="subtitle">Backend API Observability & Risk Detection</p>
                <button onClick={loadData} className="refresh-button">🔄 Refresh</button>
            </header>

            <StatsOverview overview={overview} />

            <section className="risks-section">
                <h2>Detected Risks</h2>
                {risks.length === 0 ? (
                    <div className="no-risks">
                        <p>✅ No risks detected! Your APIs are healthy.</p>
                        <small>Run the analysis engine to detect risks: <code>node scripts/run-analysis.js</code></small>
                    </div>
                ) : (
                    <div className="risks-grid">
                        {risks.map(risk => (
                            <RiskCard key={risk.id} risk={risk} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
