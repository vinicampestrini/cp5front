document.documentElement.classList.add('js');

/* Barra de progresso */
const progress = document.querySelector('.progress');
let ticking = false;
addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.setProperty('--p', max > 0 ? scrollY / max : 0);
        ticking = false;
    });
}, { passive: true });

/* Faixa de tecnologias: duplica os itens para o loop ficar contínuo */
const mt = document.querySelector('.marquee-track');
mt.append(...[...mt.children].map((c) => { const n = c.cloneNode(true); n.setAttribute('aria-hidden', 'true'); return n; }));

/* Aparecer ao rolar */
const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

/* Menu: destaca a seção atual */
const links = [...document.querySelectorAll('.nav a')];
const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));