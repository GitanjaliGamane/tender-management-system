// src/pages/government/GovSelectBid.js - Select winner for a tender (only one allowed)
import React, { useState } from 'react';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import BidList from '../../components/BidList';
import { selectWinner } from '../../utils/api';

const GovSelectBid = () => {
  const [companyId, setCompanyId] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  // Track which tenders have had a winner selected this session
  const [winnerDeclared, setWinnerDeclared] = useState({});

  const handleSelectWinner = async (tender) => {
    if (!companyId.trim()) {
      setMessage('Please enter a Company ID.');
      setMsgType('error');
      return;
    }

    // Block if winner already declared for this tender
    if (tender.status === 'completed' || winnerDeclared[tender._id]) {
      setMessage('⚠️ A winner has already been selected for this tender. Only one winner is allowed.');
      setMsgType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await selectWinner(tender._id, companyId.trim());
      if (data.tender) {
        setMessage(`🏆 Winner selected successfully! Company: ${data.tender.winnerCompanyName}`);
        setMsgType('success');
        setCompanyId('');
        // Mark this tender as having a winner declared
        setWinnerDeclared((prev) => ({ ...prev, [tender._id]: true }));
        // Update the selected tender state to reflect completed status
        setSelectedTender((prev) =>
          prev ? { ...prev, status: 'completed', winnerCompanyName: data.tender.winnerCompanyName, winnerCompanyId: data.tender.winnerCompanyId } : prev
        );
      } else {
        setMessage(data.message || 'Failed to select winner');
        setMsgType('error');
      }
    } catch (err) {
      setMessage('Connection error.');
      setMsgType('error');
    }

    setLoading(false);
  };

  // Render winner form below bids
  const winnerFormRenderer = (tender, bids) => {
    const alreadyDeclared = tender.status === 'completed' || winnerDeclared[tender._id];

    // If winner already declared, show the winner banner only
    if (alreadyDeclared) {
      return (
        <div className="winner-banner" style={{ marginTop: 20 }}>
          <span className="trophy">🏆</span>
          <div>
            <h4>Winner Already Selected</h4>
            <p>{tender.winnerCompanyName}</p>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Company ID: {tender.winnerCompanyId}</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: '#c62828',
                background: '#ffebee',
                padding: '6px 10px',
                borderRadius: 4,
                display: 'inline-block',
              }}
            >
              ⚠️ Winner already declared. No further changes allowed.
            </div>
          </div>
        </div>
      );
    }

    if (bids.length === 0) return null;

    return (
      <div className="winner-form">
        <h4>🏆 Select Winner</h4>
        <p style={{ fontSize: 13, color: '#5a6a7a', marginBottom: 8 }}>
          Enter the Company ID from the bids above to declare them the winner.
        </p>
        <p style={{ fontSize: 12, color: '#e65100', marginBottom: 16, fontWeight: 500 }}>
          ⚠️ Note: Once a winner is selected, it cannot be changed.
        </p>

        {message && (
          <div className={`alert alert-${msgType === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 16 }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Company ID *</label>
            <input
              type="text"
              value={companyId}
              onChange={(e) => { setCompanyId(e.target.value); setMessage(''); }}
              placeholder="Paste Company ID from bid above"
            />
          </div>
          <button
            className="btn btn-accent"
            onClick={() => handleSelectWinner(tender)}
            disabled={loading}
            style={{ height: 42 }}
          >
            {loading ? '⏳ Selecting...' : '🏆 Select Winner'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <GovernmentSidebar />
        <main className="main-content">
          <h1 className="page-title">🏆 Select Bid Winner</h1>
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            💡 Select a tender, review all bids, then enter the Company ID at the bottom to declare a winner.
            Only <strong>one winner</strong> can be selected per tender.
          </div>
          <BidList
            selectedTender={selectedTender}
            onTenderSelect={(t) => {
              setSelectedTender(t);
              setMessage('');
              setCompanyId('');
            }}
            showWinnerForm={winnerFormRenderer}
          />
        </main>
      </div>
    </>
  );
};

export default GovSelectBid;