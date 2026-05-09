import React from 'react';
import { useLang } from '../../i18n';

interface ScreenshotMessageProps {
  imageData: string;
  mediaType?: string;
}

export const ScreenshotMessage: React.FC<ScreenshotMessageProps> = ({
  imageData,
  mediaType = 'image/jpeg',
}) => {
  const { t } = useLang();

  return (
    <div className="my-2">
      <div className="text-sm text-gray-500 mb-1">{t('screenshot.label')}</div>
      <img
        src={`data:${mediaType};base64,${imageData}`}
        alt={t('screenshot.alt')}
        className="max-w-full rounded shadow-md"
        style={{ maxHeight: '400px' }}
      />
    </div>
  );
};
