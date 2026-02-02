const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/* =========================
   REGISTER USER / ADMIN
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword, role || 'user'],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              message: "Email already registered"
            });
          }

          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: "Registration successful"
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   LOGIN USER / ADMIN
========================= */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const sql = "SELECT id, email FROM users WHERE email = ?";

  db.query(sql, [email], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.RESET_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // 🔹 Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
    <p>Click the link below to reset your password:</p>
    <p>
      <a href="${resetLink}" style="color:blue;font-weight:bold;">
        Reset Password
      </a>
    </p>
    <p>This link is valid for <b>15 minutes</b>.</p>`    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({
          message: "Email not sent"
        });
      }

      res.status(200).json({
        message: "Password reset link sent to your email"
      });
    });
  });
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      message: "New password is required"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = "UPDATE users SET password = ? WHERE id = ?";

    db.query(sql, [hashedPassword, decoded.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        message: "Password reset successful"
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token"
    });
  }
};
