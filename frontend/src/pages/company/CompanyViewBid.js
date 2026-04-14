// src/pages/company/CompanyViewBid.js - Company sees only their own bids
import React, { useState, useEffect } from 'react';
import NoticeBar from '../../components/NoticeBar';
import CompanySidebar from '../../components/CompanySidebar';
import { getMyBids } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CompanyViewBid = () => {
  const { token } = useAuth();
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMyBids = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyBids(token);
      if (Array.isArray(data)) {
        setMyBids(data);
      } else {
        setError(data.message || 'Failed to load bids.');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }
    setLoading(false);
  };

  const formatAmount = (a) => `₹${Number(a).toLocaleString('en-IN')}`;

  const getStatusBadgeStyle = (status) => {
    if (status === 'active') return { background: '#e8f5e9', color: '#2e7d32' };
    if (status === 'closed') return { background: '#fff3e0', color: '#e65100' };
    if (status === 'completed') return { background: '#e3f2fd', color: '#1565c0' };
    return { background: '#f4f6f9', color: '#5a6a7a' };
  };

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <CompanySidebar />
        <main className="main-content">
          <h1 className="page-title">📊 My Bids</h1>
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            💡 Showing only the bids submitted by your company.
          </div>

          {loading ? (
            <div className="loading-state"><p>⏳ Loading your bids...</p></div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : myBids.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>You have not submitted any bids yet.</p>
            </div>
          ) : (
            <div className="bids-list">
              {myBids.map((bid) => {
                const tender = bid.tenderId; // populated from backend
                return (
                  <div key={bid._id} className="bid-card">
                    <div className="bid-card-header">
                      <div>
                        <div className="bid-company" style={{ fontSize: 16, fontWeight: 700 }}>
                          📋 {tender?.title || 'Tender Deleted'}
                        </div>
                        <div style={{ fontSize: 12, color: '#5a6a7a', marginTop: 4 }}>
                          Category: <strong>{tender?.field || '—'}</strong>
                          &nbsp;|&nbsp;
                          Tender Status:{' '}
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              ...getStatusBadgeStyle(tender?.status),
                            }}
                          >
                            {tender?.status || '—'}
                          </span>
                        </div>
                      </div>
                      <div className="bid-amount">{formatAmount(bid.bidAmount)}</div>
                    </div>

                    <div className="bid-idea">💡 Idea: {bid.idea}</div>
                    <div className="bid-desc">{bid.description}</div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: '1px solid #e8edf3',
                      }}
                    >
                      <div style={{ fontSize: 11, color: '#9aabbd' }}>
                        Bid ID: {bid._id}
                      </div>
                      <div style={{ fontSize: 11, color: '#9aabbd' }}>
                        Submitted: {new Date(bid.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Show winner info if tender is completed */}
                    {tender?.status === 'completed' && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: '8px 12px',
                          background: '#e3f2fd',
                          borderRadius: 6,
                          fontSize: 13,
                          color: '#1565c0',
                          fontWeight: 500,
                        }}
                      >
                        🏆 Winner announced for this tender.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CompanyViewBid;