import React, { useState } from 'react';
import { AgentFunction, FunctionMapping, ModelProfile } from '../../models/providers/types';
import { ConfigManager } from '../../background/configManager';
import { useLang } from '../../i18n';

interface OpenAICompatibleSettingsProps {
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

function generateId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ROUTABLE_FUNCTIONS: AgentFunction[] = [
  'automation', 'skill', 'recording', 'smartPaste', 'smartExtract', 'observation',
];

function profileLabel(p: ModelProfile): string {
  return `${p.name}${p.enableThinking ? ' ⚡' : ' 🚀'}`;
}

export function OpenAICompatibleSettings({
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
}: OpenAICompatibleSettingsProps) {
  const { t } = useLang();

  const [testState, setTestState] = useState<{ loading: boolean; ok: boolean | null; message: string }>({
    loading: false,
    ok: null,
    message: '',
  });

  const [newProfile, setNewProfile] = useState<Omit<ModelProfile, 'id'>>({
    name: '',
    modelId: '',
    enableThinking: false,
    thinkingBudget: undefined,
    contextWindowSize: 32000,
    temperature: 0,
    maxTokens: 4096,
  });

  const handleTestConnection = async () => {
    if (!openaiCompatibleApiKey || !openaiCompatibleBaseUrl) {
      setTestState({ loading: false, ok: false, message: t('openai.missingConfig') });
      return;
    }
    const modelId = profiles.find(p => p.id === defaultProfileId)?.modelId
      || profiles[0]?.modelId
      || openaiCompatibleModelId
      || 'test';
    setTestState({ loading: true, ok: null, message: '' });
    const result = await ConfigManager.getInstance().testConnection(
      openaiCompatibleBaseUrl,
      openaiCompatibleApiKey,
      modelId
    );
    setTestState({
      loading: false,
      ok: result.ok,
      message: result.ok ? t('openai.connectionOk') : (result.error ?? t('openai.missingConfig')),
    });
  };

  const handleAddProfile = () => {
    if (!newProfile.name.trim() || !newProfile.modelId.trim()) return;
    const id = generateId();
    const updated = [...profiles, { ...newProfile, id }];
    setProfiles(updated);
    if (!defaultProfileId) setDefaultProfileId(id);
    setNewProfile({ name: '', modelId: '', enableThinking: false, thinkingBudget: undefined, contextWindowSize: 32000, temperature: 0, maxTokens: 4096 });
  };

  const handleRemoveProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    if (defaultProfileId === id) setDefaultProfileId(updated[0]?.id ?? '');
  };

