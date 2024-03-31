const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/authentication.middleware");

async function register(req, res) {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A User with this Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Unregistered User" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "You entered wrong Password" });
    }

    const token = generateToken(user._id);

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  register,
  login,
};