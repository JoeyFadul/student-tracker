import { useState } from 'react';
import { School, Sparkles } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

export function CreateClassroomScreen({ onCreate, onSignOut, hint }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e?.preventDefault?.();
    const trimmed = name.trim();
    if (!trimmed) { setError('Give your classroom a name'); return; }
    setBusy(true); setError('');
    try {
      await onCreate(trimmed);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={iconCircleStyle}>
          <School size={32} color={theme.colors.accentDark} />
        </div>
        <h1 style={titleStyle}>{hint || 'Create your classroom'}</h1>
        <p style={subtitleStyle}>
          Each classroom has its own students, school years, and teachers. You can invite others later.
        </p>

        <form onSubmit={submit} style={formStyle}>
          <label style={labelStyle}>Classroom name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Mrs. Smith's 3rd Grade"
            autoFocus
            style={inputStyle}
          />
          {error && <div style={errorStyle}>{error}</div>}
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={busy} icon={<Sparkles size={18} strokeWidth={2.5} />}>
            {busy ? 'Creating…' : 'Create classroom'}
          </Button>
        </form>

        {onSignOut && (
          <button onClick={onSignOut} style={signOutLinkStyle}>Sign out</button>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  fontFamily: theme.font.family,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const containerStyle = {
  width: '100%',
  maxWidth: 420,
  background: theme.colors.surface,
  padding: 32,
  borderRadius: 24,
  boxShadow: theme.shadow.lg,
  textAlign: 'center',
};

const iconCircleStyle = {
  width: 72,
  height: 72,
  borderRadius: 36,
  background: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

const titleStyle = {
  fontSize: theme.font.sizes.title2,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.02em',
};

const subtitleStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  margin: '8px 0 22px',
  lineHeight: 1.5,
};

const formStyle = {
  textAlign: 'left',
};

const labelStyle = {
  display: 'block',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  marginBottom: 14,
  boxSizing: 'border-box',
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};

const signOutLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: theme.colors.textMuted,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  marginTop: 20,
  cursor: 'pointer',
  fontFamily: theme.font.family,
};
