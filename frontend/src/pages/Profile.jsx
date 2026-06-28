import React, { useContext, useState, useEffect } from 'react';
import { AuthContext, api } from '../context/AuthContext';
import { User, ShieldAlert, Award, Calendar, RefreshCw, Mail, Fingerprint } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('An avid reader exploring the mysteries of the library database.');
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const res = await api.get('/issues/stats');
        setProfileStats(res.data);
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileStats();
    }
  }, [user]);

  const handleSaveBio = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 8000); // simulate saving
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="app-container animate-fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>User Security & Profile</h1>
        <p style={styles.subtitle}>Manage your library account settings and view credentials.</p>
      </div>

      <div style={styles.layout}>
        {/* Profile Card */}
        <div className="glass-panel" style={{ ...styles.card, flex: 1 }}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarBorder}>
              <div style={styles.avatar}>
                <User size={48} color="var(--secondary)" />
              </div>
            </div>
            <h2 style={styles.profileName}>{user.name}</h2>
            <span style={{
              ...styles.roleBadge,
              background: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.15)',
              color: isAdmin ? '#f87171' : '#22d3ee',
              borderColor: isAdmin ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'
            }}>
              {isAdmin ? 'Librarian (Admin)' : 'Library Member'}
            </span>
          </div>

          <div style={styles.detailsList}>
            <div style={styles.detailItem}>
              <Mail size={16} color="var(--text-dim)" />
              <div style={styles.detailText}>
                <span style={styles.detailLabel}>Email Address</span>
                <span style={styles.detailVal}>{user.email}</span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <Fingerprint size={16} color="var(--text-dim)" />
              <div style={styles.detailText}>
                <span style={styles.detailLabel}>Database Identifier</span>
                <span style={styles.detailValCode}>{user._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info / Biography Panel */}
        <div style={{ ...styles.rightPanel, flex: 2 }}>
          {/* Stats Summary */}
          <div className="glass-panel" style={styles.statsPanel}>
            <h3>Account Summary</h3>
            {loading ? (
              <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Loading summary details...</p>
            ) : profileStats ? (
              <div style={styles.statsSummaryGrid}>
                {isAdmin ? (
                  <>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Cataloged Titles</span>
                      <span style={styles.summaryValue}>{profileStats.totalBooks}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Active System Loans</span>
                      <span style={styles.summaryValue}>{profileStats.activeBorrows}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Books Borrowed Currently</span>
                      <span style={styles.summaryValue}>{profileStats.myActiveBorrows}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Lifetime Borrow Log</span>
                      <span style={styles.summaryValue}>{profileStats.myTotalBorrows}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Summary data unavailable</p>
            )}
          </div>

          {/* About Me Form */}
          <div className="glass-panel" style={styles.bioPanel}>
            <h3>About Scholar</h3>
            <form onSubmit={handleSaveBio} style={styles.bioForm}>
              {success && <div style={styles.successMsg}>Biography updated successfully!</div>}
              <div style={styles.formGroup}>
                <textarea
                  className="glass-input"
                  style={styles.bioTextarea}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <button type="submit" className="btn-secondary" style={styles.saveBtn} disabled={isUpdating}>
                <RefreshCw size={14} className={isUpdating ? 'spin' : ''} style={isUpdating ? { animation: 'spin 1s linear infinite' } : {}} />
                <span>{isUpdating ? 'Saving...' : 'Save Description'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
  layout: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  card: {
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    textAlign: 'center',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarBorder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    padding: '3px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
    marginBottom: '16px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'var(--bg-deep)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid transparent',
  },
  detailsList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '24px',
    textAlign: 'left',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  detailText: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailVal: {
    fontSize: '0.9rem',
    color: '#ffffff',
    marginTop: '2px',
  },
  detailValCode: {
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    color: 'var(--secondary)',
    marginTop: '2px',
  },
  rightPanel: {
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  statsPanel: {
    padding: '24px',
  },
  statsSummaryGrid: {
    display: 'flex',
    gap: '20px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  summaryItem: {
    flex: 1,
    minWidth: '150px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  bioPanel: {
    padding: '24px',
  },
  bioForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
  },
  bioTextarea: {
    width: '100%',
    height: '100px',
    resize: 'none',
    lineHeight: '1.5',
  },
  saveBtn: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
  },
  successMsg: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    color: '#34d399',
    padding: '10px 14px',
    fontSize: '0.85rem',
  },
};

export default Profile;
