import React, { useState, useEffect } from 'react';
import { X, BookPlus, Save } from 'lucide-react';

const BookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [availableCopies, setAvailableCopies] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setCategory(book.category || '');
      setAvailableCopies(book.availableCopies ?? 1);
    } else {
      setTitle('');
      setAuthor('');
      setCategory('');
      setAvailableCopies(1);
    }
    setError('');
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !category || availableCopies === undefined) {
      setError('All fields are required.');
      return;
    }
    if (availableCopies < 0) {
      setError('Available copies cannot be negative.');
      return;
    }
    
    onSubmit({
      title,
      author,
      category,
      availableCopies: Number(availableCopies),
    });
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel" style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <BookPlus size={22} color="var(--primary)" />
            <h2 style={styles.modalTitle}>{book ? 'Edit Book Details' : 'Add New Book'}</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Book Title</label>
            <input
              type="text"
              className="glass-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Lord of the Rings"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Author</label>
            <input
              type="text"
              className="glass-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. J.R.R. Tolkien"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category / Genre</label>
            <input
              type="text"
              className="glass-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Fantasy, Science Fiction, History"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Number of Copies Available</label>
            <input
              type="number"
              className="glass-input"
              value={availableCopies}
              onChange={(e) => setAvailableCopies(e.target.value)}
              min="0"
              placeholder="e.g. 5"
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={styles.saveBtn}>
              <Save size={18} />
              <span>{book ? 'Save Changes' : 'Add Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 3, 12, 0.8)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
    animation: 'fadeIn 0.3s ease-out forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '16px',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#f87171',
    padding: '12px 16px',
    fontSize: '0.9rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
  },
  cancelBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-muted)',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  saveBtn: {
    padding: '12px 24px',
  },
};

export default BookModal;
