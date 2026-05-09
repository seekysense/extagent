import React from 'react';
import { FunctionMapping, ModelProfile } from '../../../models/providers/types';
import { useLang } from '../../../i18n';
import { ProviderSelector } from '../ProviderSelector';
import { ProviderSettings } from '../ProviderSettings';
import { SaveButton } from '../SaveButton';

interface ProvidersTabProps {
  openaiCompatibleApiKey: string;
  setOpenaiCompatibleApiKey: (key: string) => void;
  openaiCompatibleBaseUrl: string;
  setOpenaiCompatibleBaseUrl: (url: string) => void;
  openaiCompatibleModelId: string;
  setOpenaiCompatibleModelId: (id: string) => void;
  profiles: ModelProfile[];
  setProfiles: (profiles: ModelProfile[]) => void;
  defaultProfileId: string;
  setDefaultProfileId: (id: string) => void;
  functionMappings: FunctionMapping[];
  setFunctionMappings: (mappings: FunctionMapping[]) => void;
  isSaving: boolean;
  saveStatus: string;
  handleSave: () => void;
}

export function ProvidersTab({
  openaiCompatibleApiKey,
  setOpenaiCompatibleApiKey,
  openaiCompatibleBaseUrl,
  setOpenaiCompatibleBaseUrl,
  openaiCompatibleModelId,
  setOpenaiCompatibleModelId,
  profiles,
  setProfiles,
  defaultProfileId,
  setDefaultProfileId,
  functionMappings,
  setFunctionMappings,
  isSaving,
  saveStatus,
  handleSave,
}: ProvidersTabProps) {
  const { t } = useLang();

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">{t('llm.title')}</h2>
          <p className="mb-4">{t('llm.desc')}</p>

          <ProviderSelector />

          <ProviderSettings
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
          />

          <SaveButton
            isSaving={isSaving}
            saveStatus={saveStatus}
            handleSave={handleSave}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
}
