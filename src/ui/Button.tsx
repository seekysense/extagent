import React from 'react';
import { LucideIcon } from './LucideIcon';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  danger?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  icon, iconRight, disabled, fullWidth, danger, type = 'button',
}: ButtonProps) {
  const sizes = {
    sm: { h: 28, px: 10, fs: 12 },
    md: { h: 34, px: 14, fs: 13 },
    lg: { h: 40, px: 18, fs: 14 },
  }[size];

  const bg = {
    primary: 'var(--primary)',
    outline: 'var(--surface)',
    ghost: 'transparent',
    danger: 'var(--error)',
  }[variant];

  const fg = {
    primary: 'var(--primary-fg)',
    outline: 'var(--text)',
    ghost: 'var(--text-muted)',
    danger: '#fff',
  }[variant];

  const bd = {
    primary: 'var(--primary)',
    outline: 'var(--border)',
    ghost: 'transparent',
    danger: 'var(--error)',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
        background: bg,
        color: danger ? 'var(--error)' : fg,
        border: `1px solid ${danger ? 'var(--error)' : bd}`,
        borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : 'auto', fontFamily: 'inherit',
        transition: 'background .12s, border-color .12s, transform .06s',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0.5px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {icon && <LucideIcon name={icon} size={sizes.fs + 1} />}
      {children}
      {iconRight && <LucideIcon name={iconRight} size={sizes.fs + 1} />}
    </button>
  );
}
