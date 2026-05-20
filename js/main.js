// Main app controller — wires the views, state, and the Gemini/Speech modules.
import * as storage from './storage.js';
import { DAYS, currentDay, dayByNumber, daysUntilExam } from './curriculum.js';
import { loadProfile, saveProfile, resetProfile, DEFAULT_PROFILE } from './profile.js';
import { buildSystemPrompt, openingMessage } from './prompts.js';
import { generate, testKey, GeminiError } from './gemini.js';
import { Recognizer, tts, ttsClean } from './speech.js';

// ---------- state ----------
const state = {
  apiKey: storage.get('api_key', ''),
  model: storage.get('model', 'gemini-2.0-flash'),
  profile: loadProfile(),
  selectedDayN: currentDay().n,
  mode: currentDay().mode,
  history: [],        // [{role: 'user'|'model', text}]
  ttsOn: storage.get('tts_on', true),
  sttLang: storage.get('stt_lang', 'en-US'),
  ttsVoiceURI: storage.get('tts_voice', ''),
  ttsRate: storage.get('tts_rate', 1.0),
  recognizing: false,
  busy: false,
  doneDays: storage.get('done_days', []), // array of completed day numbers
};

let recognizer = null;
let timerHandle = null;
let answerStart = 0;

// ---------- DOM refs ----------
const $ = (sel) => document.querySelector(sel);
const dom = {
  ddayLabel: $('#dday'),
  views: document.querySelectorAll('.view'),
  navbtns: document.querySelectorAll('.navbtn'),

  // dashboard
  heroDay: $('#hero-day'),
  heroTopic: $('#hero-topic'),
  heroDesc: $('#hero-desc'),
  startTodayBtn: $('#start-today-btn'),
  dayGrid: $('#day-grid'),

  // training
  trainTitle: $('#train-title'),
  trainRule: $('#train-rule'),
  trainMode: $('#train-mode'),
  trainResetBtn: $('#train-reset-btn'),
  chat: $('#chat'),
  hints: $('#hints'),
  micBtn: $('#mic-btn'),
  textInput: $('#text-input'),
  sendBtn: $('#send-btn'),
  ttsToggle: $('#tts-toggle'),
  status: $('#status'),
  timer: $('#timer'),

  // profile
  profileForm: $('#profile-form'),
  profileResetBtn: $('#profile-reset-btn'),

  // settings
  apiKeyInput: $('#api-key'),
  apiKeySaveBtn: $('#api-key-save'),
  apiKeyTestBtn: $('#api-key-test'),
  modelSelect: $('#model-select'),
  apiStatus: $('#api-status'),
  sttLangSelect: $('#stt-lang'),
  ttsVoiceSelect: $('#tts-voice'),
  ttsRate: $('#tts-rate'),
  ttsRateVal: $('#tts-rate-val'),
  ttsTestBtn: $('#tts-test'),
  exportBtn: $('#export-btn'),
  clearBtn: $('#clear-btn'),

  keyModal: $('#key-modal'),
  keyModalGo: $('#key-modal-go'),
};

// ---------- nav ----------
function showView(name) {
  dom.views.forEach((v) => v.classList.toggle('hidden', v.id !== `view-${name}`));
  dom.navbtns.forEach((b) => b.classList.toggle('active', b.dataset.view === name));
}

dom.navbtns.forEach((b) =>
  b.addEventListener('click', () => {
    const v = b.dataset.view;
    if (!v) return;
    if (v === 'training' && !state.apiKey) {
      showKeyModal();
      return;
    }
    if (v === 'training' && state.history.length === 0) startSession();
    showView(v);
  })
);

// ---------- dashboard ----------
function renderDashboard() {
  dom.ddayLabel.textContent = daysUntilExam();
  const today = currentDay();
  dom.heroDay.textContent = `Day ${today.n}`;
  dom.heroTopic.textContent = today.topic;
  dom.heroDesc.textContent = today.desc;

  dom.dayGrid.innerHTML = '';
  const todayStr = new Date().toISOString().slice(0, 10);
  for (const d of DAYS) {
    const card = document.createElement('div');
    card.className = 'day-card';
    if (d.date === todayStr) card.classList.add('today');
    if (d.date < todayStr) card.classList.add('past');
    if (state.doneDays.includes(d.n)) card.classList.add('done');
    card.innerHTML = `
      <div>
        <span class="day-num">DAY ${d.n}</span>
        <span class="day-date">${d.date.slice(5)}</span>
      </div>
      <div class="day-title">${escapeHTML(d.topic)} <span class="done-badge">✓ done</span></div>
      <div class="day-desc">${escapeHTML(d.desc)}</div>
    `;
    card.addEventListener('click', () => {
      state.selectedDayN = d.n;
      state.mode = d.mode;
      requireKeyThen(() => {
        startSession();
        showView('training');
      });
    });
    dom.dayGrid.appendChild(card);
  }
}

