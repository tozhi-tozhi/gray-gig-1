import { useGame } from '../app/store';
import { BLOCK_LABEL } from '../app/constants';

export function StatusBar() {
  const { time, stats } = useGame(s => ({ time: s.time, stats: s.stats }));

  return (
    <div className="status-bar shrink-0 px-3 py-2.5 border-b border-white/10 text-[11px] flex items-center justify-between gap-2">
      <div className="font-semibold tracking-wide whitespace-nowrap">
        Day {time.day} · {BLOCK_LABEL[time.block]}
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="status-stat" title="Money">💰 ${stats.money}</span>
        <span className="status-stat" title="Heat">🔥 {stats.heat}</span>
        <span className="status-stat" title="Sanity">🧠 {stats.sanity}</span>
        <span className="status-stat" title="Rep">⭐ {stats.rep}</span>
      </div>
    </div>
  );
}
