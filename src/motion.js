import { animate, animateMini, inView } from 'framer-motion/dom';

// Progressive enhancement: reading, payment and consent never depend on this module.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const easeOut = [0.23, 1, 0.32, 1];
const running = new Map();

function finish(element) {
  running.get(element)?.complete();
  running.delete(element);
}

function enter(element, kind = 'text', delay = 0) {
  if (reduced.matches) return;
  finish(element);
  const transform = kind === 'picture'
    ? ['translateY(16px) scale(0.98)', 'translateY(0px) scale(1)']
    : ['translateY(16px)', 'translateY(0px)'];
  const control = animateMini(element, { opacity: [0.65, 1], transform }, {
    duration: kind === 'picture' ? 0.5 : 0.4, delay, ease: easeOut,
  });
  running.set(element, control);
  control.then(() => { if (running.get(element) === control) running.delete(element); });
}

// One arrival for the central app screen; the copy and purchase link are always visible.
const heroScreen = document.querySelector('.colagem .f2');
if (heroScreen) enter(heroScreen, 'picture');

// Each reading sequence arrives once. No scroll hijacking or per-frame React state.
document.querySelectorAll('main section:not(.hero)').forEach(section => {
  const title = section.querySelector('h2');
  if (title) inView(title, () => { enter(title); }, { amount: 0.35 });
});
document.querySelectorAll('.miniatura-etapa, .destaque-visual-entrega .artefato, #fases .artefato').forEach(el => {
  inView(el, () => { enter(el, 'picture', 0.06); }, { amount: 0.2 });
});
document.querySelectorAll('.fases-grade .card-fase').forEach((el, i) => {
  inView(el, () => { enter(el, 'text', i * 0.06); }, { amount: 0.25 });
});

// Four real screenshots, with ordinary buttons usable by keyboard and touch.
const gallery = document.querySelector('#telas-app');
const controls = document.querySelector('.gallery-controls');
if (gallery && controls) {
  const cards = [...gallery.querySelectorAll('.galeria-card')];
  const buttons = cards.map((card, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = card.querySelector('figcaption').textContent;
    button.setAttribute('aria-pressed', String(i === 0));
    card.id = `tela-app-${i + 1}`;
    button.setAttribute('aria-controls', card.id);
    button.addEventListener('click', () => select(i));
    controls.append(button);
    return button;
  });
  let selected = 0;
  function select(index) {
    if (selected === index) return;
    // Stop the previous transition immediately, including rapid repeated selections.
    cards.forEach((card, i) => {
      finish(card);
      card.hidden = i !== index;
      buttons[i].setAttribute('aria-pressed', String(i === index));
    });
    selected = index;
    const card = cards[index];
    if (!reduced.matches) {
      const animation = animate(card, {
        opacity: [0.7, 1],
        transform: ['translateY(8px) scale(0.99)', 'translateY(0px) scale(1)'],
      }, { type: 'spring', duration: 0.3, bounce: 0 });
      running.set(card, animation);
      animation.then(() => { if (running.get(card) === animation) running.delete(card); });
    }
  }
  // Start fetching the gallery images early; their dimensions reserve the panel space.
  cards.forEach((card, i) => {
    card.querySelector('img').loading = 'eager';
    card.hidden = i !== 0;
  });
  gallery.classList.add('gallery-enhanced');
  controls.hidden = false;
}

// Respect changes made while the page is already open, too.
reduced.addEventListener('change', () => {
  if (reduced.matches) [...running.keys()].forEach(finish);
});

// Do not keep a user-started demonstration playing offscreen or in a background tab.
const video = document.querySelector('video');
if (video && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) video.pause();
  }).observe(video);
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
}
