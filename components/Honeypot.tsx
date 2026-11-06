import React from 'react';
import { HONEYPOT_FIELD } from '../services/formApi';

interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * A form field people never see or reach, but bots that fill in every input
 * do — the server then quietly drops the submission. Moved off-screen rather
 * than display:none, which some bots know to skip; hidden from screen readers
 * and the Tab order, and named so browser autofill leaves it alone.
 */
const Honeypot: React.FC<HoneypotProps> = ({ value, onChange }) => (
  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
    <label>
      Leave this field empty
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  </div>
);

export default Honeypot;
