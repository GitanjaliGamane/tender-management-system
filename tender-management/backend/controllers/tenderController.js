// controllers/tenderController.js - Handles all tender operations
const Tender = require('../models/Tender');

// Helper: Update tender statuses based on current date
const updateTenderStatuses = async () => {
  const now = new Date();
  // Move active tenders past endDate to closed
  await Tender.updateMany(
    { status: 'active', endDate: { $lt: now } },
    { $set: { status: 'closed' } }
  );
};

// @desc    Create a new tender (Government only)
// @route   POST /api/tenders
// @access  Government
const createTender = async (req, res) => {
  const { title, amount, description, field, startDate, endDate, winningDate } = req.body;

  if (!title || !amount || !description || !field || !startDate || !endDate || !winningDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const tender = await Tender.create({
      title,
      amount,
      description,
      field,
      startDate,
      endDate,
      winningDate,
      status: new Date() > new Date(endDate) ? 'closed' : 'active',
    });

    res.status(201).json({ message: 'Tender created successfully', tender });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all tenders (with optional field filter)
// @route   GET /api/tenders
// @access  Public
const getAllTenders = async (req, res) => {
  try {
    await updateTenderStatuses();

    const { field, status } = req.query;
    let filter = {};

    if (field) filter.field = field;
    if (status) filter.status = status;

    const tenders = await Tender.find(filter).sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get active tenders for notice bar
// @route   GET /api/tenders/notice
// @access  Public
const getNoticeTenders = async (req, res) => {
  try {
    await updateTenderStatuses();
    const tenders = await Tender.find({ status: 'active' })
      .select('title field amount')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single tender by ID
// @route   GET /api/tenders/:id
// @access  Public
const getTenderById = async (req, res) => {
  try {
    await updateTenderStatuses();
    const tender = await Tender.findById(req.params.id);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });
    res.json(tender);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get dashboard stats (counts per field)
// @route   GET /api/tenders/stats
// @access  Public
const getTenderStats = async (req, res) => {
  try {
    await updateTenderStatuses();

    const fields = ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'];
    const stats = {};

    for (const field of fields) {
      const active = await Tender.countDocuments({ field, status: 'active' });
      const closed = await Tender.countDocuments({ field, status: 'closed' });
      const completed = await Tender.countDocuments({ field, status: 'completed' });
      stats[field] = { active, closed, completed };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Select winner for a tender (Government only)
// @route   PUT /api/tenders/:id/select-winner
// @access  Government
const selectWinner = async (req, res) => {
  const { companyId } = req.body;

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  try {
    const User = require('../models/User');
    const company = await User.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found with this ID' });
    }

    const tender = await Tender.findByIdAndUpdate(
      req.params.id,
      {
        winnerCompanyId: companyId,
        winnerCompanyName: company.name,
        status: 'completed',
      },
      { new: true }
    );

    if (!tender) return res.status(404).json({ message: 'Tender not found' });

    res.json({ message: 'Winner selected successfully', tender });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  createTender,
  getAllTenders,
  getNoticeTenders,
  getTenderById,
  getTenderStats,
  selectWinner,
};
