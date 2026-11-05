import { useEffect, useRef, useState } from 'react';
import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { resolveGig } from '../systems/gigSystem';
import { beep, shake, flash } from '../systems/feedback';
import { CodeQTE } from '../ui/CodeQTE';
import { TargetQTE } from '../ui/TargetQTE';
import { SpotQTE } from '../ui/SpotQTE';

const ROUNDS = 3; // จำนวนรอบของ QTE จับจังหวะ
const randomCenter = () => 0.25 + Math.random() * 0.5;

// ชนิด QTE ทั้งหมด (อยากทดสอบชนิดเดียว ให้แก้เหลือชนิดเดียว เช่น ['spot'])
const MODES = ['timing', 'code', 'target', 'spot'] as const;
type Mode = (typeof MODES)[number];

export function ActiveGigScreen() {
  const activeId = useGame(s => s.activeGigId);
  const screen = useGame(s => s.screen);
  const gig = GIGS.find(g => g.id === activeId);

  const [mode] = useState<Mode>(() => MODES[Math.floor(Math.random() * MODES.length)]);
  const [started, setStarted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [label, setLabel] = useState('');
  const [center, setCenter] = useState(randomCenter);
  const posRef = useRef(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const tier = gig?.tier ?? 1;
  const zoneW = Math.max(0.12, 0.34 - tier * 0.045);
  const half = zoneW / 2;
  const round = scores.length;

  // ลูปตัวเลื่อนของ QTE จับจังหวะ
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    const speed = 0.9 + tier * 0.25;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let p = posRef.current + dir * speed * dt;
      if (p >= 1) { p = 1; dir = -1; }
      else if (p <= 0) { p = 0; dir = 1; }
      posRef.current = p;
      if (markerRef.current) markerRef.current.style.left = `${p * 100}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, round, tier]);

  if (!gig || screen !== 'activeGig') return null;

  // QTE ชนิดอื่น แยกเป็นคอมโพเนนต์ของตัวเอง
  if (mode !== 'timing') {
    const QTE = mode === 'code' ? CodeQTE : mode === 'target' ? TargetQTE : SpotQTE;
    return (
      <>
        <StatusBar />
        <QTE gig={gig} onDone={(score) => resolveGig(gig, score)} />
      </>
    );
  }

  // ===== QTE จับจังหวะ =====
  const finished = round >= ROUNDS;

  const tap = () => {
    if (doneRef.current) return;
    const dist = Math.abs(posRef.current - center);
    let score = 0;
    let text = '';
    if (dist <= half * 0.35) { score = 100; text = '🎯 PERFECT'; beep('good'); flash('#10b981'); }
    else if (dist <= half) { score = 70; text = '👍 GOOD'; beep('good'); }
    else if (dist <= half * 1.6) { score = 30; text = '😬 เฉียด'; beep('warn'); }
    else { score = 0; text = '❌ พลาด'; beep('bad'); shake(); flash('#ef4444'); }

    const next = [...scores, score];
    setScores(next);
    setLabel(text);

    if (next.length >= ROUNDS) {
      doneRef.current = true;
      setStarted(false);
      const avg = Math.round(next.reduce((a, b) => a + b, 0) / ROUNDS);
      setTimeout(() => resolveGig(gig, avg), 800);
    } else {
      posRef.current = 0;
      setCenter(randomCenter());
    }
  };

  return (
    <>
      <StatusBar />
      <div className="active-gig-screen flex-1 flex flex-col items-center justify-center p-6 gap-5">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">Contract in progress</div>
          <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
          <div className="text-xs text-neutral-400 mt-1">
            {started ? `กดตอนตัวเลื่อนอยู่ในโซนเขียว (${Math.min(round + 1, ROUNDS)}/${ROUNDS})` : 'จับจังหวะให้แม่น ผลงานจะดีขึ้น'}
          </div>
        </div>

        <div className="relative w-full h-10 rounded-xl bg-neutral-800 overflow-hidden border border-white/10">
          <div
            className="absolute top-0 h-full bg-emerald-500/40 border-x border-emerald-400"
            style={{ left: `${(center - half) * 100}%`, width: `${zoneW * 100}%` }}
          />
          <div ref={markerRef} className="absolute top-0 h-full w-1.5 bg-white -translate-x-1/2" />
        </div>

        <div className="flex gap-3 text-sm h-6">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <span key={i} className="px-3 rounded-full bg-neutral-800 text-neutral-300">
              {scores[i] !== undefined ? scores[i] : '–'}
            </span>
          ))}
        </div>
        <div className="text-base font-bold h-6">{label}</div>

        {!started && !finished && (
          <Button variant="primary" onClick={() => setStarted(true)}>เริ่มทำงาน</Button>
        )}
        {started && (
          <Button variant="danger" onClick={tap}>กด!</Button>
        )}
      </div>
    </>
  );
}