dom.startTodayBtn.addEventListener('click', () => {
  state.selectedDayN = currentDay().n;
  state.mode = currentDay().mode;
  requireKeyThen(() => {
    startSession();
    showView('training');
  });
});

// ---------- training session ----------
function startSession() {
  const day = dayByNumber(state.selectedDayN);
  state.mode = state.mode || day.mode;
  state.history = [];
  dom.trainTitle.textContent = `Day ${day.n} — ${day.topic}`;
  dom.trainRule.textContent = day.desc;
  dom.trainMode.value = state.mode;

  // Clear chat & seed with opening question from the curriculum.
  dom.chat.innerHTML = '';
  const seed = openingMessage(day);
  addMessage('ai', seed);
  state.history.push({ role: 'model', text: seed });
  if (state.ttsOn) tts.speak(ttsClean(seed), ttsOpts());
  updateHints(seed);
  resetTimer();
}

dom.trainResetBtn.addEventListener('click', startSession);

dom.trainMode.addEventListener('change', (e) => {
  state.mode = e.target.value;
  startSession();
});

async function sendUserMessage(text) {
  if (!text.trim() || state.busy) return;
  if (!state.apiKey) { showKeyModal(); return; }

  addMessage('user', text);
  state.history.push({ role: 'user', text });
  dom.textInput.value = '';
  autoResize(dom.textInput);
  setBusy(true);
  setStatus('thinking…');

  const thinkingNode = addMessage('thinking', 'Ava is thinking…');

  try {
    const day = dayByNumber(state.selectedDayN);
    const sys = buildSystemPrompt({ profile: state.profile, day, mode: state.mode });
    const { text: reply } = await generate({
      apiKey: state.apiKey,
      model: state.model,
      systemInstruction: sys,
      history: state.history,
    });

    thinkingNode.remove();
    addMessage('ai', reply);
    state.history.push({ role: 'model', text: reply });
    if (state.ttsOn) tts.speak(ttsClean(reply), ttsOpts());
    updateHints(reply);
    setStatus('');
    markDayProgressIfNeeded();
  } catch (err) {
    thinkingNode.remove();
    const msg = err instanceof GeminiError ? err.message : (err.message || String(err));
    addMessage('system', `⚠️ Error: ${msg}`);
    setStatus('Error: ' + msg, 'error');
  } finally {
    setBusy(false);
    resetTimer();
  }
}

function markDayProgressIfNeeded() {
  // After 4+ user turns in a session, count the day as "done".
  const userTurns = state.history.filter((m) => m.role === 'user').length;
  if (userTurns >= 4 && !state.doneDays.includes(state.selectedDayN)) {
    state.doneDays = [...state.doneDays, state.selectedDayN];
    storage.set('done_days', state.doneDays);
    renderDashboard();
  }
}

function updateHints(aiText) {
  // Look for a [keywords: ...] hint block emitted by Active Recall mode.
  const m = aiText.match(/\[keywords:([^\]]+)\]/i);
  if (!m) { dom.hints.innerHTML = ''; return; }
  const words = m[1].split(/[·•,]/).map((s) => s.trim()).filter(Boolean);
  dom.hints.innerHTML = '🔑 ' + words.map((w) => `<span class="chip">${escapeHTML(w)}</span>`).join('');
}

dom.sendBtn.addEventListener('click', () => sendUserMessage(dom.textInput.value));
dom.textInput.addEventListener('input', () => autoResize(dom.textInput));
dom.textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendUserMessage(dom.textInput.value);
  }
});
dom.ttsToggle.addEventListener('change', (e) => {
  state.ttsOn = e.target.checked;
  storage.set('tts_on', state.ttsOn);
  if (!state.ttsOn) tts.cancel();
});

