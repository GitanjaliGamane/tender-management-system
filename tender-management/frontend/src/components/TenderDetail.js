// src/components/TenderDetail.js - Full tender details view
import React from 'react';

const TenderDetail = ({ tender, onBack, extraActions }) => {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';
  const formatAmount = (a) => `₹${Number(a).toLocaleString('en-IN')}`;

  if (!tender) return null;

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        ← Back to Tender List
      </button>

      <div className="detail-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0', marginBottom: 10, display: 'inline-block' }}>
              {tender.field}
            </span>
            <h2>{tender.title}</h2>
          </div>
          <span className={`badge badge-${tender.status}`} style={{ fontSize: 13, padding: '6px 14px' }}>
            {tender.status?.toUpperCase()}
          </span>
        </div>

        <div className="detail-grid" style={{ marginTop: 20 }}>
          <div className="detail-item">
            <label>Tender Amount</label>
            <p style={{ color: '#2e7d32', fontFamily: 'Crimson Pro, serif', fontSize: 22 }}>
              {formatAmount(tender.amount)}
            </p>
          </div>
          <div className="detail-item">
            <label>Category</label>
            <p>{tender.field}</p>
          </div>
          <div className="detail-item">
            <label>Start Date</label>
            <p>{formatDate(tender.startDate)}</p>
          </div>
          <div className="detail-item">
            <label>Bid Deadline</label>
            <p style={{ color: tender.status === 'active' ? '#f57f17' : '#c62828' }}>
              {formatDate(tender.endDate)}
            </p>
          </div>
          <div className="detail-item">
            <label>Winner Announcement</label>
            <p>{formatDate(tender.winningDate)}</p>
          </div>
          <div className="detail-item">
            <label>Tender ID</label>
            <p style={{ fontSize: 12, color: '#5a6a7a', fontFamily: 'monospace' }}>{tender._id}</p>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#5a6a7a' }}>
            Description
          </label>
          <p style={{ marginTop: 6, lineHeight: 1.7, color: '#2a2a3e' }}>{tender.description}</p>
        </div>

        {tender.winnerCompanyName && (
          <div className="winner-banner" style={{ marginTop: 24 }}>
            <span className="trophy">🏆</span>
            <div>
              <h4>Winner Selected</h4>
              <p>{tender.winnerCompanyName}</p>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>ID: {tender.winnerCompanyId}</div>
            </div>
          </div>
        )}

        {/* Extra actions passed from parent (e.g. submit bid button) */}
        {extraActions && <div style={{ marginTop: 24 }}>{extraActions}</div>}
      </div>
    </div>
  );
};

export default TenderDetail;
