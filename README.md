# OPIc Sparring Partner — Ava

5/30 OPIc 정기평가를 위한 1:1 영어 스파링 파트너. 스크립트 암기가 아니라 "진짜 내 이야기"로 즉흥 발화 훈련하는 웹앱.

- **AI 엔진**: Google Gemini (BYOK — 본인 API 키 입력)
- **음성**: 브라우저 Web Speech API (STT + TTS)
- **호스팅**: GitHub Pages (정적 파일, 빌드 단계 없음)
- **저장**: localStorage (서버 없음 — API 키도 본인 브라우저에만)

## 빠른 시작

### 1) 로컬에서 실행

`file://` 경로로 열면 ES 모듈이 막히므로 정적 서버가 필요합니다. 폴더에서:

```powershell
python -m http.server 8080
# 또는
npx serve .
```

브라우저에서 http://localhost:8080 접속.

### 2) Gemini API 키 발급

1. https://aistudio.google.com/apikey 에서 키 생성
2. 앱 우측 상단 ⚙️ 설정 → API 키 붙여넣기 → 저장
3. 키는 본인 브라우저 localStorage에만 저장됩니다

### 3) GitHub Pages 배포

```powershell
git init
git add .
git commit -m "Initial OPIc sparring app"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

레포 Settings → Pages → Source = `main / (root)` 선택. 1~2분 후 `https://<user>.github.io/<repo>/` 접속.

## 구조

```
index.html          진입점, 모든 뷰 셸
css/styles.css      다크 테마 스타일
js/main.js          앱 컨트롤러, 뷰 전환, 이벤트 바인딩
js/gemini.js        Gemini REST API 래퍼 (BYOK)
js/speech.js        Web Speech API STT/TTS 래퍼
js/curriculum.js    10일 커리큘럼 (5/20~5/29) + 각 일자 코칭 룰
js/profile.js       사용자 TMI(소프트웨어 엔지니어, 신혼, 출퇴근, 식단 등)
js/prompts.js       시스템 프롬프트 빌더 (TMI + 일자 + 모드)
js/storage.js       localStorage 래퍼
```

## 훈련 모드

각 일자는 다음 세 흐름 중 하나로 진행:

1. **Active Recall 모드** — AI가 2~3개 키워드만 보여주고 사용자가 즉흥 발화
2. **Role-play 모드** — AI가 친구/직원 등 역할극을 먼저 시작
3. **Mock Exam 모드** — 9일차/10일차에서 무작위 OPIc 질문 7~10개 연속

매 답변 후 AI는 짧은 피드백을 줍니다:
- ✅ 잘한 점 (MP, 필러, 직접 화법, 감탄사)
- 🤖 로봇 톤 감지 (국어책 읽는 문장)
- 💡 오픽노잼 스타일 교정 한 줄

## 주의

- API 키는 클라이언트에 노출됩니다. 본인 키만 사용하세요(GitHub Pages는 백엔드가 없습니다).
- 음성 인식은 Chrome 권장. Firefox는 STT 미지원, Safari는 일부 제한.
- 마이크 권한 필요. HTTPS(또는 localhost)에서만 작동.
