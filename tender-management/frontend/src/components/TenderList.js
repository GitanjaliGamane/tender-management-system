// src/components/TenderList.js - Reusable tender listing with filters
import React, { useState, useEffect } from 'react';
import { getTenders } from '../utils/api';

const FIELDS = ['', 'Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

const TenderList = ({ onSelectTender, sidebarComponent: Sidebar }) => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ field: '', status: '' });
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'closed'

  useEffect(() => {
    // Read field from URL params if present
    const params = new URLSearchParams(window.location.search);
    const urlField = params.get('field');
    if (urlField) setFilter(f => ({ ...f, field: urlField }));
  }, []);

  useEffect(() => {
    loadTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, activeTab]);

  const loadTenders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.field) params.field = filter.field;
      params.status = activeTab; // active or closed
      const data = await getTenders(params);
      if (Array.isArray(data)) setTenders(data);
    } catch (err) {
      console.error('Failed to load tenders');
    }
    setLoading(false);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
  const formatAmount = (a) => `₹${Number(a).toLocaleString('en-IN')}`;

  return (
    <div>
      {/* Filters */}
      <div className="filter-bar">
        <select
          value={filter.field}
          onChange={(e) => setFilter({ ...filter, field: e.target.value })}
        >
          <option value="">All Categories</option>
          {FIELDS.filter(Boolean).map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setFilter({ field: '', status: '' })}
        >
          Clear Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          ✅ Active Tenders
        </button>
        <button
          className={`tab-btn ${activeTab === 'closed' ? 'active' : ''}`}
          onClick={() => setActiveTab('closed')}
        >
          🔒 Closed Tenders
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          🏆 Completed
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><p>⏳ Loading tenders...</p></div>
      ) : tenders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No {activeTab} tenders found{filter.field ? ` in ${filter.field}` : ''}.</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <h3>
              {activeTab === 'active' ? '✅ Active' : activeTab === 'closed' ? '🔒 Closed' : '🏆 Completed'} Tenders
              {filter.field ? ` — ${filter.field}` : ''}
            </h3>
            <span style={{ fontSize: 13, color: '#5a6a7a' }}>{tenders.length} tenders</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t) => (
                <tr key={t._id}>
                  <td style={{ maxWidth: 220, fontWeight: 500 }}>{t.title}</td>
                  <td>
                    <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                      {t.field}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#2e7d32' }}>{formatAmount(t.amount)}</td>
                  <td>{formatDate(t.endDate)}</td>
                  <td>
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onSelectTender(t)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenderList;
