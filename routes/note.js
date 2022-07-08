const express = require("express");
const router = express.Router();
const Notes = require("../Models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1 : Fetch all the notes from the DB : GET :/api/notes/getnotes :Login required
router.get("/getnotes", fetchuser, async (req, res) => {
  try {
    let notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 : ADD the notes to DB : POST :/api/notes/addnote :Login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),
    body("body", "description must be atleast 10 characters").isLength({
      min: 10,
    }),
  ],
  async (req, res) => {
    const { title, body, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const notes = new Notes({
        user: req.user.id,
        title,
        body,
        tag,
      });
      const savednotes = await notes.save();
      res.send(savednotes);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 : Update a existing note : PUT : api/notes/updatenote : LOGIN Required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, body, tag } = req.body;
  try {
    let updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (body) {
      updatedNote.body = body;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Note not found");
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).send("Unauthorized access");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true }
    );
    res.send(note);
    res.send("Note Updated Successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route 4 :Delete a note from the Database : DELETE : api/notes/deletenote :LOGIN Required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).json("Note not found");
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).json("Unauthorized access");
    } else {
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note deleted successfully", note: note });
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
