// Profile, Stats, Settings screens (recreated from frontend/src/components/profile, stats, settings).
const DS2 = window.WellDoneDesignSystem_96828f;

function usePressable() {
  const [pressed, setPressed] = React.useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false), onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false), onTouchCancel: () => setPressed(false),
  };
  return { pressed, handlers, pressedStyle: pressed ? { transform: 'scale(0.97)' } : {} };
}

function ModeToggle({ mode, setMode, amount }) {
  const { Icon } = DS2;
  const Btn = ({ m, icon, children }) => {
    const { handlers, pressedStyle } = usePressable();
    const active = mode === m;
    return (
      <button onClick={() => setMode(m)} {...handlers} style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '10px 14px', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'var(--wd-font-body)', WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease',
        background: active ? 'var(--wd-surface)' : 'transparent',
        color: active ? 'var(--wd-text)' : 'var(--wd-text-muted)',
        boxShadow: active ? 'var(--wd-shadow-sm)' : 'none', ...pressedStyle,
      }}><Icon name={icon} size={14} strokeWidth={2.5} />{children}</button>
    );
  };
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--wd-surface-alt)', borderRadius: 16, marginBottom: 14 }}>
      <Btn m="grant" icon="plus">Award {amount}</Btn>
      <Btn m="revoke" icon="minus">Revoke {amount}</Btn>
    </div>
  );
}

function ReasonSheet({ amount, onClose, onCommit }) {
  const { Sheet } = DS2;
  const [mode, setMode] = React.useState('grant');
  const ReasonCard = ({ reason }) => {
    const { handlers, pressedStyle } = usePressable();
    return (
      <button onClick={() => onCommit(mode === 'revoke' ? -amount : amount, reason)} {...handlers} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--wd-surface-alt)',
        border: 'none', borderRadius: 16, padding: '20px 12px', fontSize: 15, fontWeight: 600,
        color: 'var(--wd-text)', fontFamily: 'var(--wd-font-body)', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent', textAlign: 'center', minHeight: 58,
        transition: 'transform 0.1s ease, background 0.15s ease', ...pressedStyle,
      }}>{reason}</button>
    );
  };
  return (
    <Sheet open onClose={onClose} title="Why?">
      <ModeToggle mode={mode} setMode={setMode} amount={amount} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {window.WD_REASONS.map(r => <ReasonCard key={r} reason={r} />)}
      </div>
      <button type="button" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--wd-text-muted)', fontSize: 13, fontWeight: 500, padding: '12px 0 4px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Other reason…</button>
    </Sheet>
  );
}

function QuickGrantRow({ onPick }) {
  const { Icon } = DS2;
  const QuickBtn = ({ n }) => {
    const { handlers, pressedStyle } = usePressable();
    return (
      <button onClick={() => onPick(n)} {...handlers} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--wd-accent)',
        color: '#fff', border: 'none', borderRadius: 16, padding: '14px 0', fontSize: 17, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'var(--wd-font-body)', minHeight: 56, WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s ease', boxShadow: '0 2px 6px rgba(239, 131, 84, 0.28)', ...pressedStyle,
      }}>{n}</button>
    );
  };
  const More = () => {
    const { handlers, pressedStyle } = usePressable();
    return (
      <button aria-label="Custom amount" {...handlers} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--wd-surface)',
        border: 'none', borderRadius: 16, padding: '14px 0', cursor: 'pointer', minHeight: 56,
        WebkitTapHighlightColor: 'transparent', transition: 'transform 0.1s ease', boxShadow: 'var(--wd-shadow-md)', ...pressedStyle,
      }}><Icon name="more-horizontal" size={20} color="var(--wd-text)" /></button>
    );
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
      <QuickBtn n={1} /><QuickBtn n={2} /><QuickBtn n={5} /><More />
    </div>
  );
}

