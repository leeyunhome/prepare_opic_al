// 오픽노잼 IM 시리즈 (개정판) — 핵심 룰/공식 레퍼런스.
// 출처: references/오픽노잼/* 책 이미지 94장 OCR 본문 (references/_extracted/오픽노잼_전체.md).
// 시스템 프롬프트와 UI 양쪽에서 단일 출처로 참조한다.

export const BOOK = {
  title: '오픽노잼 IM 시리즈 (개정판)',
  author: '새벽',
  scope: '추출 범위: 책 pp.013~221 (Part 1 스크립트·필러 → 부록 답변 시작 표현/꿀표현)',
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
  alt_order: 'MP 두 가지 방법: ① What → Feeling → Why  ② What → Why → Feeling. 두 가지 다 연습해보고 입에 잘 붙는 쪽을 골라라.',
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
      '"There are tons of / loads of / myriads of ___." ("so many" 대체)',
      '"___, ___, and ___... but there\'s one place that I like because ___." (controlled singular)',
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
    extras: 'Quick Comparison Strategy — 본론 중간에 "It\'s interesting because I never ___ before. But now, ___" 한 줄 끼우면 답변이 자연스럽게 길어진다.',
  },
  past_story: {
    name: '과거 경험 (Past Story)',
    time: '1분 30초',
    diff: '고급',
    structure: ['MP (가장 강렬한 클라이맥스 먼저)', '본론: 직접 화법(Direct Quotation Strategy)로 사연 풀어가기', '결론: 1~2문장 짧게 (we were able to make up in the end 류)'],
    key_phrases: [
      '"You know what? I have the perfect story to tell you."',
      '"Just the other day..."',
      '"And, my goodness, ___."',
      '"And she was like, \\"___!\\"" / "I was like, \\"OMG!\\"" / "I thought to myself, \\"Holy cow!\\""',
      '"It made my blood boil to the max!"',
      '"And, uh, what am I trying to say, we ended up ___."',
      '"And so, we were able to make up in the end."',
    ],
    pitfalls: [
      'X: 시간 순서대로 늘어놓기 (어느 날 카페에 갔는데… 음료 주문하고… 그러다 쏟았고…)',
      'GOOD: 클라이맥스 먼저 ("어떤 사람이 내 옷에 커피를 다 쏟아부었던 적이 있어요!")',
      '단순 said 대신 was like / I thought to myself 사용',
      'annoying 대신 obnoxious, angry 대신 blood boil to the max — 한 단계 업그레이드 표현',
    ],
    indirect_quotation: '간접 화법(Indirect Quotation) — AL을 노린다면: "And he was telling me how ___" / "And he told me that ___" / "And he was just telling me how amazing the concert was."',
  },
  comparison: {
    name: '비교 (Comparison)',
    time: '1분 30초',
    diff: '고급',
    structure: ['MP (현재 시제·반드시 현재로 시작) — What/Feeling/Why', '과거: 옛날엔 이랬다 (MP와 반대되는 감정으로)', '현재: 다시 MP 풀어 설명 (these days · now · it\'s a completely different story)', '결론: 1~2문장'],
    key_phrases: [
      '"What I really find interesting about ___ these days is that ___ is just so phenomenal."',
      '"You know, in the past, ___ didn\'t really ___ at all."',
      '"But wow, ___ these days is a completely different story."',
      '"That problem is completely solved."',
      '"I absolutely hate ___." / "It\'s not soft at all." (강조 부사 활용)',
      'IHU 14 non-time (A vs B 비교): "I love both for different reasons. I love A because ___. And I love B because ___."',
    ],
    pitfalls: [
      '중립적 비교 ("옛날엔 A, 지금은 B"로 끝) — 점수 안 나옴. 한쪽으로 감정 기울이기.',
      'MP를 과거 시제로 시작하기 — 반드시 현재로 시작.',
      'X: "Oh, I have many things to say. First, ___. Second, ___. Third, ___." 식의 나열 → 스크립트처럼 들림. GOOD: "Well, I think... first let me start with the similarities."',
    ],
    formula: '비교 답변 전략 = 묘사 답변 전략(MP/본론/결론) + 과거 경험 답변 전략(MP/본론/결론).',
  },
  roleplay: {
    name: '롤플레이 (Role-play) — RP11/12/13',
    time: '1분~1분 30초',
    diff: '고급',
    structure: [
      'RP11 (3~4 질문): STEP 1 대화 내용 설명 → STEP 2 첫째 질문+상대방 답+내 반응 → STEP 3 둘째 질문+답+반응 → STEP 4 셋째 질문+답+반응',
      'RP12 (2~3 대안 제시): STEP 1 상황 정리 → STEP 2 첫 제안 (상대방 답=NO) → STEP 3 둘째 제안 (상대방 답=YES)',
      'RP13: 과거 경험 카테고리로 답변 (MP What/Feeling/Why → 본론 직접 화법 → 결론)',
    ],
    key_phrases: [
      '"So, ___, I heard that you had your ___."',
      '"Like, what type of ___ was it?" / "Oh, really?" / "How many times do you ___?"',
      '"Wow, maybe I should come with you?"',
      '"What?! Seriously?!"',
      '"How about, uh, we tell her that I\'m not feeling well... Would that work for you?"',
      '"OK, thank you, let\'s go!"',
      '"I have no excuse not to come!"',
    ],
    reactions: ['"Are you serious?"', '"For real?"', '"Oh, man!"', '"That\'s interesting."', '"Whoa."', '"Huh?"', '"Heh."'],
    pitfalls: [
      '질문만 늘어놓기 — 반드시 상대방의 가상 답변 + 내 반응 + 추가 설명을 끼워라.',
      'RP12에서 첫 제안이 바로 YES로 끝나면 답변이 짧아진다 — 첫 제안은 NO로 만들고 둘째 제안을 진짜 제안으로.',
    ],
  },
};

