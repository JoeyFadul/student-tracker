import { UserPlus } from 'lucide-react';

export function AddStudentButton({ onClick }) {
  return (
    <button onClick={onClick} title="Add student" aria-label="Add student" style={buttonStyle}>
      <UserPlus size={26} />
    </button>
  );
}

const buttonStyle = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 60,
  height: 60,
  borderRadius: 30,
  background: '#1c1917',
  color: '#fff',
  border: 'none',
  boxShadow: '0 8px 24px rgba(28, 25, 23, 0.3)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
};
