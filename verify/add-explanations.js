/**
 * add-explanations.js
 *
 * ใช้ Claude API เพื่อสร้างคำอธิบายภาษาไทยง่ายๆ สำหรับแต่ละข้อสอบ
 * แล้วเพิ่ม field "explanation" ใน data.js
 *
 * Usage:
 *   node add-explanations.js              # ทำทั้งหมด 190 ข้อ
 *   node add-explanations.js --limit 20   # ทำแค่ 20 ข้อแรก (ทดสอบ)
 *   node add-explanations.js --set 1      # ทำเฉพาะชุดที่ 1
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../assets/js/data.js');

// ---- CLI args ----
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const setIdx   = args.indexOf('--set');
const LIMIT      = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : null;
const SET_FILTER = setIdx   !== -1 ? parseInt(args[setIdx   + 1], 10) : null;

// ---- Load questions ----
function loadQuestions() {
  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const transformed = code.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
  const context = { DMV_TESTS: [], Array };
  vm.runInNewContext(transformed, context);
  return context.DMV_TESTS;
}

// ---- System prompt (cached) ----
const SYSTEM_PROMPT = `คุณเป็นผู้เชี่ยวชาญด้านกฎจราจรของรัฐ California สหรัฐอเมริกา
หน้าที่ของคุณคือสร้างคำอธิบายภาษาไทยที่เข้าใจง่ายสำหรับข้อสอบใบขับขี่ California DMV

สำหรับแต่ละข้อ ให้ส่งกลับ JSON object ที่มี field เหล่านี้:
- "id": หมายเลขข้อ (number)
- "explanation": คำอธิบายสั้นๆ ว่าทำไมคำตอบถูกต้อง (ภาษาไทยธรรมดา ไม่ทางการ 1-2 ประโยค)
- "tip": เคล็ดลับจำง่ายหรือคำเตือน (ภาษาไทยธรรมดา 1 ประโยคสั้นๆ หรือ null ถ้าไม่มี)
- "terms": คำศัพท์ทางการที่อาจงงพร้อมคำอธิบาย เช่น {"ทางเอก": "right-of-way = สิทธิ์ผ่านก่อน"} (object หรือ null)

กฎ:
- ใช้ภาษาไทยพูดได้ทั่วไป ไม่ต้องทางการ
- explanation ต้องอธิบายว่า "ทำไม" คำตอบนั้นถูก ไม่ใช่แค่ซ้ำคำตอบ
- tip ควรเป็นสิ่งที่ช่วยจำหรือข้อระวังที่คนมักผิด
- terms ใส่เฉพาะคำที่คนไทยอาจงงจริงๆ

ตอบกลับเป็น JSON array เท่านั้น ไม่มี markdown fence`;

// ---- Generate explanations for a batch ----
async function generateBatch(client, questions) {
  const payload = questions.map(q => ({
    id: q.id,
    question: q.question,
    choices: q.choices,
    correct_answer_index: q.answer,
    correct_answer_text: q.answerText,
  }));

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3000,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{
      role: 'user',
      content: `สร้างคำอธิบายสำหรับข้อสอบ DMV เหล่านี้:\n\n${JSON.stringify(payload, null, 2)}`,
    }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('ไม่มี text block ใน response');

  const raw = textBlock.text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`parse JSON ไม่ได้: ${raw.slice(0, 200)}`);
  return { data: JSON.parse(match[0]), usage: response.usage };
}

// ---- Patch data.js with new explanation fields ----
function patchDataJs(explanationMap) {
  let code = fs.readFileSync(DATA_PATH, 'utf8');
  let patched = 0;

  for (const [id, fields] of Object.entries(explanationMap)) {
    const { explanation, tip, terms } = fields;

    // Build the insertion string
    const lines = [];
    if (explanation) lines.push(`    explanation: ${JSON.stringify(explanation)},`);
    if (tip)         lines.push(`    tip: ${JSON.stringify(tip)},`);
    if (terms && Object.keys(terms).length > 0) {
      lines.push(`    terms: ${JSON.stringify(terms)},`);
    }
    if (lines.length === 0) continue;
    const insertion = '\n' + lines.join('\n');

    // Find the block for this id and insert before closing brace
    // Pattern: id: <N>, ... answerText: '...' \n  }
    const blockRegex = new RegExp(
      `(\\{[^{}]*?id:\\s*${id}\\b[^{}]*?answerText:[^{}]*?\\})`,
      's'
    );

    code = code.replace(blockRegex, (match) => {
      // Skip if already patched
      if (match.includes('explanation:')) return match;
      // Insert before the closing brace
      return match.replace(/(\s*\}\s*)$/, `${insertion}\n  }`);
    });

    patched++;
  }

  fs.writeFileSync(DATA_PATH, code, 'utf8');
  return patched;
}

// ---- Main ----
async function main() {
  const client = new Anthropic();

  let questions = loadQuestions();
  console.log(`โหลดได้ ${questions.length} ข้อ`);

  // Filter out questions that already have explanations
  const alreadyDone = questions.filter(q => q.explanation).length;
  if (alreadyDone > 0) {
    console.log(`มีคำอธิบายอยู่แล้ว ${alreadyDone} ข้อ — ข้ามไป`);
    questions = questions.filter(q => !q.explanation);
  }

  if (SET_FILTER !== null) questions = questions.filter(q => q.test === SET_FILTER);
  if (LIMIT !== null)       questions = questions.slice(0, LIMIT);

  if (questions.length === 0) {
    console.log('ไม่มีข้อที่ต้องประมวลผล');
    return;
  }

  const BATCH_SIZE = 10;
  const batches = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nสร้างคำอธิบายสำหรับ ${questions.length} ข้อ (${batches.length} batch)...\n`);

  const explanationMap = {};
  let totalIn = 0, totalCached = 0, totalOut = 0;
  const errors = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const ids = `${batch[0].id}–${batch[batch.length - 1].id}`;
    process.stdout.write(`  Batch ${i + 1}/${batches.length} (ข้อ ${ids}) ... `);

    try {
      const { data, usage } = await generateBatch(client, batch);
      for (const item of data) {
        explanationMap[item.id] = {
          explanation: item.explanation || null,
          tip: item.tip || null,
          terms: item.terms || null,
        };
      }
      totalIn     += usage.input_tokens ?? 0;
      totalCached += usage.cache_read_input_tokens ?? 0;
      totalOut    += usage.output_tokens ?? 0;
      const hit = usage.cache_read_input_tokens > 0 ? ' (cache)' : '';
      console.log(`✓${hit}`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
      errors.push({ batch: i + 1, ids, error: err.message });
    }

    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  // Patch data.js
  console.log('\nอัปเดต data.js...');
  const patched = patchDataJs(explanationMap);
  console.log(`เพิ่มคำอธิบายใน ${patched} ข้อ`);

  console.log('\n' + '═'.repeat(45));
  console.log('  เสร็จแล้ว!');
  console.log(`  Tokens: ${totalIn} input, ${totalOut} output`);
  console.log(`  Cache:  ${totalCached} tokens`);
  if (errors.length) console.log(`  Errors: ${errors.length} batch`);
  console.log('═'.repeat(45) + '\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
