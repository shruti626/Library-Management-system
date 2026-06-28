const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all books (with optional search filter)
// @route   GET /api/books
// @access  Private (or Public, but we require protect since they need to login to see/use the system)
router.get('/', protect, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { title, author, category, availableCopies } = req.body;

  if (!title || !author || !category || availableCopies === undefined) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const book = new Book({
      title,
      author,
      category,
      availableCopies,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const { title, author, category, availableCopies } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (availableCopies !== undefined) book.availableCopies = availableCopies;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is currently issued (unreturned) before deleting
    // It's a nice safety check! Let's import the IssuedBook model.
    const IssuedBook = require('../models/IssuedBook');
    const isIssued = await IssuedBook.findOne({ bookId: book._id, status: 'issued' });
    if (isIssued) {
      return res.status(400).json({ message: 'Cannot delete a book that is currently borrowed' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
