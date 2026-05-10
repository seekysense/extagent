import React from 'react';
import { LucideIcon } from '../../ui';

interface LlmBubbleProps {
  children: React.ReactNode;
  streaming?: boolean;
}

export function LlmBubble({ children, streaming }: LlmBubbleProps) {
  return (
    <div className="ia-card" style={{ padding: 12, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 5, background: 'var(--primary-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
        }}>
          <LucideIcon name="Sparkles" size={11} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.3, textTransform: 'uppercase' }}>
          Assistant
        </span>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text)' }}>
        {children}
        {streaming && <span className="ia-caret" />}
      </div>
    </div>
  );
}
