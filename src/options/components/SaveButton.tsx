import React from 'react';
import { useLang } from '../../i18n';

interface SaveButtonProps {
  isSaving: boolean;
  saveStatus: string;
  handleSave: () => void;
  isDisabled: boolean;
}

export function SaveButton({ isSaving, saveStatus, handleSave, isDisabled }: SaveButtonProps) {
  const { t } = useLang();

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isSaving || isDisabled}
        className="btn btn-primary"
      >
        {isSaving ? t('save.saving') : t('save.save')}
      </button>

      {saveStatus && <div className="alert alert-success mt-4">{saveStatus}</div>}
    </>
  );
}
