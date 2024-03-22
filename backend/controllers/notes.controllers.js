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

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.title = searchRegex;
    }

    // Sort by most liked
    if (req.query.sortBy === "most_liked") {
      sortCriteria.likes = -1;
    }
    // Sort by most commented
    else if (req.query.sortBy === "most_commented") {
      sortCriteria["comments.length"] = -1;
    }
    // Sort by recent
    else if (req.query.sortBy === "recent") {
      sortCriteria.createdAt = -1;
    }
    // Sort by recently commented
    else if (req.query.sortBy === "recently_commented") {
      sortCriteria["comments.createdAt"] = -1;
    }
    
    else {
      sortCriteria.createdAt = -1;
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

    // Sort by most liked
    if (req.query.sortBy === "most_liked") {
      sortCriteria.likes = -1;
    }
    // Sort by most commented
    else if (req.query.sortBy === "most_commented") {
      sortCriteria["comments.length"] = -1;
    }
    // Sort by recent
    else if (req.query.sortBy === "recent") {
      sortCriteria.createdAt = -1;
    }
    // Sort by recently commented
    else if (req.query.sortBy === "recently_commented") {
      sortCriteria["comments.createdAt"] = -1;
    } else {
      sortCriteria.createdAt = -1;
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

// Like a single note by id
async function likeNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.userId;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this note" });
    }

    note.likes.push(userId);
    await note.save();

    res.json({ message: "Note liked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Comment on a single note by id
async function commentOnNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.userId;
    const { text } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const comment = {
      user: userId,
      text,
    };

    note.comments.push(comment);
    await note.save();

    res.json({ message: "Comment added successfully", comment });
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
  likeNote,
  commentOnNote,
};
