import { TIME_BLOCKS, DAILY_COST, CLAMP } from '../app/constants';
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

  // ชนะ: หาเงินครบเป้า → จ่ายหนี้ทันที (ตรวจก่อนหักค่าใช้จ่ายประจำวัน)
  if (s.stats.money >= s.debt.goal) {
    goTo('gameWin');
    return;
  }

  // หักค่าใช้จ่ายประจำวัน และลดความร้อนลงเล็กน้อย
  const nextStats = {
    ...s.stats,
    money: s.stats.money - DAILY_COST,
    heat: clamp(s.stats.heat - 5, CLAMP.heat),
  };
  patch({ stats: nextStats });
  pushLog(`Day ${s.time.day} จบ — ค่าใช้จ่าย $${DAILY_COST}`);

  // แพ้: เงินหมดตัว
  if (nextStats.money < 0) { goTo('gameOver'); return; }
  // แพ้: สติแตก
  if (nextStats.sanity <= CLAMP.sanity[0]) { goTo('gameOver'); return; }
  // แพ้: เลยเส้นตาย แต่ยังจ่ายหนี้ไม่ครบ
  if (s.time.day >= s.debt.deadlineDay) { goTo('gameOver'); return; }

  patch({ time: { day: s.time.day + 1, block: 'morning' }, lastResult: null });
  goTo('endOfDay');
}