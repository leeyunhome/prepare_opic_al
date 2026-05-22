// Good Morning Pops (KBS, 조정현) 2020년 6월 Screen English 에피소드 정제본.
// 영화 The Current War (Alfonso Gomez-Rejon, 2017, 베네딕트 컴버배치).
// 사용자가 이미 알고 있는 영화 — OPIc 책의 "Direct Quotation Strategy" 소재로 즉시 활용 가능.
//
// 출처 원본: references/_extracted/gmp_current_war.md
//   (18개 에피소드 전체 한국어 해설 + 핵심 표현)

export const GMP = {
  source: '굿모닝 팝스 (KBS, 조정현 진행)',
  period: '2020-06-01 ~ 2020-06-30 (Screen English 18 에피소드)',
  movie: {
    title: 'The Current War',
    director: 'Alfonso Gomez-Rejon (2017)',
    lead: 'Benedict Cumberbatch (as Thomas Edison)',
    characters: ['Edison (Cumberbatch)', 'Westinghouse (Michael Shannon)', 'Tesla (Nicholas Hoult)', 'J.P. Morgan', 'Mary (Edison\'s wife)', 'President Arthur'],
    arc: '에디슨 DC vs 웨스팅하우스 AC — 전류 전쟁. Edison이 윤리적 거절·아내의 죽음·전기의자 자문·최종 패배·재기까지.',
  },
};

