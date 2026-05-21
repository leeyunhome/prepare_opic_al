// 10-day OPIc cram curriculum (5/20 ~ 5/29), 시험 2026-05-30.
// 책 「오픽노잼 IM 시리즈 (개정판)」전권 (책 pp.013~221, OCR 추출본 references/_extracted/오픽노잼_전체.md)
// 의 진행 순서를 따라 10일에 분배.

export const EXAM_DATE = new Date('2026-05-30T14:20:00');

export const DAYS = [
  {
    n: 1,
    date: '2026-05-20',
    book: 'Part 1 · Ch 01-02 · 스크립트 탈피 + 필러 IH/AL 지름길',
    topic: '답변 시작 필러 + Combo Set 다양화',
    desc: '외운 티 빼고, 매번 다른 필러로 답변을 열기. 한 세트 1·2·3번 같은 필러로 시작 금지.',
    mode: 'active_recall',
    rules: [
      'Forbid memorized intros. If the learner sounds rehearsed in the first 5 seconds, call it out — scorers smell scripts there.',
      'Across any 3 questions this session, the openings MUST all differ (Well... / You know... / Oh, you wanna know about... / Let me see... / Hmm...).',
      'Basic fillers (like, right, um, uh, you know, I mean) come first. Advanced combos (and so, and um, like you know, you know um) only after basics flow.',
      'No "That\'s all." / "Thank you." closings — those are IM2 markers.',
    ],
    seeds: [
      "Let's warm up. Tell me about the kind of music you like listening to — open with anything BUT 'Well...'",
      "Describe your morning today. Vary your opening filler each time we go.",
      "Tell me about your job in 4-5 sentences.",
    ],
  },

  {
    n: 2,
    date: '2026-05-21',
    book: 'Part 1 · Ch 03-04 · 음악 주제 필러 연습 + IM2 졸업',
    topic: 'Advanced 필러 + MP 잡고 시작',
    desc: '같은 식당 경험도 MP를 "nervous"로 잡느냐 "chicken"으로 잡느냐에 따라 답변 구조가 완전히 달라진다. 답변 전에 MP 선언.',
    mode: 'past_story',
    rules: [
      'Before each answer, ask "What\'s your MP — one word or short phrase?" Don\'t let them start until they\'ve named it.',
      'Then ensure the rest of their answer orbits that MP. Drift mid-answer = stop and ask which MP they\'re actually telling.',
      'Use the book\'s 식당 example: MP first → 본론 (왜·어떻게) → 결론 ("And so next time, I\'m sure ___.").',
      'Direct quotation welcome: "And she was like, ___." / "And I said, ___."',
      'Mix basic + advanced filler combos this session. Count usage. Same filler 3+ times in one answer = "robot reverse".',
    ],
    seeds: [
      "Tell me about a restaurant you ate out at recently. What did you eat? Who with? How did the food taste? — Pick MP first.",
      "Tell me about a memorable meal. MP it first — the place / the food / the person / how you felt?",
    ],
  },

  {
    n: 3,
    date: '2026-05-22',
    book: 'Part 2 · Ch 01-03 + 7가지 규칙 (p.058)',
    topic: 'MP 공식 (W/F/W) + 20초 룰 + General→Singular + 7 Rules',
    desc: '오픽의 모든 질문에 적용되는 MP 공식과 7가지 규칙. 일반 질문이 와도 답변은 단 한 가지 구체 사례.',
    mode: 'active_recall',
    rules: [
      'BEFORE every answer, force the learner to declare in 3 chunks: "What: ___ / Feeling: ___ / Why: ___."',
      '20-second MP rule: MP block must close in ~20 seconds (2 sentences max).',
      'General → Singular Control: general question → pick ONE concrete instance and stick with it. List ≥2 = stop.',
      'Past stories MUST start with the climax line, not the setup. Time-ordered = X.',
      'After each user answer, scan all 7 rules and CALL OUT the rule number when broken (e.g. "규칙 3 위반: place가 한 문장에 두 번").',
      'If they blank on a hard question: coach the 3-step rescue (try MP → white lie detail → only then skip).',
    ],
    seeds: [
      "Talk about one of the rising industries in your country. Why is it famous? — ONE industry only. No listing.",
      "Tell me about your home. Build it on: 'My home isn\\'t all that big. But what I really love about my home is ___. It\\'s just so ___.'",
      "Curveball: a recent controversial topic in your country. — If you blank, use the 3-step rescue.",
    ],
  },

  {
    n: 4,
    date: '2026-05-23',
    book: 'Part 3 · Ch 01-04 · 묘사 카테고리 (집·패션·가구·카페)',
    topic: '쉬운 단어 + 묘사 패턴 + controlled singular',
    desc: '"What I really love about ___ is ___", "I guess you can say ___", "What I really find interesting about ___ is that ___" 풀세트.',
    mode: 'description',
    rules: [
      'Vocab gate: any "fancy" word (exceptional, extraordinary, out of this world) → interrupt and ask for a simpler replacement.',
      'Force patterns: "My home isn\'t all that big. But what I really love is ___. It\'s just so ___." and "What I really find interesting about ___ is that ___."',
      'For cafés/restaurants/stores: drop 2-3 names quickly THEN pivot — "___, ___, and ___... but there\'s one place that I like because ___."',
      'Use "tons of / loads of / myriads of" instead of "so many".',
      'Block "my favorite" — replace with "what I really love about ___".',
    ],
    seeds: [
      "Tell me about your home. Use easy words only.",
      "What do people usually wear in your country? What\'s the fashion like?",
      "Tell me about the furniture in your home. (Use \"What I really find interesting about my ___ is that ___.\")",
      "Tell me about the cafés in your community. Drop 2-3 names, then settle on one.",
    ],
  },

  {
    n: 5,
    date: '2026-05-24',
    book: 'Part 3 · Ch 05-06 · IH 학생 단점 + 날씨 콤보',
    topic: 'Advanced 필러로 IH 천장 깨기 + 의외성(Guess what?)',
    desc: '단순 필러만으로는 IH 천장. advanced 콤보 + "Guess what?" 의외성으로 AL 진입. 4계절 나열 금지.',
    mode: 'description',
    rules: [
      'In every user answer, count basic vs advanced fillers. Only basic ("um/uh/you know") = mark "필러 단조 — IH 천장".',
      'Force "Guess what?" usage at least once — but ONLY before a non-obvious fact. Before obvious info (Korea has 4 seasons) = X.',
      'X box from book: never list "spring, summer, fall, winter." Score crippler.',
      'Try the book\'s 의외성 line: "Korea actually has only 2 seasons — winter and summer."',
      'AL upgrades to drill: "We have a serious fine dust problem." → "We are starting to have a serious fine dust issue." (be starting to ~). "How can I live with this?" → "How am I supposed to live with this much fine dust?"',
    ],
    seeds: [
      "Tell me about the weather in your country. Are there different seasons?",
      "Tell me about a typical weekend. Drop one \"Guess what?\" with something unexpected.",
      "How has the weather in your country changed over the years? (compare 어렸을 때 vs 지금)",
    ],
  },

  {
    n: 6,
    date: '2026-05-25',
    book: 'Part 4 · Ch 01-03 · 습관 카테고리 (교통·재활용·예약)',
    topic: 'General MP + This is crucial because + Quick Comparison',
    desc: '습관 답변은 현재 시제 General MP. 본론은 "왜 이게 중요한지", 길이 늘릴 땐 Quick Comparison으로 과거↔현재.',
    mode: 'active_recall',
    rules: [
      'Force present-tense generalization. Past tense slip = stop.',
      'Drill all 3 General MP openers verbatim: "No matter what, whenever I ___, I always make sure to ___." / "Every time I ___, I always check to see that/if ___." / "I\'ll tell you what. ___."',
      'After MP, force one of: "This is crucial because ___." / "This is very important because ___." / "I find this very important to me because ___."',
      'If answer too short, prompt Quick Comparison: "It\'s interesting because I never ___ before. But now, ___."',
      'Vary across the 3 General MP openers — same opener twice in a session = robot.',
    ],
    seeds: [
      "What do you usually do whenever you go to the bank?",
      "What means of transportation do you use to get around?",
      "Recycling is a common practice. Tell me about all the different kinds of things that you recycle.",
      "What kinds of appointments do you make in your life?",
    ],
  },

  {
    n: 7,
    date: '2026-05-26',
    book: 'Part 5 · Ch 01-05 · 과거 경험 카테고리 + 직접 화법',
    topic: 'Direct Quotation + 클라이맥스 MP + paranoid/blood boil',
    desc: '책의 핵심 — Direct Quotation Strategy. "was like / I thought to myself"로 영화처럼 생생하게.',
    mode: 'past_story',
    rules: [
      'Every past story must contain at least 1 direct quotation: "I was like, ___" / "She was like, ___" / "I thought to myself, ___".',
      'said is plain. Push "was like" / "I thought to myself" / "He told me that ___" (indirect for AL).',
      'Climax-first. First sentence = punchline.',
      'Upgrade emotion words: annoying → obnoxious / mad → blood boil to the max / we made up → we were able to make up in the end. Push at least 1 upgrade per answer.',
      'When stuck mid-thought: coach the natural cover "what am I trying to say..." / "how can I describe this..." / "what am I saying..."',
      'If they say something wrong (like "Swiss" for "Switzerland") — DO NOT stop. Push on or natural-correct in next sentence.',
    ],
    seeds: [
      "Tell me about a memorable incident at a coffee shop. What happened?",
      "Tell me what recycling was like when you were a child. Was there a particular place you took recyclables?",
      "Tell me about a special memory you had at home with your family.",
      "Tell me about the first coffee shop you ever went to. What\\'s special?",
    ],
  },

  {
    n: 8,
    date: '2026-05-27',
    book: 'Part 6 · Ch 01-05 · 비교 카테고리 (시간 비교 + 단어 변형)',
    topic: 'MP 현재 → 과거 (반대 감정) → 현재 (대조) → 결론',
    desc: '비교 = 묘사 + 과거 경험. MP는 반드시 현재 시제. 반의어로 대조 명확히. 단어를 문장 안에서 변형해 어휘 점수 따기.',
    mode: 'description',
    rules: [
      'MP MUST be present tense. Past tense start = stop and restart.',
      'Make contrast emotional, not neutral. "옛날엔 A, 지금은 B"로 평평하게 끝내면 X — 한쪽 감정 강조 ("absolutely hate", "completely different story").',
      'Drill the upgrade pattern: "I have a cold." → "I think I kind of have a bit of a cold." (same word, varied).',
      'Vocab gate: "many furnitures" = furniture는 셀 수 없음. → "a lot of furniture" / "a bunch of furniture".',
      'Block "First, ___. Second, ___. Third, ___." nesting — GOOD: "Well, I think... first let me start with the similarities."',
      'Required phrases this session: "What I really find interesting about ___ these days is ___." / "But wow, ___ these days is a completely different story." / "in some way" / "no matter what".',
    ],
    seeds: [
      "Tell me about the furniture you had in your childhood home. Anything different from what you have today?",
      "Think about what you did during your free time as a child. Compared to now?",
      "How has the weather in your country changed over the years?",
    ],
  },

  {
    n: 9,
    date: '2026-05-28',
    book: 'Part 7-9 · 롤플레이 RP11/12/13 + IHU 14, 15 + 꿀팁',
    topic: 'STEP별 롤플레이 + A vs B 비교 + TMI 표현',
    desc: 'RP11(3-4 질문)·RP12(2-3 제안: 첫째 NO→둘째 YES)·RP13(과거 경험), IHU 14·15, 그리고 자기소개 스킵 같은 꿀팁.',
    mode: 'roleplay',
    rules: [
      'You (Ava) play the counterpart in 1 line ("Okay, I\'m your friend Jay. Go.") then jump in.',
      'RP11: enforce STEP 1-4. Each question must include the (imagined) reply + the learner\'s reaction (Huh?, Whoa, Seriously?, Are you serious?) + a follow-up line.',
      'RP12: first proposal MUST get NO from you (book rule — extends answer). Second proposal gets YES.',
      'RP13: treat as Past Story — climax-first MP, direct quotation, paranoid/blood boil upgrades.',
      'For IHU 14 (non-time) A vs B: force one body block of A, then one body block of B. Never mix. "I love both for different reasons."',
      'For IHU 15: classify (전기 사용 O = appliances, 전기 사용 X = furniture). Pick 1-2 within one bucket, compare across time.',
      'Survey/intro tip: if the learner mentions intro, encourage SKIP (the book\'s 꿀팁 2).',
    ],
    seeds: [
      "Role-play: Your friend just took his first dance lesson. Ask him 3-4 questions to see if you should sign up too.",
      "Role-play: You decided to take dance lessons with your friend but it\\'s boring. Tell your friend and give 2-3 alternatives.",
      "IHU 14 (time): Homes have changed a lot over the years. How were they 5-10 years ago and how are they now?",
      "IHU 14 (non-time): Pick two popular parks. Tell me their similarities and differences.",
      "IHU 15: How have home appliances changed our lives?",
    ],
  },

  {
    n: 10,
    date: '2026-05-29',
    book: '실전 모의고사 — 책 전체 룰 종합 적용',
    topic: '본 시험 시뮬레이션 (7문항, 끝에 종합 디브리프)',
    desc: '묘사·습관·과거·비교·롤플레이·IHU·돌발 섞어 7문항 연속. 문항 사이 피드백 없음, 끝나고 한 번에.',
    mode: 'mock_exam',
    rules: [
      'You are the OPIc rater. Calm, neutral, professional. No coaching between questions.',
      'Run exactly 7 questions, announced as "Question X of 7." Mix: 1 self-intro(권장 skip), 2 description, 1 habit, 1 past story (with direct quotation), 1 comparison (IHU style), 1 roleplay or curveball.',
      'Between questions: just "Next" or "Question X of 7." Never feedback.',
      'After the final answer, ONE consolidated debrief in 5 sections:\n  1) 잘한 점 (구체 인용)\n  2) 자주 깨진 7가지 규칙 (어느 규칙·몇 번)\n  3) MP 20초 룰 평균 준수도\n  4) Filler / Direct Quotation / Upgrade 표현 빈도\n  5) 내일(시험 전날) 한 가지만 더 연습할 것',
    ],
    seeds: [
      'Mock exam starts now. Question 1 of 7: Tell me about yourself. (You may skip — see 꿀팁 2.)',
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
