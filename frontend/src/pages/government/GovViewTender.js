// src/pages/government/GovViewTender.js
import React, { useState } from 'react';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import TenderList from '../../components/TenderList';
import TenderDetail from '../../components/TenderDetail';

const GovViewTender = () => {
  const [selectedTender, setSelectedTender] = useState(null);

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <GovernmentSidebar />
        <main className="main-content">
          {selectedTender ? (
            <>
              <h1 className="page-title">📋 Tender Details</h1>
              <TenderDetail
                tender={selectedTender}
                onBack={() => setSelectedTender(null)}
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

export default GovViewTender;
