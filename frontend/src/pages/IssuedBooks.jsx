import React, { useState, useEffect, useContext } from 'react';
import { api, AuthContext } from '../context/AuthContext';
import { BookMarked, Calendar, AlertTriangle, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const IssuedBooks = () => {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const endpoint = user.role === 'admin' ? '/issues/all' : '/issues/user';
      const res = await api.get(endpoint);
      setIssues(res.data);
    } catch (err) {
      setError('Failed to fetch borrowing records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleReturn = async (issueId) => {
    try {
      await api.post(`/issues/return/${issueId}`);
      showNotification('Book returned successfully!');
      
      // Play confetti on successful return!
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#06b6d4', '#10b981'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#06b6d4', '#10b981'],
      });

      // Reload the issue list
      fetchIssues();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to process return', true);
    }
  };

  // Helper to calculate days remaining
  const getDueStatus = (dueDateStr, status) => {
    if (status === 'returned') return { text: 'Returned', type: 'success' };

    const dueDate = new Date(dueDateStr);
    const today = new Date();
    
    // Clear time components for clean day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, type: 'danger' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', type: 'warning' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays}d remaining`, type: 'warning' };
    } else {
      return { text: `${diffDays}d remaining`, type: 'safe' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-container animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{isAdmin ? 'System Loan Records' : 'My Borrowed Books'}</h1>
          <p style={styles.subtitle}>
            {isAdmin 
              ? 'View system-wide transaction reports and manage book returns.' 
              : 'Keep track of your active borrowings, due dates, and return history.'}
          </p>
        </div>
      </div>

      {successMsg && <div style={styles.successAlert}>{successMsg}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      <div className="glass-panel">
        {issues.length > 0 ? (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  {isAdmin && <th>Borrower</th>}
                  <th>Book Title</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Time Left / Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const dueStatus = getDueStatus(issue.dueDate, issue.status);
                  const isReturned = issue.status === 'returned';

                  return (
                    <tr key={issue._id}>
                      {isAdmin && (
                        <td>
                          <div style={styles.borrowerInfo}>
                            <span style={styles.borrowerName}>{issue.userId?.name || 'Deleted Member'}</span>
                            <span style={styles.borrowerEmail}>{issue.userId?.email || 'N/A'}</span>
                          </div>
                        </td>
                      )}
                      <td style={{ fontWeight: '500' }}>
                        {issue.bookId?.title || 'Unknown Book'}
                      </td>
                      <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                      <td>
                        {issue.returnDate 
                          ? new Date(issue.returnDate).toLocaleDateString() 
                          : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                      </td>
                      <td>
                        <span className={`badge ${
                          dueStatus.type === 'success' 
                            ? 'badge-success' 
                            : dueStatus.type === 'danger' 
                            ? 'badge-danger' 
                            : dueStatus.type === 'warning' 
                            ? 'badge-warning' 
                            : 'badge-success' // safe maps to a green border
                        }`}
                        style={dueStatus.type === 'safe' ? { background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' } : {}}
                        >
                          {dueStatus.text}
                        </span>
                      </td>
                      <td>
                        {!isReturned ? (
                          <button 
                            onClick={() => handleReturn(issue._id)} 
                            style={styles.returnBtn}
                          >
                            <RotateCcw size={14} />
                            <span>Return</span>
                          </button>
                        ) : (
                          <div style={styles.returnedCompleted}>
                            <CheckCircle2 size={16} color="var(--success)" />
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Settled</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <BookMarked size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3>No Transactions Recorded</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {isAdmin 
                ? 'No borrowing operations have been recorded in the database yet.' 
                : 'You have not checked out any books yet. Borrow books from the Catalog page.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(139, 92, 246, 0.1)',
    borderTop: '3px solid var(--secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    marginBottom: '32px',
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
  borrowerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  borrowerName: {
    fontWeight: '500',
    color: '#ffffff',
  },
  borrowerEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
  },
  returnBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(6, 182, 212, 0.1)',
    color: '#22d3ee',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  returnedCompleted: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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

export default IssuedBooks;
