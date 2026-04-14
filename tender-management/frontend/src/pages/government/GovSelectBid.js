// src/pages/government/GovSelectBid.js - Select winner for a tender
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

  const handleSelectWinner = async (tender) => {
    if (!companyId.trim()) {
      setMessage('Please enter a Company ID.');
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
    if (tender.status === 'completed') {
      return (
        <div className="winner-banner" style={{ marginTop: 20 }}>
          <span className="trophy">🏆</span>
          <div>
            <h4>Winner Already Selected</h4>
            <p>{tender.winnerCompanyName}</p>
            <div style={{ fontSize: 12, opacity: 0.8 }}>ID: {tender.winnerCompanyId}</div>
          </div>
        </div>
      );
    }

    if (bids.length === 0) return null;

    return (
      <div className="winner-form">
        <h4>🏆 Select Winner</h4>
        <p style={{ fontSize: 13, color: '#5a6a7a', marginBottom: 16 }}>
          Enter the Company ID from the bids above to declare them the winner.
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
          </div>
          <BidList
            selectedTender={selectedTender}
            onTenderSelect={setSelectedTender}
            showWinnerForm={winnerFormRenderer}
          />
        </main>
      </div>
    </>
  );
};

export default GovSelectBid;
