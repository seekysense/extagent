import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

interface CodeBlockProps {
  lang?: string;
  children: string;
  copyable?: boolean;
}

export function CodeBlock({ lang = 'bash', children, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div style={{
      background: 'var(--code-bg)', borderRadius: 8, overflow: 'hidden',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.55)',
        letterSpacing: 0.4, textTransform: 'lowercase',
      }}>
        <span>{lang}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent', border: 0, padding: '2px 6px', borderRadius: 4,
              color: copied ? 'var(--success)' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <LucideIcon name={copied ? 'Check' : 'Copy'} size={11} />
            {copied ? 'copied' : 'copy'}
          </button>
        )}
      </div>
      <pre style={{
        margin: 0, padding: '10px 12px', fontFamily: 'var(--font-mono)',
        fontSize: 11.5, lineHeight: 1.55, color: 'var(--code-fg)',
        overflowX: 'auto', whiteSpace: 'pre',
      }}>{children}</pre>
    </div>
  );
}
