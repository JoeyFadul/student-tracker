import ReactMarkdown from 'react-markdown';
import { theme } from '../theme';

// Renders a piece of legal markdown in a clean reader column with a thin
// navy header so the URL is recognizably part of Well Done. Bypasses the
// app shell (no auth, no tab bar) — these pages must be reachable by App
// Store reviewers and anyone with the URL without signing in.
export function LegalPage({ markdown }) {
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <a href="/" style={brandStyle}>← Well Done</a>
      </div>
      <article style={articleStyle}>
        <ReactMarkdown components={mdComponents}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  color: theme.colors.text,
  fontFamily: theme.font.family,
};

const headerStyle = {
  background: theme.colors.surface,
  borderBottom: `1px solid ${theme.colors.border}`,
  padding: `calc(env(safe-area-inset-top) + 14px) 20px 14px`,
};

const brandStyle = {
  color: theme.colors.text,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 15,
  letterSpacing: '-0.01em',
};

const articleStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '40px 24px 80px',
  lineHeight: 1.65,
  fontSize: 16,
};

const mdComponents = {
  h1: ({ children }) => (
    <h1 style={{
      fontSize: 34, marginTop: 0, marginBottom: 6,
      fontWeight: 700, letterSpacing: '-0.02em',
      fontFamily: theme.font.display,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontSize: 22, marginTop: 40, marginBottom: 10,
      fontWeight: 600, letterSpacing: '-0.01em',
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontSize: 17, marginTop: 24, marginBottom: 8,
      fontWeight: 600,
    }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{ marginTop: 0, marginBottom: 14 }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ marginTop: 0, marginBottom: 16, paddingLeft: 24 }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6 }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700 }}>{children}</strong>
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: theme.colors.accent, textDecoration: 'underline' }}>{children}</a>
  ),
  hr: () => (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${theme.colors.border}`,
      margin: '28px 0',
    }} />
  ),
};
