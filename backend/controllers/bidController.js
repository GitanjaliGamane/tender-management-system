// controllers/bidController.js - Handles all bid operations
const Bid = require('../models/Bid');
const Tender = require('../models/Tender');

// @desc    Submit a bid (Company only)
// @route   POST /api/bids
// @access  Company (JWT protected)
const submitBid = async (req, res) => {
  const { tenderId, bidAmount, idea, description } = req.body;

  if (!tenderId || !bidAmount || !idea || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if tender exists and is active
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    // Check if tender is still active
    if (tender.status !== 'active') {
      return res.status(400).json({ message: 'This tender is closed. Bids are no longer accepted.' });
    }

    // Check if current date is within tender period
    const now = new Date();
    if (now > new Date(tender.endDate)) {
      // Update tender status to closed
      await Tender.findByIdAndUpdate(tenderId, { status: 'closed' });
      return res.status(400).json({ message: 'Tender has expired. Bids are no longer accepted.' });
    }

    // Check if company already submitted a bid for this tender
    const existingBid = await Bid.findOne({ tenderId, companyId: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this tender' });
    }

    const bid = await Bid.create({
      tenderId,
      companyId: req.user._id,
      companyName: req.user.name,
      bidAmount,
      idea,
      description,
    });

    res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all bids for a tender
// @route   GET /api/bids/tender/:tenderId
// @access  Public
const getBidsByTender = async (req, res) => {
  try {
    const bids = await Bid.find({ tenderId: req.params.tenderId }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get bids submitted by logged-in company
// @route   GET /api/bids/my-bids
// @access  Company (JWT protected)
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ companyId: req.user._id })
      .populate('tenderId', 'title field status amount')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { submitBid, getBidsByTender, getMyBids };
