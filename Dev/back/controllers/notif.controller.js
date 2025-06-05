const Notification = require('../models/Notif.model');

const sendNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  try {
    const notification = new Notification({ userId, message, type })
    await notification.save();
    res.status(201).send({ message: 'Notification sent', notification })
  } catch (err) {
    res.status(500).send({ message: 'Error sending notification', error: err })
  }
}

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching notifications', error: err })
  }
}

const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true } })
    res.send({ message: 'Notifications marked as read' })
  } catch (err) {
    res.status(500).send({ message: 'Error updating notifications', error: err })
  }
}

// Helper function to create notifications automatically
const createNotification = async (userId, message, type = 'system') => {
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsRead,
  createNotification
}
