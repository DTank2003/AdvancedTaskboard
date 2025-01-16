const ActivityLog = require('../models/activityLogModel');

const logActivity = async (userId, action, taskId) => {
    try {
        const newLog = new ActivityLog({ userId, action, taskId });
        await newLog.save();
    } catch (error) {
        console.error('Error logging activity:', error.message);
    }
};

const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().populate('userId', 'username').populate('taskId', 'title');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
    }
};

module.exports = { logActivity, getActivityLogs };