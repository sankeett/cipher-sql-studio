const pool = require('../config/postgres');
const Attempt = require('../models/Attempt');

const executeQuery = async (req, res) => {
  const { query, assignmentId } = req.body;
  
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  // Basic sanitization/validation to only allow SELECT statements
  const upperQuery = query.trim().toUpperCase();
  if (!upperQuery.startsWith('SELECT')) {
    return res.status(403).json({ message: 'Only SELECT queries are allowed.' });
  }

  const forbiddenKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE'];
  for (const keyword of forbiddenKeywords) {
    if (upperQuery.includes(keyword)) {
      return res.status(403).json({ message: `Keyword ${keyword} is not allowed.` });
    }
  }

  try {
    const result = await pool.query(query);
    
    // Determine if successful conceptually: If no error thrown, it's successful execution.
    // In a real app we might compare against the "expected" result. 
    // Here we just save the attempt if the user is authenticated (optional, req.user could be checked)
    if (req.user && assignmentId) {
      await Attempt.create({
        user: req.user._id,
        assignment: assignmentId,
        query: query,
        successful: true
      });
    }

    res.json({ rows: result.rows, fields: result.fields });
  } catch (error) {
    // Save failed attempt
    if (req.user && assignmentId) {
      await Attempt.create({
        user: req.user._id,
        assignment: assignmentId,
        query: query,
        successful: false
      });
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = { executeQuery };