function ProfileScreen({ student, onBack, activity, onGrant }) {
  const { AppHeader, IconButton, Icon, Avatar, Chip, Card } = DS2;
  const [pendingAmount, setPendingAmount] = React.useState(null);
  return (
    <div>
      <AppHeader title={student.name}
        left={<IconButton ariaLabel="Back" onClick={onBack} icon={<Icon name="chevron-left" size={18} color="var(--wd-text)" />} />} />
      <div style={{ padding: '0 16px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 12px', marginBottom: 4 }}>
          <div style={{ borderRadius: 32, overflow: 'hidden', boxShadow: 'var(--wd-shadow-md)', marginBottom: 16 }}>
            <Avatar student={student} size={120} radius={32} emojiSize={56} />
          </div>
          {student.streak > 1 && (
            <Chip tone="accent" icon={<Icon name="flame" size={14} color="var(--wd-accent-dark)" />}>{student.streak} day streak</Chip>
          )}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--wd-accent)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--wd-font-display)' }}>{student.points}</div>
            <div style={{ fontSize: 13, color: 'var(--wd-text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 500, marginTop: 6 }}>points earned</div>
          </div>
        </div>
        <QuickGrantRow onPick={setPendingAmount} />
        <Card title="Activity">
          {activity.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === activity.length - 1 ? 'none' : '1px solid var(--wd-border)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, color: 'var(--wd-text)', fontWeight: 500, letterSpacing: '-0.005em' }}>{e.reason}</div>
                <div style={{ fontSize: 13, color: 'var(--wd-text-faint)', marginTop: 2 }}>{e.when}</div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 999, minWidth: 38, textAlign: 'center',
                color: e.delta > 0 ? 'var(--wd-success)' : 'var(--wd-danger)',
                background: e.delta > 0 ? 'var(--wd-success-soft)' : 'var(--wd-danger-soft)',
              }}>{e.delta > 0 ? '+' : ''}{e.delta}</div>
            </div>
          ))}
        </Card>
        <Card title="Notes" subtitle="Only you can see these">
          <div style={{ fontSize: 15, color: 'var(--wd-text)', lineHeight: 1.5 }}>Great progress with reading group this week. Pair with Leo for math.</div>
        </Card>
      </div>
      {pendingAmount !== null && (
        <ReasonSheet amount={pendingAmount} onClose={() => setPendingAmount(null)}
          onCommit={(delta, reason) => { setPendingAmount(null); onGrant(student.id, delta, reason); }} />
      )}
    </div>
  );
}

