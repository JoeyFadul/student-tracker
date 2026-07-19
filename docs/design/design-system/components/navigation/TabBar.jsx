import React from 'react';
import { usePressable } from '../actions/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

// Gunmetal frosted tab bar: coral active tab, silver inactive — dark chrome
// bookending the white canvas (pairs with the gunmetal AppHeader).
export function TabBar({ active = 'students', onChange, tabs, fixed = true }) {
  const items = tabs || [
    { key: 'students', label: 'Students', icon: 'users' },
    { key: 'stats', label: 'Stats', icon: 'bar-chart-3' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <nav style={{
      position: fixed ? 'fixed' : 'relative', left: 0, right: 0, bottom: fixed ? 0 : undefined,
      background: 'var(--wd-surface-translucent)',
      backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
      borderTopLeftRadius: fixed ? 24 : 24, borderTopRightRadius: fixed ? 24 : 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', maxWidth: 720, margin: '0 auto', height: 64 }}>
        {items.map(tab => <TabButton key={tab.key} tab={tab} active={tab.key === active} onClick={() => onChange && onChange(tab.key)} />)}
      </div>
    </nav>
  );
}

function TabButton({ tab, active, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  const color = active ? 'var(--wd-accent)' : 'var(--wd-silver)';
  return (
    <button onClick={onClick} {...handlers} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--wd-font-body)',
      WebkitTapHighlightColor: 'transparent', transition: 'transform 0.1s ease, color 0.15s ease',
      color, ...pressedStyle,
    }}>
      {typeof tab.icon === 'string' ? <Icon name={tab.icon} size={24} strokeWidth={active ? 2.4 : 2} color={color} /> : tab.icon}
      <span style={{ fontSize: 11, fontWeight: active ? 600 : 500, marginTop: 2 }}>{tab.label}</span>
    </button>
  );
}
