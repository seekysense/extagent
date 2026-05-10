import React from 'react';
import { StatusDot } from '../../ui';
import { LucideIcon } from '../../ui';

interface SPHeaderProps {
  tabName: string;
  tabStatus: string;
  onRefresh: () => void;
  onTabClick?: () => void;
}

export function SPHeader({ tabName, tabStatus, onRefresh }: SPHeaderProps) {
  const status = (['running', 'idle', 'error', 'detached', 'rec'].includes(tabStatus)
    ? tabStatus
    : 'idle') as 'running' | 'idle' | 'error' | 'detached' | 'rec';

  return (
    <div style={{
      height: 48, padding: '0 14px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', flex: '0 0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: -1 }}>∞</span>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>InfinitAgent</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 999, height: 26, maxWidth: 200,
      }}>
        <StatusDot status={status} />
        <span style={{
          fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130,
        }}>{tabName || 'no tab'}</span>
        <button
          title="Refresh tab"
          onClick={onRefresh}
          style={{
            background: 'transparent', border: 0, padding: 2, marginLeft: 2, cursor: 'pointer',
            color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4,
          }}
        >
          <LucideIcon name="RefreshCw" size={11.5} />
        </button>
      </div>
    </div>
  );
}
