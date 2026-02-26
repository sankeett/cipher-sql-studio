const express = require('express');
const router = express.Router();
const { saveAttempt, getUserAttempts, getAttemptsByAssignment } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveAttempt);
router.get('/', protect, getUserAttempts);
router.get('/:assignmentId', protect, getAttemptsByAssignment);

module.exports = router;
