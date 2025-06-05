const ProjectModel = require('../models/Project.model');
// Create a new project
const createProject = async (req, res) => {
  try {
    console.log('Headers:', req.headers);
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file); // utile pour debug

    const { title, description, goalAmount, category, deadline } = req.body;
    const creator = req.user._id;

    // Validation de base
    if (!title || !description || !goalAmount || !category || !deadline || !req.file) {
      return res.status(400).send({ 
        message: 'Missing required fields',
        received: {
          title, description, goalAmount, category, deadline,
          hasImage: !!req.file,
        },
      });
    }

    // Construire le chemin relatif de l'image
    const imagePath = `uploads/${req.file.filename}`;

    const newProject = new ProjectModel({
      title: title.trim(),
      description: description.trim(),
      goalAmount: Number(goalAmount),
      category,
      deadline,
      image: imagePath, // ✅ on stocke le chemin relatif
      creator,
      status: 'pending',
    });

    const result = await newProject.save();
    res.status(201).send(result);

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send({ 
      message: 'Error creating project', 
      error: error.message 
    });
  }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const result = await ProjectModel.find().populate('creator', 'email firstName lastName');
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get single project by ID
const getProjectById = async (req, res) => {
    try {
        const result = await ProjectModel.findById(req.params.id).populate('creator','firstName lastName')
        if (!result) return res.status(404).send({ message: 'Project not found' });
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Approve a project (admin only)
const approveProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id).populate('creator', 'firstName lastName');
        if (!project) return res.status(404).send({ message: 'Project not found' });

        project.status = 'approved';
        await project.save();

        // Create notification for project creator
        const { createNotification } = require('./notif.controller');
        await createNotification(
            project.creator._id,
            `Great news! Your project "${project.title}" has been approved and is now live on TuniFund!`,
            'admin'
        );

        res.send({ message: 'Project approved', project });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Delete a project (admin or creator)
const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) return res.status(404).send({ message: 'Project not found' });

        // Optional: Only allow admin or creator
        if (
            req.user.role !== 'admin' &&
            project.creator.toString() !== req.user._id
        ) {
            return res.status(403).send({ message: 'Not authorized' });
        }

        await project.deleteOne();
        res.send({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
};
const rejectProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id).populate('creator', 'firstName lastName');
        if (!project) return res.status(404).send({ message: 'Project not found' });

        project.status = 'rejected';
        await project.save();

        // Create notification for project creator
        const { createNotification } = require('./notif.controller');
        await createNotification(
            project.creator._id,
            `We're sorry, but your project "${project.title}" has been rejected. Please review our guidelines and consider resubmitting.`,
            'admin'
        );

        res.send({ message: 'Project rejected', project });
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {createProject,getProjects,getProjectById,approveProject,deleteProject,rejectProject}
