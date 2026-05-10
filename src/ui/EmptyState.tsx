import React from 'react';
import { LucideIcon } from './LucideIcon';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  cta?: React.ReactNode;
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: '32px 20px', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
      }}>
        <LucideIcon name={icon} size={26} strokeWidth={1.4} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        {description && (
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, maxWidth: 260, lineHeight: 1.5 }}>
            {description}
          </div>
        )}
      </div>
      {cta}
    </div>
  );
}
