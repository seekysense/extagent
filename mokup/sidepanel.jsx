// sidepanel.jsx — InfinitAgent side panel design (400×720 frame)

const { StatusDot, IconButton, Chip, InlineCard, CodeBlock, EmptyState,
        SegmentedControl, Toggle, FloatingInput, Button, L } = window;

// ─── Header ───────────────────────────────────────────────────
function SPHeader({ tabName = 'docs.anthropic.com', status = 'running' }) {
  return (
    <div style={{
      height: 48, padding: '0 14px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', flex: '0 0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: -1 }}>∞</span>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>InfinitAgent</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 8px',
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 999, height: 26, maxWidth: 200,
      }}>
        <StatusDot status={status} />
        <span style={{
          fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130,
        }}>{tabName}</span>
        <button title="Refresh tab" style={{
          background: 'transparent', border: 0, padding: 2, marginLeft: 2, cursor: 'pointer',
          color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4,
        }}>{L('RefreshCw', { size: 11.5 })}</button>
      </div>
    </div>
  );
}

// ─── Output area ──────────────────────────────────────────────
function OutputHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px 6px', flex: '0 0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Output</span>
        <Chip size="xs" tone="neutral">3 messages</Chip>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        <IconButton icon="BrainCircuit" size="sm" title="Reflect & learn" />
        <IconButton icon="Trash2" size="sm" title="Clear output" />
      </div>
    </div>
  );
}

function SystemPill({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
      <span style={{
        fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
        background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 999,
      }}>{children}</span>
    </div>
  );
}

function ToolCallBubble({ tool, args, result }) {
  return (
    <div style={{
      borderLeft: '2px solid var(--primary)', background: 'var(--surface-2)',
      borderRadius: '0 8px 8px 0', padding: '8px 10px', fontFamily: 'var(--font-mono)',
      fontSize: 11, color: 'var(--text)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 4 }}>
        {L('Wrench', { size: 11 })}
        <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>tool · {tool}</span>
      </div>
      <div style={{ color: 'var(--text)' }}><span style={{ color: 'var(--text-muted)' }}>args: </span>{args}</div>
      {result && <div style={{ marginTop: 4 }}><span style={{ color: 'var(--text-muted)' }}>→ </span><span style={{ color: 'var(--success)' }}>{result}</span></div>}
    </div>
  );
}

function LlmBubble({ children, streaming }) {
  return (
    <div className="ia-card" style={{ padding: 12, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 5, background: 'var(--primary-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
        }}>{L('Sparkles', { size: 11 })}</div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.3, textTransform: 'uppercase' }}>Assistant</span>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text)' }}>
        {children}
        {streaming && <span className="ia-caret" />}
      </div>
    </div>
  );
}

function ScreenshotMessage() {
  return (
    <div className="ia-card" style={{ padding: 8 }}>
      <div style={{
        height: 110, borderRadius: 6, background:
          'repeating-linear-gradient(135deg, var(--surface-2) 0 8px, var(--surface-3) 8px 16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10.5,
      }}>screenshot · 1024×640</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px 0' }}>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>captured 14:22:08</span>
        <Chip size="xs" tone="neutral" icon="Download">save</Chip>
      </div>
    </div>
  );
}

