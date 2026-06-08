/**
 * verify-questions.js
 *
 * ตรวจสอบความถูกต้องของข้อสอบ DMV (ภาษาไทย) เทียบกับเนื้อหา California DMV
 * โดยใช้ Claude API
 *
 * Usage:
 *   node verify-questions.js              # ตรวจสอบทั้งหมด 190 ข้อ
 *   node verify-questions.js --limit 20   # ทดสอบ 20 ข้อแรก
 *   node verify-questions.js --set 1      # ตรวจสอบเฉพาะชุดที่ 1
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- Parse CLI args ----
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const setIdx = args.indexOf('--set');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : null;
const SET_FILTER = setIdx !== -1 ? parseInt(args[setIdx + 1], 10) : null;

// ---- Load questions from data.js ----
function loadQuestions() {
  const dataPath = path.join(__dirname, '../assets/js/data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  // vm.runInNewContext only exposes var declarations — rewrite const/let to var
  const transformed = code.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
  const context = { DMV_TESTS: [], Array };
  vm.runInNewContext(transformed, context);
  return context.DMV_TESTS;
}

// ---- System prompt (cached across all requests) ----
const SYSTEM_PROMPT = `You are an expert on California DMV written driving test content and California Vehicle Code.

Your task: verify Thai-translated California DMV exam questions for accuracy.

For EACH question in the input JSON array, evaluate:
- Is the topic/concept aligned with actual California DMV written test content?
- Is the marked correct answer accurate per California DMV handbook and Vehicle Code?
- Are the wrong choices plausible (not misleading or wrong in a harmful way)?
- Is any information outdated (laws change over time)?

Return a JSON array (one object per question) with this exact shape:
{
  "id": <number>,
  "status": "correct" | "wrong_answer" | "outdated" | "inaccurate" | "needs_review",
  "answer_correct": <boolean>,
  "issue": <string | null>,
  "suggestion": <string | null>,
  "confidence": <0.0–1.0>
}

Status definitions:
- "correct"       : content and answer are accurate
- "wrong_answer"  : the marked answer index is wrong (different choice is correct)
- "outdated"      : was correct but law/rule has since changed
- "inaccurate"    : question or choices contain factual errors
- "needs_review"  : uncertain, requires human expert review

Respond with ONLY the JSON array, no markdown fences, no explanation.`;

// ---- Verify a single batch ----
async function verifyBatch(client, questions, batchIndex, totalBatches) {
  const payload = questions.map(q => ({
    id: q.id,
    set: q.test,
    question_th: q.question,
    choices_th: q.choices,
    marked_answer_index: q.answer,
    marked_answer_text_th: q.answerText,
  }));

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Verify these ${questions.length} California DMV exam questions (translated to Thai). Questions are from set(s) ${[...new Set(questions.map(q => q.test))].join(', ')}.\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text block in response');

  const raw = textBlock.text.trim();
  // Strip accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try extracting the JSON array if Claude wrapped it in text
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error(`Cannot parse JSON from response: ${raw.slice(0, 200)}`);
    parsed = JSON.parse(match[0]);
  }

  return { results: parsed, usage: response.usage };
}

// ---- Main ----
async function main() {
  const client = new Anthropic();

  let questions = loadQuestions();
  console.log(`Loaded ${questions.length} questions total`);

  if (SET_FILTER !== null) {
    questions = questions.filter(q => q.test === SET_FILTER);
    console.log(`Filtered to set ${SET_FILTER}: ${questions.length} questions`);
  }
  if (LIMIT !== null) {
    questions = questions.slice(0, LIMIT);
    console.log(`Limited to first ${LIMIT} questions`);
  }

  const BATCH_SIZE = 10;
  const batches = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nVerifying ${questions.length} questions in ${batches.length} batch(es) of ${BATCH_SIZE}...\n`);

  const allResults = [];
  let totalInputTokens = 0;
  let totalCacheReadTokens = 0;
  let totalOutputTokens = 0;
  const errors = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const ids = `${batch[0].id}–${batch[batch.length - 1].id}`;
    process.stdout.write(`  Batch ${i + 1}/${batches.length} (Q${ids}) ... `);

    try {
      const { results, usage } = await verifyBatch(client, batch, i + 1, batches.length);
      allResults.push(...results);

      totalInputTokens += usage.input_tokens ?? 0;
      totalCacheReadTokens += usage.cache_read_input_tokens ?? 0;
      totalOutputTokens += usage.output_tokens ?? 0;

      const cacheHit = usage.cache_read_input_tokens > 0 ? ' (cache hit)' : '';
      console.log(`✓${cacheHit}`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
      errors.push({ batch: i + 1, ids, error: err.message });
    }

    // Polite delay between calls
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // ---- Build summary ----
  const statusCounts = {
    correct: 0,
    wrong_answer: 0,
    outdated: 0,
    inaccurate: 0,
    needs_review: 0,
  };
  for (const r of allResults) {
    if (r.status in statusCounts) statusCounts[r.status]++;
  }

  const issues = allResults.filter(r => r.status !== 'correct');

  // ---- Save report ----
  const report = {
    generated_at: new Date().toISOString(),
    total_questions: questions.length,
    verified: allResults.length,
    errors,
    summary: statusCounts,
    token_usage: {
      input_tokens: totalInputTokens,
      cache_read_tokens: totalCacheReadTokens,
      output_tokens: totalOutputTokens,
    },
    issues,
    all_results: allResults,
  };

  const reportPath = path.join(__dirname, 'verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  // ---- Print summary ----
  console.log('\n' + '═'.repeat(50));
  console.log('  VERIFICATION SUMMARY');
  console.log('═'.repeat(50));
  console.log(`  Total verified : ${allResults.length} / ${questions.length}`);
  console.log(`  ✅ Correct      : ${statusCounts.correct}`);
  console.log(`  ❌ Wrong answer : ${statusCounts.wrong_answer}`);
  console.log(`  ⚠️  Inaccurate  : ${statusCounts.inaccurate}`);
  console.log(`  🕐 Outdated     : ${statusCounts.outdated}`);
  console.log(`  🔍 Needs review : ${statusCounts.needs_review}`);
  if (errors.length) {
    console.log(`  💥 Batch errors : ${errors.length}`);
  }
  console.log('─'.repeat(50));

  const accuracy = allResults.length > 0
    ? ((statusCounts.correct / allResults.length) * 100).toFixed(1)
    : '0.0';
  console.log(`  Accuracy rate  : ${accuracy}%`);
  console.log(`  Tokens used    : ${totalInputTokens} in, ${totalOutputTokens} out`);
  console.log(`  Cache reads    : ${totalCacheReadTokens} tokens`);
  console.log('═'.repeat(50));

  if (issues.length > 0) {
    console.log('\n  ISSUES FOUND:');
    for (const issue of issues) {
      const q = questions.find(q => q.id === issue.id);
      console.log(`\n  Q${issue.id} (Set ${q?.test}) [${issue.status}]`);
      console.log(`    Question : ${q?.question?.slice(0, 80)}...`);
      if (issue.issue) console.log(`    Issue    : ${issue.issue}`);
      if (issue.suggestion) console.log(`    Fix      : ${issue.suggestion}`);
      console.log(`    Confidence: ${(issue.confidence * 100).toFixed(0)}%`);
    }
  }

  console.log(`\n  Full report saved → verify/verification-report.json\n`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
