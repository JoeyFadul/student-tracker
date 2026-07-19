import React from 'react';
import { Label, inputBaseStyle } from './Input.jsx';

const chevronSvg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")';

// Native <select> styled as a soft-fill input — real system control on iOS.
export function Select({ label, options = [], style, ...selectProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <select {...selectProps}
        style={{
          ...inputBaseStyle, appearance: 'none', paddingRight: 40,
          backgroundImage: chevronSvg, backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center', ...style,
        }}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </>
  );
}
