// 10-day OPIc cram curriculum (5/20 ~ 5/29), 시험 2026-05-30.
// 책 「오픽노잼 IM 시리즈 (개정판)」 의 챕터 진행 순서에 맞춰 일자를 배치.
// 각 일자는: 해당 책 챕터, 책에서 그대로 가져온 코칭 룰 배열, 책의 실제 예시 질문(seed) 사용.

export const EXAM_DATE = new Date('2026-05-30T14:20:00');

export const DAYS = [
  {
    n: 1,
    date: '2026-05-20',
    book: 'Part 1 · Ch 01 · 스크립트 냄새 나면 응시료 버리는 거다',
    topic: '스크립트 탈피 + 답변 시작 필러',
    desc: '외운 티 빼고, 매번 다른 필러로 답변을 열기. Combo Set 1번/2번/3번 같은 필러로 시작 금지.',
    mode: 'active_recall',
    rules: [
      'Forbid memorized intros. If the learner sounds rehearsed in the first 5 seconds, call it out — that\'s when scorers smell scripts.',
      'Force them to vary opening fillers across questions. Across any 3 questions in this session, the openings MUST all differ from each other (Well... / You know... / Oh, you wanna know about... / Let me see... / Hmm...).',
      'Coach in Korean briefly when needed: "이전 답변에서 Well로 시작했으니 이번엔 다른 걸로."',
      'No "That\'s all." / "Thank you." closings — those are IM2 markers.',
    ],
    seeds: [
      "Let's warm up. Tell me about the kind of music you like listening to — and try to start with something other than 'Well...'",
      "Quick one — describe your morning today. Open with 'Hmm... let me see...' if you want, but don't start the same way twice in this session.",
      "Tell me about your job in 4-5 sentences. Open with anything BUT 'Well...'",
    ],
  },

  {
    n: 2,
    date: '2026-05-21',
    book: 'Part 1 · Ch 02-03 · 필러 IH/AL로 가는 지름길 + 음악 주제 연습',
    topic: '기본 필러 + advanced 필러 콤보',
    desc: '기본 6개 (like, right, um, uh, you know, I mean)에 advanced 콤보(and so, and um, like you know, you know um) 얹기. 단, 남발 금지.',
    mode: 'active_recall',
    rules: [
      'Force the learner to use BOTH basic and advanced filler combos. Track them across the session.',
      'After each user answer, count the filler types they used. If they used the same filler 3+ times in one answer, mark it as "robot reverse" — too many fillers also = low score.',
      'If their English is rough, REDUCE fillers (book: 실력 부족하면 필러 줄여라). If their English flows, ADD advanced filler combos.',
      'Seed questions should be music-related (책 Ch 02-03이 음악 주제로 필러 가르침).',
    ],
    seeds: [
      "What type of music do you like listening to? Plus, tell me about some singers or composers you like.",
      "How did you first get interested in music? What kind of music did you listen to when you were young? How is that different from today?",
    ],
  },

  {
    n: 3,
    date: '2026-05-22',
    book: 'Part 1 · Ch 04 · IM2 받았다고 기뻐하지 마세요 (nervous vs 치킨 MP)',
    topic: '답변에서 MP 잡기 — 무엇을 MP로 할지 먼저 정하기',
    desc: '같은 식당 경험도 MP를 "nervous"로 잡느냐 "chicken"으로 잡느냐에 따라 답변 구조가 완전히 달라진다. 먼저 MP 결정, 그 다음 답변.',
    mode: 'past_story',
    rules: [
      'Before the learner answers, ASK them in one sentence: "What\'s your MP going to be — one word or short phrase?" Don\'t let them answer until they\'ve named it.',
      'Then ensure the rest of their answer orbits that MP. If they drift onto a different MP mid-answer, stop them and ask: "Wait — which MP are you actually telling me about?"',
      'Use the book\'s 식당 example template: MP first → 본론 (왜·어떻게) → 결론 ("And so next time, I\'m sure ___.").',
      'Direct quotes welcome inside the past story: "And she was like, ___." / "And I said, ___."',
    ],
    seeds: [
      "Tell me about a restaurant you ate out at recently. What kind of restaurant was it? What did you eat? Who did you go with? Did you like the food?",
      "Tell me about a memorable meal you had. Before you start — what's your MP? Pick one thing (the place / the food / the person / how you felt).",
    ],
  },

  {
    n: 4,
    date: '2026-05-23',
    book: 'Part 2 · Ch 01-02 · MP 마스터 + 4 카테고리 + 클라이맥스 먼저',
    topic: 'MP 공식 (What/Feeling/Why) + General → Singular Control',
    desc: '오픽의 모든 질문에 적용되는 MP 공식. 일반 질문이 와도 답변은 단 한 가지 구체 사례로 좁힌다.',
    mode: 'active_recall',
    rules: [
      'BEFORE every answer, force the learner to declare their MP in 3 chunks out loud (or in chat): "What: ___ / Feeling: ___ / Why: ___."',
      'Enforce 20-second MP rule: their MP block must close in ~20 seconds (2 sentences max). Then move to 본론.',
      'General → Singular Control: if the question is general ("rising industries in your country"), make them pick ONE and stick with it ("Let\'s talk about the food industry."). If they list multiple, stop them.',
      'Past stories today MUST start with the climax line, not the setup. "Time-ordered" stories = X box in the book.',
    ],
    seeds: [
      "Talk about one of the rising industries or companies in your country. Why is that industry or company famous, and what is special about it? — Pick ONE industry. Don't list.",
      "Tell me about your home. — Use the book's MP template: 'My home isn't all that big. But what I really love about my home is ___. It\'s just so ___.'",
      "Tell me about a time something unexpected happened at a café. Start with the WORST moment, not the day you went.",
    ],
  },

  {
    n: 5,
    date: '2026-05-24',
    book: 'Part 2 · Ch 03 + 7가지 규칙 (p.058)',
    topic: 'IM/IH를 벗어나는 룰 + 모든 답변의 7가지 룰',
    desc: '기억 안 나는 질문 처리법 (MP 시도 → 화이트라이 → 스킵), 그리고 모든 묘사 답변에 적용되는 7가지 규칙.',
    mode: 'description',
    rules: [
      'Throw in 1-2 hard/curveball questions per session. If they stall over 4 seconds, coach the 3-step rescue: (1) try MP anyway, (2) drop a "white lie" detail, (3) only then mention skip.',
      'Enforce the 7 rules verbatim from the book. After each user answer, scan for violations and call out which rule number was broken (e.g. "규칙 3 위반: 한 문장에 same place 두 번 반복").',
      'Especially watch rule 4 (formal: don\'t glue two adjectives with "and") and rule 5 (one topic only).',
      'When they nail a rule, name it: "Nice — 규칙 1 잘 지켰어, 수사적 질문으로 열었네."',
    ],
    seeds: [
      "I would like to know where you live. Describe your home. What does it look like? How many rooms does it have? Give me a description with lots of details.",
      "Curveball: Talk about a recent controversial topic in your country. — If you blank, use the 3-step rescue.",
    ],
  },

  {
    n: 6,
    date: '2026-05-25',
    book: 'Part 3 · Ch 01-02 · 묘사 카테고리 · 쉬운 단어 + 집 주제',
    topic: '집 묘사를 쉬운 단어로 + What I really love about ___ is ___',
    desc: '"4-story house" 같은 무리한 단어 금지. 쉬운 단어로 "what I really love about ___ is ___" 패턴.',
    mode: 'description',
    rules: [
      'Vocab gate: if the learner uses a "fancy" word (e.g. exceptional / extraordinary / out of this world), interrupt and ask for a simpler replacement.',
      'Force the patterns from p.060-063: "My home isn\'t all that big. But, you know, it\'s not all that small either. But what I really love about my home is ___. It\'s just so ___."',
      'Track the rule about NOT repeating the same word in one sentence (regla 3). Quote the offending phrase.',
      'Push direct usage of "What I really love about ___" instead of "my favorite is ___".',
    ],
    seeds: [
      "Tell me about your home. Use easy words only. Build it on: 'My home isn\\'t all that big. But what I really love is ___.'",
      "Describe one room in your home. Pick the room you actually love. Use simple words.",
    ],
  },

  {
    n: 7,
    date: '2026-05-26',
    book: 'Part 3 · Ch 03-04 · 묘사 · 패션·가구·카페 + controlled singular',
    topic: 'I guess you can say ___ / What I really find interesting about ___',
    desc: '패션·가구·카페 주제에 그대로 끼울 수 있는 패턴 + General → Singular Control 전략 실전 적용.',
    mode: 'description',
    rules: [
      'Drill these book phrases verbatim: "I guess you can say ___" (결론용), "What I really find interesting about ___ is that ___", "There are tons of / loads of / myriads of ___" (대신 "so many").',
      'Controlled singular: if the question is about cafés/restaurants/stores in their area, force them to mention 2-3 names quickly then pivot to ONE place: "___, ___, and ___... but there\'s one place that I like because it\'s like my home."',
      'Block them from listing too many adjectives or items. One subject, deep dive.',
    ],
    seeds: [
      "What do people usually wear in your country? What's the fashion like in your country?",
      "Tell me about the furniture in your home. (Use: 'What I really find interesting about my ___ is that ___.')",
      "You said you go to coffee shops. Tell me about the cafés in your community. (Drop 2-3 names, then settle on one.)",
    ],
  },

  {
    n: 8,
    date: '2026-05-27',
    book: 'Part 3 · Ch 05-06 · IH 학생 단점 + 날씨 콤보',
    topic: 'Advanced 필러 부족 진단 + 의외성(Guess what?)',
    desc: '단순한 필러만으로는 IH 천장. advanced 필러로 답변에 굴곡을 만들고, "Guess what?"으로 의외성 도입.',
    mode: 'description',
    rules: [
      'In every user answer, count both basic and advanced fillers. If they used ONLY basic ("um", "uh", "you know") with no combos, mark "필러 단조 — IH 천장" and suggest combos.',
      'Force "Guess what?" usage at least once per session — but ONLY in front of a non-obvious fact. If they use it before something obvious (like "Korea has 4 seasons"), call it out.',
      'X box from book: never list "spring, summer, fall, winter." Score crippler.',
      'Try the book\'s 의외성 line: "Korea actually has only 2 seasons — winter and summer."',
    ],
    seeds: [
      "Tell me about the weather in your country. Are there different seasons? What\\'s the weather like in each season?",
      "Tell me about a typical weekend in your country. — Drop one \"Guess what?\" with something unexpected.",
    ],
  },

  {
    n: 9,
    date: '2026-05-28',
    book: 'Part 4 · Ch 01-02 · 습관 카테고리',
    topic: 'No matter what, whenever I ~ + This is crucial because ~ + Quick Comparison',
    desc: '습관 질문은 일반화된 현재 시제 MP. 본론은 "이게 왜 중요한지", 길이 늘리고 싶을 땐 Quick Comparison으로 과거↔현재.',
    mode: 'active_recall',
    rules: [
      'Force present-tense generalization for habit questions. Past tense slip = stop.',
      'Drill all 3 General MP openers verbatim: "No matter what, whenever I ___, I always make sure to ___." / "Every time I ___, I always check to see that/if ___." / "I\'ll tell you what. ___."',
      'After MP, force one of 3 transitions for the body: "This is crucial because ___." / "This is very important because ___." / "I find this very important to me because ___."',
      'If their answer is too short, prompt Quick Comparison Strategy: "But you know, in the past, I never did that before. But now, ___."',
    ],
    seeds: [
      "What do you usually do whenever you go to the bank?",
      "Tell me about your morning routine on weekdays.",
      "Describe what you typically do when you go to a café.",
    ],
  },

  {
    n: 10,
    date: '2026-05-29',
    book: '실전 모의고사 — 책 전체 챕터의 룰 종합 적용',
    topic: '본 시험 시뮬레이션 (7문항, 피드백은 끝나고 한 번에)',
    desc: '묘사·습관·과거·비교·롤플레이·돌발 1개 섞어 7문항 연속. 시험관은 중립 톤, 문항 사이 피드백 없음.',
    mode: 'mock_exam',
    rules: [
      'You are the OPIc rater now. Calm, neutral, professional. No coaching between questions.',
      'Run exactly 7 questions, announced as "Question X of 7." Mix: 1 self-intro, 2 description, 1 habit, 1 past story, 1 comparison, 1 curveball.',
      'Between questions: just say "Next" or "Question X of 7." DO NOT give feedback.',
      'After the final answer, deliver ONE consolidated debrief in 4 sections:\n  1) 잘한 점 (구체 인용)\n  2) 자주 깨진 룰 — 7가지 중 어느 것\n  3) MP 평균 길이 (20초 룰 지켰는지)\n  4) 내일(시험 전날) 한 가지만 더 연습할 것',
    ],
    seeds: [
      'Mock exam starts now. This is your dress rehearsal. Question 1 of 7: Tell me about yourself.',
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
