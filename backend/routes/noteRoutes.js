
const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.route('/')
    .get(protect, getNotes)
    .post(protect, [
        body('title').notEmpty().withMessage('Note title is required'),
        body('content').notEmpty().withMessage('Note content is required')
    ], createNote);

router.route('/:id')
    .delete(protect, deleteNote);

module.exports = router;