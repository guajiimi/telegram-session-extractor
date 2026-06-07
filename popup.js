// ─── I18N ───────────────────────────────────────────────────────────────────
const I18N = {
  en: {
    subtitle: 'Session Extractor',
    dark: 'Dark',
    light: 'Light',
    tabUser: 'User',
    tabToken: 'Token',
    tabFrames: 'Frames',
    copy: 'Copy',
    noTokens: 'No tokens extracted yet',
    noFrames: 'No frames scanned yet',
    extractAll: 'Extract All',
    ready: 'Ready — press Extract All',
    extracting: 'Extracting…',
    noActiveTab: 'No active tab found!',
    success: 'Extraction successful!',
    noSession: 'No session found — open a Mini App first!',
    errPrefix: 'Error: ',
    copied: 'Copied ',
    cantCopy: 'Cannot copy to clipboard.',
    emptyField: 'Field is empty.',
    nothingCopy: 'Nothing to copy — extract first!',
    noInitData: 'No initData available.',
    loadedSaved: 'Loaded saved session.',
    cleared: 'Cleared — press Extract All',
    noTokensExtracted: 'No tokens/cookies extracted',
    noFramesScanned: 'No frames scanned',
    initDataFound: 'initData found',
    yes: 'Yes ★',
    no: 'No',
    data: 'DATA',
    empty: 'EMPTY'
  },
  id: {
    subtitle: 'Ekstraktor Sesi',
    dark: 'Gelap',
    light: 'Terang',
    tabUser: 'Pengguna',
    tabToken: 'Token',
    tabFrames: 'Frame',
    copy: 'Salin',
    noTokens: 'Belum ada token yang diekstrak',
    noFrames: 'Belum ada frame yang dipindai',
    extractAll: 'Ekstrak Semua',
    ready: 'Siap — tekan Ekstrak Semua',
    extracting: 'Mengekstrak…',
    noActiveTab: 'Tab aktif tidak ditemukan!',
    success: 'Ekstraksi berhasil!',
    noSession: 'Sesi tidak ditemukan — buka Mini App terlebih dahulu!',
    errPrefix: 'Kesalahan: ',
    copied: 'Disalin ',
    cantCopy: 'Tidak dapat menyalin ke clipboard.',
    emptyField: 'Kolom kosong.',
    nothingCopy: 'Tidak ada yang disalin — ekstrak terlebih dahulu!',
    noInitData: 'initData tidak tersedia.',
    loadedSaved: 'Sesi tersimpan dimuat.',
    cleared: 'Dihapus — tekan Ekstrak Semua',
    noTokensExtracted: 'Belum ada token/cookie yang diekstrak',
    noFramesScanned: 'Belum ada frame yang dipindai',
    initDataFound: 'initData ditemukan',
    yes: 'Ya ★',
    no: 'Tidak',
    data: 'DATA',
    empty: 'KOSONG'
  }
};

// ─── THEME & LANGUAGE ──────────────────────────────────────────────────────
const html       = document.documentElement;
const themeBtn   = document.getElementById('themeToggle');
const langBtn    = document.getElementById('langToggle');

// Load saved preferences
const savedTheme = localStorage.getItem('tg_theme') || 'dark';
const savedLang  = localStorage.getItem('tg_lang')  || 'en';
html.setAttribute('data-theme', savedTheme);
html.setAttribute('data-lang', savedLang);

function t(key) {
  const lang = html.getAttribute('data-lang') || 'en';
  return (I18N[lang] && I18N[lang][key]) || (I18N.en[key]) || key;
}

function applyLang() {
  const lang = html.getAttribute('data-lang') || 'en';
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]) {
      el.textContent = I18N[lang][key];
    }
  });
  // Update textarea placeholder
  const initDataTa = document.getElementById('f-initData');
  if (initDataTa) {
    initDataTa.placeholder = lang === 'id' ? '— initData tidak ditemukan —' : '— no initData found —';
  }
  // Update status if it's the default ready message
  const sText = document.getElementById('sText');
  if (sText && sText.getAttribute('data-i18n') === 'ready') {
    sText.textContent = t('ready');
  }
  // Update empty states
  document.querySelectorAll('.empty-state[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
  });
}

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('tg_theme', next); } catch(e){}
});

langBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-lang') === 'en' ? 'id' : 'en';
  html.setAttribute('data-lang', next);
  try { localStorage.setItem('tg_lang', next); } catch(e){}
  applyLang();
});

