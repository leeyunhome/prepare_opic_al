// Thin Web Speech API wrappers — STT (recognition) + TTS (synthesis).
// STT only works in Chromium-based browsers reliably. TTS works everywhere
// modern, voice list depends on the OS.

// ---------- STT ----------
export class Recognizer {
  constructor({ lang = 'en-US', onPartial, onFinal, onError, onEnd } = {}) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      this.unsupported = true;
      return;
    }
    this.unsupported = false;
    this.rec = new Ctor();
    this.rec.lang = lang;
    this.rec.interimResults = true;
    this.rec.continuous = true;
    this.rec.maxAlternatives = 1;
    this.lang = lang;

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
    };
    this.rec.onerror = (e) => {
      this.active = false;
      onError?.(e.error || 'speech-error');
    };
    this.rec.onend = () => {
      this.active = false;
      onFinal?.(this.finalText.trim());
      onEnd?.();
    };
  }

  setLang(lang) {
    if (this.unsupported) return;
    this.lang = lang;
    this.rec.lang = lang;
  }

  start() {
    if (this.unsupported) throw new Error('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.');
    if (this.active) return;
    this.finalText = '';
    this.active = true;
    try {
      this.rec.start();
    } catch (e) {
      this.active = false;
      throw e;
    }
  }
  stop() {
    if (this.unsupported || !this.active) return;
    try { this.rec.stop(); } catch {}
  }
  abort() {
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
