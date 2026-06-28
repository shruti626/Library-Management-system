import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Bookmark, BookMarked } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logoLink}>
          <BookOpen size={28} color="var(--secondary)" />
          <span style={styles.logoText}>AetherLibrary</span>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/books" style={styles.navLink}>
            <Bookmark size={18} />
            <span>Books Catalog</span>
          </Link>
          <Link to="/issues" style={styles.navLink}>
            <BookMarked size={18} />
            <span>{user.role === 'admin' ? 'Issued Records' : 'My Borrows'}</span>
          </Link>
          <Link to="/profile" style={styles.navLink}>
            <User size={18} />
            <span>Profile</span>
          </Link>
        </div>

        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.name}</span>
            <span style={styles.userRole}>
              {user.role === 'admin' ? 'Librarian' : 'Member'}
            </span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(10, 8, 22, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-glow)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 24px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, var(--secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'var(--transition-smooth)',
  },
  // We can add a hover selector dynamically or use JS. Since it's CSS-based, we'll write classes, but style attributes are also fine.
  // Actually, we can add a class and style it in CSS! Let's write CSS selectors to index.css if needed, or style them inline for convenience. Let's add hover classes in css.
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    paddingRight: '16px',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  userRole: {
    fontSize: '0.75rem',
    color: 'var(--secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#f87171',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
};

export default Navbar;