function OutputArea() {
  return (
    <div className="ia-scroll" style={{
      flex: 1, overflowY: 'auto', padding: '0 14px 12px',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0,
    }}>
      <SystemPill>session started · gpt-4.1-mini</SystemPill>
      <div style={{
        background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px',
        fontSize: 12.5, color: 'var(--text)', borderLeft: '2px solid var(--text-subtle)',
      }}>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>You</div>
        Estrai la tabella dei prezzi da questa pagina e salvala come CSV.
      </div>
      <ToolCallBubble tool="browser_navigate" args={'{ url: "/pricing" }'} result="ok · loaded in 412ms" />
      <ToolCallBubble tool="dom_extract" args={'{ selector: "table.pricing", multi: false }'} />
      <ScreenshotMessage />
      <LlmBubble streaming>
        Ho identificato 4 piani con 6 colonne. La tabella è renderizzata
        client-side, quindi ho atteso il <span className="ia-mono" style={{ background: 'var(--surface-2)', padding: '0 4px', borderRadius: 3, fontSize: 11.5 }}>networkidle</span>. Esporto in CSV…
      </LlmBubble>
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────
function QuickActions({ active, onToggle, recording }) {
  const items = [
    { id: 'paste',   icon: 'ClipboardPaste', label: 'Smart Paste' },
    { id: 'extract', icon: 'ScanText',       label: 'Smart Extract' },
    { id: 'rec',     icon: 'CircleDot',      label: 'Automate', danger: recording },
  ];
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '0 14px 8px', flex: '0 0 auto',
      borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 'auto',
    }}>
      {items.map((it) => {
        const on = active === it.id;
        const isRec = it.id === 'rec' && recording;
        return (
          <button
            key={it.id}
            onClick={() => onToggle?.(on ? null : it.id)}
            style={{
              flex: 1, height: 30, borderRadius: 999, padding: '0 10px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              border: '1px solid',
              background: on ? 'var(--primary-soft)' : 'var(--surface)',
              borderColor: on ? 'transparent' : 'var(--border)',
              color: isRec ? 'var(--error)' : (on ? 'var(--primary)' : 'var(--text)'),
              transition: 'background .12s, border-color .12s',
            }}
          >
            {isRec
              ? <span className="ia-dot-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--error)', color: 'var(--error)' }} />
              : L(it.icon, { size: 12 })}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function SmartPastePanel() {
  return (
    <div className="ia-expand-in" style={{ padding: '0 14px 8px' }}>
      <div className="ia-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {L('ClipboardPaste', { size: 13, color: 'var(--primary)' })} Smart Paste
          </span>
          <Chip size="xs">↵ to fill</Chip>
        </div>
        <textarea
          defaultValue={'Mario Rossi\nmario@example.com\n+39 348 555 0192\nVia Roma 14, Milano 20121'}
          style={{
            border: '1px solid var(--border)', borderRadius: 6, padding: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)',
            background: 'var(--surface-2)', resize: 'none', outline: 'none', minHeight: 70,
            width: '100%', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>4 fields detected</span>
          <Button size="sm" icon="Wand2">Fill Form</Button>
        </div>
      </div>
    </div>
  );
}

function SmartExtractPanel() {
  const [fmt, setFmt] = React.useState('json');
  return (
    <div className="ia-expand-in" style={{ padding: '0 14px 8px' }}>
      <div className="ia-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {L('ScanText', { size: 13, color: 'var(--primary)' })} Smart Extract
          </span>
          <SegmentedControl size="sm" options={['JSON', 'CSV']} value={fmt === 'json' ? 'JSON' : 'CSV'} onChange={(v) => setFmt(v.toLowerCase())} />
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} /> Multi-page (paginazione)
        </label>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Detected fields</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {['plan', 'price', 'seats', 'features', 'cta', 'period'].map((f) => (
              <Chip key={f} size="xs" tone="primary">{f}</Chip>
            ))}
          </div>
        </div>
        <Button icon="ScanText" size="sm" fullWidth>Extract {fmt.toUpperCase()}</Button>
      </div>
    </div>
  );
}

function RecordingPanel() {
  const steps = [
    { kind: 'click',   label: 'click button.add-to-cart' },
    { kind: 'type',    label: 'type "credenziali" in #search' },
    { kind: 'wait',    label: 'wait for .results' },
    { kind: 'extract', label: 'extract table.results' },
  ];
  return (
    <div className="ia-expand-in" style={{ padding: '0 14px 8px' }}>
      <div className="ia-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--error)' }}>
            <span className="ia-dot-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--error)', color: 'var(--error)' }} />
            REC · 00:24
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{steps.length} steps</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', paddingTop: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--primary)' }} />
                {i < steps.length - 1 && <span style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 2, minHeight: 14 }} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.kind}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" icon="Square" variant="outline" fullWidth>Stop</Button>
          <Button size="sm" icon="X" variant="ghost" fullWidth>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Task History ─────────────────────────────────────────────
function TaskHistory({ open, onToggle }) {
  const tasks = [
    'Estrai tabella prezzi → CSV',
    'Compila form contatti con dati clipboard',
    'Riassumi i 5 articoli aperti',
  ];
  return (
    <div style={{ padding: '0 14px 8px', flex: '0 0 auto' }}>
      <button
        onClick={onToggle}
        style={{
          height: 28, width: '100%', padding: '0 8px', borderRadius: 6, border: 0,
          background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600 }}>
          {L('History', { size: 13 })} History
          <Chip size="xs">{tasks.length}</Chip>
        </span>
        {L(open ? 'ChevronDown' : 'ChevronRight', { size: 13 })}
      </button>
      {open && (
        <div className="ia-expand-in" style={{ paddingTop: 4, display: 'flex', flexDirection: 'column' }}>
          {tasks.map((t, i) => (
            <div key={i} className="ia-row-hover" style={{
              height: 30, padding: '0 8px', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span style={{ fontSize: 11.5, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
              <button title="Re-run" style={{
                background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
                color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4, flex: '0 0 auto',
              }}>{L('RotateCcw', { size: 12 })}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Prompt form ──────────────────────────────────────────────
function PromptForm({ value, onChange, processing, onSend }) {
  return (
    <div style={{ padding: '6px 14px 14px', flex: '0 0 auto', background: 'var(--bg)' }}>
      <div className="ia-card" style={{
        boxShadow: 'var(--shadow-card)', padding: 8, borderRadius: 12,
        opacity: 1, transition: 'opacity .12s',
      }}>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Chiedi a InfinitAgent…  prova: «riassumi questa pagina»"
          rows={2}
          style={{
            width: '100%', minHeight: 38, maxHeight: 160, resize: 'none',
            border: 0, outline: 'none', fontFamily: 'inherit', fontSize: 13,
            color: 'var(--text)', background: 'transparent', padding: '4px 6px',
            lineHeight: 1.5, boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 10.5 }}>
            <span className="ia-kbd">↵</span><span>send</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span className="ia-kbd">⇧↵</span><span>newline</span>
          </div>
          <button
            onClick={onSend}
            title={processing ? 'Cancel' : 'Send'}
            style={{
              width: 32, height: 32, borderRadius: 999, border: 0, cursor: 'pointer',
              background: processing ? 'var(--error)' : 'var(--primary)',
              color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s, transform .15s',
              transform: processing ? 'rotate(90deg)' : 'rotate(0)',
            }}
          >
            {L(processing ? 'X' : 'SendHorizontal', { size: 15, strokeWidth: 2 })}
          </button>
        </div>
      </div>
      <ProviderChip />
    </div>
  );
}

function ProviderChip() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 22,
        padding: '0 10px', borderRadius: 999, background: 'var(--surface-2)',
        border: '1px solid var(--border)', fontSize: 10.5, color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        <StatusDot status="idle" size={6} />
        openai · gpt-4.1-mini
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>default</span>
      </span>
    </div>
  );
}

// ─── Approval modal (overlay variant) ─────────────────────────
function ApprovalModal() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)',
      backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 5,
    }}>
      <div className="ia-card" style={{ width: '100%', boxShadow: 'var(--shadow-modal)', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 14px', background: 'var(--warning-soft)',
          borderBottom: '1px solid var(--warning)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {L('ShieldAlert', { size: 16, color: 'var(--warning)' })}
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--warning)' }}>Conferma esecuzione</span>
        </div>
        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px 10px', fontSize: 11.5 }}>
          <span style={{ color: 'var(--text-muted)' }}>tool</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>browser_click</span>
          <span style={{ color: 'var(--text-muted)' }}>input</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', wordBreak: 'break-all' }}>{'{ selector: "form .submit", confirm: true }'}</span>
          <span style={{ color: 'var(--text-muted)' }}>reason</span>
          <span style={{ color: 'var(--text)' }}>Invia il modulo di pagamento.</span>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <Button variant="outline" icon="X" fullWidth>Reject</Button>
          <Button icon="Check" fullWidth>Approve</Button>
        </div>
      </div>
    </div>
  );
}

// ─── No-provider state ────────────────────────────────────────
function NoProviderState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <EmptyState
        icon="Unplug"
        title="Nessun provider configurato"
        description="Aggiungi un provider LLM (OpenAI, Anthropic o un endpoint compatibile) per iniziare a chattare con l'agente."
        cta={<Button icon="Cpu">Configura Provider</Button>}
      />
    </div>
  );
}

// ─── Side Panel root ──────────────────────────────────────────
function SidePanel({ variant = 'main', theme = 'infinit' }) {
  const [active, setActive] = React.useState(null);
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [prompt, setPrompt] = React.useState('Confronta i piani Pro e Team e dimmi quale conviene per 8 utenti');
  const [processing, setProcessing] = React.useState(variant !== 'idle');

  return (
    <div data-theme={theme} className="ia-root" style={{
      width: 400, height: 720, display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
    }}>
      <SPHeader status={processing ? 'running' : 'idle'} />
      {variant === 'no-provider' ? (
        <NoProviderState />
      ) : (
        <>
          <OutputHeader />
          <OutputArea />
          {active === 'paste' && <SmartPastePanel />}
          {active === 'extract' && <SmartExtractPanel />}
          {active === 'rec' && <RecordingPanel />}
          <QuickActions active={active} onToggle={setActive} recording={active === 'rec'} />
          <TaskHistory open={historyOpen} onToggle={() => setHistoryOpen(!historyOpen)} />
          <PromptForm value={prompt} onChange={setPrompt} processing={processing} onSend={() => setProcessing(!processing)} />
        </>
      )}
      {variant === 'approval' && <ApprovalModal />}
    </div>
  );
}

window.SidePanel = SidePanel;
