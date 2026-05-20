// 오픽노잼 IM 시리즈 (개정판) — 핵심 룰/공식 레퍼런스.
// 출처: references/오픽노잼/* 31장 이미지에서 추출한 본문(references/_extracted/*.md).
// 시스템 프롬프트와 UI 양쪽에서 단일 출처로 참조한다.

export const BOOK = {
  title: '오픽노잼 IM 시리즈 (개정판)',
  author: '새벽',
  scope: '추출 범위: 책 pp.013~085 (Part 1 스크립트·필러 → Part 4 습관 카테고리 시작부)',
};

// 책 본문에서 그대로 정리한 "꼭 지켜야 할 7가지 규칙" (p.058)
export const SEVEN_RULES = [
  { n: 1, ko: 'Ava에게 진짜 질문하지 않기 — 답이 필요 없는 "수사적 질문"으로 답을 시작하기',
    examples: [
      '"Oh, so you wanna know about my place... alright, well..."',
      '"You know what I mean, right?"',
      '"You know what I\'m trying to say, right?"',
    ] },
  { n: 2, ko: '어려운 단어 쓰지 않기 — 자신 있게 쓸 수 있는 쉬운 단어 위주로',
    examples: [
      'X: "I live in a 4-story house."',
      'GOOD: "My home is really small."',
    ] },
  { n: 3, ko: '한 문장 안에서 같은 단어 반복 금지',
    examples: [
      'X: "This place very small place."',
      'GOOD: "It\'s a very small place."',
      'GOOD: "My place is small... very small." (강조용 분리는 OK)',
    ] },
  { n: 4, ko: '형용사 두 개를 and로 묶어서 한 줄에 욱여넣지 말기 — 두 문장으로 쪼개기',
    examples: [
      'X: "comfortable and cozy"',
      'GOOD: "My room is just so, you know, comfy. I mean, it\'s just so cozy!"',
    ] },
  { n: 5, ko: '한 가지 주제에 대해서만 끝까지 말하기 — 도중에 다른 주제로 새지 말기',
    examples: [
      'X: 집 묘사하다가 갑자기 졸업한 대학교 얘기로 빠지기',
      'GOOD: 집 안의 좋아하는 한 곳(예: 베란다)만 잡고 끝까지 디테일',
    ] },
  { n: 6, ko: '긴장돼서 할 말이 없을 때는 즉시 결론으로 점프',
    examples: [
      '"So overall, that\'s pretty much it."',
      '"That\'s why I love it. Yeah."',
    ] },
  { n: 7, ko: '내용이 도저히 안 떠오르면 그냥 스킵 — 단, 처음부터 도망가지 말고 일단 MP부터 던져보고',
    examples: [
      '먼저: MP 한 줄 시도 → 안 되면: 화이트 라이 → 그래도 안 되면: Next 버튼',
      '한 시험에서 스킵은 최대 2개까지가 안전선',
    ] },
];

export const MP_FORMULA = {
  name: 'MP = What + Feeling + Why',
  steps: [
    { tag: 'What?', ko: '내가 말하려는 것 (한 가지 주제로 좁히기)', en_example: '"the food industry"' },
    { tag: 'Feeling?', ko: '그것에 대한 내 감정/의견 한 줄', en_example: '"The food industry is all about convenience."' },
    { tag: 'Why?', ko: '왜 그렇게 느끼는지 한 줄', en_example: '"Because there are easy-to-use kiosks everywhere to order food."' },
  ],
  rule_20s: '시험에서 MP는 20초 안에 끝내라. MP가 길어지면 본론/결론이 무너진다.',
  general_to_singular: 'General → Singular Control 전략: 일반 질문이 와도 답변에서는 "단 한 가지 구체 사례"로 좁혀 끝까지 끌고 가라.',
};

export const FILLERS = {
  basic: ['like', 'right', 'um', 'uh', 'you know', 'I mean'],
  advanced_combos: ['and so', 'and um', 'like, um', 'like, you know', 'you know, like', 'you know, um'],
  guess_what: '"Guess what?" — 답변 도입에서 청자 호기심 유발. 단, 뻔한 정보(예: 4계절) 앞엔 쓰지 말기.',
  ttl_warning: '필러 남발 = 영어 실력 부족해 보임. 실력 부족하다면 오히려 줄여라.',
  opening_combo_rule: '한 세트(1·2·3번)에서 같은 필러로 시작하지 마라. 매번 다르게.',
  opening_examples: [
    '1번 질문: "Well..."',
    '2번 질문: "You know..."',
    '3번 질문: "Oh, you wanna know about..."',
  ],
};

