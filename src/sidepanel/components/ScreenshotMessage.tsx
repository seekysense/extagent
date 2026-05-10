import React from 'react';
import { Chip } from '../../ui';

interface ScreenshotMessageProps {
  imageData: string;
  mediaType?: string;
}

export const ScreenshotMessage: React.FC<ScreenshotMessageProps> = ({
  imageData,
  mediaType = 'image/jpeg',
}) => {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="ia-card" style={{ padding: 8 }}>
      <div style={{ height: 110, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
        {imageData ? (
          <img
            src={`data:${mediaType};base64,${imageData}`}
            alt="screenshot"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            height: '100%',
            background: 'repeating-linear-gradient(135deg, var(--surface-2) 0 8px, var(--surface-3) 8px 16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10.5,
          }}>
            screenshot
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px 0' }}>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>captured {timestamp}</span>
        <Chip size="xs" tone="neutral" icon="Download">save</Chip>
      </div>
    </div>
  );
};
