import { useGame } from '../app/store';
import { BLOCK_LABEL } from '../app/constants';

export function StatusBar() {
  const { time, stats } = useGame(s => ({ time: s.time, stats: s.stats }));

  return (
    <div className="shrink-0 px-4 py-2.5 bg-black/50 border-b border-white/10 text-[11px] flex items-center justify-between">
      <div className="font-semibold">
        Day {time.day} · {BLOCK_LABEL[time.block]}
      </div>
      <div className="flex gap-3">
        <span title="Money">💰 ${stats.money}</span>
        <span title="Heat">🔥 {stats.heat}</span>
        <span title="Sanity">🧠 {stats.sanity}</span>
        <span title="Rep">⭐ {stats.rep}</span>
      </div>
    </div>
  );
}