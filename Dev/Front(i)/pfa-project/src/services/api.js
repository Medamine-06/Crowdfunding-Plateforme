// pfa-project/src/services/api.js
import axios from 'axios';

export const API_URL = 'http://localhost:3000'; // Added export here

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from authData JSON object
    let token = null;
    const authData = localStorage.getItem('authData');

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      } catch (error) {
        console.error('Error parsing authData:', error);
      }
    }

/*  console.log('Token from localStorage:', token);
    console.log('authData:', authData); */

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //console.log('Request headers:', config.headers);
    } else {
      console.warn('No authentication token found');
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);

export const projectService = {
  // Get all published projects
  getAllProjects: async () => {
    try {
      console.log('Making request to:', `${API_URL}/projects`);
      const response = await api.get('/projects');
      console.log('Response received:', response);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No Response Error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request Setup Error:', error.message);
      }
      throw error;
    }
  },


  // Get a single project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },
  updateProjectAmount: async (projectId, amount) => {
    try {
      console.log('Updating project amount:', { projectId, amount });
      const response = await api.patch(`/projects/${projectId}/donate`, {
        amount: amount
      });
      console.log('Update response:', response.data);
      return response.data.project; // Make sure we return the updated project
    } catch (error) {
      console.error('Error updating project amount:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  // Create a new project
  createProject: async (projectData) => {
    try {
      console.log('Sending project data:', projectData);
      console.log('Is FormData?', projectData instanceof FormData);

      // Handle FormData differently than JSON
      const config = {};
      if (projectData instanceof FormData) {
        config.headers ;
      }

      // Le token sera automatiquement ajouté par l'interceptor
      console.log('Config headers:', config.headers);
      console.log("project data " ,projectData)
      const response = await api.post('/projects', projectData);

      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw error;
    }
  }
};

// --- New Comment Service Functions ---
export const commentService = {
  getCommentsForProject: async (projectId) => {
    try {
      const response = await api.get(`/comments/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error; // Re-throw to be caught by the component
    }
  },

  createComment: async (commentData) => {
    try {
      // The axios instance 'api' automatically includes the auth header if available
      const response = await api.post('/comments', commentData);
      return response.data; // Backend should return the saved comment
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error; // Re-throw to be caught by the component
    }
  },
};

// --- Notification Service Functions ---
export const notificationService = {
  // Get all notifications for the current user
  getUserNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read');
      return response.data;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },

  // Send a notification (admin only)
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },
};