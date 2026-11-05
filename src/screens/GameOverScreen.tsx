import { useMemo } from 'react';
import { useGame } from '../app/store';
import { Button } from '../ui/Button';
import { ENDINGS, buildEpilogue, getEndingCause } from '../systems/epilogue';

export function GameOverScreen() {
  const screen = useGame(s => s.screen);
  const stats = useGame(s => s.stats);
  const time = useGame(s => s.time);
  const debt = useGame(s => s.debt);
  const flags = useGame(s => s.flags);

  const isWin = screen === 'gameWin';
  const cause = getEndingCause(isWin);
  const ending = ENDINGS[cause];
  const epi = useMemo(() => buildEpilogue(cause), [cause]);
  const gigs = typeof flags.gigsDone === 'number' ? flags.gigsDone : 0;

  return (
    <div className={`flex-1 overflow-y-auto ${isWin ? 'bg-emerald-950/40' : 'bg-red-950/40'}`}>
      <div className="p-6 flex flex-col items-center gap-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">{ending.title}</h1>
          <p className="text-sm text-neutral-300 leading-relaxed px-2">
            {ending.subtitle({ money: stats.money, day: time.day, deadlineDay: debt.deadlineDay, goal: debt.goal })}
          </p>
        </div>

        {/* บทส่งท้าย */}
        <div className="w-full max-w-xs bg-black/30 rounded-xl p-4 border border-white/10 space-y-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-400/80 font-bold">📖 บทส่งท้าย</div>
          {epi.summary.map((t, i) => (
            <p key={i} className="text-xs text-neutral-300 leading-relaxed">{t}</p>
          ))}
        </div>

        {epi.story.length > 0 && (
          <div className="w-full max-w-xs bg-black/30 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-bold">🧵 เรื่องที่ตามคุณมา</div>
            {epi.story.map((t, i) => (
              <p key={i} className="text-xs text-neutral-300 leading-relaxed">{t}</p>
            ))}
          </div>
        )}

        {epi.highlights.length > 0 && (
          <div className="w-full max-w-xs bg-black/30 rounded-xl p-4 border border-white/10 space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-red-300/80 font-bold">🎞️ ฉากที่ยังจำได้</div>
            {epi.highlights.map((t, i) => (
              <p key={i} className="text-[11px] text-neutral-400 leading-relaxed">• {t}</p>
            ))}
          </div>
        )}

        <p className="w-full max-w-xs text-xs italic text-neutral-400 leading-relaxed px-1">
          {epi.after}
        </p>

        <div className="bg-black/30 rounded-xl p-4 w-full max-w-xs text-sm space-y-2 border border-white/10">
          <div className="flex justify-between"><span className="text-neutral-400">วันที่ไปถึง:</span> <span>Day {time.day} / {debt.deadlineDay}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">เงินคงเหลือ:</span> <span>${stats.money} / ${debt.goal}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">งานที่ทำสำเร็จ:</span> <span>{gigs}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">สติ / Heat:</span> <span>{stats.sanity} / {stats.heat}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">อารมณ์เจ้าหนี้:</span> <span>{debt.creditorMood}</span></div>
        </div>

        <Button variant="primary" onClick={() => window.location.reload()} className="max-w-xs">
          เริ่มเกมใหม่
        </Button>
      </div>
    </div>
  );
}