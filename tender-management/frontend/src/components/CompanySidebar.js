// src/components/CompanySidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CompanySidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>🏢 TMS</h2>
        <p>Company Portal</p>
      </div>

      <div className="sidebar-user">
        <strong>{user?.name || 'Company'}</strong>
        <span>{user?.email}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/company/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">🏠</span> Dashboard
        </NavLink>
        <NavLink to="/company/view-tender" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">📋</span> View Tender
        </NavLink>
        <NavLink to="/company/view-bid" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">📊</span> View Bids
        </NavLink>
        <NavLink to="/company/submit-bid" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">📝</span> Submit Bid
        </NavLink>
        <button onClick={handleLogout}>
          <span className="nav-icon">🚪</span> Logout
        </button>
      </nav>
    </div>
  );
};

export default CompanySidebar;
