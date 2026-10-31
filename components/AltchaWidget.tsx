import React, { useEffect, useRef } from 'react';
import type {} from 'altcha/types/react'; // JSX typing for <altcha-widget>
// The CSP-friendly ALTCHA build: its styles and proof-of-work worker are
// ordinary files served from this site — no inline scripts or blob: workers.
import 'altcha/external';
import 'altcha/altcha.css';
import Pbkdf2Worker from 'altcha/workers/pbkdf2?worker';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

// Must match the algorithm the server issues (server/formguard.js).
globalThis.$altcha.algorithms.set('PBKDF2/SHA-256', () => new Pbkdf2Worker());

interface AltchaWidgetProps {
  /**
   * Receives the solved-puzzle payload to send with the form, or null when
   * the puzzle isn't (or is no longer) solved — e.g. it expired.
   */
  onChange: (payload: string | null) => void;
}

/**
 * "I'm not a robot" checkbox backed by a self-hosted proof-of-work puzzle
 * (ALTCHA). Ticking it makes the browser solve a small puzzle the server
 * issued (~1 s); the server checks the solution with the form submission.
 * To get a fresh puzzle after a failed submission, remount it with a new `key`.
 */
const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onChange }) => {
  const ref = useRef<HTMLElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleState = (e: Event) => {
      const { state, payload } = (e as CustomEvent<{ state: string; payload?: string }>).detail;
      onChangeRef.current(state === 'verified' && payload ? payload : null);
    };
    el.addEventListener('statechange', handleState);
    return () => el.removeEventListener('statechange', handleState);
  }, []);

  return (
    <altcha-widget
      ref={ref}
      challenge={`${API_BASE}/api/altcha/challenge`}
      style={{
        '--altcha-max-width': '100%',
        '--altcha-border-radius': '0.5rem',
        '--altcha-color-primary': '#0A4A8F',
      }}
    />
  );
};

export default AltchaWidget;
