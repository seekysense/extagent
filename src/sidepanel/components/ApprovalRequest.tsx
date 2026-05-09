import React from 'react';
import { useLang } from '../../i18n';

interface ApprovalRequestProps {
  requestId: string;
  toolName: string;
  toolInput: string;
  reason: string;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function ApprovalRequest({
  requestId,
  toolName,
  toolInput,
  reason,
  onApprove,
  onReject,
}: ApprovalRequestProps) {
  const { t } = useLang();

  return (
    <div className="card bg-warning text-warning-content p-4 my-2">
      <h3 className="font-bold">{t('approval.title')}</h3>
      <p>{t('approval.desc')}</p>
      <div className="bg-base-300 p-2 my-2 rounded">
        <p><strong>{t('approval.tool')}</strong> {toolName}</p>
        <p><strong>{t('approval.input')}</strong> {toolInput}</p>
        {reason && <p><strong>{t('approval.reason')}</strong> {reason}</p>}
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button
          className="btn btn-error"
          onClick={() => onReject(requestId)}
        >
          {t('approval.deny')}
        </button>
        <button
          className="btn btn-success"
          onClick={() => onApprove(requestId)}
        >
          {t('approval.approve')}
        </button>
      </div>
    </div>
  );
}
