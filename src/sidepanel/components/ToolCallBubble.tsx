import React from 'react';
import { LucideIcon } from '../../ui';

interface ToolCallBubbleProps {
  tool: string;
  args: string;
  result?: string;
}

export function ToolCallBubble({ tool, args, result }: ToolCallBubbleProps) {
  return (
    <div style={{
      borderLeft: '2px solid var(--primary)', background: 'var(--surface-2)',
      borderRadius: '0 8px 8px 0', padding: '8px 10px', fontFamily: 'var(--font-mono)',
      fontSize: 11, color: 'var(--text)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 4 }}>
        <LucideIcon name="Wrench" size={11} />
        <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>tool · {tool}</span>
      </div>
      <div style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--text-muted)' }}>args: </span>{args}
      </div>
      {result && (
        <div style={{ marginTop: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>→ </span>
          <span style={{ color: 'var(--success)' }}>{result}</span>
        </div>
      )}
    </div>
  );
}
