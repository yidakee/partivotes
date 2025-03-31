const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(async () => {
  try {
    const db = mongoose.connection.db;
    const pollId = '67eae395538f7860a65b637a';
    
    console.log(`Updating vote counts for poll ${pollId}`);
    
    // Get all votes for this poll
    const votes = await db.collection('votes').find({
      pollId: new ObjectId(pollId)
    }).toArray();
    
    console.log(`Found ${votes.length} votes for poll`);
    
    // Count votes for each option
    const optionCounts = {};
    votes.forEach(vote => {
      const votedOptions = vote.options || (vote.option ? [vote.option] : []);
      
      votedOptions.forEach(option => {
        optionCounts[option] = (optionCounts[option] || 0) + 1;
      });
    });
    
    console.log('Vote counts by option:', optionCounts);
    
    // Get the poll
    const poll = await db.collection('polls').findOne({
      _id: new ObjectId(pollId)
    });
    
    if (!poll) {
      console.error(`Poll ${pollId} not found`);
      return;
    }
    
    console.log('Current poll options:', poll.options);
    
    // Update each option with its vote count
    const updatedOptions = poll.options.map(option => {
      return {
        ...option,
        votes: optionCounts[option.text] || 0
      };
    });
    
    console.log('Updated options:', updatedOptions);
    
    // Update the poll document
    const result = await db.collection('polls').updateOne(
      { _id: new ObjectId(pollId) },
      { $set: { options: updatedOptions } }
    );
    
    console.log('Update result:', result);
    console.log('Poll vote counts have been updated successfully');
  } catch (error) {
    console.error('Error updating poll vote counts:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
