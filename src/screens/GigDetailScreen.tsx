import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { acceptGig } from '../systems/gigSystem';

export function GigDetailScreen() {
  const activeId = useGame(s => s.activeGigId);
  const gig = GIGS.find(g => g.id === activeId);

  if (!gig) {
    return (
      <>
        <StatusBar />
        <div className="flex-1 p-4">
          <p className="text-sm text-neutral-400">ไม่พบงาน</p>
          <Button variant="ghost" className="mt-4" onClick={() => goTo('gigBoard')}>← กลับ</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl bg-neutral-800/50 border border-white/5 p-4">
          <div className="text-xs text-neutral-400">Tier {gig.tier}</div>
          <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
          <p className="text-sm text-neutral-300 mt-2">{gig.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat label="💰 ค่าตอบแทน" value={`$${gig.rewardMoney}`} />
          <Stat label="⭐ Rep" value={`+${gig.rewardRep}`} />
          <Stat label="🔥 Heat" value={`+${gig.heatGain}`} />
          <Stat label="🧠 Sanity" value={`-${gig.sanityCost}`} />
          <Stat label="⏱ ใช้เวลา" value={`${gig.durationBlocks} ช่วง`} />
          <Stat label="🚨 เสี่ยงตำรวจ" value={`${Math.round(gig.policeRisk * 100)}%`} />
        </div>

        <div className="space-y-2">
          <Button variant="primary" onClick={() => acceptGig(gig)}>รับงานนี้</Button>
          <Button variant="ghost" onClick={() => goTo('gigBoard')}>← กลับ</Button>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-800/40 p-2.5">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}