import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { resolveGig } from '../systems/gigSystem';

export function ActiveGigScreen() {
  const activeId = useGame(s => s.activeGigId);
  const gig = GIGS.find(g => g.id === activeId);

  if (!gig) return null;

  return (
    <>
      <StatusBar />
      <div className="active-gig-screen flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="gig-orbit" aria-hidden="true">
          <span className="gig-orbit-ring" />
          <span className="text-5xl relative z-10">🕶️</span>
        </div>
        <div className="text-center">
          <div className="active-kicker text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">Contract in progress</div>
          <div className="text-xs text-neutral-400 mt-2">กำลังทำงาน...</div>
          <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
        </div>
        <div className="active-progress" aria-label="งานกำลังดำเนินการ">
          <span />
          <span />
          <span />
        </div>
        <Button variant="primary" onClick={() => resolveGig(gig)}>
          เสร็จงาน
        </Button>
      </div>
    </>
  );
}
