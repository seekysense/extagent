import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

interface FloatingInputProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  icon?: string;
  suffix?: React.ReactNode;
  mono?: boolean;
  placeholder?: string;
}

export function FloatingInput({ label, value, onChange, type = 'text', icon, suffix, mono, placeholder }: FloatingInputProps) {
  const [focus, setFocus] = useState(false);
  const filled = !!value || focus;

  return (
    <div style={{ position: 'relative' }}>
      <label
        style={{
          position: 'absolute', left: icon ? 30 : 12,
          top: filled ? 4 : '50%',
          transform: filled ? 'none' : 'translateY(-50%)',
          fontSize: filled ? 10.5 : 12.5,
          color: focus ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: filled ? 600 : 400, letterSpacing: filled ? 0.4 : 0,
          pointerEvents: 'none', transition: 'all .15s', textTransform: filled ? 'uppercase' : 'none',
          background: 'transparent',
        }}
      >{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 44, padding: icon ? '0 8px 0 10px' : '0 8px 0 12px',
        background: 'var(--surface)', border: `1px solid ${focus ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 8, transition: 'border-color .12s',
        boxShadow: focus ? '0 0 0 3px var(--primary-soft)' : 'none',
      }}>
        {icon && (
          <span style={{ marginRight: 6, color: 'var(--text-muted)' }}>
            <LucideIcon name={icon} size={14} />
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          type={type}
          placeholder={focus ? placeholder : ''}
          style={{
            flex: 1, border: 0, outline: 'none', background: 'transparent',
            fontSize: 12.5, color: 'var(--text)', paddingTop: filled ? 12 : 0,
            fontFamily: mono ? 'var(--font-mono)' : 'inherit',
            minWidth: 0,
          }}
        />
        {suffix}
      </div>
    </div>
  );
}
