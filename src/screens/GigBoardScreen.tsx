import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import type { Gig } from '../app/types';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { remainingBlocksInDay } from '../systems/timeSystem';
import { assessGigRisk, pct } from '../systems/gigRisk';

export function GigBoardScreen() {
  const stats = useGame(s => s.stats);
  const gigIds = useGame(s => s.dailyGigIds);
  const debt = useGame(s => s.debt);
  const time = useGame(s => s.time);
  const remaining = remainingBlocksInDay();

  // เงื่อนไขพี่โจคุมเข้ม: อารมณ์ต่ำกว่า 30 หรือเหลือเวลาอีก 2 วันสุดท้าย
  const daysLeft = debt.deadlineDay - time.day;
  const isThreatened = debt.creditorMood < 30 || daysLeft <= 2;

  // งานของวันนี้ มาจาก store (ไม่สุ่มใหม่เมื่อเปิดหน้านี้)
  const dailyGigs = gigIds
    .map(id => GIGS.find(g => g.id === id))
    .filter((g): g is Gig => !!g);

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">Dark network</div>
            <h2 className="font-bold tracking-tight">งานเทาที่เปิดอยู่</h2>
          </div>
          <Button variant="ghost" className="!w-auto !py-1.5 !px-3 !text-xs" onClick={() => goTo('home')}>
            ← กลับ
          </Button>
        </div>

        <div className="board-caption">
          <span className="board-live-dot" />
          <span>AVAILABLE CONTRACTS</span>
          <span className="ml-auto">{dailyGigs.length} LISTED</span>
        </div>

        {dailyGigs.length === 0 && (
          <div className="rounded-xl bg-neutral-800/50 border border-white/5 p-4 text-sm text-neutral-400 text-center">
            งานวันนี้หมดแล้ว รอพรุ่งนี้ค่อยมีงานใหม่เข้ามา
          </div>
        )}

        {dailyGigs.map(gig => {
          const fits = gig.durationBlocks <= remaining;
          const isLockedByCreditor = isThreatened && gig.tier >= 3; // ล็อกงาน Tier 3 ขึ้นไป
          const risk = assessGigRisk(gig, stats);
          return (
            <button
              key={gig.id}
              disabled={!fits || isLockedByCreditor}
              onClick={() => {
                useGame.setState({ activeGigId: gig.id });
                goTo('gigDetail');
              }}
              className="gig-card w-full text-left rounded-xl bg-neutral-800/50 border border-white/5 hover:border-emerald-600/50 disabled:opacity-40 p-3 transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-sm">{gig.title}</div>
                <div className="gig-tier text-[10px] shrink-0">TIER {gig.tier}</div>
              </div>
              <div className="text-xs text-neutral-400 mt-1 line-clamp-2">{gig.description}</div>
              <div className="text-[11px] text-neutral-500 mt-3 flex flex-wrap gap-x-3 gap-y-1">
                <span>💰 ${gig.rewardMoney}</span>
                <span>⏱ {gig.durationBlocks} ช่วง</span>
                <span>🔥 +{gig.heatGain}</span>
              </div>
              {risk.total > 0 && !isLockedByCreditor && (
                <div className={`text-[11px] mt-2 font-semibold ${risk.total >= 0.3 ? 'text-red-400' : 'text-amber-400'}`}>
                  ⚠️ เสี่ยงแพ้ {pct(risk.total)}
                </div>
              )}
              {!fits && <div className="text-[11px] text-red-400 mt-2">เวลาเหลือไม่พอ</div>}
              {isLockedByCreditor && <div className="text-[11px] text-orange-400 mt-2">🔒 พี่โจสั่งล็อกงานใหญ่ (ต้องรีบเคลียร์หนี้)</div>}
            </button>
          );
        })}
      </div>
    </>
  );
}