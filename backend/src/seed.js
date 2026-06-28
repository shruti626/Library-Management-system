require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const IssuedBook = require('./models/IssuedBook');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await IssuedBook.deleteMany();
    console.log('Cleared existing records.');

    // Seed Users (Pre-save hook will hash passwords!)
    const adminUser = new User({
      name: 'Librarian Admin',
      email: 'admin@aether.com',
      password: 'password123',
      role: 'admin',
    });

    const regularUser = new User({
      name: 'Jane Doe',
      email: 'member@aether.com',
      password: 'password123',
      role: 'user',
    });

    await adminUser.save();
    await regularUser.save();
    console.log('Seeded Users:');
    console.log('  Admin: admin@aether.com / password123');
    console.log('  Member: member@aether.com / password123');

    // Seed Books
    const books = [
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: 'Computer Science',
        availableCopies: 5,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        category: 'Fantasy',
        availableCopies: 3,
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Computer Science',
        availableCopies: 2,
      },
      {
        title: 'Cosmos',
        author: 'Carl Sagan',
        category: 'Science',
        availableCopies: 4,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Classic Literature',
        availableCopies: 1,
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma',
        category: 'Computer Science',
        availableCopies: 3,
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        category: 'Science',
        availableCopies: 0, // Mark one as out of stock initially for testing
      },
    ];

    await Book.insertMany(books);
    console.log('Seeded books database catalog.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data seeding:', error);
    process.exit(1);
  }
};

seedData();
