const db = require('../config/db');

const Booking = {};

Booking.create = async (userId, turfId, bookingDate, startTime, endTime, price) => {
  const [result] = await db.query(
    `INSERT INTO bookings (user_id, turf_id, booking_date, start_time, end_time, total_price) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, turfId, bookingDate, startTime, endTime, price]
  );
  return result.insertId;
};

Booking.isTimeSlotAvailable = async (turfId, bookingDate, startTime, endTime) => {
  const query = `
    SELECT COUNT(*) as count FROM bookings
    WHERE turf_id = ? AND booking_date = ? AND status = 'confirmed'
    AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))
  `;
  const [result] = await db.execute(query, [turfId, bookingDate, endTime, startTime, startTime, endTime]);
  return result[0].count === 0;
};

Booking.hasUserBooked = async (userId, turfId, bookingDate, startTime, endTime) => {
  const query = `
    SELECT COUNT(*) as count FROM bookings
    WHERE user_id = ? AND turf_id = ? AND booking_date = ? AND status = 'confirmed'
    AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))
  `;
  const [result] = await db.execute(query, [userId, turfId, bookingDate, endTime, startTime, startTime, endTime]);
  return result[0].count > 0;
};

Booking.getAllByUserId = async (userId) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE user_id = ?`, [userId]);
  return rows;
};

Booking.getAllByTurfId = async (turfId) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE turf_id = ?`, [turfId]);
  return rows;
};

Booking.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return rows[0];
};

Booking.cancel = async (bookingId) => {
  const query = `UPDATE bookings SET status = 'canceled' WHERE id = ?`;
  await db.execute(query, [bookingId]);
};

module.exports = Booking;
