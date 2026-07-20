import { Plus, CheckCheck, ListChecks } from 'lucide-react';
import { ActionChip } from '../ui/ActionChip';

// Dashboard action row (wireframe frame 1). Out of select mode: a one-tap
// "Class point" (+1 to the whole class) and a "Select" entry into bulk mode.
// In select mode: a single select-all toggle. Replaces the old full-width
// "Award to multiple students" band.
export function DashboardActions({
  selectMode,
  allSelected,
  classPointBusy,
  onClassPoint,
  onEnterSelect,
  onToggleAll,
}) {
  if (selectMode) {
    return (
      <div style={rowStyle}>
        <ActionChip
          icon={<CheckCheck size={16} strokeWidth={2.2} />}
          active={allSelected}
          onClick={onToggleAll}
          ariaLabel={allSelected ? 'Deselect all students' : 'Select all students'}
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </ActionChip>
      </div>
    );
  }
  return (
    <div style={rowStyle}>
      <ActionChip
        icon={<Plus size={16} strokeWidth={2.6} />}
        tone="accent"
        disabled={classPointBusy}
        onClick={onClassPoint}
        ariaLabel="Give the whole class a point"
      >
        Class point
      </ActionChip>
      <ActionChip
        icon={<ListChecks size={16} strokeWidth={2.2} />}
        onClick={onEnterSelect}
        ariaLabel="Select multiple students"
      >
        Select
      </ActionChip>
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 14,
};
