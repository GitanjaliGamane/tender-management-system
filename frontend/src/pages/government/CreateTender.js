// src/pages/government/CreateTender.js
import React, { useState } from 'react';
import NoticeBar from '../../components/NoticeBar';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import { createTender } from '../../utils/api';

const FIELDS = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];

// Helper: format today as YYYY-MM-DD for date inputs
const todayStr = () => new Date().toISOString().split('T')[0];

// Helper: format tomorrow as YYYY-MM-DD
const tomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const CreateTender = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    field: '',
    startDate: todayStr(),
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

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const winningDate = new Date(formData.winningDate);

    // Validation 1: Start date must not be before today
    if (startDate < today) {
      setError('Start date cannot be a past date. Please select today or a future date.');
      setLoading(false);
      return;
    }

    // Validation 2: End date must be in the future (strictly after today)
    if (endDate <= today) {
      setError('End date must be a future date (at least tomorrow).');
      setLoading(false);
      return;
    }

    // Validation 3: End date must be after start date
    if (endDate <= startDate) {
      setError('End date must be after the start date.');
      setLoading(false);
      return;
    }

    // Validation 4: Winning date must be after end date
    if (winningDate <= endDate) {
      setError('Winner announcement date must be after the end date.');
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
          startDate: todayStr(),
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
                  <label>Start Date * <span style={{ fontSize: 11, color: '#5a6a7a' }}>(today or future)</span></label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={todayStr()} // prevents selecting past dates from the calendar
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date (Bid Deadline) * <span style={{ fontSize: 11, color: '#5a6a7a' }}>(future date)</span></label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={tomorrowStr()} // end date must be at least tomorrow
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Winner Announcement Date * <span style={{ fontSize: 11, color: '#5a6a7a' }}>(after end date)</span></label>
                <input
                  type="date"
                  name="winningDate"
                  value={formData.winningDate}
                  onChange={handleChange}
                  // min is dynamically set: if endDate chosen, winning must be after it
                  min={formData.endDate ? (() => {
                    const d = new Date(formData.endDate);
                    d.setDate(d.getDate() + 1);
                    return d.toISOString().split('T')[0];
                  })() : tomorrowStr()}
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