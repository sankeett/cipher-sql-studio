const mongoose = require('mongoose');

const attemptSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  query: { type: String, required: true },
  successful: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
