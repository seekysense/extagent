import { FunctionMapping, ModelProfile } from '../../../models/providers/types';
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: 0, paddingTop: 8 }}>
        <SaveButton
          isSaving={isSaving}
          saveStatus={saveStatus}
          handleSave={handleSave}
          isDisabled={false}
        />
      </div>
    </div>
  );
}
