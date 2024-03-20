const Note = require("../models/notes.model");

// create a note
async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, createdBy: req.user });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
// retrieve all notes
async function getNotes(req, res) {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// retrieve a single note by id
async function getNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// update a single note by id
async function updateNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.user;

    const { title, content } = req.body;

    const note = await Note.findOne({ _id: noteId, createdBy: userId });
    if (!note) {
      return res.status(403).json({
        error: "This note does'nt exists or you are unauthorized to update it",
      });
    }

    note.title = title;
    note.content = content;
    note.updatedAt = Date.now();
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
// delete a single note by id
async function deleteNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.user;

    const note = await Note.findOne({ _id: noteId, createdBy: userId });
    if (!note) {
      return res.status(403).json({
        error: "This note doesn't exist or you are unauthorized to delete it",
      });
    }

    await Note.deleteOne({ _id: noteId, createdBy: userId });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
