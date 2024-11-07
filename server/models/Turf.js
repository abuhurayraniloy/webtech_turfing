const db = require('../config/db');

const Turf = {};

Turf.create = async (name, location, pricePerHour, ownerId) => {
  const [result] = await db.query(
    `INSERT INTO turfs (name, location, price_per_hour, owner_id) VALUES (?, ?, ?, ?)`,
    [name, location, pricePerHour, ownerId]
  );
  return result.insertId;
};

Turf.getAll = async (location = null) => {
  if (location) {
    const [rows] = await db.query(
      `SELECT * FROM turfs WHERE location LIKE ?`,
      [`%${location}%`]
    );
    return rows;
  } else {
    const [rows] = await db.query(`SELECT * FROM turfs`);
    return rows;
  }
};

Turf.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM turfs WHERE id = ?`, [id]);
  return rows[0];
};

Turf.update = async (id, name, location, pricePerHour) => {
  const [result] = await db.query(
    `UPDATE turfs SET name = ?, location = ?, price_per_hour = ? WHERE id = ?`,
    [name, location, pricePerHour, id]
  );
  return result.affectedRows;
};

Turf.delete = async (id) => {
  const [result] = await db.query(`DELETE FROM turfs WHERE id = ?`, [id]);
  return result.affectedRows;
};

module.exports = Turf;
