// Form input primitives. All form fields in the app use these.

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
          minHeight: 80, resize: 'vertical', lineHeight: 1.5,
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
          paddingRight: 36,
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
      fontSize: 13,
      fontWeight: 500,
      color: '#57534e',
      marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 15,
  border: '1px solid #e7e2d8',
  borderRadius: 10,
  marginBottom: 16,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fff',
  outline: 'none',
};

const chevronSvg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")';
