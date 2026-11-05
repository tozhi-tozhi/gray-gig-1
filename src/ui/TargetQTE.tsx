import { useEffect, useRef, useState } from 'react';
import type { Gig } from '../app/types';
import { Button } from './Button';
import { beep, flash, shake } from '../systems/feedback';

type Phase = 'ready' | 'play' | 'done';

const TARGETS = 6;   // จำนวนเป้าทั้งหมด (ปรับตรงนี้)
const GAP_MS = 350;  // เวลาพักก่อนเป้าถัดไปโผล่

const randomPos = () => ({ x: 12 + Math.random() * 76, y: 12 + Math.random() * 76 });

export function TargetQTE({ gig, onDone }: { gig: Gig; onDone: (score: number) => void }) {
  const lifeMs = 1400 - gig.tier * 150;       // เป้าอยู่นานแค่ไหน ยิ่งยากยิ่งสั้น
  const size = Math.max(36, 60 - gig.tier * 5); // ขนาดเป้า (พิกเซล)

  const [phase, setPhase] = useState<Phase>('ready');
  const [n, setN] = useState(0);        // จำนวนเป้าที่ผ่านไปแล้ว
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('done');
    setPos(null);
    const s = Math.round((hits / TARGETS) * 100);
    if (s >= 80) { beep('good'); flash('#10b981'); }
    else if (s >= 40) { beep('warn'); }
    else { beep('bad'); shake(); flash('#ef4444'); }
    setTimeout(() => onDone(s), 900);
  };

  // วนเป้าทีละอัน: รอ → โผล่ → ถ้าไม่กดภายในเวลาถือว่าพลาด
  useEffect(() => {
    if (phase !== 'play') return;
    if (n >= TARGETS) { finish(); return; }
    setPos(null);
    const spawn = setTimeout(() => setPos(randomPos()), GAP_MS);
    const expire = setTimeout(() => { beep('bad'); setN(v => v + 1); }, GAP_MS + lifeMs);
    return () => { clearTimeout(spawn); clearTimeout(expire); };
  }, [phase, n]);

  const hit = () => {
    if (phase !== 'play' || !pos) return;
    beep('good');
    setHits(h => h + 1);
    setPos(null);
    setN(v => v + 1);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">Contract in progress</div>
        <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
        <div className="text-xs text-neutral-400 mt-1 h-4">
          {phase === 'ready' && 'กดเป้าที่โผล่ขึ้นมาให้ทัน'}
          {phase === 'play' && `เป้า ${Math.min(n + 1, TARGETS)}/${TARGETS} · โดน ${hits}`}
          {phase === 'done' && `โดน ${hits}/${TARGETS}`}
        </div>
      </div>

      <div className="relative w-full h-64 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden">
        {pos && (
          <button
            onClick={hit}
            className="absolute rounded-full bg-red-500/30 border-2 border-red-400 flex items-center justify-center active:scale-90 transition"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: size,
              height: size,
              transform: 'translate(-50%, -50%)',
            }}
          >
            🎯
          </button>
        )}
      </div>

      {phase === 'ready' && (
        <Button variant="primary" onClick={() => { beep('tick'); setPhase('play'); }}>เริ่มเล็ง</Button>
      )}
    </div>
  );
}