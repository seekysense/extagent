import React from 'react';

interface SectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
          {description && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
