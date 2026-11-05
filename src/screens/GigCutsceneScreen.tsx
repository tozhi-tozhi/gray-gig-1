import { useEffect } from 'react';
import { useGame } from '../app/store';
import { GIGS } from '../data/gigs';
import { goTo } from '../systems/fsm';
import { beep } from '../systems/feedback';

// ภาพฉากหลังจริงตาม tier (วางไฟล์ใน public/assets/backgrounds/)
const TIER_BG: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '/assets/backgrounds/gig_alley.png',
  2: '/assets/backgrounds/gig_market.png',
  3: '/assets/backgrounds/gig_warehouse.png',
  4: '/assets/backgrounds/gig_rooftop.png',
  5: '/assets/backgrounds/gig_dock.png',
};

// fallback ถ้าภาพไม่โหลด (gradient + emoji + label ตามเดิม)
const TIER_FALLBACK: Record<1 | 2 | 3 | 4 | 5, { emoji: string; label: string; bg: string; tint: string }> = {
  1: { emoji: '🌃', label: 'ซอยมืดชานเมือง', bg: 'from-slate-900 via-slate-800 to-neutral-950', tint: 'text-slate-300' },
  2: { emoji: '🏮', label: 'ตลาดกลางคืน',     bg: 'from-amber-950 via-stone-900 to-neutral-950',  tint: 'text-amber-200' },
  3: { emoji: '📦', label: 'โกดังร้าง',       bg: 'from-neutral-900 via-stone-800 to-neutral-950', tint: 'text-stone-300' },
  4: { emoji: '🌆', label: 'หลังคาตึกสูง',     bg: 'from-purple-950 via-indigo-950 to-neutral-950', tint: 'text-purple-200' },
  5: { emoji: '⚓', label: 'ท่าเรือเถื่อน',     bg: 'from-blue-950 via-slate-900 to-neutral-950',    tint: 'text-cyan-200' },
};

const NARRATIVE: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'คุณเดินผ่านตรอกแคบ ๆ ที่ไม่ค่อยมีใครกล้าเข้ามา...',
  2: 'เสียงผู้คนและแสงไฟจากร้านค้าดังอยู่รอบตัว...',
  3: 'ประตูเหล็กเปิดออกพร้อมกลิ่นอับชื้นที่คุ้นเคย...',
  4: 'ลมแรงพัดผ่านหลังคาตึก มือของคุณเริ่มสั่น...',
  5: 'กลิ่นน้ำเค็มและน้ำมันเครื่องลอยมาในอากาศ...',
};

const AUTO_ADVANCE_MS = 3800;

export function GigCutsceneScreen() {
  const activeId = useGame(s => s.activeGigId);
  const gig = GIGS.find(g => g.id === activeId);

  useEffect(() => {
    if (!gig) return;
    beep('tick');
    const t = setTimeout(() => goTo('activeGig'), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [gig]);

  if (!gig) return null;

  const fb = TIER_FALLBACK[gig.tier];

  return (
    <div className={`relative flex-1 flex flex-col overflow-hidden bg-gradient-to-b ${fb.bg} cutscene-fade-in`}>
      {/* ฉากหลังจริง (ภาพ PNG จาก Leonardo/Qwen) */}
      <div
        className="absolute inset-0 bg-cover bg-center cutscene-bg-zoom"
        style={{ backgroundImage: `url('${TIER_BG[gig.tier]}')` }}
      />

      {/* ชั้นมืดทับ เพื่อให้ข้อความอ่านง่าย */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      {/* พื้นถนน (แถบล่าง) เลื่อนซ้ายตลอด */}
      <div className="absolute bottom-0 left-0 right-0 h-24 cutscene-road" />

      {/* เงาตัวละครเดิน */}
      <div className="cutscene-walker text-4xl">🚶</div>

      {/* ข้อความ narrative */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-40">
        <div className="cutscene-text">
          <div className={`text-[10px] uppercase tracking-[0.3em] ${fb.tint} opacity-70`}>
            {fb.label} · Tier {gig.tier}
          </div>
          <h2 className="text-xl font-bold mt-2">{gig.title}</h2>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            {NARRATIVE[gig.tier]}
          </p>
        </div>
      </div>

      {/* ปุ่มข้าม */}
      <button
        onClick={() => { beep('tick'); goTo('activeGig'); }}
        className="absolute bottom-4 right-4 z-20 px-4 py-2 rounded-lg bg-black/60 border border-white/20 text-xs text-neutral-200 hover:bg-black/80 active:scale-95 transition"
      >
        ข้าม ▸
      </button>
    </div>
  );
}