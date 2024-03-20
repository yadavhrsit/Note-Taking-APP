const { body, validationResult } = require("express-validator");

const noteCreationValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title must be between 1 and 50 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),
];

const validateNoteCreation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const noteCreationValidator = [noteCreationValidation, validateNoteCreation];

module.exports = noteCreationValidator;
