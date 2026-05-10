import React, { useState } from 'react';
import { TaskEntry } from '../hooks/useTaskHistory';
import { Chip } from '../../ui';
import { LucideIcon } from '../../ui';

interface TaskHistoryProps {
  history: TaskEntry[];
  onRerun: (prompt: string) => void;
}

export function TaskHistory({ history, onRerun }: TaskHistoryProps) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div style={{ padding: '0 14px 8px', flex: '0 0 auto' }} data-testid="task-history">
      <button
        onClick={() => setOpen(o => !o)}
        data-testid="btn-toggle-history"
        style={{
          height: 28, width: '100%', padding: '0 8px', borderRadius: 6, border: 0,
          background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600 }}>
          <LucideIcon name="History" size={13} /> History
          <Chip size="xs">{history.length}</Chip>
        </span>
        <LucideIcon name={open ? 'ChevronDown' : 'ChevronRight'} size={13} />
      </button>
      {open && (
        <div className="ia-expand-in" style={{ paddingTop: 4, display: 'flex', flexDirection: 'column' }} data-testid="history-list">
          {[...history].reverse().map((entry) => (
            <div
              key={entry.id}
              className="ia-row-hover"
              data-testid={`history-item-${entry.id}`}
              style={{
                height: 30, padding: '0 8px', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              }}
            >
              <span style={{ fontSize: 11.5, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.prompt.length > 60 ? entry.prompt.slice(0, 60) + '…' : entry.prompt}
              </span>
              <button
                title="Re-run"
                onClick={() => onRerun(entry.prompt)}
                data-testid={`btn-rerun-${entry.id}`}
                style={{
                  background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4, flex: '0 0 auto',
                }}
              >
                <LucideIcon name="RotateCcw" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
