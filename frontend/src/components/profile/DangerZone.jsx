// DangerZone: visually separated section at the bottom of a profile.
// Currently houses delete; could host other destructive actions in the future.

import { Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function DangerZone({ studentName, onDelete }) {
  const firstName = studentName.split(' ')[0];

  return (
    <Card style={{ marginBottom: 0 }}>
      <div style={labelStyle}>Danger zone</div>
      <div style={descriptionStyle}>
        Removing this student deletes their profile, point total, and entire activity history. This cannot be undone.
      </div>
      <Button variant="dangerOutline" size="sm" onClick={onDelete} icon={<Trash2 size={16} />}>
        Remove {firstName}
      </Button>
    </Card>
  );
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: '#dc2626',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 4,
};

const descriptionStyle = {
  fontSize: 13,
  color: '#78716c',
  marginBottom: 12,
  lineHeight: 1.5,
};