// ★ 새로 추가: IHU 14, 15 (어려운 비교) 특화 룰
export const IHU = {
  name: 'IHU 14, 15 (I Hate You 14, 15) — 어려워진 비교 문제',
  what: '시험 14·15번에 자주 출제되는 비교/돌발 카테고리. 1분 30초 ~ 1분 50초 답변.',
  variants: [
    {
      key: 'IHU 14 (time)',
      desc: '시간 비교 — "5~10년 전 vs 지금" 류. 비교 카테고리 전략 그대로 (MP 현재 → 과거 → 현재 → 결론).',
      example_q: '"Homes have changed a lot over the years. How were they five to ten years ago and how are they now?"',
    },
    {
      key: 'IHU 14 (non-time)',
      desc: 'A vs B 비교 — 두 가지 대상 비교. General MP → A → B → 결론.',
      example_q: '"Pick two popular parks that you know of. Tell me about their similarities and differences."',
      tip: '익숙하지 않은 소재 절대 금지. A, B 둘 다 본인이 디테일로 풀 수 있는 걸로 골라라. 두 가지에서 멈춰 — 세 가지 이상 비교하면 실수 확률 폭증.',
    },
    {
      key: 'IHU 15',
      desc: '오랜 기간에 걸친 큰 변화 (가전제품, 라이프스타일 변천 등). 비교 카테고리로 풀되, 분류(전기 사용 O/X)를 활용.',
      example_q: '"How have home appliances changed our lives? How was life before the appliances different from life now?"',
    },
  ],
};

// ★ 새로 추가: 꿀팁 (CH 10)
export const HONEY_TIPS = [
  {
    title: '서베이 솔직하게 (꿀팁 1)',
    body: '서베이는 점수 안 들어간다. 점수 잘 받는다고 알려진 콤보 따라 찍지 말고, 본인이 진짜 자주 하는 활동만 골라라. 안 그러면 본 시험에서 그 주제 나왔을 때 할 말이 없어진다.',
  },
  {
    title: '자기소개 스킵 권장 (꿀팁 2)',
    body: '자기소개를 너무 유창하게 하면 채점관 기대치가 올라가서 뒤가 더 평가 절하된다. 게다가 스크립트 냄새도 자기소개에서 가장 잘 잡힌다. 그냥 스킵하는 게 안전선.',
  },
  {
    title: 'TMI 표현으로 답변 살리기 (꿀팁 3)',
    body: '친구끼리 쓰는 표현(살짝 가벼운 TMI류 — silent but deadly, let it rip, cut cheese, take a dump, turtlehead 등)을 답변에 한두 개 살짝 끼우면 채점관이 사람으로 본다. 단, 진짜 자기 일화 있을 때만 — 억지로 끼우지 마라.',
  },
];

