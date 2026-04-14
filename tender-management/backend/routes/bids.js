// routes/bids.js - Bid routes
const express = require('express');
const router = express.Router();
const { submitBid, getBidsByTender, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

// Submit a bid (JWT protected - company only)
router.post('/', protect, submitBid);

// Get my bids (JWT protected - company only)
router.get('/my-bids', protect, getMyBids);

// Get all bids for a specific tender
router.get('/tender/:tenderId', getBidsByTender);

module.exports = router;
