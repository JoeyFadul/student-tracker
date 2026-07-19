import { useEffect, useState } from 'react';
import { School, Users, ChevronDown, Plus, X, UserPlus } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DeleteClassroomModal } from './DeleteClassroomModal';
import { usePressable } from '../../hooks/usePressable';

export function ClassroomSection({
  api,
  classrooms,
  active,
  onSwitch,
  onCreate,
  onDelete,
  isOwner,
}) {
  const [members, setMembers] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  useEffect(() => {
    if (!api || !active) { setMembers(null); return; }
    let cancelled = false;
    api.listMembers(active.classroomId)
      .then(data => { if (!cancelled) setMembers(data.members || []); })
      .catch(() => { if (!cancelled) setMembers([]); });
    return () => { cancelled = true; };
  }, [api, active, refreshKey]);

  const handleDeleteConfirmed = async () => {
    await onDelete(active.classroomId);
  };

  return (
    <>
      <div style={sectionLabelStyle}>Classroom</div>

      {active && (
        <ClassroomCard
          name={active.classroomName}
          role={active.role}
          canSwitch={classrooms.length > 1 || true}
          onSwitch={() => setShowSwitcher(true)}
        />
      )}

      <div style={subSectionLabelStyle}>
        <Users size={12} color={theme.colors.textMuted} style={{ verticalAlign: 'middle', marginRight: 4 }} />
        Teachers ({members?.length ?? '…'})
      </div>
      <div style={groupStyle}>
        {(members || []).map((m, i) => (
          <MemberRow
            key={m.email}
            member={m}
            isLast={i === (members?.length ?? 0) - 1}
            canRemove={isOwner && m.role !== 'owner'}
            onRemove={() => setMemberToRemove(m.email)}
          />
        ))}
      </div>

      {isOwner && (
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => setShowInvite(true)}
          icon={<UserPlus size={18} strokeWidth={2.5} />}
        >
          Invite a teacher
        </Button>
      )}

      {isOwner && (
        <div style={{ marginTop: 14 }}>
          <Button
            variant="dangerSoft"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete classroom
          </Button>
        </div>
      )}

      <ClassroomSwitcherSheet
        open={showSwitcher}
        classrooms={classrooms}
        activeId={active?.classroomId}
        onPick={(id) => { onSwitch(id); setShowSwitcher(false); }}
        onCreate={(name) => { return onCreate(name).then(() => setShowSwitcher(false)); }}
        onClose={() => setShowSwitcher(false)}
      />

      <InviteSheet
        open={showInvite}
        onClose={() => setShowInvite(false)}
        onInvite={async (email) => {
          await api.addMember(active.classroomId, email);
          setRefreshKey(k => k + 1);
          setShowInvite(false);
        }}
      />

      {showDeleteModal && (
        <DeleteClassroomModal
          classroom={active}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}

      {memberToRemove && (
        <ConfirmDialog
          title="Remove teacher?"
          confirmLabel="Remove"
          busyLabel="Removing…"
          onConfirm={async () => {
            await api.removeMember(active.classroomId, memberToRemove);
            setRefreshKey(k => k + 1);
          }}
          onClose={() => setMemberToRemove(null)}
        >
          <strong>{memberToRemove}</strong> will immediately lose access to
          this classroom. You can invite them again later.
        </ConfirmDialog>
      )}
    </>
  );
}

function ClassroomCard({ name, role, onSwitch }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onSwitch} {...handlers} style={{ ...cardStyle, ...pressedStyle }}>
      <div style={iconWrapStyle}><School size={20} color={theme.colors.slate} /></div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={kickerStyle}>Current</div>
        <div style={nameStyle}>{name}</div>
        <div style={metaStyle}>{role === 'owner' ? 'Owner' : 'Member'}</div>
      </div>
      <ChevronDown size={18} color={theme.colors.textMuted} />
    </button>
  );
}

function MemberRow({ member, isLast, canRemove, onRemove }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <div style={{ ...memberRowStyle, borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={memberEmailStyle}>{member.email}</div>
        <div style={memberRoleStyle}>{member.role === 'owner' ? 'Owner' : 'Member'}</div>
      </div>
      {canRemove && (
        <button onClick={onRemove} {...handlers} style={{ ...removeBtnStyle, ...pressedStyle }} aria-label="Remove">
          <X size={16} color={theme.colors.textMuted} />
        </button>
      )}
    </div>
  );
}

function ClassroomSwitcherSheet({ open, classrooms, activeId, onPick, onCreate, onClose }) {
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) setNewName(''); }, [open]);

  const submit = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setBusy(true);
    try { await onCreate(trimmed); }
    finally { setBusy(false); }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Your classrooms">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {classrooms.map(c => (
          <ClassroomPickRow
            key={c.classroomId}
            classroom={c}
            isActive={c.classroomId === activeId}
            onClick={() => onPick(c.classroomId)}
          />
        ))}
      </div>

      <div style={{ ...sectionLabelStyle, paddingLeft: 0, marginBottom: 8 }}>New classroom</div>
      <input
        type="text"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder="Mrs. Smith's 3rd Grade"
        style={inputStyle}
      />
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={busy || !newName.trim()}
        onClick={submit}
        icon={<Plus size={18} strokeWidth={2.5} />}
      >
        Create
      </Button>
    </Sheet>
  );
}

function ClassroomPickRow({ classroom, isActive, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...pickRowStyle, ...pressedStyle, borderColor: isActive ? theme.colors.accent : 'transparent', borderWidth: isActive ? 2 : 0 }}>
      <div style={{ ...iconWrapStyle, background: isActive ? theme.colors.accentSoft : theme.colors.surfaceAlt }}>
        <School size={18} color={isActive ? theme.colors.accentDark : theme.colors.textMuted} />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={pickNameStyle}>{classroom.classroomName}</div>
        <div style={metaStyle}>{classroom.role === 'owner' ? 'Owner' : 'Member'}</div>
      </div>
    </button>
  );
}

function InviteSheet({ open, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (open) { setEmail(''); setError(''); } }, [open]);

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!e) { setError('Enter an email'); return; }
    setBusy(true); setError('');
    try { await onInvite(e); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Invite a teacher">
      <div style={hintStyle}>They'll see this classroom the next time they sign in.</div>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="teacher@school.edu"
        autoFocus
        style={inputStyle}
      />
      {error && <div style={errorStyle}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose} disabled={busy}>Cancel</Button>
        <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={busy}>
          {busy ? 'Inviting…' : 'Send invite'}
        </Button>
      </div>
    </Sheet>
  );
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

const subSectionLabelStyle = {
  ...sectionLabelStyle,
  marginTop: 18,
};

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  marginBottom: 14,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
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

const nameStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};

const metaStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  marginTop: 1,
};

const groupStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  marginBottom: 12,
  padding: '4px 14px',
};

const memberRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
};

const memberEmailStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 500,
  color: theme.colors.text,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const memberRoleStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  marginTop: 1,
};

const removeBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
  background: theme.colors.surfaceAlt,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const pickRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  background: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: '2px solid transparent',
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  boxShadow: theme.shadow.sm,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, border-color 0.15s ease',
};

const pickNameStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
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

const hintStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginBottom: 10,
};

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};
