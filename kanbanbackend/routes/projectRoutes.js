const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByManager
} = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/manager', authMiddleware(['manager']), getProjectsByManager);
router.get('/', getAllProjects);

router.get('/:id', authMiddleware(['admin']), getProjectById);
router.post('/', authMiddleware(['admin']), createProject);
router.put('/:id', authMiddleware(['admin']), updateProject);
router.delete('/:id', authMiddleware(['admin']), deleteProject);
module.exports = router;