import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)' }) => {
  return (
    <div className="glass-panel" style={styles.card}>
      <div style={styles.content}>
        <span style={styles.title}>{title}</span>
        <span style={styles.value}>{value}</span>
      </div>
      <div style={{ ...styles.iconWrapper, background: `rgba(${color === 'var(--primary)' ? '139, 92, 246' : '6, 182, 212'}, 0.1)`, borderColor: color }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    flex: 1,
    minWidth: '220px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  value: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'var(--font-heading)',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
  },
};

export default StatCard;
