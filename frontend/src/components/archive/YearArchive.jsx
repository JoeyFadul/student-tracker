import { useEffect, useState } from 'react';
import { ChevronLeft, Archive, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';
import { formatGrade } from '../../lib/grades';
import { usePressable } from '../../hooks/usePressable';
import { AppHeader } from '../ui/AppHeader';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';
import { SkeletonList } from '../ui/Skeleton';

export function YearArchive({ classroomId, year, api, onBack, onSelectStudent }) {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classroomId) return;
    let cancelled = false;
    api.listStudents(classroomId, year.yearId)
      .then(data => {
        if (cancelled) return;
        const sorted = [...(data.students || [])].sort((a, b) => b.points - a.points);
        setStudents(sorted);
      })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [api, classroomId, year.yearId]);

  return (
    <div style={pageStyle}>
      <AppHeader
        title={year.label}
        subtitle={`Archive · ${formatRange(year)}`}
        left={<HeaderBackButton onClick={onBack} />}
      />
      <div style={containerStyle}>
        <div style={bannerStyle}>
          <Archive size={16} color={theme.colors.textMuted} />
          <span>Read-only</span>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        {students === null ? (
          <SkeletonList count={6} />
        ) : students.length === 0 ? (
          <div style={emptyStyle}>No students were tracked this year.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {students.map((s, i) => (
              <StudentRow key={s.id} student={s} rank={i + 1} onClick={() => onSelectStudent(s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeaderBackButton({ onClick }) {
  return (
    <IconButton
      onClick={onClick}
      ariaLabel="Back"
      icon={<ChevronLeft size={22} color={theme.colors.text} />}
    />
  );
}

function StudentRow({ student, rank, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...rowStyle, ...pressedStyle }}>
      <div style={rankStyle}>{rank}</div>
      <Avatar student={student} size={48} radius={theme.radius.md} emojiSize={24} />
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={nameStyle}>{student.name}</div>
        {student.grade && <div style={gradeStyle}>{formatGrade(student.grade)}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={pointsStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>points</div>
      </div>
      <ChevronRight size={18} color={theme.colors.textFaint} />
    </button>
  );
}

function formatRange(year) {
  const start = year.startedAt ? new Date(year.startedAt) : null;
  const end = year.endedAt ? new Date(year.endedAt) : null;
  const fmt = d => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `Started ${fmt(start)}`;
  return '';
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `20px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const bannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.pill,
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  fontWeight: 500,
  marginBottom: 16,
  width: 'fit-content',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 14px 14px 16px',
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  boxShadow: theme.shadow.md,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const rankStyle = {
  fontSize: theme.font.sizes.heading,
  fontWeight: 700,
  color: theme.colors.textMuted,
  width: 20,
  textAlign: 'center',
};

const nameStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
  letterSpacing: '-0.005em',
};

const gradeStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
};

const pointsStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  lineHeight: 1,
  letterSpacing: '-0.02em',
};

const pointsLabelStyle = {
  fontSize: theme.font.sizes.caption,
  color: theme.colors.textFaint,
  marginTop: 3,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  fontWeight: 500,
};

const emptyStyle = {
  padding: 40,
  textAlign: 'center',
  color: theme.colors.textFaint,
  fontSize: theme.font.sizes.footnote,
};

const errorStyle = {
  padding: 12,
  background: theme.colors.dangerSoft,
  color: theme.colors.danger,
  borderRadius: theme.radius.md,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 14,
};
