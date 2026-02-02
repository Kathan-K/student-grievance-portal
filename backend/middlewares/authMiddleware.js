const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check token exists
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  // Format: Bearer TOKEN
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token"
      });
    }

    req.user = decoded; // id, role
    next();
  });
};
