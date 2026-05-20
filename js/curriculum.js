// 10-day OPIc cram curriculum for the exam on 2026-05-30.
// Each day has: date, topic, short description, the coaching rules the AI must
// enforce that day, the preferred training mode, and a few seed questions used
// when the AI starts the session.

export const EXAM_DATE = new Date('2026-05-30T14:20:00');

export const DAYS = [
  {
    n: 1,
    date: '2026-05-20',
    topic: '기본기 및 필러 장착',
    desc: '완벽한 문장 강박 버리기. MP 먼저, 공백은 필러(You know, Like, I mean, Uh)로.',
    mode: 'active_recall',
    rules: [
      'Coach the learner to start every answer with a Main Point (MP) — a feeling or opinion, not a fact list.',
      'Encourage natural fillers: "you know", "I mean", "like", "uh… what am I trying to say", "honestly".',
      'If the learner produces a textbook sentence, mark it as "robot tone" and rewrite shorter & more spoken.',
      'Keep answers under ~5 sentences. Quality of delivery > quantity.',
    ],
    seeds: [
      "Let's just warm up. Tell me one thing — really anything — that's been on your mind lately. Start with how you FEEL about it, not the facts.",
      "Quick one: describe your morning today. Don't list things. Tell me the vibe. Were you tired? Excited? Bored?",
    ],
  },
  {
    n: 2,
    date: '2026-05-21',
    topic: '묘사 훈련 (Description)',
    desc: '쉬운 단어로 집, 방, 가구, 동네 묘사. fancy 어휘 금지.',
    mode: 'description',
    rules: [
      'For description tasks, force simple vocabulary (Feynman style). Reject any "fancy" word and propose a simpler replacement.',
      'Push the "What-Feeling-Why" formula: WHAT it is → FEELING it gives me → WHY.',
      'When the learner lists items, interrupt and ask: "Which one matters most to YOU, and why?"',
    ],
    seeds: [
      "Describe your living room to me like I'm your friend visiting for the first time. Easy words only.",
      "What's your favorite spot in your home? Tell me where it is and what it FEELS like — not what's in it.",
    ],
  },
  {
    n: 3,
    date: '2026-05-22',
    topic: '습관 및 일상 (Habit & Routine)',
    desc: '평소 자주 하는 일에 구체적 TMI를 섞기. 단순하지만 진짜 같은 디테일.',
    mode: 'active_recall',
    rules: [
      'Demand specific TMI — names, times, brands, exact phrases. Generic = robot.',
      'Use present-tense routines and the "I usually / I always / sometimes" pattern.',
      'After each answer, surface one TMI the user gave and tell them to reuse it on the actual test.',
    ],
    seeds: [
      "Walk me through a typical Tuesday morning. I want exact times. Like 7:14 AM, not 'in the morning'.",
      "What do you eat for breakfast on weekdays? Be very specific — brand names, exact foods. Make it almost too detailed.",
    ],
  },
  {
    n: 4,
    date: '2026-05-23',
    topic: '과거 경험 (1) — 시제와 클라이맥스',
    desc: '과거형 정확하게. 시간 순서 NO, 클라이맥스부터.',
    mode: 'past_story',
    rules: [
      'Enforce correct past tense throughout. If the learner slips to present, flag it.',
      'Force CLIMAX-FIRST storytelling: the first sentence must be the punchline, not the setup.',
      'If they start with "First, I went to…" — stop them and ask for the ending instead.',
    ],
    seeds: [
      "Tell me about a trip that went WRONG. Start with the worst moment. Don't set the scene first.",
      "A time you laughed really hard recently? Just tell me the punchline first. We'll back up after.",
    ],
  },
  {
    n: 5,
    date: '2026-05-24',
    topic: '과거 경험 (2) — 직접 화법',
    desc: '에피소드 안에 직접 인용("…") 끼워넣기. 영화처럼 생생하게.',
    mode: 'past_story',
    rules: [
      'Every past story must contain at least one direct quotation ("So I said…", "She was like…").',
      'Encourage strong interjections at the climax: OMG, Wow, No way, What?!, Are you kidding?',
      'The "What-Feeling-Why" rule continues — feeling comes BEFORE the explanation.',
    ],
    seeds: [
      "Tell me a time someone surprised you. Use real quotes — what did they say? What did YOU say back?",
      "An argument with someone — keep it light, but I want the dialogue. Direct quotes.",
    ],
  },
  {
    n: 6,
    date: '2026-05-25',
    topic: '롤플레이 대비 (1) — 리액션 연기',
    desc: '큰 감탄사로 리액션. 친구/직원과 대화하듯 자신감.',
    mode: 'roleplay',
    rules: [
      'YOU (Ava) play a real character — friend, store clerk, hotel staff. State who you are and where in 1 line, then jump into the scene.',
      'Coach the learner to open every roleplay with a big reaction ("Hey!", "No way!", "Oh that\'s so cool!").',
      'If the learner just asks questions like a survey, stop and ask for a REACTION first.',
    ],
    seeds: [
      "Role-play: I'm your friend Jay. I just told you I'm moving to Busan next month. React first, THEN ask whatever.",
      "Role-play: I'm the gym front desk. You're signing up for a membership. Start with energy, not paperwork.",
    ],
  },
  {
    n: 7,
    date: '2026-05-26',
    topic: '롤플레이 대비 (2) — 본인 이야기 + 제안',
    desc: '질문만 늘어놓지 말고 내 얘기 섞고 마지막에 약속/제안.',
    mode: 'roleplay',
    rules: [
      'In roleplays, force the learner to slip in a personal story (3+ sentences of TMI) before the conversation ends.',
      'Every roleplay must end with a PROPOSAL or PLAN ("Let\'s grab coffee tomorrow", "I\'ll text you tonight").',
      'Three questions in a row = robot. Interrupt with: "Tell me YOUR story before you ask again."',
    ],
    seeds: [
      "Role-play: I'm an old coworker you bumped into at the subway. We haven't met in 2 years. Go.",
      "Role-play: I'm the airline customer service agent. You missed your flight. End the call with a clear next step.",
    ],
  },
  {
    n: 8,
    date: '2026-05-27',
    topic: '과거와 현재 비교',
    desc: '"옛날엔 이랬는데 지금은 진짜 대박" — 감정적 비교 위주.',
    mode: 'past_story',
    rules: [
      'Comparison answers must use the pattern: BACK THEN [past tense] vs. RIGHT NOW [present], with an emotional reaction in between.',
      'Avoid neutral comparisons. Push for "way better / way worse / honestly insane" judgments.',
      'Force the learner to pick ONE thing to compare deeply, not a list of three.',
    ],
    seeds: [
      "How is your hometown different now compared to when you were a kid? One specific thing. Make it emotional.",
      "Compare your job today vs. your first job. Strong feelings only — no neutral list.",
    ],
  },
  {
    n: 9,
    date: '2026-05-28',
    topic: '고난도 스킵 & 마인드 컨트롤',
    desc: '돌발 어려운 주제는 5초 안에 쿨하게 스킵. 침묵 절대 금지.',
    mode: 'mock_exam',
    rules: [
      'Throw HARD/curveball topics (social issues, abstract opinions). If the learner stalls, coach the 5-second skip.',
      'Teach the skip phrase: "Honestly, you know what, I don\'t really have much to say about this — let\'s move on."',
      'Silence > 4 seconds = automatic fail signal. Praise quick pivots and graceful skips.',
    ],
    seeds: [
      "Random hard one: what do you think about climate change policy in Korea? You have 5 seconds — answer or SKIP.",
      "Curveball: describe a controversial book you've read. If nothing comes — skip it like a pro.",
    ],
  },
  {
    n: 10,
    date: '2026-05-29',
    topic: '실전 모의고사 (Active Recall)',
    desc: '무작위 질문 7~10개 연속. 침묵 없이 즉흥적으로 받아치기.',
    mode: 'mock_exam',
    rules: [
      'Run as a real mock exam: announce question number out of total. Do NOT give feedback between questions — only at the end.',
      'Keep total to 7 questions, mixing self-intro, description, past story, roleplay, comparison, and one curveball.',
      'After the full set, deliver a single consolidated debrief: strengths, top 2 robot moments, top 2 things to repeat tomorrow.',
    ],
    seeds: [
      "Mock exam starts now. Question 1 of 7: Tell me about yourself. Begin whenever you're ready.",
    ],
  },
];

export const TODAY_STR = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

export function currentDay() {
  const idx = DAYS.findIndex((d) => d.date === TODAY_STR);
  if (idx >= 0) return DAYS[idx];
  // If before 5/20 → Day 1. If after 5/29 → Day 10 (final rehearsal).
  if (TODAY_STR < DAYS[0].date) return DAYS[0];
  return DAYS[DAYS.length - 1];
}

export function daysUntilExam() {
  const now = new Date();
  const ms = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function dayByNumber(n) {
  return DAYS.find((d) => d.n === n) || DAYS[0];
}