// ─── TABS ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// ─── STATUS ──────────────────────────────────────────────────────────────────
function setStatus(msg, type = '') {
  const bar  = document.getElementById('statusBar');
  const text = document.getElementById('sText');
  bar.className = 'status-row' + (type ? ' ' + type : '');
  text.textContent = msg;
  text.removeAttribute('data-i18n');
}

// ─── SET FIELD ───────────────────────────────────────────────────────────────
function setField(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === 'TEXTAREA') {
    el.value = val || '';
  } else {
    el.value = val || '';
    if (val) el.classList.add('filled');
    else     el.classList.remove('filled');
  }
}

// ─── ESCAPE HTML ─────────────────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── COPY HELPER ─────────────────────────────────────────────────────────────
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    setStatus(t('copied') + (label || '') + '!', 'ok');
  }).catch(() => setStatus(t('cantCopy'), 'err'));
}

function copyField(text, btn, label) {
  navigator.clipboard.writeText(text).then(() => {
    setStatus(t('copied') + (label || '') + '!', 'ok');
    btn.classList.add('copied');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove('copied');
    }, 1500);
  }).catch(() => setStatus(t('cantCopy'), 'err'));
}

// ─── INIT: URL ────────────────────────────────────────────────────────────────
async function initUrlBar() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      document.getElementById('sText').textContent = tab.url;
      document.getElementById('sText').removeAttribute('data-i18n');
    }
  } catch(e) {}
}
initUrlBar();

