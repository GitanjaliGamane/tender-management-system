// src/pages/company/CompanyViewBid.js - Company can see all bids on any tender
import React from 'react';
import NoticeBar from '../../components/NoticeBar';
import CompanySidebar from '../../components/CompanySidebar';
import BidList from '../../components/BidList';

const CompanyViewBid = () => {
  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <CompanySidebar />
        <main className="main-content">
          <h1 className="page-title">📊 View Bids</h1>
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            💡 Select a tender to see all submitted bids.
          </div>
          <BidList />
        </main>
      </div>
    </>
  );
};

export default CompanyViewBid;
