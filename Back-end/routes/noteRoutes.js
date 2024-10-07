const express = require('express');
const Note = require('../models/Note'); 
const router = express.Router(); 
const { body, validationResult } = require('express-validator'); // Import validation middleware

// Create a new note
router.post('/', [
    // Validate that title and content are not empty
    body('title').notEmpty(),
    body('content').notEmpty()
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 status with error message if validation fails
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    // Create a new note instance with the request data
    const newNote = new Note({
        title: req.body.title,
        content: req.body.content
    });

    try {
        // Save the new note to the database
        const savedNote = await newNote.save();
        // Return the saved note with a 201 status
        res.status(201).json(savedNote);
    } catch (err) {
        // Handle errors during saving
        res.status(400).json({ message: err.message });
    }
});

// Get all notes
router.get('/', async (req, res) => {
    try {
        // Retrieve all notes from the database
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a note by ID
router.patch('/:id', [
    // Validate that title and content are not empty
    body('title').notEmpty(),
    body('content').notEmpty()
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 status with error message if validation fails
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
        // Update the note by ID with the new data
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        }, { new: true }); // Return the updated note

        // Check if the note was found and updated
        if (!updatedNote) {
            // Return 404 status if the note was not found
            return res.status(404).json({ message: 'Note not found' });
        }

        
        res.json(updatedNote);
    } catch (err) {
        // Handle errors during the update
        res.status(400).json({ message: err.message });
    }
});

// Delete a note by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        // Check if the note was found and deleted
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
