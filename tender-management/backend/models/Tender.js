// models/Tender.js - Tender schema
const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    field: {
      type: String,
      required: [true, 'Field/Category is required'],
      enum: ['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education', 'Transport'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    winningDate: {
      type: Date,
      required: [true, 'Winning date is required'],
    },
    // Status: active, closed, completed
    status: {
      type: String,
      enum: ['active', 'closed', 'completed'],
      default: 'active',
    },
    winnerCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    winnerCompanyName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tender', tenderSchema);
