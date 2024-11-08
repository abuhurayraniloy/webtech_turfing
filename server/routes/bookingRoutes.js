const express = require('express');
const { createBooking, getUserBookings, getTurfBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('user'), createBooking);
router.get('/user', protect, authorize('user'), getUserBookings);
router.delete('/:bookingId', protect, authorize('user'), cancelBooking);

router.get('/turf/:turfId', protect, authorize('owner', 'admin'), getTurfBookings);

module.exports = router;
