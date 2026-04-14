// src/pages/GovernmentLoginPage.js - Hardcoded government login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { governmentLogin } from '../utils/api';

const GovernmentLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await governmentLogin(formData);

      if (data.role === 'government') {
        login(data.user, 'government', null); // No JWT for government
        navigate('/government/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">🏛️ Government</span>
          <h2>Official Login</h2>
          <p>Restricted access for government administrators</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔐 Login as Government'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => navigate('/')}>← Back to Home</button>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 20,
          padding: '10px 14px',
          background: '#f4f6f9',
          borderRadius: 8,
          fontSize: 12,
          color: '#5a6a7a',
          textAlign: 'center'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: admin@gmail.com | Password: admin123
        </div>
      </div>
    </div>
  );
};

export default GovernmentLoginPage;
