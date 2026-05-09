import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useLang } from '../../i18n';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
  tabStatus: 'attached' | 'detached' | 'unknown' | 'running' | 'idle' | 'error';
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  onCancel,
  isProcessing,
  tabStatus,
}) => {
  const [prompt, setPrompt] = useState('');
  const { t } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing || tabStatus === 'detached') return;
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 relative">
      <div className="w-full">
        <TextareaAutosize
          className="textarea textarea-bordered w-full pr-12"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={
            tabStatus === 'detached'
              ? t('sidepanel.placeholderDisconnected')
              : t('sidepanel.placeholder')
          }
          autoFocus
          disabled={isProcessing || tabStatus === 'detached'}
          minRows={1}
          maxRows={10}
          style={{
            resize: 'none',
            minHeight: '40px',
            maxHeight: '300px',
            overflow: 'auto',
          } as any}
        />
        {isProcessing ? (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-sm btn-circle btn-error absolute"
            style={{ bottom: '5px', right: '5px' }}
            title={t('action.stop')}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-sm btn-circle btn-primary absolute"
            style={{ bottom: '5px', right: '5px' }}
            disabled={!prompt.trim() || tabStatus === 'detached'}
            title={tabStatus === 'detached' ? t('action.refreshTab') : t('action.send')}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        )}
      </div>
    </form>
  );
};
