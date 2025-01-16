const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const { logActivity } = require('./activityLogController');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("dependencies")
            .populate("assignedTo");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("dependencies")
            .populate("assignee");
        if(task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({message: 'Task not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createTask = async (req, res) => {
    const {title, description, status, priority, dueDate, 
        projectId, dependencies, assignedTo} = req.body;

    try {
        const newTask = new Task({title, description, status, priority, 
            dueDate, projectId, dependencies, assignedTo});
        const savedTask = await newTask.save();
        await logActivity(req.user._id, 'created', savedTask._id);
        //add task to the project's task list
        const projectObj = await Project.findById(projectId);
        if(projectObj) {
            projectObj.tasks.push(savedTask._id);
            await projectObj.save
        }

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


const getTasksAssigned = async (req, res) => {
    console.log("Reached controller");
    try {
        const userId = req.user._id; // Assuming the user's ID is available in req.user
        console.log(userId);
        const tasks = await Task.find({ assignedTo: userId }).populate('projectId');
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:",error.message)
        res.status(500).json({ message: error.message });
    }
};

const getTasksByManagerProject = async (req, res) => {
    console.log("Reached getTasksByManagerProject controller");
    try {
        const managerId = req.user._id; // Assuming the user's ID is available in req.user
        console.log(managerId);
        
        // Find the project managed by the logged-in manager
        const project = await Project.findOne({ assignedManager: managerId });
        if (!project) {
            return res.status(404).json({ message: 'No project found for this manager' });
        }

        // Fetch tasks for the found project
        const tasks = await Task.find({ projectId: project._id }).populate('projectId');
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getTaskByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ projectId });
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
      }
};

const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id,
            req.body, {new: true});
        if(updatedTask) {
            await logActivity(req.user._id, 'updated', req.params.id);
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({message: 'Task not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserTasks = async (req, res) => {
    try {
        console.log("here i am");
      const userId = req.user._id;
      const tasks = await Task.find({ assignedTo: userId });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  };

const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(deletedTask) {
            await logActivity(req.user._id, 'deleted', req.params.id);
            //remove task from associated project
            const projectObj = await Project.findById(deletedTask.projectId);
            if(projectObj) {
                projectObj.tasks = projectObj.tasks.filter(
                    (taskId) => taskId.toString() !== req.params.id
                );
                await projectObj.save();
            }
            res.status(200).json({message: 'Task deleted'});
        } else {
            res.status(404).json({message: 'Task not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const addDependency = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(task) {
            task.dependencies.push(req.body.dependency);
            const updatedTask = await task.save();
            res.status(200).json(updatedTask);
        } else { 
            res.status(404).json({message: 'Task not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    addDependency,
    getTaskByProjectId,
    getTasksByManagerProject,
    getUserTasks,
    getTasksAssigned
}