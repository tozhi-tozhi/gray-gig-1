import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';
import { acceptGig } from '../systems/gigSystem';
import { assessGigRisk, pct } from '../systems/gigRisk';

export function GigDetailScreen() {
  const activeId = useGame(s => s.activeGigId);
  const stats = useGame(s => s.stats);
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

  const risk = assessGigRisk(gig, stats);
  const heatAfter = Math.min(100, stats.heat + gig.heatGain);
  const sanityAfter = Math.max(0, stats.sanity - gig.sanityCost);

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
          <Stat label="🔥 Heat" value={`+${gig.heatGain} (${stats.heat}→${heatAfter})`} />
          <Stat label="🧠 Sanity" value={`-${gig.sanityCost} (${stats.sanity}→${sanityAfter})`} />
          <Stat label="⏱ ใช้เวลา" value={`${gig.durationBlocks} ช่วง`} />
          <Stat label="🚨 เสี่ยงตำรวจ" value={`${Math.round(gig.policeRisk * 100)}%`} />
        </div>

        {risk.total > 0 && (
          <div
            className={`rounded-xl border p-3 ${
              risk.total >= 1 ? 'bg-red-950/70 border-red-500/60 text-red-100'
              : risk.total >= 0.3 ? 'bg-red-950/50 border-red-500/40 text-red-200'
              : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="font-bold text-xs">
              {risk.total >= 1 ? '🛑 รับงานนี้แล้วแพ้แน่นอน!' : `⚠️ คำเตือน: รับงานนี้มีโอกาสแพ้ ${pct(risk.total)}`}
            </div>
            <ul className="text-[11px] mt-1 space-y-0.5 opacity-90">
              {risk.heatDeath > 0 && <li>- 🔥 Heat เต็ม → ถูกจับกุม ({pct(risk.heatDeath)})</li>}
              {risk.sanityDeath > 0 && <li>- 🧠 สติหมด → สติแตก ({pct(risk.sanityDeath)})</li>}
            </ul>
            <div className="text-[10px] text-neutral-400 mt-1.5">
              คิดจากผลสุ่มของงานนี้ ฝีมือ QTE ช่วยลดโอกาสได้บางส่วน
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button variant={risk.total >= 1 ? 'danger' : 'primary'} onClick={() => acceptGig(gig)}>
            {risk.total >= 1 ? 'ฝืนรับงานนี้' : 'รับงานนี้'}
          </Button>
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