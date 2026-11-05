import { useGame, patch } from '../app/store';
import { GIGS } from '../data/gigs';
import { StatusBar } from '../ui/StatusBar';
import { Button } from '../ui/Button';
import { goTo } from '../systems/fsm';

export function GigResultScreen() {
  const activeGigId = useGame(s => s.activeGigId);
  const lastResult = useGame(s => s.lastResult);
  const stats = useGame(s => s.stats);
  const pendingEvent = useGame(s => s.pendingEvent);
  
  const gig = GIGS.find(g => g.id === activeGigId);
  
  if (!gig || !lastResult) {
    return (
      <>
        <StatusBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-neutral-400">ไม่พบข้อมูลงาน</p>
        </div>
      </>
    );
  }

  // แยกข้อมูลจาก lastResult.lines
  const moneyLine = lastResult.lines.find(l => l.includes('💰'));
  const repLine = lastResult.lines.find(l => l.includes('⭐'));
  const heatLine = lastResult.lines.find(l => l.includes('🔥'));
  const sanityLine = lastResult.lines.find(l => l.includes('🧠'));
  const qteLine = lastResult.lines.find(l => l.includes('🎯 QTE'));
  
  // ข้อความบรรยาย (Narrative) คือบรรทัดที่ไม่มีไอคอนสถานะ
  const narrativeText = lastResult.lines.find(l => 
    !l.startsWith('💰') && 
    !l.startsWith('⭐') && 
    !l.startsWith('🔥') && 
    !l.startsWith('🧠') && 
    !l.includes('🎯 QTE')
  );

  const handleContinue = () => {
    // ล้าง ID งานเมื่ออ่านสรุปเสร็จแล้ว
    patch({ activeGigId: null }); 

    if (pendingEvent) {
      patch({ activeEvent: pendingEvent, pendingEvent: null });
      goTo('event');
    } else {
      goTo('home');
    }
  };

  return (
    <>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5 bg-neutral-900/95 screen-motion overflow-y-auto">
        {/* หัวข้อ */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 font-bold">
            Contract Complete
          </div>
          <h2 className="text-xl font-bold mt-2">{gig.title}</h2>
        </div>

        {/* การ์ดผลลัพธ์ */}
        <div className="w-full max-w-xs bg-neutral-800/60 border border-white/10 rounded-xl p-5 space-y-4 shadow-lg">
          
          {/* ข้อความบรรยายหลัก (Narrative) */}
          {narrativeText && (
            <div className="bg-black/40 rounded-lg p-3 text-sm text-neutral-200 leading-relaxed border-l-2 border-emerald-500 italic">
              "{narrativeText}"
            </div>
          )}

          {/* ผลลัพธ์ตัวเลข */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {moneyLine && (
              <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{moneyLine.replace('💰 ', '')}</div>
                <div className="text-[10px] text-neutral-500 mt-1">เงินที่ได้</div>
              </div>
            )}
            {repLine && (
              <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{repLine.replace('⭐ ', '')}</div>
                <div className="text-[10px] text-neutral-500 mt-1">ชื่อเสียง</div>
              </div>
            )}
          </div>

          {/* ผลกระทบรอง */}
          <div className="flex justify-between text-sm pt-2 border-t border-white/5">
            {heatLine && (
              <div className="flex items-center gap-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-neutral-300">{heatLine.replace('🔥 ', '')}</span>
              </div>
            )}
            {sanityLine && (
              <div className="flex items-center gap-1">
                <span className="text-blue-400">🧠</span>
                <span className="text-neutral-300">{sanityLine.replace('🧠 ', '')}</span>
              </div>
            )}
          </div>

          {/* QTE Score */}
          {qteLine && (
            <div className="text-center pt-2 border-t border-white/5">
              <div className="text-xs text-neutral-400">ประสิทธิภาพการทำงาน</div>
              <div className="text-lg font-bold text-emerald-300 mt-1">{qteLine}</div>
            </div>
          )}
        </div>

        {/* สถานะปัจจุบัน */}
        <div className="w-full max-w-xs text-xs text-neutral-400 space-y-1">
          <div className="flex justify-between">
            <span>💰 เงินคงเหลือ:</span>
            <span className="font-semibold text-white">${stats.money}</span>
          </div>
          <div className="flex justify-between">
            <span>🔥 Heat:</span>
            <span className="font-semibold text-white">{stats.heat}/100</span>
          </div>
          <div className="flex justify-between">
            <span>🧠 Sanity:</span>
            <span className="font-semibold text-white">{stats.sanity}/100</span>
          </div>
        </div>

        {/* ปุ่มกลับ */}
        <Button variant="primary" onClick={handleContinue} className="max-w-xs">
          {pendingEvent ? 'ดำเนินการต่อ' : 'กลับบ้าน'}
        </Button>
      </div>
    </>
  );
}