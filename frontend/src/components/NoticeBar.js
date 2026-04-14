// src/components/NoticeBar.js - Scrolling notice bar showing active tenders
import React, { useEffect, useState } from 'react';
import { getNoticeTenders } from '../utils/api';

const NoticeBar = () => {
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const data = await getNoticeTenders();
        if (Array.isArray(data)) setTenders(data);
      } catch (err) {
        console.error('Failed to fetch notice tenders');
      }
    };

    fetchTenders();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTenders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (tenders.length === 0) return null;

  return (
    <div className="notice-bar">
      <span className="notice-label">📢 New Tenders</span>
      <marquee behavior="scroll" direction="left" scrollamount="4">
        {tenders.map((t, i) => (
          <span key={t._id}>
            🔔 {t.title} — [{t.field}] — ₹{Number(t.amount).toLocaleString('en-IN')}
          </span>
        ))}
      </marquee>
    </div>
  );
};

export default NoticeBar;
