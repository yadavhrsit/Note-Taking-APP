const Note = require("../models/notes.model");
const Sort = require("../helpers/sortCriteria.helper").getSortCriteria;
const mongoose = require("mongoose");

// Create a note
async function createNote(req, res) {
  try {
    const { title, content, tags, visibility, sharedWith } = req.body;
    let validSharedWith = [];
    if(visibility === "private" && (sharedWith && Array.isArray(sharedWith))){
      for (let userId of sharedWith) {
        if (mongoose.Types.ObjectId.isValid(userId)) {
          validSharedWith.push(userId);
        }
      }
    }

    const note = await Note.create({
      title,
      content,
      createdBy: req.userId,
      tags: tags ? tags.map((tag) => tag.trim()) : [],
      visibility,
      sharedWith: validSharedWith,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


// Retrieve all notes (public)
async function getAllPublicNotes(req, res) {
  try {
    let query = {
      visibility: "public",
    };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.title = searchRegex;
    }

    if (req.query.tags) {
      const tags = req.query.tags.split(",");
      query.tags = { $in: tags };
    }

    // Sort criteria
    let sortCriteria = Sort(req.query.sortBy);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "createdBy",
        select: "username",
      });

    const totalNotesCount = await Note.countDocuments(query);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalNotesCount / limit),
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Retrieve all notes of current user
async function getAllPrivateNotes(req, res) {
  try {
    const userId = req.userId;
    const query = {
      $or: [{ createdBy: userId }, { sharedWith: { $in: [userId] } }],
      visibility: "private",
    };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.title = searchRegex;
    }

    if (req.query.tags) {
      const tags = req.query.tags.split(",");
      query.tags = { $in: tags };
    }

    // Sort criteria
    let sortCriteria = Sort(req.query.sortBy);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
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

    const { title, content, tags, visibility, sharedWith } = req.body;

    const note = await Note.findOne({ _id: noteId, createdBy: userId });

    if (!note) {
      return res.status(403).json({
        error: "This note doesn't exist or you are unauthorized to update it",
      });
    }

    note.title = title;
    note.content = content;
    note.tags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
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
  getAllPublicNotes,
  getAllPrivateNotes,
  getNote,
  updateNote,
  deleteNote,
  likeNote,
  commentOnNote,
};
