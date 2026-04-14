// src/pages/company/CompanyDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeBar from '../../components/NoticeBar';
import CompanySidebar from '../../components/CompanySidebar';
import DashboardContent from '../../components/DashboardContent';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const handleFieldClick = (field) => {
    navigate(`/company/view-tender?field=${field}`);
  };

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <CompanySidebar />
        <main className="main-content">
          <DashboardContent onFieldClick={handleFieldClick} />
        </main>
      </div>
    </>
  );
};

export default CompanyDashboard;
