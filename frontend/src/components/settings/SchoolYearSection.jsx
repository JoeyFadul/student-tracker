import { useState } from 'react';
import { Calendar, CalendarPlus, CalendarOff, ChevronRight, Archive } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { StartYearSheet } from './StartYearSheet';
import { usePressable } from '../../hooks/usePressable';

export function SchoolYearSection({ active, years, onStart, onEnd, onOpenArchive }) {
  const [showStart, setShowStart] = useState(false);
  const [endBusy, setEndBusy] = useState(false);

  const handleEnd = async () => {
    if (!confirm(`End ${active.label}? You can start a new year later.`)) return;
    setEndBusy(true);
    try { await onEnd(); } finally { setEndBusy(false); }
  };

  const pastYears = years.filter(y => y.yearId !== active?.yearId);

  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel>School year</SectionLabel>

      {active ? (
        <div style={cardStyle}>
          <div style={cardRowStyle}>
            <div style={iconWrapStyle}><Calendar size={20} color={theme.colors.accentDark} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={kickerStyle}>Current year</div>
              <div style={yearLabelStyle}>{active.label}</div>
              <div style={metaStyle}>Started {formatDate(active.startedAt)}</div>
            </div>
          </div>
          <Button variant="dangerSoft" size="sm" onClick={handleEnd} disabled={endBusy} icon={<CalendarOff size={14} />}>
            End year
          </Button>
        </div>
      ) : (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>No active school year</div>
          <div style={emptyHintStyle}>Start one to begin tracking dollars.</div>
        </div>
      )}

      <Button
        variant={active ? 'outline' : 'primary'}
        size="lg"
        fullWidth
        onClick={() => setShowStart(true)}
        icon={<CalendarPlus size={18} strokeWidth={2.5} />}
      >
        {active ? 'Start new school year' : 'Start school year'}
      </Button>

      {pastYears.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 24 }}>Past years</SectionLabel>
          <div style={listStyle}>
            {pastYears.map(y => (
              <PastYearRow key={y.yearId} year={y} onClick={() => onOpenArchive(y)} />
            ))}
          </div>
        </>
      )}

      <StartYearSheet
        open={showStart}
        onClose={() => setShowStart(false)}
        onStart={onStart}
        replacingYear={active}
      />
    </div>
  );
}

function PastYearRow({ year, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...rowStyle, ...pressedStyle }}>
      <div style={{ ...iconWrapStyle, background: theme.colors.surfaceAlt }}>
        <Archive size={18} color={theme.colors.textMuted} />
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={pastLabelStyle}>{year.label}</div>
        <div style={metaStyle}>
          {formatDate(year.startedAt)}{year.endedAt ? ` – ${formatDate(year.endedAt)}` : ''}
        </div>
      </div>
      <ChevronRight size={18} color={theme.colors.textFaint} />
    </button>
  );
}

function SectionLabel({ children, style }) {
  return (
    <div style={{ ...sectionLabelStyle, ...style }}>{children}</div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const sectionLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 10,
  paddingLeft: 4,
};

const cardStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  marginBottom: 12,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  alignItems: 'flex-start',
};

const emptyCardStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  marginBottom: 12,
  padding: '20px 18px',
  textAlign: 'center',
};

const emptyTitleStyle = {
  fontSize: theme.font.sizes.heading,
  fontWeight: 600,
  color: theme.colors.text,
};

const emptyHintStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 4,
};

const cardRowStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  width: '100%',
};

const iconWrapStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  background: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const kickerStyle = {
  fontSize: theme.font.sizes.caption,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 500,
};

const yearLabelStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};

const metaStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  marginTop: 2,
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 16,
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.lg,
  padding: '12px 14px',
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  boxShadow: theme.shadow.sm,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const pastLabelStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
};
