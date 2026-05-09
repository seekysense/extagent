import { useState, useEffect } from 'react';
import { useLang } from '../i18n';
import { FunctionMapping, ModelProfile } from '../models/providers/types';
import { VerticalTabs } from './components/VerticalTabs';

export function Options() {
  const { t } = useLang();
  const [openaiCompatibleApiKey, setOpenaiCompatibleApiKey] = useState('');
  const [openaiCompatibleBaseUrl, setOpenaiCompatibleBaseUrl] = useState('');
  const [openaiCompatibleModelId, setOpenaiCompatibleModelId] = useState('');
  const [profiles, setProfiles] = useState<ModelProfile[]>([]);
  const [defaultProfileId, setDefaultProfileId] = useState('');
  const [functionMappings, setFunctionMappings] = useState<FunctionMapping[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    chrome.storage.sync.get({
      openaiCompatibleApiKey: '',
      openaiCompatibleBaseUrl: '',
      openaiCompatibleModelId: '',
      modelProfiles: [],
      defaultProfileId: '',
      functionMappings: [],
    }, (result) => {
      setOpenaiCompatibleApiKey(result.openaiCompatibleApiKey || '');
      setOpenaiCompatibleBaseUrl(result.openaiCompatibleBaseUrl || '');
      setOpenaiCompatibleModelId(result.openaiCompatibleModelId || '');
      setProfiles(result.modelProfiles || []);
      setDefaultProfileId(result.defaultProfileId || '');
      setFunctionMappings(result.functionMappings || []);
    });
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('');

    chrome.storage.sync.set({
      openaiCompatibleApiKey,
      openaiCompatibleBaseUrl,
      openaiCompatibleModelId,
      modelProfiles: profiles,
      defaultProfileId,
      functionMappings,
    }, () => {
      setIsSaving(false);
      setSaveStatus(t('options.saved'));

      chrome.runtime.sendMessage({ action: 'providerConfigChanged' })
        .catch(err => console.error('Error sending message:', err));

      setTimeout(() => setSaveStatus(''), 3000);
    });
  };

  return (
    <VerticalTabs
      openaiCompatibleApiKey={openaiCompatibleApiKey}
      setOpenaiCompatibleApiKey={setOpenaiCompatibleApiKey}
      openaiCompatibleBaseUrl={openaiCompatibleBaseUrl}
      setOpenaiCompatibleBaseUrl={setOpenaiCompatibleBaseUrl}
      openaiCompatibleModelId={openaiCompatibleModelId}
      setOpenaiCompatibleModelId={setOpenaiCompatibleModelId}
      profiles={profiles}
      setProfiles={setProfiles}
      defaultProfileId={defaultProfileId}
      setDefaultProfileId={setDefaultProfileId}
      functionMappings={functionMappings}
      setFunctionMappings={setFunctionMappings}
      isSaving={isSaving}
      saveStatus={saveStatus}
      handleSave={handleSave}
    />
  );
}
