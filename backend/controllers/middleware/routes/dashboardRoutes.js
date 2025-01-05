// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Custom middleware to authenticate token

// Route to get user dashboard data
router.get('/dashboard', authenticateToken, getDashboardData);

module.exports = router;