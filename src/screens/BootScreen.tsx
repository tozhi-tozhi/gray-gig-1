import { useEffect } from 'react';
import { goTo } from '../systems/fsm';

export function BootScreen() {
  useEffect(() => {
    const t = setTimeout(() => goTo('home'), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        GRAY GIG
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#737373' }}>
        v0.1.0 — prototype
      </div>
    </div>
  );
}