// 18개 에피소드 정리. OPIc 답변에서 Direct Quotation에 쓰기 좋은 5~6편을 highlight=true 로 표시.
export const CURRENT_WAR_EPISODES = [
  {
    date: '2020-06-01',
    quote: "I'm grateful for the offer.",
    scene: '백악관에서 Arthur 대통령과 J.P. Morgan이 Edison에게 500만 달러 무기 제작 의뢰 — Edison이 정중히 거절.',
    speaker: 'Edison',
    dialogue: [
      "My men tell me you're turning down five million dollars.",
      "I'm grateful for the offer, Mr. President.",
      "But it's the type of science hereafter that I find objectionable.",
      "One device I shall never build is that which takes the life of another man.",
      "It's barbaric.",
    ],
    expressions: [
      { en: 'turning down', ko: '거절하다', usage: "I'm sorry, but I'm going to have to turn down your offer." },
      { en: 'grateful for', ko: '감사하게 생각하는', usage: "I'm grateful for the offer." },
      { en: 'objectionable', ko: '불쾌한', usage: "It's the type of science hereafter that I find objectionable." },
    ],
    highlight: true, // 윤리적 결정 — OPIc 답변에서 "기억에 남는 영화 장면" 류 답변에 즉시 사용 가능
  },
  {
    date: '2020-06-02',
    quote: "I'm gonna light it up.",
    scene: 'Edison이 대통령과 Morgan 앞에서 자신의 전기 발명 비전을 설명.',
    speaker: 'Edison',
    dialogue: ["I'm gonna light it up.", 'Per globe.', 'And wires.'],
    expressions: [
      { en: 'light it up', ko: '불을 밝히다', usage: "His invention will light up the world." },
      { en: 'per globe', ko: '전구마다', usage: "Per globe." },
      { en: 'wires', ko: '전선', usage: "And wires." },
    ],
  },
  {
    date: '2020-06-03',
    quote: "He looks for needles in haystacks.",
    scene: 'Westinghouse가 동료와 Edison의 비효율적 시행착오식 연구 방식을 평가.',
    speaker: 'Westinghouse',
    dialogue: [
      "He engineers his own reality, and he looks for needles in haystacks.",
      "But how does he know that there's a needle in the hay to begin with?",
      "He doesn't. Me neither do you.",
      "But he's so determined not to be the second person to find it.",
      "He'll go stalk by stalk.",
    ],
    expressions: [
      { en: 'engineers (v.)', ko: '꾀하다/조작하다', usage: "He engineers his own reality." },
      { en: 'needles in haystacks', ko: '건초더미 속 바늘', usage: "He looks for needles in haystacks." },
      { en: 'determined', ko: '단호한', usage: "He's so determined not to be the second person to find it." },
    ],
  },
  {
    date: '2020-06-04',
    quote: "Alternating current is far more efficient.",
    scene: 'Tesla가 Edison의 회사에 입사하며 AC가 DC보다 우월하다고 주장 — Edison이 월 100달러 제안.',
    speaker: 'Tesla',
    dialogue: [
      "Expanding to 12 cities, building direct current systems.",
      "Alternating current is far more efficient.",
      "Higher voltage, greater distance, less copper conductors.",
      "Lethal. And it's far too much power for a motor to handle.",
      "I'm going to start you on $100 a month.",
    ],
    expressions: [
      { en: 'alternating current', ko: '교류', usage: "Alternating current is far more efficient." },
      { en: 'far more efficient', ko: '훨씬 더 효율적인', usage: "AC is far more efficient than DC." },
      { en: 'lethal', ko: '치명적인', usage: "Lethal. And it's far too much power for a motor to handle." },
    ],
  },
  {
    date: '2020-06-08',
    quote: "It's something he can't control.",
    scene: 'Edison의 아내 Mary가 워커홀릭 남편에 대해 기자에게 솔직히 인터뷰.',
    speaker: 'Mary (아내)',
    dialogue: [
      "I've tried to find a way to stop his brain, but it just runs and runs.",
      "It's something he can't control.",
      "All I can do is bring him back to center.",
      "I've heard Mr. Edison call the worst husband in America on account of him sleeping in his lab on your wedding night.",
      "I've heard the story myself.",
    ],
    expressions: [
      { en: 'runs and runs', ko: '끊임없이 계속되다', usage: "It just runs and runs." },
      { en: "can't control", ko: '통제할 수 없다', usage: "It's something he can't control." },
      { en: 'the worst', ko: '최악의', usage: "The worst husband in America." },
    ],
    highlight: true, // 일/가족 균형 — OPIc 일·가족 비교 답변에서 인용 가능
  },
  {
    date: '2020-06-09',
    quote: "The court upheld his patent.",
    scene: '특허 소송에서 Edison이 또 패소하자 직원들 앞에서 격분하는 장면.',
    speaker: 'Edison',
    dialogue: [
      "How did he get the bulbs?",
      "What a roaring silence from the brightest minds of America.",
      "He's using Hiram's design. But Hiram stole from me.",
      "Sue him. We already did. The court upheld his patent.",
      "I'm talking about Westinghouse. Find an angle.",
    ],
    expressions: [
      { en: 'upheld his patent', ko: '특허를 인정했다', usage: "The court upheld his patent." },
      { en: 'find an angle', ko: '방법을 찾아라', usage: "Find an angle." },
      { en: 'see for yourself', ko: '직접 가서 보다', usage: "Take a trip to Barrington and see for yourself." },
    ],
  },
  {
    date: '2020-06-10',
    quote: "You are not thinking long term.",
    scene: 'Tesla가 Edison에게 AC 모터의 미래를 설명하며 장기적 사고를 권유.',
    speaker: 'Tesla',
    dialogue: [
      "You are not thinking long term.",
      "This technology is within your grasp.",
      "I can build you an efficient motor. Have you tried it? No.",
      "Look, in my head it is nearly completed.",
      "They claim to have their heads full of sonnets and symphonies but their only problem seems to be they can't quite write it down.",
    ],
    expressions: [
      { en: 'long term', ko: '장기간의', usage: "You are not thinking long term." },
      { en: 'within your grasp', ko: '손에 닿을 듯한', usage: "This technology is within your grasp." },
      { en: 'write it down', ko: '받아 적다', usage: "They can't quite write it down." },
    ],
  },
  {
    date: '2020-06-11',
    quote: "I don't have that luxury.",
    scene: 'Edison이 기자회견에서 Westinghouse의 기술 도용을 폭로하면서 자기 처지를 설명.',
    speaker: 'Edison',
    dialogue: [
      "You got vultures in every venture, but you just gotta keep them away.",
      "So, this is just how it works.",
      "Mapmakers include mistakes in their work to see if anyone else is copying them.",
      "I don't have that luxury.",
      "I can't invent streets to lead the world down. Otherwise, we all end up in the dark.",
    ],
    expressions: [
      { en: 'venture', ko: '모험/사업', usage: "You got vultures in every venture." },
      { en: 'keep them away', ko: '멀리하다', usage: "You just gotta keep them away." },
      { en: 'luxury', ko: '사치/여유', usage: "I don't have that luxury." },
    ],
    highlight: true, // "사치를 부릴 수 없다" — 회사·업무 상황 답변에서 활용
  },
  {
    date: '2020-06-15',
    quote: "We'll take on two-thirds of the risk.",
    scene: '투자자들이 Tesla에게 현금 대신 주식으로 받는 협상 — 위험 분담 제안.',
    speaker: '투자자',
    dialogue: [
      "Look, Mr. Tesla, if you need cash now, you should sell us your patents.",
      "And what would I receive? Stock.",
      "And later, if you succeed, you could sell it for a killing. That means a fortune.",
      "Yes, I know what an ATM is.",
      "We'll take on two-thirds of the risk.",
    ],
    expressions: [
      { en: 'patents', ko: '특허권', usage: "You should sell us your patents." },
      { en: 'fortune', ko: '거금/재산', usage: "You could sell it for a killing. That means a fortune." },
      { en: 'take on', ko: '떠맡다', usage: "We'll take on two-thirds of the risk." },
    ],
  },
  {
    date: '2020-06-16',
    quote: "Nature will take its course.",
    scene: '위독한 Mary를 진찰한 의사가 Edison에게 손쓸 수 없다고 통보 — Edison은 출장을 떠나야 하는 비극.',
    speaker: '의사',
    dialogue: [
      "She'll gradually lose her mobility.",
      "I'll build her an elevator.",
      "Mr. Edison, what your wife needs no man can build.",
      "What my wife needs according to you is a simple pair of spectacles.",
      "Nature will take its course.",
      "I have to leave for New York tonight.",
    ],
    expressions: [
      { en: 'mobility', ko: '이동성', usage: "She'll gradually lose her mobility." },
      { en: 'elevator', ko: '엘리베이터', usage: "I'll build her an elevator." },
      { en: 'take its course', ko: '순리대로 흘러가다', usage: "Nature will take its course." },
    ],
    highlight: true, // 감정이 강한 장면 — past story에서 영화처럼 인용 가능
  },
  {
    date: '2020-06-17',
    quote: "I'm so close.",
    scene: 'Tesla가 해고 통보를 받지만 발명을 완성하게 해달라고 호소.',
    speaker: 'Tesla',
    dialogue: [
      "Don't you realize you're being fired here? No.",
      "Please, let me work through what I have in my head.",
      "I will make you the greatest provider of electrical power in the world. Better than Edison.",
      "I'm so close, just a few months.",
      "You drop in here like you're from Neptune, like you got a great vision of the future no one understands but you.",
    ],
    expressions: [
      { en: 'being fired', ko: '해고되는', usage: "Don't you realize you're being fired here?" },
      { en: 'so close', ko: '거의 다 된', usage: "I'm so close, just a few months." },
      { en: 'a great vision of the future', ko: '미래에 대한 위대한 비전', usage: "You got a great vision of the future." },
    ],
  },
  {
    date: '2020-06-18',
    quote: "Let me clean up the mess.",
    scene: 'J.P. Morgan이 Westinghouse에게 회사 합병을 제안하며 사태 수습을 약속.',
    speaker: 'J.P. Morgan',
    dialogue: [
      "It's a shame. But I'm here to help.",
      "I know that you, uh, you wish Edison a quiet down.",
      "So let me combine your companies.",
      "Let me clean up the mess.",
      "You really think Westinghouse Electric is worth five million dollars?",
      "The value of something is the highest number someone else is wanting to pay.",
    ],
    expressions: [
      { en: 'combine', ko: '합치다', usage: "Let me combine your companies." },
      { en: 'clean up the mess', ko: '사태를 수습하다', usage: "Let me clean up the mess." },
      { en: 'worth', ko: '~의 가치가 있는', usage: "Westinghouse Electric is worth five million dollars?" },
    ],
  },
  {
    date: '2020-06-22',
    quote: "Time itself will mend Edison's mistakes.",
    scene: 'Westinghouse가 회사를 청산하려 하자 아내 Margaret이 단호하게 만류.',
    speaker: 'Westinghouse / Margaret (아내)',
    dialogue: [
      "I thought impossible wasn't a word in your vocabulary.",
      "I am dissolving Westinghouse Electric.",
      "The proceeds will go to preserve our other failing enterprises and time itself will mend Edison's mistakes.",
      "You are not a captain who changes his course with the sea.",
      "We are not on a course. We are drowning.",
    ],
    expressions: [
      { en: 'dissolving', ko: '청산하는/해체하는', usage: "I am dissolving Westinghouse Electric." },
      { en: 'mend', ko: '고치다/회복하다', usage: "Time itself will mend Edison's mistakes." },
      { en: 'on a course', ko: '궤도에 있는', usage: "We are not on a course. We are drowning." },
    ],
  },
  {
    date: '2020-06-23',
    quote: "My name must never be associated with this.",
    scene: 'Edison이 비밀리에 전기의자 사형 집행 자문에 응하며 이름 노출을 막아달라고 거래.',
    speaker: 'Edison',
    dialogue: [
      "My name must never be associated with this.",
      "I did not provide any consultation and you will advertise that Westinghouse is the best way to take a human life.",
      "You guarantee your assistance.",
      "You ask a question, I'll reply.",
      "Burn the correspondence. Absolutely.",
    ],
    expressions: [
      { en: 'be associated with', ko: '~와 관련되다', usage: "My name must never be associated with this." },
      { en: 'consultation', ko: '자문/상담', usage: "I did not provide any consultation." },
      { en: 'correspondence', ko: '서신', usage: "Burn the correspondence." },
    ],
  },
  {
    date: '2020-06-24',
    quote: "So, do we have a deal?",
    scene: 'Westinghouse가 Tesla의 호텔방을 직접 찾아 AC 특허 거래를 절박하게 협상.',
    speaker: 'Westinghouse',
    dialogue: [
      "If we cannot reach an agreement today, my company will die right here in your hotel room.",
      "But if it does perish, so might your dream of harnessing power from Niagara.",
      "So, do we have a deal?",
      "5,000. 1,000.",
      "I'll give you 2 dollars and 50 cents. Per horsepower.",
    ],
    expressions: [
      { en: 'reach an agreement', ko: '합의에 이르다', usage: "If we cannot reach an agreement today..." },
      { en: 'have a deal', ko: '거래가 성사되다', usage: "So, do we have a deal?" },
      { en: 'per horsepower', ko: '마력당', usage: "I'll give you 2 dollars and 50 cents per horsepower." },
    ],
  },
  {
    date: '2020-06-25',
    quote: "I wouldn't have had as much fun, would I?",
    scene: '전류 전쟁에서 패한 Edison이 회사에서 쫓겨난 후 자신의 수많은 발명 아이디어를 회상.',
    speaker: 'Edison',
    dialogue: [
      "I have books so full of ideas, it would take me more than 12 lifetimes to execute them all.",
      "I wouldn't have had as much fun, would I?",
    ],
    expressions: [
      { en: 'so full of ideas', ko: '아이디어가 넘쳐나는', usage: "I have books so full of ideas." },
      { en: 'execute', ko: '실행하다', usage: "It would take me more than 12 lifetimes to execute them all." },
      { en: "I wouldn't have ___, would I?", ko: '~지 않았겠지', usage: "I wouldn't have had as much fun, would I?" },
    ],
    highlight: true, // 회한의 회상 — 가장 인상 깊었던 영화 장면 답변 소재
  },
  {
    date: '2020-06-29',
    quote: "What was the feeling in that moment?",
    scene: '시카고 박람회에서 마주친 라이벌 Westinghouse가 Edison에게 첫 전구가 켜진 순간의 감정을 묻는다.',
    speaker: 'Westinghouse → Edison',
    dialogue: [
      "I only wondered what it felt like. What?",
      "The bulb. When you knew.",
      "What was the feeling in that moment?",
      "I can't tell you.",
      "I mean, impossible to describe the feeling because it was impossible.",
    ],
    expressions: [
      { en: 'wondered', ko: '궁금해했다', usage: "I only wondered what it felt like." },
      { en: 'in that moment', ko: '그 순간에', usage: "What was the feeling in that moment?" },
      { en: 'impossible to describe', ko: '말로 표현 못할', usage: "Impossible to describe the feeling because it was impossible." },
    ],
    highlight: true, // OPIc "감정 묘사" 답변에서 그대로 차용 가능
  },
  {
    date: '2020-06-30',
    quote: "I'm working on something new.",
    scene: '박람회에서 Edison이 Westinghouse에게 motion picture (영화) 라는 새 발명을 암시.',
    speaker: 'Edison',
    dialogue: [
      "I'm working on something now. Something so new that people will forget my name is ever associated with electricity.",
      "I wonder if you know what it is yet.",
      "You know I think the solution is to divide the cost of the fence.",
      "Or you could not build a fence at all. Your garden would be twice as big. Wouldn't it?",
      "Nothing else a pleasure.",
    ],
    expressions: [
      { en: 'working on', ko: '~에 착수하고 있다', usage: "I'm working on something now." },
      { en: 'associated with', ko: '~와 관련된', usage: "People will forget my name is ever associated with electricity." },
      { en: 'the solution', ko: '해결책', usage: "I think the solution is to divide the cost of the fence." },
    ],
  },
];

