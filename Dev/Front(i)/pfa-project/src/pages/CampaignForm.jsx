import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CampaignForm() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p>Please log in to create a campaign.</p>
            <Button 
              onClick={() => navigate('/auth/login')} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    deadline: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.goalAmount || formData.goalAmount <= 0) {
      setError('Goal amount must be greater than 0');
      return false;
    }
    if (!formData.deadline) {
      setError('Deadline is required');
      return false;
    }
    if (!formData.image) {
      setError('Project image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('title', formData.title.trim());
      form.append('description', formData.description.trim());
      form.append('goalAmount', formData.goalAmount);
      form.append('deadline', formData.deadline);
      form.append('category', formData.category);
      form.append('image', formData.image);

      const response = await projectService.createProject(form);
      console.log('Project created successfully:', response);
      
      // Set success state to true
      setSuccess(true);
      
      // Clear the form
      setFormData({
        title: '',
        description: '',
        goalAmount: '',
        deadline: '',
        category: '',
        image: null,
      });
      setPreviewImage(null);
      
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success message if campaign was created successfully
  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-center">
            <h2 className="text-xl font-semibold mb-2">Campaign Submitted Successfully!</h2>
            <p className="mb-4">Your campaign is now under review by our team. We'll notify you once it's approved.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-red-600 hover:bg-red-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create Your Campaign</h1>
            <p className="text-sm text-gray-500">Share your project with the world and start raising funds</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter your campaign title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your campaign"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goalAmount">Goal Amount (TND)</Label>
                <Input
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  min="1"
                  placeholder="Enter your funding goal"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Campaign Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Education">Education</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Campaign Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  required
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CampaignForm;