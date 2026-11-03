import { useGame } from '../app/store';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { DAILY_COST } from '../app/constants';

export function EndOfDayScreen() {
  const { time, stats } = useGame(s => ({ time: s.time, stats: s.stats }));

  return (
    <>
      <StatusBar />
      <div className="flex-1 flex flex-col p-6 gap-4 justify-center">
        <div className="text-center">
          <div className="text-xs text-neutral-400">จบวัน</div>
          <h2 className="text-3xl font-bold mt-1">Day {time.day - 1} ✓</h2>
        </div>

        <div className="rounded-xl bg-neutral-800/50 border border-white/5 p-4 space-y-1.5 text-sm">
          <Row label="💰 เงินคงเหลือ" value={`$${stats.money}`} />
          <Row label="🔥 Heat" value={`${stats.heat}`} />
          <Row label="⭐ Rep" value={`${stats.rep}`} />
          <Row label="🧠 Sanity" value={`${stats.sanity}`} />
          <div className="border-t border-white/10 mt-2 pt-2 text-xs text-neutral-400">
            ค่าใช้จ่ายพรุ่งนี้: ${DAILY_COST}
          </div>
        </div>

        <Button variant="primary" onClick={() => goTo('home')}>เริ่ม Day {time.day}</Button>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}