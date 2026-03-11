const express = require('express');
const router = express.Router();
const { requestRide, getRideStatus, getDriverRides, getRiderRides } = require('../controllers/ride.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/request', protect, authorize('rider'), requestRide);
router.get('/status/:id', protect, getRideStatus);
router.get('/driver-rides', protect, authorize('driver'), getDriverRides);
router.get('/rider-rides', protect, authorize('rider'), getRiderRides);

module.exports = router;
