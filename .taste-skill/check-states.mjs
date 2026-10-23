// Optional local audit using the browser helper supplied by design-taste-frontend.
import './normal-motion.mjs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { Browser, sleep } = await import(pathToFileURL(join(process.env.USERPROFILE, '.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const browser = await Browser.launch();
const output = 'auditoria-visual';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ width, height: width === 1440 ? 900 : 844 });
    await page.goto('http://127.0.0.1:4176/');
    await page.eval(() => document.querySelector('.btn-cookie-secundario').click());
    await page.eval(() => document.fonts.ready.then(() => true));
    await sleep(550);
    const navigation = await page.eval(() => {
      const ctas = [...document.querySelectorAll('main a.pill[href^="#"]')];
      return ctas.map(link => {
        const section = link.closest('section');
        const next = section.nextElementSibling ?? document.querySelector('footer');
        link.click();
        return { target: link.getAttribute('href'), hash: location.hash, next: next.id };
      });
    });
    assert.deepEqual(navigation.map(n => n.target), ['#dor', '#como-funciona', '#contato']);
    navigation.forEach(n => { assert.equal(n.hash, n.target); assert.equal(`#${n.next}`, n.target); });
    assert.equal(await page.eval(() => document.querySelectorAll('#barraFixa, .barra-fixa').length), 0);
    const gallery = await page.eval(async () => {
      const buttons = [...document.querySelectorAll('.gallery-controls button')];
      for (const i of [1, 3, 0, 2, 1, 3]) buttons[i].click();
      await new Promise(r => setTimeout(r, 400));
      return { pressed: buttons.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent),
        shown: [...document.querySelectorAll('.galeria-card')].filter(c => !c.hidden).map(c => c.querySelector('figcaption').textContent),
        running: document.getAnimations().filter(a => a.playState === 'running').length };
    });
    assert.deepEqual(gallery.pressed, ['Matriz de priorização']);
    assert.deepEqual(gallery.shown, gallery.pressed);
    assert.equal(gallery.running, 0);
    for (const [name, selector] of [['inicio', '.site-header'], ['galeria', '#demonstracao'], ['oferta', '#oferta'], ['faq', '#faq'], ['final', '.chamada-final'], ['rodape', '.rodape']]) {
      await page.eval(sel => document.querySelector(sel).scrollIntoView({ behavior: 'instant', block: 'start' }), selector);
      await sleep(600);
      await page.screenshot({ path: `${output}/${width}-${name}.jpg`, quality: 85 });
    }
    results.push({ width, navigation, gallery, layout: await page.eval(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth })) });
    await page.close();
  }
  const reduced = await browser.newPage({ width: 390, height: 844, reducedMotion: true });
  await reduced.goto('http://127.0.0.1:4176/');
  const reducedResult = await reduced.eval(() => {
    document.querySelectorAll('.gallery-controls button')[2].click();
    return { reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      running: document.getAnimations().filter(a => a.playState === 'running').length,
      visible: [...document.querySelectorAll('.galeria-card')].filter(c => !c.hidden).map(c => c.querySelector('figcaption').textContent) };
  });
  assert.equal(reducedResult.reduced, true);
  assert.equal(reducedResult.running, 0);
  assert.deepEqual(reducedResult.visible, ['Os 28 dias']);
  results.push({ reducedMotion: reducedResult });
  await reduced.close();
  const nojs = await browser.newPage({ width: 390, height: 844 });
  await nojs.send('Emulation.setScriptExecutionDisabled', { value: true });
  await nojs.goto('http://127.0.0.1:4176/');
  const fallback = await nojs.eval(() => ({ cards: [...document.querySelectorAll('.galeria-card')].filter(c => getComputedStyle(c).display !== 'none').length,
    titleVisible: getComputedStyle(document.querySelector('h1')).opacity,
    checkout: [...document.querySelectorAll('a[href="https://pay.kiwify.com.br/NXZ0sjz"]')].length,
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.equal(fallback.cards, 4);
  assert.equal(fallback.titleVisible, '1');
  assert.equal(fallback.checkout, 1);
  assert.ok(fallback.scrollWidth <= fallback.width);
  results.push({ noJavaScript: fallback });
  await nojs.close();
  await writeFile(`${output}/estados.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
