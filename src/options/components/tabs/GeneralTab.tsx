import React, { useState, useEffect } from 'react';
import { useLang, saveLang, Lang } from '../../../i18n';
import { ConfigManager } from '../../../background/configManager';
import { Section } from '../Section';
import { Chip, SegmentedControl, Button } from '../../../ui';

export function GeneralTab() {
  const { t, lang } = useLang();
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptSaved, setPromptSaved] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    ConfigManager.getInstance().getCustomSystemPrompt().then(p => setCustomPrompt(p || ''));
  }, []);

  const handleSavePrompt = async () => {
    await ConfigManager.getInstance().setCustomSystemPrompt(customPrompt);
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 2000);
  };

  const handleResetPrompt = async () => {
    setCustomPrompt('');
    await ConfigManager.getInstance().setCustomSystemPrompt('');
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 2000);
  };

  const steps = [
    { n: 1, title: t('general.steps.1.title'), body: t('general.steps.1.desc') },
    { n: 2, title: t('general.steps.2.title'), body: t('general.steps.2.desc') },
    { n: 3, title: t('general.steps.3.title'), body: t('general.steps.3.desc') },
  ];

  const tips = [t('general.tips.1'), t('general.tips.2'), t('general.tips.3')];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Section title={t('general.gettingStarted')} description={t('general.steps.intro')}>
        <div className="ia-card" style={{ padding: '6px 4px' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              display: 'flex', gap: 14, padding: '14px 16px',
              borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 999, flex: '0 0 auto',
                background: 'var(--primary-soft)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12,
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('general.tips.title')} description="Trucchi per usare l'agente più velocemente.">
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            style={{
              width: '100%', padding: '12px 14px', border: 0, background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' }}>
              <span style={{ color: 'var(--warning)' }}>💡</span> {tips.length} tips per chi inizia
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tipsOpen ? '▲' : '▼'}</span>
          </button>
          {tipsOpen && (
            <div className="ia-expand-in" style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--text)' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>0{i + 1}</span>
                  <span style={{ flex: 1, lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title={t('general.language')}>
        <SegmentedControl
          options={[
            { value: 'it', label: t('general.language.it') },
            { value: 'en', label: t('general.language.en') },
          ]}
          value={lang}
          onChange={(v) => saveLang(v as Lang)}
        />
      </Section>

      <Section title={t('general.customPrompt.title')} description={t('general.customPrompt.desc')}>
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              system_prompt.md · {customPrompt.split('\n').length} righe · {customPrompt.length} char
            </span>
            {promptSaved && <Chip size="xs" tone="success" dot>saved</Chip>}
            {customPrompt && !promptSaved && <Chip size="xs" tone="warning">{t('general.customPrompt.active')}</Chip>}
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={t('general.customPrompt.placeholder')}
            style={{
              width: '100%', minHeight: 130, padding: 14, border: 0, outline: 'none', resize: 'vertical',
              fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.55,
              background: 'var(--code-bg)', color: 'var(--code-fg)', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="outline" icon="RotateCcw" onClick={handleResetPrompt}>
            {t('general.customPrompt.reset')}
          </Button>
          <Button icon="Save" onClick={handleSavePrompt}>
            {promptSaved ? '✓ Saved' : t('general.customPrompt.save')}
          </Button>
        </div>
      </Section>
    </div>
  );
}