// ---------- speech ----------
function ensureRecognizer() {
  if (recognizer) return recognizer;
  recognizer = new Recognizer({
    lang: state.sttLang,
    onPartial: (txt) => {
      dom.textInput.value = txt;
      autoResize(dom.textInput);
    },
    onFinal: (txt) => {
      dom.textInput.value = txt;
      autoResize(dom.textInput);
    },
    onError: (err) => {
      setStatus(`STT error: ${err}`, 'error');
      stopRecognizing();
    },
    onEnd: () => stopRecognizing(),
  });
  if (recognizer.unsupported) {
    setStatus('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용하세요.', 'error');
  }
  return recognizer;
}

function startRecognizing() {
  const rec = ensureRecognizer();
  if (rec.unsupported) return;
  tts.cancel();          // 듣는 동안 AI 목소리는 꺼둠
  rec.setLang(state.sttLang);
  try {
    rec.start();
    state.recognizing = true;
    dom.micBtn.classList.add('recording');
    dom.micBtn.textContent = '⏹';
    startTimer();
    setStatus('🎙️ 듣는 중… 마이크를 한 번 더 누르면 멈춰요.', 'ok');
  } catch (e) {
    setStatus('마이크를 시작할 수 없습니다: ' + e.message, 'error');
  }
}

function stopRecognizing() {
  if (recognizer) recognizer.stop();
  state.recognizing = false;
  dom.micBtn.classList.remove('recording');
  dom.micBtn.textContent = '🎤';
  stopTimer();
  setStatus('');
}

dom.micBtn.addEventListener('click', () => {
  if (state.recognizing) {
    stopRecognizing();
    if (dom.textInput.value.trim()) sendUserMessage(dom.textInput.value);
  } else {
    startRecognizing();
  }
});

// Space-to-talk when not typing
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat) return;
  if (document.activeElement === dom.textInput) return;
  const trainingVisible = !$('#view-training').classList.contains('hidden');
  if (!trainingVisible) return;
  e.preventDefault();
  if (state.recognizing) {
    stopRecognizing();
    if (dom.textInput.value.trim()) sendUserMessage(dom.textInput.value);
  } else {
    startRecognizing();
  }
});

// ---------- timer ----------
function startTimer() {
  answerStart = Date.now();
  stopTimer();
  timerHandle = setInterval(() => {
    const s = Math.floor((Date.now() - answerStart) / 1000);
    dom.timer.textContent = `${s}s`;
    if (s === 5) setStatus('⚠️ 5초 — 막혔으면 필러나 SKIP!', 'error');
  }, 250);
}
function stopTimer() {
  if (timerHandle) clearInterval(timerHandle);
  timerHandle = null;
}
function resetTimer() {
  stopTimer();
  dom.timer.textContent = '';
}

// ---------- profile ----------
function fillProfileForm() {
  for (const [k, v] of Object.entries(state.profile)) {
    const f = dom.profileForm.elements.namedItem(k);
    if (f) f.value = v || '';
  }
}
dom.profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(dom.profileForm);
  const p = { ...state.profile };
  for (const [k, v] of fd.entries()) p[k] = v;
  state.profile = p;
  saveProfile(p);
  flashStatus('프로필 저장됨', 'ok');
});
dom.profileResetBtn.addEventListener('click', () => {
  if (!confirm('기본값으로 초기화할까요? (현재 입력은 사라집니다)')) return;
  state.profile = resetProfile();
  fillProfileForm();
  flashStatus('프로필 초기화됨', 'ok');
});

// ---------- settings ----------
dom.apiKeyInput.value = state.apiKey || '';
dom.modelSelect.value = state.model;
dom.sttLangSelect.value = state.sttLang;
dom.ttsRate.value = state.ttsRate;
dom.ttsRateVal.textContent = (+state.ttsRate).toFixed(2);
dom.ttsToggle.checked = state.ttsOn;

