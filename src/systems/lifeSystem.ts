import { NORMAL_LIFE, CLAMP } from '../app/constants';
import { patch, pushLog, useGame } from '../app/store';
import { goTo } from './fsm';
import { consumeBlocks } from './timeSystem';
import { rollRandomEvent } from './eventSystem';

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.max(lo, Math.min(hi, v));

export function doNormalLife(action: keyof typeof NORMAL_LIFE): void {
  const s = useGame.getState();
  const cfg = NORMAL_LIFE[action];

  const stats = {
    ...s.stats,
    money: s.stats.money + cfg.money,
    heat: clamp(s.stats.heat + cfg.heat, CLAMP.heat),
    sanity: clamp(s.stats.sanity + cfg.sanity, CLAMP.sanity),
  };

  const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
  patch({
    stats,
    lastResult: {
      title: cfg.label,
      lines: [`💰 ${sign(cfg.money)}`, `🔥 ${sign(cfg.heat)}`, `🧠 ${sign(cfg.sanity)}`],
    },
  });
  pushLog(`${cfg.label} — $${cfg.money}, 🔥${cfg.heat}, 🧠${cfg.sanity}`);

  consumeBlocks(1);

  // ถ้า action ทำให้ sanity แตะ 0 หลัง consumeBlocks แต่ยังอยู่ home
  const final = useGame.getState();
  if (final.screen === 'home' && (final.stats.sanity <= 0 || final.stats.money < 0)) {
    goTo('gameOver');
    return;
  }
  // เช็คสุ่ม Event (ถ้าจบวันแล้วจะไม่ทำงาน)
  if (final.screen === 'home') {
    const ev = rollRandomEvent();
    if (ev) {
      patch({ activeEvent: ev });
      goTo('event'); // เด้งไปหน้า Event
    }
  }
}