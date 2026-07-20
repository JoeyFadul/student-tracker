import { useState, useMemo } from 'react';
import { School, Calendar, Users, ChevronLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { GRADE_OPTIONS } from '../../lib/grades';
import { parseRoster } from '../../lib/roster';
import { suggestYearLabel, deriveYearOptions } from '../../hooks/useSchoolYear';

// First-run flow (2.0 item 1.7): create classroom → start the school year →
// add the roster → land on a populated dashboard, instead of dead-ending a new
// teacher on an empty Students tab. Uses the raw api client and refreshes the
// classroom list only at the very end, so AuthedLayout's "you have a
// classroom → go to /students" redirect fires once everything is in place.
export function OnboardingWizard({ api, classrooms, onSignOut }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [yearLabel, setYearLabel] = useState(() => suggestYearLabel());
  const [rosterText, setRosterText] = useState('');
  const [grade, setGrade] = useState('3rd');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const yearOptions = useMemo(() => deriveYearOptions().map(y => ({ value: y, label: y })), []);
  const names = parseRoster(rosterText);
  const nameOk = !!name.trim();

  const finish = async () => {
    setBusy(true); setError('');
    try {
      const { classroomId } = await api.createClassroom(name.trim());
      await api.startSchoolYear(classroomId, yearLabel);
      for (const student of names) {
        await api.createStudent(classroomId, { name: student, grade, photo: DEFAULT_AVATAR });
      }
      classrooms.setActiveId(classroomId);
      await classrooms.refresh(); // AuthedLayout now redirects to /students
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (busy) {
    return (
      <Shell icon={<Loader2 size={30} color={theme.colors.accentDark} className="spin" />} title="Setting up your classroom…">
        <p style={subtitleStyle}>Creating the classroom, starting the year{names.length ? `, and adding ${names.length} ${names.length === 1 ? 'student' : 'students'}` : ''}.</p>
      </Shell>
    );
  }

  if (step === 1) {
    return (
      <Shell icon={<School size={30} color={theme.colors.accentDark} />} title="Create your classroom" step={1} onSignOut={onSignOut}>
        <p style={subtitleStyle}>Each classroom has its own students, school years, and teachers. You can invite others later.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (nameOk) setStep(2); }} style={formStyle}>
          <Input
            label="Classroom name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Mrs. Smith's 3rd Grade"
            autoFocus
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={!nameOk} iconRight={<ArrowRight size={18} strokeWidth={2.5} />}>
            Continue
          </Button>
        </form>
      </Shell>
    );
  }

  if (step === 2) {
    return (
      <Shell icon={<Calendar size={30} color={theme.colors.accentDark} />} title="Start the school year" step={2}>
        <p style={subtitleStyle}>Points and streaks are tracked per year. You can end it and start a fresh one anytime.</p>
        <div style={formStyle}>
          <Select label="School year" value={yearLabel} onChange={e => setYearLabel(e.target.value)} options={yearOptions} />
          <div style={navRowStyle}>
            <Button variant="outline" size="lg" onClick={() => setStep(1)} icon={<ChevronLeft size={18} />}>Back</Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => setStep(3)} iconRight={<ArrowRight size={18} strokeWidth={2.5} />}>Continue</Button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell icon={<Users size={30} color={theme.colors.accentDark} />} title="Add your students" step={3}>
      <p style={subtitleStyle}>Paste your class list, one name per line. You can skip this and add them anytime.</p>
      <div style={formStyle}>
        <Textarea
          label="Names — one per line"
          value={rosterText}
          onChange={e => setRosterText(e.target.value)}
          placeholder={'Student 1\nStudent 2\nStudent 3'}
          rows={6}
        />
        <Select label="Grade for everyone" value={grade} onChange={e => setGrade(e.target.value)} options={GRADE_OPTIONS} />
        {error && <div style={errorStyle}>{error}</div>}
        <div style={navRowStyle}>
          <Button variant="outline" size="lg" onClick={() => setStep(2)} icon={<ChevronLeft size={18} />}>Back</Button>
          <Button variant="primary" size="lg" fullWidth onClick={finish} icon={<Sparkles size={18} strokeWidth={2.5} />}>
            {names.length ? `Add ${names.length} & finish` : 'Finish'}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ icon, title, step, children, onSignOut }) {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={iconCircleStyle}>{icon}</div>
        <h1 style={titleStyle}>{title}</h1>
        {children}
        {step && <StepDots step={step} />}
        {onSignOut && <button onClick={onSignOut} style={signOutLinkStyle}>Sign out</button>}
      </div>
    </div>
  );
}

function StepDots({ step }) {
  return (
    <div style={dotsStyle}>
      {[1, 2, 3].map(n => (
        <span key={n} style={{ ...dotStyle, background: n === step ? theme.colors.accent : theme.colors.border, width: n === step ? 20 : 7 }} />
      ))}
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
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

const formStyle = { textAlign: 'left' };

const navRowStyle = { display: 'flex', gap: 8, marginTop: 4 };

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};

const dotsStyle = {
  display: 'flex',
  gap: 6,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
};

const dotStyle = {
  height: 7,
  borderRadius: 999,
  transition: 'width 0.2s ease, background 0.2s ease',
};

const signOutLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: theme.colors.textMuted,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  marginTop: 18,
  cursor: 'pointer',
  fontFamily: theme.font.family,
};
