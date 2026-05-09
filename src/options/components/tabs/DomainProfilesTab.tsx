import React, { useState, useEffect, useRef } from 'react';
import { useLang } from '../../../i18n';
import { DomainProfile, DomainProfileManager } from '../../../agent/domainProfileManager';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const EMPTY_PROFILE: Omit<DomainProfile, 'id'> = {
  display_name: '',
  domain_pattern: '',
  system_prompt_addendum: '',
  hints: '',
  enabled: true,
};

export function DomainProfilesTab() {
  const { t } = useLang();
  const [profiles, setProfiles] = useState<DomainProfile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DomainProfile | null>(null);
  const [jsonError, setJsonError] = useState('');
  const [schemaText, setSchemaText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const list = await DomainProfileManager.getInstance().listProfiles();
    setProfiles(list);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    const p: DomainProfile = { id: generateId(), ...EMPTY_PROFILE };
    setDraft(p);
    setSchemaText('');
    setJsonError('');
    setEditingId('__new__');
  };

  const openEdit = (profile: DomainProfile) => {
    setDraft({ ...profile });
    setSchemaText(profile.default_schema ? JSON.stringify(profile.default_schema, null, 2) : '');
    setJsonError('');
    setEditingId(profile.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
    setJsonError('');
  };

  const handleSave = async () => {
    if (!draft) return;
    let default_schema: object | undefined = undefined;
    if (schemaText.trim()) {
      try {
        default_schema = JSON.parse(schemaText);
      } catch {
        setJsonError(t('profile.invalidJson'));
        return;
      }
    }
    await DomainProfileManager.getInstance().saveProfile({ ...draft, default_schema });
    cancelEdit();
    await load();
  };

  const handleDelete = async (id: string) => {
    await DomainProfileManager.getInstance().deleteProfile(id);
    await load();
  };

  const handleToggle = async (profile: DomainProfile) => {
    await DomainProfileManager.getInstance().saveProfile({ ...profile, enabled: !profile.enabled });
    await load();
  };

  const handleExport = async () => {
    const list = await DomainProfileManager.getInstance().listProfiles();
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-profiles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const list = JSON.parse(ev.target?.result as string) as DomainProfile[];
        if (!Array.isArray(list)) throw new Error('Expected array');
        for (const p of list) {
          await DomainProfileManager.getInstance().saveProfile(p);
        }
        await load();
      } catch {
        // silently ignore malformed imports
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isEditing = (id: string) => editingId === id || (editingId === '__new__' && id === draft?.id);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-4">{t('profile.title')}</h2>
      <p className="text-sm text-gray-600 mb-4">{t('profile.desc')}</p>

      <div className="flex gap-2 mb-4">
        <button className="btn btn-sm btn-primary" onClick={openNew} data-testid="btn-new-profile">
          {t('profile.new')}
        </button>
        <button className="btn btn-sm btn-outline" onClick={handleExport} data-testid="btn-export-profiles">
          {t('profile.export')}
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => fileInputRef.current?.click()}
          data-testid="btn-import-profiles"
        >
          {t('profile.import')}
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      <div className="flex flex-col gap-2" data-testid="profile-list">
        {profiles.length === 0 && !isEditing('__new__') && (
          <p className="text-sm text-gray-500" data-testid="profile-list-empty">{t('profile.empty')}</p>
        )}

        {profiles.map(profile => (
          <div key={profile.id} className="card bg-base-100 shadow p-3" data-testid={`profile-item-${profile.id}`}>
            {isEditing(profile.id) && draft ? (
              <ProfileEditor
                draft={draft}
                schemaText={schemaText}
                jsonError={jsonError}
                onChange={setDraft}
                onSchemaChange={setSchemaText}
                onSave={handleSave}
                onCancel={cancelEdit}
                t={t}
              />
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-primary"
                  checked={profile.enabled}
                  onChange={() => handleToggle(profile)}
                  data-testid={`toggle-profile-${profile.id}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{profile.display_name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{profile.domain_pattern}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => openEdit(profile)}
                    data-testid={`btn-edit-profile-${profile.id}`}
                  >✏️</button>
                  <button
                    className="btn btn-xs btn-ghost text-error"
                    onClick={() => handleDelete(profile.id)}
                    data-testid={`btn-delete-profile-${profile.id}`}
                  >🗑</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === '__new__' && draft && (
          <div className="card bg-base-100 shadow p-3" data-testid="profile-editor-new">
            <ProfileEditor
              draft={draft}
              schemaText={schemaText}
              jsonError={jsonError}
              onChange={setDraft}
              onSchemaChange={setSchemaText}
              onSave={handleSave}
              onCancel={cancelEdit}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface EditorProps {
  draft: DomainProfile;
  schemaText: string;
  jsonError: string;
  onChange: (p: DomainProfile) => void;
  onSchemaChange: (s: string) => void;
  onSave: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}

function ProfileEditor({ draft, schemaText, jsonError, onChange, onSchemaChange, onSave, onCancel, t }: EditorProps) {
  return (
    <div className="flex flex-col gap-3" data-testid="profile-editor">
      <div>
        <label className="label label-text text-xs">{t('profile.editorName')}</label>
        <input
          className="input input-sm w-full"
          value={draft.display_name}
          onChange={e => onChange({ ...draft, display_name: e.target.value })}
          placeholder={t('profile.namePlaceholder')}
          data-testid="profile-editor-name"
        />
      </div>
      <div>
        <label className="label label-text text-xs">{t('profile.editorPattern')}</label>
        <input
          className="input input-sm w-full font-mono"
          value={draft.domain_pattern}
          onChange={e => onChange({ ...draft, domain_pattern: e.target.value })}
          placeholder={t('profile.patternPlaceholder')}
          data-testid="profile-editor-pattern"
        />
      </div>
      <div>
        <label className="label label-text text-xs">{t('profile.editorAddendum')}</label>
        <textarea
          className="textarea textarea-sm w-full text-xs"
          rows={4}
          value={draft.system_prompt_addendum ?? ''}
          onChange={e => onChange({ ...draft, system_prompt_addendum: e.target.value })}
          placeholder={t('profile.addendumPlaceholder')}
          data-testid="profile-editor-addendum"
        />
      </div>
      <div>
        <label className="label label-text text-xs">{t('profile.editorHints')}</label>
        <textarea
          className="textarea textarea-sm w-full text-xs"
          rows={2}
          value={draft.hints ?? ''}
          onChange={e => onChange({ ...draft, hints: e.target.value })}
          placeholder={t('profile.hintsPlaceholder')}
          data-testid="profile-editor-hints"
        />
      </div>
      <div>
        <label className="label label-text text-xs">{t('profile.editorSchema')}</label>
        <textarea
          className="textarea textarea-sm w-full font-mono text-xs"
          rows={4}
          value={schemaText}
          onChange={e => onSchemaChange(e.target.value)}
          placeholder='{"type":"object","properties":{}}'
          data-testid="profile-editor-schema"
        />
        {jsonError && <p className="text-xs text-error mt-1">{jsonError}</p>}
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={onSave}
          disabled={!draft.display_name.trim() || !draft.domain_pattern.trim()}
          data-testid="btn-save-profile"
        >
          {t('profile.save')}
        </button>
        <button className="btn btn-sm btn-ghost" onClick={onCancel} data-testid="btn-cancel-profile">
          {t('profile.cancel')}
        </button>
      </div>
    </div>
  );
}
