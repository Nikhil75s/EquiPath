const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/admin/stats — public (no auth) for landing page stats bar
router.get('/stats', adminController.getStats);

// Protected admin routes
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// GET /api/admin/users
router.get('/users', adminController.getUsers);

// PUT /api/admin/users/:id/deactivate
router.put('/users/:id/deactivate', adminController.deactivateUser);

module.exports = router;
