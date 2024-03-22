const Note = require("../models/notes.model");

// Create a note
async function createNote(req, res) {
  try {
    const { title, content, visibility, sharedWith } = req.body;
    const note = await Note.create({
      title,
      content,
      createdBy: req.userId,
      visibility,
      sharedWith,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Retrieve all notes (public or private)
async function getAllNotes(req, res) {
  try {
    let query = {};
    let sortCriteria = {};

    query.visibility = "public";
    if (req.userId) {
      query.$or = [{ createdBy: req.userId }, { visibility: "public" }];
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.title = searchRegex;
    }
    if (req.query.sortBy) {
      sortCriteria[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil((await Note.countDocuments(query)) / limit),
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Retrieve all notes of current user
async function getNotes(req, res) {
  try {
    const userId = req.userId;
    let query = { createdBy: userId };
    let sortCriteria = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.title = searchRegex;
    }
    if (req.query.sortBy) {
      sortCriteria[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil((await Note.countDocuments(query)) / limit),
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Retrieve a single note by id
async function getNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.userId || null;

    const note = await Note.findOne({
      _id: noteId,
      $or: [
        { createdBy: userId },
        { visibility: "public" },
        { sharedWith: userId },
      ],
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a single note by id
async function updateNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.userId;

    const { title, content, visibility, sharedWith } = req.body;

    const note = await Note.findOne({ _id: noteId, createdBy: userId });

    if (!note) {
      return res.status(403).json({
        error: "This note doesn't exist or you are unauthorized to update it",
      });
    }

    note.title = title;
    note.content = content;
    note.visibility = visibility;
    note.sharedWith = sharedWith;
    note.updatedAt = Date.now();
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a single note by id
async function deleteNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.userId;

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
  getAllNotes,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
