import { useEffect, useState } from 'react';
import { ChevronLeft, Archive } from 'lucide-react';
import { theme } from '../../theme';
import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { ActivityHistory } from '../profile/ActivityHistory';
import { usePressable } from '../../hooks/usePressable';
import { AppHeader } from '../ui/AppHeader';

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

  const tier = getTier((data?.points) ?? student.points);
  const TierIcon = tier.icon;
  const back = usePressable();
  const isPhotoUrl = student.photo?.startsWith('http');

  return (
    <div style={pageStyle}>
      <AppHeader
        title={student.name}
        subtitle={year.label}
        left={
          <button onClick={onBack} {...back.handlers} style={{ ...headerIconBtnStyle, ...back.pressedStyle }} aria-label="Back">
            <ChevronLeft size={22} color={theme.colors.headerDarkText} />
          </button>
        }
      />

      <div style={containerStyle}>
        <div style={bannerStyle}>
          <Archive size={16} color={theme.colors.textMuted} />
          <span>Read-only archive</span>
        </div>

        <div style={heroStyle}>
          <div style={{ ...avatarStyle, background: tier.bg }}>
            {isPhotoUrl
              ? <img src={student.photo} alt={student.name} style={imgStyle} />
              : <span style={{ fontSize: 56 }}>{student.photo || DEFAULT_AVATAR}</span>
            }
          </div>
          <h1 style={nameStyle}>{student.name}</h1>
          {student.grade && <div style={gradeStyle}>{student.grade}</div>}

          {tier.name && (
            <div style={chipStyle}>
              <TierIcon size={14} color={tier.color} />
              <span style={{ color: tier.color }}>{tier.name}</span>
            </div>
          )}

          <div style={pointsBlockStyle}>
            <div style={pointsValueStyle}>{data?.points ?? student.points}</div>
            <div style={pointsLabelStyle}>dollars earned</div>
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <ActivityHistory history={data?.history || []} />
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
  padding: `20px 16px calc(40px + ${theme.safeBottom})`,
};

const headerIconBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
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

const avatarStyle = {
  width: 120,
  height: 120,
  borderRadius: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  marginBottom: 16,
  boxShadow: theme.shadow.md,
};

const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };

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

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 12px',
  borderRadius: theme.radius.pill,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  marginTop: 12,
  background: theme.colors.surfaceAlt,
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
