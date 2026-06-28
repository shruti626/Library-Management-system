const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    availableCopies: {
      type: Number,
      required: [true, 'Please specify available copies'],
      min: [0, 'Available copies cannot be negative'],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', BookSchema);
