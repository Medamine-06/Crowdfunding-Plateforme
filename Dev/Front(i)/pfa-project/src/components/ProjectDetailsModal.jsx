// src/components/ProjectDetailsModal.jsx
import React from 'react';

const ProjectDetailsModal = ({ project, onClose, onApprove, onReject }) => {
  if (!project) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Project Image */}
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              {project.image ? (
                <img
                  src={`http://localhost:3000/${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Creator</h3>
                <p>{project.creator?.firstName} {project.creator?.lastName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Category</h3>
                <p>{project.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Goal Amount</h3>
                <p>{project.goalAmount} DT</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Current Amount</h3>
                <p>{project.currentAmount} DT</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Deadline</h3>
                <p>{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Status</h3>
                <p>{getStatusBadge(project.status)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Created At</h3>
                <p>{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Backers</h3>
                <p>{project.backers || 0}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Action Buttons */}
            {project.status === 'pending' && (
              <div className="flex gap-4 justify-end mt-6">
                <button
                  onClick={() => onReject(project._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={() => onApprove(project._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;