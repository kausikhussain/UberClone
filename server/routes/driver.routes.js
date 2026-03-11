const express = require('express');
const router = express.Router();
const { toggleAvailability, updateLocation } = require('../controllers/driver.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.patch('/availability', protect, authorize('driver'), toggleAvailability);
router.patch('/location', protect, authorize('driver'), updateLocation);

module.exports = router;
