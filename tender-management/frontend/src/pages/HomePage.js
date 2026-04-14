// src/pages/HomePage.js - Landing page with two login buttons
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (role === 'government') navigate('/government/dashboard');
    else if (role === 'company') navigate('/company/dashboard');
  }, [role, navigate]);

  return (
    <div className="home-page">
      <div className="home-logo">⚖️ Tender Management System</div>
      <p className="home-subtitle">Government of India — e-Procurement Portal</p>

      <div style={{ marginBottom: 40, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
        Transparent • Efficient • Digital
      </div>

      <div className="home-buttons">
        <button
          className="home-btn home-btn-govt"
          onClick={() => navigate('/government-login')}
        >
          🏛️ Government Login
          <small>Admin / Officials Only</small>
        </button>

        <button
          className="home-btn home-btn-company"
          onClick={() => navigate('/company-login')}
        >
          🏢 Company Login / Register
          <small>Bidders & Contractors</small>
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: 24, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
        © 2024 Tender Management System. All rights reserved.
      </div>
    </div>
  );
};

export default HomePage;
