// src/components/DashboardContent.js - Reusable dashboard with 6 field cards
import React, { useState, useEffect } from 'react';
import { getTenderStats } from '../utils/api';

const FIELD_ICONS = {
  Construction: '🏗️',
  IT: '💻',
  Agriculture: '🌾',
  Healthcare: '🏥',
  Education: '📚',
  Transport: '🚌',
};

const FIELDS = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

const DashboardContent = ({ onFieldClick }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getTenderStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats');
      }
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div style={{ fontSize: 40 }}>⏳</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="page-title">📊 Dashboard</h1>

      <div style={{ marginBottom: 20, color: '#5a6a7a', fontSize: 14 }}>
        Click on any category card to view tenders in that field.
      </div>

      <div className="cards-grid">
        {FIELDS.map((field) => {
          const s = stats[field] || { active: 0, closed: 0, completed: 0 };
          return (
            <div
              key={field}
              className="field-card"
              onClick={() => onFieldClick && onFieldClick(field)}
              title={`View ${field} tenders`}
            >
              <div className="card-icon">{FIELD_ICONS[field]}</div>
              <h3>{field}</h3>
              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-active">● {s.active}</span> Active
                </div>
                <div className="stat-item">
                  <span className="stat-closed">● {s.closed}</span> Closed
                </div>
                <div className="stat-item">
                  <span className="stat-completed">● {s.completed}</span> Completed
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary totals */}
      <div style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        marginTop: 8
      }}>
        {['active', 'closed', 'completed'].map((status) => {
          const total = FIELDS.reduce((sum, f) => sum + (stats[f]?.[status] || 0), 0);
          const colors = { active: '#2e7d32', closed: '#c62828', completed: '#f57f17' };
          const labels = { active: '✅ Total Active', closed: '🔒 Total Closed', completed: '🏆 Total Completed' };
          return (
            <div key={status} style={{
              background: 'white',
              border: `2px solid ${colors[status]}22`,
              borderLeft: `4px solid ${colors[status]}`,
              borderRadius: 10,
              padding: '14px 24px',
              minWidth: 160,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: 12, color: colors[status], fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                {labels[status]}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Crimson Pro, serif', color: '#1a1a2e' }}>
                {total}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DashboardContent;
