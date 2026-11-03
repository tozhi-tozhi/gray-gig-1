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
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-5xl animate-bounce">🕶️</div>
        <div className="text-center">
          <div className="text-xs text-neutral-400">กำลังทำงาน...</div>
          <h2 className="text-lg font-bold mt-1">{gig.title}</h2>
        </div>
        <Button variant="primary" onClick={() => resolveGig(gig)}>
          เสร็จงาน
        </Button>
      </div>
    </>
  );
}