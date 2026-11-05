import type { Gig } from '../app/types';

export const GIGS: Gig[] = [
  {
    id: 'gig-01',
    title: 'ส่งพัสดุ "ไม่ต้องถาม"',
    description: 'ลูกค้าฝากกล่องปิดผนึก ส่งข้ามเมือง ห้ามเขย่า',
    tier: 1, durationBlocks: 1,
    rewardMoney: 400, rewardRep: 0,
    heatGain: 10, sanityCost: 5, policeRisk: 0.10,
    background: 'alley', // ← ใหม่
  },
  {
    id: 'gig-02',
    title: 'ถ่ายรูปงานแต่ง (ไม่เชิญ)',
    description: 'เจ้านายอยากได้ภาพ "บรรยากาศ" ของงานที่ไม่ให้เข้า',
    tier: 2, durationBlocks: 2,
    rewardMoney: 900, rewardRep: 1,
    heatGain: 20, sanityCost: 15, policeRisk: 0.20,
    background: 'market', // ← ใหม่
  },
  {
    id: 'gig-03',
    title: 'เป็นตัวประกอบ MV ตำรวจ',
    description: 'ถ่ายทำ 3 ชั่วโมง ไม่มีค่าตัว แต่มียืมเงิน',
    tier: 2, durationBlocks: 2,
    rewardMoney: 700, rewardRep: 1,
    heatGain: 5, sanityCost: 10, policeRisk: 0.05,
    background: 'market', // ← ใหม่
  },
  {
    id: 'gig-04',
    title: 'ขนของ "ห้ามเปิด"',
    description: 'กล่องมีเสียง...แต่ลูกค้าจ่ายดี',
    tier: 3, durationBlocks: 2,
    rewardMoney: 1800, rewardRep: 2,
    heatGain: 35, sanityCost: 25, policeRisk: 0.35,
    background: 'warehouse', // ← ใหม่
  },
  {
    id: 'gig-05',
    title: 'ปลอมตัวเป็นหมอ 1 วัน',
    description: 'ลูกค้าอยากได้ใบรับรองสุขภาพปลอม (ไม่ต้องรักษาใคร)',
    tier: 4, durationBlocks: 2,
    rewardMoney: 3500, rewardRep: 3,
    heatGain: 50, sanityCost: 40, policeRisk: 0.50,
    background: 'rooftop', // ← ใหม่
  },
  // --- เพิ่มใหม่ ---
  {
    id: 'gig-06',
    title: 'ล้วงกระเป๋าในตลาดนัด',
    description: 'เป้าหมายคือนักท่องเที่ยวต่างชาติที่เดินชมตลาดเพลินๆ',
    tier: 1, durationBlocks: 1,
    rewardMoney: 500, rewardRep: 1,
    heatGain: 25, sanityCost: 15, policeRisk: 0.20,
    background: 'market', // ← ใหม่
  },
  {
    id: 'gig-07',
    title: 'เป็นหน้าม้าในบ่อนเถื่อน',
    description: 'แค่ยืนถือไพ่และทำหน้าตาเฉยๆ ไม่ให้ใครจับได้',
    tier: 3, durationBlocks: 2,
    rewardMoney: 2000, rewardRep: 2,
    heatGain: 40, sanityCost: 30, policeRisk: 0.40,
    background: 'warehouse', // ← ใหม่
  },
  {
    id: 'gig-08',
    title: 'ขับรถพาหนี (Getaway Driver)',
    description: 'รอรับคนที่วิ่งออกมาจากตึก แล้วเหยียบมิดไมล์ทันที',
    tier: 4, durationBlocks: 2,
    rewardMoney: 4000, rewardRep: 4,
    heatGain: 60, sanityCost: 45, policeRisk: 0.60,
    background: 'rooftop', // ← ใหม่
  },
  {
    id: 'gig-09',
    title: 'ส่งสารขู่เจ้าหนี้',
    description: 'แค่เอากล่องปริศนาไปวางหน้าบ้าน ไม่ต้องพูดอะไร',
    tier: 2, durationBlocks: 1,
    rewardMoney: 800, rewardRep: 1,
    heatGain: 15, sanityCost: 20, policeRisk: 0.15,
    background: 'alley', // ← ใหม่
  },
  {
    id: 'gig-10',
    title: 'ลักลอบขน SIM Card',
    description: 'ซ่อนซิมการ์ดในรองเท้า แล้วเดินผ่านด่านตรวจ',
    tier: 5, durationBlocks: 2,
    rewardMoney: 5500, rewardRep: 5,
    heatGain: 75, sanityCost: 50, policeRisk: 0.70,
    background: 'dock', // ← ใหม่
  },
];