  const handleEditProfile = (id: string, field: keyof ModelProfile, value: any) => {
    setProfiles(profiles.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const getMappedProfileId = (fn: AgentFunction): string =>
    functionMappings.find(m => m.function === fn)?.profileId ?? '';

  const handleFunctionMappingChange = (fn: AgentFunction, profileId: string) => {
    if (!profileId) {
      setFunctionMappings(functionMappings.filter(m => m.function !== fn));
    } else {
      const idx = functionMappings.findIndex(m => m.function === fn);
      if (idx >= 0) {
        const updated = [...functionMappings];
        updated[idx] = { function: fn, profileId };
        setFunctionMappings(updated);
      } else {
        setFunctionMappings([...functionMappings, { function: fn, profileId }]);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold mb-3">{t('openai.settings.title')}</h3>

      {/* Connection */}
      <div className="form-control mb-3">
        <label className="label"><span className="label-text">{t('openai.apiKey')}</span></label>
        <input
          type="password"
          value={openaiCompatibleApiKey}
          onChange={e => setOpenaiCompatibleApiKey(e.target.value)}
          placeholder={t('openai.apiKeyPlaceholder')}
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control mb-3">
        <label className="label"><span className="label-text">{t('openai.baseUrl')}</span></label>
        <input
          type="text"
          value={openaiCompatibleBaseUrl}
          onChange={e => setOpenaiCompatibleBaseUrl(e.target.value)}
          placeholder={t('openai.baseUrlPlaceholder')}
          className="input input-bordered w-full"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleTestConnection}
          disabled={testState.loading}
          className="btn btn-sm btn-outline"
        >
          {testState.loading ? <span className="loading loading-spinner loading-xs"></span> : null}
          {t('openai.testConnection')}
        </button>
        {testState.ok === true && (
          <span className="text-success text-sm">✓ {testState.message}</span>
        )}
        {testState.ok === false && (
          <span className="text-error text-sm">✗ {testState.message}</span>
        )}
      </div>

      {/* Profiles */}
      <div className="border-t pt-4 mt-2">
        <h4 className="font-semibold mb-3">{t('openai.profiles.title')}</h4>

        {profiles.length === 0 && (
          <p className="text-sm opacity-60 mb-3">{t('openai.profiles.empty')}</p>
        )}

        {profiles.map(profile => (
          <div key={profile.id} className="border rounded p-3 mb-3 bg-base-200">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="defaultProfile"
                checked={defaultProfileId === profile.id}
                onChange={() => setDefaultProfileId(profile.id)}
                className="radio radio-sm"
                title={t('openai.profiles.setDefault')}
              />
              <span className="text-xs font-bold opacity-60">{t('openai.profiles.default')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.namePlaceholder')}</span></label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => handleEditProfile(profile.id, 'name', e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.modelId')}</span></label>
                <input
                  type="text"
                  value={profile.modelId}
                  onChange={e => handleEditProfile(profile.id, 'modelId', e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.enableThinking}
                  onChange={e => handleEditProfile(profile.id, 'enableThinking', e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">{t('openai.profiles.enableThinking')}</span>
              </label>
            </div>

            {profile.enableThinking && (
              <div className="form-control mb-2 max-w-xs">
                <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.thinkingBudget')}</span></label>
                <input
                  type="number"
                  value={profile.thinkingBudget ?? ''}
                  onChange={e => handleEditProfile(profile.id, 'thinkingBudget', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={t('openai.profiles.thinkingBudgetPlaceholder')}
                  className="input input-bordered input-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.contextWindow')}</span></label>
                <input
                  type="number"
                  value={profile.contextWindowSize ?? 32000}
                  onChange={e => handleEditProfile(profile.id, 'contextWindowSize', Number(e.target.value))}
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control">
                <label className="label py-0">
                  <span className="label-text text-xs">
                    {t('openai.profiles.temperature')}{profile.enableThinking ? ` ${t('openai.profiles.temperatureForced')}` : ''}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={profile.enableThinking ? 1 : (profile.temperature ?? 0)}
                  disabled={profile.enableThinking}
                  onChange={e => handleEditProfile(profile.id, 'temperature', Number(e.target.value))}
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.maxTokens')}</span></label>
                <input
                  type="number"
                  value={profile.maxTokens ?? 4096}
                  onChange={e => handleEditProfile(profile.id, 'maxTokens', Number(e.target.value))}
                  className="input input-bordered input-sm"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="badge badge-sm">
                {profile.enableThinking ? t('openai.profiles.thinkingOn') : t('openai.profiles.thinkingOff')}
              </span>
              <button
                onClick={() => handleRemoveProfile(profile.id)}
                className="btn btn-xs btn-ghost text-error"
              >
                {t('openai.profiles.remove')}
              </button>
            </div>
          </div>
        ))}

        {/* Add new profile */}
        <div className="border border-dashed rounded p-3 mt-2">
          <p className="text-xs font-semibold mb-2 opacity-60">{t('openai.profiles.new')}</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="form-control">
              <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.name')}</span></label>
              <input
                type="text"
                value={newProfile.name}
                onChange={e => setNewProfile(p => ({ ...p, name: e.target.value }))}
                placeholder={t('openai.profiles.namePlaceholderNew')}
                className="input input-bordered input-sm"
              />
            </div>
            <div className="form-control">
              <label className="label py-0"><span className="label-text text-xs">{t('openai.profiles.modelId')}</span></label>
              <input
                type="text"
                value={newProfile.modelId}
                onChange={e => setNewProfile(p => ({ ...p, modelId: e.target.value }))}
                placeholder={t('openai.profiles.modelIdPlaceholder')}
                className="input input-bordered input-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={newProfile.enableThinking}
              onChange={e => setNewProfile(p => ({ ...p, enableThinking: e.target.checked }))}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">{t('openai.profiles.enableThinkingShort')}</span>
          </label>
          <button
            onClick={handleAddProfile}
            disabled={!newProfile.name.trim() || !newProfile.modelId.trim()}
            className="btn btn-sm btn-primary"
          >
            {t('openai.profiles.add')}
          </button>
        </div>
      </div>

      {/* Function routing */}
      <div className="border-t pt-4 mt-2">
        <h4 className="font-semibold mb-1">{t('openai.routing.title')}</h4>
        <p className="text-xs opacity-60 mb-3">{t('openai.routing.desc')}</p>

        {profiles.length === 0 ? (
          <p className="text-sm opacity-60">{t('openai.routing.noProfiles')}</p>
        ) : (
          <table className="table table-sm w-full">
            <thead>
              <tr>
                <th className="text-xs">{t('openai.routing.function')}</th>
                <th className="text-xs">{t('openai.routing.profile')}</th>
              </tr>
            </thead>
            <tbody>
              {ROUTABLE_FUNCTIONS.map(fn => (
                <tr key={fn}>
                  <td className="text-sm">{t(`function.${fn}`)}</td>
                  <td>
                    <select
                      value={getMappedProfileId(fn)}
                      onChange={e => handleFunctionMappingChange(fn, e.target.value)}
                      className="select select-bordered select-xs w-full max-w-xs"
                    >
                      <option value="">{t('openai.routing.useDefault')}</option>
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{profileLabel(p)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
