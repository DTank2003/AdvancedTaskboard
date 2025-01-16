import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaComment, FaListAlt } from "react-icons/fa";
import AddCommentModal from "./AddCommentModal";

const UserDashboard = () => {
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
  }, []);

  const fetchTasks = async () => {
    // Fetch tasks logic
    console.log("fetching tasks");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/tasks/user-tasks", {
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">User Dashboard</h1>
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
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={() => navigate('/')}
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
                                      <FaComment className="text-gray-600 cursor-pointer" onClick={() => setShowCommentsModal(true)}/>
                                      <FaListAlt 
                                      className="text-green-600 cursor-pointer" 
                                        onClick={() => handleActivityLogClick(task._id)} />
                                       {showCommentsModal && (
        <AddCommentModal
          taskId={task._id} 
          onClose={() => setShowCommentsModal(false)}
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
            </div>
  );
};

export default UserDashboard;