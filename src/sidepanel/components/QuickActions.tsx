import React, { useState } from 'react';
import { useLang } from '../../i18n';
import { useQuickActions } from '../hooks/useQuickActions';
import { RecordingPanel } from './RecordingPanel';
import { SmartExtractPanel } from './SmartExtractPanel';
import { SmartPastePanel } from './SmartPastePanel';

interface QuickActionsProps {
  executePrompt: (prompt: string) => Promise<void>;
  isProcessing: boolean;
}

type OpenPanel = 'smartPaste' | 'smartExtract' | 'recording' | null;

export const QuickActions: React.FC<QuickActionsProps> = ({ executePrompt, isProcessing }) => {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const { t } = useLang();
  const { startSmartPaste, analyzePageForExtraction, startSmartExtract } = useQuickActions({ executePrompt });

  const toggle = (panel: Exclude<OpenPanel, null>) =>
    setOpenPanel(prev => (prev === panel ? null : panel));

  return (
    <div data-testid="quick-actions">
      <div className="flex gap-1 mt-2">
        <button
          className="btn btn-xs btn-outline flex-1"
          onClick={() => toggle('smartPaste')}
          disabled={isProcessing}
          data-testid="btn-smart-paste"
        >
          {t('quickactions.smartPaste')}
        </button>
        <button
          className="btn btn-xs btn-outline flex-1"
          onClick={() => toggle('smartExtract')}
          disabled={isProcessing}
          data-testid="btn-smart-extract"
        >
          {t('quickactions.smartExtract')}
        </button>
        <button
          className="btn btn-xs btn-outline flex-1"
          onClick={() => toggle('recording')}
          disabled={isProcessing}
          data-testid="btn-automate"
        >
          {t('quickactions.automate')}
        </button>
      </div>

      {openPanel === 'recording' && (
        <RecordingPanel onClose={() => setOpenPanel(null)} />
      )}

      {openPanel === 'smartPaste' && (
        <SmartPastePanel
          onSubmit={async text => {
            await startSmartPaste(text);
            setOpenPanel(null);
          }}
          onClose={() => setOpenPanel(null)}
        />
      )}

      {openPanel === 'smartExtract' && (
        <SmartExtractPanel
          analyzePageForExtraction={analyzePageForExtraction}
          onExtract={async (hint, format, paginate) => {
            await startSmartExtract(hint, format, paginate);
            setOpenPanel(null);
          }}
          onClose={() => setOpenPanel(null)}
        />
      )}
    </div>
  );
};
