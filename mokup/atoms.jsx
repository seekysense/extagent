// atoms.jsx — atomic components (StatusDot, IconButton, InlineCard, CodeBlock, EmptyState, Chip, SegmentedControl, Toast, FloatingInput)
// Lucide icons are resolved off window.LucideIcons (loaded via UMD in index.html).

const L = (name, props = {}) => {
  const Cmp = window.lucide && window.lucide[name];
  if (!Cmp) return React.createElement('span', { style: { display: 'inline-block', width: 16, height: 16 } });
  const { size = 16, strokeWidth = 1.5, ...rest } = props;
  return React.createElement(Cmp, { size, strokeWidth, ...rest });
};
window.L = L;

// ─── StatusDot ────────────────────────────────────────────────
function StatusDot({ status = 'idle', size = 8, label }) {
  const map = {
    running:  { fill: 'var(--primary)', pulse: true },
    idle:     { fill: 'var(--success)', pulse: false },
    error:    { fill: 'var(--error)',   pulse: false },
    detached: { fill: 'var(--text-subtle)', pulse: false },
    rec:      { fill: 'var(--error)',   pulse: true },
  };
  const cfg = map[status] || map.idle;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        className={cfg.pulse ? 'ia-dot-pulse' : ''}
        style={{
          width: size, height: size, borderRadius: 999,
          background: cfg.fill, color: cfg.fill,
          flex: '0 0 auto',
        }}
      />
      {label && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>}
    </span>
  );
}

// ─── IconButton ──────────────────────────────────────────────
function IconButton({ icon, onClick, title, variant = 'ghost', size = 'md', active, disabled, danger, children }) {
  const sizeMap = { sm: 22, md: 28, lg: 34 };
  const iconSize = { sm: 13, md: 15, lg: 17 }[size];
  const dim = sizeMap[size];
  const base = {
    width: dim, height: dim, borderRadius: 6,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, transition: 'background .12s, border-color .12s, color .12s',
    color: 'var(--text-muted)', flex: '0 0 auto',
  };
  const variants = {
    ghost:   { background: 'transparent' },
    outline: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' },
    primary: { background: 'var(--primary)', color: 'var(--primary-fg)' },
    danger:  { background: 'transparent', color: 'var(--error)' },
  };
  const activeStyle = active ? { background: 'var(--primary-soft)', color: 'var(--primary)' } : null;
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      aria-label={title}
      style={{ ...base, ...variants[variant], ...activeStyle }}
      onMouseEnter={(e) => { if (!disabled && variant === 'ghost' && !active) e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={(e) => { if (variant === 'ghost' && !active) e.currentTarget.style.background = 'transparent'; }}
    >
      {icon ? L(icon, { size: iconSize, color: danger ? 'var(--error)' : undefined }) : children}
    </button>
  );
}

// ─── Chip / Badge ────────────────────────────────────────────
function Chip({ children, tone = 'neutral', size = 'sm', icon, onClick, dot }) {
  const tones = {
    neutral: { bg: 'var(--surface-2)', fg: 'var(--text-muted)', bd: 'var(--border)' },
    primary: { bg: 'var(--primary-soft)', fg: 'var(--primary)', bd: 'transparent' },
    primarySolid: { bg: 'var(--primary)', fg: 'var(--primary-fg)', bd: 'transparent' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', bd: 'transparent' },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)', bd: 'transparent' },
    error:   { bg: 'var(--error-soft)',   fg: 'var(--error)',   bd: 'transparent' },
  };
  const t = tones[tone] || tones.neutral;
  const sizing = size === 'xs'
    ? { height: 18, padding: '0 6px', fontSize: 10.5, gap: 4 }
    : { height: 22, padding: '0 8px', fontSize: 11.5, gap: 5 };
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
        borderRadius: 999, fontWeight: 500, lineHeight: 1, ...sizing,
        cursor: onClick ? 'pointer' : 'default', whiteSpace: 'nowrap',
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg }} />}
      {icon && L(icon, { size: 11, strokeWidth: 1.75 })}
      {children}
    </span>
  );
}

// ─── InlineCard ───────────────────────────────────────────────
function InlineCard({ title, subtitle, icon, actions, children, accent }) {
  return (
    <div className="ia-card" style={{ padding: 12, borderColor: accent ? 'var(--primary)' : 'var(--border)', borderWidth: accent ? 1.5 : 1 }}>
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: children ? 10 : 0 }}>
          {icon && (
            <div style={{
              width: 30, height: 30, borderRadius: 8, flex: '0 0 auto',
              background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              {L(icon, { size: 15 })}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 2, flex: '0 0 auto' }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── CodeBlock ────────────────────────────────────────────────
function CodeBlock({ lang = 'bash', children, copyable = true }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{
      background: 'var(--code-bg)', borderRadius: 8, overflow: 'hidden',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.55)',
        letterSpacing: 0.4, textTransform: 'lowercase',
      }}>
        <span>{lang}</span>
        {copyable && (
          <button
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            style={{
              background: 'transparent', border: 0, padding: '2px 6px', borderRadius: 4,
              color: copied ? 'var(--success)' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {L(copied ? 'Check' : 'Copy', { size: 11 })}
            {copied ? 'copied' : 'copy'}
          </button>
        )}
      </div>
      <pre style={{
        margin: 0, padding: '10px 12px', fontFamily: 'var(--font-mono)',
        fontSize: 11.5, lineHeight: 1.55, color: 'var(--code-fg)',
        overflowX: 'auto', whiteSpace: 'pre',
      }}>{children}</pre>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────
function EmptyState({ icon, title, description, cta }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: '32px 20px', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
      }}>
        {L(icon, { size: 26, strokeWidth: 1.4 })}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        {description && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, maxWidth: 260, lineHeight: 1.5 }}>{description}</div>}
      </div>
      {cta}
    </div>
  );
}

