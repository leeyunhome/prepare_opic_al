// User TMI (Too Much Information) profile. Defaults are pre-filled from the
// learner's prep notes so they can start a session immediately, then customize.
import * as storage from './storage.js';

export const DEFAULT_PROFILE = {
  name: 'Yunho',
  job: `소프트웨어 엔지니어. C/C++ 주력, Python과 JavaScript로 자동화 도구와 웹 기능을 작업.
사무실은 창가 자리, 보안용 네트워크 카메라가 있음. 은색 에스프레소 머신을 좋아함.
아이폰 필수 사용. 가끔 명령어 순서 헷갈려서 자동화 작업할 때 실수함.`,
  home: `올해 3월에 결혼한 신혼. 방 3개, 거실, 넓은 베란다. 가장 좋아하는 곳은 베란다.
선반 위에 웨딩/약혼 사진이 많이 놓여 있음. 집 근처에 작은 개천과 숲이 있음.
저녁 식사 후 아내와 개천을 따라 걷고, 주말엔 숲 산책을 자주 함.`,
  commute: `4호선 혜화역 → 5호선 동대문역사문화공원역 → 9호선 여의도역 → 증미역.
환승이 많아서 출근이 험난할 때가 있음. 엄마 백내장 수술 후 병원 모셔다드리고 출근한 적도 있음.
비 오는 날 퇴근길은 버스가 꽉 차고 우산에서 물 뚝뚝 떨어져서 정말 불편함.`,
  hobbies: `헬스장 — 프리웨이트, 스미스 머신, "torture machine"이라 부르는 기구 좋아함.
운동은 약 100분 정도. Netflix 일본 애니, 액션 영화 좋아함 (Action news 아니고 Action movies).
음악은 차분하고 슬로우한 무드의 곡을 선호.`,
  routine: `아침: MCT 오일+올리브 오일 커피, 그릭 요거트+블루베리, 발사믹 식초에 찍어먹는 호밀빵.
"저속노화 식단"을 유지 중. 앉아서 일하니까 뻐근할 때 목/팔 스트레칭.
퇴근 후 아내와 그날 있었던 일 얘기하며 주스나 커피 한 잔. 특별한 날엔 맥주.
모던한 카페에서 쿠키 먹는 걸 좋아함.`,
  stories: `영화/스토리 소스: '겨울왕국 (Frozen)', '커런트 워 (The Current War)', '엘라 벨라 빙고 (Ella Bella Bingo)'.
The Current War 깊이 학습 (굿모닝 팝스 2020년 6월). 인용해 쓸 수 있는 명대사:
  · Edison: "I'm grateful for the offer, Mr. President. One device I shall never build is that which takes the life of another man."
  · Mary (아내): "It's something he can't control." (워커홀릭 남편 묘사)
  · Edison: "I don't have that luxury."
  · 의사: "Nature will take its course." (Mary 와병)
  · Edison: "I wouldn't have had as much fun, would I?" (회사에서 쫓겨난 뒤)
  · Westinghouse: "What was the feeling in that moment?" (첫 전구가 켜진 순간)
여행: 일본 (절·신사 방문), 이탈리아 신혼여행 (Italo 비즈니스석, Rigatoni al Cinghiale, Chianti 와인).
이탈리아 응급 단어: Kit da cucito(반짇고리), Vescica(물집), Cerotto(반창고), Tabacchi.`,
  avoid: `textbook 톤, "Furthermore"·"Moreover" 같은 너무 격식체 부사절, 외운 듯한 긴 도입부.
"My hobby is ~ing" 같은 학교 작문 패턴. "There are many reasons why" 류.`,
};

export function loadProfile() {
  const saved = storage.get('profile');
  if (!saved) return { ...DEFAULT_PROFILE };
  return { ...DEFAULT_PROFILE, ...saved };
}

export function saveProfile(p) {
  storage.set('profile', p);
}

export function resetProfile() {
  storage.remove('profile');
  return { ...DEFAULT_PROFILE };
}

export function profileSummary(p) {
  return [
    `Name to call the learner: ${p.name || 'friend'}`,
    `Job/work: ${p.job}`,
    `Home/neighborhood: ${p.home}`,
    `Commute: ${p.commute}`,
    `Hobbies/media: ${p.hobbies}`,
    `Daily routine/food: ${p.routine}`,
    `Story sources: ${p.stories}`,
    `Robot-tone patterns to flag: ${p.avoid}`,
  ].join('\n');
}
