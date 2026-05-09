import React, { useState, useEffect } from 'react';
import { useLang, saveLang, Lang } from '../../../i18n';
import { AboutSection } from '../AboutSection';
import { ConfigManager } from '../../../background/configManager';

export function GeneralTab() {
  const { t, lang } = useLang();
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptSaved, setPromptSaved] = useState(false);

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

  return (
    <div className="space-y-6">
      <AboutSection />

      {/* Language selector */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">{t('general.language')}</h2>
          <select
            value={lang}
            onChange={e => saveLang(e.target.value as Lang)}
            className="select select-bordered w-40"
          >
            <option value="it">{t('general.language.it')}</option>
            <option value="en">{t('general.language.en')}</option>
          </select>
        </div>
      </div>

      {/* Custom system prompt */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">{t('general.customPrompt.title')}</h2>
          <p className="text-sm opacity-70 mb-2">{t('general.customPrompt.desc')}</p>
          {customPrompt && (
            <div className="badge badge-warning mb-2">{t('general.customPrompt.active')}</div>
          )}
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            rows={8}
            className="textarea textarea-bordered w-full font-mono text-sm"
            placeholder={t('general.customPrompt.placeholder')}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSavePrompt} className="btn btn-primary btn-sm">
              {promptSaved ? '✓' : t('general.customPrompt.save')}
            </button>
            <button onClick={handleResetPrompt} className="btn btn-ghost btn-sm">
              {t('general.customPrompt.reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">{t('general.gettingStarted')}</h2>
          <p className="mb-4">{t('general.steps.intro')}</p>

          {/* Step-by-step instructions */}
          <div className="steps steps-vertical lg:steps-horizontal w-full">
            <div className="step step-primary">
              <div className="step-content text-left">
                <h3 className="font-semibold text-lg mb-2">{t('general.steps.1.title')}</h3>
                <p className="text-sm mb-2">{t('general.steps.1.desc')}</p>
                <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                  <li><strong>OpenRouter</strong> — {t('general.steps.1.desc').includes('OpenRouter') ? '' : 'Access many models via one API'}</li>
                  <li><strong>Ollama</strong> — Free local models</li>
                  <li><strong>{t('provider.openaiCompatible')}</strong></li>
                </ul>
              </div>
            </div>

            <div className="step step-primary">
              <div className="step-content text-left">
                <h3 className="font-semibold text-lg mb-2">{t('general.steps.2.title')}</h3>
                <p className="text-sm mb-2">{t('general.steps.2.desc')}</p>
                <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                  <li>{t('general.steps.2.a')}</li>
                  <li>{t('general.steps.2.b')}</li>
                  <li>{t('general.steps.2.c')}</li>
                </ul>
              </div>
            </div>

            <div className="step step-primary">
              <div className="step-content text-left">
                <h3 className="font-semibold text-lg mb-2">{t('general.steps.3.title')}</h3>
                <p className="text-sm mb-2">{t('general.steps.3.desc')}</p>
                <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                  <li>{t('general.steps.3.a')}</li>
                  <li>{t('general.steps.3.b')}</li>
                  <li>
                    {lang === 'it' ? 'Scrivi: ' : 'Type: '}
                    <em>{t('general.steps.3.c')}</em>
                  </li>
                  <li>{t('general.steps.3.d')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Tips */}
          <div className="alert alert-info mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">{t('general.tips.title')}</h3>
              <ul className="text-sm mt-2 space-y-1">
                <li>• <strong>{t('general.tips.1').split(':')[0]}:</strong> {t('general.tips.1').split(':').slice(1).join(':').trim()}</li>
                <li>• <strong>{t('general.tips.2').split(':')[0]}:</strong> {t('general.tips.2').split(':').slice(1).join(':').trim()}</li>
                <li>• <strong>{t('general.tips.3').split(':')[0]}:</strong> {t('general.tips.3').split(':').slice(1).join(':').trim()}</li>
                <li>• <strong>{t('general.tips.4').split(':')[0]}:</strong> {t('general.tips.4').split(':').slice(1).join(':').trim()}</li>
              </ul>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
