import React, { useState } from 'react';
import { AgentFunction, FunctionMapping, ModelProfile } from '../../models/providers/types';
import { ConfigManager } from '../../background/configManager';
import { useLang } from '../../i18n';
import { Button, Chip, IconButton, Toggle, FloatingInput, LucideIcon } from '../../ui';
import { Section } from './Section';

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

const EMPTY_PROFILE: Omit<ModelProfile, 'id'> = {
  name: '',
  modelId: '',
  enableThinking: false,
  thinkingBudget: undefined,
  contextWindowSize: 32000,
  temperature: 0,
  maxTokens: 4096,
};

function KVField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
  );
}

interface ProfileEditorProps {
  profile: ModelProfile;
  onChange: (field: keyof ModelProfile, value: any) => void;
  onDone: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

function ProfileEditorInline({ profile, onChange, onDone, onCancel, isNew }: ProfileEditorProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid var(--border)',
    borderRadius: 6, outline: 'none', background: 'var(--surface)', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: 12.5, boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Nome profilo</label>
          <input style={inputStyle} value={profile.name} onChange={e => onChange('name', e.target.value)} placeholder="Es. Fast · GPT-4" />
        </div>
        <div>
          <label style={labelStyle}>Model ID</label>
          <input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }} value={profile.modelId} onChange={e => onChange('modelId', e.target.value)} placeholder="Es. gpt-4o-mini" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div>
          <label style={labelStyle}>Context window</label>
          <input style={inputStyle} type="number" value={profile.contextWindowSize ?? ''} onChange={e => onChange('contextWindowSize', Number(e.target.value))} />
        </div>
        <div>
          <label style={labelStyle}>Temperature{profile.enableThinking ? ' (forzata 1)' : ''}</label>
          <input style={inputStyle} type="number" step="0.1" min="0" max="2"
            value={profile.enableThinking ? 1 : (profile.temperature ?? 0)}
            disabled={profile.enableThinking}
            onChange={e => onChange('temperature', Number(e.target.value))} />
        </div>
        <div>
          <label style={labelStyle}>Max tokens</label>
          <input style={inputStyle} type="number" value={profile.maxTokens ?? ''} onChange={e => onChange('maxTokens', Number(e.target.value))} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <Toggle
          checked={profile.enableThinking}
          onChange={() => onChange('enableThinking', !profile.enableThinking)}
          label={profile.enableThinking ? '⚡ Thinking ON' : '🚀 Fast mode'}
        />
        {profile.enableThinking && (
          <div style={{ flex: 1 }}>
            <label style={{ ...labelStyle, marginBottom: 2 }}>Budget thinking (token)</label>
            <input style={{ ...inputStyle, maxWidth: 160 }} type="number" value={profile.thinkingBudget ?? ''}
              placeholder="es. 8192"
              onChange={e => onChange('thinkingBudget', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={onCancel}>Annulla</Button>
        <Button size="sm" icon="Save" onClick={onDone} disabled={!profile.name.trim() || !profile.modelId.trim()}>
          {isNew ? 'Aggiungi' : 'Salva'}
        </Button>
      </div>
    </div>
  );
}

export function OpenAICompatibleSettings({
  openaiCompatibleApiKey,
  setOpenaiCompatibleApiKey,
  openaiCompatibleBaseUrl,
  setOpenaiCompatibleBaseUrl,
  openaiCompatibleModelId: _openaiCompatibleModelId,
  setOpenaiCompatibleModelId: _setOpenaiCompatibleModelId,
  profiles,
  setProfiles,
  defaultProfileId,
  setDefaultProfileId,
  functionMappings,
  setFunctionMappings,
}: OpenAICompatibleSettingsProps) {
  const { t } = useLang();

  const [testState, setTestState] = useState<{ loading: boolean; ok: boolean | null; message: string }>({
    loading: false, ok: null, message: '',
  });
  const [showKey, setShowKey] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProfile, setNewProfile] = useState<ModelProfile>({ id: '', ...EMPTY_PROFILE });

  const handleTestConnection = async () => {
    if (!openaiCompatibleApiKey || !openaiCompatibleBaseUrl) {
      setTestState({ loading: false, ok: false, message: t('openai.missingConfig') });
      return;
    }
    const modelId = profiles.find(p => p.id === defaultProfileId)?.modelId
      || profiles[0]?.modelId
      || 'test';
    setTestState({ loading: true, ok: null, message: '' });
    const result = await ConfigManager.getInstance().testConnection(
      openaiCompatibleBaseUrl, openaiCompatibleApiKey, modelId
    );
    setTestState({
      loading: false,
      ok: result.ok,
      message: result.ok ? t('openai.connectionOk') : (result.error ?? t('openai.missingConfig')),
    });
  };

  const handleRemoveProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    if (defaultProfileId === id) setDefaultProfileId(updated[0]?.id ?? '');
    if (editingProfileId === id) setEditingProfileId(null);
  };

  const handleEditProfile = (id: string, field: keyof ModelProfile, value: any) => {
    setProfiles(profiles.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleAddProfile = () => {
    if (!newProfile.name.trim() || !newProfile.modelId.trim()) return;
    const id = generateId();
    const updated = [...profiles, { ...newProfile, id }];
    setProfiles(updated);
    if (!defaultProfileId) setDefaultProfileId(id);
    setNewProfile({ id: '', ...EMPTY_PROFILE });
    setShowNewForm(false);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Credenziali ── */}
      <Section title="Credenziali" description="Compatibili con qualsiasi endpoint OpenAI-compatible.">
        <div className="ia-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>
            <LucideIcon name="KeyRound" size={14} color="var(--primary)" /> OpenAI-compatible
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
            <FloatingInput
              label="API Key"
              value={showKey ? openaiCompatibleApiKey : (openaiCompatibleApiKey ? '••••••••••••••••••••' : '')}
              onChange={(v) => { if (showKey) setOpenaiCompatibleApiKey(v); }}
              icon="KeyRound"
              mono
              suffix={
                openaiCompatibleApiKey ? (
                  <button
                    onClick={() => setShowKey(s => !s)}
                    style={{ background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4 }}
                  >
                    <LucideIcon name={showKey ? 'EyeOff' : 'Eye'} size={14} />
                  </button>
                ) : undefined
              }
            />
            <FloatingInput
              label="Base URL"
              value={openaiCompatibleBaseUrl}
              onChange={setOpenaiCompatibleBaseUrl}
              icon="Link"
              mono
            />
          </div>
          {/* API Key raw input (hidden — shown only when key not yet set or in show mode) */}
          {(!openaiCompatibleApiKey || showKey) && (
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                {openaiCompatibleApiKey ? 'Modifica API Key' : 'API Key'}
              </label>
              <input
                type="text"
                value={openaiCompatibleApiKey}
                onChange={e => setOpenaiCompatibleApiKey(e.target.value)}
                placeholder="sk-…"
                style={{
                  width: '100%', padding: '7px 10px', border: '1px solid var(--border)',
                  borderRadius: 6, outline: 'none', background: 'var(--surface)', color: 'var(--text)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, boxSizing: 'border-box',
                }}
              />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Button variant="outline" icon="Wifi" onClick={handleTestConnection} disabled={testState.loading}>
              {testState.loading ? 'Verifica…' : t('openai.testConnection')}
            </Button>
            {testState.ok === true && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <LucideIcon name="CheckCircle2" size={14} color="var(--success)" />
                <span style={{ color: 'var(--text)' }}>{testState.message}</span>
              </span>
            )}
            {testState.ok === false && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <LucideIcon name="XCircle" size={14} color="var(--error)" />
                <span style={{ color: 'var(--error)' }}>{testState.message}</span>
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* ── Profili modello ── */}
      <Section
        title="Profili modello"
        description="Configura più profili e assegnali a funzioni specifiche."
        action={
          <Button icon="Plus" size="sm" variant="outline" onClick={() => { setShowNewForm(true); setEditingProfileId(null); }}>
            Nuovo profilo
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.length === 0 && !showNewForm && (
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', padding: '8px 0' }}>
              {t('openai.profiles.empty')}
            </div>
          )}

          {profiles.map(profile => (
            <div key={profile.id} className="ia-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {editingProfileId === profile.id ? (
                <ProfileEditorInline
                  profile={profile}
                  onChange={(field, val) => handleEditProfile(profile.id, field, val)}
                  onDone={() => setEditingProfileId(null)}
                  onCancel={() => setEditingProfileId(null)}
                />
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{profile.name}</span>
                      {defaultProfileId === profile.id && <Chip size="xs" tone="primarySolid">DEFAULT</Chip>}
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
                        background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 4,
                      }}>{profile.modelId}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <IconButton
                        icon="Star" size="sm" title={t('openai.profiles.setDefault')}
                        active={defaultProfileId === profile.id}
                        onClick={() => setDefaultProfileId(profile.id)}
                      />
                      <IconButton icon="Pencil" size="sm" title="Modifica" onClick={() => { setEditingProfileId(profile.id); setShowNewForm(false); }} />
                      <IconButton icon="Trash2" size="sm" title={t('openai.profiles.remove')} danger onClick={() => handleRemoveProfile(profile.id)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px 16px', fontSize: 11.5 }}>
                    <KVField label="Context window"  value={profile.contextWindowSize?.toLocaleString() ?? '—'} />
                    <KVField label="Max tokens"      value={profile.maxTokens?.toLocaleString() ?? '—'} />
                    <KVField label="Temperature"     value={profile.enableThinking ? '1 (forced)' : (profile.temperature?.toFixed(1) ?? '—')} />
                    <KVField label="Thinking budget" value={profile.thinkingBudget?.toLocaleString() ?? '—'} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <Toggle
                      checked={profile.enableThinking}
                      onChange={() => handleEditProfile(profile.id, 'enableThinking', !profile.enableThinking)}
                      label={profile.enableThinking ? '⚡ Thinking ON' : '🚀 Fast mode'}
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          {showNewForm && (
            <div className="ia-card ia-expand-in" style={{ padding: 14, border: '1.5px dashed var(--border)' }}>
              <ProfileEditorInline
                profile={newProfile}
                onChange={(field, val) => setNewProfile(p => ({ ...p, [field]: val }))}
                onDone={handleAddProfile}
                onCancel={() => { setShowNewForm(false); setNewProfile({ id: '', ...EMPTY_PROFILE }); }}
                isNew
              />
            </div>
          )}
        </div>
      </Section>

      {/* ── Function routing ── */}
      <Section title="Function routing" description={t('openai.routing.desc')}>
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          {profiles.length === 0 ? (
            <div style={{ padding: '16px 14px', fontSize: 12.5, color: 'var(--text-muted)' }}>
              {t('openai.routing.noProfiles')}
            </div>
          ) : (
            ROUTABLE_FUNCTIONS.map((fn, i) => (
              <div key={fn} style={{
                display: 'grid', gridTemplateColumns: '160px 1fr 220px',
                padding: '11px 14px', alignItems: 'center', gap: 12,
                borderBottom: i < ROUTABLE_FUNCTIONS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{fn}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t(`function.${fn}`)}</span>
                <select
                  value={getMappedProfileId(fn)}
                  onChange={e => handleFunctionMappingChange(fn, e.target.value)}
                  style={{
                    height: 32, padding: '0 10px', borderRadius: 6,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    fontSize: 12, color: 'var(--text)', cursor: 'pointer',
                    fontFamily: 'inherit', width: '100%', outline: 'none',
                  }}
                >
                  <option value="">{t('openai.routing.useDefault')}</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>
      </Section>
    </div>
  );
}