// ─── EXTRACT FUNCTION (runs in iframe context) ──────────────────────────────
function extractInFrame() {
  const data = {
    frameUrl: location.href,
    frameOrigin: location.origin,
    userId: '', firstName: '', lastName: '', username: '',
    phone: '', isPremium: false, initData: '', queryId: ''
  };

  function parseInitData(raw) {
    if (!raw || typeof raw !== 'string') return;
    let decoded = raw;
    try {
      if (raw.includes('%26') || raw.includes('%3D') || raw.includes('%7B')) {
        decoded = decodeURIComponent(raw);
      }
    } catch(e) { decoded = raw; }
    data.initData = decoded;
    try {
      const sp = new URLSearchParams(decoded);
      const queryId = sp.get('query_id');
      if (queryId) data.queryId = queryId;
      const userStr = sp.get('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        data.userId    = String(u.id || '');
        data.firstName = u.first_name || '';
        data.lastName  = u.last_name  || '';
        data.username  = u.username   || '';
        data.isPremium = !!u.is_premium;
      }
    } catch(e) {
      try {
        const mu = decoded.match(/user=([^&]+)/);
        if (mu) {
          const u = JSON.parse(decodeURIComponent(mu[1]));
          data.userId    = String(u.id || '');
          data.firstName = u.first_name || '';
          data.lastName  = u.last_name  || '';
          data.username  = u.username   || '';
          data.isPremium = !!u.is_premium;
        }
      } catch(e2){}
      try {
        const mq = decoded.match(/query_id=([^&]+)/);
        if (mq) data.queryId = decodeURIComponent(mq[1]);
      } catch(e2){}
    }
  }

  // 1. sessionStorage __telegram__initParams
  try {
    const raw = sessionStorage.getItem('__telegram__initParams');
    if (raw) { const p = JSON.parse(raw); if (p.tgWebAppData) parseInitData(p.tgWebAppData); }
  } catch(e){}

  // 2. tapps/launchParams
  if (!data.initData) {
    try {
      const lp = sessionStorage.getItem('tapps/launchParams');
      if (lp) {
        try {
          const parsed = JSON.parse(lp);
          if (parsed && parsed.tgWebAppData) parseInitData(parsed.tgWebAppData);
        } catch(e2) {}
        if (!data.initData) {
          const m = lp.match(/tgWebAppData=([^&"]+)/);
          if (m) parseInitData(decodeURIComponent(m[1]));
        }
        if (!data.initData) {
          try {
            const decoded = decodeURIComponent(lp);
            const m2 = decoded.match(/tgWebAppData=([^&"]+)/);
            if (m2) parseInitData(decodeURIComponent(m2[1]));
          } catch(e3){}
        }
      }
    } catch(e){}
  }

  // 3. telegram-apps/launch-params (newer SDK)
  if (!data.initData) {
    try {
      const lp = sessionStorage.getItem('telegram-apps/launch-params') || sessionStorage.getItem('launchParams');
      if (lp) {
        try {
          const parsed = JSON.parse(lp);
          if (parsed && parsed.tgWebAppData) { parseInitData(parsed.tgWebAppData); }
          if (!data.initData && parsed && parsed.initData) { parseInitData(parsed.initData); }
        } catch(e2) {}
        if (!data.initData) {
          const m = lp.match(/tgWebAppData=([^&"]+)/);
          if (m) parseInitData(decodeURIComponent(m[1]));
        }
      }
    } catch(e){}
  }

  // 4. window.__telegram__initParams
  if (!data.initData) {
    try {
      const p = window.__telegram__initParams;
      if (p && p.tgWebAppData) parseInitData(p.tgWebAppData);
      if (!data.initData && p && p.initData) parseInitData(p.initData);
    } catch(e){}
  }

  // 5. Telegram.WebView.initParams
  if (!data.initData) {
    try {
      const wp = window.Telegram && window.Telegram.WebView && window.Telegram.WebView.initParams;
      if (wp && wp.tgWebAppData) parseInitData(wp.tgWebAppData);
    } catch(e){}
  }

  // 6. Telegram.WebApp
  if (!data.initData) {
    try {
      const wa = window.Telegram && window.Telegram.WebApp;
      if (wa && wa.initData) parseInitData(wa.initData);
      if (!data.userId && wa && wa.initDataUnsafe && wa.initDataUnsafe.user) {
        const u = wa.initDataUnsafe.user;
        data.userId    = String(u.id || '');
        data.firstName = u.first_name || '';
        data.isPremium = !!u.is_premium;
      }
    } catch(e){}
  }

  // 7. URL hash
  if (!data.initData) {
    try {
      const hash = location.hash.replace(/^#/, '');
      const qIdx = hash.indexOf('?');
      const hashQuery = qIdx >= 0 ? hash.substring(qIdx + 1) : hash;
      const hp = new URLSearchParams(hashQuery);
      let v = hp.get('tgWebAppData');
      if (v) {
        parseInitData(v);
        if (!data.initData) parseInitData(decodeURIComponent(v));
      }
    } catch(e){}
  }

  if (!data.initData) {
    try {
      const hash = location.hash;
      const m = hash.match(/[#?&]tgWebAppData=([^&]+)/);
      if (m) {
        let v = m[1];
        try { v = decodeURIComponent(v); } catch(e){}
        parseInitData(v);
        if (!data.initData) { try { parseInitData(decodeURIComponent(v)); } catch(e){} }
      }
    } catch(e){}
  }

  // 8. URL search
  if (!data.initData) {
    try {
      const sp = new URLSearchParams(location.search);
      const v  = sp.get('tgWebAppData') || sp.get('initData');
      if (v) parseInitData(v);
    } catch(e){}
  }

  // 9. Scan ALL sessionStorage
  if (!data.initData) {
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const val = sessionStorage.getItem(key);
        if (!val) continue;
        try {
          const parsed = JSON.parse(val);
          if (parsed && typeof parsed === 'object') {
            if (parsed.tgWebAppData) { parseInitData(parsed.tgWebAppData); if (data.initData) break; }
            if (parsed.initData) { parseInitData(parsed.initData); if (data.initData) break; }
            if (parsed.query_id) { data.queryId = String(parsed.query_id); }
          }
          if (typeof parsed === 'string' && parsed.includes('query_id=')) {
            parseInitData(parsed); if (data.initData) break;
          }
        } catch(e) {}
        if (data.initData) break;
        if (val.includes('tgWebAppData')) {
          const m = val.match(/tgWebAppData=([^&"]+)/);
          if (m) { parseInitData(decodeURIComponent(m[1])); if (data.initData) break; }
          const mj = val.match(/"tgWebAppData"\s*:\s*"([^"]+)"/);
          if (mj) { parseInitData(mj[1].replace(/\\"/g, '"')); if (data.initData) break; }
        }
        if (val.includes('query_id=') && val.includes('user=')) {
          parseInitData(val); if (data.initData) break;
        }
      }
    } catch(e){}
  }

  // 10. Scan localStorage
  if (!data.initData) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        if (!val) continue;
        if (val.includes('tgWebAppData')) {
          const m = val.match(/tgWebAppData=([^&"]+)/);
          if (m) { parseInitData(decodeURIComponent(m[1])); break; }
        }
        try {
          const parsed = JSON.parse(val);
          if (parsed && typeof parsed === 'object' && parsed.tgWebAppData) {
            parseInitData(parsed.tgWebAppData); break;
          }
        } catch(e) {}
      }
    } catch(e){}
  }

  return data;
}

// Extract from web.telegram.org
function extractOnTelegramWeb() {
  const data = { userId: '', firstName: '', lastName: '', username: '', phone: '', isPremium: false, initData: '', queryId: '' };
  try {
    const ua = localStorage.getItem('user_auth');
    if (ua) { const p = JSON.parse(ua); data.userId = String(p.id || ''); }
    const acc = localStorage.getItem('account1');
    if (acc) {
      const p = JSON.parse(acc);
      if (!data.userId) data.userId = String(p.userId || p.id || '');
      data.firstName = p.firstName || '';
      data.phone     = p.phone     || '';
      data.isPremium = !!p.isPremium;
    }
  } catch(e){}
  return data;
}

// ─── RENDER TOKENS ───────────────────────────────────────────────────────────
let allCookieTokens = {};

function renderTokens(tokens) {
  allCookieTokens = tokens || {};
  const list = document.getElementById('tokenList');
  if (!tokens || Object.keys(tokens).length === 0) {
    list.innerHTML = `<div class="empty-state" data-i18n="noTokensExtracted">${t('noTokensExtracted')}</div>`;
    return;
  }
  list.innerHTML = Object.entries(tokens).map(([name, val]) => `
    <div class="token-item">
      <div class="token-item-head">
        <span class="token-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
        <button class="token-copy-btn" data-copy-token="${escapeHtml(name)}" title="Copy token value">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      <div class="token-val" data-copy-token-val="${escapeHtml(name)}">${escapeHtml(val)}</div>
    </div>
  `).join('');
}

// ─── RENDER FRAMES ───────────────────────────────────────────────────────────
let allFrameResults = [];

function renderFrames(framesData) {
  allFrameResults = framesData || [];
  const list = document.getElementById('frameList');
  if (!framesData || framesData.length === 0) {
    list.innerHTML = `<div class="empty-state" data-i18n="noFramesScanned">${t('noFramesScanned')}</div>`;
    return;
  }

  list.innerHTML = framesData.map((fd, i) => {
    const hasData = !!(fd.initData || fd.userId);
    const kvRows = [
      ['user_id',     fd.userId    || '—'],
      ['init_data',   fd.initData  ? fd.initData.substring(0,60)+'…' : '—'],
      ['query_id',    fd.queryId   || '—'],
      ['first_name',  fd.firstName || '—'],
    ].map(([k,v]) => `
      <div class="frame-kv-row">
        <span class="frame-kv-key">${k}</span>
        <span class="frame-kv-val" data-copy-frame-val="${i}|${k}">${escapeHtml(v)}</span>
      </div>
    `).join('');

    return `
      <div class="frame-item" data-frame-index="${i}">
        <div class="frame-item-head" onclick="this.nextElementSibling.classList.toggle('open')">
          <span class="frame-url">${escapeHtml(fd.frameUrl || 'frame ' + i)}</span>
          <span class="frame-badge ${hasData ? 'has-data' : 'no-data'}">${hasData ? t('data') : t('empty')}</span>
          <button class="frame-copy-btn" data-copy-frame="${i}" title="Copy frame data as JSON">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
        <div class="frame-body">
          <div class="frame-kv">${kvRows}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── EVENT DELEGATION for dynamic copy buttons ──────────────────────────────
document.addEventListener('click', (e) => {
  // Token copy button
  const tokenBtn = e.target.closest('[data-copy-token]');
  if (tokenBtn) {
    const name = tokenBtn.getAttribute('data-copy-token');
    const val = allCookieTokens[name];
    if (val) copyText(val, name);
    else setStatus(t('emptyField'), 'err');
    return;
  }

  // Token value click
  const tokenVal = e.target.closest('[data-copy-token-val]');
  if (tokenVal) {
    const name = tokenVal.getAttribute('data-copy-token-val');
    const val = allCookieTokens[name];
    if (val) copyText(val, name);
    return;
  }

  // Frame copy button (copy frame data as JSON)
  const frameBtn = e.target.closest('[data-copy-frame]');
  if (frameBtn) {
    const idx = parseInt(frameBtn.getAttribute('data-copy-frame'), 10);
    const fd = allFrameResults[idx];
    if (fd) {
      const json = JSON.stringify({
        frameUrl: fd.frameUrl,
        frameOrigin: fd.frameOrigin,
        userId: fd.userId,
        firstName: fd.firstName,
        queryId: fd.queryId,
        initData: fd.initData
      }, null, 2);
      copyText(json, 'frame #' + idx + ' JSON');
    }
    return;
  }

  // Frame value click
  const frameVal = e.target.closest('[data-copy-frame-val]');
  if (frameVal) {
    const parts = frameVal.getAttribute('data-copy-frame-val').split('|');
    const idx = parseInt(parts[0], 10);
    const key = parts[1];
    const fd = allFrameResults[idx];
    if (fd) {
      const valMap = { user_id: fd.userId, init_data: fd.initData, query_id: fd.queryId, first_name: fd.firstName };
      const val = valMap[key];
      if (val && val !== '—') copyText(val, key);
      else setStatus(t('emptyField'), 'err');
    }
    return;
  }

  // Copy field button
  const fieldBtn = e.target.closest('.copy-field');
  if (fieldBtn) {
    const fieldId = fieldBtn.getAttribute('data-field');
    const val = document.getElementById(fieldId)?.value || '';
    if (!val) { setStatus(t('emptyField'), 'err'); return; }
    copyField(val, fieldBtn, fieldId.replace('f-',''));
    return;
  }
});

// ─── MAIN EXTRACT ─────────────────────────────────────────────────────────────
document.getElementById('btnExtract').addEventListener('click', async () => {
  setStatus(t('extracting'), '');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      setStatus(t('noActiveTab'), 'err'); return;
    }

    const isTelegramWeb = tab.url.includes('web.telegram.org');
    let sessionData = null;
    let allFrames = [];

    if (isTelegramWeb) {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: false },
        func: extractOnTelegramWeb
      });
      sessionData = res[0]?.result;
    }

    // Get frame cache from background
    let cachedFrames = [];
    try {
      const cacheRes = await chrome.runtime.sendMessage({ action: 'getFrameCache', tabId: tab.id });
      if (cacheRes && cacheRes.frames && cacheRes.frames.length > 0) {
        cachedFrames = cacheRes.frames;
      }
    } catch(e){}

    // Scan all frames
    const allRes = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: extractInFrame
    });

    allFrames = allRes.map(r => r.result).filter(Boolean);

    // Merge cached frames
    for (const cf of cachedFrames) {
      if (!allFrames.some(f => f.frameUrl === cf.frameUrl)) {
        allFrames.push(cf);
      } else {
        const idx = allFrames.findIndex(f => f.frameUrl === cf.frameUrl);
        if (idx >= 0 && !allFrames[idx].initData && cf.initData) {
          allFrames[idx] = cf;
        }
      }
    }

    // Prefer frame with initData
    for (const r of allFrames) {
      if (r.initData) { sessionData = r; break; }
    }
    if (!sessionData || !sessionData.userId) {
      for (const r of allFrames) {
        if (r.userId) { sessionData = r; break; }
      }
    }

    // Extract cookies
    const cookieTokens = {};
    try {
      const hostnames = new Set();
      try { hostnames.add(new URL(tab.url).hostname); } catch(e){}
      allFrames.forEach(f => {
        try { if (f.frameUrl) hostnames.add(new URL(f.frameUrl).hostname); } catch(e){}
        try { if (f.frameOrigin) hostnames.add(new URL(f.frameOrigin).hostname); } catch(e){}
      });
      const allDomains = new Set();
      for (const hostname of hostnames) {
        if (!hostname) continue;
        const parts = hostname.split('.');
        while (parts.length > 1) {
          allDomains.add(parts.join('.'));
          allDomains.add('.' + parts.join('.'));
          parts.shift();
        }
      }
      for (const domain of allDomains) {
        try {
          const cookies = await chrome.cookies.getAll({ domain });
          cookies.forEach(c => {
            const n = c.name.toLowerCase();
            if (n.includes('session') || n.includes('token') || n.includes('auth') || n.includes('stel_') || n.includes('tg_') || n.includes('ssid') || n.includes('remember')) {
              cookieTokens[c.name] = c.value;
            }
          });
        } catch(e){}
      }
      for (const hostname of hostnames) {
        for (const proto of ['https://', 'http://']) {
          try {
            const cookies = await chrome.cookies.getAll({ url: proto + hostname + '/' });
            cookies.forEach(c => {
              const n = c.name.toLowerCase();
              if (n.includes('session') || n.includes('token') || n.includes('auth') || n.includes('stel_') || n.includes('tg_') || n.includes('ssid') || n.includes('remember')) {
                cookieTokens[c.name] = c.value;
              }
            });
          } catch(e){}
        }
      }
    } catch(e){}

    // Render
    renderFrames(allFrames);
    renderTokens(cookieTokens);

    if (sessionData && (sessionData.userId || sessionData.initData)) {
      setField('f-userId',    sessionData.userId    || '');
      setField('f-firstName', sessionData.firstName || '');
      setField('f-username',  sessionData.username  || '');
      setField('f-phone',     sessionData.phone     || '');
      setField('f-isPremium', sessionData.isPremium ? t('yes') : t('no'));
      setField('f-queryId',   sessionData.queryId   || '');
      setField('f-initData',  sessionData.initData  || '');
      document.getElementById('initDataSource').textContent =
        sessionData.initData ? t('initDataFound') : '';
      setStatus(t('success'), 'ok');
      chrome.storage.local.set({ tgSession: { ...sessionData, cookieTokens, ts: Date.now() } });
    } else {
      setStatus(t('noSession'), 'err');
    }

  } catch (err) {
    console.error(err);
    setStatus(t('errPrefix') + err.message, 'err');
  }
});

// ─── COPY ALL JSON ────────────────────────────────────────────────────────────
document.getElementById('btnCopyAll').addEventListener('click', () => {
  const obj = {
    userId:    document.getElementById('f-userId')?.value    || '',
    firstName: document.getElementById('f-firstName')?.value || '',
    username:  document.getElementById('f-username')?.value  || '',
    phone:     document.getElementById('f-phone')?.value     || '',
    isPremium: document.getElementById('f-isPremium')?.value || '',
    queryId:   document.getElementById('f-queryId')?.value   || '',
    initData:  document.getElementById('f-initData')?.value  || '',
    tokens:    allCookieTokens,
    frames:    allFrameResults.map(f => ({
      frameUrl: f.frameUrl,
      frameOrigin: f.frameOrigin,
      userId: f.userId,
      firstName: f.firstName,
      queryId: f.queryId,
      initData: f.initData ? f.initData.substring(0,100) : ''
    }))
  };
  if (!obj.userId && !obj.initData && Object.keys(obj.tokens).length === 0) {
    setStatus(t('nothingCopy'), 'err'); return;
  }
  copyText(JSON.stringify(obj, null, 2), 'JSON');
});

// ─── COPY INIT DATA ───────────────────────────────────────────────────────────
document.getElementById('copyInitData').addEventListener('click', () => {
  const val = document.getElementById('f-initData')?.value || '';
  if (!val) { setStatus(t('noInitData'), 'err'); return; }
  copyText(val, 'initData');
});

// ─── CLEAR ────────────────────────────────────────────────────────────────────
document.getElementById('btnClear').addEventListener('click', () => {
  ['f-userId','f-firstName','f-username','f-phone','f-isPremium','f-queryId'].forEach(id => setField(id, ''));
  const ta = document.getElementById('f-initData');
  if (ta) ta.value = '';
  document.getElementById('initDataSource').textContent = '';
  document.getElementById('tokenList').innerHTML  = `<div class="empty-state" data-i18n="noTokens">${t('noTokens')}</div>`;
  document.getElementById('frameList').innerHTML  = `<div class="empty-state" data-i18n="noFrames">${t('noFrames')}</div>`;
  allCookieTokens = {};
  allFrameResults = [];
  chrome.storage.local.remove('tgSession');
  setStatus(t('cleared'), '');
});

// ─── LOAD SAVED SESSION ───────────────────────────────────────────────────────
chrome.storage.local.get(['tgSession'], (result) => {
  if (result.tgSession) {
    const s = result.tgSession;
    setField('f-userId',    s.userId    || '');
    setField('f-firstName', s.firstName || '');
    setField('f-username',  s.username  || '');
    setField('f-phone',     s.phone     || '');
    setField('f-isPremium', s.isPremium ? t('yes') : t('no'));
    setField('f-queryId',   s.queryId   || '');
    setField('f-initData',  s.initData  || '');
    if (s.cookieTokens) renderTokens(s.cookieTokens);
    setStatus(t('loadedSaved'), 'ok');
  }
});

// ─── APPLY LANG ON LOAD ──────────────────────────────────────────────────────
applyLang();
