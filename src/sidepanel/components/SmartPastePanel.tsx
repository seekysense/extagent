import React, { useState } from 'react';
import { useLang } from '../../i18n';

interface SmartPastePanelProps {
  onSubmit: (text: string) => Promise<void>;
  onClose: () => void;
}

export const SmartPastePanel: React.FC<SmartPastePanelProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState('');
  const { t } = useLang();

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
  };

  return (
    <div className="card bg-base-100 shadow-md mt-2 p-3" data-testid="smart-paste-panel">
      <textarea
        className="textarea textarea-bordered w-full text-sm"
        placeholder={t('quickactions.pasteHint')}
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
        data-testid="smart-paste-textarea"
      />
      <div className="flex gap-2 mt-2">
        <button
          className="btn btn-primary btn-sm flex-1"
          onClick={handleSubmit}
          disabled={!text.trim()}
          data-testid="smart-paste-submit"
        >
          {t('quickactions.compila')}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onClose} data-testid="smart-paste-close">
          ✕
        </button>
      </div>
    </div>
  );
};
