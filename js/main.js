// Beauty·Nature · «Atelier de la mirada»: las medidas de la ceja crecen sobre la foto macro de la portada,
// un comparador que se arrastra enseña el antes y el después, y los precios reales de Booksy se abren por categorías.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LI = () => ({ es: 0, ca: 1, en: 2 }[document.documentElement.lang] || 0);
  const T = (es, ca, en) => [es, ca, en][LI()];
  const tx = (v) => (Array.isArray(v) ? v[LI()] : v);
  const NS = 'http://www.w3.org/2000/svg';
  const gs = () => !reduce && typeof gsap !== 'undefined';

  // ---------- medidas sobre la foto (coordenadas del viewBox 1000 × 1421) ----------
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
      gsap.fromTo('.h-img', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' });
      gsap.fromTo('.h-img img', { scale: 1.3 }, { scale: 1, duration: 2.6, ease: 'expo.out' });
      const tl = gsap.timeline({ delay: 1.2 });
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

  // ---------- antes y después: comparador ----------
  const BA = [
    { img: 'micro-1', t: ['Micropigmentación de cejas', 'Micropigmentació de celles', 'Brow micropigmentation'] },
    { img: 'micro-2', t: ['Micropigmentación de cejas, también para ellos', 'Micropigmentació de celles, també per a ells', 'Brow micropigmentation, for men too'] },
    { img: 'micro-3', t: ['Micropigmentación: cejas más definidas y naturales', 'Micropigmentació: celles més definides i naturals', 'Micropigmentation: fuller, natural brows'] },
    { img: 'lifting', cls: 'wide', t: ['Lifting y tinte de pestañas', 'Lifting i tint de pestanyes', 'Lash lift and tint'] },
    { img: 'hidralips', t: ['Hidralips: hidratación profunda de labios', 'Hidralips: hidratació profunda de llavis', 'Hidralips: deep lip hydration'] },
    { img: 'glossyps', t: ['Glossyps: color natural en los labios', 'Glossyps: color natural als llavis', 'Glossyps: natural lip colour'] }
  ];
  let cur = 0;
  function compare() {
    const box = document.getElementById('cases'), cmp = document.getElementById('cmp'), range = document.getElementById('cRange');
    const aft = document.getElementById('cAfter'), bef = document.getElementById('cBefore'), cap = document.getElementById('cCap');
    const set = (v) => cmp.style.setProperty('--x', v + '%');
    const sweep = (from) => { if (!gs()) { set(50); return; } const o = { v: from }; gsap.to(o, { v: 50, duration: 1.4, ease: 'expo.inOut', onUpdate: () => set(o.v) }); };
    range.addEventListener('input', () => set(range.value));
    const render = () => { box.innerHTML = BA.map((b, i) => `<button type="button" role="tab" aria-selected="${i === cur}" data-i="${i}"><small>0${i + 1}</small>${tx(b.t)}</button>`).join(''); };
    const select = (i, animate) => {
      cur = i; const b = BA[i];
      aft.src = `assets/img/${b.img}-despues.jpg`; bef.src = `assets/img/${b.img}-antes.jpg`;
      aft.alt = `${tx(b.t)} · ${T('después', 'després', 'after')}`; bef.alt = `${tx(b.t)} · ${T('antes', 'abans', 'before')}`;
      cmp.classList.toggle('wide', !!b.cls); cap.textContent = tx(b.t);
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(+x.dataset.i === i)));
      range.value = 50;
      if (animate) sweep(88); else set(50);
    };
    box.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) select(+b.dataset.i, true); });
    document.addEventListener('langchange', () => { render(); select(cur); });
    render(); select(0);
    // la línea barre al aparecer para enseñar que se puede arrastrar
    if (gs()) ScrollTrigger.create({ trigger: cmp, start: 'top 70%', onEnter: () => sweep(12) });
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
  let open = 0;
  function prices() {
    document.getElementById('acc').innerHTML = P.map(([h, rows], i) => `<div class="grp${i === open ? ' open' : ''}"><button type="button" aria-expanded="${i === open}" aria-controls="g${i}" data-i="${i}"><span>${tx(h)}</span><small>${rows.length} ${T('servicios', 'serveis', 'services')}</small></button><div class="grp-b" id="g${i}"><div><ul>${rows.map(([n, d, p]) => `<li><span>${tx(n)}</span><small>${d}</small><b>${p} €</b></li>`).join('')}</ul></div></div></div>`).join('');
  }
  function accordion() {
    document.getElementById('acc').addEventListener('click', (e) => {
      const b = e.target.closest('.grp > button'); if (!b) return;
      const g = b.parentElement, was = g.classList.contains('open');
      document.querySelectorAll('.grp').forEach((x) => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (!was) { g.classList.add('open'); b.setAttribute('aria-expanded', 'true'); open = +b.dataset.i; } else open = -1;
      setTimeout(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh(), 750);
    });
  }

  function init() {
    mapping(); compare(); prices(); accordion();
    document.addEventListener('langchange', prices);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
