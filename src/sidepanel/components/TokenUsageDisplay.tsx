import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ConfigManager, ProviderConfig } from '../../background/configManager';
import { useLang } from '../../i18n';
import { TokenTrackingService, TokenUsage } from '../../tracking/tokenTrackingService';

const formatTokenCount = (count: number): string => {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1) + 'k';
};

export function TokenUsageDisplay() {
  const [usage, setUsage] = useState<TokenUsage>({ inputTokens: 0, outputTokens: 0, cost: 0 });
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const { t } = useLang();

  useEffect(() => {
    const tokenTracker = TokenTrackingService.getInstance();
    const configManager = ConfigManager.getInstance();

    const initialUsage = tokenTracker.getUsage();
    setUsage(initialUsage);

    const unsubscribe = tokenTracker.subscribe(() => {
      setUsage(tokenTracker.getUsage());
    });

    configManager.getProviderConfig().then(config => {
      setProviderConfig(config);
      tokenTracker.updateProviderAndModel(config.provider, config.apiModelId || '');
    });

    const messageListener = (message: any) => {
      if (message.action === 'tokenUsageUpdated' && message.content) {
        setUsage(message.content);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    chrome.runtime.sendMessage({ action: 'getTokenUsage' });

    return () => {
      unsubscribe();
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <div className="card bg-base-100 shadow-sm p-3 mt-2 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-medium">{t('token.usage')}</span>
        <span>
          <FontAwesomeIcon icon={faArrowUp} /> {formatTokenCount(usage.inputTokens)}{' '}
          <FontAwesomeIcon icon={faArrowDown} /> {formatTokenCount(usage.outputTokens)}
        </span>
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-medium">{t('token.cost')}</span>
        <span>${usage.cost.toFixed(6)}</span>
      </div>
    </div>
  );
}
