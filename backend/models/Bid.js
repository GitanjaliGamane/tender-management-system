// models/Bid.js - Bid schema
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    tenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
    },
    idea: {
      type: String,
      required: [true, 'Idea is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);
