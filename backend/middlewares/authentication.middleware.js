const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET;

function generateToken(user) {
  const payload = {
    userId: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Login is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Login Expired, Please Login again" });
    }
    req.userId = decoded.userId;

    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
