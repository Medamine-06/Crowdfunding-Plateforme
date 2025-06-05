import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { paymentService } from '../services/paymentService';
import { API_URL } from '../services/api';
import CommentSection from '../components/Comment';
import { useAuth } from '../context/AuthContext';

const placeholderImage = 'placeholder.png';
const placeholderAvatar = 'https://placehold.co/40?text=👤';

function daysLeft(deadline) {
  if (!deadline) return '--';
  const end = new Date(deadline);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donation, setDonation] = useState(100);
  const [donationSuccess, setDonationSuccess] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectData = await projectService.getProjectById(id);
        setProject(projectData);
        setLoading(false);

        const donationSuccessData = localStorage.getItem('donation_success');
        if (donationSuccessData) {
          setDonationSuccess(JSON.parse(donationSuccessData));
          localStorage.removeItem('donation_success');
          const updatedData = await projectService.getProjectById(id);
          setProject(updatedData);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project details');
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleDonate = async () => {
    if (!user) {
      // Store the current URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/auth/login');
      return;
    }

    if (donation <= 0) return alert('Please enter a valid donation amount.');
    if (!project) return alert('Project data not loaded yet.');
    try {
      const result = await paymentService.initializePayment(parseFloat(donation), project._id, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      });
      if (result?.payUrl) window.location.href = result.payUrl;
    } catch (error) {
      alert('Failed to initiate payment.');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!project) return <div className="text-center mt-10">Project not found.</div>;

  const progress = Math.min(Math.round((project.currentAmount / project.goalAmount) * 100), 100);
  const left = daysLeft(project.deadline);
  const creator = project.creator || { firstName: 'Anonymous', lastName: '', avatar: placeholderAvatar };

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-20">
      {donationSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          {donationSuccess.message || `You donated ${donationSuccess.amount} TND. Thank you!`}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left content (2/3) */}
        <div className="lg:col-span-2">
          <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {project.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-500 text-lg mb-6">{project.description}</p>

          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {project.image ? (
              <img
                src={`${API_URL}/${project.image}`}
                alt={project.title}
                className="w-full h-[420px] object-cover"
              />
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center text-gray-400 text-xl">No image available</div>
            )}
          </div>

          <div className="mt-10">
            <CommentSection projectId={id} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {project.currentAmount.toLocaleString()} TND
            </div>
            <p className="text-sm text-gray-500 mb-3">of {project.goalAmount.toLocaleString()} TND goal</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
              <div className="h-2 bg-red-600" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>{project.backers} Backers</span>
              <span>{left} Days left</span>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount (TND)</label>
            <div className="flex items-center mb-4">
              <input
                type="number"
                value={donation}
                min="1"
                onChange={e => setDonation(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded-l-md"
              />
              <span className="bg-gray-100 px-3 py-2 rounded-r-md border border-l-0">TND</span>
            </div>

            <button
              onClick={handleDonate}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
            >
              {user ? '❤️ Make a Donation' : '🔒 Login to Donate'}
            </button>

            <p className="text-xs text-gray-500 mt-2">No donation fees · Secure payment</p>
            <p className="text-xs text-gray-500 mt-1">All or nothing. This project will only be funded if it reaches its goal by {new Date(project.deadline).toLocaleDateString()}.</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Project Creator</h3>
            <div className="flex items-center space-x-4">
              <img
                src={creator.avatar || placeholderAvatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-900">{creator.firstName} {creator.lastName}</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
