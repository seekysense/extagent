import React from 'react';
import { useLang } from '../../i18n';

export function AboutSection() {
  const { t } = useLang();

  return (
    <div className="card bg-base-100 shadow-md mb-6">
      <div className="card-body">
        <h2 className="card-title text-xl">{t('about.title')}</h2>
        <p className="mb-3">{t('about.desc1')}</p>
        <p>{t('about.desc2')}</p>
      </div>
    </div>
  );
}
