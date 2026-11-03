import { useGame } from '../app/store';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { doNormalLife } from '../systems/lifeSystem';
import { goTo } from '../systems/fsm';

export function HomeScreen() {
  const lastResult = useGame(s => s.lastResult);
  const remaining = 3 - ['morning', 'afternoon', 'night'].indexOf(useGame.getState().time.block);

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {lastResult && (
          <div className="rounded-xl bg-emerald-900/30 border border-emerald-700/40 p-3">
            <div className="font-semibold text-sm text-emerald-300">{lastResult.title}</div>
            <ul className="mt-1 text-xs text-emerald-100/80 space-y-0.5">
              {lastResult.lines.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-neutral-800/50 border border-white/5 p-4">
          <div className="text-xs text-neutral-400">เหลืออีก</div>
          <div className="text-2xl font-bold">{remaining} ช่วงเวลา</div>
          <div className="text-xs text-neutral-500 mt-1">ในวันนี้</div>
        </div>

        <div className="space-y-2">
          <Button variant="secondary" onClick={() => doNormalLife('work')}>
            💼 ไปทำงานประจำ (+$200)
          </Button>
          <Button variant="secondary" onClick={() => doNormalLife('rest')}>
            🛏️ นอนพักผ่อน (+20🧠, -10🔥)
          </Button>
          <Button variant="primary" onClick={() => goTo('gigBoard')}>
            🕶️ เปิดแอปงานเทา
          </Button>
        </div>
      </div>
    </>
  );
}