export const CATEGORY_STRATEGY = {
  description: {
    name: '묘사 (Description)',
    time: '1분',
    diff: '중급',
    structure: ['MP (What → Feeling → Why)', '본론: MP 내용에 부연 설명', '결론: MP 내용을 1~2문장으로 짧게 마무리'],
    key_phrases: [
      '"You know, I gotta say, what I really love about ___ is ___."',
      '"What I really find interesting about ___ is that ___."',
      '"It\'s just so ___." (spacious/cozy/comfy)',
      '"I guess you can say ___." (결론 정리용)',
      '"It\'s like a ___." (직유법, 비유)',
    ],
    pitfalls: [
      '"Comfortable and cozy" 식으로 형용사 두 개를 and로 묶기',
      'shoebox / 4-story house 같은 불필요하게 구체적인 단어 무리해서 쓰기',
      'That\'s all. / Thank you. 식의 IM2-스러운 마무리',
    ],
  },
  habit: {
    name: '습관 (Habit)',
    time: '1분',
    diff: '중급',
    structure: ['General MP', '본론: This is crucial because~ / This is very important because~', '결론: 짧게 마무리'],
    key_phrases: [
      '"No matter what, whenever I ___, I always make sure to ___."',
      '"Every time I ___, I always check to see that/if ___."',
      '"I\'ll tell you what. ___."',
      '"This is crucial because ___."',
      '"This is very important because ___."',
      '"I find this very important to me because ___."',
    ],
    tense: '항상 현재 시제로.',
    extras: 'Quick Comparison Strategy — 본론 중간에 "But you know, in the past, I never did that before. But now, ___" 한 줄 끼우면 답변이 자연스럽게 길어진다.',
  },
  past_story: {
    name: '과거 경험 (Past Story)',
    time: '1분 30초',
    diff: '고급',
    structure: ['MP (가장 강렬한 클라이맥스 먼저)', '본론: 사연 풀어가기', '결론: 1~2문장 짧게'],
    key_phrases: [
      '"You know what?"',
      '"Just the other day..."',
      '"And then, my goodness, ___."',
      '"And she was like, \\"___\\""',
    ],
    pitfalls: [
      'X: 시간 순서대로 늘어놓기 (어느 날 카페에 갔는데… 음료 주문하고… 그러다 쏟았고…)',
      'GOOD: 클라이맥스 먼저 ("어떤 사람이 내 옷에 커피를 다 쏟아부었던 적이 있어요!")',
    ],
  },
  comparison: {
    name: '비교 (Comparison)',
    time: '1분 30초',
    diff: '고급',
    structure: ['MP (What → Feeling → Why)', '과거: 옛날엔 이랬다', '현재: 지금은 이렇다 (감정적 차이 강조)', '결론'],
    key_phrases: [
      '"You know, in the past, ___."',
      '"But now, ___."',
      '"That problem is completely solved."',
    ],
    pitfalls: ['중립적 비교 ("옛날엔 A였고 지금은 B예요"로 끝) — 점수 안 나옴. 한쪽으로 감정 기울이기.'],
  },
};

// 책 본문에서 가져온 학생-피드백 패턴들. AI가 사용자 답변을 교정할 때 그대로 인용해도 OK.
export const COACHING_PATTERNS = [
  {
    when: '학생이 형용사 두 개를 and로 묶었을 때',
    book_quote: '"comfortable and cozy"같이 and로 묶지 마라. 두 문장으로 나누면 깊이가 생긴다.',
    rewrite: '"My room is just so, you know, comfy. I mean, it\'s just so cozy!"',
  },
  {
    when: '학생이 시간 순서대로 과거 이야기를 시작할 때',
    book_quote: 'X: 시간 순서대로 이야기 / GOOD: 클라이맥스를 먼저 말하고 답변 시작',
    rewrite: '가장 강렬한 한 문장으로 시작 → 그 뒤에 사연 풀어가기',
  },
  {
    when: '학생이 "Ava, my home is..." 식으로 Ava에게 직접 말 걸 때',
    book_quote: '규칙 1: Ava에게 질문하지 말고 수사적 질문으로 도입',
    rewrite: '"Oh, you wanna know about my place? Alright, well..."',
  },
  {
    when: '학생이 답변을 "That\'s all." / "Thank you." 로 끝낼 때',
    book_quote: '이것은 IM2 학생들이 자주 쓰는 마무리다. 자연스럽지만 톤이 너무 어색하다.',
    rewrite: '"So yeah, that\'s pretty much it. I love it." 식으로 부드럽게 결론',
  },
  {
    when: '학생이 4계절을 spring/summer/fall/winter 식으로 나열할 때',
    book_quote: 'X: "Korea has 4 different seasons: spring, summer, fall, winter." / GOOD: "Korea has 4 different seasons." (이름은 누구나 안다)',
    rewrite: '의외성: "Guess what? Korea actually has only 2 seasons — winter and summer. Spring and fall are so short..."',
  },
  {
    when: '학생이 my favorite 표현을 자주 쓸 때',
    book_quote: '"my favorite" 대신 "what I really love about ___" / "what I really find interesting about ___"',
    rewrite: '"What I really love about my home is my balcony."',
  },
];
