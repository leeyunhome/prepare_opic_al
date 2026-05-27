// Thin Web Speech API wrappers — STT (recognition) + TTS (synthesis).
// STT: Chrome desktop + mobile. Firefox/Safari는 STT 미지원.

// ---------- STT ----------
// 모바일 Chrome은 continuous 모드가 불안정하다:
//   - 음성 없이 수 초 지나면 onend 즉시 발동
//   - "no-speech" onerror 후 onend 연쇄
// 해결: continuous=false로 두고, 발화가 끝날 때마다 내부 자동 재시작.
// silenceMs가 설정된 경우: 최종 텍스트가 있고 N ms 동안 추가 발화 없으면 세션 종료 + 자동 전송.

export class Recognizer {
  constructor({ lang = 'en-US', silenceMs = 1800, onPartial, onFinal, onError, onSessionEnd } = {}) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      this.unsupported = true;
      return;
    }
    this.unsupported = false;
    this.lang = lang;
    this.silenceMs = silenceMs;

    this._onPartial = onPartial;
    this._onFinal = onFinal;
    this._onError = onError;
    this._onSessionEnd = onSessionEnd; // 진짜 세션 끝 (수동 stop 또는 silence 감지)

    this._silenceTimer = null;
    this.silenceTriggered = false;
    this._wantRunning = false; // true면 계속 인식 세션을 유지하려는 상태
    this.finalText = '';
    this.active = false;

    this._rec = null;
  }

  _createRec() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Ctor();
    rec.lang = this.lang;
    rec.interimResults = true;
    rec.continuous = false;  // 핵심: false로 두고 수동 재시작
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          this.finalText += (this.finalText ? ' ' : '') + r[0].transcript.trim();
        } else {
          interim += r[0].transcript;
        }
      }
      const combined = (this.finalText + (interim ? ' ' + interim : '')).trim();
      this._onPartial?.(combined);
      this._scheduleSilenceCheck();
    };

    rec.onerror = (e) => {
      const err = e.error || 'speech-error';
      // "no-speech" / "aborted" / "network" 같은 무해한 에러 → 무시하고 재시작에 맡김
      if (err === 'no-speech' || err === 'aborted') return;
      // "not-allowed" = 마이크 권한 거부 → 진짜 에러
      this._wantRunning = false;
      this.active = false;
      this._clearSilenceTimer();
      this._onError?.(err);
    };

    rec.onend = () => {
      // continuous=false이므로 발화 한 세그먼트 끝나면 항상 onend가 옴.
      // _wantRunning이 true면 → 재시작 (사용자가 아직 말하는 중)
      if (this._wantRunning && !this.silenceTriggered) {
        try {
          rec.start();
          return;
        } catch {
          // 재시작 실패 — fall through to session end
        }
      }
      // 진짜 세션 종료
      this.active = false;
      this._wantRunning = false;
      this._clearSilenceTimer();
      this._onFinal?.(this.finalText.trim());
      this._onSessionEnd?.();
    };

    return rec;
  }

  setLang(lang) {
    if (this.unsupported) return;
    this.lang = lang;
  }

  setSilenceMs(ms) {
    this.silenceMs = +ms || 0;
  }

  _clearSilenceTimer() {
    if (this._silenceTimer) {
      clearTimeout(this._silenceTimer);
      this._silenceTimer = null;
    }
  }

  _scheduleSilenceCheck() {
    if (!this.silenceMs) return;
    this._clearSilenceTimer();
    this._silenceTimer = setTimeout(() => {
      if (this._wantRunning && this.finalText.trim().length > 0) {
        this.silenceTriggered = true;
        this._wantRunning = false;
        try { this._rec?.stop(); } catch {}
      }
    }, this.silenceMs);
  }

  start() {
    if (this.unsupported) throw new Error('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.');
    if (this._wantRunning) return;

    this.finalText = '';
    this.silenceTriggered = false;
    this._clearSilenceTimer();
    this._wantRunning = true;
    this.active = true;

    // 매번 새로 생성 — 모바일에서 이전 인스턴스 재사용 시 "already started" 에러 방지
    this._rec = this._createRec();
    try {
      this._rec.start();
    } catch (e) {
      this._wantRunning = false;
      this.active = false;
      throw e;
    }
  }

  stop() {
    this._wantRunning = false;
    this._clearSilenceTimer();
    if (this.unsupported || !this.active) return;
    try { this._rec?.stop(); } catch {}
  }

  abort() {
    this._wantRunning = false;
    this._clearSilenceTimer();
    if (this.unsupported) return;
    try { this._rec?.abort(); } catch {}
    this.active = false;
  }
}

// ---------- TTS ----------
export const tts = (() => {
  const synth = window.speechSynthesis;
  let voices = [];

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
    return voices;
  }
  if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  function listEnglishVoices() {
    return (voices.length ? voices : loadVoices()).filter((v) => /^en[-_]/i.test(v.lang));
  }

  function findVoice(uri) {
    if (!uri) return null;
    return (voices.length ? voices : loadVoices()).find((v) => v.voiceURI === uri) || null;
  }

  function speak(text, { voiceURI, rate = 1.0, pitch = 1.0 } = {}) {
    if (!synth || !text) return;
    cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = findVoice(voiceURI);
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = pitch;
    u.lang = v?.lang || 'en-US';
    synth.speak(u);
    return u;
  }

  function cancel() {
    try { synth?.cancel(); } catch {}
  }

  return { listEnglishVoices, loadVoices, speak, cancel };
})();

// Strip markdown / emoji-only feedback lines so TTS doesn't read "asterisk
// asterisk bold". Keep the human-readable bits.
export function ttsClean(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')       // code fences
    .replace(/`([^`]+)`/g, '$1')           // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/\[keywords:[^\]]*\]/gi, '')  // keyword hints
    .replace(/^\s*[-•]\s*/gm, '')          // bullets
    .replace(/\s+/g, ' ')
    .trim();
}