// 간단 헬퍼 — OPIc 답변에서 가장 즉시 활용 가능한 5~6 인용구만 추리기
export function highlightedEpisodes() {
  return CURRENT_WAR_EPISODES.filter((e) => e.highlight);
}

// 시스템 프롬프트에 주입할 짧은 블록 — Ava가 사용자가 The Current War를 안다는 걸 의식하도록.
export function gmpPromptBlock() {
  const hi = highlightedEpisodes();
  return [
    '=== USER\'S MOVIE TMI: The Current War (Edison vs Westinghouse) ===',
    '사용자는 굿모닝 팝스(2020년 6월)로 이 영화를 학습한 적이 있다. 다음 인용구는 사용자가 직접 인용할 수 있는 소재다.',
    '오픽 답변에서 사용자가 영화 얘기를 꺼내면, Direct Quotation Strategy로 다음 라인을 그대로 빌려 쓰도록 유도:',
    ...hi.map((e) => `  · "${e.quote}" — ${e.speaker}, scene: ${e.scene}`),
    '단, 다른 일상 TMI(신혼·통근·식단 등) 답변에서는 영화 인용을 강요하지 말 것. 사용자가 "영화/책" 토픽으로 갈 때만 자연스럽게 떠올려 주는 정도.',
  ].join('\n');
}
