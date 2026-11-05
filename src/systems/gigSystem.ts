import { CLAMP } from '../app/constants';
import { patch, pushLog, useGame } from '../app/store';
import type { Gig } from '../app/types';
import { goTo } from './fsm';
import { consumeBlocks } from './timeSystem';
import { rollRandomEvent, rollGigOutcome } from './eventSystem';
import { accelerateDebt } from './debtSystem';
import { beep, shake, flash } from './feedback';
import { bump, recordHistory } from './storySystem';

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.max(lo, Math.min(hi, v));

export function acceptGig(gig: Gig): void {
  patch({ activeGigId: gig.id });
  goTo('gigCutscene');
}

export function resolveGig(gig: Gig, qteScore = 50): void {
  const s = useGame.getState();

  // 1) สุ่มผลลัพธ์ของงาน (คะแนน QTE ปรับน้ำหนัก)
  const outcome = rollGigOutcome(gig, qteScore);
  const rewardMoney = Math.round(gig.rewardMoney * outcome.moneyMultiplier);
  const heatGain = gig.heatGain + outcome.extraHeat;
  const sanityChange = -gig.sanityCost + outcome.extraSanity;
  const sanitySign = sanityChange >= 0 ? `+${sanityChange}` : `${sanityChange}`;

  const lines = [
    `💰 +$${rewardMoney}`,
    `⭐ +${gig.rewardRep}`,
    `🔥 +${heatGain}`,
    `🧠 ${sanitySign}`,
  ];
  if (outcome.text) lines.push(outcome.text);
  lines.push(`🎯 QTE: ${qteScore}/100`);

  const stats = {
    money: s.stats.money + rewardMoney,
    heat: clamp(s.stats.heat + heatGain, CLAMP.heat),
    rep: clamp(s.stats.rep + gig.rewardRep, CLAMP.rep),
    sanity: clamp(s.stats.sanity + sanityChange, CLAMP.sanity),
  };

  patch({
    stats,
    activeGigId: null,
    // ทำงานนี้แล้ว งานหายจากรายการของวันนี้
    dailyGigIds: s.dailyGigIds.filter(id => id !== gig.id),
    lastResult: { title: `เสร็จ: ${gig.title}`, lines },
  });
  pushLog(`Gig "${gig.title}" เสร็จ (+$${rewardMoney})`);
    // จดสถิติและประวัติ (ใช้ในบทส่งท้าย)
  bump('gigsDone');
  bump('earned', rewardMoney);
  if (gig.tier >= 4) bump('highTierGigs');
  if (outcome.id === 'police') bump('policeBusts');
  if (outcome.id === 'disaster') bump('disasters');
  recordHistory({
    kind: 'gig',
    title: gig.title,
    detail: outcome.text ?? 'งานผ่านไปด้วยดี ไม่มีอะไรผิดพลาด',
    tag: outcome.id,
  });

  // เสียงและเอฟเฟกต์ตามผลลัพธ์
  if (outcome.id === 'bonus') { beep('good'); flash('#10b981'); }
  else if (outcome.id === 'underpaid') { beep('bad'); }
  else if (outcome.id === 'police') { beep('warn'); shake(); flash('#ef4444'); }
  else if (outcome.id === 'disaster') { beep('bad'); shake(); flash('#ef4444'); }

  // แพ้ทันที: Heat เต็ม (ถูกจับ) หรือ สติหมด (เช็กก่อนผ่านเวลา)
  if (stats.heat >= CLAMP.heat[1] || stats.sanity <= CLAMP.sanity[0]) {
    goTo('gameOver');
    return;
  }

  // 2) ถ้างานพัง → เจ้าหนี้เสียความเชื่อมั่น → เร่งหนี้ (B3)
  if (outcome.id === 'disaster') {
    accelerateDebt(1, 'งานพัง เจ้าหนี้เสียความเชื่อมั่น');
  }

  consumeBlocks(gig.durationBlocks);

  // ถ้าระบบเวลาเปลี่ยนหน้าจอไปแล้ว (เช่น จบวัน / แพ้) ให้หยุดตรงนี้
  const currentScreen = useGame.getState().screen;
  if (currentScreen !== 'activeGig') return;

  const final = useGame.getState();
  if (final.stats.sanity <= 0 || final.stats.money < 0) {
    goTo('gameOver');
    return;
  }

  // ถ้าผลลัพธ์ไม่ปกติ ให้เห็นผลลัพธ์ก่อน ไม่สุ่มเหตุการณ์ซ้ำ
  if (outcome.id !== 'normal') {
    goTo('home');
    return;
  }

  // ถ้าผลลัพธ์ปกติ อาจเจอเหตุการณ์แทรกซ้อน
  const ev = rollRandomEvent();
  if (ev) {
    patch({ activeEvent: ev });
    goTo('event');
    return;
  }

  goTo('home');
}