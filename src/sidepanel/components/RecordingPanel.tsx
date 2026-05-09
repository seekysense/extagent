import React, { useState, useEffect, useCallback } from 'react';
import { useLang } from '../../i18n';
import { Recording } from '../../background/recordingManager';

interface RecordingPanelProps {
  onClose: () => void;
}

type PanelState = 'idle' | 'recording' | 'saving';

export const RecordingPanel: React.FC<RecordingPanelProps> = ({ onClose }) => {
  const { t } = useLang();
  const [panelState, setPanelState] = useState<PanelState>('idle');
  const [stepCount, setStepCount] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const loadRecordings = useCallback(async () => {
    const result = await chrome.storage.local.get('recordings');
    const all = (result.recordings as Record<string, Recording>) ?? {};
    setRecordings(Object.values(all));
  }, []);

  useEffect(() => {
    loadRecordings();
    const listener = (message: any) => {
      if (message.action === 'recordingStepAdded') {
        setStepCount(c => c + 1);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [loadRecordings]);

  const handleStart = () => {
    if (!name.trim()) return;
    setStepCount(0);
    chrome.runtime.sendMessage({ action: 'startRecordingCapture', name: name.trim() });
    setPanelState('recording');
  };

  const handleStop = () => {
    chrome.runtime.sendMessage({ action: 'stopRecordingCapture' });
    setPanelState('saving');
  };

  const handleSave = async () => {
    await chrome.runtime.sendMessage({
      action: 'saveRecording',
      description: description.trim(),
    });
    setName('');
    setDescription('');
    setPanelState('idle');
    await loadRecordings();
  };

  const handleCancel = () => {
    chrome.runtime.sendMessage({ action: 'cancelRecording' });
    setName('');
    setDescription('');
    setPanelState('idle');
  };

  const handleDelete = async (recName: string) => {
    await chrome.runtime.sendMessage({ action: 'deleteRecording', name: recName });
    await loadRecordings();
  };

  const handlePlay = (recName: string) => {
    chrome.runtime.sendMessage({ action: 'playRecording', name: recName });
    onClose();
  };

  const handleExport = (rec: Recording) => {
    const data = JSON.stringify(rec, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rec.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="recording-panel" className="mt-2 p-3 bg-base-200 rounded-lg">
      {panelState === 'idle' && (
        <div className="flex flex-col gap-2">
          <input
            className="input input-xs w-full"
            placeholder={t('recording.namePlaceholder')}
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="recording-name-input"
          />
          <button
            className="btn btn-xs btn-error w-full"
            onClick={handleStart}
            disabled={!name.trim()}
            data-testid="btn-start-recording"
          >
            {t('recording.start')}
          </button>
        </div>
      )}

      {panelState === 'recording' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2" data-testid="recording-status">
            <span className="text-error animate-pulse">●</span>
            <span className="text-xs font-semibold">REC</span>
            <span className="text-xs">{stepCount} {t('recording.steps')}</span>
          </div>
          <button
            className="btn btn-xs btn-warning w-full"
            onClick={handleStop}
            data-testid="btn-stop-recording"
          >
            {t('recording.stop')}
          </button>
        </div>
      )}

      {panelState === 'saving' && (
        <div className="flex flex-col gap-2" data-testid="recording-save-form">
          <input
            className="input input-xs w-full"
            placeholder={t('recording.descPlaceholder')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            data-testid="recording-desc-input"
          />
          <div className="flex gap-1">
            <button
              className="btn btn-xs btn-primary flex-1"
              onClick={handleSave}
              data-testid="btn-save-recording"
            >
              {t('recording.save')}
            </button>
            <button
              className="btn btn-xs btn-ghost flex-1"
              onClick={handleCancel}
              data-testid="btn-cancel-recording"
            >
              {t('recording.cancel')}
            </button>
          </div>
        </div>
      )}

      {recordings.length > 0 && (
        <div className="mt-2" data-testid="recording-list">
          {recordings.map(rec => (
            <div
              key={rec.name}
              className="flex items-center gap-1 py-1 border-b border-base-300 last:border-0"
              data-testid={`recording-item-${rec.name}`}
            >
              <span className="flex-1 text-xs truncate">
                {rec.name} ({rec.steps.length})
              </span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => handlePlay(rec.name)}
                data-testid={`btn-play-${rec.name}`}
                title={t('recording.play')}
              >
                ▶
              </button>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => handleExport(rec)}
                data-testid={`btn-export-${rec.name}`}
                title={t('recording.export')}
              >
                ⬇
              </button>
              <button
                className="btn btn-xs btn-ghost text-error"
                onClick={() => handleDelete(rec.name)}
                data-testid={`btn-delete-${rec.name}`}
                title={t('recording.delete')}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
