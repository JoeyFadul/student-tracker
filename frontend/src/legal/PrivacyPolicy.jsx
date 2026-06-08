import privacyMd from './privacy.md?raw';
import { LegalPage } from './LegalPage';

export function PrivacyPolicy() {
  return <LegalPage markdown={privacyMd} />;
}
