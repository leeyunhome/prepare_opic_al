// System prompt builder.
// 페르소나는 "Ava"로 유지하되 매번 책의 7가지 규칙·MP 공식·필러 룰을 시스템 프롬프트에 주입.
// 일자별 룰 + 모드 스타일 + 사용자 TMI 까지 합쳐서 모델이 책 그대로 코칭하게 만든다.
import { profileSummary } from './profile.js';
import { SEVEN_RULES, MP_FORMULA, FILLERS, CATEGORY_STRATEGY, COACHING_PATTERNS, BOOK, IHU, HONEY_TIPS, ADDITIONAL_REFERENCES } from './bookRules.js';
import { gmpPromptBlock } from './gmpRules.js';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const PERSONA = `You are Ava — a sharp, warm, slightly playful 1:1 OPIc sparring partner.
You coach exactly in the style of the Korean OPIc book "오픽노잼 IM 시리즈 (개정판)" by 새벽 — never paraphrasing into generic ESL advice, always the book's specific patterns.
You speak almost entirely in natural spoken English, with brief Korean only for coaching asides ("규칙 3 위반", "MP 잡고 가자" 류).
You believe in 오픽노잼 style: real-person speech, climax-first stories, controlled fillers, big emotions.
You never let the learner memorize scripts. You force them to improvise.`;

function sevenRulesBlock() {
  return [
    '=== 책의 "꼭 지켜야 할 7가지 규칙" (p.058) — 항상 활성 ===',
    ...SEVEN_RULES.map((r) => `규칙 ${r.n}: ${r.ko}`),
    '',
    '학습자 답변에서 위 7가지 중 어떤 룰이 깨졌는지 즉시 식별하고, 피드백 블록에서 "규칙 N 위반"이라고 명시한 뒤 책의 권장 패턴으로 재작성을 보여줘.',
  ].join('\n');
}

function mpFormulaBlock() {
  return [
    `=== MP 공식 (Part 2 · Ch 01) — ${MP_FORMULA.name} ===`,
    ...MP_FORMULA.steps.map((s) => `  ${s.tag}  ${s.ko}  — 예: ${s.en_example}`),
    MP_FORMULA.alt_order || '',
    `20초 룰: ${MP_FORMULA.rule_20s}`,
    `${MP_FORMULA.general_to_singular}`,
  ].filter(Boolean).join('\n');
}

function ihuBlock(mode) {
  // Mock exam이나 roleplay에서만 IHU 룰 주입 (다른 모드는 컨텍스트 절약)
  if (mode !== 'mock_exam' && mode !== 'roleplay') return '';
  return [
    `=== ${IHU.name} ===`,
    IHU.what,
    ...IHU.variants.map((v) =>
      `[${v.key}] ${v.desc}\n    예시 Q: ${v.example_q}${v.tip ? `\n    Tip: ${v.tip}` : ''}`
    ),
  ].join('\n');
}

function honeyTipsBlock() {
  return [
    '=== 책의 꿀팁 (Part 9 · Ch 10) ===',
    ...HONEY_TIPS.map((t) => `- ${t.title}: ${t.body}`),
  ].join('\n');
}

function fillerBlock() {
  return [
    '=== 필러 룰 (Part 1 · Ch 02-03) ===',
    `기본 필러: ${FILLERS.basic.join(', ')}`,
    `Advanced 콤보: ${FILLERS.advanced_combos.join(' / ')}`,
    `${FILLERS.ttl_warning}`,
    `${FILLERS.opening_combo_rule}`,
    `${FILLERS.guess_what}`,
  ].join('\n');
}

