import React, { useState } from 'react';
import { useQuickActions } from '../hooks/useQuickActions';
import { RecordingPanel } from './RecordingPanel';
import { SmartExtractPanel } from './SmartExtractPanel';
import { SmartPastePanel } from './SmartPastePanel';

interface QuickActionsProps {
  executePrompt: (prompt: string) => Promise<void>;
  isProcessing: boolean;
}

type OpenPanel = 'smartPaste' | 'smartExtract' | 'recording' | null;

const items = [
  { id: 'smartPaste' as const,   icon: 'ClipboardPaste', label: 'Smart Paste' },
  { id: 'smartExtract' as const, icon: 'ScanText',       label: 'Smart Extract' },
  { id: 'recording' as const,    icon: 'CircleDot',      label: 'Automate' },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ executePrompt, isProcessing }) => {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const { startSmartPaste, analyzePageForExtraction, startSmartExtract } = useQuickActions({ executePrompt });

  const toggle = (panel: Exclude<OpenPanel, null>) =>
    setOpenPanel(prev => (prev === panel ? null : panel));

  return (
    <div data-testid="quick-actions">
      {openPanel === 'recording' && <RecordingPanel onClose={() => setOpenPanel(null)} />}
      {openPanel === 'smartPaste' && (
        <SmartPastePanel
          onSubmit={async (text) => { await startSmartPaste(text); setOpenPanel(null); }}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === 'smartExtract' && (
        <SmartExtractPanel
          analyzePageForExtraction={analyzePageForExtraction}
          onExtract={async (hint, format, paginate) => { await startSmartExtract(hint, format, paginate); setOpenPanel(null); }}
          onClose={() => setOpenPanel(null)}
        />
      )}
      <div style={{
        display: 'flex', gap: 6, padding: '0 14px 8px', flex: '0 0 auto',
        borderTop: '1px solid var(--border)', paddingTop: 10,
      }}>
        {items.map((it) => {
          const on = openPanel === it.id;
          const isRec = it.id === 'recording' && on;
          return (
            <button
              key={it.id}
              data-testid={`btn-${it.id === 'smartPaste' ? 'smart-paste' : it.id === 'smartExtract' ? 'smart-extract' : 'automate'}`}
              onClick={() => toggle(it.id)}
              disabled={isProcessing}
              style={{
                flex: 1, height: 30, borderRadius: 999, padding: '0 10px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                fontSize: 11.5, fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', border: '1px solid',
                background: on ? 'var(--primary-soft)' : 'var(--surface)',
                borderColor: on ? 'transparent' : 'var(--border)',
                color: isRec ? 'var(--error)' : (on ? 'var(--primary)' : 'var(--text)'),
                transition: 'background .12s, border-color .12s',
                opacity: isProcessing ? 0.5 : 1,
              }}
            >
              {isRec
                ? <span className="ia-dot-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--error)', color: 'var(--error)' }} />
                : <span style={{ fontSize: 11 }}>●</span>}
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
