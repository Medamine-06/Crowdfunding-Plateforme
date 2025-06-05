// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

const statusTabs = [
  { key: 'pending', label: 'Pending Review', color: 'bg-yellow-500', badge: 'text-yellow-800 bg-yellow-100' },
  { key: 'approved', label: 'Approved', color: 'bg-green-500', badge: 'text-green-800 bg-green-100' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-500', badge: 'text-red-800 bg-red-100' },
];

const adminTabs = [
  { key: 'projects', label: 'Projects' },
  { key: 'users', label: 'Users' },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('projects');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (activeSection === 'projects') {
          const response = await axios.get('http://localhost:3000/projects');
          setProjects(response.data);
        } else {
          const response = await axios.get('http://localhost:3000/users');
          setUsers(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection]);

  const handleApprove = async (projectId) => {
    try {
      await axios.put(`http://localhost:3000/projects/${projectId}/approve`);
      const response = await axios.get('http://localhost:3000/projects');
      setProjects(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error approving project:', err);
      setError('Failed to approve project. Please try again.');
    }
  };

  const handleReject = async (projectId) => {
    try {
      await axios.put(`http://localhost:3000/projects/${projectId}/reject`);
      const response = await axios.get('http://localhost:3000/projects');
      setProjects(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error rejecting project:', err);
      setError('Failed to reject project. Please try again.');
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/users/${userId}/status`, { status: newStatus });
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending')
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-yellow-800 bg-yellow-100 border border-yellow-300">
          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l2 2" />
          </svg>
          Pending Review
        </span>
      );
    if (status === 'approved')
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-green-800 bg-green-100 border border-green-300">
          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          Approved
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-red-800 bg-red-100 border border-red-300">
        <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
        Rejected
      </span>
    );
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.status === activeTab &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.creator?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        p.creator?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Manage platform activity and users</p>

        <div className="flex items-center bg-gray-100 rounded-lg mb-6 overflow-x-auto">
          {adminTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none transition-colors duration-150 ${
                activeSection === tab.key ? 'bg-white shadow text-black' : 'text-gray-600'
              } border-none`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSection === 'projects' ? (
          <>
            <div className="flex items-center bg-gray-100 rounded-lg mb-6 overflow-x-auto">
              {statusTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none transition-colors duration-150 ${
                    activeTab === tab.key ? 'bg-white shadow text-black' : 'text-gray-600'
                  } border-none`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${tab.color} text-white`}>
                    {projects.filter(p => p.status === tab.key).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-200 focus:outline-none"
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading projects...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-12">{error}</div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">No projects found in this category.</div>
                ) : (
                  filteredProjects.map(project => (
                    <div key={project._id} className="bg-white rounded-lg shadow border border-gray-100 flex flex-col md:flex-row items-stretch p-6 gap-6">
                      <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 text-4xl overflow-hidden">
                        {project.image ? (
                          <img src={`http://localhost:3000/${project.image}`} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 17l6-6 4 4 8-8" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h2 className="text-xl font-semibold">{project.title}</h2>
                          <div>{getStatusBadge(project.status)}</div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                          <span>Creator: <span className="font-medium text-black">{project.creator?.firstName} {project.creator?.lastName}</span></span>
                          <span>Category: <span className="font-medium text-black">{project.category}</span></span>
                          <span>Goal: <span className="font-medium text-black">{project.goalAmount} DT</span></span>
                          <span>Submitted on: <span className="font-medium text-black">{new Date(project.createdAt).toLocaleDateString()}</span></span>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button 
                            onClick={() => {
                              setSelectedProject(project);
                              setIsModalOpen(true);
                            }} 
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </button>
                          {project.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(project._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(project._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-200 focus:outline-none"
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading users...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-12">{error}</div>
            ) : (
              <div className="space-y-6">
                {filteredUsers.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">No users found.</div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user._id} className="bg-white rounded-lg shadow border border-gray-100 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => handleUserStatusChange(user._id, user.status === 'active' ? 'inactive' : 'active')}
                            className={`px-4 py-2 rounded-md text-white ${
                              user.status === 'active' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default AdminDashboard;