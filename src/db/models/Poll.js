/**
 * Poll model for PartiVotes
 */
import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true }, // Wallet address
  options: { type: [optionSchema], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANKED_CHOICE']
  },
  maxSelections: { type: Number, default: 1 },
  status: { 
    type: String, 
    required: true,
    enum: ['ACTIVE', 'PENDING', 'ENDED', 'CANCELLED'],
    default: 'PENDING'
  },
  network: {
    type: String,
    required: true,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  },
  totalVotes: { type: Number, default: 0 }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for faster queries
pollSchema.index({ status: 1 });
pollSchema.index({ creator: 1 });
pollSchema.index({ network: 1 });

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