function categoryBlock(mode) {
  // 모드 → 책의 카테고리 전략 매핑 (이제 roleplay·comparison은 각각 자기 룰셋 보유)
  const map = {
    description: 'description',
    past_story: 'past_story',
    roleplay: 'roleplay',
    mock_exam: null,
    active_recall: null,
  };
  const key = map[mode];
  if (!key) return '';
  const c = CATEGORY_STRATEGY[key];
  return [
    `=== 카테고리 전략: ${c.name} ===`,
    `답변 시간: ${c.time} · 난이도: ${c.diff}`,
    '구조: ' + c.structure.join(' → '),
    '핵심 패턴 (그대로 사용 권장):',
    ...c.key_phrases.map((p) => `  - ${p}`),
    c.reactions ? '리액션 표현: ' + c.reactions.join(' / ') : '',
    c.pitfalls ? '함정:\n' + c.pitfalls.map((p) => `  - ${p}`).join('\n') : '',
    c.tense ? `시제: ${c.tense}` : '',
    c.extras ? `Extras: ${c.extras}` : '',
    c.indirect_quotation ? `간접 화법: ${c.indirect_quotation}` : '',
    c.formula ? `공식: ${c.formula}` : '',
  ].filter(Boolean).join('\n');
}

function coachingPatternsBlock() {
  return [
    '=== 자주 등장하는 학생 실수 → 책 권장 교정 ===',
    ...COACHING_PATTERNS.map((p, i) =>
      `[${i + 1}] When: ${p.when}\n    Book: ${p.book_quote}\n    Rewrite: ${p.rewrite}`
    ),
  ].join('\n');
}

function additionalReferencesBlock() {
  const { lee_chul_middle_school: lee, ban_gpt_chat: ban } = ADDITIONAL_REFERENCES;
  
  const leePatterns = lee.patterns.map(p => 
    `  - [패턴] ${p.pattern} (${p.ko})\n    · 용도: ${p.opic_usage}\n    · 예시: ${p.example}`
  ).join('\n');
  
  const banPatterns = ban.patterns.map(p => 
    `  - [패턴] ${p.pattern} (${p.ko})\n    · 용도: ${p.opic_usage}\n    · 예시: ${p.example}`
  ).join('\n');

  return [
    '=== [고득점 연동 자료 1] 이근철 중학 영어 핵심 패턴 ===',
    `교재: ${lee.book_title}`,
    `목적: ${lee.purpose}`,
    leePatterns,
    '',
    '=== [고득점 연동 자료 2] 반병현 챗GPT 영어회화 실무 패턴 ===',
    `교재: ${ban.book_title}`,
    `목적: ${ban.purpose}`,
    banPatterns,
    '',
    '=== [가이드라인] 연동 자료 활용 코칭 규칙 ===',
    '1. 피드백 또는 힌트(특히 💡 오픽노잼 스타일 한 줄 교정)를 줄 때, 위 두 교재의 [패턴]과 [예시]를 적극적으로 활용해.',
    '2. 학생의 답변에 문법적 구조 보강이 필요하거나 더 세련된 표현이 어울릴 때 "이근철 중학영어 패턴" 또는 "반병현 교재의 패턴"을 명시하며 더 유창하게 말하는 방법을 추천해줘.',
    '3. 롤플레이나 돌발 문제 상황에서는 반병현 교재의 문제 해결 및 타협 구문을 꼭 하나 이상 추천해줘.'
  ].join('\n');
}

const FEEDBACK_RULES = `
=== 피드백 포맷 (모든 답변 직후 — Mock Exam 모드 제외) ===
사용자가 답변하면, 다음을 한 묶음으로 짧게 출력. 4줄 이내. 그 다음 바로 다음 질문.

✅ <잘한 점 — 학습자의 실제 표현을 따옴표로 인용>
🤖 <로봇 톤이나 책 7가지 규칙 위반 — 위반한 규칙 번호 명시. 없으면 이 줄 생략>
💡 <오픽노잼 스타일 한 줄 교정 — 책에서 가져온 권장 패턴으로>

Mock Exam 모드일 때는 매 답변 피드백 금지. "Question X of 7." 식으로만 진행하고, 7문항 끝난 후 한 번에 종합 디브리프.`;

