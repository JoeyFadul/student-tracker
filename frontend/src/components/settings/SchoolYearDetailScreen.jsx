import { DetailScreen } from './DetailScreen';
import { SchoolYearSection } from './SchoolYearSection';

export function SchoolYearDetailScreen({
  schoolYear,
  onStartYear,
  onEndYear,
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
        onOpenArchive={onOpenArchive}
      />
    </DetailScreen>
  );
}
