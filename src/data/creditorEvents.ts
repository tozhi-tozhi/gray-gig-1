import type { Stats, DebtEffect } from '../app/types';

// ตัวเลือกของเหตุการณ์เจ้าหนี้ (เพิ่ม debtEffect ต่อจากเหตุการณ์ปกติ)
export interface CreditorChoice {
  label: string;
  effect: Partial<Stats>;
  resultText: string;
  debtEffect?: DebtEffect;
}

export interface CreditorEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  choices: CreditorChoice[];
}

// เหตุการณ์ทวงหนี้จาก "พี่โจ" เจ้าหนี้รายใหญ่
// ตัวเลือกแต่ละตัวส่งผลต่ออารมณ์เจ้าหนี้ (mood) และอาจเปลี่ยนเส้นตาย (deadline)
export const CREDITOR_EVENTS: CreditorEvent[] = [
  {
    id: 'creditor-call-normal',
    title: 'พี่โจโทรมาทวงหนี้',
    description: 'โทรศัพท์ดังขึ้น ชื่อ "พี่โจ" ปรากฏบนหน้าจอ น้ำเสียงของเขาไม่ค่อยสบอารมณ์นัก',
    icon: '📱',
    choices: [
      {
        label: 'จ่ายดอกเบี้ยไปก่อน (💰 -150)',
        effect: { money: -150 },
        resultText: 'พี่โจรับเงินแล้วพูดว่า "ก็ดี ยังรู้ตัวอยู่" อารมณ์เขาดีขึ้นนิดหน่อย',
        debtEffect: { mood: 15 },
      },
      {
        label: 'อ้อนวอนขอเวลา (🧠 -15)',
        effect: { sanity: -15 },
        resultText: 'คุณอ้อนวอน พี่โจถอนหายใจ "ก็ได้... แต่อย่าให้นาน" คุณเครียดจนแทบไม่ได้นอน',
        debtEffect: { mood: 5 },
      },
      {
        label: 'ปิดเครื่องหนี (🔥 +15)',
        effect: { heat: 15 },
        resultText: 'คุณปิดเครื่อง แต่รู้ว่าพี่โจต้องโกรธจัด และจะเริ่มตามล่าคุณจริงจัง',
        debtEffect: { mood: -20 },
      },
    ],
  },
  {
    id: 'creditor-call-angry',
    title: 'พี่โจส่งลูกน้องมา',
    description: 'ชายร่างใหญ่สองคนมาเคาะประตูห้อง "พี่โจให้มาเตือน... จ่ายเงินซะ อย่าให้ต้องใช้กำลัง"',
    icon: '🚪',
    choices: [
      {
        label: 'จ่ายก้อนใหญ่ตัดปัญหา (💰 -400)',
        effect: { money: -400 },
        resultText: 'คุณยอมจ่ายเงินก้อน ลูกน้องพี่โจพยักหน้าแล้วจากไป อารมณ์พี่โจดีขึ้นมาก',
        debtEffect: { mood: 25 },
      },
      {
        label: 'เจรจาขอผ่อนผัน (🧠 -20)',
        effect: { sanity: -20 },
        resultText: 'คุณเจรจาอย่างยากลำบาก สุดท้ายพวกเขาพอจะอะลุ่มอล่วยให้บ้าง แต่คุณเครียดจัด',
        debtEffect: { mood: 10, deadline: 1 },
      },
      {
        label: 'ไล่พวกเขากลับ (🔥 +20)',
        effect: { heat: 20 },
        resultText: 'คุณไล่พวกเขากลับ พวกเขาจ้องคุณด้วยสายตาอาฆาตก่อนจากไป พี่โจต้องโกรธจัดแน่',
        debtEffect: { mood: -25, deadline: -1 },
      },
    ],
  },
];