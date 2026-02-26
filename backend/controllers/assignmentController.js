const Assignment = require('../models/Assignment');

const getAssignments = async (req, res) => {
  const assignments = await Assignment.find({});
  res.json(assignments);
};

const getAssignmentById = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (assignment) {
    res.json(assignment);
  } else {
    res.status(404).json({ message: 'Assignment not found' });
  }
};

module.exports = { getAssignments, getAssignmentById };
