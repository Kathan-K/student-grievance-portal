require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Database connection (just importing initializes it)
const db = require('./db');

// Routes
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// CORS (for now allow all origins)
// Later we will restrict this to frontend URL
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Student Grievance Portal Backend is running 🚀');
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
