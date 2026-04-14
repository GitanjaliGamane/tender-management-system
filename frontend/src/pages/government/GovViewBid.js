// src/pages/government/GovViewBid.js
import React from 'react';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import BidList from '../../components/BidList';

const GovViewBid = () => {
  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <GovernmentSidebar />
        <main className="main-content">
          <h1 className="page-title">📊 View Bids</h1>
          <BidList />
        </main>
      </div>
    </>
  );
};

export default GovViewBid;
