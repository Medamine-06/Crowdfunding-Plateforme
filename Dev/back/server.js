// back/server.js
//import
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Server from socket.io

// init
const app = express(); // Use 'app' instead of 'server' for Express app
dotenv.config();

// Create HTTP server
const server = http.createServer(app); // Create HTTP server using the Express app

// Initialize Socket.IO
// You can configure CORS for Socket.IO separately if needed, but
// using the same CORS options as Express is often sufficient.
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
// activate json format in the body
app.use(express.json());

// Serve static files from uploads directory
//server.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
 
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Socket.IO connection handler (Optional: Add basic logging or authentication here)
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: Join a room based on project ID when a user opens a project details page
    socket.on('joinProjectRoom', (projectId) => {
        socket.join(projectId);
        console.log(`User joined project room: ${projectId}`);
    });

    // Example: Leave a room when a user navigates away
    socket.on('leaveProjectRoom', (projectId) => {
        socket.leave(projectId);
        console.log(`User left project room: ${projectId}`);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Pass the Express app instance 'app' AND the io instance to the route files
require('./auth.routes.js')(app);
require('./apis.routes.js')(app, io); // Pass io here
require('./donation.route.js')(app);


// Start Server
const PORT = process.env.PORT || 3000;
// Listen using the HTTP server instance, not the Express app
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


