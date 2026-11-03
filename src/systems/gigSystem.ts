import { CLAMP } from '../app/constants';
import { patch, pushLog, useGame } from '../app/store';
import type { Gig } from '../app/types';
import { goTo } from './fsm';
import { consumeBlocks } from './timeSystem';
import { rollPolice } from './eventSystem';

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.max(lo, Math.min(hi, v));

export function acceptGig(gig: Gig): void {
  patch({ activeGigId: gig.id });
  goTo('activeGig');
}

export function resolveGig(gig: Gig): void {
  const s = useGame.getState();
  const lines = [
    `💰 +$${gig.rewardMoney}`,
    `⭐ +${gig.rewardRep}`,
    `🔥 +${gig.heatGain}`,
    `🧠 -${gig.sanityCost}`,
  ];

  let heat = clamp(s.stats.heat + gig.heatGain, CLAMP.heat);
  if (rollPolice(gig.policeRisk)) {
    heat = clamp(heat + 15, CLAMP.heat);
    lines.push('🚨 ตำรวจโผล่กลางงาน! 🔥 +15');
  }

  const stats = {
    money: s.stats.money + gig.rewardMoney,
    heat,
    rep: clamp(s.stats.rep + gig.rewardRep, CLAMP.rep),
    sanity: clamp(s.stats.sanity - gig.sanityCost, CLAMP.sanity),
  };

  patch({
    stats,
    activeGigId: null,
    lastResult: { title: `เสร็จ: ${gig.title}`, lines },
  });
  pushLog(`Gig "${gig.title}" เสร็จ (+$${gig.rewardMoney})`);

  consumeBlocks(gig.durationBlocks);

  // ถ้า system เปลี่ยน screen ไปแล้ว (endOfDay/gameOver/gameWin) → เคารพ
  if (useGame.getState().screen !== 'activeGig') return;

  const final = useGame.getState();
  if (final.stats.sanity <= 0 || final.stats.money < 0) {
    goTo('gameOver');
    return;
  }
  goTo('home');
}