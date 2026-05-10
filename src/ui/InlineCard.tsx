import React from 'react';
import { LucideIcon } from './LucideIcon';

interface InlineCardProps {
  title?: React.ReactNode;
  subtitle?: string;
  icon?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  accent?: boolean;
}

export function InlineCard({ title, subtitle, icon, actions, children, accent }: InlineCardProps) {
  return (
    <div
      className="ia-card"
      style={{
        padding: 12,
        borderColor: accent ? 'var(--primary)' : 'var(--border)',
        borderWidth: accent ? 1.5 : 1,
      }}
    >
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: children ? 10 : 0 }}>
          {icon && (
            <div style={{
              width: 30, height: 30, borderRadius: 8, flex: '0 0 auto',
              background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <LucideIcon name={icon} size={15} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: 2, flex: '0 0 auto' }}>{actions}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
