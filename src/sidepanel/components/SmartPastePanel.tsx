import React, { useState } from 'react';
import { Button, Chip } from '../../ui';
import { LucideIcon } from '../../ui';

interface SmartPastePanelProps {
  onSubmit: (text: string) => Promise<void>;
  onClose: () => void;
}

export const SmartPastePanel: React.FC<SmartPastePanelProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
  };

  return (
    <div className="ia-expand-in" style={{ padding: '0 14px 8px' }}>
      <div className="ia-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LucideIcon name="ClipboardPaste" size={13} color="var(--primary)" /> Smart Paste
          </span>
          <Chip size="xs">↵ to fill</Chip>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Incolla qui nome, email, telefono…"
          data-testid="smart-paste-textarea"
          style={{
            border: '1px solid var(--border)', borderRadius: 6, padding: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)',
            background: 'var(--surface-2)', resize: 'none', outline: 'none', minHeight: 70,
            width: '100%', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
            {text.trim() ? `${text.split('\n').filter(Boolean).length} fields detected` : 'Paste your data above'}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
            <Button size="sm" icon="Wand2" onClick={handleSubmit} disabled={!text.trim()}>Fill Form</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
