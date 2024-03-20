const { body, validationResult } = require("express-validator");

const userRegistrationValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 16 })
    .withMessage("Username must be between 5 and 16 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
];

const validateUserRegistration = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


const userRegistrationValidator = [
  userRegistrationValidation,
  validateUserRegistration,
];

module.exports = userRegistrationValidator;
