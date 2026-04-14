// routes/tenders.js - Tender routes
const express = require('express');
const router = express.Router();
const {
  createTender,
  getAllTenders,
  getNoticeTenders,
  getTenderById,
  getTenderStats,
  selectWinner,
} = require('../controllers/tenderController');

// Get tenders for notice bar (active only)
router.get('/notice', getNoticeTenders);

// Get dashboard stats
router.get('/stats', getTenderStats);

// Get all tenders (with optional filters ?field=IT&status=active)
router.get('/', getAllTenders);

// Get single tender
router.get('/:id', getTenderById);

// Create tender (Government - no JWT needed, frontend controls access)
router.post('/', createTender);

// Select winner for a tender
router.put('/:id/select-winner', selectWinner);

module.exports = router;
