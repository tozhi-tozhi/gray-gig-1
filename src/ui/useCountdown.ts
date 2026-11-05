import { useEffect, useRef, useState } from 'react';

// นับถอยหลัง (วินาที) คืนค่าเวลาที่เหลือ และเรียก onExpire เมื่อหมดเวลา
export function useCountdown(totalSec: number, active: boolean, onExpire: () => void): number {
  const [left, setLeft] = useState(totalSec);
  const cbRef = useRef(onExpire);
  cbRef.current = onExpire; // ให้ใช้ฟังก์ชันล่าสุดเสมอ

  useEffect(() => {
    if (!active) return;
    setLeft(totalSec);
    const start = performance.now();
    const id = setInterval(() => {
      const remain = Math.max(0, totalSec - (performance.now() - start) / 1000);
      setLeft(remain);
      if (remain <= 0) {
        clearInterval(id);
        cbRef.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [active, totalSec]);

  return left;
}