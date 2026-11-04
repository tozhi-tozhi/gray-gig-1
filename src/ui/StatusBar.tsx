import { useGame } from '../app/store';
import { BLOCK_LABEL, DEBT_GOAL } from '../app/constants';

export function StatusBar() {
  const { time, stats } = useGame(s => ({ time: s.time, stats: s.stats }));

  // ฟังก์ชันช่วยเลือกสีตามค่าสถานะ
  const getSanityColor = (v: number) => v <= 20 ? 'text-red-400' : v <= 50 ? 'text-yellow-400' : 'text-emerald-400';
  const getHeatColor = (v: number) => v >= 80 ? 'text-red-400' : v >= 50 ? 'text-orange-400' : 'text-neutral-400';

  return (
    <div className="status-bar shrink-0 px-3 py-2.5 border-b border-white/10 text-[11px] flex flex-col gap-1.5 bg-neutral-900/90 backdrop-blur-sm z-50">
      {/* แถวบน: เวลา และเป้าหมายเงิน */}
      <div className="flex items-center justify-between">
        <div className="font-semibold tracking-wide whitespace-nowrap text-emerald-400">
          Day {time.day} · {BLOCK_LABEL[time.block]}
        </div>
        <div className="font-semibold text-emerald-300">
          🎯 เป้าหมาย: ${stats.money} / ${DEBT_GOAL}
        </div>
      </div>

      {/* แถวล่าง: หลอดสถานะ */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getHeatColor(stats.heat)}`}>🔥 {stats.heat}</span>
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${stats.heat}%` }} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getSanityColor(stats.sanity)}`}>🧠 {stats.sanity}</span>
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className={`h-full ${stats.sanity <= 20 ? 'bg-red-500' : 'bg-blue-400'}`} style={{ width: `${stats.sanity}%` }} />
          </div>
        </div>

        <div className="font-bold text-neutral-300">⭐ Rep {stats.rep}</div>
      </div>
    </div>
  );
}