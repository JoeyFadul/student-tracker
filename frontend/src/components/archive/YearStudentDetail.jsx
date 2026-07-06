import { useEffect, useState } from 'react';
import { ChevronLeft, Archive } from 'lucide-react';
import { theme } from '../../theme';
import { formatGrade } from '../../lib/grades';
import { ActivityHistory } from '../profile/ActivityHistory';
import { AppHeader } from '../ui/AppHeader';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';

export function YearStudentDetail({ classroomId, year, student, api, onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classroomId) return;
    let cancelled = false;
    api.getStudent(classroomId, student.id, year.yearId)
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [api, classroomId, student.id, year.yearId]);

  // On deep links the route only knows the student id; everything else
  // fills in when the fetch lands.
  const shown = { ...student, ...(data || {}) };

  return (
    <div style={pageStyle}>
      <AppHeader
        title={shown.name}
        subtitle={year.label}
        left={
          <IconButton
            tone="headerDark"
            onClick={onBack}
            ariaLabel="Back"
            icon={<ChevronLeft size={22} color={theme.colors.headerDarkText} />}
          />
        }
      />

      <div style={containerStyle}>
        <div style={bannerStyle}>
          <Archive size={16} color={theme.colors.textMuted} />
          <span>Read-only archive</span>
        </div>

        <div style={heroStyle}>
          <Avatar
            student={shown}
            size={120}
            radius={32}
            emojiSize={56}
            style={{ marginBottom: 16, boxShadow: theme.shadow.md }}
          />
          <h1 style={nameStyle}>{shown.name}</h1>
          {shown.grade && <div style={gradeStyle}>{formatGrade(shown.grade)}</div>}

          <div style={pointsBlockStyle}>
            <div style={pointsValueStyle}>{shown.points ?? 0}</div>
            <div style={pointsLabelStyle}>points earned</div>
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <ActivityHistory
          initialItems={data?.history || []}
          initialCursor={data?.historyCursor || null}
          onLoadMore={(cursor) => api.getStudentActivity(classroomId, student.id, cursor, year.yearId)}
        />
      </div>
    </div>
  );
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

const heroStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0 16px',
  marginBottom: 4,
};


const nameStyle = {
  fontSize: theme.font.sizes.title1,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.02em',
  textAlign: 'center',
};

const gradeStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  marginTop: 2,
};

const pointsBlockStyle = {
  textAlign: 'center',
  marginTop: 18,
};

const pointsValueStyle = {
  fontSize: 56,
  fontWeight: 800,
  color: theme.colors.accent,
  letterSpacing: '-0.03em',
  lineHeight: 1,
};

const pointsLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  fontWeight: 500,
  marginTop: 6,
};

const errorStyle = {
  padding: 12,
  background: theme.colors.dangerSoft,
  color: theme.colors.danger,
  borderRadius: theme.radius.md,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 14,
};
