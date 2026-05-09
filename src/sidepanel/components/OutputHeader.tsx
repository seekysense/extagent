import { faTrash, faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useLang } from '../../i18n';

interface OutputHeaderProps {
  onClearHistory: () => void;
  onReflectAndLearn: () => void;
  isProcessing: boolean;
}

export const OutputHeader: React.FC<OutputHeaderProps> = ({
  onClearHistory,
  onReflectAndLearn,
  isProcessing,
}) => {
  const { t } = useLang();

  return (
    <div className="flex justify-between items-center bg-base-300 p-3">
      <div className="card-title text-base-content text-lg">
        {t('output.title')}
      </div>
      <div className="flex items-center gap-2">
        <div className="tooltip tooltip-bottom" data-tip={t('action.reflect')}>
          <button
            onClick={onReflectAndLearn}
            className="btn btn-sm btn-outline btn-primary"
            disabled={isProcessing}
          >
            <FontAwesomeIcon icon={faBrain} />
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={t('action.clear')}>
          <button
            onClick={onClearHistory}
            className="btn btn-sm btn-outline"
            disabled={isProcessing}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
