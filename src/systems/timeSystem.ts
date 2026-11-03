import { TIME_BLOCKS, DAILY_COST, TOTAL_DAYS, CLAMP } from '../app/constants';
import { patch, pushLog, useGame } from '../app/store';
import { goTo } from './fsm';

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.max(lo, Math.min(hi, v));

export function remainingBlocksInDay(): number {
  const { time } = useGame.getState();
  return TIME_BLOCKS.length - TIME_BLOCKS.indexOf(time.block);
}

export function consumeBlocks(n: 1 | 2): void {
  for (let i = 0; i < n; i++) {
    const { time } = useGame.getState();
    const idx = TIME_BLOCKS.indexOf(time.block);
    if (idx < TIME_BLOCKS.length - 1) {
      patch({ time: { ...time, block: TIME_BLOCKS[idx + 1] } });
    } else {
      runEndOfDay();
      return;
    }
  }
}

export function runEndOfDay(): void {
  const s = useGame.getState();
  const nextStats = {
    ...s.stats,
    money: s.stats.money - DAILY_COST,
    heat: clamp(s.stats.heat - 5, CLAMP.heat),
  };
  patch({ stats: nextStats });
  pushLog(`Day ${s.time.day} จบ — ค่าใช้จ่าย $${DAILY_COST}`);

  if (nextStats.money < 0)              { goTo('gameOver'); return; }
  if (nextStats.sanity <= CLAMP.sanity[0]) { goTo('gameOver'); return; }
  if (s.time.day >= TOTAL_DAYS)         { goTo('gameWin');  return; }

  patch({ time: { day: s.time.day + 1, block: 'morning' }, lastResult: null });
  goTo('endOfDay');
}