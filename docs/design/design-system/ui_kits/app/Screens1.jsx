// Login + Dashboard screens (recreated from frontend/src/components/login + dashboard).
const DS1 = window.WellDoneDesignSystem_96828f;

function usePressable() {
  const [pressed, setPressed] = React.useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false), onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false), onTouchCancel: () => setPressed(false),
  };
  return { pressed, handlers, pressedStyle: pressed ? { transform: 'scale(0.97)' } : {} };
}

function LoginScreen({ onSignIn }) {
  const { Button, Input } = DS1;
  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--wd-surface)', padding: 32, borderRadius: 24, boxShadow: 'var(--wd-shadow-md)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--wd-text)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Well Done</h1>
        <p style={{ fontSize: 15, color: 'var(--wd-text-muted)', margin: '0 0 24px' }}>Sign in to your classroom</p>
        <Input type="email" placeholder="Email" defaultValue="teacher@school.edu" />
        <Input type="password" placeholder="Password" defaultValue="••••••••••••" />
        <Button fullWidth onClick={onSignIn}>Sign in</Button>
        <div style={{ fontSize: 14, color: 'var(--wd-text-muted)', marginTop: 14, textAlign: 'center' }}>
          <button style={linkBtnStyle1} type="button">Forgot password?</button>
        </div>
        <div style={{ fontSize: 14, color: 'var(--wd-text-muted)', marginTop: 14, textAlign: 'center' }}>
          New here? <button style={linkBtnStyle1} type="button">Create an account</button>
        </div>
      </div>
    </div>
  );
}
const linkBtnStyle1 = { background: 'transparent', border: 'none', padding: 0, color: 'var(--wd-accent)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' };

function StudentListItem({ student, onClick, selectable, selected }) {
  const { Avatar, Icon } = DS1;
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px 14px 16px',
      background: 'var(--wd-surface)', border: '1px solid var(--wd-border)', borderRadius: 20,
      cursor: 'pointer', width: '100%', fontFamily: 'var(--wd-font-body)',
      transition: 'transform 0.1s ease, box-shadow 0.15s ease', WebkitTapHighlightColor: 'transparent',
      boxShadow: selected ? '0 0 0 2px var(--wd-accent), var(--wd-shadow-sm)' : 'var(--wd-shadow-sm)',
      ...pressedStyle,
    }}>
      {selectable && (
        <div style={{
          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
          border: selected ? '2px solid var(--wd-accent)' : '2px solid var(--wd-border)',
          background: selected ? 'var(--wd-accent)' : 'var(--wd-surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{selected && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}</div>
      )}
      <Avatar student={student} size={56} emojiSize={30} />
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--wd-text)', marginBottom: 4, letterSpacing: '-0.01em' }}>{student.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 15 }}>
          {student.streak > 1 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon name="flame" size={12} color="var(--wd-accent)" />
              <span style={{ fontSize: 11, color: 'var(--wd-accent-dark)', fontWeight: 700 }}>{student.streak}</span>
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--wd-text)', lineHeight: 1, letterSpacing: '-0.025em', fontFamily: 'var(--wd-font-display)' }}>{student.points}</div>
        <div style={{ fontSize: 11, color: 'var(--wd-text-faint)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500 }}>points</div>
      </div>
      {!selectable && <Icon name="chevron-right" size={18} color="var(--wd-text-faint)" />}
    </button>
  );
}

function SortControl({ value, onChange }) {
  const { Icon } = DS1;
  const opts = [{ key: 'recent', label: 'Recent' }, { key: 'name', label: 'A–Z' }, { key: 'pointsDesc', label: 'High' }, { key: 'pointsAsc', label: 'Low' }];
  const current = opts.find(o => o.key === value) || opts[0];
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRadius: 999, background: 'var(--wd-surface-alt)', minHeight: 44, flexShrink: 0 }}>
      <Icon name="arrow-up-down" size={14} color="var(--wd-text)" />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--wd-text)' }}>{current.label}</span>
      <Icon name="chevron-down" size={14} color="var(--wd-text-muted)" />
      <select value={value} onChange={e => onChange(e.target.value)} aria-label="Sort students" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', border: 'none', appearance: 'none' }}>
        {opts.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
    </div>
  );
}

function BulkGrantEntry({ onClick }) {
  const { Icon } = DS1;
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
      padding: '12px 16px', marginBottom: 14, background: 'var(--wd-accent-soft)', border: 'none',
      borderRadius: 16, color: 'var(--wd-accent-dark)', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'var(--wd-font-body)', WebkitTapHighlightColor: 'transparent',
      transition: 'transform 0.1s ease', ...pressedStyle,
    }}>
      <Icon name="user-plus" size={16} strokeWidth={2.2} />
      Award to multiple students
    </button>
  );
}

function DashboardScreen({ students, onSelectStudent, classroomName, yearLabel }) {
  const { AppHeader, SearchBar, Fab, IconButton, Icon } = DS1;
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState('recent');
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const sorted = React.useMemo(() => {
    let list = search ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) : [...students];
    if (sortKey === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortKey === 'pointsDesc') list.sort((a, b) => b.points - a.points);
    else if (sortKey === 'pointsAsc') list.sort((a, b) => a.points - b.points);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [students, search, sortKey]);
  const toggle = (id) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div>
      <AppHeader
        title={selectMode ? 'Select students' : classroomName}
        subtitle={selectMode ? `${selectedIds.size} selected` : `${yearLabel} · ${students.length} students`}
        action={selectMode ? <IconButton ariaLabel="Cancel selection" onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }} icon={<Icon name="x" size={18} color="var(--wd-text)" />} /> : null} />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} />
          <SortControl value={sortKey} onChange={setSortKey} />
        </div>
        {!selectMode && <BulkGrantEntry onClick={() => setSelectMode(true)} />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(s => (
            <StudentListItem key={s.id} student={s} selectable={selectMode} selected={selectedIds.has(s.id)}
              onClick={() => selectMode ? toggle(s.id) : onSelectStudent(s.id)} />
          ))}
        </div>
      </div>
      {!selectMode && <Fab fixed={false} style={{ position: 'absolute', bottom: 84, right: 20 }} />}
      {selectMode && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, padding: '12px 16px', background: 'var(--wd-surface-translucent)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--wd-border)' }}>
          <DS1.Button fullWidth size="lg" disabled={selectedIds.size === 0}>Award to {selectedIds.size || '…'} students</DS1.Button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { LoginScreen, DashboardScreen, StudentListItem, SortControl });
