import React, { useEffect, useState } from 'react';
import { useLang } from '../../i18n';

interface SmartExtractPanelProps {
  analyzePageForExtraction: () => Promise<void>;
  onExtract: (hint: string, format: string, paginate: boolean) => Promise<void>;
  onClose: () => void;
}

export const SmartExtractPanel: React.FC<SmartExtractPanelProps> = ({
  analyzePageForExtraction,
  onExtract,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [analyzed, setAnalyzed] = useState(false);
  const [format, setFormat] = useState('json');
  const { t } = useLang();

  useEffect(() => {
    analyzePageForExtraction().then(() => {
      setLoading(false);
      setAnalyzed(true);
    }).catch(() => {
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExtract = async () => {
    await onExtract('', format, false);
  };

  return (
    <div className="card bg-base-100 shadow-md mt-2 p-3" data-testid="smart-extract-panel">
      {loading && (
        <p className="text-sm text-gray-500" data-testid="smart-extract-loading">
          {t('quickactions.analyzeHint')}
        </p>
      )}
      {analyzed && (
        <div className="flex gap-2 items-center mt-1" data-testid="smart-extract-ready">
          <select
            className="select select-bordered select-sm flex-1"
            value={format}
            onChange={e => setFormat(e.target.value)}
            data-testid="smart-extract-format"
          >
            <option value="json">{t('quickactions.format.json')}</option>
            <option value="csv">{t('quickactions.format.csv')}</option>
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExtract}
            data-testid="smart-extract-submit"
          >
            {t('quickactions.extractNow')}
          </button>
        </div>
      )}
      <button className="btn btn-ghost btn-xs mt-2" onClick={onClose} data-testid="smart-extract-close">
        ✕
      </button>
    </div>
  );
};
