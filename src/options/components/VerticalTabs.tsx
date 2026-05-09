import React, { useState } from 'react';
import { FunctionMapping, ModelProfile } from '../../models/providers/types';
import { useLang } from '../../i18n';
import { GeneralTab } from './tabs/GeneralTab';
import { ProvidersTab } from './tabs/ProvidersTab';
import { MemoryTab } from './tabs/MemoryTab';
import { SkillsTab } from './tabs/SkillsTab';
import { DomainProfilesTab } from './tabs/DomainProfilesTab';

interface VerticalTabsProps {
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

export function VerticalTabs(props: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const { t } = useLang();

  const tabs = [
    { id: 'general', label: t('options.tabs.general'), icon: '🏠' },
    { id: 'providers', label: t('options.tabs.llm'), icon: '⚙️' },
    { id: 'memory', label: t('options.tabs.memory'), icon: '🧠' },
    { id: 'skills', label: t('options.tabs.skills'), icon: '⚡' },
    { id: 'profiles', label: t('options.tabs.profiles'), icon: '🌐' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'providers':
        return (
          <ProvidersTab
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
            isSaving={props.isSaving}
            saveStatus={props.saveStatus}
            handleSave={props.handleSave}
          />
        );
      case 'memory':
        return <MemoryTab />;
      case 'skills':
        return <SkillsTab />;
      case 'profiles':
        return <DomainProfilesTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      <div className="w-64 bg-base-100 shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary mb-6">InfinitAgent</h1>
          <div className="tabs tabs-vertical w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab tab-lg justify-start gap-3 w-full ${
                  activeTab === tab.id ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}
