import { useRef, useState } from 'react';
import type { Gig } from '../app/types';
import { Button } from './Button';
import { useCountdown } from './useCountdown';
import { beep, flash, shake } from '../systems/feedback';

type Phase = 'ready' | 'play' | 'done';

const ROUNDS = 3; // จำนวนรอบ (ปรับตรงนี้)

// คู่อีโมจิที่หน้าตาคล้ายกัน [ตัวปกติ, ตัวที่แตกต่าง]
const PAIRS: [string, string][] = [
  ['👁️', '👀'],
  ['🔒', '🔓'],
  ['🙂', '🙃'],
  ['🚓', '🚔'],
  ['📱', '📲'],
];

interface Puzzle { cells: string[]; oddIdx: number; size: number; }

function makePuzzle(tier: number): Puzzle {
  const size = tier <= 2 ? 4 : 5; // ยิ่งงานยาก ตารางยิ่งใหญ่
  const [a, b] = PAIRS[Math.floor(Math.random() * PAIRS.length)];
  const flip = Math.random() < 0.5;
  const base = flip ? b : a;
  const odd = flip ? a : b;
  const cells = Array(size * size).fill(base);
  const oddIdx = Math.floor(Math.random() * cells.length);
  cells[oddIdx] = odd;
  return { cells, oddIdx, size };
}

// แถบเวลาต่อรอบ (ใช้ key เปลี่ยนรอบเพื่อรีเซ็ตเวลา)
function RoundTimer({ sec, onExpire }: { sec: number; onExpire: () => void }) {
  const left = useCountdown(sec, true, onExpire);
  return (
    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
      <div
        className={`h-full ${left <= 1.5 ? 'bg-red-500' : 'bg-amber-400'}`}
        style={{ width: `${(left / sec) * 100}%` }}
      />
    </div>
  );
}

export function SpotQTE({ gig, onDone }: { gig: Gig; onDone: (score: number) => void }) {
  const roundSec = 6 - gig.tier * 0.6; // เวลาต่อรอบ ยิ่งยากยิ่งสั้น (ปรับตรงนี้)

  const [phase, setPhase] = useState<Phase>('ready');
  const [round, setRound] = useState(0);
  const [found, setFound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => makePuzzle(gig.tier));
  const doneRef = useRef(false);

  const advance = (ok: boolean) => {
    if (doneRef.current) return;
    const nextFound = found + (ok ? 1 : 0);
    setFound(nextFound);
    if (round + 1 >= ROUNDS) {
      doneRef.current = true;
      setPhase('done');
      const s = Math.round((nextFound / ROUNDS) * 100);
      if (s >= 100) { flash('#10b981'); }
      else if (s < 40) { shake(); flash('#ef4444'); }
      setTimeout(() => onDone(s), 900);
    } else {
      setRound(round + 1);
      setPuzzle(makePuzzle(gig.tier));
    }
  };

  const pick = (i: number) => {
    if (phase !== 'play') return;
    if (i === puzzle.oddIdx) { beep('good'); advance(true); }
    else { beep('bad'); shake(); advance(false); } // กดผิด = เสียรอบนี้
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">Contract in progress</div>
        <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
        <div className="text-xs text-neutral-400 mt-1 h-4">
          {phase === 'ready' && 'หาตัวที่ไม่เหมือนพวกให้เจอ'}
          {phase === 'play' && `รอบ ${round + 1}/${ROUNDS} · เจอแล้ว ${found}`}
          {phase === 'done' && `เจอ ${found}/${ROUNDS}`}
        </div>
      </div>

      {phase === 'play' && (
        <>
          <RoundTimer
            key={round}
            sec={roundSec}
            onExpire={() => { beep('bad'); advance(false); }}
          />
          <div
            className="grid gap-1 w-full max-w-[280px]"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}
          >
            {puzzle.cells.map((c, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="py-2 text-2xl rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 transition"
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'ready' && (
        <Button variant="primary" onClick={() => { beep('tick'); setPhase('play'); }}>เริ่มสังเกต</Button>
      )}
    </div>
  );
}