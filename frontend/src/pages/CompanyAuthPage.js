// src/pages/CompanyAuthPage.js - Company Login and Register
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginCompany, registerCompany } from '../utils/api';

const CompanyAuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let data;

      if (mode === 'login') {
        data = await loginCompany({ email: formData.email, password: formData.password });
      } else {
        if (!formData.name) {
          setError('Company name is required');
          setLoading(false);
          return;
        }
        data = await registerCompany(formData);
      }

      if (data.token) {
        login(data.user, 'company', data.token);
        navigate('/company/dashboard');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }

    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">🏢 Company</span>
          <h2>{mode === 'login' ? 'Company Login' : 'Register Company'}</h2>
          <p>{mode === 'login' ? 'Welcome back! Login to your account.' : 'Create a new company account.'}</p>
        </div>

        {/* Mode tabs */}
        <div className="tabs" style={{ margin: '0 auto 24px', display: 'flex' }}>
          <button
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. ABC Constructions Pvt Ltd"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@example.com"
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
              placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading
              ? '⏳ Please wait...'
              : mode === 'login'
              ? '🔑 Login'
              : '✅ Register Company'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuthPage;
