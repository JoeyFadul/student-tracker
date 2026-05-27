import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Minus, Award, ArrowLeft, Star, Trophy, Sparkles, Save, LogOut, UserPlus, X, Trash2 } from 'lucide-react';
import {
  CognitoUserPool, CognitoUser, AuthenticationDetails,
} from 'amazon-cognito-identity-js';

// ============================================================================
// CONFIG
// ============================================================================
const API_URL = import.meta.env.VITE_API_URL;
const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_USER_POOL_CLIENT_ID;

const userPool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

// ============================================================================
// API CLIENT
// ============================================================================
function makeApi(idToken) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  };
  const handle = async (res) => {
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    if (res.status === 204) return null;
    return res.json();
  };
  return {
    listStudents: () => fetch(`${API_URL}/students`, { headers }).then(handle),
    getStudent:   (id) => fetch(`${API_URL}/students/${id}`, { headers }).then(handle),
    grantPoints:  (id, delta, reason) => fetch(`${API_URL}/students/${id}/points`, {
      method: 'POST', headers, body: JSON.stringify({ delta, reason }),
    }).then(handle),
    updateStudent: (id, patch) => fetch(`${API_URL}/students/${id}`, {
      method: 'PATCH', headers, body: JSON.stringify(patch),
    }).then(handle),
    createStudent: (data) => fetch(`${API_URL}/students`, {
      method: 'POST', headers, body: JSON.stringify(data),
    }).then(handle),
    deleteStudent: (id) => fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE', headers,
    }).then(handle),
  };
}

// ============================================================================
// REWARD TIERS
// ============================================================================
const TIERS = [
  { name: 'One Talent',    min: 0,  color: '#a16207', bg: '#fef3c7', icon: Star },
  { name: 'Two Talents',   min: 30, color: '#475569', bg: '#e2e8f0', icon: Award },
  { name: 'Five Talents',  min: 60, color: '#b45309', bg: '#fde68a', icon: Trophy },
  { name: 'Well Done',     min: 90, color: '#5b21b6', bg: '#ede9fe', icon: Sparkles },
];
const getTier = (p) => [...TIERS].reverse().find(t => p >= t.min) || TIERS[0];

const AVATAR_CHOICES = ['🦊', '🐯', '🐰', '🦉', '🦋', '🐢', '🐼', '🐨', '🦁', '🐸', '🐧', '🦄', '🌱', '🌟', '🐶', '🐱'];

