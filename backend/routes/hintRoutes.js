const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hintController');
const { protect } = require('../middleware/authMiddleware');

const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  } else {
    next();
  }
};

router.post('/generate', optionalProtect, getHint);

module.exports = router;
