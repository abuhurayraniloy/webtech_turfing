<<<<<<< HEAD
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
=======
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
>>>>>>> 34469114777496523f99062a0242ac2d358193ac
