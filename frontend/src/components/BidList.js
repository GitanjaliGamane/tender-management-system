// src/components/BidList.js - Shows all bids for a selected tender
import React, { useState, useEffect } from 'react';
import { getTenders, getBidsByTender } from '../utils/api';

const FIELDS = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

const BidList = ({ onTenderSelect, selectedTender, showWinnerForm, extraBidActions }) => {
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('');
  const [loadingTenders, setLoadingTenders] = useState(false);
  const [loadingBids, setLoadingBids] = useState(false);
  const [internalSelected, setInternalSelected] = useState(selectedTender || null);

  const currentSelected = selectedTender !== undefined ? selectedTender : internalSelected;
  const setSelected = onTenderSelect || setInternalSelected;

  useEffect(() => {
    loadTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldFilter]);

  useEffect(() => {
    if (currentSelected) {
      loadBids(currentSelected._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelected]);

  const loadTenders = async () => {
    setLoadingTenders(true);
    try {
      const params = {};
      if (fieldFilter) params.field = fieldFilter;
      const data = await getTenders(params);
      if (Array.isArray(data)) setTenders(data);
    } catch (err) { console.error(err); }
    setLoadingTenders(false);
  };

  const loadBids = async (tenderId) => {
    setLoadingBids(true);
    try {
      const data = await getBidsByTender(tenderId);
      if (Array.isArray(data)) setBids(data);
    } catch (err) { console.error(err); }
    setLoadingBids(false);
  };

  const formatAmount = (a) => `₹${Number(a).toLocaleString('en-IN')}`;

  return (
    <div>
      {/* Step 1: Select a tender */}
      <div style={{ marginBottom: 24 }}>
        <div className="filter-bar">
          <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}>
            <option value="">All Categories</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {loadingTenders ? (
          <div className="loading-state"><p>⏳ Loading tenders...</p></div>
        ) : (
          <div className="table-card">
            <div className="table-header">
              <h3>Select a Tender to View Bids</h3>
              <span style={{ fontSize: 13, color: '#5a6a7a' }}>{tenders.length} tenders</span>
            </div>
            {tenders.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <p>No tenders found.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((t) => (
                    <tr key={t._id} style={currentSelected?._id === t._id ? { background: '#e8f0fe' } : {}}>
                      <td style={{ fontWeight: 500 }}>{t.title}</td>
                      <td><span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>{t.field}</span></td>
                      <td style={{ fontWeight: 600 }}>{formatAmount(t.amount)}</td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelected(t)}
                        >
                          View Bids
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Show bids for selected tender */}
      {currentSelected && (
        <div>
          <h3 style={{ fontSize: 20, color: '#1a3a6b', marginBottom: 8, fontFamily: 'Crimson Pro, serif' }}>
            📊 Bids for: <em>{currentSelected.title}</em>
          </h3>
          <div style={{ fontSize: 13, color: '#5a6a7a', marginBottom: 16 }}>
            Status: <span className={`badge badge-${currentSelected.status}`}>{currentSelected.status}</span>
            &nbsp;| Amount: <strong style={{ color: '#2e7d32' }}>{formatAmount(currentSelected.amount)}</strong>
          </div>

          {loadingBids ? (
            <div className="loading-state"><p>⏳ Loading bids...</p></div>
          ) : bids.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No bids submitted for this tender yet.</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#5a6a7a', marginBottom: 12 }}>
                {bids.length} bid{bids.length !== 1 ? 's' : ''} received
              </div>
              <div className="bids-list">
                {bids.map((bid) => (
                  <div key={bid._id} className="bid-card">
                    <div className="bid-card-header">
                      <div>
                        <div className="bid-company">🏢 {bid.companyName}</div>
                        <div className="bid-id">Company ID: {bid.companyId}</div>
                      </div>
                      <div className="bid-amount">{formatAmount(bid.bidAmount)}</div>
                    </div>
                    <div className="bid-idea">💡 Idea: {bid.idea}</div>
                    <div className="bid-desc">{bid.description}</div>
                    <div style={{ fontSize: 11, color: '#9aabbd', marginTop: 8 }}>
                      Submitted: {new Date(bid.createdAt).toLocaleString('en-IN')}
                    </div>
                    {/* Extra actions per bid (like a select button) */}
                    {extraBidActions && extraBidActions(bid, currentSelected)}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Winner form or other extra content */}
          {showWinnerForm && showWinnerForm(currentSelected, bids)}
        </div>
      )}
    </div>
  );
};

export default BidList;
