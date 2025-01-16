const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin', 'manager']), getActivityLogs);

module.exports = router;