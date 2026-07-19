import { useState } from 'react';
import { Calendar, CalendarPlus, CalendarOff, ChevronRight, Archive, Trash2 } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { StartYearSheet } from './StartYearSheet';
import { DeleteYearModal } from './DeleteYearModal';
import { usePressable } from '../../hooks/usePressable';

export function SchoolYearSection({ active, years, onStart, onEnd, onDelete, onOpenArchive }) {
  const [showStart, setShowStart] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [yearToDelete, setYearToDelete] = useState(null);

  const pastYears = years.filter(y => y.yearId !== active?.yearId);

  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel>School year</SectionLabel>

      {active ? (
        <div style={cardStyle}>
          <div style={cardRowStyle}>
            <div style={iconWrapStyle}><Calendar size={20} color={theme.colors.slate} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={kickerStyle}>Current year</div>
              <div style={yearLabelStyle}>{active.label}</div>
              <div style={metaStyle}>Started {formatDate(active.startedAt)}</div>
            </div>
          </div>
          <div style={cardActionsStyle}>
            <Button variant="dangerSoft" size="sm" onClick={() => setShowEndConfirm(true)} icon={<CalendarOff size={14} />}>
              End year
            </Button>
            {onDelete && (
              <Button
                variant="dangerSoft"
                size="sm"
                onClick={() => setYearToDelete({ ...active, _isActive: true })}
                icon={<Trash2 size={14} />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>No active school year</div>
          <div style={emptyHintStyle}>Start one to begin tracking points.</div>
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
              <PastYearRow
                key={y.yearId}
                year={y}
                onClick={() => onOpenArchive(y)}
                onDelete={onDelete ? () => setYearToDelete(y) : null}
              />
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

      <DeleteYearModal
        year={yearToDelete}
        isActive={yearToDelete?._isActive}
        onClose={() => setYearToDelete(null)}
        onConfirm={() => onDelete(yearToDelete.yearId)}
      />

      {showEndConfirm && active && (
        <ConfirmDialog
          title={`End ${active.label}?`}
          confirmLabel="End year"
          busyLabel="Ending…"
          onConfirm={onEnd}
          onClose={() => setShowEndConfirm(false)}
        >
          Point tracking pauses until you start a new year. Everything from
          this year stays viewable as an archive.
        </ConfirmDialog>
      )}
    </div>
  );
}

function PastYearRow({ year, onClick, onDelete }) {
  const { handlers, pressedStyle } = usePressable();
  const deletePress = usePressable();
  return (
    <div style={{ ...rowStyle, ...pressedStyle }}>
      <button onClick={onClick} {...handlers} style={rowMainStyle} aria-label={`Open ${year.label}`}>
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
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          {...deletePress.handlers}
          style={{ ...deleteBtnStyle, ...deletePress.pressedStyle }}
          aria-label={`Delete ${year.label}`}
        >
          <Trash2 size={16} color={theme.colors.danger} />
        </button>
      )}
    </div>
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

const cardActionsStyle = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
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
  background: theme.colors.slateSoft,
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
  background: theme.colors.surface,
  borderRadius: theme.radius.lg,
  fontFamily: theme.font.family,
  boxShadow: theme.shadow.sm,
  overflow: 'hidden',
};

const rowMainStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: 'transparent',
  border: 'none',
  padding: '12px 14px',
  cursor: 'pointer',
  flex: 1,
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  minWidth: 0,
};

const deleteBtnStyle = {
  background: 'transparent',
  border: 'none',
  padding: '12px 14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
  flexShrink: 0,
};

const pastLabelStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
};