dom.apiKeySaveBtn.addEventListener('click', () => {
  const v = dom.apiKeyInput.value.trim();
  state.apiKey = v;
  storage.set('api_key', v);
  setApiStatus(v ? '저장됨.' : '키 삭제됨.', v ? 'ok' : 'error');
});
dom.apiKeyTestBtn.addEventListener('click', async () => {
  const v = dom.apiKeyInput.value.trim();
  if (!v) { setApiStatus('키를 입력하세요.', 'error'); return; }
  setApiStatus('테스트 중…');
  try {
    const out = await testKey({ apiKey: v, model: dom.modelSelect.value });
    setApiStatus(`OK — 응답: "${out}"`, 'ok');
    state.apiKey = v;
    storage.set('api_key', v);
  } catch (err) {
    setApiStatus('실패: ' + (err.message || err), 'error');
  }
});
dom.modelSelect.addEventListener('change', () => {
  state.model = dom.modelSelect.value;
  storage.set('model', state.model);
});
dom.sttLangSelect.addEventListener('change', () => {
  state.sttLang = dom.sttLangSelect.value;
  storage.set('stt_lang', state.sttLang);
  if (recognizer) recognizer.setLang(state.sttLang);
});

function populateVoices() {
  const list = tts.listEnglishVoices();
  dom.ttsVoiceSelect.innerHTML = '';
  if (!list.length) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '(영어 음성 없음 — 시스템 기본 사용)';
    dom.ttsVoiceSelect.appendChild(opt);
    return;
  }
  for (const v of list) {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    if (state.ttsVoiceURI === v.voiceURI) opt.selected = true;
    dom.ttsVoiceSelect.appendChild(opt);
  }
  // pick a sensible default if none stored
  if (!state.ttsVoiceURI) {
    const pref = list.find((v) => /Google|Microsoft Aria|Natural/.test(v.name)) || list[0];
    if (pref) {
      state.ttsVoiceURI = pref.voiceURI;
      dom.ttsVoiceSelect.value = pref.voiceURI;
      storage.set('tts_voice', pref.voiceURI);
    }
  }
}
populateVoices();
window.speechSynthesis?.addEventListener?.('voiceschanged', populateVoices);

dom.ttsVoiceSelect.addEventListener('change', () => {
  state.ttsVoiceURI = dom.ttsVoiceSelect.value;
  storage.set('tts_voice', state.ttsVoiceURI);
});
dom.ttsRate.addEventListener('input', () => {
  state.ttsRate = +dom.ttsRate.value;
  dom.ttsRateVal.textContent = state.ttsRate.toFixed(2);
  storage.set('tts_rate', state.ttsRate);
});
dom.ttsTestBtn.addEventListener('click', () => {
  tts.speak("Hey, ready to spar? Let's go.", ttsOpts());
});

dom.exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(storage.exportAll(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ava-export-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 200);
});
dom.clearBtn.addEventListener('click', () => {
  if (!confirm('진짜로 모든 데이터를 지울까요? API 키, 프로필, 진행 상황 전부 삭제됩니다.')) return;
  storage.clearAll();
  location.reload();
});

dom.keyModalGo.addEventListener('click', () => {
  hideKeyModal();
  showView('settings');
});

// ---------- helpers ----------
function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (role === 'thinking') {
    div.textContent = text;
  } else {
    const isFeedback = role === 'ai' && /[✅🤖💡]/.test(text);
    if (isFeedback) div.classList.add('ai');
    div.textContent = text;
  }
  dom.chat.appendChild(div);
  dom.chat.scrollTop = dom.chat.scrollHeight;
  return div;
}

function ttsOpts() {
  return { voiceURI: state.ttsVoiceURI, rate: state.ttsRate };
}

function setBusy(v) {
  state.busy = v;
  dom.sendBtn.disabled = v;
  dom.micBtn.disabled = v;
}
function setStatus(msg, cls) {
  dom.status.textContent = msg || '';
  dom.status.className = 'status ' + (cls || 'muted');
}
function flashStatus(msg, cls) {
  setStatus(msg, cls);
  setTimeout(() => setStatus(''), 1800);
}
function setApiStatus(msg, cls) {
  dom.apiStatus.textContent = msg;
  dom.apiStatus.className = 'status ' + (cls || 'muted');
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}
function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function showKeyModal() { dom.keyModal.classList.remove('hidden'); }
function hideKeyModal() { dom.keyModal.classList.add('hidden'); }
function requireKeyThen(fn) {
  if (!state.apiKey) { showKeyModal(); return; }
  fn();
}

// ---------- boot ----------
fillProfileForm();
renderDashboard();
if (!state.apiKey) {
  // Friendly first-time experience: land on settings.
  showView('settings');
} else {
  showView('dashboard');
}
