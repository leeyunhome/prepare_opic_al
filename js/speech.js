// Thin Web Speech API wrappers — STT (recognition) + TTS (synthesis).
// 모바일 Chrome STT 핵심: 인스턴스를 한 번만 만들고 재사용해야 마이크 연결이 유지됨.

// ---------- STT ----------
export class Recognizer {
  constructor({ lang = 'en-US', silenceMs = 1800, onPartial, onFinal, onError, onSessionEnd } = {}) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) { this.unsupported = true; return; }
    this.unsupported = false;

    // ★ 핵심: 인스턴스를 여기서 딱 1번만 생성. 모바일에서 새로 만들면 마이크가 끊김.
    this.rec = new Ctor();
    this.rec.lang = lang;
    this.rec.interimResults = true;
    this.rec.continuous = true;
    this.rec.maxAlternatives = 1;
    this.lang = lang;

    this.silenceMs = silenceMs;
    this._silenceTimer = null;
    this.silenceTriggered = false;
    this._wantRunning = false;
    this.finalText = '';
    this.active = false;

    this.rec.onresult = (e) => {
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
      onPartial?.(combined);
      this._scheduleSilence();
    };

    this.rec.onerror = (e) => {
      const err = e.error || 'unknown';
      // 모바일에서 흔한 무해한 에러 — 무시, onend → auto-restart에 맡김
      if (err === 'no-speech' || err === 'aborted' || err === 'network') return;
      // 진짜 에러 (not-allowed 등)
      this._wantRunning = false;
      this.active = false;
      this._clearSilence();
      onError?.(err);
    };

    this.rec.onend = () => {
      // continuous=true여도 모바일 Chrome은 가끔 여기로 옴.
      // _wantRunning이면 같은 인스턴스로 재시작 시도.
      if (this._wantRunning && !this.silenceTriggered) {
        setTimeout(() => {
          if (!this._wantRunning) return;
          try {
            this.rec.start();
          } catch {
            // 재시작 실패 — 세션 종료
            this._endSession(onFinal, onSessionEnd);
          }
        }, 250);
        return;
      }
      this._endSession(onFinal, onSessionEnd);
    };
  }

  _endSession(onFinal, onSessionEnd) {
    this.active = false;
    this._wantRunning = false;
    this._clearSilence();
    onFinal?.(this.finalText.trim());
    onSessionEnd?.();
  }

  _clearSilence() {
    if (this._silenceTimer) { clearTimeout(this._silenceTimer); this._silenceTimer = null; }
  }

  _scheduleSilence() {
    if (!this.silenceMs) return;
    this._clearSilence();
    this._silenceTimer = setTimeout(() => {
      if (this._wantRunning && this.finalText.trim().length > 0) {
        this.silenceTriggered = true;
        this._wantRunning = false;
        try { this.rec.stop(); } catch {}
      }
    }, this.silenceMs);
  }

  setLang(lang) {
    this.lang = lang;
    if (this.rec) this.rec.lang = lang;
  }

  setSilenceMs(ms) { this.silenceMs = +ms || 0; }

  start() {
    if (this.unsupported) throw new Error('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.');
    if (this._wantRunning) return;
    this.finalText = '';
    this.silenceTriggered = false;
    this._clearSilence();
    this._wantRunning = true;
    this.active = true;
    this.rec.lang = this.lang;  // start 직전에 lang 갱신
    try {
      this.rec.start();
    } catch (e) {
      this._wantRunning = false;
      this.active = false;
      throw e;
    }
  }

  stop() {
    this._wantRunning = false;
    this._clearSilence();
    if (this.unsupported || !this.active) return;
    try { this.rec.stop(); } catch {}
  }

  abort() {
    this._wantRunning = false;
    this._clearSilence();
    if (this.unsupported) return;
    try { this.rec.abort(); } catch {}
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

  function hasKorean(str) { return /[\uAC00-\uD7AF\u3130-\u318F]/.test(str); }

  function findKoreanVoice() {
    const all = voices.length ? voices : loadVoices();
    return all.find((v) => /^ko[-_]/i.test(v.lang)) || null;
  }

  function speak(text, { voiceURI, rate = 1.0, pitch = 1.0 } = {}) {
    if (!synth || !text) return;
    cancel();

    if (hasKorean(text)) {
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const enVoice = findVoice(voiceURI);
      const koVoice = findKoreanVoice();
      for (const line of lines) {
        const u = new SpeechSynthesisUtterance(line);
        if (hasKorean(line) && koVoice) {
          u.voice = koVoice;
          u.lang = koVoice.lang;
        } else {
          if (enVoice) u.voice = enVoice;
          u.lang = enVoice?.lang || 'en-US';
        }
        u.rate = rate;
        u.pitch = pitch;
        synth.speak(u);
      }
      return;
    }

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

export function ttsClean(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[keywords:[^\]]*\]/gi, '')
    .replace(/^\s*[-•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}
