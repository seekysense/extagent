import React from 'react';

export function SystemPill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
      <span style={{
        fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
        background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 999,
      }}>{children}</span>
    </div>
  );
}
