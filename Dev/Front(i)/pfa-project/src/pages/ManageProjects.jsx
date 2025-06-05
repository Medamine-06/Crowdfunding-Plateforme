import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

const statusTabs = [
  { key: 'pending', label: 'Pending Review', color: 'bg-yellow-500', badge: 'text-yellow-800 bg-yellow-100' },
  { key: 'approved', label: 'Approved', color: 'bg-green-500', badge: 'text-green-800 bg-green-100' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-500', badge: 'text-red-800 bg-red-100' },
];

const ManageProjects = () => {
  const { refreshNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Log when component mounts
  useEffect(() => {
    console.log('ManageProjects component mounted');
  }, []);

  // Log when activeTab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  // Log when search changes
  useEffect(() => {
    console.log('Search query changed:', search);
  }, [search]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        setLoading(true);
        setError(null);
        
        const authData = localStorage.getItem('authData');
        if (!authData) {
          console.error('No auth data found in localStorage');
          throw new Error('Authentication required');
        }
        
        const { token } = JSON.parse(authData);
        
        const response = await axios.get('http://localhost:3000/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Projects fetched successfully:', response.data.length, 'projects');
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Log filtered projects count
  useEffect(() => {
    console.log('Filtered projects count:', filteredProjects.length);
  }, [filteredProjects]);

  const filteredProjects = projects.filter(
    (p) =>
      p.status === activeTab &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.creator?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        p.creator?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    if (status === 'pending')
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-yellow-800 bg-yellow-100 border border-yellow-300">
          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
          Pending Review
        </span>
      );
    if (status === 'approved')
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-green-800 bg-green-100 border border-green-300">
          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
          Approved
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-red-800 bg-red-100 border border-red-300">
        <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
        Rejected
      </span>
    );
  };

  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  const rejectedCount = projects.filter(p => p.status === 'rejected').length;

  const handleViewDetails = (project) => {
    console.log('Viewing details for project:', project._id);
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing project details modal');
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleApprove = async (projectId) => {
    try {
      console.log('Approving project:', projectId);
      setActionLoading(prev => ({ ...prev, [projectId]: 'approving' }));
      
      const authData = localStorage.getItem('authData');
      if (!authData) {
        console.error('No auth data found when approving project');
        throw new Error('Authentication required');
      }
      
      const { token } = JSON.parse(authData);
      
      const response = await axios.put(
        `http://localhost:3000/projects/${projectId}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Project approved successfully:', response.data);
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId 
            ? { ...project, status: 'approved' }
            : project
        )
      );
      
      setTimeout(() => {
        refreshNotifications();
        console.log('Notifications refreshed after approval');
      }, 1000);
      
    } catch (error) {
      console.error('Error approving project:', error);
      setError(error.response?.data?.message || 'Failed to approve project');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(prev => ({ ...prev, [projectId]: null }));
    }
  };

  const handleReject = async (projectId) => {
    try {
      console.log('Rejecting project:', projectId);
      setActionLoading(prev => ({ ...prev, [projectId]: 'rejecting' }));
      
      const authData = localStorage.getItem('authData');
      if (!authData) {
        console.error('No auth data found when rejecting project');
        throw new Error('Authentication required');
      }
      
      const { token } = JSON.parse(authData);
      
      const response = await axios.put(
        `http://localhost:3000/projects/${projectId}/reject`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Project rejected successfully:', response.data);
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId 
            ? { ...project, status: 'rejected' }
            : project
        )
      );
      
      setTimeout(() => {
        refreshNotifications();
        console.log('Notifications refreshed after rejection');
      }, 1000);
      
    } catch (error) {
      console.error('Error rejecting project:', error);
      setError(error.response?.data?.message || 'Failed to reject project');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(prev => ({ ...prev, [projectId]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Manage Projects</h1>
        <p className="text-gray-500 mb-6">Manage project submissions and platform activity</p>

        {/* Afficher les erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex items-center bg-gray-100 rounded-lg mb-6 overflow-x-auto">
          <button
            key='pending'
            onClick={() => setActiveTab('pending')}
            className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none transition-colors duration-150 ${activeTab === 'pending' ? 'bg-white shadow text-black' : 'text-gray-600'} border-none`}
          >
            Pending Review
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-white`}>{pendingCount}</span>
          </button>
          <button
            key='approved'
            onClick={() => setActiveTab('approved')}
            className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none transition-colors duration-150 ${activeTab === 'approved' ? 'bg-white shadow text-black' : 'text-gray-600'} border-none`}
          >
            Approved
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white`}>{approvedCount}</span>
          </button>
          <button
            key='rejected'
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none transition-colors duration-150 ${activeTab === 'rejected' ? 'bg-white shadow text-black' : 'text-gray-600'} border-none`}
          >
            Rejected
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white`}>{rejectedCount}</span>
          </button>
        </div>

        <div className="flex items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-200 focus:outline-none"
          />
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-100">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.414V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586a2 2 0 00-.293-1.121L3.293 6.707A1 1 0 013 6V4z" /></svg>
            Filters
          </button>
        </div>

        {/* Modal pour View Details */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header du modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">Project Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {selectedProject.image ? (
                        <img 
                          src={`http://localhost:3000/${selectedProject.image}`} 
                          alt={selectedProject.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 17l6-6 4 4 8-8" />
                        </svg>
                      )}
                    </div>
                    {getStatusBadge(selectedProject.status)}
                  </div>

                  {/* Informations */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
                      <p className="text-gray-600">{selectedProject.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Creator:</span>
                        <p>{selectedProject.creator?.firstName} {selectedProject.creator?.lastName}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Category:</span>
                        <p>{selectedProject.category}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Goal Amount:</span>
                        <p className="text-lg font-bold text-green-600">{selectedProject.goalAmount} DT</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Current Amount:</span>
                        <p className="text-lg font-bold text-blue-600">{selectedProject.currentAmount || 0} DT</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Deadline:</span>
                        <p>{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Submitted:</span>
                        <p>{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(((selectedProject.currentAmount || 0) / selectedProject.goalAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(((selectedProject.currentAmount || 0) / selectedProject.goalAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions dans le modal */}
                    {selectedProject.status === 'pending' && (
                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => {
                            handleApprove(selectedProject._id);
                            closeModal();
                          }}
                          disabled={actionLoading[selectedProject._id] === 'approving'}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Project
                        </button>
                        
                        <button 
                          onClick={() => {
                            handleReject(selectedProject._id);
                            closeModal();
                          }}
                          disabled={actionLoading[selectedProject._id] === 'rejecting'}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des projets avec bouton View Details mis à jour */}
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading projects...</div>
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
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 17l6-6 4 4 8-8" /></svg>
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
                        onClick={() => handleViewDetails(project)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      
                      {project.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(project._id)}
                            disabled={actionLoading[project._id] === 'approving'}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[project._id] === 'approving' ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Approving...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => handleReject(project._id)}
                            disabled={actionLoading[project._id] === 'rejecting'}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[project._id] === 'rejecting' ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </>
                            )}
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
      </div>
    </div>
  );
};

export default ManageProjects;