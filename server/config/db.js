const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'chonchola',
  database: 'turfbooker',
});

module.exports = pool.promise();
