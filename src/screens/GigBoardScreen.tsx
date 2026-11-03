import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { remainingBlocksInDay } from '../systems/timeSystem';

export function GigBoardScreen() {
  const rep = useGame(s => s.stats.rep);
  const remaining = remainingBlocksInDay();

  const visible = GIGS.filter(g => g.tier <= rep + 1);

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">งานเทาที่เปิดอยู่</h2>
          <Button variant="ghost" className="!w-auto !py-1.5 !px-3 !text-xs" onClick={() => goTo('home')}>
            ← กลับ
          </Button>
        </div>

        {visible.map(gig => {
          const fits = gig.durationBlocks <= remaining;
          return (
            <button
              key={gig.id}
              disabled={!fits}
              onClick={() => {
                useGame.setState({ activeGigId: gig.id });
                goTo('gigDetail');
              }}
              className="w-full text-left rounded-xl bg-neutral-800/50 border border-white/5 hover:border-emerald-600/50 disabled:opacity-40 p-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-sm">{gig.title}</div>
                <div className="text-xs shrink-0 text-neutral-400">Tier {gig.tier}</div>
              </div>
              <div className="text-xs text-neutral-400 mt-1 line-clamp-2">{gig.description}</div>
              <div className="text-[11px] text-neutral-500 mt-2 flex gap-3">
                <span>💰 ${gig.rewardMoney}</span>
                <span>⏱ {gig.durationBlocks} ช่วง</span>
                <span>🔥 +{gig.heatGain}</span>
              </div>
              {!fits && <div className="text-[11px] text-red-400 mt-1">เวลาเหลือไม่พอ</div>}
            </button>
          );
        })}
      </div>
    </>
  );
}