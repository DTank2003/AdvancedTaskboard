import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axiosInstance.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      // const managers = response.data.filter(user => user.role === 'manager');
      // setUsers(managers);
      setUsers(response.data);
      console.log(response.data);
    } catch(error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleAddProject = async (projectData) => {
  try {
    const token = localStorage.getItem("authToken");
    await axiosInstance.post("/projects", projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchProjects(); // Refresh projects after adding
    setShowAddModal(false); // Close the Add Project modal
  } catch (error) {
    console.error("Error adding project:", error.message);
  }
};

  const handleEditProjectClick = async (project) => {
    await fetchUsers();
    setEditProject(project);
    setShowEditModal(true);
  };

  const handleEditProject = async (projectData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.put(`/projects/${editProject._id}`, projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProjects(); // Refresh projects after editing
      setShowEditModal(false);
      setEditProject(null);
    } catch (error) {
      console.error("Error editing project:", error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects(); // Refresh projects after deleting
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
    fetchUsers(); // Fetch users for the modal
    setShowAddModal(true); // Open the modal
  }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Add New Project
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Project List */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-4 bg-white shadow-md rounded-lg border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div onClick={() => handleProjectClick(project._id)} className="cursor-pointer">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="text-gray-600 mt-2">Description: {project.description}</p>
                  <p className="text-gray-600 mt-2">Assigned Manager: {project.assignedManager ? project.assignedManager.username : 'Nil'}</p>
                  <p className="text-gray-600 mt-2">Due Date: {project.dueDate ? 
                    new Date(project.dueDate).toLocaleDateString() : ' Nil'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEditProjectClick(project)}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteProject(project._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onAddProject={handleAddProject}
          users={users}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          onClose={() => setShowEditModal(false)}
          onEditProject={handleEditProject}
          users={users}
          project={editProject}
        />  
      )}
    </div>
  );
};

export default AdminDashboard;