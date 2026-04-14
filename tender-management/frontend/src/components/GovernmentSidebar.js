// src/components/GovernmentSidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GovernmentSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>⚖️ TMS</h2>
        <p>Government Portal</p>
      </div>

      <div className="sidebar-user">
        <strong>{user?.name || 'Government Admin'}</strong>
        <span>{user?.email}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/government/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">🏠</span> Dashboard
        </NavLink>
        <NavLink to="/government/create-tender" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">➕</span> Create Tender
        </NavLink>
        <NavLink to="/government/view-tender" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">📋</span> View Tender
        </NavLink>
        <NavLink to="/government/view-bid" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">📊</span> View Bid
        </NavLink>
        <NavLink to="/government/select-bid" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <span className="nav-icon">🏆</span> Select Winner
        </NavLink>
        <button onClick={handleLogout}>
          <span className="nav-icon">🚪</span> Logout
        </button>
      </nav>
    </div>
  );
};

export default GovernmentSidebar;
