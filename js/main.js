// Main app controller — wires the views, state, and the Gemini/Speech modules.
import * as storage from './storage.js';
import { DAYS, currentDay, dayByNumber, daysUntilExam } from './curriculum.js';
import { loadProfile, saveProfile, resetProfile, DEFAULT_PROFILE } from './profile.js';
import { buildSystemPrompt, openingMessage } from './prompts.js';
import { generate, testKey, GeminiError } from './gemini.js';
import { Recognizer, tts, ttsClean } from './speech.js';
import { BOOK, SEVEN_RULES, MP_FORMULA, FILLERS, CATEGORY_STRATEGY, COACHING_PATTERNS, IHU, HONEY_TIPS, OPENERS, TOPIC_VOCAB, ADDITIONAL_REFERENCES } from './bookRules.js';
import { GMP, CURRENT_WAR_EPISODES } from './gmpRules.js';

// ---------- state ----------
const state = {
  apiKey: storage.get('api_key', ''),
  model: storage.get('model', 'gemini-2.5-flash'),
  profile: loadProfile(),
  selectedDayN: currentDay().n,
  mode: currentDay().mode,
  history: [],        // [{role: 'user'|'model', text}]
  ttsOn: storage.get('tts_on', true),
  sttLang: storage.get('stt_lang', 'en-US'),
  ttsVoiceURI: storage.get('tts_voice', ''),
  ttsRate: storage.get('tts_rate', 1.0),
  autoSend: storage.get('auto_send', true),
  silenceMs: storage.get('silence_ms', 1800),
  recognizing: false,
  busy: false,
  doneDays: storage.get('done_days', []), // array of completed day numbers
  gdriveClientId: storage.get('gdrive_client_id', ''),
  gdriveApiKey: storage.get('gdrive_api_key', ''),
  gdriveAccessToken: '',
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
  heroBook: $('#hero-book'),
  heroDesc: $('#hero-desc'),
  startTodayBtn: $('#start-today-btn'),
  dayGrid: $('#day-grid'),

  // book
  bookMeta: $('#book-meta'),
  sevenRules: $('#seven-rules'),
  mpFormula: $('#mp-formula'),
  fillerBlock: $('#filler-block'),
  categoryBlock: $('#category-block'),
  ihuBlock: $('#ihu-block'),
  honeyTips: $('#honey-tips'),
  openersBlock: $('#openers-block'),
  vocabBlock: $('#vocab-block'),
  gmpMeta: $('#gmp-meta'),
  gmpEpisodes: $('#gmp-episodes'),
  coachingPatterns: $('#coaching-patterns'),
  additionalRefsBlock: $('#additional-refs-block'),

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
  autoSendToggle: $('#auto-send'),
  silenceMs: $('#silence-ms'),
  silenceMsVal: $('#silence-ms-val'),
  exportBtn: $('#export-btn'),
  clearBtn: $('#clear-btn'),

  keyModal: $('#key-modal'),
  keyModalGo: $('#key-modal-go'),
  dropzone: $('#dropzone'),
  fileUploader: $('#file-uploader'),
  googleDriveBtn: $('#google-drive-btn'),
  uploadedFilesContainer: $('#uploaded-files-container'),
  
  // Google drive credentials in settings
  gdriveClientId: $('#gdrive-client-id'),
  gdriveApiKey: $('#gdrive-api-key'),
  gdriveKeysSave: $('#gdrive-keys-save'),
  gdriveKeysClear: $('#gdrive-keys-clear'),
  gdriveStatus: $('#gdrive-status'),
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
  if (dom.heroBook) dom.heroBook.textContent = '📖 ' + today.book;
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
      <div class="day-book">${escapeHTML(d.book)}</div>
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

// ---------- book rules view ----------
function renderBookView() {
  if (!dom.bookMeta) return;
  dom.bookMeta.textContent = `${BOOK.title} · ${BOOK.author} — ${BOOK.scope}`;

  dom.sevenRules.innerHTML = SEVEN_RULES.map((r) => `
    <li>
      <div class="rule-head">규칙 ${r.n}. ${escapeHTML(r.ko)}</div>
      <ul class="rule-examples">
        ${r.examples.map((e) => `<li><code>${escapeHTML(e)}</code></li>`).join('')}
      </ul>
    </li>
  `).join('');

  dom.mpFormula.innerHTML = `
    <div class="mp-steps">
      ${MP_FORMULA.steps.map((s) => `
        <div class="mp-step">
          <span class="mp-tag">${escapeHTML(s.tag)}</span>
          <div class="mp-ko">${escapeHTML(s.ko)}</div>
          <div class="mp-en"><code>${escapeHTML(s.en_example)}</code></div>
        </div>
      `).join('')}
    </div>
    <p><b>20초 룰:</b> ${escapeHTML(MP_FORMULA.rule_20s)}</p>
    <p>${escapeHTML(MP_FORMULA.general_to_singular)}</p>
  `;

  dom.fillerBlock.innerHTML = `
    <p><b>기본 필러:</b> ${FILLERS.basic.map((f) => `<code>${escapeHTML(f)}</code>`).join(' · ')}</p>
    <p><b>Advanced 콤보:</b> ${FILLERS.advanced_combos.map((f) => `<code>${escapeHTML(f)}</code>`).join(' / ')}</p>
    <p>${escapeHTML(FILLERS.guess_what)}</p>
    <p class="muted">${escapeHTML(FILLERS.opening_combo_rule)}</p>
    <ul class="rule-examples">${FILLERS.opening_examples.map((e) => `<li><code>${escapeHTML(e)}</code></li>`).join('')}</ul>
    <p class="muted">⚠ ${escapeHTML(FILLERS.ttl_warning)}</p>
  `;

  dom.categoryBlock.innerHTML = Object.values(CATEGORY_STRATEGY).map((c) => `
    <div class="cat">
      <div class="cat-head">${escapeHTML(c.name)} <span class="muted">· ${escapeHTML(c.time)} · ${escapeHTML(c.diff)}</span></div>
      <div><b>구조:</b> ${c.structure.map(escapeHTML).join(' → ')}</div>
      <div><b>핵심 패턴:</b></div>
      <ul class="rule-examples">${c.key_phrases.map((p) => `<li><code>${escapeHTML(p)}</code></li>`).join('')}</ul>
      ${c.tense ? `<div><b>시제:</b> ${escapeHTML(c.tense)}</div>` : ''}
      ${c.extras ? `<div><b>Extras:</b> ${escapeHTML(c.extras)}</div>` : ''}
      ${c.pitfalls ? `<div><b>함정:</b><ul>${c.pitfalls.map((p) => `<li>${escapeHTML(p)}</li>`).join('')}</ul></div>` : ''}
    </div>
  `).join('');

  dom.coachingPatterns.innerHTML = COACHING_PATTERNS.map((p) => `
    <li>
      <div class="rule-head">${escapeHTML(p.when)}</div>
      <div class="muted">📖 ${escapeHTML(p.book_quote)}</div>
      <div>💡 <code>${escapeHTML(p.rewrite)}</code></div>
    </li>
  `).join('');

  if (dom.additionalRefsBlock) {
    const { lee_chul_middle_school: lee, ban_gpt_chat: ban } = ADDITIONAL_REFERENCES;
    dom.additionalRefsBlock.innerHTML = `
      <div class="ref-sub-section" style="margin-bottom: 10px;">
        <div class="ref-sub-title" style="font-weight: bold; font-size: 15px; color: var(--primary);">📘 ${escapeHTML(lee.book_title)}</div>
        <p class="muted" style="margin:4px 0 10px; font-size: 13px;">${escapeHTML(lee.purpose)}</p>
        <ul class="rule-list">
          ${lee.patterns.map(p => `
            <li style="margin-bottom: 12px; list-style: none;">
              <div class="rule-head" style="font-weight: 600;"><code>${escapeHTML(p.pattern)}</code> — ${escapeHTML(p.ko)}</div>
              <div class="muted" style="font-size: 12px;">🎯 용도: ${escapeHTML(p.opic_usage)}</div>
              <div style="font-size: 13px;">💡 예: <code>${escapeHTML(p.example)}</code></div>
            </li>
          `).join('')}
        </ul>
      </div>
      <hr style="border:0;border-top:1px dashed var(--line);margin:16px 0" />
      <div class="ref-sub-section">
        <div class="ref-sub-title" style="font-weight: bold; font-size: 15px; color: var(--primary);">📙 ${escapeHTML(ban.book_title)}</div>
        <p class="muted" style="margin:4px 0 10px; font-size: 13px;">${escapeHTML(ban.purpose)}</p>
        <ul class="rule-list">
          ${ban.patterns.map(p => `
            <li style="margin-bottom: 12px; list-style: none;">
              <div class="rule-head" style="font-weight: 600;"><code>${escapeHTML(p.pattern)}</code> — ${escapeHTML(p.ko)}</div>
              <div class="muted" style="font-size: 12px;">🎯 용도: ${escapeHTML(p.opic_usage)}</div>
              <div style="font-size: 13px;">💡 예: <code>${escapeHTML(p.example)}</code></div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  dom.ihuBlock.innerHTML = `
    <p class="muted">${escapeHTML(IHU.what)}</p>
    ${IHU.variants.map((v) => `
      <div class="cat">
        <div class="cat-head">${escapeHTML(v.key)}</div>
        <div>${escapeHTML(v.desc)}</div>
        <div class="muted" style="margin-top:6px">예시 Q: <code>${escapeHTML(v.example_q)}</code></div>
        ${v.tip ? `<div class="muted" style="margin-top:4px">💡 ${escapeHTML(v.tip)}</div>` : ''}
      </div>
    `).join('')}
  `;

  dom.honeyTips.innerHTML = HONEY_TIPS.map((t) => `
    <div class="cat">
      <div class="cat-head">${escapeHTML(t.title)}</div>
      <div>${escapeHTML(t.body)}</div>
    </div>
  `).join('');

  dom.openersBlock.innerHTML = Object.entries(OPENERS).map(([k, items]) => `
    <div class="cat">
      <div class="cat-head">${escapeHTML(k)}</div>
      <ul class="rule-examples">${items.map((p) => `<li><code>${escapeHTML(p)}</code></li>`).join('')}</ul>
    </div>
  `).join('');

  dom.vocabBlock.innerHTML = Object.entries(TOPIC_VOCAB).map(([k, items]) => `
    <div class="cat">
      <div class="cat-head">${escapeHTML(k)}</div>
      <ul class="rule-examples">${items.map((p) => `<li>${escapeHTML(p)}</li>`).join('')}</ul>
    </div>
  `).join('');

  if (dom.gmpMeta) {
    dom.gmpMeta.textContent = `${GMP.source} · ${GMP.period} · ${GMP.movie.title} (${GMP.movie.director})`;
    dom.gmpEpisodes.innerHTML = CURRENT_WAR_EPISODES.map((ep) => `
      <div class="cat${ep.highlight ? ' gmp-highlight' : ''}">
        <div class="cat-head">
          ${escapeHTML(ep.date)} ·
          <span class="gmp-quote">"${escapeHTML(ep.quote)}"</span>
          ${ep.highlight ? '<span class="gmp-star" title="OPIc 답변에 즉시 활용 가능">★</span>' : ''}
        </div>
        <div class="muted" style="margin:4px 0 6px">🎬 ${escapeHTML(ep.scene)} <span class="muted">— ${escapeHTML(ep.speaker)}</span></div>
        <div><b>대사:</b></div>
        <ul class="rule-examples">${ep.dialogue.map((d) => `<li><code>${escapeHTML(d)}</code></li>`).join('')}</ul>
        <div style="margin-top:6px"><b>표현:</b></div>
        <ul class="rule-examples">${ep.expressions.map((x) =>
          `<li><code>${escapeHTML(x.en)}</code> — ${escapeHTML(x.ko)}<br><span class="muted">예: ${escapeHTML(x.usage)}</span></li>`
        ).join('')}</ul>
      </div>
    `).join('');
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
    silenceMs: state.autoSend ? state.silenceMs : 0,
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
    onEnd: () => {
      // 자동(무음) 종료인지 수동 종료인지 구분.
      const auto = recognizer?.silenceTriggered;
      if (recognizer) recognizer.silenceTriggered = false;
      stopRecognizing();
      // 자동 종료였고 텍스트가 있으면 바로 전송.
      if (auto && state.autoSend && dom.textInput.value.trim()) {
        sendUserMessage(dom.textInput.value);
      }
    },
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
  rec.setSilenceMs(state.autoSend ? state.silenceMs : 0);
  try {
    rec.start();
    state.recognizing = true;
    dom.micBtn.classList.add('recording');
    dom.micBtn.textContent = '⏹';
    startTimer();
    const hint = state.autoSend
      ? `🎙️ 듣는 중… ${(state.silenceMs / 1000).toFixed(1)}초 무음 시 자동 전송.`
      : '🎙️ 듣는 중… 마이크를 한 번 더 누르면 전송.';
    setStatus(hint, 'ok');
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

// ---------- custom reference uploader ----------
function renderCustomRefMaterial() {
  const list = storage.get('custom_ref_materials', []);
  dom.uploadedFilesContainer.innerHTML = '';
  
  if (!list || !list.length) {
    dom.uploadedFilesContainer.innerHTML = `
      <p class="muted" style="text-align: center; font-size: 12px; margin: 10px 0;">현재 연동된 학습 자료가 없습니다.</p>
    `;
    return;
  }
  
  list.forEach((mat, index) => {
    const card = document.createElement('div');
    card.style.cssText = 'padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--line); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;';
    const kb = (mat.size / 1024).toFixed(1);
    
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 80%;">
        <span style="font-size: 18px;">📄</span>
        <div style="overflow: hidden; text-overflow: ellipsis;">
          <div style="font-weight: 600; font-size: 13px; text-align: left; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(mat.name)}">${escapeHTML(mat.name)}</div>
          <div class="muted" style="font-size: 11px; text-align: left;">${kb} KB · ${mat.text.length.toLocaleString()}자 연동됨</div>
        </div>
      </div>
      <button class="btn danger small delete-file-btn" data-index="${index}" title="자료 삭제" style="padding: 2px 6px; font-size: 11px;">삭제</button>
    `;
    
    card.querySelector('.delete-file-btn').addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      if (!confirm(`'${mat.name}' 자료를 연동 해제할까요?`)) return;
      const currentList = storage.get('custom_ref_materials', []);
      currentList.splice(idx, 1);
      storage.set('custom_ref_materials', currentList);
      renderCustomRefMaterial();
      flashStatus('🗑️ 자료 삭제됨', 'ok');
    });
    
    dom.uploadedFilesContainer.appendChild(card);
  });
}

// Bind drag and drop events
if (dom.dropzone) {
  dom.dropzone.addEventListener('click', () => dom.fileUploader.click());

  dom.fileUploader.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length) handleUploadedFiles(files);
  });

  dom.dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.dropzone.classList.add('dragover');
  });

  dom.dropzone.addEventListener('dragleave', () => {
    dom.dropzone.classList.remove('dragover');
  });

  dom.dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.dropzone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleUploadedFiles(files);
  });
}

function handleUploadedFiles(files) {
  let loadedCount = 0;
  let errorCount = 0;
  const currentList = storage.get('custom_ref_materials', []);

  const textFiles = files.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    return ext === 'txt' || ext === 'md';
  });

  if (!textFiles.length) {
    flashStatus('⚠️ .md 또는 .txt 형식의 텍스트 파일만 연동 가능합니다.', 'error');
    return;
  }

  let processed = 0;
  textFiles.forEach(file => {
    // 중복 체크
    if (currentList.some(item => item.name === file.name && item.size === file.size)) {
      processed++;
      if (processed === textFiles.length) {
        storage.set('custom_ref_materials', currentList);
        renderCustomRefMaterial();
        flashStatus('📚 자료 동기화 완료!', 'ok');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text.trim()) {
        currentList.push({
          name: file.name,
          size: file.size,
          text: text
        });
        loadedCount++;
      } else {
        errorCount++;
      }
      processed++;
      if (processed === textFiles.length) {
        storage.set('custom_ref_materials', currentList);
        renderCustomRefMaterial();
        if (loadedCount > 0) {
          flashStatus(`📚 ${loadedCount}개 학습 자료 추가 완료!`, 'ok');
        } else {
          flashStatus('⚠️ 유효한 텍스트 자료를 찾지 못했습니다.', 'error');
        }
      }
    };
    reader.onerror = () => {
      errorCount++;
      processed++;
      if (processed === textFiles.length) {
        storage.set('custom_ref_materials', currentList);
        renderCustomRefMaterial();
      }
    };
    reader.readAsText(file);
  });
}

// ---------- Google Drive API Integration ----------
let gapiInited = false;
let gisInited = false;

function loadGoogleSDKs() {
  if (gapiInited && gisInited) return;

  // Load GAPI
  if (!window.gapi) {
    const s1 = document.createElement('script');
    s1.src = 'https://apis.google.com/js/api.js';
    s1.async = true;
    s1.defer = true;
    s1.onload = () => {
      window.gapi.load('client', () => {
        gapiInited = true;
      });
    };
    document.head.appendChild(s1);
  } else {
    gapiInited = true;
  }

  // Load GIS
  if (!window.google || !window.google.accounts) {
    const s2 = document.createElement('script');
    s2.src = 'https://accounts.google.com/gsi/client';
    s2.async = true;
    s2.defer = true;
    s2.onload = () => {
      gisInited = true;
    };
    document.head.appendChild(s2);
  } else {
    gisInited = true;
  }
}

// Bind Drive Settings UI
if (dom.gdriveClientId && dom.gdriveApiKey) {
  dom.gdriveClientId.value = state.gdriveClientId || '';
  dom.gdriveApiKey.value = state.gdriveApiKey || '';

  dom.gdriveKeysSave.addEventListener('click', () => {
    const cid = dom.gdriveClientId.value.trim();
    const key = dom.gdriveApiKey.value.trim();
    if (!cid || !key) {
      setGdriveStatus('Client ID와 API Key를 모두 입력하세요.', 'error');
      return;
    }
    state.gdriveClientId = cid;
    state.gdriveApiKey = key;
    storage.set('gdrive_client_id', cid);
    storage.set('gdrive_api_key', key);
    setGdriveStatus('구글 드라이브 설정 저장됨.', 'ok');
    loadGoogleSDKs();
  });

  dom.gdriveKeysClear.addEventListener('click', () => {
    if (!confirm('구글 드라이브 연동 설정을 초기화할까요?')) return;
    dom.gdriveClientId.value = '';
    dom.gdriveApiKey.value = '';
    state.gdriveClientId = '';
    state.gdriveApiKey = '';
    storage.remove('gdrive_client_id');
    storage.remove('gdrive_api_key');
    setGdriveStatus('설정 초기화됨.', 'error');
  });
}

function setGdriveStatus(msg, cls) {
  if (dom.gdriveStatus) {
    dom.gdriveStatus.textContent = msg || '';
    dom.gdriveStatus.className = 'status ' + (cls || 'muted');
  }
}

// Trigger Google Picker to select document
if (dom.googleDriveBtn) {
  dom.googleDriveBtn.addEventListener('click', () => {
    if (!state.gdriveClientId || !state.gdriveApiKey) {
      alert('구글 드라이브 연동을 사용하려면 먼저 ⚙️ 설정 탭에서 Google Cloud Client ID와 API Key를 입력하고 저장해주세요.');
      showView('settings');
      return;
    }
    
    loadGoogleSDKs();
    
    // Get Access Token using GIS
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: state.gdriveClientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: async (response) => {
        if (response.error !== undefined) {
          alert('구글 인증 오류: ' + response.error);
          return;
        }
        state.gdriveAccessToken = response.access_token;
        // After auth, load Picker
        gapi.load('picker', { callback: createPicker });
      },
    });
    
    // Request token (shows Google OAuth popup)
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

function createPicker() {
  const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
    .setMimeTypes('text/plain,text/markdown,application/vnd.google-apps.document'); // txt, md, google doc
  
  const picker = new google.picker.PickerBuilder()
    .addView(view)
    .setOAuthToken(state.gdriveAccessToken)
    .setDeveloperKey(state.gdriveApiKey)
    .setCallback(pickerCallback)
    .setTitle('학습 보조 자료 선택 (.txt, .md, 구글 문서)')
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED) // 다중 선택 기능 활성화!
    .build();
    
  picker.setVisible(true);
}

async function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    const files = data.docs;
    const currentList = storage.get('custom_ref_materials', []);
    let loadedCount = 0;
    
    setStatus('구글 드라이브 문서 가져오는 중…');
    
    for (const file of files) {
      const fileId = file.id;
      const name = file.name;
      const isGoogleDoc = file.mimeType === 'application/vnd.google-apps.document';
      
      // 중복 체크
      if (currentList.some(item => item.name === name)) continue;
      
      let fetchUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      if (isGoogleDoc) {
        // 구글 문서의 경우 순수 텍스트로 내보내기 API 호출
        fetchUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
      }
      
      try {
        const res = await fetch(fetchUrl, {
          headers: { 'Authorization': `Bearer ${state.gdriveAccessToken}` }
        });
        
        if (!res.ok) continue;
        const text = await res.text();
        
        if (text.trim()) {
          currentList.push({
            name: isGoogleDoc ? `${name}.txt` : name,
            size: new Blob([text]).size,
            text: text
          });
          loadedCount++;
        }
      } catch (err) {
        console.error('구글 드라이브 파일 로드 실패:', err);
      }
    }
    
    storage.set('custom_ref_materials', currentList);
    renderCustomRefMaterial();
    setStatus('');
    if (loadedCount > 0) {
      flashStatus(`📚 구글 드라이브에서 ${loadedCount}개 자료 추가 완료!`, 'ok');
    } else {
      flashStatus('⚠️ 연동 가능한 새 자료가 없습니다.', 'error');
    }
  }
}

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

  function getVoiceBadge(name) {
    if (/Aria/i.test(name)) return '🌟 [추천/Aria] ';
    if (/Guy/i.test(name)) return '🌟 [추천/Guy] ';
    if (/Jenny/i.test(name)) return '🌟 [추천/Jenny] ';
    if (/Ryan/i.test(name)) return '🌟 [추천/Ryan] ';
    if (/Michelle/i.test(name)) return '🌟 [추천/Michelle] ';
    if (/Natural/i.test(name) || /Neural/i.test(name)) return '🌟 [고품질/Natural] ';
    if (/Siri/i.test(name)) return '🎙️ [Siri 음성] ';
    if (/Samantha/i.test(name)) return '🎙️ [추천/Samantha] ';
    if (/Google US English/i.test(name)) return '🎙️ [Google 메인] ';
    if (/Google/i.test(name)) return '🎙️ [Google 음성] ';
    if (/Cortana/i.test(name)) return '🎙️ [Cortana 비서] ';
    return '';
  }

  const sortedList = [...list].sort((a, b) => {
    const badgeA = getVoiceBadge(a.name);
    const badgeB = getVoiceBadge(b.name);
    if (badgeA && !badgeB) return -1;
    if (!badgeA && badgeB) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const v of sortedList) {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    const badge = getVoiceBadge(v.name);
    opt.textContent = `${badge}${v.name} (${v.lang})`;
    if (state.ttsVoiceURI === v.voiceURI) opt.selected = true;
    dom.ttsVoiceSelect.appendChild(opt);
  }

  // pick a sensible default if none stored
  if (!state.ttsVoiceURI) {
    const pref = sortedList.find((v) => getVoiceBadge(v.name) !== '') || sortedList[0];
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

dom.autoSendToggle.checked = state.autoSend;
dom.silenceMs.value = state.silenceMs;
dom.silenceMsVal.textContent = (state.silenceMs / 1000).toFixed(1);
dom.autoSendToggle.addEventListener('change', () => {
  state.autoSend = dom.autoSendToggle.checked;
  storage.set('auto_send', state.autoSend);
  if (recognizer) recognizer.setSilenceMs(state.autoSend ? state.silenceMs : 0);
});
dom.silenceMs.addEventListener('input', () => {
  state.silenceMs = +dom.silenceMs.value;
  dom.silenceMsVal.textContent = (state.silenceMs / 1000).toFixed(1);
  storage.set('silence_ms', state.silenceMs);
  if (recognizer && state.autoSend) recognizer.setSilenceMs(state.silenceMs);
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
renderBookView();
renderCustomRefMaterial();
if (!state.apiKey) {
  // Friendly first-time experience: land on settings.
  showView('settings');
} else {
  showView('dashboard');
}
