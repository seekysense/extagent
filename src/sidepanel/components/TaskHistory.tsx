import React, { useState } from 'react';
import { TaskEntry } from '../hooks/useTaskHistory';
import { useLang } from '../../i18n';

interface TaskHistoryProps {
  history: TaskEntry[];
  onRerun: (prompt: string) => void;
}

export function TaskHistory({ history, onRerun }: TaskHistoryProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="mt-2" data-testid="task-history">
      <button
        className="btn btn-xs btn-ghost w-full justify-start"
        onClick={() => setOpen(o => !o)}
        data-testid="btn-toggle-history"
      >
        {open ? '▾' : '▸'} {t('history.title')} ({history.length})
      </button>
      {open && (
        <div
          className="flex flex-col gap-1 mt-1 max-h-48 overflow-auto"
          data-testid="history-list"
        >
          {[...history].reverse().map(entry => (
            <div
              key={entry.id}
              className="flex items-center gap-2 px-2 py-1 bg-base-200 rounded text-xs"
              data-testid={`history-item-${entry.id}`}
            >
              <span className="flex-1 truncate" title={entry.prompt}>
                {entry.prompt.length > 60 ? entry.prompt.slice(0, 60) + '…' : entry.prompt}
              </span>
              <span className="text-gray-400 shrink-0">
                {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                className="btn btn-xs btn-ghost shrink-0"
                onClick={() => onRerun(entry.prompt)}
                data-testid={`btn-rerun-${entry.id}`}
              >
                {t('history.rerun')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
