const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authentication.middleware");
const {
  createNote,
  deleteNote,
  updateNote,
  getNote,
  getAllNotes,
  getNotes,
  likeNote,
  commentOnNote,
} = require("../controllers/notes.controllers");
const noteCreationValidator = require("../validators/notes.validator");

// Create Note
router.post("/", verifyToken, noteCreationValidator, createNote);

// Retrieve Notes
router.get("/", getAllNotes);
router.get("/user", verifyToken, getNotes);

// Retrieve Single Note
router.get("/:id", getNote);

// Update Note
router.put("/:id", verifyToken, noteCreationValidator, updateNote);

// Delete Note
router.delete("/:id", verifyToken, deleteNote);

// Like Note
router.post("/:id/like", verifyToken, likeNote);

// Comment on Note
router.post("/:id/comment", verifyToken, commentOnNote);

module.exports = router;
