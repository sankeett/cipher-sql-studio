const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  schemaDescription: { type: String, required: true },
  sampleDataDescription: { type: String, required: true },
  expectedQuery: { type: String }, // Optional checking
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
