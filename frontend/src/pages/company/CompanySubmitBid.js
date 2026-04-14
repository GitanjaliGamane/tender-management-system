// src/pages/company/CompanySubmitBid.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NoticeBar from '../../components/NoticeBar';
import CompanySidebar from '../../components/CompanySidebar';
import { getTenders, submitBid } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const FIELDS = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

const CompanySubmitBid = () => {
  const { user, token } = useAuth();
  const location = useLocation();

  const [activeTenders, setActiveTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(location.state?.tender || null);
  const [fieldFilter, setFieldFilter] = useState('');
  const [loadingTenders, setLoadingTenders] = useState(false);

  const [formData, setFormData] = useState({
    bidAmount: '',
    idea: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadActiveTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldFilter]);

  const loadActiveTenders = async () => {
    setLoadingTenders(true);
    try {
      const params = { status: 'active' };
      if (fieldFilter) params.field = fieldFilter;
      const data = await getTenders(params);
      if (Array.isArray(data)) setActiveTenders(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingTenders(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTender) {
      setError('Please select a tender first.');
      return;
    }
    if (!formData.bidAmount || !formData.idea || !formData.description) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await submitBid(
        {
          tenderId: selectedTender._id,
          bidAmount: Number(formData.bidAmount),
          idea: formData.idea,
          description: formData.description,
        },
        token
      );

      if (data.bid) {
        setSuccess('✅ Bid submitted successfully! Your bid is now visible to the government.');
        setFormData({ bidAmount: '', idea: '', description: '' });
        setSelectedTender(null);
      } else {
        setError(data.message || 'Failed to submit bid.');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }

    setSubmitting(false);
  };

  const formatAmount = (a) => `₹${Number(a).toLocaleString('en-IN')}`;

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <CompanySidebar />
        <main className="main-content">
          <h1 className="page-title">📝 Submit Bid</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
            {/* Left: Select Tender */}
            <div>
              <h3 style={{ fontSize: 17, color: '#1a3a6b', marginBottom: 14 }}>
                Step 1: Select an Active Tender
              </h3>

              <div className="filter-bar">
                <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {loadingTenders ? (
                <div className="loading-state"><p>⏳ Loading...</p></div>
              ) : activeTenders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>No active tenders available.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activeTenders.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => { setSelectedTender(t); setError(''); setSuccess(''); }}
                      style={{
                        background: selectedTender?._id === t._id ? '#e8f0fe' : 'white',
                        border: `2px solid ${selectedTender?._id === t._id ? '#1a3a6b' : '#dce3ed'}`,
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#5a6a7a', display: 'flex', gap: 12 }}>
                        <span>{t.field}</span>
                        <span style={{ color: '#2e7d32', fontWeight: 600 }}>{formatAmount(t.amount)}</span>
                        <span>Ends: {new Date(t.endDate).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Bid Form */}
            <div>
              <h3 style={{ fontSize: 17, color: '#1a3a6b', marginBottom: 14 }}>
                Step 2: Fill Bid Details
              </h3>

              {selectedTender ? (
                <div style={{
                  background: '#e8f5e9',
                  border: '1.5px solid #c8e6c9',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16,
                  fontSize: 13
                }}>
                  <strong>Selected:</strong> {selectedTender.title}<br />
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>{formatAmount(selectedTender.amount)}</span>
                  <span style={{ color: '#5a6a7a', marginLeft: 10 }}>• {selectedTender.field}</span>
                </div>
              ) : (
                <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                  ← Please select a tender from the left panel.
                </div>
              )}

              <div className="form-card" style={{ padding: 24 }}>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      style={{ background: '#f4f6f9', color: '#5a6a7a' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Bid Amount (₹) *</label>
                    <input
                      type="number"
                      name="bidAmount"
                      value={formData.bidAmount}
                      onChange={handleChange}
                      placeholder="Enter your bid amount"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Idea / Approach *</label>
                    <input
                      type="text"
                      name="idea"
                      value={formData.idea}
                      onChange={handleChange}
                      placeholder="Briefly describe your approach"
                    />
                  </div>

                  <div className="form-group">
                    <label>Detailed Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide detailed information about your proposal, qualifications, timeline, etc."
                      rows={5}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={submitting || !selectedTender}
                    style={{ marginTop: 8 }}
                  >
                    {submitting ? '⏳ Submitting...' : '📤 Submit Bid'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CompanySubmitBid;
