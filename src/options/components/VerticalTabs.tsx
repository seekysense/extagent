import React, { useState } from 'react';
import { FunctionMapping, ModelProfile } from '../../models/providers/types';
import { useLang } from '../../i18n';
import { GeneralTab } from './tabs/GeneralTab';
import { ProvidersTab } from './tabs/ProvidersTab';
import { MemoryTab } from './tabs/MemoryTab';
import { SkillsTab } from './tabs/SkillsTab';
import { DomainProfilesTab } from './tabs/DomainProfilesTab';
import { HelpTab } from './tabs/HelpTab';
import { OptionsSidebar } from './OptionsSidebar';
import { PageHeader } from './PageHeader';

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
  const { t, lang } = useLang();

  const titles: Record<string, { t: string; s: string }> = {
    general:   { t: t('options.tabs.general'),  s: 'Comportamento di base, lingua e prompt di sistema.' },
    providers: { t: t('options.tabs.llm'),       s: 'API key, profili modello e routing per funzione.' },
    memory:    { t: t('options.tabs.memory'),    s: 'Cosa l\'agente ricorda tra sessioni.' },
    skills:    { t: t('options.tabs.skills'),    s: 'Workflow riutilizzabili scritti in Markdown.' },
    profiles:  { t: t('options.tabs.profiles'),  s: 'Comportamento e selettori specifici per sito.' },
    help:      { t: t('options.tabs.help'),      s: lang === 'it' ? 'Guide, esempi e riferimento ai tool.' : 'Guides, examples and tool reference.' },
  };

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
      case 'help':
        return <HelpTab />;
      default:
        return <GeneralTab />;
    }
  };

  const cur = titles[activeTab] ?? titles.general;

  return (
    <div data-theme="infinit" style={{
      display: 'flex', minHeight: '100vh', background: 'var(--bg)',
      fontFamily: 'var(--font-sans)',
    }}>
      <OptionsSidebar active={activeTab} onChange={setActiveTab} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <PageHeader title={cur.t} subtitle={cur.s} />
        <div className="ia-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 40px' }}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
