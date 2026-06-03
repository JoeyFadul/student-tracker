import { theme } from '../../theme';

export function Input({ label, ...inputProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <input {...inputProps} style={{ ...inputStyle, ...inputProps.style }} />
    </>
  );
}

export function Textarea({ label, ...textareaProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <textarea
        {...textareaProps}
        style={{
          ...inputStyle,
          minHeight: 88, resize: 'vertical', lineHeight: 1.5,
          ...textareaProps.style,
        }}
      />
    </>
  );
}

export function Select({ label, options, ...selectProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <select
        {...selectProps}
        style={{
          ...inputStyle,
          appearance: 'none',
          paddingRight: 40,
          backgroundImage: chevronSvg,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          ...selectProps.style,
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </>
  );
}

export function Label({ children }) {
  return (
    <label style={{
      display: 'block',
      fontSize: theme.font.sizes.footnote,
      fontWeight: 500,
      color: theme.colors.textMuted,
      marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

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

const chevronSvg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")';
