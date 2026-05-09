import React from 'react';
import { FunctionMapping, ModelProfile } from '../../models/providers/types';
import { OpenAICompatibleSettings } from './OpenAICompatibleSettings';

interface ProviderSettingsProps {
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
}

export function ProviderSettings(props: ProviderSettingsProps) {
  return (
    <OpenAICompatibleSettings
      openaiCompatibleApiKey={props.openaiCompatibleApiKey}
      setOpenaiCompatibleApiKey={props.setOpenaiCompatibleApiKey}
      openaiCompatibleBaseUrl={props.openaiCompatibleBaseUrl}
      setOpenaiCompatibleBaseUrl={props.setOpenaiCompatibleBaseUrl}
      openaiCompatibleModelId={props.openaiCompatibleModelId}
      setOpenaiCompatibleModelId={props.setOpenaiCompatibleModelId}
      profiles={props.profiles}
      setProfiles={props.setProfiles}
      defaultProfileId={props.defaultProfileId}
      setDefaultProfileId={props.setDefaultProfileId}
      functionMappings={props.functionMappings}
      setFunctionMappings={props.setFunctionMappings}
    />
  );
}
