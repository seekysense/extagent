import React, { useState } from 'react';
import { LucideIcon } from '../../ui';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
  tabStatus: 'attached' | 'detached' | 'unknown' | 'running' | 'idle' | 'error';
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  onCancel,
  isProcessing,
  tabStatus,
}) => {
  const [prompt, setPrompt] = useState('');
  const isDetached = tabStatus === 'detached';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing || isDetached) return;
    onSubmit(prompt);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div style={{ padding: '6px 14px 14px', flex: '0 0 auto', background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit}>
        <div className="ia-card" style={{ boxShadow: 'var(--shadow-card)', padding: 8, borderRadius: 12 }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDetached ? 'Tab disconnesso — clicca Refresh' : 'Chiedi a InfinitAgent…'}
            autoFocus
            disabled={isProcessing || isDetached}
            rows={2}
            style={{
              width: '100%', minHeight: 38, maxHeight: 160, resize: 'none',
              border: 0, outline: 'none', fontFamily: 'inherit', fontSize: 13,
              color: 'var(--text)', background: 'transparent', padding: '4px 6px',
              lineHeight: 1.5, boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 10.5 }}>
              <span className="ia-kbd">↵</span><span>send</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span className="ia-kbd">⇧↵</span><span>newline</span>
            </div>
            <button
              type={isProcessing ? 'button' : 'submit'}
              onClick={isProcessing ? onCancel : undefined}
              title={isProcessing ? 'Cancel' : 'Send'}
              style={{
                width: 32, height: 32, borderRadius: 999, border: 0, cursor: 'pointer',
                background: isProcessing ? 'var(--error)' : 'var(--primary)',
                color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s, transform .15s',
                transform: isProcessing ? 'rotate(90deg)' : 'rotate(0)',
                opacity: (!prompt.trim() && !isProcessing) ? 0.5 : 1,
              }}
            >
              <LucideIcon name={isProcessing ? 'X' : 'SendHorizontal'} size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </form>
      <ProviderChipInline />
    </div>
  );
};

interface ChipInfo {
  profileName: string;
}

function ProviderChipInline() {
  const [info, setInfo] = useState<ChipInfo | null>(null);

  const loadInfo = React.useCallback(() => {
    import('../../background/configManager').then(({ ConfigManager }) => {
      const cfg = ConfigManager.getInstance();
      cfg.getActiveProfile().then((profile) => {
        setInfo({ profileName: profile?.name || 'default' });
      }).catch(() => {});
    });
  }, []);

  React.useEffect(() => {
    loadInfo();
    const handler = () => loadInfo();
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }, [loadInfo]);

  if (!info) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 6 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 22,
        padding: '0 10px', borderRadius: 999, background: 'var(--surface-2)',
        border: '1px solid var(--border)', fontSize: 10.5, color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', minWidth: 0, overflow: 'hidden',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--primary)', fontWeight: 600 }}>{info.profileName}</span>
      </span>
      <button
        onClick={() => chrome.runtime.openOptionsPage()}
        title="Impostazioni"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: 6, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
          flexShrink: 0, padding: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
      >
        <LucideIcon name="Settings" size={12} />
      </button>
    </div>
  );
}
