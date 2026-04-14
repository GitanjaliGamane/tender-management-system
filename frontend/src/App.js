// src/App.js - Main router for Tender Management System
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import GovernmentLoginPage from './pages/GovernmentLoginPage';
import CompanyAuthPage from './pages/CompanyAuthPage';

// Government pages
import GovDashboard from './pages/government/GovDashboard';
import CreateTender from './pages/government/CreateTender';
import GovViewTender from './pages/government/GovViewTender';
import GovViewBid from './pages/government/GovViewBid';
import GovSelectBid from './pages/government/GovSelectBid';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyViewTender from './pages/company/CompanyViewTender';
import CompanyViewBid from './pages/company/CompanyViewBid';
import CompanySubmitBid from './pages/company/CompanySubmitBid';

// Protected route wrapper — redirects to home if wrong role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: 18,
        color: '#1a3a6b',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        ⏳ Loading...
      </div>
    );
  }

  if (!role || role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/government-login" element={<GovernmentLoginPage />} />
        <Route path="/company-login" element={<CompanyAuthPage />} />

        {/* ── Government Routes ── */}
        <Route
          path="/government/dashboard"
          element={
            <ProtectedRoute requiredRole="government">
              <GovDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government/create-tender"
          element={
            <ProtectedRoute requiredRole="government">
              <CreateTender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government/view-tender"
          element={
            <ProtectedRoute requiredRole="government">
              <GovViewTender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government/view-bid"
          element={
            <ProtectedRoute requiredRole="government">
              <GovViewBid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government/select-bid"
          element={
            <ProtectedRoute requiredRole="government">
              <GovSelectBid />
            </ProtectedRoute>
          }
        />

        {/* ── Company Routes ── */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/view-tender"
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyViewTender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/view-bid"
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyViewBid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/submit-bid"
          element={
            <ProtectedRoute requiredRole="company">
              <CompanySubmitBid />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
