// Beauty·Nature · «Mapping»: las medidas de la ceja se trazan sobre la foto y un parpadeo enseña el antes
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LI = () => ({ es: 0, ca: 1, en: 2 }[document.documentElement.lang] || 0);
  const T = (es, ca, en) => [es, ca, en][LI()];
  const tx = (v) => (Array.isArray(v) ? v[LI()] : v);
  const NS = 'http://www.w3.org/2000/svg';
  const gs = () => !reduce && typeof gsap !== 'undefined';

  // ---------- mapping sobre la foto (coordenadas del viewBox 1000 × 1421) ----------
  const E = [[195, 771], [419, 868], [540, 988]], B = [[281, 476], [540, 462], [856, 960]];
  const LAB = [['Inicio', 'Inici', 'Start'], ['Arco', 'Arc', 'Arch'], ['Final', 'Final', 'Tail']];
  const LPOS = [[150, 440], [500, 418], [880, 1020]];
  function mapping() {
    const g = document.getElementById('mapLines');
    const el = (n, a) => { const e = document.createElementNS(NS, n); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); g.appendChild(e); return e; };
    const curve = el('path', { class: 'ln2', d: 'M281 476 C380 440 470 440 540 462 S800 800 856 960' });
    const lines = E.map((e, i) => { const b = B[i], x2 = b[0] + (b[0] - e[0]) * .12, y2 = b[1] + (b[1] - e[1]) * .12; return el('line', { class: 'ln', x1: e[0], y1: e[1], x2, y2, 'data-x': x2, 'data-y': y2 }); });
    E.forEach((e) => el('circle', { class: 'eye', cx: e[0], cy: e[1], r: 7 }));
    const pts = B.map((b) => el('circle', { class: 'pt', cx: b[0], cy: b[1], r: 13 }));
    const labs = LPOS.map((p, i) => { const t = el('text', { x: p[0], y: p[1], 'text-anchor': i === 2 ? 'end' : 'start' }); t.textContent = LAB[i][0]; return t; });
    const relabel = () => labs.forEach((t, i) => (t.textContent = LAB[i][LI()]));
    document.addEventListener('langchange', relabel); relabel();
    if (gs()) {
      const tl = gsap.timeline({ delay: .6 });
      lines.forEach((l, i) => tl.fromTo(l, { attr: { x2: E[i][0], y2: E[i][1] } }, { attr: { x2: +l.dataset.x, y2: +l.dataset.y }, duration: .9, ease: 'expo.out' }, i * .18));
      tl.from(pts, { attr: { r: 0 }, duration: .6, stagger: .12, ease: 'back.out(3)' }, .6);
      tl.from(curve, { opacity: 0, duration: 1 }, 1);
      tl.from(labs, { opacity: 0, y: 10, duration: .6, stagger: .1 }, 1.1);
    }
    const fig = document.getElementById('medidas-fig'), btn = document.getElementById('mapBtn');
    const btnTxt = () => (btn.textContent = fig.classList.contains('off') ? T('Ver las medidas', 'Veure les mesures', 'Show the guides') : T('Ocultar las medidas', 'Amagar les mesures', 'Hide the guides'));
    btn.addEventListener('click', () => { fig.classList.toggle('off'); btn.setAttribute('aria-pressed', String(!fig.classList.contains('off'))); btnTxt(); });
    document.addEventListener('langchange', btnTxt);
  }

  // ---------- antes y después ----------
  const BA = [
    { tab: ['Cejas 1', 'Celles 1', 'Brows 1'], img: 'micro-1', t: ['Micropigmentación de cejas', 'Micropigmentació de celles', 'Brow micropigmentation'] },
    { tab: ['Cejas 2', 'Celles 2', 'Brows 2'], img: 'micro-2', t: ['Micropigmentación de cejas, también para ellos', 'Micropigmentació de celles, també per a ells', 'Brow micropigmentation, for men too'] },
    { tab: ['Cejas 3', 'Celles 3', 'Brows 3'], img: 'micro-3', t: ['Micropigmentación: cejas más definidas y naturales', 'Micropigmentació: celles més definides i naturals', 'Micropigmentation: fuller, natural brows'] },
    { tab: ['Pestañas', 'Pestanyes', 'Lashes'], img: 'lifting', cls: 'wide', t: ['Lifting y tinte de pestañas', 'Lifting i tint de pestanyes', 'Lash lift and tint'] },
    { tab: ['Hidralips', 'Hidralips', 'Hidralips'], img: 'hidralips', cls: 'tall', t: ['Hidralips: hidratación profunda de labios', 'Hidralips: hidratació profunda de llavis', 'Hidralips: deep lip hydration'] },
    { tab: ['Glossyps', 'Glossyps', 'Glossyps'], img: 'glossyps', cls: 'tall', t: ['Glossyps: color natural en los labios', 'Glossyps: color natural als llavis', 'Glossyps: natural lip colour'] }
  ];
  let cur = 0, before = false;
  function beforeAfter() {
    const tabs = document.getElementById('resTabs'), ba = document.getElementById('ba'), frame = ba.querySelector('.ba-frame');
    const aft = document.getElementById('baAfter'), bef = document.getElementById('baBefore'), chip = document.getElementById('baChip'), cap = document.getElementById('baCap'), hold = document.getElementById('baHold');
    const label = () => { chip.textContent = before ? T('Antes', 'Abans', 'Before') : T('Después', 'Després', 'After'); };
    function renderTabs() { tabs.innerHTML = BA.map((b, i) => `<button type="button" role="tab" aria-selected="${i === cur}" data-i="${i}">${tx(b.tab)}</button>`).join(''); }
    function select(i) {
      cur = i; const b = BA[i];
      aft.src = `assets/img/${b.img}-despues.jpg`; bef.src = `assets/img/${b.img}-antes.jpg`;
      aft.alt = `${tx(b.t)} · ${T('después', 'després', 'after')}`; bef.alt = `${tx(b.t)} · ${T('antes', 'abans', 'before')}`;
      frame.className = 'ba-frame ' + (b.cls || '');
      cap.textContent = tx(b.t);
      tabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(+x.dataset.i === i)));
      set(false, true);
    }
    function set(v, instant) {
      if (v === before && !instant) return;
      before = v; hold.setAttribute('aria-pressed', String(v));
      const swap = () => { ba.classList.toggle('show-before', v); label(); };
      if (instant || !gs()) { swap(); return; }
      // parpadeo: los párpados se cierran, cambia la foto y se abren
      gsap.timeline().to('.lid', { scaleY: 1, duration: .11, ease: 'power2.in' }).add(swap).to('.lid', { scaleY: 0, duration: .22, ease: 'power2.out' });
    }
    tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) select(+b.dataset.i); });
    frame.addEventListener('pointerdown', (e) => { e.preventDefault(); set(true); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => frame.addEventListener(ev, () => set(false)));
    frame.addEventListener('contextmenu', (e) => e.preventDefault());
    hold.addEventListener('click', () => set(!before));
    hold.addEventListener('keydown', (e) => { if (e.key === ' ' && !e.repeat) { e.preventDefault(); set(true); } });
    hold.addEventListener('keyup', (e) => { if (e.key === ' ') set(false); });
    document.addEventListener('langchange', () => { renderTabs(); select(cur); });
    renderTabs(); select(0);
  }

  // ---------- precios reales de Booksy ----------
  const P = [
    [['Cejas', 'Celles', 'Brows'], [
      [['Diseño de cejas con hilo', 'Disseny de celles amb fil', 'Brow design with threading'], '15 min', 17], [['Sombreado de cejas', 'Ombrejat de celles', 'Brow tint shading'], '10 min', 10],
      [['Diseño + sombreado', 'Disseny + ombrejat', 'Design + shading'], '25 min', 20], [['Laminado de cejas', 'Laminat de celles', 'Brow lamination'], '45 min', 45],
      [['Laminado + diseño + sombreado', 'Laminat + disseny + ombrejat', 'Lamination + design + shading'], '1 h 15 min', 65], [['Spa B·N de cejas', 'Spa B·N de celles', 'B·N brow spa'], '40 min', 35],
      [['Restauración de cejas', 'Restauració de celles', 'Brow restoration'], '35 min', 40], [['Micropigmentación', 'Micropigmentació', 'Micropigmentation'], '1 h 30 min', 350],
      [['Repaso de micropigmentación', 'Repàs de micropigmentació', 'Micropigmentation touch-up'], '1 h', 50]]],
    [['Pestañas', 'Pestanyes', 'Lashes'], [[['Lifting + tinte de pestañas', 'Lifting + tint de pestanyes', 'Lash lift + tint'], '1 h', 55], [['Tinte de pestañas', 'Tint de pestanyes', 'Lash tint'], '20 min', 16]]],
    [['Labios', 'Llavis', 'Lips'], [[['Hidralips (sin color)', 'Hidralips (sense color)', 'Hidralips (no colour)'], '45 min', 40], [['Glossyps (color)', 'Glossyps (color)', 'Glossyps (colour)'], '1 h 15 min', 230]]],
    [['Rostro con hilo', 'Rostre amb fil', 'Face threading'], [
      [['Labio superior', 'Llavi superior', 'Upper lip'], '5 min', 7], [['Combo facial: labio y cejas', 'Combo facial: llavi i celles', 'Face combo: lip and brows'], '20 min', 20],
      [['Diseño + sombreado + labio superior', 'Disseny + ombrejat + llavi superior', 'Design + shading + upper lip'], '30 min', 25], [['Cara completa', 'Cara completa', 'Full face'], '40 min', 40], [['Zona extra', 'Zona extra', 'Extra area'], '20 min', 12]]],
    [['Maquillaje', 'Maquillatge', 'Make-up'], [[['Maquillaje', 'Maquillatge', 'Make-up'], '1 h', 40], [['Novia: prueba + destino (desde)', 'Núvia: prova + destinació (des de)', 'Bridal: trial + on location (from)'], '1 h 30 min', 200]]]
  ];
  function prices() {
    document.getElementById('pGrid').innerHTML = P.map(([h, rows]) => `<section class="p-grp"><h3>${tx(h)}</h3><ul>${rows.map(([n, d, p]) => `<li><span>${tx(n)}</span><small>${d}</small><b>${p} €</b></li>`).join('')}</ul></section>`).join('');
  }

  function header() {
    const top = document.querySelector('.top'); let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY; top.classList.toggle('solid', y > 40);
      if (y > 600 && y > last + 4) top.classList.add('hide'); else if (y < last - 4) top.classList.remove('hide');
      last = y;
    }, { passive: true });
  }

  function motion() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-k, .hero h1, .hero-p, .hero-cta, .hero-rate', { opacity: 0, y: 26, duration: 1.4, stagger: .09, ease: 'expo.out' });
    gsap.from('.map img', { scale: 1.15, duration: 2.4, ease: 'expo.out' });
    gsap.utils.toArray('h2.rv').forEach((h) => gsap.from(h, { opacity: 0, y: 34, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
    gsap.utils.toArray('.m-list li, .p-grp, .rs blockquote, .estudio figure, .ba-frame').forEach((el, i) => gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', delay: (i % 3) * .07, scrollTrigger: { trigger: el, start: 'top 92%' } }));
  }

  function init() {
    mapping(); beforeAfter(); prices(); header();
    document.addEventListener('langchange', prices);
    if (gs()) motion();
    document.fonts && document.fonts.ready.then(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
