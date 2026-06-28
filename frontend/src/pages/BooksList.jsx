import React, { useState, useEffect, useContext } from 'react';
import { api, AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { Search, Plus, Filter, Library, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const BooksList = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books', {
        params: {
          search: search || undefined,
          category: selectedCategory || undefined,
        },
      });
      setBooks(res.data);

      // Extract unique categories for filter
      if (!selectedCategory && !search) {
        const uniqueCats = [...new Set(res.data.map((b) => b.category))];
        setCategories(uniqueCats);
      }
    } catch (err) {
      setError('Failed to fetch books catalog.');
    }
  };

  const fetchBorrowedBooks = async () => {
    if (user?.role === 'admin') return;
    try {
      const res = await api.get('/issues/user');
      // Set of book IDs that are currently issued and not returned
      const activeIds = new Set(
        res.data
          .filter((tx) => tx.status === 'issued')
          .map((tx) => tx.bookId?._id || tx.bookId)
      );
      setBorrowedBookIds(activeIds);
    } catch (err) {
      console.error('Error fetching borrow logs:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBooks(), fetchBorrowedBooks()]).finally(() => setLoading(false));
  }, [search, selectedCategory]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Add or Edit Book Submission
  const handleModalSubmit = async (formData) => {
    try {
      if (editingBook) {
        // Edit Book
        const res = await api.put(`/books/${editingBook._id}`, formData);
        setBooks(books.map((b) => (b._id === editingBook._id ? res.data : b)));
        showNotification('Book updated successfully!');
      } else {
        // Add Book
        const res = await api.post('/books', formData);
        setBooks([...books, res.data].sort((a, b) => a.title.localeCompare(b.title)));
        showNotification('Book added to inventory!');
      }
      setIsModalOpen(false);
      setEditingBook(null);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Operation failed', true);
    }
  };

  // Delete Book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to remove this book from inventory?')) return;
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter((b) => b._id !== id));
      showNotification('Book removed successfully.');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete book', true);
    }
  };

  // Borrow Book
  const handleBorrowBook = async (bookId) => {
    try {
      const res = await api.post(`/issues/borrow/${bookId}`);
      // Update local borrowed states and copies counts
      setBorrowedBookIds((prev) => new Set([...prev, bookId]));
      setBooks(
        books.map((b) =>
          b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
        )
      );

      // Trigger Confetti for high-fidelity micro-animation!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#ec4899'],
      });

      showNotification('Book borrowed successfully! Track it in My Borrows.');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Borrow request failed', true);
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Books Archive</h1>
          <p style={styles.subtitle}>Explore and filter the complete index of available books.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={handleAddClick} className="btn-primary">
            <Plus size={18} />
            <span>Add Book</span>
          </button>
        )}
      </div>

      {successMsg && <div style={styles.successAlert}>{successMsg}</div>}
      {error && <div style={styles.errorAlert}><AlertCircle size={18} /><span>{error}</span></div>}

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={styles.searchPanel}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            className="glass-input"
            style={styles.searchInput}
            placeholder="Search by Title, Author, or Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.filterWrapper}>
          <Filter size={18} color="var(--text-dim)" />
          <select
            className="glass-input"
            style={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
        </div>
      ) : books.length > 0 ? (
        <div style={styles.booksGrid}>
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={handleEditClick}
              onDelete={handleDeleteBook}
              onBorrow={handleBorrowBook}
              isBorrowed={borrowedBookIds.has(book._id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={styles.emptyState}>
          <Library size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
          <h3>No Books Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            We couldn't find any books fitting your search criteria. Try a different query!
          </p>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleModalSubmit}
        book={editingBook}
      />
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '6px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  searchPanel: {
    display: 'flex',
    gap: '20px',
    marginBottom: '32px',
    padding: '16px 24px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flexGrow: 2,
    minWidth: '260px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-dim)',
  },
  searchInput: {
    paddingLeft: '48px',
  },
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexGrow: 1,
    minWidth: '180px',
  },
  filterSelect: {
    background: 'rgba(255, 255, 255, 0.03)',
    cursor: 'pointer',
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '30vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(139, 92, 246, 0.1)',
    borderTop: '3px solid var(--secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  successAlert: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    color: '#34d399',
    padding: '12px 16px',
    fontSize: '0.95rem',
    marginBottom: '24px',
    animation: 'fadeIn 0.3s ease-out',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#f87171',
    padding: '12px 16px',
    fontSize: '0.95rem',
    marginBottom: '24px',
    animation: 'fadeIn 0.3s ease-out',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 20px',
  },
};

export default BooksList;
