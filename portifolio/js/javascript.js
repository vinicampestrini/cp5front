document.documentElement.classList.add('js');


/* Menu: destaca a seção atual */
const nav = document.querySelector('.nav');
const links = [...document.querySelectorAll('.nav a')];
const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        const ativo = links.find((a) => a.classList.contains('active'));
        if (ativo) nav.scrollTo({ left: ativo.offsetLeft - (nav.clientWidth - ativo.offsetWidth) / 2, behavior: 'smooth' });
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

function update() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.setProperty('--p', max > 0 ? scrollY / max : 0);

  // a seção atual é a última cujo topo já passou de 40% da altura da tela
  let active = sections[0];
  for (const s of sections) {
    if (s.getBoundingClientRect().top <= innerHeight * 0.4) active = s;
  }
  // no fim da página, marca a última seção
  if (max > 0 && scrollY >= max - 2) active = sections[sections.length - 1];

  if (active && active.id !== current) {
    current = active.id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      // no celular, centraliza o item ativo dentro do menu
      if (on) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
    });
  }
  ticking = false;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
update();

/* Faixa de tecnologias: duplica os itens para o loop ficar contínuo */
const mt = document.querySelector('.marquee-track');
if (mt) {
    mt.append(...[...mt.children].map((c) => { const n = c.cloneNode(true); n.setAttribute('aria-hidden', 'true'); return n; }));
}

/* Aparecer ao rolar */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));