import React from 'react';
import { Message } from '../types';
import { LlmContent } from './LlmContent';
import { ScreenshotMessage } from './ScreenshotMessage';
import { ResultDisplay } from './ResultDisplay';
import { ExportBar } from './ExportBar';
import { SystemPill } from './SystemPill';
import { ToolCallBubble } from './ToolCallBubble';
import { LlmBubble } from './LlmBubble';
import { UserBubble } from './UserBubble';

interface MessageDisplayProps {
  messages: Message[];
  streamingSegments: Record<number, string>;
  isStreaming: boolean;
}

function parseToolCall(content: string): { tool: string; args: string } | null {
  const m = content.match(/🕹️ tool:\s*(\w+)\s*(.*)/s);
  if (!m) return null;
  return { tool: m[1], args: m[2]?.trim() || '' };
}

function isUserPrompt(content: string): boolean {
  return content.startsWith('New prompt:');
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  streamingSegments,
  isStreaming,
}) => {
  if (messages.length === 0 && Object.keys(streamingSegments).length === 0) {
    return (
      <SystemPill>Nessun messaggio — digita qualcosa per iniziare</SystemPill>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {messages.map((msg, index) => (
        <div key={`msg-${index}`}>
          {msg.type === 'system' ? (
            isUserPrompt(msg.content) ? (
              <UserBubble>{msg.content.replace(/^New prompt:\s*"?/, '').replace(/"$/, '')}</UserBubble>
            ) : parseToolCall(msg.content) ? (
              (() => { const tc = parseToolCall(msg.content)!; return <ToolCallBubble tool={tc.tool} args={tc.args} />; })()
            ) : (
              <SystemPill>{msg.content}</SystemPill>
            )
          ) : msg.type === 'screenshot' && msg.imageData ? (
            <ScreenshotMessage imageData={msg.imageData} mediaType={msg.mediaType} />
          ) : (
            <>
              <LlmBubble>
                <LlmContent content={msg.content} />
              </LlmBubble>
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
        <LlmBubble key={`segment-${id}`} streaming>
          <LlmContent content={content} />
        </LlmBubble>
      ))}
    </div>
  );
};
