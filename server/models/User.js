const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {};

User.create = async (name, email, password, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role]
  );
  return result.insertId;
};

User.findByEmail = async (email) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
};

User.findById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

User.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = User;
