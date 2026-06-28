const express = require('express');
const router = express.Router();
const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Borrow a book
// @route   POST /api/issues/borrow/:bookId
// @access  Private (users can borrow books)
router.post('/borrow/:bookId', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if copies are available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for borrowing' });
    }

    // Check if this user already has an active borrow of this book
    const existingIssue = await IssuedBook.findOne({
      userId: req.user.id,
      bookId: book._id,
      status: 'issued',
    });

    if (existingIssue) {
      return res.status(400).json({ message: 'You have already borrowed a copy of this book' });
    }

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // Create the issue log
    const issuedBook = new IssuedBook({
      userId: req.user.id,
      bookId: book._id,
      status: 'issued',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    });

    const savedIssue = await issuedBook.save();
    
    // Return the issue populated with book details
    const populatedIssue = await IssuedBook.findById(savedIssue._id).populate('bookId');
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Return a borrowed book
// @route   POST /api/issues/return/:issueId
// @access  Private (user returns, or admin processes return)
router.post('/return/:issueId', protect, async (req, res) => {
  try {
    const issue = await IssuedBook.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // Access control: Only the user who borrowed it, or an admin, can return it
    if (issue.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to return this book' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    // Find the book and increment available copies
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Update issue record
    issue.status = 'returned';
    issue.returnDate = new Date();
    await issue.save();

    res.json({ message: 'Book returned successfully', issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user's issues (borrowed books)
// @route   GET /api/issues/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const issues = await IssuedBook.find({ userId: req.user.id })
      .populate('bookId')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all issues (Admin only)
// @route   GET /api/issues/all
// @access  Private/Admin
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const issues = await IssuedBook.find()
      .populate('bookId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get statistics for dashboard
// @route   GET /api/issues/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    
    // Calculate total copies
    const books = await Book.find();
    const totalCopies = books.reduce((acc, book) => acc + book.availableCopies, 0);

    if (req.user.role === 'admin') {
      // Admin dashboard metrics
      const totalUsers = await User.countDocuments({ role: 'user' });
      const activeBorrows = await IssuedBook.countDocuments({ status: 'issued' });
      const returnedBorrows = await IssuedBook.countDocuments({ status: 'returned' });
      
      const overdueBorrows = await IssuedBook.countDocuments({
        status: 'issued',
        dueDate: { $lt: new Date() },
      });

      // Get category distribution
      const categoryData = await Book.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      // Recent transactions
      const recentTransactions = await IssuedBook.find()
        .populate('bookId', 'title')
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalBooks,
        totalCopies,
        totalUsers,
        activeBorrows,
        returnedBorrows,
        overdueBorrows,
        categoryData,
        recentTransactions,
      });
    } else {
      // Regular user dashboard metrics
      const myActiveBorrows = await IssuedBook.countDocuments({
        userId: req.user.id,
        status: 'issued',
      });
      const myTotalBorrows = await IssuedBook.countDocuments({
        userId: req.user.id,
      });
      const myOverdueBorrows = await IssuedBook.countDocuments({
        userId: req.user.id,
        status: 'issued',
        dueDate: { $lt: new Date() },
      });

      const myHistory = await IssuedBook.find({ userId: req.user.id })
        .populate('bookId')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        myActiveBorrows,
        myTotalBorrows,
        myOverdueBorrows,
        myHistory,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
