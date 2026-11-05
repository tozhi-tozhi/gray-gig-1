import { useGame } from '../app/store';
import { Button } from '../ui/Button';

export function GameOverScreen() {
  const { screen, stats, time, debt } = useGame(s => ({ screen: s.screen, stats: s.stats, time: s.time, debt: s.debt }));
  const isWin = screen === 'gameWin';

  let title = '';
  let subtitle = '';

  if (isWin) {
    title = '🏆 จ่ายหนี้ครบ!';
    subtitle = `คุณหาเงินได้ $${stats.money} และจ่ายหนี้ให้พี่โจครบภายในวัน ${time.day} คุณเป็นอิสระแล้ว!`;
  } else if (stats.sanity <= 0) {
    title = '🧠 สติแตก';
    subtitle = 'คุณทนความกดดันไม่ไหว สภาพจิตใจพังทลาย และยอมแพ้ทุกอย่าง';
  } else if (stats.money < 0) {
    title = '💸 เงินหมดตัว';
    subtitle = 'คุณถูกไล่ที่ ไม่มีเงินจ่ายค่ากินอยู่ และไม่มีใครช่วยเหลือ';
  } else {
    // แพ้เพราะเลยเส้นตาย แต่ยังจ่ายไม่ครบ
    title = '🕴️ พี่โจมาเก็บหนี้';
    subtitle = `เลยกำหนดวัน ${debt.deadlineDay} แล้ว แต่คุณมีแค่ $${stats.money} (ต้องการ $${debt.goal}) พี่โจไม่รออีกต่อไป...`;
  }

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 gap-6 ${isWin ? 'bg-emerald-950/40' : 'bg-red-950/40'}`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-sm text-neutral-300 leading-relaxed px-2">{subtitle}</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 w-full max-w-xs text-sm space-y-2 border border-white/10">
        <div className="flex justify-between"><span className="text-neutral-400">วันที่ไปถึง:</span> <span>Day {time.day} / {debt.deadlineDay}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">เงินคงเหลือ:</span> <span>${stats.money} / ${debt.goal}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">สติคงเหลือ:</span> <span>{stats.sanity}</span></div>
        <div className="flex justify-between"><span className="text-neutral-400">อารมณ์เจ้าหนี้:</span> <span>{debt.creditorMood}</span></div>
      </div>
      <Button variant="primary" onClick={() => window.location.reload()} className="max-w-xs">
        เริ่มเกมใหม่
      </Button>
    </div>
  );
}