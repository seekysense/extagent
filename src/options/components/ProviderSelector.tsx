import React from 'react';
import { useLang } from '../../i18n';

export function ProviderSelector() {
  const { t } = useLang();

  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text font-medium">{t('provider.selector.label')}</span>
      </label>
      <div className="input input-bordered flex items-center bg-base-200 cursor-default select-none">
        {t('provider.openaiCompatible')}
      </div>
    </div>
  );
}
