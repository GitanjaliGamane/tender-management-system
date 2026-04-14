// src/pages/company/CompanyViewTender.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeBar from '../../components/NoticeBar';
import CompanySidebar from '../../components/CompanySidebar';
import TenderList from '../../components/TenderList';
import TenderDetail from '../../components/TenderDetail';

const CompanyViewTender = () => {
  const [selectedTender, setSelectedTender] = useState(null);
  const navigate = useNavigate();

  const handleBidClick = (tender) => {
    // Navigate to submit bid with tender pre-selected
    navigate('/company/submit-bid', { state: { tender } });
  };

  const extraActions = selectedTender?.status === 'active' ? (
    <button
      className="btn btn-accent"
      onClick={() => handleBidClick(selectedTender)}
    >
      📝 Submit Bid for this Tender
    </button>
  ) : null;

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <CompanySidebar />
        <main className="main-content">
          {selectedTender ? (
            <>
              <h1 className="page-title">📋 Tender Details</h1>
              <TenderDetail
                tender={selectedTender}
                onBack={() => setSelectedTender(null)}
                extraActions={extraActions}
              />
            </>
          ) : (
            <>
              <h1 className="page-title">📋 View Tenders</h1>
              <TenderList onSelectTender={setSelectedTender} />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default CompanyViewTender;
