// src/screens/HomeScreen.tsx
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
  const progressPct = Math.min(100, (stats.money / debt.goal) * 100);
  
  const creditorIcon = 
    debt.creditorMood >= 70 ? '😌' :
    debt.creditorMood >= 40 ? '😐' :
    debt.creditorMood >= 20 ? '😠' : '🤬';

  const checkedRef = useRef(false);
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    if (shouldCreditorCallToday()) {
      triggerCreditorCall();
    }
  }, []);

  return (
    <>
      <StatusBar />
      <div className="flex-1 overflow-y-auto p-4 space-y-5 relative">
        
        {/* --- 1. VISUAL AREA: ห้องเช่า + ตัวละครเดินไปมา --- */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl group">
          
          {/* ฉากหลังห้องเช่า (JPG) - ซูมเข้าเล็กน้อย */}
          <img 
            src="/assets/backgrounds/room_night.jpg" 
            alt="ห้องเช่า"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* ตัวละครผู้เล่น (w-40) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 player-walk z-10">
            <div className="player-bob drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              <img 
                src="/assets/characters/player.png" 
                alt="ผู้เล่น"
                className="w-40 h-auto" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-20 h-32 bg-emerald-900/50 rounded-full flex items-center justify-center text-3xl border border-emerald-500/30';
                    fallback.textContent = '🧍';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Overlay Gradient ด้านล่าง */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-20% pointer-events-none" />
          
          {/* Time Badge */}
          <div className="absolute top-3 left-3 flex gap-2 z-30">
             <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-white/5">
               DAY {time.day}
             </span>
             <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-neutral-400 border border-white/5">
               {['เช้า', 'บ่าย', 'ดึก'][['morning', 'afternoon', 'night'].indexOf(time.block)]}
             </span>
          </div>
        </div>

        {/* --- 2. STATUS GRID --- */}
        <div className="grid grid-cols-2 gap-3">
           {/* Debt Progress */}
           <div className="col-span-2 bg-neutral-900/50 border border-white/5 rounded-xl p-3 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-end mb-2 relative z-10">
                 <span className="text-xs text-neutral-500 font-bold tracking-wider">DEBT GOAL</span>
                 <span className={`text-lg font-mono font-bold ${daysLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                    ${stats.money.toLocaleString()} <span className="text-xs text-neutral-600">/ ${debt.goal}</span>
                 </span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden relative z-10">
                 <div className="h-full bg-emerald-600 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-neutral-600 relative z-10">
                 <span>เหลือ {daysLeft} วัน</span>
                 <span>เป้าหมายวันละ ~${Math.ceil((debt.goal - stats.money) / Math.max(1, daysLeft))}</span>
              </div>
           </div>

           {/* Creditor Mood */}
           <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:bg-neutral-800/50 transition-colors cursor-default">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>{creditorIcon}</span>
              <span className="text-[10px] text-neutral-500 font-bold">JOE'S MOOD</span>
           </div>

           {/* Player Stats */}
           <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:bg-neutral-800/50 transition-colors cursor-default">
              <div className="flex gap-3 text-lg">
                 <span title={`Heat: ${stats.heat}`} className={stats.heat > 80 ? 'text-red-500 animate-pulse' : 'text-orange-400'}>🔥</span>
                 <span title={`Sanity: ${stats.sanity}`} className={stats.sanity < 20 ? 'text-red-500 animate-pulse' : 'text-blue-400'}>🧠</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-bold mt-1">STATUS</span>
           </div>
        </div>

        {/* --- 3. ALERTS --- */}
        {(stats.sanity <= 20 || stats.heat >= 80 || stats.money < DAILY_COST) && (
          <div className="rounded-xl bg-red-950/40 border border-red-500/30 p-3 flex items-center gap-3 animate-pulse">
            <span className="text-xl">⚠️</span>
            <div className="text-xs text-red-200 space-y-0.5">
               {stats.sanity <= 20 && <div>สติใกล้แตก ({stats.sanity})</div>}
               {stats.heat >= 80 && <div>ตำรวจจับตา ({stats.heat})</div>}
               {stats.money < DAILY_COST && <div>เงินไม่พอใช้พรุ่งนี้</div>}
            </div>
          </div>
        )}

        {/* --- 4. ACTIONS --- */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold">Actions</span>
             <span className="text-[10px] text-neutral-500">{remainingBlocks} slots left</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <Button variant="secondary" onClick={() => doNormalLife('work')} className="!py-4 group hover:!bg-neutral-700 transition-all">
                <div className="flex flex-col items-center gap-1">
                   <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                   <span className="text-xs font-bold">Work</span>
                   <span className="text-[10px] text-neutral-400">+$200</span>
                </div>
             </Button>
             
             <Button variant="secondary" onClick={() => doNormalLife('rest')} className="!py-4 group hover:!bg-neutral-700 transition-all">
                <div className="flex flex-col items-center gap-1">
                   <span className="text-xl group-hover:scale-110 transition-transform">🛏️</span>
                   <span className="text-xs font-bold">Rest</span>
                   <span className="text-[10px] text-neutral-400">+20🧠</span>
                </div>
             </Button>
          </div>

          <Button variant="primary" onClick={() => goTo('gigBoard')} className="!py-5 !text-base shadow-lg shadow-emerald-900/20 group hover:shadow-emerald-500/20 transition-all">
             <div className="flex items-center justify-center gap-2">
                <span className="group-hover:animate-ping">🕶️</span>
                <span className="font-bold tracking-wide">OPEN GIG BOARD</span>
             </div>
          </Button>
          
          <button 
             onClick={() => requestExtension()}
             disabled={debt.extensionsLeft <= 0 || stats.money < EXTENSION_COST}
             className="w-full py-2 rounded-lg border border-dashed border-neutral-700 text-neutral-500 text-xs hover:bg-neutral-800 hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
             📞 ขอขยายหนี้ (-${EXTENSION_COST})
          </button>
        </div>

      </div>
    </>
  );
}