/**
 * import-official.js
 *
 * นำข้อสอบ official จาก dmv.ca.gov (56 ข้อ ภาษาอังกฤษ) เข้าไปใน data.js
 * โดย:
 *   1. ตรวจว่าข้อไหนซ้ำกับที่มีอยู่แล้ว (semantic dedup ผ่าน Claude)
 *   2. แปลข้อใหม่เป็นภาษาไทย สไตล์ official DMV + เพิ่ม explanation/tip
 *   3. เพิ่มเข้า data.js ในชุดใหม่
 *
 * Usage:
 *   node import-official.js          # ทำทั้งหมด
 *   node import-official.js --dry    # แค่ดูว่าจะเพิ่มข้อไหน ไม่แก้ไฟล์จริง
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH     = path.join(__dirname, '../assets/js/data.js');
const OFFICIAL_PATH = path.join(__dirname, 'official-questions.json');

const DRY_RUN = process.argv.includes('--dry');

// ── Load existing questions ──────────────────────────────────────
function loadExisting() {
  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const xformed = code.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
  const ctx = { DMV_TESTS: [], Array };
  vm.runInNewContext(xformed, ctx);
  return ctx.DMV_TESTS;
}

// ── Deduplicate: which official questions are new? ───────────────
async function findNewQuestions(client, official, existing) {
  // Send both sets to Claude to identify semantic duplicates
  const existingSummary = existing.map(q => ({ id: q.id, question: q.question }));
  const officialList    = official.map((q, i) => ({ idx: i, q: q.q }));

  const res = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    system: [{
      type: 'text',
      text: `You compare two lists of DMV exam questions: one in Thai (existing), one in English (new official questions).
Your task: identify which official English questions are NOT already covered by any existing Thai question (even if phrased differently, same concept = duplicate).

Return a JSON array of the idx values that are NEW (not duplicates). Example: [0, 2, 5, 7]
Only return the JSON array, nothing else.`,
      cache_control: { type: 'ephemeral' },
    }],
    messages: [{
      role: 'user',
      content: `EXISTING Thai questions (${existingSummary.length} total):\n${JSON.stringify(existingSummary, null, 2)}\n\nOFFICIAL English questions to check:\n${JSON.stringify(officialList, null, 2)}\n\nWhich official question idx values are NEW (not already in existing)?`,
    }],
  });

  const text = res.content.find(b => b.type === 'text')?.text || '[]';
  const clean = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const match = clean.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}

// ── Translate batch to Thai + add explanation ────────────────────
async function translateBatch(client, questions) {
  const payload = questions.map((q, i) => ({
    idx: i,
    question_en: q.q,
    choices_en: q.choices,
    correct_answer_index: q.answer,
  }));

  const res = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: [{
      type: 'text',
      text: `คุณเป็นนักแปลเชี่ยวชาญด้านข้อสอบใบขับขี่ California DMV

แปลข้อสอบจากภาษาอังกฤษเป็นภาษาไทย โดยใช้ภาษาเดียวกับที่ DMV ใช้ในการสอบจริง (ใช้คำทางการแต่เข้าใจได้)

สำหรับแต่ละข้อ ให้ส่งกลับ JSON object:
{
  "idx": <number>,
  "question": "<คำถามภาษาไทย>",
  "choices": ["<ตัวเลือก A>", "<ตัวเลือก B>", "<ตัวเลือก C>"],
  "answer": <0|1|2>,
  "answerText": "<ข้อความเฉลย>",
  "explanation": "<อธิบายว่าทำไมคำตอบถูก ภาษาไทยพูดทั่วไป 1-2 ประโยค>",
  "tip": "<เคล็ดลับจำง่าย 1 ประโยค หรือ null>",
  "terms": {"<คำทางการ>": "<คำอธิบายง่ายๆ>"} หรือ null
}

กฎการแปล:
- ใช้คำศัพท์ที่ DMV ใช้จริงๆ เช่น "ทางข้ามม้าลาย" "เส้นกั้นถนน" "เลนจักรยาน"
- "you" = "ท่าน"
- "right-of-way" = "ทางเอก (สิทธิ์ผ่านก่อน)"
- "crosswalk" = "ทางข้ามม้าลาย"
- "intersection" = "ทางแยก"
- "high beam" = "ไฟไกล" และ "low beam" = "ไฟต่ำ"
- ตัวเลือกต้องแปลครบทุกตัว
- answer index ต้องตรงกับภาษาอังกฤษ

ตอบกลับเป็น JSON array เท่านั้น`,
      cache_control: { type: 'ephemeral' },
    }],
    messages: [{
      role: 'user',
      content: `แปลข้อสอบเหล่านี้:\n\n${JSON.stringify(payload, null, 2)}`,
    }],
  });

  const textBlock = res.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('ไม่มี text block');
  const raw = textBlock.text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`parse JSON ล้มเหลว: ${raw.slice(0, 300)}`);
  return { data: JSON.parse(match[0]), usage: res.usage };
}

// ── Append new questions to data.js ─────────────────────────────
function appendToDataJs(newQuestions, startId, startSet) {
  let code = fs.readFileSync(DATA_PATH, 'utf8');

  // Find next available set number
  const setNums = [...code.matchAll(/test:\s*(\d+)/g)].map(m => parseInt(m[1]));
  const maxSet  = Math.max(...setNums, startSet - 1);
  let   setNum  = maxSet + 1;
  let   id      = startId;

  const chunks = [];
  for (let i = 0; i < newQuestions.length; i += 10) {
    const batch  = newQuestions.slice(i, i + 10);
    const header = `\n\n  /* ${'='.repeat(64)}\n     ชุดที่ ${setNum}  (Official DMV ข้อ ${id}–${id + batch.length - 1})\n     ${'='.repeat(64)} */`;
    const items  = batch.map(q => {
      const termsLine = q.terms && Object.keys(q.terms).length
        ? `\n    terms: ${JSON.stringify(q.terms)},`
        : '';
      const tipLine = q.tip ? `\n    tip: ${JSON.stringify(q.tip)},` : '';
      const expLine = q.explanation ? `\n    explanation: ${JSON.stringify(q.explanation)},` : '';
      return `  {
    id: ${id++}, test: ${setNum},
    question: ${JSON.stringify(q.question)},
    choices: [
      ${q.choices.map(c => JSON.stringify(c)).join(',\n      ')}
    ],
    answer: ${q.answer},
    answerText: ${JSON.stringify(q.answerText)}${expLine}${tipLine}${termsLine}
  }`;
    }).join(',\n');
    chunks.push(header + '\n' + items);
    setNum++;
  }

  // Insert before the closing ]; of DMV_TESTS
  const insertPoint = code.lastIndexOf('];');
  const newCode = code.slice(0, insertPoint) + ',\n' + chunks.join(',\n') + '\n\n' + code.slice(insertPoint);
  fs.writeFileSync(DATA_PATH, newCode, 'utf8');
  return id - startId; // how many were added
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const client   = new Anthropic();
  const official = JSON.parse(fs.readFileSync(OFFICIAL_PATH, 'utf8'));
  const existing = loadExisting();

  const maxId  = Math.max(...existing.map(q => q.id));
  const maxSet = Math.max(...existing.map(q => q.test));

  console.log(`ข้อสอบปัจจุบัน: ${existing.length} ข้อ (ชุด 1–${maxSet}, id 1–${maxId})`);
  console.log(`Official questions ที่จะตรวจ: ${official.length} ข้อ\n`);

  // Step 1: Find duplicates
  process.stdout.write('กำลังตรวจสอบ duplicates...');
  const newIdxs = await findNewQuestions(client, official, existing);
  const newOnes = newIdxs.map(i => official[i]);
  console.log(` พบข้อใหม่ ${newOnes.length} ข้อ (ซ้ำ ${official.length - newOnes.length} ข้อ)\n`);

  if (newOnes.length === 0) {
    console.log('ไม่มีข้อใหม่ที่ต้องเพิ่ม');
    return;
  }

  if (DRY_RUN) {
    console.log('-- DRY RUN: ข้อที่จะเพิ่ม --');
    newOnes.forEach((q, i) => console.log(`  [${i + 1}] (${q.src}) ${q.q.slice(0, 70)}`));
    return;
  }

  // Step 2: Translate in batches of 10
  const BATCH = 10;
  const translated = [];
  let totalTokens = 0;

  for (let i = 0; i < newOnes.length; i += BATCH) {
    const batch = newOnes.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const total    = Math.ceil(newOnes.length / BATCH);
    process.stdout.write(`  แปล batch ${batchNum}/${total} (${batch.length} ข้อ)...`);
    try {
      const { data, usage } = await translateBatch(client, batch);
      translated.push(...data);
      totalTokens += (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0);
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ ${err.message}`);
    }
    if (i + BATCH < newOnes.length) await new Promise(r => setTimeout(r, 600));
  }

  // Step 3: Write to data.js
  console.log('\nเพิ่มลงใน data.js...');
  const added = appendToDataJs(translated, maxId + 1, maxSet + 1);

  console.log('\n' + '═'.repeat(50));
  console.log(`  ✅ เพิ่มข้อสอบใหม่: ${added} ข้อ`);
  console.log(`  ข้อสอบทั้งหมดตอนนี้: ${existing.length + added} ข้อ`);
  console.log(`  Tokens ใช้ไป: ~${totalTokens.toLocaleString()}`);
  console.log('═'.repeat(50) + '\n');
  console.log('รีเฟรชหน้าเว็บเพื่อดูข้อสอบใหม่ 🎉');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
