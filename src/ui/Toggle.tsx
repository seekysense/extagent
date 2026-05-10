interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span
        onClick={() => onChange(!checked)}
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