// ============================================================================
// LOGIN SCREEN
// ============================================================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [needsNewPassword, setNeedsNewPassword] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const auth = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(auth, {
      onSuccess: (session) => { setBusy(false); onLogin(session.getIdToken().getJwtToken(), user); },
      onFailure: (err) => { setBusy(false); setError(err.message || 'Login failed'); },
      newPasswordRequired: () => { setBusy(false); setNeedsNewPassword(user); },
    });
  };

  const handleNewPassword = (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    needsNewPassword.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session) => { setBusy(false); onLogin(session.getIdToken().getJwtToken(), needsNewPassword); },
      onFailure: (err) => { setBusy(false); setError(err.message || 'Password change failed'); },
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', padding: 28, borderRadius: 20, border: '1px solid #e7e2d8' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>Well Done</h1>
        <p style={{ fontSize: 14, color: '#78716c', margin: '0 0 20px' }}>Sign in to your classroom</p>

        {needsNewPassword ? (
          <form onSubmit={handleNewPassword}>
            <p style={{ fontSize: 13, color: '#78716c', marginBottom: 12 }}>Set a new password to continue.</p>
            <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, marginBottom: 10, boxSizing: 'border-box' }} />
            <button type="submit" disabled={busy} style={btnPrimary}>{busy ? 'Setting...' : 'Set password & sign in'}</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, marginBottom: 10, boxSizing: 'border-box' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, marginBottom: 10, boxSizing: 'border-box' }} />
            <button type="submit" disabled={busy} style={btnPrimary}>{busy ? 'Signing in...' : 'Sign in'}</button>
          </form>
        )}
        {error && <div style={{ marginTop: 12, padding: 10, background: '#fef2f2', color: '#dc2626', fontSize: 13, borderRadius: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

const btnPrimary = {
  width: '100%', padding: '12px', background: '#1c1917', color: '#fff',
  border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
};

// ============================================================================
// ADD STUDENT MODAL
// ============================================================================
function AddStudentModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3rd');
  const [photo, setPhoto] = useState(AVATAR_CHOICES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true); setError('');
    try {
      await onCreate({ name: name.trim(), grade, photo });
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={modalBackdrop}>
      <div onClick={e => e.stopPropagation()} style={modalSheet}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1c1917', margin: 0 }}>New student</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" required autoFocus style={inputStyle} />

          <label style={labelStyle}>Grade</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}>
            <option value="K">Kindergarten</option>
            <option value="1st">1st grade</option>
            <option value="2nd">2nd grade</option>
            <option value="3rd">3rd grade</option>
            <option value="4th">4th grade</option>
            <option value="5th">5th grade</option>
          </select>

          <label style={labelStyle}>Choose an avatar</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, marginBottom: 20 }}>
            {AVATAR_CHOICES.map(emoji => (
              <button key={emoji} type="button" onClick={() => setPhoto(emoji)}
                style={{
                  aspectRatio: '1', fontSize: 24, padding: 0,
                  background: photo === emoji ? '#1c1917' : '#faf7f2',
                  border: photo === emoji ? '1.5px solid #1c1917' : '1px solid #e7e2d8',
                  borderRadius: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {emoji}
              </button>
            ))}
          </div>

          {error && <div style={{ padding: 10, background: '#fef2f2', color: '#dc2626', fontSize: 13, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <button type="submit" disabled={busy || !name.trim()} style={{ ...btnPrimary, opacity: (busy || !name.trim()) ? 0.5 : 1 }}>
            {busy ? 'Adding...' : 'Add student'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================
function DeleteConfirmModal({ studentName, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canDelete = confirmText.trim().toLowerCase() === 'delete';

  const handleDelete = async () => {
    if (!canDelete) return;
    setBusy(true); setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={modalBackdrop}>
      <div onClick={e => e.stopPropagation()} style={modalSheet}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1c1917', margin: 0 }}>Delete student?</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: 14, background: '#fef2f2', borderRadius: 12, marginBottom: 16, border: '1px solid #fecaca' }}>
          <div style={{ fontSize: 14, color: '#991b1b', fontWeight: 500, marginBottom: 4 }}>This cannot be undone</div>
          <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>
            <strong>{studentName}</strong>'s profile, point total, notes, and complete activity history will be permanently removed.
          </div>
        </div>

        <label style={labelStyle}>Type <strong>delete</strong> to confirm</label>
        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="delete"
          autoFocus
          style={inputStyle}
        />

        {error && <div style={{ padding: 10, background: '#fef2f2', color: '#dc2626', fontSize: 13, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} disabled={busy}
            style={{ flex: 1, padding: '12px', background: '#fff', color: '#1c1917', border: '1px solid #e7e2d8', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={!canDelete || busy}
            style={{ flex: 1, padding: '12px', background: canDelete ? '#dc2626' : '#fca5a5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: canDelete ? 'pointer' : 'not-allowed' }}>
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHARED STYLES
// ============================================================================
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#57534e', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' };
const modalBackdrop = {
  position: 'fixed', inset: 0, background: 'rgba(28, 25, 23, 0.5)',
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  zIndex: 100, padding: 0,
};
const modalSheet = {
  background: '#fff', width: '100%', maxWidth: 540,
  borderRadius: '20px 20px 0 0', padding: 24,
  maxHeight: '90vh', overflowY: 'auto',
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function StudentTracker() {
  const [idToken, setIdToken] = useState(null);
  const [cognitoUser, setCognitoUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [pointInput, setPointInput] = useState(5);
  const [reasonInput, setReasonInput] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          setIdToken(session.getIdToken().getJwtToken());
          setCognitoUser(user);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!idToken) return;
    const api = makeApi(idToken);
    setLoading(true);
    api.listStudents()
      .then(data => setStudents(data.students || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [idToken]);

  const api = useMemo(() => idToken ? makeApi(idToken) : null, [idToken]);

  const handleLogin = (token, user) => { setIdToken(token); setCognitoUser(user); };

  const handleLogout = () => {
    if (cognitoUser) cognitoUser.signOut();
    setIdToken(null); setCognitoUser(null); setStudents([]); setSelected(null);
  };

  const openProfile = async (id) => {
    setLoading(true);
    try {
      const full = await api.getStudent(id);
      setSelected(full);
      setNotesDraft(full.notes || '');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const adjustPoints = async (delta) => {
    if (!selected) return;
    try {
      const reason = reasonInput || (delta > 0 ? 'Points awarded' : 'Points removed');
      await api.grantPoints(selected.id, delta, reason);
      const fresh = await api.getStudent(selected.id);
      setSelected(fresh);
      setStudents(prev => prev.map(s => s.id === selected.id ? { ...s, points: fresh.points } : s));
      setReasonInput('');
    } catch (err) { setError(err.message); }
  };

  const saveNotes = async () => {
    if (!selected || notesDraft === selected.notes) return;
    try {
      const updated = await api.updateStudent(selected.id, { notes: notesDraft });
      setSelected(prev => ({ ...prev, notes: updated.notes }));
    } catch (err) { setError(err.message); }
  };

  const handleCreateStudent = async (data) => {
    const created = await api.createStudent(data);
    setStudents(prev => [...prev, created]);
  };

  const handleDeleteStudent = async () => {
    if (!selected) return;
    await api.deleteStudent(selected.id);
    setStudents(prev => prev.filter(s => s.id !== selected.id));
    setShowDeleteModal(false);
    setSelected(null);  // Return to dashboard
  };

  if (!idToken) return <LoginScreen onLogin={handleLogin} />;

  const filtered = search
    ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : students;

  // ---- Profile view ----
  if (selected) {
    const tier = getTier(selected.points);
    const TierIcon = tier.icon;
    return (
      <div style={{ minHeight: '100vh', background: '#faf7f2', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
          <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#78716c', fontSize: 15, cursor: 'pointer', padding: 0, marginBottom: 20 }}>
            <ArrowLeft size={18} /> Back to class
          </button>

          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e7e2d8', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: tier.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                {selected.photo || '🌱'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#1c1917', marginBottom: 2 }}>{selected.name}</div>
                <div style={{ fontSize: 14, color: '#78716c' }}>{selected.grade}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', background: tier.bg, borderRadius: 12 }}>
              <TierIcon size={24} color={tier.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: tier.color, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tier.name}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: tier.color, lineHeight: 1 }}>
                  {selected.points} <span style={{ fontSize: 14, fontWeight: 500 }}>talents</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid #e7e2d8', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>Adjust talents</div>
            <input type="text" placeholder="Reason (optional)" value={reasonInput} onChange={e => setReasonInput(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, marginBottom: 10, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#78716c' }}>Amount:</span>
              {[1, 5, 10].map(n => (
                <button key={n} onClick={() => setPointInput(n)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: pointInput === n ? '1.5px solid #1c1917' : '1px solid #e7e2d8', background: pointInput === n ? '#1c1917' : '#fff', color: pointInput === n ? '#fff' : '#1c1917', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
                  {n}
                </button>
              ))}
              <input type="number" value={pointInput} onChange={e => setPointInput(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: 70, padding: '6px 10px', fontSize: 14, border: '1px solid #e7e2d8', borderRadius: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => adjustPoints(pointInput)} style={{ flex: 1, padding: '14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Plus size={20} /> Grant
              </button>
              <button onClick={() => adjustPoints(-pointInput)} style={{ flex: 1, padding: '14px', background: '#fff', color: '#dc2626', border: '1.5px solid #dc2626', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Minus size={20} /> Revoke
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid #e7e2d8', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>Notes</div>
            <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)} onBlur={saveNotes}
              placeholder="Add observations, strengths, areas to support..."
              style={{ width: '100%', minHeight: 80, padding: '10px 12px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 10, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }} />
            <button onClick={saveNotes} style={{ marginTop: 8, padding: '8px 16px', background: '#1c1917', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Save size={14} /> Save notes
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid #e7e2d8', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>Recent activity</div>
            {(!selected.history || selected.history.length === 0) ? (
              <div style={{ fontSize: 14, color: '#a8a29e', padding: '20px 0', textAlign: 'center' }}>No activity yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', background: '#faf7f2', borderRadius: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: '#1c1917' }}>{h.reason}</div>
                      <div style={{ fontSize: 12, color: '#a8a29e', marginTop: 2 }}>{h.timestamp?.slice(0, 10) || h.date}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: h.delta > 0 ? '#16a34a' : '#dc2626' }}>
                      {h.delta > 0 ? '+' : ''}{h.delta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger zone — placed at bottom, visually separate */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid #e7e2d8' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Danger zone</div>
            <div style={{ fontSize: 13, color: '#78716c', marginBottom: 12, lineHeight: 1.5 }}>
              Removing this student deletes their profile, point total, and entire activity history. This cannot be undone.
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '10px 16px', background: '#fff', color: '#dc2626',
                border: '1px solid #fca5a5', borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
              <Trash2 size={16} /> Remove {selected.name.split(' ')[0]}
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteConfirmModal
            studentName={selected.name}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteStudent}
          />
        )}
      </div>
    );
  }

  // ---- Dashboard ----
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: 500 }}>Well Done</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1c1917', margin: 0, lineHeight: 1.2 }}>Class dashboard</h1>
          </div>
          <button onClick={handleLogout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', padding: 8 }}>
            <LogOut size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', color: '#dc2626', fontSize: 13, borderRadius: 10, marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>×</button>
          </div>
        )}

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} color="#a8a29e" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 42px', fontSize: 15, border: '1px solid #e7e2d8', borderRadius: 12, background: '#fff', boxSizing: 'border-box', outline: 'none' }} />
        </div>

        {loading && students.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#a8a29e' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(s => {
              const tier = getTier(s.points);
              const TierIcon = tier.icon;
              return (
                <button key={s.id} onClick={() => openProfile(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: '#fff', border: '1px solid #e7e2d8', borderRadius: 16, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: tier.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                    {s.photo || '🌱'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1c1917', marginBottom: 2 }}>{s.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TierIcon size={12} color={tier.color} />
                      <span style={{ fontSize: 12, color: tier.color, fontWeight: 500 }}>{tier.name}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1c1917', lineHeight: 1 }}>{s.points}</div>
                    <div style={{ fontSize: 11, color: '#a8a29e', marginTop: 2 }}>talents</div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && !loading && (
              <div style={{ padding: 40, textAlign: 'center', color: '#a8a29e', fontSize: 14 }}>
                {students.length === 0 ? 'No students yet. Tap the + button to add one.' : 'No students match your search.'}
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setShowAddModal(true)} title="Add student"
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 60, height: 60, borderRadius: 30,
          background: '#1c1917', color: '#fff', border: 'none',
          boxShadow: '0 8px 24px rgba(28, 25, 23, 0.3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
        }}>
        <UserPlus size={26} />
      </button>

      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} onCreate={handleCreateStudent} />
      )}
    </div>
  );
}
