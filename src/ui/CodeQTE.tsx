import { useEffect, useRef, useState } from 'react';
import type { Gig } from '../app/types';
import { Button } from './Button';
import { useCountdown } from './useCountdown';
import { beep, shake, flash } from '../systems/feedback';

type Phase = 'ready' | 'show' | 'input' | 'done';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const RESHUFFLE_TIER = 4; // งานเทียร์นี้ขึ้นไป ปุ่มจะสลับใหม่ทุกครั้งที่กด (ปรับตรงนี้)

// สลับลำดับแบบสุ่ม
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function CodeQTE({ gig, onDone }: { gig: Gig; onDone: (score: number) => void }) {
  const len = gig.tier <= 2 ? 3 : gig.tier <= 4 ? 4 : 5; // จำนวนหลัก
  const showMs = 3000 - gig.tier * 250;                   // เวลาที่เห็นรหัส (มิลลิวินาที)
  const inputSec = 5 + len * 1.5;                         // เวลากดรหัส (วินาที)

  const [code] = useState(() =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('')
  );
  const [keys, setKeys] = useState(() => shuffle(DIGITS)); // ลำดับปุ่มตัวเลขที่สุ่มไว้
  const [phase, setPhase] = useState<Phase>('ready');
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const doneRef = useRef(false);

  // จัดปุ่มลงตาราง 3x4: ตัวเลข 9 ตัว, ลบ, ตัวเลขที่เหลือ, ช่องว่าง
  const layout = [...keys.slice(0, 9), '⌫', keys[9], ''];

  const finish = (entered: string) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('done');
    let correct = 0;
    for (let i = 0; i < len; i++) if (entered[i] === code[i]) correct++;
    const s = Math.round((correct / len) * 100);
    setScore(s);
    if (s >= 100) { beep('good'); flash('#10b981'); }
    else if (s >= 50) { beep('warn'); }
    else { beep('bad'); shake(); flash('#ef4444'); }
    setTimeout(() => onDone(s), 1000);
  };

  useEffect(() => {
    if (phase !== 'show') return;
    const t = setTimeout(() => setPhase('input'), showMs);
    return () => clearTimeout(t);
  }, [phase, showMs]);

  const left = useCountdown(inputSec, phase === 'input', () => finish(typed));

  const press = (d: string) => {
    if (phase !== 'input') return;
    const next = typed + d;
    beep('tick');
    setTyped(next);
    if (gig.tier >= RESHUFFLE_TIER) setKeys(shuffle(DIGITS)); // สลับปุ่มใหม่
    if (next.length >= len) finish(next);
  };
  const del = () => phase === 'input' && setTyped(typed.slice(0, -1));

  const cell = (i: number) => {
    if (phase === 'show') return { text: code[i], cls: 'text-emerald-300' };
    if (phase === 'input') return { text: typed[i] ?? '', cls: 'text-white' };
    if (phase === 'done') {
      return { text: typed[i] ?? '·', cls: typed[i] === code[i] ? 'text-emerald-400' : 'text-red-400' };
    }
    return { text: '?', cls: 'text-neutral-500' };
  };

  const hint =
    phase === 'ready' ? 'จำรหัสให้ได้ แล้วกดตามก่อนหมดเวลา'
    : phase === 'show' ? '👀 จำรหัสนี้!'
    : phase === 'input' ? (gig.tier >= RESHUFFLE_TIER ? '⚠️ ปุ่มสลับทุกครั้งที่กด!' : '⌨️ ปุ่มสุ่มตำแหน่ง ระวังกดผิด')
    : score === 100 ? '🎯 แฮ็กสำเร็จ!' : `คะแนน ${score}/100 · รหัสที่ถูกคือ ${code}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">Contract in progress</div>
        <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
        <div className="text-xs text-neutral-400 mt-1 h-4">{hint}</div>
      </div>

      <div className="flex gap-2 text-3xl font-mono font-bold">
        {Array.from({ length: len }).map((_, i) => {
          const c = cell(i);
          return (
            <span key={i} className={`w-10 h-14 flex items-center justify-center rounded-lg bg-neutral-800 border border-white/10 ${c.cls}`}>
              {c.text}
            </span>
          );
        })}
      </div>

      {phase === 'input' && (
        <>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className={`h-full ${left <= 3 ? 'bg-red-500' : 'bg-amber-400'}`}
              style={{ width: `${(left / inputSec) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
            {layout.map((k, i) =>
              k === '' ? <span key={i} /> : (
                <button
                  key={i}
                  onClick={() => (k === '⌫' ? del() : press(k))}
                  className="py-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold active:scale-95 transition"
                >
                  {k}
                </button>
              )
            )}
          </div>
        </>
      )}

      {phase === 'ready' && (
        <Button variant="primary" onClick={() => { beep('tick'); setPhase('show'); }}>เริ่มแฮ็ก</Button>
      )}
    </div>
  );
}