// back/controllers/comment.controller.js
const Comment = require('../models/Comment.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model');
// Remove the direct require of io to avoid circular dependency
// const { io } = require('../server');

// Export a function that accepts the io instance when called
module.exports = (io) => { // This function takes the io instance as an argument
  const commentController = {
    /**
     * Get all comments for a specific project.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getCommentsForProject: async (req, res) => {
      try {
        const projectId = req.params.projectId;

        const comments = await Comment.find({ project: projectId })
          .populate('author', 'firstName lastName') // Populate author details
          .sort({ createdAt: 1 }); // Sort by creation date

        res.status(200).json(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
      }
    },

    /**
     * Create a new comment.
     * @param {Object} req - Express request object (should contain text, author ID, project ID in body).
     * @param {Object} res - Express response object.
     */
    createComment: async (req, res) => {
      try {
        const { text, authorId, projectId } = req.body;

        // Basic validation
        if (!text || !authorId || !projectId) {
          return res.status(400).json({ message: 'Missing required comment data' });
        }

        // Check if project and author exist (recommended)
        const projectExists = await Project.findById(projectId);
        const authorExists = await User.findById(authorId);

        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!authorExists) {
             // This case is less likely if authorId comes from auth
            return res.status(404).json({ message: 'Author not found' });
        }

        const newComment = new Comment({
          text: text,
          author: authorId,
          project: projectId,
        });

        const savedComment = await newComment.save();

        // Populate author details before emitting the event
        const populatedComment = await savedComment.populate('author', 'firstName lastName'); // Adjust fields if needed

        // Emit Socket.IO event to the specific project room
        // io is available here because it was passed to the exported function
        io.to(projectId).emit('newComment', populatedComment);
        console.log(`Emitted newComment for project ${projectId}`);

        res.status(201).json(populatedComment); // Send back the saved comment with author details
      } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Failed to create comment', error: error.message });
      }
    },

    // Add other controller methods here (e.g., updateComment, deleteComment)
  };

  return commentController; // Return the controller object
}; // End of the exported function