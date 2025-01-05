// backend/controllers/dashboardController.js
const User = require('../models/User');
const Schedule = require('../models/Schedule');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the JWT token (stored in req.user)
    
    // Fetch user details
    const user = await User.findById(userId).select('username email fullName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch schedules related to the user
    const schedules = await Schedule.find({ user: userId })
      .populate('user', 'username fullName')  // Populate user information for each schedule if needed
      .select('package status carDetails dates');

    // Send back user data and their schedules
    res.json({ user, schedules });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};