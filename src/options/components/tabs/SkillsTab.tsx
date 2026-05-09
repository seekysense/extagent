/// <reference types="chrome"/>
import React, { useState, useEffect, useRef } from 'react';
import { useLang } from '../../../i18n';
import { SkillDefinition, SkillManager, parseSkill } from '../../../agent/skillManager';


type EditorMode = 'new' | 'edit';

export function SkillsTab() {
  const { t } = useLang();
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('new');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorDescription, setEditorDescription] = useState('');
  const [editorBody, setEditorBody] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [importError, setImportError] = useState('');
  const [runFeedback, setRunFeedback] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const list = await SkillManager.getInstance().listSkills();
    setSkills(list);
  };

  useEffect(() => { load(); }, []);

  const buildMarkdown = (title: string, desc: string, body: string) =>
    `---\ntitle: ${title}\ndescription: ${desc}\n---\n\n${body}`;

  const openNew = () => {
    setEditorMode('new');
    setEditorTitle('');
    setEditorDescription('');
    setEditorBody('');
    setOriginalTitle('');
    setEditorOpen(true);
  };

  const openEdit = (skill: SkillDefinition) => {
    setEditorMode('edit');
    setEditorTitle(skill.title);
    setEditorDescription(skill.description);
    // Extract body (everything after closing ---)
    const bodyMatch = skill.raw.match(/^---[\s\S]*?---\n([\s\S]*)$/);
    setEditorBody(bodyMatch ? bodyMatch[1].trim() : '');
    setOriginalTitle(skill.title);
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editorTitle.trim()) return;
    const md = buildMarkdown(editorTitle.trim(), editorDescription.trim(), editorBody);
    const manager = SkillManager.getInstance();
    // If renamed, delete old entry
    if (editorMode === 'edit' && originalTitle && originalTitle !== editorTitle.trim()) {
      await manager.deleteSkill(originalTitle);
    }
    const skill = parseSkill(md);
    await manager.saveSkill(skill);
    setEditorOpen(false);
    await load();
  };

  const handleRun = (title: string) => {
    chrome.runtime.sendMessage(
      { action: 'executeSkillPrompt', skillTitle: title },
      (response) => {
        const ok = !chrome.runtime.lastError && response?.success;
        setRunFeedback(prev => ({ ...prev, [title]: ok ? '✓' : '⚠ Apri il pannello laterale' }));
        setTimeout(() => setRunFeedback(prev => { const n = { ...prev }; delete n[title]; return n; }), 2500);
      }
    );
  };

  const handleDelete = async (title: string) => {
    await SkillManager.getInstance().deleteSkill(title);
    await load();
  };

  const handleExport = (skill: SkillDefinition) => {
    const content = SkillManager.getInstance().exportToFile(skill);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const content = ev.target?.result as string;
        await SkillManager.getInstance().importFromFile(content);
        await load();
      } catch (err) {
        setImportError(err instanceof Error ? err.message : String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-4">{t('skills.title')}</h2>
      <p className="text-sm text-gray-600 mb-4">{t('skills.desc')}</p>

      <div className="flex gap-2 mb-4">
        <button className="btn btn-sm btn-primary" onClick={openNew} data-testid="btn-new-skill">
          {t('skills.new')}
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => fileInputRef.current?.click()}
          data-testid="btn-import-skill"
        >
          {t('skills.import')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          className="hidden"
          onChange={handleImport}
          data-testid="skill-file-input"
        />
      </div>

      {importError && (
        <div className="alert alert-error mb-3 text-sm" data-testid="skill-import-error">
          {importError}
        </div>
      )}

      {/* Skills list */}
      <div className="flex flex-col gap-2" data-testid="skill-list">
        {skills.length === 0 && (
          <p className="text-sm text-gray-500" data-testid="skill-list-empty">{t('skills.empty')}</p>
        )}
        {skills.map(skill => (
          <div key={skill.title} className="card bg-base-100 shadow p-3 flex flex-row items-start gap-2" data-testid={`skill-item-${skill.title}`}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{skill.title}</p>
              <p className="text-xs text-gray-500 truncate">{skill.description}</p>
              <p className="text-xs text-gray-400">{skill.steps.length} {t('skills.steps')}</p>
            </div>
            <div className="flex gap-1 shrink-0 items-center">
              {runFeedback[skill.title] && (
                <span className="text-xs text-gray-500">{runFeedback[skill.title]}</span>
              )}
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => handleRun(skill.title)}
                data-testid={`btn-run-skill-${skill.title}`}
                title={t('skills.run')}
              >⚡</button>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => openEdit(skill)}
                data-testid={`btn-edit-skill-${skill.title}`}
                title={t('skills.edit')}
              >✏️</button>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => handleExport(skill)}
                data-testid={`btn-export-skill-${skill.title}`}
                title={t('skills.export')}
              >⬇</button>
              <button
                className="btn btn-xs btn-ghost text-error"
                onClick={() => handleDelete(skill.title)}
                data-testid={`btn-delete-skill-${skill.title}`}
                title={t('skills.delete')}
              >🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Inline editor */}
      {editorOpen && (
        <div className="mt-4 card bg-base-100 shadow p-4 flex flex-col gap-3" data-testid="skill-editor">
          <div>
            <label className="label label-text text-xs">{t('skills.editorTitle')}</label>
            <input
              className="input input-sm w-full"
              value={editorTitle}
              onChange={e => setEditorTitle(e.target.value)}
              placeholder={t('skills.titlePlaceholder')}
              data-testid="skill-editor-title"
            />
          </div>
          <div>
            <label className="label label-text text-xs">{t('skills.editorDesc')}</label>
            <input
              className="input input-sm w-full"
              value={editorDescription}
              onChange={e => setEditorDescription(e.target.value)}
              placeholder={t('skills.descPlaceholder')}
              data-testid="skill-editor-desc"
            />
          </div>
          <div>
            <label className="label label-text text-xs">{t('skills.editorBody')}</label>
            <textarea
              className="textarea textarea-sm w-full font-mono text-xs"
              rows={10}
              value={editorBody}
              onChange={e => setEditorBody(e.target.value)}
              placeholder={t('skills.bodyPlaceholder')}
              data-testid="skill-editor-body"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
              disabled={!editorTitle.trim()}
              data-testid="btn-save-skill"
            >
              {t('skills.save')}
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setEditorOpen(false)}
              data-testid="btn-cancel-skill"
            >
              {t('skills.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
