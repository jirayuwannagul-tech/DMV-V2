/**
 * question-i18n.js — โครงสร้างคำแปลเนื้อหาข้อสอบ (คำถาม/ตัวเลือก/เฉลย/คำอธิบาย)
 *
 * เหตุผลที่แยกจาก i18n.js: i18n.js เก็บคำแปล "UI" (ปุ่ม, ป้าย, ข้อความหน้าเว็บ)
 * ส่วนไฟล์นี้เก็บคำแปล "เนื้อหาข้อสอบ" ซึ่งมีจำนวนมาก (200+ ข้อ) และจะถูกเติมทีหลัง
 * ทีละภาษา/ทีละชุด โดยไม่กระทบโครงสร้าง UI ที่ทำเสร็จแล้ว
 *
 * โครงสร้างข้อมูล:
 *   QUESTION_I18N = {
 *     car:  { [questionId]: { [langCode]: { question, choices: [...], answerText, explanation, tip, terms } } },
 *     moto: { [questionId]: { [langCode]: { ... } } },
 *   }
 *
 * - "car"  ใช้กับคำถามจาก DMV_TESTS  (practice.js / exam.js / mock-exam.js)
 * - "moto" ใช้กับคำถามจาก MOTO_TESTS (motorcycle.js / motorcycle-exam.js / motorcycle-mock-exam.js)
 *   (แยก namespace เพราะ id ใน DMV_TESTS และ MOTO_TESTS ซ้ำกันได้ เช่น id 1, 2)
 *
 * ทุก field ในแต่ละภาษาเป็นทางเลือก — ถ้าไม่ได้ใส่ไว้ ระบบจะ fallback ไปใช้
 * ข้อความภาษาไทยต้นฉบับจาก DMV_TESTS / MOTO_TESTS โดยอัตโนมัติ จึงเติมคำแปล
 * เพิ่มเรื่อย ๆ ได้โดยไม่ต้องทำให้ครบทุกข้อ/ทุกภาษาในคราวเดียว
 *
 * ตัวอย่างการเติมคำแปล (เพิ่มเข้าไปใน object ด้านล่าง):
 *   car: {
 *     1: {
 *       en: {
 *         question: 'You must notify the DMV within 5 days if you:',
 *         choices: ['Sell or transfer your vehicle', 'Repaint your vehicle', 'Receive a traffic citation'],
 *         answerText: 'Sell or transfer your vehicle',
 *       },
 *     },
 *   }
 */

const QUESTION_I18N = {
  car:  {},
  moto: {},
};

/**
 * translateQuestion(question, lang, namespace)
 *   → คืนค่า object คำถามฉบับแปล (ถ้ามี) หรือฉบับภาษาไทยต้นฉบับ (ถ้าไม่มีคำแปล)
 *
 *   question  : object คำถามจาก DMV_TESTS / MOTO_TESTS
 *   lang      : รหัสภาษาปัจจุบัน เช่น 'en', 'ja' (ถ้าไม่ส่งมาจะอ่านจาก I18N.getLanguage())
 *   namespace : 'car' (ค่าเริ่มต้น) หรือ 'moto'
 */
function translateQuestion(question, lang, namespace) {
  namespace = namespace || 'car';
  if (!lang && typeof I18N !== 'undefined') lang = I18N.getLanguage();

  if (!lang || lang === 'th') return question;

  const dict  = QUESTION_I18N[namespace];
  const entry = dict && dict[question.id] && dict[question.id][lang];
  if (!entry) return question;

  return Object.assign({}, question, {
    question:    entry.question    || question.question,
    choices:     entry.choices     || question.choices,
    answerText:  entry.answerText  || question.answerText,
    explanation: entry.explanation || question.explanation,
    tip:         entry.tip         || question.tip,
    terms:       entry.terms       || question.terms,
  });
}
