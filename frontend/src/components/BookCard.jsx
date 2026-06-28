import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Book, Edit2, Trash2, BookmarkCheck, BookmarkPlus } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete, onBorrow, isBorrowed }) => {
  const { user } = useContext(AuthContext);

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="glass-panel" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          <Book size={24} color="var(--primary)" />
        </div>
        <div style={styles.badgeContainer}>
          <span style={styles.categoryBadge}>{book.category}</span>
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title} title={book.title}>{book.title}</h3>
        <p style={styles.author}>by {book.author}</p>
        
        <div style={styles.copiesInfo}>
          <span style={styles.copiesText}>Available Copies:</span>
          <span style={{ 
            ...styles.copiesCount, 
            color: isAvailable ? 'var(--success)' : 'var(--danger)' 
          }}>
            {book.availableCopies}
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        {user?.role === 'admin' ? (
          <>
            <button onClick={() => onEdit(book)} style={styles.editBtn}>
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            <button onClick={() => onDelete(book._id)} style={styles.deleteBtn}>
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        ) : (
          <button 
            onClick={() => onBorrow(book._id)} 
            disabled={isBorrowed || !isAvailable}
            style={{
              ...styles.borrowBtn,
              ...(isBorrowed ? styles.borrowedBtn : {}),
              ...(!isAvailable && !isBorrowed ? styles.disabledBtn : {})
            }}
          >
            {isBorrowed ? (
              <>
                <BookmarkCheck size={18} />
                <span>Borrowed</span>
              </>
            ) : isAvailable ? (
              <>
                <BookmarkPlus size={18} />
                <span>Borrow Book</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '240px',
    transition: 'var(--transition-smooth)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(139, 92, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  badgeContainer: {
    display: 'flex',
    gap: '6px',
  },
  categoryBadge: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  content: {
    margin: '16px 0',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '4px',
  },
  author: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  copiesInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
  },
  copiesText: {
    color: 'var(--text-dim)',
  },
  copiesCount: {
    fontWeight: '700',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
  },
  editBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(6, 182, 212, 0.1)',
    color: '#22d3ee',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '8px',
    padding: '8px 0',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    transition: 'var(--transition-smooth)',
  },
  deleteBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '8px 0',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    transition: 'var(--transition-smooth)',
  },
  borrowBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 0',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'var(--transition-smooth)',
    boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
  },
  borrowedBtn: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  disabledBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-dim)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};

export default BookCard;
