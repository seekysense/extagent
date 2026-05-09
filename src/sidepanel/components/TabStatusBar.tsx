import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { useLang } from '../../i18n';

interface TabStatusBarProps {
  tabId: number | null;
  tabTitle: string;
  tabStatus: 'attached' | 'detached' | 'unknown' | 'running' | 'idle' | 'error';
}

export const TabStatusBar: React.FC<TabStatusBarProps> = ({
  tabId,
  tabTitle,
  tabStatus,
}) => {
  const [tabUrl, setTabUrl] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    if (!tabId) return;

    const statusListener = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (sender.id !== chrome.runtime.id) return;
      if (message.tabId !== tabId) return;

      if (message.action === 'targetChanged' && message.url) {
        setTabUrl(message.url);
        sendResponse({ received: true });
      }
      return true;
    };

    chrome.runtime.onMessage.addListener(statusListener);

    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) return;
      if (tab && tab.url) setTabUrl(tab.url);
    });

    return () => {
      chrome.runtime.onMessage.removeListener(statusListener);
    };
  }, [tabId]);

  if (!tabId) return null;

  const handleTabClick = () => {
    chrome.runtime.sendMessage({ action: 'switchToTab', tabId });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    chrome.runtime.sendMessage({
      action: 'updateOutput',
      content: { type: 'system', content: 'Refreshing connection to tab...' },
    });
    setTimeout(() => window.location.reload(), 500);
  };

  const statusTitle =
    tabStatus === 'attached' ? t('tab.connected') :
    tabStatus === 'detached' ? t('tab.disconnected') :
    tabStatus === 'running' ? t('agent.running') :
    tabStatus === 'idle' ? t('agent.idle') :
    tabStatus === 'error' ? t('agent.error') :
    t('agent.unknown');

  return (
    <div className="text-sm bg-base-300 rounded-md px-2 py-1 border border-base-content border-opacity-10 flex items-center justify-between max-w-[200px]">
      <div className="flex items-center flex-grow overflow-hidden">
        <div
          className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
            tabStatus === 'attached' ? 'bg-green-500 animate-pulse' :
            tabStatus === 'detached' ? 'bg-red-500' :
            tabStatus === 'running' ? 'bg-blue-500 animate-pulse' :
            tabStatus === 'idle' ? 'bg-green-500' :
            tabStatus === 'error' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
          }`}
          title={statusTitle}
        />
        <span
          className="cursor-pointer hover:underline hover:text-primary truncate"
          onClick={handleTabClick}
          title={`${tabTitle}${tabUrl ? `\n${tabUrl}` : ''}`}
        >
          {tabTitle}
        </span>
      </div>

      <div className="flex items-center ml-2">
        <button
          className="px-1.5 py-0.5 bg-base-200 hover:bg-primary hover:text-primary-content rounded text-xs border border-base-content border-opacity-20"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title={t('tab.attach')}
        >
          <FontAwesomeIcon
            icon={faSync}
            className={isRefreshing ? 'animate-spin' : ''}
            size="xs"
          />
        </button>
      </div>
    </div>
  );
};
