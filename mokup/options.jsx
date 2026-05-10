// options.jsx — InfinitAgent Options page (1080×720 frame)

const { StatusDot, IconButton, Chip, InlineCard, CodeBlock, EmptyState,
        SegmentedControl, Toggle, FloatingInput, Button, L } = window;

// ─── Sidebar ──────────────────────────────────────────────────
function OptionsSidebar({ active, onChange }) {
  const tabs = [
    { id: 'general',   label: 'Generale',          icon: 'Home' },
    { id: 'providers', label: 'Configurazione LLM', icon: 'Cpu' },
    { id: 'memory',    label: 'Memoria',           icon: 'BrainCircuit' },
    { id: 'skills',    label: 'Skill',             icon: 'Zap' },
    { id: 'profiles',  label: 'Profili Dominio',   icon: 'Globe' },
  ];
  return (
    <aside style={{
      width: 220, flex: '0 0 220px', height: '100%',
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '18px 12px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 18px' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: -1 }}>∞</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>InfinitAgent</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.2.4</span>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange?.(t.id)}
              style={{
                height: 36, padding: '0 10px', borderRadius: 8, border: 0, cursor: 'pointer',
                background: on ? 'var(--primary-soft)' : 'transparent',
                color: on ? 'var(--primary)' : 'var(--text)',
                fontWeight: on ? 600 : 500, fontSize: 13, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                transition: 'background .12s, color .12s',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
            >
              {L(t.icon, { size: 16, color: on ? 'var(--primary)' : 'var(--text-muted)' })}
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={{
          height: 30, padding: '0 8px', borderRadius: 6, border: 0, background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          color: 'var(--text-muted)', fontSize: 12, fontFamily: 'inherit',
        }}>
          {L('HelpCircle', { size: 14 })} Help & docs
        </button>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', paddingLeft: 8 }}>
          extension v0.2.4 · build 1147
        </div>
      </div>
    </aside>
  );
}

// ─── Page chrome ──────────────────────────────────────────────
function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      padding: '24px 32px 18px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: 'var(--text)' }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
          {description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── Tab: Generale ────────────────────────────────────────────
function GeneralTab() {
  const [lang, setLang] = React.useState('IT');
  const [tipsOpen, setTipsOpen] = React.useState(true);
  const [prompt, setPrompt] = React.useState(
    'Sei InfinitAgent, un assistente che opera nel browser dell\'utente.\nObiettivo: completare il task con il minimo numero di azioni.\nRegole:\n  • non eseguire azioni distruttive senza conferma\n  • cita sempre l\'URL della pagina sorgente\n  • rispondi in italiano salvo richiesta diversa'
  );
  const steps = [
    { n: 1, title: 'Configura un provider LLM', body: 'Vai in Configurazione LLM e incolla la tua API key.' },
    { n: 2, title: 'Apri il side panel', body: 'Clicca l\'icona estensione su qualsiasi pagina o usa ⌘⇧I.' },
    { n: 3, title: 'Chiedi qualcosa all\'agente', body: 'Es. «riassumi questa pagina» o «compila il form coi miei dati».' },
  ];
  const tips = [
    'Crea una skill per task ripetitivi e richiamala con /skill nome.',
    'Smart Paste riconosce automaticamente i tipi di campo dei moduli.',
    'Usa profili dominio per addendum prompt specifici per sito.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Section title="Inizia in 3 passi" description="Setup minimo per attivare l'agente.">
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

      <Section title="Pro tips" description="Trucchi per usare l'agente più velocemente.">
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          <button onClick={() => setTipsOpen(!tipsOpen)} style={{
            width: '100%', padding: '12px 14px', border: 0, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'inherit',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' }}>
              {L('Lightbulb', { size: 14, color: 'var(--warning)' })} 3 tips per chi inizia
            </span>
            {L(tipsOpen ? 'ChevronUp' : 'ChevronDown', { size: 14, color: 'var(--text-muted)' })}
          </button>
          {tipsOpen && (
            <div className="ia-expand-in" style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--text)' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>0{i + 1}</span>
                  <span style={{ flex: 1, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Lingua dell'interfaccia">
        <SegmentedControl options={['IT', 'EN']} value={lang} onChange={setLang} />
      </Section>

      <Section title="Custom system prompt" description="Sostituisce il prompt di sistema di default per tutte le conversazioni.">
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              system_prompt.md · {prompt.split('\n').length} righe · {prompt.length} char
            </span>
            <Chip size="xs" tone="success" dot>saved</Chip>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: '100%', minHeight: 130, padding: 14, border: 0, outline: 'none', resize: 'vertical',
              fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.55,
              background: 'var(--code-bg)', color: 'var(--code-fg)', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="outline" icon="RotateCcw">Restore default</Button>
          <Button icon="Save">Save</Button>
        </div>
      </Section>
    </div>
  );
}

// ─── Tab: Providers ───────────────────────────────────────────
function ProvidersTab() {
  const [showKey, setShowKey] = React.useState(false);
  const [testState, setTestState] = React.useState('ok'); // idle | testing | ok | error

  const profiles = [
    { name: 'Quick · 4.1-mini',     model: 'gpt-4.1-mini',    thinking: false, ctx: 128000, max: 4096, temp: 0.4, isDefault: true },
    { name: 'Reasoning · o3-mini',  model: 'o3-mini',         thinking: true,  ctx: 200000, max: 8192, temp: 0.2, budget: 2048 },
    { name: 'Long · 4.1',           model: 'gpt-4.1',         thinking: false, ctx: 1000000, max: 16384, temp: 0.5 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Section title="Credenziali" description="Compatibili con qualsiasi endpoint OpenAI-compatible.">
        <div className="ia-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>
            {L('KeyRound', { size: 14, color: 'var(--primary)' })} OpenAI-compatible
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
            <FloatingInput
              label="API Key"
              value={showKey ? 'sk-proj-1aE9z…7bN2qYx3' : '••••••••••••••••••••'}
              icon="KeyRound"
              mono
              suffix={
                <button
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4,
                  }}
                >{L(showKey ? 'EyeOff' : 'Eye', { size: 14 })}</button>
              }
            />
            <FloatingInput label="Base URL" value="https://api.openai.com/v1" icon="Link" mono />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Button variant="outline" icon="Wifi" onClick={() => { setTestState('testing'); setTimeout(() => setTestState('ok'), 600); }}>
              Test Connection
            </Button>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              {testState === 'ok' && <><span style={{ color: 'var(--success)', display: 'inline-flex' }}>{L('CheckCircle2', { size: 14 })}</span><span style={{ color: 'var(--text)' }}>Connected</span><span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>· 12 modelli · 184ms</span></>}
              {testState === 'testing' && <span style={{ color: 'var(--text-muted)' }}>Verifica in corso…</span>}
              {testState === 'error' && <><span style={{ color: 'var(--error)' }}>{L('XCircle', { size: 14 })}</span><span style={{ color: 'var(--error)' }}>401 invalid_api_key</span></>}
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Profili modello"
        description="Configura più profili e assegnali a funzioni specifiche."
        action={<Button icon="Plus" size="sm" variant="outline">Nuovo profilo</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.map((p, i) => (
            <div key={i} className="ia-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                  {p.isDefault && <Chip size="xs" tone="primarySolid">DEFAULT</Chip>}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 4 }}>
                    {p.model}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconButton icon={p.isDefault ? 'Star' : 'Star'} size="sm" title="Imposta default" active={p.isDefault} />
                  <IconButton icon="Pencil" size="sm" title="Modifica" />
                  <IconButton icon="Trash2" size="sm" title="Elimina" />
                </div>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px 16px',
                fontSize: 11.5,
              }}>
                <KV label="Context window" value={p.ctx.toLocaleString()} />
                <KV label="Max tokens" value={p.max.toLocaleString()} />
                <KV label="Temperature" value={p.temp.toFixed(1)} />
                <KV label="Thinking budget" value={p.budget ? p.budget.toLocaleString() : '—'} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <Toggle checked={p.thinking} onChange={() => {}} label={p.thinking ? '⚡ Thinking ON' : '🚀 Fast mode'} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Function routing" description="Assegna profili specifici a funzioni dell'agente.">
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          {[
            { fn: 'plan',      desc: 'Pianifica i passi',     pf: 'Reasoning · o3-mini' },
            { fn: 'extract',   desc: 'Estrae dati strutturati', pf: 'Quick · 4.1-mini' },
            { fn: 'summarize', desc: 'Riassume pagine',       pf: 'Long · 4.1' },
            { fn: 'reflect',   desc: 'Reflect & learn',       pf: 'Reasoning · o3-mini' },
          ].map((r, i) => (
            <div key={r.fn} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 220px',
              padding: '11px 14px', alignItems: 'center', gap: 12,
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{r.fn}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</span>
              <FakeSelect value={r.pf} />
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: 0, paddingTop: 8 }}>
        <Button icon="Save">Salva configurazione</Button>
      </div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
  );
}

function FakeSelect({ value }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 32, padding: '0 10px', borderRadius: 6, background: 'var(--surface)',
      border: '1px solid var(--border)', fontSize: 12, color: 'var(--text)',
      cursor: 'pointer', fontFamily: 'inherit', width: '100%',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      {L('ChevronDown', { size: 13, color: 'var(--text-muted)' })}
    </button>
  );
}

// ─── Tab: Memory ──────────────────────────────────────────────
function MemoryTab() {
  const memories = [
    { text: 'L\'utente preferisce risposte in italiano, formato bullet, max 5 punti.', validated: true,  date: '2 giorni fa' },
    { text: 'Workspace di lavoro: Acme Corp, sede Milano, fuso orario Europe/Rome.',  validated: true,  date: '5 giorni fa' },
    { text: 'Quando estrae prezzi, deve sempre normalizzare la valuta in EUR.',       validated: false, date: '1 sett. fa' },
    { text: 'Su github.com l\'utente lavora principalmente sul repo "checkout-v2".',  validated: true,  date: '2 sett. fa' },
    { text: 'Per i form di contatto usare email mario.rossi@acme.com.',               validated: false, date: '3 sett. fa' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section
        title="Memorie a lungo termine"
        description="Fatti che l'agente ricorda tra una sessione e l'altra."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" icon="Download">Export</Button>
            <Button variant="outline" size="sm" icon="Upload">Import</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Chip tone="primary" icon="BrainCircuit">{memories.length} memorie salvate</Chip>
          <Chip tone="success" dot>{memories.filter((m) => m.validated).length} validate</Chip>
          <Chip tone="warning" dot>{memories.filter((m) => !m.validated).length} da rivedere</Chip>
        </div>
        <div className="ia-card" style={{ overflow: 'hidden' }}>
          {memories.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderBottom: i < memories.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flex: '0 0 auto',
                background: m.validated ? 'var(--success-soft)' : 'var(--warning-soft)',
                color: m.validated ? 'var(--success)' : 'var(--warning)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{L(m.validated ? 'CheckCircle2' : 'AlertCircle', { size: 14 })}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>{m.date} · {m.validated ? 'validata' : 'pending'}</div>
              </div>
              {!m.validated && <Chip size="xs" tone="warning">da validare</Chip>}
              <div style={{ display: 'flex', gap: 2 }}>
                {!m.validated && <IconButton icon="Check" size="sm" title="Valida" />}
                <IconButton icon="Pencil" size="sm" title="Modifica" />
                <IconButton icon="Trash2" size="sm" title="Elimina" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Tab: Skills ──────────────────────────────────────────────
function SkillsTab() {
  const [editing, setEditing] = React.useState(null);
  const skills = [
    { id: 'invoice', title: 'Estrai fatture PDF', desc: 'Apri il PDF in viewer, estrai metadati e righe in CSV.', steps: 6 },
    { id: 'lead',    title: 'Compila lead da LinkedIn', desc: 'Profilo aperto → riempi CRM con nome, ruolo, azienda.', steps: 4 },
    { id: 'recap',   title: 'Riassunto settimanale', desc: 'Aggrega gli ultimi 7 giorni di cronologia in note Markdown.', steps: 3 },
    { id: 'translate', title: 'Traduci pagina e mantieni layout', desc: 'Sostituisce nodi di testo, preserva markup.', steps: 5 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Section
        title="Le tue skill"
        description="Workflow riutilizzabili che l'agente può eseguire al volo."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" icon="Upload">Importa .md</Button>
            <Button size="sm" icon="Plus">Nuova skill</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {skills.map((s) => (
            <SkillCard
              key={s.id}
              skill={s}
              editing={editing === s.id}
              onEdit={() => setEditing(editing === s.id ? null : s.id)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function SkillCard({ skill, editing, onEdit }) {
  const [feedback, setFeedback] = React.useState(null);
  const onRun = () => { setFeedback('✓ Avviato'); setTimeout(() => setFeedback(null), 1800); };
  return (
    <>
      <div className="ia-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9, flex: '0 0 auto',
          background: 'var(--primary-soft)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{L('FileCode2', { size: 18 })}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{skill.title}</span>
            <Chip size="xs" tone="neutral">{skill.steps} steps</Chip>
            {feedback && <Chip size="xs" tone="success">{feedback}</Chip>}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{skill.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton icon="Zap" size="sm" title="Run skill" onClick={onRun} active />
          <IconButton icon="Pencil" size="sm" title="Edit" onClick={onEdit} />
          <IconButton icon="Download" size="sm" title="Export" />
          <IconButton icon="Trash2" size="sm" title="Delete" />
        </div>
      </div>
      {editing && <SkillEditor skill={skill} onCancel={onEdit} />}
    </>
  );
}

function SkillEditor({ skill, onCancel }) {
  return (
    <div className="ia-expand-in" style={{
      border: '1.5px solid var(--primary)', borderRadius: 12,
      padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
      background: 'var(--surface)',
    }}>
      <FloatingInput label="Titolo" value={skill.title} />
      <FloatingInput label="Descrizione" value={skill.desc} />
      <div style={{
        background: 'var(--code-bg)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', fontSize: 10.5, fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.55)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span>markdown · skill body</span>
          <span>{skill.steps} steps</span>
        </div>
        <textarea
          defaultValue={`# ${skill.title}\n\n## Steps\n1. Naviga alla pagina target\n2. Estrai elementi: { selector, attrs }\n3. Trasforma in JSON\n4. Esporta come .csv\n\n## Output\nFile salvato in Downloads/.`}
          style={{
            width: '100%', minHeight: 130, padding: '10px 14px',
            border: 0, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.55,
            color: 'var(--code-fg)', background: 'transparent',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button icon="Save">Save skill</Button>
      </div>
    </div>
  );
}

// ─── Tab: Domain Profiles ─────────────────────────────────────
function ProfilesTab() {
  const [open, setOpen] = React.useState('linkedin');
  const profiles = [
    { id: 'linkedin', name: 'LinkedIn', glob: '*.linkedin.com/*', selectors: 3 },
    { id: 'github',   name: 'GitHub',   glob: '*.github.com/*',   selectors: 5 },
    { id: 'gmail',    name: 'Gmail',    glob: 'mail.google.com/*', selectors: 2 },
    { id: 'amazon',   name: 'Amazon',   glob: '*.amazon.{com,it,de}/*', selectors: 4 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Section
        title="Profili dominio"
        description="Personalizza il comportamento dell'agente per domini specifici."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" icon="Download">Export</Button>
            <Button variant="outline" size="sm" icon="Upload">Import</Button>
            <Button size="sm" icon="Plus">Nuovo</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {profiles.map((p) => (
            <DomainProfileRow key={p.id} profile={p} open={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function DomainProfileRow({ profile, open, onToggle }) {
  return (
    <div className="ia-card" style={{ overflow: 'hidden' }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: 14, border: 0, background: 'transparent',
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9, flex: '0 0 auto',
          background: 'var(--surface-2)', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{L('Globe', { size: 17 })}</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{profile.name}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
              background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 4,
            }}>{profile.glob}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
            {profile.selectors} hint selettori · addendum prompt configurato
          </div>
        </div>
        {L(open ? 'ChevronUp' : 'ChevronDown', { size: 14, color: 'var(--text-muted)' })}
      </button>
      {open && (
        <div className="ia-expand-in" style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Label>Addendum prompt</Label>
            <textarea
              defaultValue="Su LinkedIn, identifica sempre il nome, ruolo e azienda. Quando trovi un profilo, suggerisci un'azione (connetti / salva CRM / segui)."
              style={miniTextarea}
            />
          </div>
          <div>
            <Label>Hint selettori CSS</Label>
            <textarea
              defaultValue={'.profile-name → nome\n.experience > li:nth-child(1) → ruolo attuale\n.headline → headline'}
              style={{ ...miniTextarea, fontFamily: 'var(--font-mono)' }}
            />
          </div>
          <div>
            <Label>Schema JSON di default</Label>
            <textarea
              defaultValue={'{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "role": { "type": "string" },\n    "company": { "type": "string" }\n  }\n}'}
              style={{ ...miniTextarea, fontFamily: 'var(--font-mono)', background: 'var(--code-bg)', color: 'var(--code-fg)', borderColor: 'transparent' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="ghost" size="sm" icon="Trash2" danger>Elimina profilo</Button>
            <Button size="sm" icon="Save">Salva</Button>
          </div>
        </div>
      )}
    </div>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{children}</div>
);
const miniTextarea = {
  width: '100%', minHeight: 70, padding: 10, border: '1px solid var(--border)',
  borderRadius: 6, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
  fontFamily: 'inherit', fontSize: 12, lineHeight: 1.5,
  background: 'var(--surface-2)', color: 'var(--text)',
};

// ─── Options page root ────────────────────────────────────────
function OptionsPage({ initialTab = 'general', theme = 'infinit' }) {
  const [tab, setTab] = React.useState(initialTab);
  const titles = {
    general:   { t: 'Generale',          s: 'Comportamento di base, lingua e prompt di sistema.' },
    providers: { t: 'Configurazione LLM', s: 'API keys, profili modello e routing per funzione.' },
    memory:    { t: 'Memoria',           s: 'Cosa l\'agente ricorda tra sessioni.' },
    skills:    { t: 'Skill',             s: 'Workflow riutilizzabili scritti in Markdown.' },
    profiles:  { t: 'Profili Dominio',   s: 'Comportamento e selettori specifici per sito.' },
  };
  return (
    <div data-theme={theme} className="ia-root" style={{
      width: 1080, height: 720, display: 'flex',
      background: 'var(--bg)', overflow: 'hidden',
      borderRadius: 0,
    }}>
      <OptionsSidebar active={tab} onChange={setTab} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <PageHeader title={titles[tab].t} subtitle={titles[tab].s}
          actions={tab === 'providers' && <Chip tone="success" dot icon="Wifi">connesso</Chip>}
        />
        <div className="ia-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 40px' }}>
          {tab === 'general'   && <GeneralTab />}
          {tab === 'providers' && <ProvidersTab />}
          {tab === 'memory'    && <MemoryTab />}
          {tab === 'skills'    && <SkillsTab />}
          {tab === 'profiles'  && <ProfilesTab />}
        </div>
      </main>
    </div>
  );
}

window.OptionsPage = OptionsPage;
