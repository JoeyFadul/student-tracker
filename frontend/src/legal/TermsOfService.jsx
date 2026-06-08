import termsMd from './terms.md?raw';
import { LegalPage } from './LegalPage';

export function TermsOfService() {
  return <LegalPage markdown={termsMd} />;
}
