import React from 'react';
import { Message } from '../types';
import { useLang } from '../../i18n';
import { LlmContent } from './LlmContent';
import { ScreenshotMessage } from './ScreenshotMessage';
import { ResultDisplay } from './ResultDisplay';
import { ExportBar } from './ExportBar';

interface MessageDisplayProps {
  messages: Message[];
  streamingSegments: Record<number, string>;
  isStreaming: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  streamingSegments,
  isStreaming,
}) => {
  const { t } = useLang();
  const filteredMessages = messages;

  if (filteredMessages.length === 0 && Object.keys(streamingSegments).length === 0) {
    return <p className="text-gray-500">{t('sidepanel.noOutput')}</p>;
  }

  return (
    <div>
      {filteredMessages.map((msg, index) => (
        <div key={`msg-${index}`} className="mb-2">
          {msg.type === 'system' ? (
            <div className="bg-base-200 px-3 py-1 rounded text-gray-500 text-sm">
              {msg.content}
            </div>
          ) : msg.type === 'screenshot' && msg.imageData ? (
            <ScreenshotMessage imageData={msg.imageData} mediaType={msg.mediaType} />
          ) : (
            <>
              <LlmContent content={msg.content} />
              {msg.structuredResult !== undefined && (
                <>
                  <ResultDisplay result={msg.structuredResult} />
                  <ExportBar result={msg.structuredResult} />
                </>
              )}
            </>
          )}
        </div>
      ))}

      {isStreaming && Object.entries(streamingSegments).map(([id, content]) => (
        <div key={`segment-${id}`} className="mb-2 animate-pulse">
          <LlmContent content={content} />
        </div>
      ))}
    </div>
  );
};
