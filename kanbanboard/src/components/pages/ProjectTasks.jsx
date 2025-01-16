import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FaComment, FaListAlt } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddCommentModal from "./AddCommentModal";

const ProjectTasks = () => {
  const { projectId } = useParams();
const [showCommentModal, setShowCommentModal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [],
    },
    inprogress: {
      name: "In Progress",
      items: [],
    },
    done: {
      name: "Done",
      items: [],
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    console.log("fetching tasks");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get(`/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const todoTasks = data.filter((task) => task.status === "todo");
      const inProgressTasks = data.filter(
        (task) => task.status === "inprogress"
      );
      const doneTasks = data.filter((task) => task.status === "done");

      setColumns({
        todo: {
          name: "To Do",
          items: todoTasks,
        },
        inprogress: {
          name: "In Progress",
          items: inProgressTasks,
        },
        done: {
          name: "Done",
          items: doneTasks,
        },
      });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const handleActivityLogClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleCommentClick = async (task) => {
    setSelectedTask(task);
    setShowCommentsModal(true);
  };

  const handleAddComment = async () => {
    // Add comment logic
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTasks = (tasks) => {
    return tasks.filter((task) => {
      const matchesSearchQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriorityFilter = priorityFilter ? task.priority === priorityFilter : true;
      return matchesSearchQuery && matchesPriorityFilter;
    });
  };

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    projectId: "",
    projectName: "",
    status: "todo",
  });
  const [editTask, setEditTask] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.filter((user) => user.role === "user"));
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data: project } = await axiosInstance.get(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewTask((prevTask) => ({
        ...prevTask,
        projectId: project._id,
        projectName: project.name,
      }));
      fetchTasks(); // Fetch tasks for the project
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    }
  };

  const handleAddTaskClick = () => {
    fetchProjectDetails();
    setShowAddTaskModal(true);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.post("/tasks", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowAddTaskModal(false);
      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const handleEditTaskClick = (task) => {
    setEditTask(task);
    setShowEditTaskModal(true);
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.put(`/tasks/${editTask._id}`, editTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowEditTaskModal(false);
      fetchTasks(); // Refresh tasks after editing
    } catch (error) {
      console.error("Error editing task:", error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh tasks after deleting
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
  
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
  
    destItems.splice(destination.index, 0, removed);
  
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  
    // Update task status on the backend
    const token = localStorage.getItem('authToken');
    axiosInstance.put(`/tasks/${removed._id}`, { status: destination.droppableId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchTasks(); // Refresh tasks after updating status
      })
      .catch((error) => {
        console.error('Error updating task status:', error.message);
      });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-300";
      case "low":
        return "bg-green-500";
      default:
        return "";
    }
  };

  const isDueDatePassed = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.put(`/tasks/${taskId}`, { priority: newPriority }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh tasks after updating priority
    } catch (error) {
      console.error('Error updating task priority:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">Manager Dashboard</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded p-2 w-1/3 text-black"
        />
        <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="border border-gray-300 rounded p-2 text-black"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={handleAddTaskClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Add Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tasks List */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="flex flex-col items-center w-1/3">
                <h3 className="text-xl font-semibold mb-4">{column.name}</h3>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white p-4 rounded-lg shadow-md w-full min-h-[500px]"
                    >
                      {filteredTasks(column.items).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 bg-gray-100 rounded-lg shadow mb-2"
                            >
                              <h3 className="text-lg font-semibold">
                                {task.title}
                              </h3>
                              <p className="text-gray-600 mt-2">
                                Description: {task.description}
                              </p>
                              <p className="text-gray-600 mt-2">
                                Due Date:{" "}
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString()
                                  : "---"}
                              </p>
                              <p className="text-gray-600 mt-2">
                                Priority:{" "}
                                <span
                                  className={`inline-block px-2 py-1 text-white text-sm rounded ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </p>
                              {task.dueDate && isDueDatePassed(task.dueDate) && (
                                <p className="text-red-500 mt-2">
                                  Due date has passed!
                                </p>
                              )}
                              <div className="flex space-x-2 mt-2">
                                <FaComment className="text-gray-600 cursor-pointer" onClick={() => setShowCommentModal(true)}/>
                                <FaListAlt 
                                className="text-green-600 cursor-pointer" 
                                onClick={() => handleActivityLogClick(task._id)} />
                                <FaEdit
                                  className="text-blue-600 cursor-pointer"
                                  onClick={() => handleEditTaskClick(task)}
                                />
                                <FaTrash
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteTask(task._id)}
                                />
                                {showCommentModal && (
        <AddCommentModal
          taskId={task._id}
          onClose={() => setShowCommentModal(false)}
        />
      )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Assigned To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Project
                </label>
                <input
                  type="text"
                  value={newTask.projectName}
                  className="border border-gray-300 rounded p-2 w-full"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  //required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded py-2 px-4"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleEditTask}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Priority
                </label>
                <select
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Assigned To
                </label>
                <select
                  value={editTask.assignedTo}
                  onChange={(e) =>
                    setEditTask({ ...editTask, assignedTo: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Project
                </label>
                <input
                  type="text"
                  value={editTask.projectName}
                  className="border border-gray-300 rounded p-2 w-full"
                  readOnly
                />
              </div> */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  // required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditTaskModal(false)}
                  className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded py-2 px-4"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-md w-1/2">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      <div className="max-h-96 overflow-y-auto mb-4">
        {comments.map((comment) => (
          <div key={comment._id} className="mb-4">
            <p className="text-gray-700 font-medium">{comment.user.username}</p>
            <p className="text-gray-600">{comment.text}</p>
            <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Add Comment</label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowCommentsModal(false)}
          className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleAddComment}
          className="bg-blue-500 text-white rounded py-2 px-4"
        >
          Add Comment
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  );
};

export default ProjectTasks;