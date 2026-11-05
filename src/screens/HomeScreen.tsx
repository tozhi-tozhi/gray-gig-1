import { useEffect, useRef } from 'react';
import { useGame } from '../app/store';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { doNormalLife } from '../systems/lifeSystem';
import { goTo } from '../systems/fsm';
import { DAILY_COST, EXTENSION_COST } from '../app/constants';
import { requestExtension, shouldCreditorCallToday, triggerCreditorCall } from '../systems/debtSystem';

export function HomeScreen() {
  const lastResult = useGame(s => s.lastResult);
  const { time, stats, debt } = useGame(s => ({ time: s.time, stats: s.stats, debt: s.debt }));

  const remainingBlocks = 3 - ['morning', 'afternoon', 'night'].indexOf(time.block);
  const daysLeft = debt.deadlineDay - time.day;
  const moneyNeeded = debt.goal - stats.money;
  const dailyTarget = Math.ceil(Math.max(0, moneyNeeded) / Math.max(1, daysLeft));

  // คำอธิบายอารมณ์เจ้าหนี้แบบสั้นๆ
  const moodLabel =
    debt.creditorMood >= 70 ? '😌 ใจดี' :
    debt.creditorMood >= 40 ? '😐 กลางๆ' :
    debt.creditorMood >= 20 ? '😠 ไม่พอใจ' : '🤬 โกรธจัด';

  // กันการเช็คซ้ำใน mount เดียว (รองรับ StrictMode)
  const checkedRef = useRef(false);

  // เมื่อเข้าหน้านี้ เช็คว่าพี่โจจะโทรมาทวงหนี้ไหม
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    if (shouldCreditorCallToday()) {
      triggerCreditorCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* แจ้งเตือนอันตราย */}
        {(stats.sanity <= 20 || stats.heat >= 80 || stats.money < DAILY_COST) && (
          <div className="rounded-xl bg-red-950/60 border border-red-500/50 p-3 text-red-200 animate-pulse">
            <div className="font-bold text-xs flex items-center gap-1">⚠️ คำเตือนอันตราย</div>
            <ul className="text-[11px] mt-1 space-y-0.5 opacity-90">
              {stats.sanity <= 20 && <li>- สติคุณใกล้แตก (เหลือ {stats.sanity}) ถ้าถึง 0 คุณจะแพ้ทันที</li>}
              {stats.heat >= 80 && <li>- ตำรวจกำลังจับตาคุณอย่างหนัก (Heat {stats.heat}/100) ถ้าถึง 100 คุณจะถูกจับและแพ้ทันที</li>}
              {stats.money < DAILY_COST && <li>- เงินคุณไม่พอจ่ายค่ากินอยู่พรุ่งนี้ (${DAILY_COST})!</li>}
            </ul>
          </div>
        )}

        {/* ผลลัพธ์จาก action ล่าสุด */}
        {lastResult && (
          <div className="rounded-xl bg-emerald-900/30 border border-emerald-700/40 p-3">
            <div className="font-semibold text-sm text-emerald-300">{lastResult.title}</div>
            <ul className="mt-1 text-xs text-emerald-100/80 space-y-0.5">
              {lastResult.lines.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        )}

        {/* การ์ดหนี้และเส้นตาย */}
        <div className="rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 p-4 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-red-400 font-bold mb-1">Deadline</div>
              <div className="text-xl font-bold text-white">เป้าหมาย: จ่ายหนี้ ${debt.goal}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${daysLeft <= 2 ? 'text-red-400' : 'text-emerald-400'}`}>{daysLeft}</div>
              <div className="text-[10px] text-neutral-400">วันที่เหลือ</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-neutral-950 rounded-full h-2.5">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (stats.money / debt.goal) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5">
            <span>เก็บได้แล้ว ${stats.money}</span>
            <span>ต้องหาเพิ่มวันละ ~${dailyTarget}</span>
          </div>
        </div>

        {/* การ์ดเจ้าหนี้ + ปุ่มขอขยายหนี้ */}
        <div className="rounded-xl bg-neutral-800/50 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">เจ้าหนี้</div>
              <div className="text-sm font-bold text-white">🕴️ พี่โจ</div>
            </div>
            <div className="text-right text-[11px]">
              <div className="text-neutral-300">อารมณ์: {moodLabel}</div>
              <div className="text-neutral-500">ขยายหนี้ได้อีก {debt.extensionsLeft} ครั้ง</div>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => requestExtension()}
            disabled={debt.extensionsLeft <= 0 || stats.money < EXTENSION_COST}
          >
            📞 ขอขยายหนี้ (-${EXTENSION_COST} / เส้นตาย +1 วัน)
          </Button>
        </div>

        {/* ปุ่มแอคชัน */}
        <div className="space-y-2 mt-4">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">เหลือเวลาวันนี้ {remainingBlocks} ช่วง</div>
          <Button variant="secondary" onClick={() => doNormalLife('work')}>
            💼 ไปทำงานประจำ (+$200, -5🧠)
          </Button>
          <Button variant="secondary" onClick={() => doNormalLife('rest')}>
            🛏️ นอนพักผ่อน (+20🧠, -10🔥)
          </Button>
          <Button variant="primary" onClick={() => goTo('gigBoard')} className="mt-2">
            🕶️ เปิดแอปงานเทา (หาเงินก้อนโต)
          </Button>
        </div>
      </div>
    </>
  );
}