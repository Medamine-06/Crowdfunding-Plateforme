// src/pages/Statistics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Statistics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalGoalAmount: 0,
    totalCurrentAmount: 0,
    projectStatus: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    projectCategories: {
      'Technology': 0,
      'Agriculture': 0,
      'Education': 0,
      'Arts & Culture': 0,
      'Healthcare': 0,
      'Environment': 0,
      'Community': 0
    },
    categoryAmounts: {
      'Technology': 0,
      'Agriculture': 0,
      'Education': 0,
      'Arts & Culture': 0,
      'Healthcare': 0,
      'Environment': 0,
      'Community': 0
    },
    categoryTotalAmounts: {
      'Technology': 0,
      'Agriculture': 0,
      'Education': 0,
      'Arts & Culture': 0,
      'Healthcare': 0,
      'Environment': 0,
      'Community': 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        return token;
      } catch (error) {
        console.error('Error parsing auth data:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        
        if (!token) {
          setError('Please login to continue');
          navigate('/auth/login');
          return;
        }

        const [usersResponse, projectsResponse] = await Promise.all([
          axios.get('http://localhost:3000/users', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://localhost:3000/projects', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const users = usersResponse.data;
        const projects = projectsResponse.data;

        // Calculate project status
        const projectStatus = projects.reduce((acc, project) => {
          acc[project.status] = (acc[project.status] || 0) + 1;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0 });

        // Calculate total amounts (only for approved projects)
        const totalGoalAmount = projects
          .filter(project => project.status === 'approved')
          .reduce((sum, project) => sum + (project.goalAmount || 0), 0);
        const totalCurrentAmount = projects
          .filter(project => project.status === 'approved')
          .reduce((sum, project) => sum + (project.currentAmount || 0), 0);

        // Calculate category amounts and total amounts
        const categoryAmounts = {};
        const categoryTotalAmounts = {};
        
        projects.forEach(project => {
          // Only include approved projects in the statistics
          if (project.status === 'approved') {
            const category = project.category;
            // Initialize if not exists
            if (!categoryAmounts[category]) {
              categoryAmounts[category] = 0;
              categoryTotalAmounts[category] = 0;
            }
            // Add current amount
            categoryAmounts[category] += (project.currentAmount || 0);
            // Add total goal amount
            categoryTotalAmounts[category] += (project.goalAmount || 0);
          }
        });

        setStats({
          totalUsers: users.length,
          totalProjects: projects.filter(p => p.status === 'approved').length,
          totalGoalAmount,
          totalCurrentAmount,
          projectStatus,
          categoryAmounts,
          categoryTotalAmounts
        });

        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          setError('Failed to load statistics. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [navigate]);

  // Chart data for funding progress
  const fundingProgressData = {
    labels: ['Collected', 'Remaining'],
    datasets: [
      {
        data: [stats.totalCurrentAmount, stats.totalGoalAmount - stats.totalCurrentAmount],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderColor: ['#059669', '#D1D5DB'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for project status
  const projectStatusData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Number of Projects',
        data: [stats.projectStatus.pending, stats.projectStatus.approved, stats.projectStatus.rejected],
        backgroundColor: ['#F59E0B', '#10B981', '#EF4444'],
        borderColor: ['#D97706', '#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for category amounts
  const categoryAmountsData = {
    labels: Object.keys(stats.categoryAmounts),
    datasets: [
      {
        label: 'Amount Collected by Category',
        data: Object.values(stats.categoryAmounts),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
          '#EC4899', '#14B8A6', '#F97316'
        ],
        borderColor: [
          '#2563EB', '#059669', '#D97706', '#7C3AED',
          '#DB2777', '#0D9488', '#EA580C'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Statistics Dashboard</h1>
        <p className="text-gray-500 mb-6">Overview of your application's metrics</p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProjects}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Goal Amount</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalGoalAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Collected</h3>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.totalCurrentAmount)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Funding Progress</h3>
            <div className="h-64">
              <Pie data={fundingProgressData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {Math.round((stats.totalCurrentAmount / stats.totalGoalAmount) * 100)}% of total goal reached
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Status</h3>
            <div className="h-64">
              <Bar 
                data={projectStatusData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Category Amounts Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Amount Collected by Category</h3>
          <div className="h-96">
            <Bar 
              data={categoryAmountsData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Funding Details</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage of Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.categoryAmounts).map(([category, amount]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(stats.categoryTotalAmounts[category])}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stats.categoryTotalAmounts[category] > 0 
                          ? `${Math.round((amount / stats.categoryTotalAmounts[category]) * 100)}%`
                          : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;