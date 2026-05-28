// Thin Web Speech API wrappers — STT (recognition) + TTS (synthesis).
// STT: Chrome desktop + mobile Chrome. Firefox/Safari는 STT 미지원.

// ---------- STT ----------
// 모바일 Chrome STT 핵심 문제와 해결:
//   1) continuous=true여도 몇 초 무음이면 onend 발동 (모바일 버그)
//   2) continuous=false면 발화 한 번 후 자동 종료, 재시작 시 유저 제스처 필요
//   해결: continuous=true + onend에서 200ms 후 새 인스턴스로 자동 재개.
//         _wantRunning 플래그로 "세션 지속 의도"를 관리.

export class Recognizer {
  constructor({ lang = 'en-US', silenceMs = 1800, onPartial, onFinal, onError, onSessionEnd } = {}) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) { this.unsupported = true; return; }
    this.unsupported = false;
    this._Ctor = Ctor;
    this.lang = lang;
    this.silenceMs = silenceMs;

    this._onPartial = onPartial;
    this._onFinal = onFinal;
    this._onError = onError;
    this._onSessionEnd = onSessionEnd;

    this._silenceTimer = null;
    this._restartTimer = null;
    this.silenceTriggered = false;
    this._wantRunning = false;
    this.finalText = '';
    this.active = false;
    this._rec = null;
  }

  _makeRec() {
    const rec = new this._Ctor();
    rec.lang = this.lang;
    rec.interimResults = true;
    rec.continuous = true;       // continuous=true가 데스크톱에서 가장 안정적
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
      this._scheduleSilence();
    };

    rec.onerror = (e) => {
      const err = e.error || 'unknown';
      // 모바일에서 빈번한 무해한 에러 — 무시, 자동 재개에 맡김
      if (err === 'no-speech' || err === 'aborted' || err === 'network') return;
      // 진짜 에러 (not-allowed 등)
      this._kill();
      this._onError?.(err);
    };

    rec.onend = () => {
      // continuous=true여도 모바일 Chrome은 여기로 옴.
      // _wantRunning이면 세션을 이어가야 하므로 잠시 후 새 인스턴스로 재개.
      if (this._wantRunning && !this.silenceTriggered) {
        this._restartTimer = setTimeout(() => {
          if (!this._wantRunning) return;
          try {
            this._rec = this._makeRec();
            this._rec.start();
          } catch {
            this._endSession();
          }
        }, 200); // 모바일 안정화 딜레이
        return;
      }
      this._endSession();
    };

    return rec;
  }

  _endSession() {
    this.active = false;
    this._wantRunning = false;
    this._clearTimers();
    this._onFinal?.(this.finalText.trim());
    this._onSessionEnd?.();
  }

  _kill() {
    this._wantRunning = false;
    this.active = false;
    this._clearTimers();
    try { this._rec?.stop(); } catch {}
    this._rec = null;
  }

  _clearTimers() {
    if (this._silenceTimer) { clearTimeout(this._silenceTimer); this._silenceTimer = null; }
    if (this._restartTimer) { clearTimeout(this._restartTimer); this._restartTimer = null; }
  }

  _scheduleSilence() {
    if (!this.silenceMs) return;
    if (this._silenceTimer) clearTimeout(this._silenceTimer);
    this._silenceTimer = setTimeout(() => {
      if (this._wantRunning && this.finalText.trim().length > 0) {
        this.silenceTriggered = true;
        this._wantRunning = false;
        try { this._rec?.stop(); } catch {}
      }
    }, this.silenceMs);
  }

  setLang(lang) { this.lang = lang; }
  setSilenceMs(ms) { this.silenceMs = +ms || 0; }

  start() {
    if (this.unsupported) throw new Error('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.');
    if (this._wantRunning) return;

    this.finalText = '';
    this.silenceTriggered = false;
    this._clearTimers();
    this._wantRunning = true;
    this.active = true;

    this._rec = this._makeRec();
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
    this._clearTimers();
    if (this.unsupported || !this.active) return;
    try { this._rec?.stop(); } catch {}
    // onend가 발동되어 _endSession()으로 흘러감
  }

  abort() {
    this._kill();
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