// ─── SegmentedControl ─────────────────────────────────────────
function SegmentedControl({ options, value, onChange, size = 'md' }) {
  const h = size === 'sm' ? 26 : 30;
  const fs = size === 'sm' ? 11.5 : 12.5;
  return (
    <div style={{
      display: 'inline-flex', padding: 2, gap: 0,
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 8, height: h,
    }}>
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        const active = v === value;
        return (
          <button
            key={v}
            onClick={() => onChange?.(v)}
            style={{
              border: 0, padding: '0 12px', borderRadius: 6, cursor: 'pointer',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: active ? 600 : 500, fontSize: fs,
              boxShadow: active ? 'var(--shadow-card)' : 'none',
              transition: 'background .12s, color .12s',
              fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            {opt.icon && L(opt.icon, { size: 12 })}
            {lbl}
          </button>
        );
      })}
    </div>
  );
}

// ─── Toggle (switch) ─────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span
        onClick={() => onChange?.(!checked)}
        style={{
          width: 30, height: 18, borderRadius: 999, position: 'relative',
          background: checked ? 'var(--primary)' : 'var(--surface-3)',
          transition: 'background .15s', flex: '0 0 auto',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: checked ? 14 : 2,
          width: 14, height: 14, borderRadius: 999, background: '#fff',
          transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,.2)',
        }} />
      </span>
      {label && <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{label}</span>}
    </label>
  );
}

// ─── FloatingInput ───────────────────────────────────────────
function FloatingInput({ label, value, onChange, type = 'text', icon, suffix, mono, placeholder }) {
  const [focus, setFocus] = React.useState(false);
  const filled = !!value || focus;
  return (
    <div style={{ position: 'relative' }}>
      <label
        style={{
          position: 'absolute', left: icon ? 30 : 12,
          top: filled ? 4 : '50%',
          transform: filled ? 'none' : 'translateY(-50%)',
          fontSize: filled ? 10.5 : 12.5,
          color: focus ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: filled ? 600 : 400, letterSpacing: filled ? 0.4 : 0,
          pointerEvents: 'none', transition: 'all .15s', textTransform: filled ? 'uppercase' : 'none',
          background: 'transparent',
        }}
      >{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 44, padding: icon ? '0 8px 0 10px' : '0 8px 0 12px',
        background: 'var(--surface)', border: `1px solid ${focus ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 8, transition: 'border-color .12s', boxShadow: focus ? '0 0 0 3px var(--primary-soft)' : 'none',
      }}>
        {icon && <span style={{ marginRight: 6, color: 'var(--text-muted)' }}>{L(icon, { size: 14 })}</span>}
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          type={type}
          placeholder={focus ? placeholder : ''}
          style={{
            flex: 1, border: 0, outline: 'none', background: 'transparent',
            fontSize: 12.5, color: 'var(--text)', paddingTop: filled ? 12 : 0,
            fontFamily: mono ? 'var(--font-mono)' : 'inherit',
            minWidth: 0,
          }}
        />
        {suffix}
      </div>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'md', icon, iconRight, disabled, fullWidth, danger }) {
  const sizes = {
    sm: { h: 28, px: 10, fs: 12 },
    md: { h: 34, px: 14, fs: 13 },
    lg: { h: 40, px: 18, fs: 14 },
  }[size];
  const bg = {
    primary: 'var(--primary)',
    outline: 'var(--surface)',
    ghost: 'transparent',
    danger: 'var(--error)',
  }[variant];
  const fg = {
    primary: 'var(--primary-fg)',
    outline: 'var(--text)',
    ghost: 'var(--text-muted)',
    danger: '#fff',
  }[variant];
  const bd = {
    primary: 'var(--primary)',
    outline: 'var(--border)',
    ghost: 'transparent',
    danger: 'var(--error)',
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
        background: bg, color: danger ? 'var(--error)' : fg,
        border: `1px solid ${danger ? 'var(--error)' : bd}`,
        borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : 'auto', fontFamily: 'inherit',
        transition: 'background .12s, border-color .12s, transform .06s',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0.5px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {icon && L(icon, { size: sizes.fs + 1 })}
      {children}
      {iconRight && L(iconRight, { size: sizes.fs + 1 })}
    </button>
  );
}

// expose
Object.assign(window, {
  StatusDot, IconButton, Chip, InlineCard, CodeBlock, EmptyState,
  SegmentedControl, Toggle, FloatingInput, Button, L,
});
