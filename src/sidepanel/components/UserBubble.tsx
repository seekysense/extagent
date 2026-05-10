import React from 'react';

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px',
      borderLeft: '2px solid var(--text-subtle)',
    }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        You
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{children}</div>
    </div>
  );
}
