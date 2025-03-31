/**
 * Vote model for PartiVotes
 */
import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll',
    required: true 
  },
  voter: { type: String }, // Wallet address (may be null for private votes)
  option: { type: String }, // For single choice votes
  options: { type: [String] }, // For multiple/ranked choice votes
  timestamp: { type: Date, required: true, default: Date.now },
  txId: { type: String }, // Transaction ID on blockchain
  verificationHash: { type: String }, // For private votes
  type: { 
    type: String, 
    required: true,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  network: {
    type: String,
    required: true,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  }
});

// Add indexes for faster queries
voteSchema.index({ pollId: 1 });
voteSchema.index({ voter: 1 });
voteSchema.index({ type: 1 });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
