import { useGame, patch } from '../app/store';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { applyEventEffect } from '../systems/eventSystem';
import { applyDebtEffect } from '../systems/debtSystem';

export function EventScreen() {
  const activeEvent = useGame(s => s.activeEvent) as any;
  if (!activeEvent) return null;

  const handleChoice = (choice: any) => {
    // คำนวณค่าสถานะใหม่
    const newStats = applyEventEffect(choice.effect);

    // ถ้าตัวเลือกนี้มีผลต่อระบบหนี้ (เหตุการณ์เจ้าหนี้) ให้จัดการด้วย
    if (choice.debtEffect) {
      applyDebtEffect(choice.debtEffect);
    }

    patch({
      stats: newStats,
      lastResult: { title: activeEvent.title, lines: [choice.resultText] },
      activeEvent: null,
    });

    if (newStats.money < 0 || newStats.sanity <= 0) {
      goTo('gameOver');
      return;
    }
    goTo('home');
  };

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
        <div className="w-full space-y-3 mt-4">
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