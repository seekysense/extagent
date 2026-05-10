// system.jsx — design tokens + atomic component showcase

const { StatusDot, IconButton, Chip, InlineCard, CodeBlock, EmptyState,
        SegmentedControl, Toggle, FloatingInput, Button, L } = window;

function ColorSwatch({ name, varName, hex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        height: 56, borderRadius: 8, background: `var(${varName})`,
        border: '1px solid var(--border)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text)' }}>{name}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{hex}</span>
      </div>
    </div>
  );
}

function TypeSpec({ size, weight, label, sample, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 70, flex: '0 0 70px' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{size}px / {weight}</div>
      </div>
      <div style={{ fontSize: size, fontWeight: weight, color: 'var(--text)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', letterSpacing: size >= 22 ? -0.4 : 0, lineHeight: 1.2 }}>
        {sample}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
    }}>
      <div style={{
        width: 4, height: 14, borderRadius: 2, background: 'var(--primary)',
      }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  );
}

function DesignSystemShowcase({ theme = 'infinit' }) {
  const [seg, setSeg] = React.useState('IT');
  const [tg, setTg] = React.useState(true);

  return (
    <div data-theme={theme} className="ia-root" style={{
      width: 1080, padding: 32, background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', gap: 32,
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Design system · {theme === 'infinit' ? 'light' : 'dark'} · v0.2
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>
            InfinitAgent — UI tokens
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, maxWidth: 640 }}>
            Token CSS in oklch (DaisyUI v5), Inter + JetBrains Mono, Lucide icons (16px / 1.5 stroke).
            Pulito, denso, dev-tool-style.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip tone="primary" icon="Palette">oklch</Chip>
          <Chip tone="neutral" icon="Cpu">Tailwind v4 · DaisyUI v5</Chip>
          <Chip tone="success" dot>16px / 1.5 stroke</Chip>
        </div>
      </div>

      {/* COLORS */}
      <div>
        <SectionTitle>Colors · surfaces</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          <ColorSwatch name="bg"        varName="--bg"        hex={theme === 'infinit' ? '#FAFAFA' : '#0F0F10'} />
          <ColorSwatch name="surface"   varName="--surface"   hex={theme === 'infinit' ? '#FFFFFF' : '#18181B'} />
          <ColorSwatch name="surface-2" varName="--surface-2" hex={theme === 'infinit' ? '#F4F4F5' : '#27272A'} />
          <ColorSwatch name="border"    varName="--border"    hex={theme === 'infinit' ? '#E4E4E7' : '#3F3F46'} />
          <ColorSwatch name="text"      varName="--text"      hex={theme === 'infinit' ? '#09090B' : '#FAFAFA'} />
          <ColorSwatch name="muted"     varName="--text-muted" hex="#71717A" />
        </div>
      </div>
      <div>
        <SectionTitle>Colors · semantic</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          <ColorSwatch name="primary"     varName="--primary"     hex="#6366F1" />
          <ColorSwatch name="primary-dim" varName="--primary-dim" hex="#4F46E5" />
          <ColorSwatch name="success"     varName="--success"     hex="#22C55E" />
          <ColorSwatch name="warning"     varName="--warning"     hex="#F59E0B" />
          <ColorSwatch name="error"       varName="--error"       hex="#EF4444" />
          <ColorSwatch name="code-bg"     varName="--code-bg"     hex="#0F0F10" />
        </div>
      </div>

      {/* TYPE */}
      <div>
        <SectionTitle>Typography</SectionTitle>
        <div className="ia-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TypeSpec size={28} weight={700} label="display" sample="Agentic browsing, finalmente affidabile." />
          <TypeSpec size={20} weight={700} label="h1" sample="Configurazione LLM" />
          <TypeSpec size={15} weight={600} label="h2" sample="Profili modello attivi" />
          <TypeSpec size={13} weight={500} label="body" sample="L'agente esegue passi atomici e chiede conferma per le azioni distruttive." />
          <TypeSpec size={11.5} weight={500} label="caption" sample="captured at 14:22:08 · /pricing" />
          <TypeSpec size={12} weight={500} label="mono" mono sample="browser_navigate({ url: '/pricing' })" />
        </div>
      </div>

      {/* RADIUS + SHADOW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <SectionTitle>Radius</SectionTitle>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { n: 'sm', r: 4 },
              { n: 'md', r: 8 },
              { n: 'lg', r: 12 },
              { n: 'xl', r: 16 },
            ].map((r) => (
              <div key={r.n} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', flex: 1 }}>
                <div style={{ width: '100%', height: 64, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: r.r }} />
                <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{r.n} · {r.r}px</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>Shadows</SectionTitle>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { n: 'card',  shadow: 'var(--shadow-card)' },
              { n: 'pop',   shadow: 'var(--shadow-pop)' },
              { n: 'modal', shadow: 'var(--shadow-modal)' },
            ].map((s) => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '100%', height: 64, background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 10, boxShadow: s.shadow,
                }} />
                <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>--shadow-{s.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPONENTS */}
      <div>
        <SectionTitle>Atoms</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {/* Status */}
          <InlineCard title="StatusDot" subtitle="idle · running · error · detached · rec">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <StatusDot status="idle"     label="idle · ready" />
              <StatusDot status="running"  label="running · 2 tools active" />
              <StatusDot status="error"    label="error · 401 invalid_api_key" />
              <StatusDot status="detached" label="detached · tab closed" />
              <StatusDot status="rec"      label="rec · capturing 4 steps" />
            </div>
          </InlineCard>

          {/* Buttons */}
          <InlineCard title="Buttons" subtitle="primary · outline · ghost · danger">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Button icon="SendHorizontal">Send</Button>
              <Button variant="outline" icon="Save">Save</Button>
              <Button variant="ghost" icon="RotateCcw">Reset</Button>
              <Button variant="danger" icon="Trash2">Delete</Button>
              <Button size="sm" icon="Plus">New skill</Button>
            </div>
          </InlineCard>

          {/* Chips */}
          <InlineCard title="Chips & Badges" subtitle="status, count, default flag">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip>neutral</Chip>
              <Chip tone="primary">primary</Chip>
              <Chip tone="primarySolid">DEFAULT</Chip>
              <Chip tone="success" dot>connected</Chip>
              <Chip tone="warning" dot>pending</Chip>
              <Chip tone="error" dot>failed</Chip>
              <Chip icon="Zap">3 steps</Chip>
              <Chip size="xs">v0.2.4</Chip>
            </div>
          </InlineCard>

          {/* Icon Buttons */}
          <InlineCard title="IconButtons" subtitle="ghost · outline · primary · active">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <IconButton icon="Save" title="Save" />
              <IconButton icon="Pencil" title="Edit" />
              <IconButton icon="Trash2" title="Delete" />
              <IconButton icon="Star" title="Set default" active />
              <IconButton icon="Wifi" title="Test" variant="outline" />
              <IconButton icon="SendHorizontal" title="Send" variant="primary" />
              <IconButton icon="X" title="Cancel" variant="danger" />
            </div>
          </InlineCard>

          {/* Segmented */}
          <InlineCard title="SegmentedControl" subtitle="2-3 options, lingua / formato">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <SegmentedControl options={['IT', 'EN']} value={seg} onChange={setSeg} />
              <SegmentedControl options={[{ value: 'JSON', label: 'JSON', icon: 'Braces' }, { value: 'CSV', label: 'CSV', icon: 'Sheet' }]} value="JSON" onChange={() => {}} />
            </div>
          </InlineCard>

          {/* Toggle */}
          <InlineCard title="Toggle" subtitle="thinking on/off, multi-page, etc.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Toggle checked={tg} onChange={setTg} label={tg ? '⚡ Thinking ON' : '🚀 Fast mode'} />
              <Toggle checked={false} onChange={() => {}} label="Auto-approve safe tools" />
            </div>
          </InlineCard>

          {/* Empty state */}
          <InlineCard title="EmptyState" subtitle="no provider · no memories · no skills">
            <div style={{ background: 'var(--bg)', borderRadius: 8, border: '1px dashed var(--border)' }}>
              <EmptyState icon="Unplug" title="Nessun provider" description="Aggiungi una API key per iniziare." cta={<Button size="sm" icon="Cpu">Configura</Button>} />
            </div>
          </InlineCard>

          {/* Floating input */}
          <InlineCard title="FloatingInput" subtitle="API key, base URL, profile name">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FloatingInput label="API Key" value="sk-proj-1aE9z…7bN2qYx3" icon="KeyRound" mono />
              <FloatingInput label="Base URL" value="https://api.openai.com/v1" icon="Link" mono />
            </div>
          </InlineCard>

          {/* Code block */}
          <div style={{ gridColumn: '1 / -1' }}>
            <InlineCard title="CodeBlock" subtitle="dark sempre, header con lingua + copy">
              <CodeBlock lang="ts">{`import { Zap } from 'lucide-react';

interface IconButtonProps {
  icon: React.ElementType;
  onClick?: () => void;
  variant?: 'ghost' | 'outline' | 'primary';
  className?: string;
  'data-testid'?: string;
}`}</CodeBlock>
            </InlineCard>
          </div>
        </div>
      </div>

      {/* ICONOGRAPHY */}
      <div>
        <SectionTitle>Iconography · Lucide</SectionTitle>
        <div className="ia-card" style={{ padding: 18 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 14,
          }}>
            {[
              ['SendHorizontal', 'send'],
              ['Square', 'stop'],
              ['Trash2', 'clear'],
              ['BrainCircuit', 'reflect'],
              ['RefreshCw', 'refresh'],
              ['ClipboardPaste', 'paste'],
              ['ScanText', 'extract'],
              ['CircleDot', 'rec start'],
              ['History', 'history'],
              ['RotateCcw', 'rerun'],
              ['Zap', 'run'],
              ['Pencil', 'edit'],
              ['Download', 'export'],
              ['Upload', 'import'],
              ['Save', 'save'],
              ['Copy', 'copy'],
              ['ShieldAlert', 'approve?'],
              ['Check', 'approve'],
              ['X', 'reject'],
              ['Unplug', 'no-prov'],
              ['KeyRound', 'api key'],
              ['Link', 'url'],
              ['Wifi', 'test'],
              ['Globe', 'domain'],
              ['Home', 'general'],
              ['Cpu', 'llm'],
              ['HelpCircle', 'help'],
              ['Eye', 'show'],
              ['EyeOff', 'hide'],
              ['FileCode2', 'skill'],
            ].map(([icon, label]) => (
              <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 4px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text)',
                }}>{L(icon, { size: 16 })}</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.DesignSystemShowcase = DesignSystemShowcase;
