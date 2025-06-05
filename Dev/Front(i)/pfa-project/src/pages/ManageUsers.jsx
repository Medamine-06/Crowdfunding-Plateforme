// src/pages/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const userData = localStorage.getItem('authData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.token;
    }
    return null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        
        if (!token) {
          setError('Please login to continue');
          navigate('/auth/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          setError('Failed to load users. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:3000/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          setError('Failed to delete user. Please try again.');
        }
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.cin?.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Manage Users</h1>
        <p className="text-gray-500 mb-6">View and manage user accounts</p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search users by name, email or CIN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-200 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading users...</div>
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
                        <p className="text-sm text-gray-500">CIN: {user.cin}</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CIN</label>
                  <p className="mt-1">{selectedUser.cin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;