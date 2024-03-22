const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET;
//generate a JWT token on user login
function generateToken(user) {
  const payload = {
    userId: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

//verify the JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Login is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Login Expired, Please Login again" });
    }
    req.userId = decoded.userId;

    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
