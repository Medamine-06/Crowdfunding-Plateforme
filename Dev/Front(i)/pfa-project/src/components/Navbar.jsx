import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart } from "../components/icons";
import { useAuth } from "../context/AuthContext"; // Import auth context
import { useNotifications } from "../context/NotificationContext"; // Import notification context


function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const userImage = '/assets/icon.png'; // Consider making this dynamic

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close notification dropdown when profile dropdown opens and vice versa
  useEffect(() => {
    if (isDropdownOpen) {
      setIsNotificationOpen(false);
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isNotificationOpen) {
      setIsDropdownOpen(false);
    }  }, [isNotificationOpen]);


  const isAdmin = user?.role === 'admin';

  // Format time for notifications
  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return time.toLocaleDateString();
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h3 className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Heart className="h-6 w-6 fill-red-600 stroke-red-600" />
              <NavLink to="/">TUNIFUND</NavLink>
            </h3>
          </div>

          {/* Links - Visible only to regular users */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/discover" className="text-gray-600 hover:text-red-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 hover:after:w-full after:transition-all after:duration-200">
                Discover
              </NavLink>
              <NavLink to="/how-it-works" className="text-gray-600 hover:text-red-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 hover:after:w-full after:transition-all after:duration-200">
                How It Works
              </NavLink>
              <NavLink to="/success-stories" className="text-gray-600 hover:text-red-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 hover:after:w-full after:transition-all after:duration-200">
                Success Stories
              </NavLink>
            </nav>
          )}

          {/* Auth Buttons or User/Admin Controls */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <NavLink to="/auth/login" className="px-4 py-2 text-gray-600 rounded-md border border-gray hover:text-red-600 transition-colors duration-200">
                  Login
                </NavLink>
                <NavLink to="/auth/signup" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                  Signup
                </NavLink>
              </>
            ) : (
              <>
                {/* Notification Icon - Visible only to regular users */}
                {!isAdmin && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>                      {/* Notification Badge */}
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>                        <div className="max-h-96 overflow-y-auto">
                          {loading ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                              <p className="mt-2 text-sm">Loading notifications...</p>
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                              </svg>
                              <p className="text-sm">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div 
                                key={notification._id} 
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatNotificationTime(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-red-600 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                                  )}
                                </div>
                                {notification.type === 'admin' && (
                                  <div className="mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      Admin
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))
                          )}                        </div>
                        {notifications.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100">
                            <button 
                              onClick={handleMarkAllAsRead}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                              disabled={unreadCount === 0}
                            >
                              {unreadCount > 0 ? 'Mark all as read' : 'All caught up!'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin or Regular User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <img
                      src={userImage}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 hover:border-red-600 transition-colors duration-200"
                    />
                    <span className="font-medium">{user?.firstName || "User"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                      {isAdmin ? (
                        // Admin Dropdown Options
                        <>
                          <NavLink
                            to="/admin/statistics"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            View Statistics
                          </NavLink>
                          <NavLink
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Manage Users
                          </NavLink>
                          <NavLink
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Manage Projects
                          </NavLink>
                        </>
                      ) : (
                        // Regular User Dropdown Options
                        <>
                          <NavLink
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Profile
                          </NavLink>
                          <NavLink
                            to="/my-projects"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Projects
                          </NavLink>
                        </>
                      )}
                      {/* Logout is available for both roles */}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