function StatsScreen({ students, yearLabel }) {
  const { AppHeader, Icon } = DS2;
  const totalPoints = students.reduce((s, x) => s + x.points, 0);
  const onFire = students.filter(s => s.streak > 1).length;
  const avg = Math.round(totalPoints / students.length);
  const top = window.WD_TOP_REASONS; const max = top[0].count;
  const tileLabel = { fontSize: 13, color: 'var(--wd-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 };
  return (
    <div>
      <AppHeader title="Statistics" subtitle={yearLabel} />
      <div style={{ padding: '8px 16px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ gridColumn: '1 / 3', background: 'var(--wd-gunmetal)', borderRadius: 24, padding: '24px 22px 22px', boxShadow: 'var(--wd-shadow-md)' }}>
          <div style={{ fontSize: 13, color: 'var(--wd-silver)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Total points</div>
          <div style={{ fontSize: 60, fontWeight: 800, color: 'var(--wd-accent)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--wd-font-display)' }}>{totalPoints.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: 'var(--wd-silver)', marginTop: 8 }}>across {students.length} students</div>
        </div>
        <div style={{ background: 'var(--wd-surface)', borderRadius: 20, padding: '16px 18px', boxShadow: 'var(--wd-shadow-md)' }}>
          <div style={tileLabel}>Avg / student</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--wd-text)', letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--wd-font-display)' }}>{avg}</div>
        </div>
        <div style={{ background: 'var(--wd-slate-soft)', borderRadius: 20, padding: '16px 18px', boxShadow: 'var(--wd-shadow-md)' }}>
          <div style={{ ...tileLabel, color: 'var(--wd-slate)' }}>On streak</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--wd-text)', letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--wd-font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="flame" size={22} color="var(--wd-accent)" /><span>{onFire}</span>
          </div>
        </div>
        <div style={{ gridColumn: '1 / 3', background: 'var(--wd-surface)', borderRadius: 20, padding: 20, boxShadow: 'var(--wd-shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--wd-text-muted)', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            <Icon name="trending-up" size={14} color="var(--wd-text-muted)" /><span>Top reasons · last 30 days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {top.map(r => (
              <div key={r.reason} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, overflow: 'hidden', background: 'var(--wd-surface-alt)', minHeight: 40 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'var(--wd-accent-soft)', width: `${(r.count / max) * 100}%` }}></div>
                <span style={{ position: 'relative', fontSize: 15, color: 'var(--wd-text)', fontWeight: 600 }}>{r.reason}</span>
                <span style={{ position: 'relative', fontSize: 13, color: 'var(--wd-accent-dark)', fontWeight: 700 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ onSignOut }) {
  const { AppHeader, Icon } = DS2;
  const Row = ({ icon, iconColor = 'var(--wd-slate)', label, value, isFirst, isLast }) => {
    const { handlers, pressedStyle } = usePressable();
    return (
      <button {...handlers} style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--wd-surface)',
        border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'var(--wd-font-body)',
        WebkitTapHighlightColor: 'transparent', transition: 'transform 0.1s ease',
        borderRadius: 0,
        borderTopLeftRadius: isFirst ? 20 : 0, borderTopRightRadius: isFirst ? 20 : 0,
        borderBottomLeftRadius: isLast ? 20 : 0, borderBottomRightRadius: isLast ? 20 : 0,
        borderBottom: isLast ? 'none' : '1px solid var(--wd-border)', ...pressedStyle,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--wd-slate-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={18} color={iconColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--wd-text)', letterSpacing: '-0.005em' }}>{label}</div>
          {value && <div style={{ fontSize: 13, color: 'var(--wd-text-muted)', marginTop: 1 }}>{value}</div>}
        </div>
        <Icon name="chevron-right" size={18} color="var(--wd-text-faint)" />
      </button>
    );
  };
  const group = { background: 'var(--wd-surface)', borderRadius: 20, boxShadow: 'var(--wd-shadow-md)', marginBottom: 18, overflow: 'hidden' };
  return (
    <div>
      <AppHeader title="Settings" />
      <div style={{ padding: '4px 16px 100px' }}>
        <div style={group}>
          <Row icon="users" label="Classroom" value="Ms. Rivera's Class" isFirst />
          <Row icon="calendar" label="School year" value="2025–2026" isLast />
        </div>
        <div style={group}>
          <Row icon="check" iconColor="var(--wd-text-muted)" label="Privacy Policy" isFirst />
          <Row icon="mail" iconColor="var(--wd-text-muted)" label="Terms of Service" isLast />
        </div>
        <button onClick={onSignOut} style={{
          width: '100%', background: 'var(--wd-surface)', border: 'none', borderRadius: 20, padding: '16px 18px',
          boxShadow: 'var(--wd-shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--wd-danger)', fontSize: 15, fontWeight: 600, fontFamily: 'var(--wd-font-body)', cursor: 'pointer', marginBottom: 12,
        }}><Icon name="log-out" size={18} color="var(--wd-danger)" /><span>Sign out</span></button>
        <button style={{
          width: '100%', background: 'transparent', border: 'none', padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--wd-danger)', fontSize: 13, fontWeight: 500, fontFamily: 'var(--wd-font-body)', cursor: 'pointer', opacity: 0.85,
        }}><Icon name="trash-2" size={18} color="var(--wd-danger)" /><span>Delete account</span></button>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, StatsScreen, SettingsScreen, ReasonSheet, QuickGrantRow });
