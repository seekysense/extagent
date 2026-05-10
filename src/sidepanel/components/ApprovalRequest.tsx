import React from 'react';
import { Button } from '../../ui';
import { LucideIcon } from '../../ui';

interface ApprovalRequestProps {
  requestId: string;
  toolName: string;
  toolInput: string;
  reason: string;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function ApprovalRequest({
  requestId,
  toolName,
  toolInput,
  reason,
  onApprove,
  onReject,
}: ApprovalRequestProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)',
      backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 5,
    }}>
      <div className="ia-card" style={{ width: '100%', boxShadow: 'var(--shadow-modal)', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 14px', background: 'var(--warning-soft)',
          borderBottom: '1px solid var(--warning)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <LucideIcon name="ShieldAlert" size={16} color="var(--warning)" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--warning)' }}>Conferma esecuzione</span>
        </div>
        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px 10px', fontSize: 11.5 }}>
          <span style={{ color: 'var(--text-muted)' }}>tool</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{toolName}</span>
          <span style={{ color: 'var(--text-muted)' }}>input</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', wordBreak: 'break-all' }}>{toolInput}</span>
          {reason && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>reason</span>
              <span style={{ color: 'var(--text)' }}>{reason}</span>
            </>
          )}
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <Button variant="outline" icon="X" fullWidth onClick={() => onReject(requestId)}>Reject</Button>
          <Button icon="Check" fullWidth onClick={() => onApprove(requestId)}>Approve</Button>
        </div>
      </div>
    </div>
  );
}
