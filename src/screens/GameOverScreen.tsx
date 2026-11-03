import { useGame } from '../app/store';
import { DEBT_GOAL } from '../app/constants';
import { Button } from '../ui/Button';

export function GameOverScreen() {
  const { screen, stats, time } = useGame(s => ({ screen: s.screen, stats: s.stats, time: s.time }));
  const isWin = screen === 'gameWin';
  const paidDebt = isWin && stats.money >= DEBT_GOAL;

  const title = isWin
    ? paidDebt ? '🏆 จ่ายหนี้ครบ!' : '✨ เอาตัวรอดได้!'
    : stats.sanity <= 0 ? '🧠 สติแตก' : '💸 เงินหมด';

  const subtitle = isWin
    ? paidDebt ? `เหลือเงิน $${stats.money} — เกินเป้าหมาย $${DEBT_GOAL}`
               : `รอดชีวิตถึงวันที่ ${time.day} ด้วยเงิน $${stats.money}`
    : `ไปไม่ถึงวันที่ ${time.day}...`;

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 gap-4 ${isWin ? 'bg-emerald-950/40' : 'bg-red-950/40'}`}>
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      <p className="text-center text-sm text-neutral-300">{subtitle}</p>
      <Button variant="primary" onClick={() => window.location.reload()}>
        เล่นใหม่
      </Button>
    </div>
  );
}