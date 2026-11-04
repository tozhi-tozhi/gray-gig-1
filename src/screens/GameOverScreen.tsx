import { useGame } from '../app/store';
import { DEBT_GOAL, TOTAL_DAYS } from '../app/constants';
import { Button } from '../ui/Button';

export function GameOverScreen() {
  const { screen, stats, time } = useGame(s => ({ screen: s.screen, stats: s.stats, time: s.time }));
  
  // เงื่อนไขการชนะ
  const isWin = screen === 'gameWin';
  const paidDebt = isWin && stats.money >= DEBT_GOAL;

  // หาสาเหตุการตาย (ถ้าแพ้)
  let deathReason = "";
  if (!isWin) {
    if (stats.sanity <= 0) deathReason = "สติแตก! คุณทนความกดดันไม่ไหวจนต้องยอมแพ้ทุกอย่าง";
    else if (stats.money < 0) deathReason = "เงินหมดตัว! คุณถูกไล่ที่และไม่มีเงินจ่ายค่ากินอยู่";
    else deathReason = "คุณปล่อยเวลาให้ล่วงเลยจนเลยเดดไลน์";
  }

  const title = isWin
    ? paidDebt ? '🏆 จ่ายหนี้ครบ!' : '✨ เอาตัวรอดได้!'
    : '💀 GAME OVER';

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 gap-6 ${isWin ? 'bg-emerald-950/40' : 'bg-red-950/40'}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {isWin ? (
          <p className="text-emerald-200">คุณรอดชีวิตและใช้หนี้หมดภายใน {time.day} วัน</p>
        ) : (
          <p className="text-red-300 font-semibold text-lg">{deathReason}</p>
        )}
      </div>

      <div className="bg-black/30 rounded-xl p-4 w-full max-w-xs text-sm space-y-2 border border-white/10">
        <div className="flex justify-between"><span className="text-neutral-400">วันที่ไปถึง:</span> <span>Day {time.day} / {TOTAL_DAYS}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">เงินคงเหลือ:</span> <span>${stats.money} / ${DEBT_GOAL}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">สติคงเหลือ:</span> <span>{stats.sanity}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">ระดับความเสี่ยง:</span> <span>{stats.heat}</span></div>
      </div>

      <Button variant="primary" onClick={() => window.location.reload()} className="max-w-xs">
        เริ่มเกมใหม่
      </Button>
    </div>
  );
}