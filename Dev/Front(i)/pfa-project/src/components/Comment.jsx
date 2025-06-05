// pfa-project/src/components/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { API_URL, commentService } from '../services/api'; // Import commentService
const placeholderAvatar = 'https://placehold.co/40?text=👤';




const CommentSection = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  // --------------------------

  useEffect(() => {
    if (!projectId) return; 

    let socket; 

    const loadCommentsAndSetupSocket = async () => {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const commentsData = await commentService.getCommentsForProject(projectId);
        setComments(commentsData);
        setCommentsLoading(false);

        // --- Socket.IO Setup ---
        // Connect to the Socket.IO server using the API_URL
        socket = io(API_URL);
        console.log(`Attempting to connect socket to: ${API_URL}`);

        // Join the specific project room for real-time updates
        socket.emit('joinProjectRoom', projectId);
        console.log(`Attempting to join project room: ${projectId}`);

        // Listen for the 'newComment' event from the backend
socket.on('newComment', (comment) => {
  console.log('Received new comment:', comment);
  setComments(prevComments => {
    const alreadyExists = prevComments.some(c => c._id === comment._id);
    return alreadyExists ? prevComments : [...prevComments, comment];
  });
});

        // Basic error handling and connection logging for socket
        socket.on('connect', () => { console.log('Socket.IO connected'); });
        socket.on('disconnect', (reason) => { console.log('Socket.IO disconnected:', reason); });
        socket.on('connect_error', (err) => { console.error('Socket.IO connection error:', err); setCommentsError('Failed to connect for real-time updates.'); });

        // ------------------------

      } catch (err) {
        console.error("Error loading comments or setting up socket:", err);
        setCommentsError(err.message || 'Failed to load comments.');
        setCommentsLoading(false);
      }
    };

    loadCommentsAndSetupSocket();

    // --- Socket.IO Cleanup ---
    // Disconnect from Socket.IO and leave the room when the component unmounts
    return () => {
      if (socket) {
        console.log(`Attempting to leave project room: ${projectId}`);
        socket.emit('leaveProjectRoom', projectId); // Tell the server we're leaving the room
        socket.disconnect(); // Disconnect the socket connection
        console.log('Socket.IO client disconnected');
      }
    };
    // ------------------------

  }, [projectId]); // Dependency array: Rerun effect if projectId prop changes


  // --- Handle Comment Submission ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Prevent submission if text is empty or submission is in progress
    if (!newCommentText.trim() || isSubmittingComment) {
      return;
    }

    setIsSubmittingComment(true);

    // Get the current logged-in user's ID from localStorage
    const authData = localStorage.getItem('authData');
    let authorId = null;
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            // *** Adjust this line based on how your authData JSON is structured ***
            authorId = parsed.user?._id; // Assuming user object with _id
        } catch (error) {
            console.error('Error parsing authData for author ID:', error);
        }
    }

    if (!authorId) {
        alert("You need to be logged in to post a comment.");
        setIsSubmittingComment(false);
        return;
    }

    // Ensure project ID is available (should be via prop, but defensive check)
     if (!projectId) {
         alert("Project not loaded, cannot post comment.");
         setIsSubmittingComment(false);
         return;
     }


    try {
      // Call the API function to create the comment using the service function
      // The real-time update will come via the Socket.IO listener in the useEffect
      await commentService.createComment({ // Use the service function
        text: newCommentText,
        authorId: authorId,
        projectId: projectId, // Use the projectId prop
      });
      console.log('📤 Sent comment to backend');


      setNewCommentText(''); // Clear the input field
      // The new comment will be added to state by the 'newComment' Socket.IO listener

    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false); // Re-enable the button
    }
  };
  // ----------------------------------


  // --- Render Comment Section UI ---
  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-red-600 focus:border-red-600"
          rows="4"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          disabled={isSubmittingComment || !projectId} // Disable if submitting or project ID is missing
        ></textarea>
        <button
          type="submit"
          className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newCommentText.trim() || isSubmittingComment || !projectId} // Disable button logic
        >
          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {commentsLoading ? (
          <div className="text-center text-gray-500">Loading comments...</div>
      ) : commentsError ? (
          <div className="text-center text-red-600">Error loading comments: {commentsError}</div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {/* Map over comments state to render each comment */}
          {comments.map((comment) => (
            // Use comment._id as the key for the list item
            <div key={comment._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-md">
              {/* Avatar (using placeholder, replace with comment.author.avatar if available) */}
              <img
                src={comment.author?.avatar || placeholderAvatar} // Use author avatar if available
                alt={comment.author?.firstName || 'Anonymous'} // Use author name for alt text
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  {/* Display author's name */}
                  <span className="font-semibold text-gray-900">{comment.author?.firstName} {comment.author?.lastName}</span>
                  {/* Display comment date */}
                  {/* You might want to format the date more nicely */}
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {/* Display comment text */}
                <p className="text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  // --------------------------------
};

export default CommentSection; 