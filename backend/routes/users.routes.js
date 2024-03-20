const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/users.controllers");
const userRegistrationValidator = require("../validators/users.validator");

// User Registration
router.post("/register", userRegistrationValidator, register);

// User Login
router.post("/login",userRegistrationValidator, login);

module.exports = router;
