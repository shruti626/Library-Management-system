import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, api } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Book, Users, BookOpen, Clock, AlertTriangle, ArrowRight, Bookmark } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/issues/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading intelligence dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '40px' }}>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '24px 40px' }}>
          <AlertTriangle color="var(--danger)" size={40} style={{ marginBottom: '12px' }} />
          <h3>Error loading dashboard</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{error}</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-container animate-fade-in">
      <div style={styles.welcomeSection}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, {user?.name}</h1>
          <p style={styles.welcomeSubtitle}>
            {isAdmin 
              ? "System Control Station - Manage books, cataloging, and student loans."
              : "Personal Hub - Find books, check your due dates, and explore history."}
          </p>
        </div>
        {!isAdmin && (
          <Link to="/books" className="btn-primary">
            <Bookmark size={18} />
            <span>Browse Library</span>
          </Link>
        )}
      </div>

      {isAdmin ? (
        /* ADMIN DASHBOARD */
        <>
          <div style={styles.statsGrid}>
            <StatCard title="Unique Titles" value={stats.totalBooks} icon={Book} color="var(--primary)" />
            <StatCard title="Available Copies" value={stats.totalCopies} icon={BookOpen} color="var(--secondary)" />
            <StatCard title="Active Members" value={stats.totalUsers} icon={Users} color="var(--primary)" />
            <StatCard title="Issued Books" value={stats.activeBorrows} icon={Clock} color="var(--secondary)" />
            <StatCard title="Overdue Items" value={stats.overdueBorrows} icon={AlertTriangle} color="var(--danger)" />
          </div>

          <div style={styles.dashboardLayout}>
            {/* Recent transactions */}
            <div className="glass-panel" style={{ ...styles.dashboardPanel, flex: 2 }}>
              <div style={styles.panelHeader}>
                <h2>Recent Transactions</h2>
                <Link to="/issues" style={styles.panelLink}>
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="glass-table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Borrower</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTransactions?.length > 0 ? (
                      stats.recentTransactions.map((tx) => (
                        <tr key={tx._id}>
                          <td style={{ fontWeight: '500' }}>{tx.bookId?.title || 'Unknown Book'}</td>
                          <td>{tx.userId?.name || 'Deleted User'}</td>
                          <td>{new Date(tx.issueDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${tx.status === 'issued' ? 'badge-warning' : 'badge-success'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                          No recent transactions recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category distribution */}
            <div className="glass-panel" style={{ ...styles.dashboardPanel, flex: 1 }}>
              <h2>Book Categories</h2>
              <div style={styles.categoriesList}>
                {stats.categoryData?.length > 0 ? (
                  stats.categoryData.map((cat, index) => {
                    const percentage = Math.round((cat.count / stats.totalBooks) * 100);
                    return (
                      <div key={index} style={styles.categoryItem}>
                        <div style={styles.categoryInfo}>
                          <span style={styles.categoryName}>{cat._id}</span>
                          <span style={styles.categoryCount}>{cat.count} {cat.count === 1 ? 'book' : 'books'}</span>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div style={{
                            ...styles.progressBarFill,
                            width: `${percentage}%`,
                            background: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'
                          }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '20px' }}>
                    No books in catalog yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* USER DASHBOARD */
        <>
          <div style={styles.statsGrid}>
            <StatCard title="Active Borrows" value={stats.myActiveBorrows} icon={Clock} color="var(--secondary)" />
            <StatCard title="Total Borrows" value={stats.myTotalBorrows} icon={Book} color="var(--primary)" />
            <StatCard title="Overdue Books" value={stats.myOverdueBorrows} icon={AlertTriangle} color="var(--danger)" />
          </div>

          <div style={styles.dashboardLayout}>
            {/* User current borrows / activity */}
            <div className="glass-panel" style={{ ...styles.dashboardPanel, flex: 1 }}>
              <div style={styles.panelHeader}>
                <h2>Active Borrow Records</h2>
                <Link to="/issues" style={styles.panelLink}>
                  <span>Manage Borrows</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="glass-table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.myHistory?.filter(h => h.status === 'issued').length > 0 ? (
                      stats.myHistory
                        .filter(h => h.status === 'issued')
                        .map((tx) => {
                          const isOverdue = new Date(tx.dueDate) < new Date();
                          return (
                            <tr key={tx._id}>
                              <td style={{ fontWeight: '500' }}>{tx.bookId?.title || 'Unknown Book'}</td>
                              <td>{new Date(tx.dueDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-warning'}`}>
                                  {isOverdue ? 'Overdue' : 'Active'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 0' }}>
                          You have no books borrowed currently. Browse catalog to find your next read!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(139, 92, 246, 0.1)',
    borderTop: '3px solid var(--secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '6px',
  },
  welcomeSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  statsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
  },
  dashboardLayout: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  dashboardPanel: {
    minWidth: '300px',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  panelLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--secondary)',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'var(--transition-smooth)',
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  categoryName: {
    fontWeight: '500',
    color: '#ffffff',
  },
  categoryCount: {
    color: 'var(--text-muted)',
  },
  progressBarBg: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)',
  },
};

// Add spinner keyframes in JS styling is impossible, so we rely on index.css or simple animation definitions. 
// We will write the keyframe to index.css!
export default Dashboard;
