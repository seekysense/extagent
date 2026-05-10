import React from 'react';
import { LucideIcon } from './LucideIcon';

interface IconButtonProps {
  icon?: string;
  onClick?: () => void;
  title?: string;
  variant?: 'ghost' | 'outline' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export function IconButton({
  icon, onClick, title, variant = 'ghost', size = 'md',
  active, disabled, danger, children,
}: IconButtonProps) {
  const sizeMap = { sm: 22, md: 28, lg: 34 };
  const iconSize = { sm: 13, md: 15, lg: 17 }[size];
  const dim = sizeMap[size];

  const variantStyles: Record<string, React.CSSProperties> = {
    ghost:   { background: 'transparent' },
    outline: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' },
    primary: { background: 'var(--primary)', color: 'var(--primary-fg)' },
    danger:  { background: 'transparent', color: 'var(--error)' },
  };
  const activeStyle: React.CSSProperties = active
    ? { background: 'var(--primary-soft)', color: 'var(--primary)' }
    : {};

  const base: React.CSSProperties = {
    width: dim, height: dim, borderRadius: 6,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, transition: 'background .12s, border-color .12s, color .12s',
    color: 'var(--text-muted)', flex: '0 0 auto',
    ...variantStyles[variant],
    ...activeStyle,
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      aria-label={title}
      style={base}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'ghost' && !active)
          e.currentTarget.style.background = 'var(--surface-2)';
      }}
      onMouseLeave={(e) => {
        if (variant === 'ghost' && !active)
          e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon ? <LucideIcon name={icon} size={iconSize} color={danger ? 'var(--error)' : undefined} /> : children}
    </button>
  );
}
