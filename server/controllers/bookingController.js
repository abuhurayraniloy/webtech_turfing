const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const moment = require('moment');


exports.createBooking = async (req, res, next) => {
  const { turfId, bookingDate, startTime, endTime } = req.body;
  const userId = req.user.id;

  try {
    const turf = await Turf.getById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    const bookingStart = moment(startTime, 'HH:mm');
    const bookingEnd = moment(endTime, 'HH:mm');

    if (!bookingStart.isValid() || !bookingEnd.isValid()) {
      return res.status(400).json({ message: 'Invalid start or end time format' });
    }

    if (bookingEnd.isSameOrBefore(bookingStart)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const isAvailable = await Booking.isTimeSlotAvailable(turfId, bookingDate, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const hasBooked = await Booking.hasUserBooked(userId, turfId, bookingDate, startTime, endTime);
    if (hasBooked) {
      return res.status(400).json({ message: 'You have already booked this turf in the selected time slot' });
    }

    const duration = bookingEnd.diff(bookingStart, 'hours');
    const totalPrice = duration * turf.price_per_hour;

    const bookingId = await Booking.create(userId, turfId, bookingDate, startTime, endTime, totalPrice);
    res.status(201).json({ message: 'Booking created successfully', bookingId });
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.getAllByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getTurfBookings = async (req, res, next) => {
  const { turfId } = req.params;

  try {
    const bookings = await Booking.getAllByTurfId(turfId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const penaltyPercentage = 0.3;

  try {
    const booking = await Booking.getById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
    }

    const now = moment();
    const bookingTime = moment(`${booking.booking_date} ${booking.start_time}`, 'YYYY-MM-DD HH:mm');

    if (bookingTime.diff(now, 'hours') < 6) {
      const penalty = booking.total_price * penaltyPercentage;
      return res.status(200).json({
        message: 'Booking canceled within 6 hours, a penalty of 30% will apply',
        penalty,
      });
    }

    await Booking.delete(bookingId);
  res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};


