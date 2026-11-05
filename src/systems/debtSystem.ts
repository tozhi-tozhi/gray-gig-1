import { CLAMP, EXTENSION_COST, EXTENSION_MOOD_PENALTY } from '../app/constants';
import { patch, pushLog, useGame } from '../app/store';
import type { DebtEffect } from '../app/types';
import { goTo } from './fsm';
import { CREDITOR_EVENTS, type CreditorEvent } from '../data/creditorEvents';

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.max(lo, Math.min(hi, v));

// ปรับอารมณ์เจ้าหนี้และเส้นตายตามตัวเลือกที่ผู้เล่นเลือก
export function applyDebtEffect(effect: DebtEffect): void {
  const d = useGame.getState().debt;
  const newMood = clamp(d.creditorMood + (effect.mood || 0), CLAMP.mood);
  const newDeadline = Math.max(1, d.deadlineDay + (effect.deadline || 0));

  patch({ debt: { ...d, creditorMood: newMood, deadlineDay: newDeadline } });

  // ถ้าเส้นตายถูกลด ให้บันทึกเตือน
  if (effect.deadline && effect.deadline < 0) {
    pushLog(`⚠️ เส้นตายถูกลดลง ${Math.abs(effect.deadline)} วัน!`);
  }
}

// ผู้เล่นกดปุ่ม "ขอขยายหนี้" (B2)
// คืนค่า true ถ้าสำเร็จ, false ถ้าล้มเหลว
export function requestExtension(): boolean {
  const s = useGame.getState();
  const d = s.debt;
  const stats = s.stats;

  // ตรวจเงื่อนไขเบื้องต้น
  if (d.extensionsLeft <= 0) return false;
  if (stats.money < EXTENSION_COST) return false;

  // โอกาสสำเร็จขึ้นอยู่กับอารมณ์เจ้าหนี้
  let successChance = 0.3;
  if (d.creditorMood >= 70) successChance = 0.9;
  else if (d.creditorMood >= 40) successChance = 0.6;

  const success = Math.random() < successChance;

  // จ่ายเงินและใช้สิทธิ์ขยายทุกครั้ง ไม่ว่าจะสำเร็จหรือไม่
  const newMoney = stats.money - EXTENSION_COST;
  const newExtensions = d.extensionsLeft - 1;

  if (success) {
    const newDeadline = d.deadlineDay + 1;
    patch({
      stats: { ...stats, money: newMoney },
      debt: {
        ...d,
        extensionsLeft: newExtensions,
        deadlineDay: newDeadline,
        creditorMood: clamp(d.creditorMood - EXTENSION_MOOD_PENALTY, CLAMP.mood),
      },
      lastResult: {
        title: '✅ ขอขยายหนี้สำเร็จ',
        lines: [
          'พี่โจยอมยืดเวลาให้อีก 1 วัน',
          `💰 -$${EXTENSION_COST}`,
          `เส้นตายใหม่: วัน ${newDeadline}`,
        ],
      },
    });
    pushLog(`ขอขยายหนี้สำเร็จ → เส้นตายวัน ${newDeadline}`);
    return true;
  }

  patch({
    stats: { ...stats, money: newMoney },
    debt: {
      ...d,
      extensionsLeft: newExtensions,
      creditorMood: clamp(d.creditorMood - 10, CLAMP.mood),
    },
    lastResult: {
      title: '❌ ขอขยายหนี้ไม่สำเร็จ',
      lines: [
        'พี่โจปฏิเสธเสียงแข็ง "ไม่ได้! จ่ายตรงเวลา!"',
        `💰 -$${EXTENSION_COST} (เสียฟรี)`,
      ],
    },
  });
  pushLog('ขอขยายหนี้ล้มเหลว');
  return false;
}

// เร่งหนี้ (ลดเส้นตาย) เมื่อผู้เล่นทำพลาด (B3)
export function accelerateDebt(days: number, reason: string): void {
  const d = useGame.getState().debt;
  const newDeadline = Math.max(1, d.deadlineDay - days);

  patch({
    debt: {
      ...d,
      deadlineDay: newDeadline,
      creditorMood: clamp(d.creditorMood - 10, CLAMP.mood),
    },
  });
  pushLog(`⚠️ ${reason} → เส้นตายเหลือวัน ${newDeadline}`);
}

// เช็คว่าวันนี้เจ้าหนี้ควรโทรมาทวงไหม (B1)
export function shouldCreditorCallToday(): boolean {
  const s = useGame.getState();
  const d = s.debt;
  const day = s.time.day;

  // ถ้าทวงไปแล้ววันนี้ ไม่ต้องทวงซ้ำ
  if (d.lastCollectionDay >= day) return false;

  // ทวงทุก 3 วัน (วัน 3, 6, 9, 12)
  if (day % 3 === 0) return true;

  // ถ้าพี่โจโกรธจัด (อารมณ์ต่ำกว่า 30) จะทวงบ่อยขึ้น
  if (d.creditorMood < 30 && day % 2 === 0) return true;

  return false;
}

// เริ่มเหตุการณ์ทวงหนี้: เลือกเหตุการณ์ตามอารมณ์เจ้าหนี้ แล้วเด้งไปหน้า event
export function triggerCreditorCall(): void {
  const s = useGame.getState();
  const d = s.debt;

  // ถ้าอารมณ์ไม่ดี ใช้เหตุการณ์รุนแรง (ลูกน้องมาหา)
  let event: CreditorEvent;
  if (d.creditorMood < 40) {
    event = CREDITOR_EVENTS.find(e => e.id === 'creditor-call-angry') || CREDITOR_EVENTS[0];
  } else {
    event = CREDITOR_EVENTS.find(e => e.id === 'creditor-call-normal') || CREDITOR_EVENTS[0];
  }

  patch({
    activeEvent: event,
    debt: { ...d, lastCollectionDay: s.time.day },
  });
  goTo('event');
}