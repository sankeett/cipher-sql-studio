const Attempt = require('../models/Attempt');

// Save a new attempt
const saveAttempt = async (req, res) => {
  const { assignmentId, query, successful } = req.body;
  if (!assignmentId || !query) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const attempt = await Attempt.create({
      user: req.user._id,
      assignment: assignmentId,
      query,
      successful
    });
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attempts for the logged in user
const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id }).populate('assignment', 'title difficulty');
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attempts for a specific assignment for the logged in user
const getAttemptsByAssignment = async (req, res) => {
  try {
    const attempts = await Attempt.find({ 
      user: req.user._id, 
      assignment: req.params.assignmentId 
    });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveAttempt, getUserAttempts, getAttemptsByAssignment };
