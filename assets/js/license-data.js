/**
 * license-data.js — ข้อมูล 7 ประเภทใบขับขี่ California DMV
 * ใช้ใน index.html (card grid) และ license.html (hub page)
 */
const LICENSE_TYPES = [
  {
    id: 'c',
    code: 'Class C',
    icon: '🚗',
    color: '#1d4ed8',
    name: 'Class C — รถยนต์นั่งส่วนบุคคล',
    desc: 'รถยนต์ รถตู้ รถกระบะ รถบ้านเล็ก ≤ 26,000 ปอนด์',
    modes: {
      handbook: { url: 'handbook.html',          label: 'คู่มือผู้ขับขี่',   desc: '9 บท แปลครบจาก California Driver Handbook', available: true },
      practice: { url: 'practice.html',           label: 'ฝึกซ้อม',          desc: 'สุ่ม 190 ข้อ ตอบแล้วเห็นเฉลยทันที ไม่จำกัดเวลา', available: true },
      exam:     { url: 'exam.html?test=1',         label: 'ข้อสอบเป็นชุด',    desc: '12 ชุด ๆ ละ 15 ข้อ เลือกชุดที่ต้องการ',         available: true },
      mock:     { url: 'mock-exam.html',           label: 'สอบจำลอง',         desc: '46 ข้อ จับเวลา 40 นาที ผ่านเมื่อถูก ≥ 83%',     available: true },
    },
  },
  {
    id: 'm1',
    code: 'Class M1',
    icon: '🏍️',
    color: '#ea580c',
    name: 'Class M1 — มอเตอร์ไซค์',
    desc: 'รถจักรยานยนต์ทุกประเภท รวมถึง scooter ขนาดใหญ่',
    modes: {
      handbook: { url: null,                       label: 'คู่มือผู้ขับขี่',   desc: 'California Motorcycle Handbook', available: false },
      practice: { url: 'motorcycle.html',          label: 'ฝึกซ้อม',          desc: 'สุ่มข้อสอบมอเตอร์ไซค์ ตอบแล้วเห็นเฉลยทันที',   available: true },
      exam:     { url: 'motorcycle-exam.html?test=1', label: 'ข้อสอบเป็นชุด', desc: 'ทำข้อสอบเป็นชุด แบบ Class M1',                   available: true },
      mock:     { url: 'motorcycle-mock-exam.html',label: 'สอบจำลอง',         desc: 'จำลองการสอบ Class M1 แบบจับเวลา',                available: true },
    },
  },
  {
    id: 'm2',
    code: 'Class M2',
    icon: '🛵',
    color: '#0891b2',
    name: 'Class M2 — Moped / จักรยานยนต์ไฟฟ้า',
    desc: 'Motorized bicycle, moped, electric bicycle (≤ 30 mph)',
    modes: {
      handbook: { url: null, label: 'คู่มือผู้ขับขี่',   desc: 'California Motorcycle Handbook (M2 section)', available: false },
      practice: { url: null, label: 'ฝึกซ้อม',          desc: 'ข้อสอบ Class M2',                            available: false },
      exam:     { url: null, label: 'ข้อสอบเป็นชุด',    desc: 'ทำข้อสอบเป็นชุด แบบ Class M2',               available: false },
      mock:     { url: null, label: 'สอบจำลอง',         desc: 'จำลองการสอบ Class M2 แบบจับเวลา',            available: false },
    },
  },
  {
    id: 'nc-a',
    code: 'Non-com A',
    icon: '🚐',
    color: '#65a30d',
    name: 'Non-commercial Class A — ลากรถพ่วง',
    desc: 'ลาก Travel Trailer / 5th-wheel น้ำหนักเกินเกณฑ์ (> 10,000–15,000 ปอนด์)',
    modes: {
      handbook: { url: null, label: 'คู่มือผู้ขับขี่',   desc: 'Non-commercial Class A Handbook', available: false },
      practice: { url: null, label: 'ฝึกซ้อม',          desc: 'ข้อสอบ Non-commercial Class A',   available: false },
      exam:     { url: null, label: 'ข้อสอบเป็นชุด',    desc: 'ทำข้อสอบเป็นชุด',                available: false },
      mock:     { url: null, label: 'สอบจำลอง',         desc: 'จำลองการสอบ แบบจับเวลา',         available: false },
    },
  },
  {
    id: 'nc-b',
    code: 'Non-com B',
    icon: '🚌',
    color: '#0f766e',
    name: 'Non-commercial Class B — รถบ้านขนาดใหญ่',
    desc: 'Motorhome ยาว 40–45 ฟุต (ไม่ใช่เพื่อการพาณิชย์)',
    modes: {
      handbook: { url: null, label: 'คู่มือผู้ขับขี่',   desc: 'Non-commercial Class B Handbook', available: false },
      practice: { url: null, label: 'ฝึกซ้อม',          desc: 'ข้อสอบ Non-commercial Class B',   available: false },
      exam:     { url: null, label: 'ข้อสอบเป็นชุด',    desc: 'ทำข้อสอบเป็นชุด',                available: false },
      mock:     { url: null, label: 'สอบจำลอง',         desc: 'จำลองการสอบ แบบจับเวลา',         available: false },
    },
  },
  {
    id: 'cdl-ab',
    code: 'CDL A/B',
    icon: '🚛',
    color: '#7c3aed',
    name: 'CDL Class A & B — รถพาณิชย์ขนาดใหญ่',
    desc: 'รถบรรทุกพ่วง (GCWR ≥ 26,001 ปอนด์) และรถบัสโดยสาร',
    modes: {
      handbook: { url: null, label: 'คู่มือผู้ขับขี่',   desc: 'CDL General Knowledge Handbook',  available: false },
      practice: { url: null, label: 'ฝึกซ้อม',          desc: 'ข้อสอบ CDL General Knowledge',    available: false },
      exam:     { url: null, label: 'ข้อสอบเป็นชุด',    desc: 'ทำข้อสอบเป็นชุด แบบ CDL',        available: false },
      mock:     { url: null, label: 'สอบจำลอง',         desc: 'จำลองการสอบ CDL แบบจับเวลา',     available: false },
    },
  },
  {
    id: 'cdl-c',
    code: 'CDL C',
    icon: '⚠️',
    color: '#b45309',
    name: 'CDL Class C — HazMat & รถโดยสาร',
    desc: 'ขนวัตถุอันตราย (HazMat) หรือรถโดยสารที่บรรทุกผู้โดยสาร ≥ 16 คน',
    modes: {
      handbook: { url: null, label: 'คู่มือผู้ขับขี่',   desc: 'CDL Class C & HazMat Handbook',   available: false },
      practice: { url: null, label: 'ฝึกซ้อม',          desc: 'ข้อสอบ CDL Class C / HazMat',     available: false },
      exam:     { url: null, label: 'ข้อสอบเป็นชุด',    desc: 'ทำข้อสอบเป็นชุด',                available: false },
      mock:     { url: null, label: 'สอบจำลอง',         desc: 'จำลองการสอบ แบบจับเวลา',         available: false },
    },
  },
];
