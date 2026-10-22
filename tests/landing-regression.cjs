// Execute with: node --test tests/landing-regression.cjs
// Runs the actual inline scripts with a simulated browser, without sending Meta events.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

function browser(saved = null, storageBlocked = false) {
  const values = new Map(saved ? [['meuritmo_cookie_consent', saved]] : []);
  const elements = new Map();
  const listeners = {};
  const requests = [];
  const deletedCookies = [];
  const element = id => {
    if (!elements.has(id)) {
      const classes = new Set();
      elements.set(id, { id, checked: false, setAttribute() {},
        classList: { toggle(name, active) { active ? classes.add(name) : classes.delete(name); }, contains: name => classes.has(name) }
      });
    }
    return elements.get(id);
  };
  const document = {
    getElementById: element,
    createElement: () => ({}),
    getElementsByTagName: () => [{ parentNode: { insertBefore: el => requests.push(el.src) } }],
    set cookie(value) { deletedCookies.push(value); }
  };
  const context = vm.createContext({ document, location: { hostname: 'landing-page-desafio-28-dias.vercel.app' },
    localStorage: {
      getItem: key => { if (storageBlocked) throw Error('storage blocked'); return values.get(key) ?? null; },
      setItem: (key, val) => { if (storageBlocked) throw Error('storage blocked'); values.set(key, val); }
    }, innerHeight: 844, scrollY: 0,
    addEventListener: (name, fn) => { (listeners[name] ??= []).push(fn); },
    requestAnimationFrame: fn => fn()
  });
  context.window = context;
  scripts.forEach(script => vm.runInContext(script, context));
  return { context, element, requests, values, deletedCookies, listeners,
    calls: () => context.fbq ? Array.from(context.fbq.queue, args => Array.from(args)) : [] };
}

test('fresh visit and explicit refusal never load or fire the Pixel', () => {
  for (const saved of [null, 'necessary', 'invalid']) {
    const b = browser(saved);
    b.context.carregarMetaPixel();
    b.context.dispararInitiateCheckout();
    assert.equal(b.requests.length, 0);
    assert.equal(b.calls().length, 0);
    assert.equal(b.element('bannerCookies').classList.contains('ativo'), saved !== 'necessary');
  }
});

test('the real Save preferences button honors an unchecked box', () => {
  const handler = html.match(/onclick="([^"]+)"[^>]*>Salvar preferências<\/button>/)[1];
  const b = browser();
  b.element('checkMarketingCookies').checked = false;
  vm.runInContext(handler, b.context);
  assert.equal(b.values.get('meuritmo_cookie_consent'), 'necessary');
  assert.equal(b.requests.length, 0);
});

test('positive choice initializes once, including saved consent on a new visit', () => {
  for (const saved of [null, 'all']) {
    const b = browser(saved);
    b.context.aceitarTodosCookies();
    b.context.aceitarTodosCookies();
    assert.equal(b.requests.length, 1);
    assert.equal(b.calls().filter(c => c[0] === 'init' && c[1] === '735853032032044').length, 1);
    assert.equal(b.calls().filter(c => c[0] === 'track' && c[1] === 'PageView').length, 1);
    assert.equal(b.values.get('meuritmo_cookie_consent'), 'all');
  }
});

test('revocation stops checkout tracking and sends the SDK revoke command', () => {
  const b = browser('all');
  b.context.dispararInitiateCheckout();
  b.element('checkMarketingCookies').checked = false;
  b.context.salvarPreferenciasCookies();
  b.context.dispararInitiateCheckout();
  assert.equal(b.calls().filter(c => c[1] === 'InitiateCheckout').length, 1);
  assert.ok(b.calls().some(c => c[0] === 'consent' && c[1] === 'revoke'));
  assert.ok(b.deletedCookies.some(c => c.startsWith('_fbp=; Max-Age=0')));
  assert.ok(b.deletedCookies.some(c => c.startsWith('_fbc=; Max-Age=0')));
  assert.equal(b.values.get('meuritmo_cookie_consent'), 'necessary');
  b.context.aceitarTodosCookies();
  b.context.dispararInitiateCheckout();
  assert.equal(b.calls().filter(c => c[1] === 'InitiateCheckout').length, 2);
  assert.equal(b.requests.length, 1);
});

test('storage restrictions do not crash the page or authorize tracking by default', () => {
  const b = browser(null, true);
  assert.equal(b.requests.length, 0);
  b.context.recusarCookies();
  assert.equal(b.context.consentimentoMarketing, false);
  b.context.aceitarTodosCookies();
  assert.equal(b.requests.length, 1);
  b.context.recusarCookies();
  assert.equal(b.context.consentimentoMarketing, false);
});

test('revocation in another tab is applied to this page', () => {
  const b = browser('all');
  b.values.set('meuritmo_cookie_consent', 'necessary');
  b.listeners.storage.forEach(fn => fn({ key: 'meuritmo_cookie_consent' }));
  b.context.dispararInitiateCheckout();
  assert.equal(b.context.consentimentoMarketing, false);
  assert.equal(b.calls().filter(c => c[1] === 'InitiateCheckout').length, 0);
});

test('all CSS variables resolve and every referenced local media file exists', () => {
  const defined = new Set([...html.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  for (const m of html.matchAll(/var\((--[\w-]+)/g)) assert.ok(defined.has(m[1]), m[1]);
  for (const m of html.matchAll(/(?:src|srcset|poster)="(assets\/[^" ]+)/g)) {
    assert.ok(fs.existsSync(path.join(root, m[1])), m[1]);
  }
  for (const m of html.matchAll(/<img\b[^>]+>/g)) assert.match(m[0], /alt="[^"\s][^"]+"/);
});

test('all five purchase links preserve checkout and one inline tracking handler', () => {
  const links = [...html.matchAll(/<a\b[^>]+href="https:\/\/pay\.kiwify\.com\.br\/NXZ0sjz"[^>]*>/g)];
  assert.equal(links.length, 5);
  links.forEach(([tag]) => assert.match(tag, /onclick="dispararInitiateCheckout\(\);"/));
  assert.doesNotMatch(html, /<noscript>[\s\S]*facebook/);
  assert.doesNotMatch(html, /<form\b/);
});

function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
test('small-text and button color pairs reach at least 4.5:1', () => {
  const colors = Object.fromEntries([...html.matchAll(/(--[\w-]+):\s*#([\da-f]{6})/gi)].map(m => [m[1], m[2]]));
  const pairs = ['--texto','--texto-suave','--texto-legenda','--acao-texto']
    .flatMap(fg => ['--base','--base-pura','--secundaria-suave'].map(bg => [fg, bg]));
  pairs.push(['--base-pura','--acao'], ['--acao-texto','--secundaria']);
  for (const [fg,bg] of pairs) {
    const [a,b] = [luminance(colors[fg]),luminance(colors[bg])].sort((a,b) => b-a);
    assert.ok((a+0.05)/(b+0.05) >= 4.5, `${fg} on ${bg}`);
  }
});
