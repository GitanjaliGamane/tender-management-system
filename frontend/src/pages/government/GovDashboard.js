// src/pages/government/GovDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import DashboardContent from '../../components/DashboardContent';

const GovDashboard = () => {
  const navigate = useNavigate();

  const handleFieldClick = (field) => {
    navigate(`/government/view-tender?field=${field}`);
  };

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <GovernmentSidebar />
        <main className="main-content">
          <DashboardContent onFieldClick={handleFieldClick} />
        </main>
      </div>
    </>
  );
};

export default GovDashboard;
