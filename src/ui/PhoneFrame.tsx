import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#0a0a0a', 
      padding: '1rem' 
    }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '420px', 
        height: 'min(900px, calc(100vh - 2rem))', 
        backgroundColor: '#171717', 
        borderRadius: '2.5rem', 
        border: '6px solid #262626', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {children}
      </div>
    </div>
  );
}