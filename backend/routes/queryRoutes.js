const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

// Using an optional auth middleware would be ideal, but for now we'll allow unauthenticated queries if required, 
// OR we mandate login to execute. We will mandate login for optional features, but we can make it optional.
// Let's implement dynamic protection: checking headers without rejecting if empty.
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  } else {
    next();
  }
};

router.post('/execute', optionalProtect, executeQuery);

module.exports = router;
