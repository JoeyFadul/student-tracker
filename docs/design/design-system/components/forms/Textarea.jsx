import React from 'react';
import { Label, inputBaseStyle } from './Input.jsx';

export function Textarea({ label, style, ...textareaProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <textarea {...textareaProps} style={{ ...inputBaseStyle, minHeight: 88, resize: 'vertical', lineHeight: 1.5, ...style }} />
    </>
  );
}
