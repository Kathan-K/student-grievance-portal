const mysql = require("mysql2");
require("dotenv").config();

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // ✅ REQUIRED for Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection (runs once on server start)
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:");
    console.error(err.message);
  } else {
    console.log("✅ MySQL connected successfully (Cloud DB)");
    connection.release();
  }
});

module.exports = db;
