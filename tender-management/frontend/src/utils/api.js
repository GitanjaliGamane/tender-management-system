// src/utils/api.js - Centralized API calls
const BASE_URL = '/api';

// Helper to get auth headers
const getHeaders = (token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// AUTH APIs
export const registerCompany = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginCompany = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const governmentLogin = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/government-login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// TENDER APIs
export const createTender = async (data) => {
  const res = await fetch(`${BASE_URL}/tenders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTenders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/tenders${query ? '?' + query : ''}`);
  return res.json();
};

export const getNoticeTenders = async () => {
  const res = await fetch(`${BASE_URL}/tenders/notice`);
  return res.json();
};

export const getTenderById = async (id) => {
  const res = await fetch(`${BASE_URL}/tenders/${id}`);
  return res.json();
};

export const getTenderStats = async () => {
  const res = await fetch(`${BASE_URL}/tenders/stats`);
  return res.json();
};

export const selectWinner = async (tenderId, companyId) => {
  const res = await fetch(`${BASE_URL}/tenders/${tenderId}/select-winner`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ companyId }),
  });
  return res.json();
};

// BID APIs
export const submitBid = async (data, token) => {
  const res = await fetch(`${BASE_URL}/bids`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getBidsByTender = async (tenderId) => {
  const res = await fetch(`${BASE_URL}/bids/tender/${tenderId}`);
  return res.json();
};

export const getMyBids = async (token) => {
  const res = await fetch(`${BASE_URL}/bids/my-bids`, {
    headers: getHeaders(token),
  });
  return res.json();
};