// ★ 새로 추가: 답변 시작 표현 5가지 분류 (부록 p.218)
export const OPENERS = {
  '솔직하게 시작': [
    '"You know, personally, I think ___."',
    '"OK, well, to be brutally honest, I think ___."',
    '"OK, let me be completely honest with you ___."',
    '"I think, well, in my honest opinion ___."',
  ],
  '답변 바로 시작': [
    '"Alright, I can surely tell you that ___."',
    '"Let me tell you this ___."',
    '"Alright, here\'s the thing ___."',
    '"OK, let me start off with this ___."',
    '"Well, the thing is ___."',
    '"Alright, let me get straight to the point ___."',
    '"OK, let me talk about ___."',
    '"Yeah, I guess you can say ___."',
    '"Well, OK, I don\'t know about you but for me ___."',
    '"Interesting question. OK, so... um, there\'s a time when ___."',
  ],
  '자신감 있게': [
    '"Oh, I have the perfect story for this."',
    '"I can answer this so easily."',
  ],
  '어려운 질문이 나왔을 때': [
    '"It\'s quite a tough question."',
    '"That\'s tough."',
    '"I didn\'t expect such a hard question."',
    '"That\'s not an easy question."',
  ],
  '답변 중 생각이 안 날 때': [
    '"What am I saying..."',
    '"How can I describe this..."',
    '"How should I describe this..."',
  ],
};

// ★ 새로 추가: 주제별 어휘 (부록 p.219-220)
export const TOPIC_VOCAB = {
  '여름·더위': ['humid · sticky · muggy (후덥지근한)', 'hot · scorching hot · stupid hot · crazy hot · sweltering hot (더운)', 'sunscreen (자외선 차단제)', 'sunburn (햇볕에 심하게 탐)'],
  '겨울·추위': ['cold · freezing cold · blistering cold · crazy cold (추운)', 'snowman · ice · snow', 'wind chill (체감 온도)', 'windy (바람이 부는)'],
  '돈·재정': [
    '부유한: wealthy / rich / well-off / loaded',
    '가난한: poor / broke',
    '"I made a huge dent in my wallet." (지출이 컸다)',
    '"I\'m banking on it." / "He made bank." (돈 많이 벌었다)',
    '"I had to think it over and I finally decided to pull the trigger." (실행하다)',
  ],
};

// 책 본문에서 가져온 학생-피드백 패턴들.
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
  {
    when: '학생이 said / He said that 를 반복할 때 (과거 경험)',
    book_quote: 'said는 평이하다. 직접 화법은 was like, 간접 화법은 was telling me how / told me that.',
    rewrite: '"She was like, \\"Sam, make sure to separate everything!\\""',
  },
  {
    when: '학생이 비교 답변을 과거 시제로 시작할 때',
    book_quote: '비교 카테고리 MP는 무조건 현재 시제. 과거는 본론에서.',
    rewrite: '"What I really find interesting about ___ these days is that ___."',
  },
  {
    when: '학생이 가구 이야기에 "many furnitures" 라고 할 때',
    book_quote: 'furniture는 셀 수 없는 명사. many → much, 또는 a lot of.',
    rewrite: '"I have a lot of furniture." (대안: "a bunch of furniture")',
  },
  {
    when: '학생이 롤플레이에서 질문만 던지고 자신 반응이 없을 때',
    book_quote: 'RP는 진짜 대화처럼 — 상대방의 (가상) 답 + 내 짧은 반응 + 추가 설명 묶음으로 가라.',
    rewrite: '"Oh, hip hop dance? Really? I\'ve always wanted to learn hip hop dancing."',
  },
  {
    when: '학생이 답변 안에서 단어를 잘못 말했을 때 (예: Swiss vs Switzerland)',
    book_quote: '중간에 멈춰서 고치려 하지 마라. 자신감 있게 그대로 밀고 나가거나, 다음 문장에서 자연스럽게 정정.',
    rewrite: '"It\'s kind of like a country... uh, the countryside. 죄송, the countryside." 식으로 정정해도 OK.',
  },
];
