// back/apis.routes.js
// routes.js
const UserController    = require('./controllers/users.controller');
const NotifController   = require('./controllers/notif.controller');
const ProjectController = require('./controllers/project.controller');
const DonationController = require('./controllers/donation.controller');
// We will now get the commentController by calling a function that takes io
const getCommentController = require('./controllers/comment.controller');


const { isAdmin }     = require('./middleware/isAdmin.middleware');
const { verifyToken } = require('./middleware/verifyToken.middleware');

const upload = require('./middleware/upload.middleware');

// Accept io as an argument
module.exports = (server, io) => { // Accept io here
  // Create the comment controller instance, passing the io instance
  const commentController = getCommentController(io); // Pass io here

  /* ──────────── UTILISATEURS ──────────── */
  server.post('/users',            UserController.createUser);
  server.get ('/users',            verifyToken, UserController.getUsers);
  server.get ('/users/:id',        UserController.getUserById);
  server.put ('/users/:id',        verifyToken, UserController.updateUser);
  server.delete('/users/:id',      verifyToken, isAdmin, UserController.deleteUser);

  /* ──────────── NOTIFICATIONS ──────────── */
  server.post('/notifications',        verifyToken, NotifController.sendNotification);
  server.get ('/notifications',        verifyToken, NotifController.getUserNotifications);
  server.put ('/notifications/read',   verifyToken, NotifController.markAsRead);

  /* ──────────── PROJETS ──────────── */
  server.post('/projects',
              verifyToken,
              upload.single('image'),
              ProjectController.createProject);

  server.get ('/projects',               ProjectController.getProjects);
  server.get ('/projects/:id',           ProjectController.getProjectById);
  server.delete('/projects/:id',         verifyToken, ProjectController.deleteProject);
  server.put ('/projects/:id/approve',   verifyToken, isAdmin, ProjectController.approveProject);
  server.put ('/projects/:id/reject',    verifyToken, isAdmin, ProjectController.rejectProject);

  /* Comments */
  // GET /comments/:projectId - Get all comments for a specific project
  server.get('/comments/:projectId', commentController.getCommentsForProject);
  // POST /comments - Create a new comment
  // You might want to protect this route to ensure only authenticated users can comment
  // server.post('/comments', verifyToken, commentController.createComment);
  server.post('/comments', commentController.createComment);


  /* ──────────── DONATIONS (exemple) ──────────── */
  // server.post('/donations', verifyToken, DonationController.createDonation);
};
