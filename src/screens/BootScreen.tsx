import { useEffect, useRef } from 'react';
import { goTo } from '../systems/fsm';

export function BootScreen() {
  const fired = useRef(false);
  
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    
    // เพิ่ม console.log เพื่อเช็กว่าโค้ดทำงานถึงจุดนี้ไหม
    console.log('[BootScreen] เริ่มจับเวลา 800ms...');
    
    const t = setTimeout(() => {
      console.log('[BootScreen] เวลาหมด! กำลังเรียก goTo("home")');
      goTo('home');
    }, 800);
    
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      backgroundColor: '#000000', 
      color: '#ffffff' 
    }}>
      {/* เปลี่ยนจาก animation string ตรงๆ เป็นชื่อ keyframe ที่นิยามใน CSS */}
      <div style={{ 
        fontSize: '2.25rem', 
        fontWeight: 'bold', 
        letterSpacing: '0.1em',
        animation: 'pulse 2s ease-in-out infinite' 
      }}>
        GRAY GIG
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#737373' }}>
        v0.1.0 — prototype
      </div>
    </div>
  );
}