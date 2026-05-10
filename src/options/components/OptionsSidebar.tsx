import React from 'react';
import { LucideIcon } from '../../ui';
import { useLang } from '../../i18n';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface OptionsSidebarProps {
  active: string;
  onChange: (id: string) => void;
}

export function OptionsSidebar({ active, onChange }: OptionsSidebarProps) {
  const { t } = useLang();

  const tabs: Tab[] = [
    { id: 'general',   label: t('options.tabs.general'),  icon: 'Home' },
    { id: 'providers', label: t('options.tabs.llm'),      icon: 'Cpu' },
    { id: 'memory',    label: t('options.tabs.memory'),   icon: 'BrainCircuit' },
    { id: 'skills',    label: t('options.tabs.skills'),   icon: 'Zap' },
    { id: 'profiles',  label: t('options.tabs.profiles'), icon: 'Globe' },
    { id: 'help',      label: t('options.tabs.help'),     icon: 'BookOpen' },
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
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.2.x</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tabs.map((tab) => {
          const on = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
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
              <LucideIcon name={tab.icon} size={16} color={on ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', paddingLeft: 8 }}>
          extension v0.2.x
        </div>
      </div>
    </aside>
  );
}
