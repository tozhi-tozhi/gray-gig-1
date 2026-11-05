import { useEffect, useRef } from 'react';
import { useGame, patch } from '../app/store';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { applyEventEffect } from '../systems/eventSystem';
import { applyDebtEffect } from '../systems/debtSystem';
import { setFlags, markEventSeen, recordHistory } from '../systems/storySystem';
import { useCountdown } from '../ui/useCountdown';
import { beep, shake } from '../systems/feedback';

export function EventScreen() {
  const activeEvent = useGame(s => s.activeEvent) as any;
  const doneRef = useRef(false);
  const timeLimit: number = activeEvent?.timeLimit ?? 0;

  // ใช้ได้ทั้งตัวเลือกปกติ และผลหมดเวลา (isTimeout = true)
  const handleChoice = (choice: any, isTimeout = false) => {
    if (doneRef.current) return;
    doneRef.current = true;

    const newStats = applyEventEffect(choice.effect);
    if (choice.debtEffect) applyDebtEffect(choice.debtEffect);
    if (choice.flags) setFlags(choice.flags);
    markEventSeen(activeEvent.id);

    // ตัดวงเล็บผลลัพธ์ท้ายป้ายตัวเลือกออก เช่น "จ่ายเงิน (💰 -100)" → "จ่ายเงิน"
    const picked = isTimeout
      ? 'ลังเลจนหมดเวลา'
      : String(choice.label).replace(/\s*\([^)]*\)\s*$/, '');
    recordHistory({
      kind: 'event',
      title: activeEvent.title,
      detail: `${picked} — ${choice.resultText}`,
      tag: isTimeout ? 'timeout' : activeEvent.requires ? 'story' : undefined,
    });

    patch({
      stats: newStats,
      lastResult: { title: activeEvent.title, lines: [choice.resultText] },
      activeEvent: null,
    });

    if (newStats.money < 0 || newStats.sanity <= 0 || newStats.heat >= 100) {
      goTo('gameOver');
      return;
    }
    goTo('home');
  };

  const left = useCountdown(timeLimit, timeLimit > 0 && !!activeEvent, () => {
    if (activeEvent?.timeout) {
      beep('bad');
      shake();
      handleChoice(activeEvent.timeout, true);
    }
  });

  // เตือนด้วยเสียงในช่วง 3 วินาทีสุดท้าย
  const secLeft = Math.ceil(left);
  useEffect(() => {
    if (timeLimit > 0 && secLeft > 0 && secLeft <= 3) beep('warn');
  }, [secLeft, timeLimit]);

  if (!activeEvent) return null;

  return (
    <>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 bg-neutral-900/95 screen-motion">
        <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-red-500/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse">
          {activeEvent.icon}
        </div>
        <div className="text-center space-y-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold">Unexpected Event</div>
          <h2 className="text-xl font-bold text-white">{activeEvent.title}</h2>
          <p className="text-sm text-neutral-300 leading-relaxed px-2">
            {activeEvent.description}
          </p>
        </div>

        {timeLimit > 0 && (
          <div className="w-full">
            <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full ${left <= 3 ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${(left / timeLimit) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-neutral-400 mt-1">⏱️ {secLeft} วินาที</div>
          </div>
        )}

        <div className="w-full space-y-3">
          {activeEvent.choices.map((choice: any, index: number) => (
            <Button
              key={index}
              variant={index === 0 ? 'primary' : 'secondary'}
              onClick={() => handleChoice(choice)}
              className="text-left justify-start !py-4"
            >
              {choice.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}