// src/pages/government/CreateTender.js
import React, { useState } from 'react';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import { createTender } from '../../utils/api';

const FIELDS = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

// Helper: format today as YYYY-MM-DD for date inputs
const today = () => new Date().toISOString().split('T')[0];

const CreateTender = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    field: '',
    startDate: today(),
    endDate: '',
    winningDate: '',
  });
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

    // Basic validation
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date.');
      setLoading(false);
      return;
    }
    if (new Date(formData.winningDate) <= new Date(formData.endDate)) {
      setError('Winning date must be after end date.');
      setLoading(false);
      return;
    }

    try {
      const data = await createTender(formData);
      if (data.tender) {
        setSuccess(`✅ Tender "${data.tender.title}" created successfully! It is now visible in the Notice Bar.`);
        setFormData({
          title: '',
          amount: '',
          description: '',
          field: '',
          startDate: today(),
          endDate: '',
          winningDate: '',
        });
      } else {
        setError(data.message || 'Failed to create tender');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }

    setLoading(false);
  };

  return (
    <>
      <NoticeBar />
      <div className="app-layout">
        <GovernmentSidebar />
        <main className="main-content">
          <h1 className="page-title">➕ Create New Tender</h1>

          <div className="form-card">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tender Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Construction of National Highway NH-48"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tender Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g. 5000000"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category / Field *</label>
                  <select name="field" value={formData.field} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {FIELDS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the scope of work, requirements, and any important details..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date (Bid Deadline) *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Winner Announcement Date *</label>
                <input
                  type="date"
                  name="winningDate"
                  value={formData.winningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? '⏳ Creating Tender...' : '📋 Create Tender'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreateTender;
