import React, { useEffect, useState } from 'react';
import { Button, Chip, SegmentedControl } from '../../ui';
import { LucideIcon } from '../../ui';

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
  const [format, setFormat] = useState('JSON');
  const [paginate, setPaginate] = useState(false);

  useEffect(() => {
    analyzePageForExtraction().then(() => setLoading(false)).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExtract = async () => {
    await onExtract('', format.toLowerCase(), paginate);
  };

  return (
    <div className="ia-expand-in" style={{ padding: '0 14px 8px' }}>
      <div className="ia-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LucideIcon name="ScanText" size={13} color="var(--primary)" /> Smart Extract
          </span>
          <SegmentedControl size="sm" options={['JSON', 'CSV']} value={format} onChange={setFormat} />
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
          <input
            type="checkbox"
            checked={paginate}
            onChange={(e) => setPaginate(e.target.checked)}
            style={{ accentColor: 'var(--primary)' }}
          />
          Multi-page (paginazione)
        </label>
        {loading ? (
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }} data-testid="smart-extract-loading">
            Analisi pagina…
          </div>
        ) : (
          <div data-testid="smart-extract-ready">
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Detected fields
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['data', 'testo', 'link', 'prezzo'].map((f) => (
                <Chip key={f} size="xs" tone="primary">{f}</Chip>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="ghost" onClick={onClose} data-testid="smart-extract-close">✕</Button>
          <Button size="sm" icon="ScanText" fullWidth onClick={handleExtract} data-testid="smart-extract-submit">
            Extract {format}
          </Button>
        </div>
      </div>
    </div>
  );
};
