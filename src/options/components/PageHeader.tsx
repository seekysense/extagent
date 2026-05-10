import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{
      padding: '24px 32px 18px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
      flex: '0 0 auto',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: 'var(--text)' }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}
