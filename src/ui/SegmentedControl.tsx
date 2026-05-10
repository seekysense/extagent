import React from 'react';
import { LucideIcon } from './LucideIcon';

type Option = string | { value: string; label: string; icon?: string };

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl({ options, value, onChange, size = 'md' }: SegmentedControlProps) {
  const h = size === 'sm' ? 26 : 30;
  const fs = size === 'sm' ? 11.5 : 12.5;

  return (
    <div style={{
      display: 'inline-flex', padding: 2, gap: 0,
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 8, height: h,
    }}>
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        const icon = typeof opt === 'string' ? undefined : opt.icon;
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              border: 0, padding: '0 12px', borderRadius: 6, cursor: 'pointer',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: active ? 600 : 500, fontSize: fs,
              boxShadow: active ? 'var(--shadow-card)' : 'none',
              transition: 'background .12s, color .12s',
              fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            {icon && <LucideIcon name={icon} size={12} />}
            {lbl}
          </button>
        );
      })}
    </div>
  );
}
