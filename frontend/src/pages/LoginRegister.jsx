import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, UserCheck } from 'lucide-react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default is user, can select admin
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    } else {
      const res = await register(name, email, password, role);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel animate-fade-in" style={styles.authCard}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <BookOpen size={36} color="var(--secondary)" />
            <h1 style={styles.logoText}>AetherLibrary</h1>
          </div>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Access the repository of endless knowledge' 
              : 'Join a modern community of readers and scholars'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="glass-input"
                  style={styles.paddedInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                className="glass-input"
                style={styles.paddedInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className="glass-input"
                style={styles.paddedInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>System Role</label>
              <div style={styles.inputWrapper}>
                <UserCheck size={18} style={styles.inputIcon} />
                <select
                  className="glass-input"
                  style={styles.paddedSelect}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user" style={styles.option}>Library Member (Student)</option>
                  <option value="admin" style={styles.option}>Librarian (Admin)</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              style={styles.toggleBtn}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, var(--secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    maxWidth: '280px',
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
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-dim)',
    pointerEvents: 'none',
  },
  paddedInput: {
    paddingLeft: '44px',
  },
  paddedSelect: {
    paddingLeft: '44px',
    appearance: 'none',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  option: {
    background: 'var(--bg-deep)',
    color: '#ffffff',
  },
  submitBtn: {
    marginTop: '10px',
    padding: '14px',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#f87171',
    padding: '12px 16px',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
  },
  footerText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--secondary)',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '6px',
    padding: '0',
    fontFamily: 'var(--font-body)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

export default LoginRegister;