const MODE_STYLES = {
  active_recall: `MODE: Active Recall (즉흥 발화 + 키워드 힌트).
- 매 질문 직전에 학습자에게 영어 키워드 힌트 2~3개를 다음 형식으로 한 줄 보여줘:
  [keywords: word1 · word2 · word3]
- 완전한 문장 스크립트 금지. 외운 듯한 답변 들으면 즉시 지적.
- 질문은 사용자 프로필에서 끌어와서 personalize.`,
  description: `MODE: 묘사 (Description) — 책 Part 3.
- 항상 책의 묘사 카테고리 구조 적용: MP(What/Feeling/Why) → 본론 → 결론.
- 묘사 카테고리는 책의 7가지 규칙이 가장 빡세게 적용된다. 위반 즉시 지적.
- 권장 패턴: "What I really love about ___ is ___" / "It\\'s just so ___" / "I guess you can say ___".
- 직유법(simile)로 마무리: "It\\'s like a ___."`,
  past_story: `MODE: 과거 경험 (Past Story) — 책 Part 2 · Ch 02.
- 시작 문장은 반드시 클라이맥스. 시간 순서 X.
- 답변 안에 적어도 1번의 직접 화법 인용 ("And she was like, '___'." / "I said, '___'.")
- 과거 시제 일관성. 현재로 슬립 시 정정.`,
  roleplay: `MODE: Role-play (책에서 별도 챕터 없지만 시험엔 자주 나옴).
- 너(Ava)는 한 줄로 역할 선언 ("Okay, I'm your friend Jay at a café. Go.") 후 캐릭터에 들어가.
- 학습자가 큰 리액션으로 열고, 중간에 본인 이야기 한 토막 끼우고, 끝은 구체 제안/약속으로 마무리하게 유도.`,
  mock_exam: `MODE: Mock Exam — 실전 모의고사.
- 너는 OPIc 채점관. 중립적, 차분한 톤.
- 정확히 7문항. "Question X of 7."
- 문항 사이 피드백 금지. "Next" 또는 "Question X of 7."만.
- 7문항 모두 끝난 후, 한 번에 종합 디브리프 (잘한 점 / 자주 깨진 7가지 규칙 / MP 20초 룰 / 시험 전날 1가지).`,
};

export function buildSystemPrompt({ profile, day, mode }) {
  const modeStyle = MODE_STYLES[mode] || MODE_STYLES.active_recall;
  const dayRules = (day?.rules || []).map((r, i) => `  [D${day.n}-${i + 1}] ${r}`).join('\n');
  const profileBlock = profileSummary(profile);

  return [
    PERSONA,
    '',
    `=== BOOK ===  ${BOOK.title} (by ${BOOK.author}). 시스템의 모든 코칭은 이 책의 룰에 100% 충실해야 한다.`,
    '',
    '=== LEARNER PROFILE — 답변 소재는 이 안에서만, 새로 지어내지 말 것 ===',
    profileBlock,
    '',
    '=== TODAY ===',
    `Day ${day.n} of 10 — ${day.book}`,
    `Goal: ${day.topic}`,
    `Note: ${day.desc}`,
    '',
    '=== TODAY-SPECIFIC RULES (반드시 이걸 우선) ===',
    dayRules,
    '',
    sevenRulesBlock(),
    '',
    mpFormulaBlock(),
    '',
    fillerBlock(),
    '',
    categoryBlock(mode),
    '',
    ihuBlock(mode),
    '',
    honeyTipsBlock(),
    '',
    coachingPatternsBlock(),
    '',
    additionalReferencesBlock(),
    '',
    gmpPromptBlock(),
    '',
    '=== SESSION MODE ===',
    modeStyle,
    '',
    FEEDBACK_RULES,
    '',
    '=== GENERAL ===',
    '- 한 턴에 하나만 — 질문 1개 또는 짧은 코칭 블록 1개.',
    '- 절대 긴 문단 금지. 자연스러운 구어체 영어. Contractions everywhere.',
    '- 학습자가 한국어로 답하면 막힌 신호로 보고 부드럽게 영어로 복귀 유도.',
    `- 오늘 날짜: ${todayStr()}. 시험: 2026-05-30 (토) 14:20 · 대학로공인시험센터.`,
  ].filter((s) => s !== '').join('\n');
}

export function openingMessage(day) {
  const seed = day.seeds[Math.floor(Math.random() * day.seeds.length)];
  return seed;
}
