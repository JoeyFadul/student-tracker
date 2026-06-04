import { DetailScreen } from './DetailScreen';
import { SchoolYearSection } from './SchoolYearSection';

export function SchoolYearDetailScreen({
  schoolYear,
  isOwner,
  onStartYear,
  onEndYear,
  onDeleteYear,
  onOpenArchive,
  onBack,
}) {
  return (
    <DetailScreen title="School year" onBack={onBack}>
      <SchoolYearSection
        active={schoolYear.active}
        years={schoolYear.years}
        onStart={onStartYear}
        onEnd={onEndYear}
        onDelete={isOwner ? onDeleteYear : null}
        onOpenArchive={onOpenArchive}
      />
    </DetailScreen>
  );
}
