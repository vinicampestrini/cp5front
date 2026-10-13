document.documentElement.classList.add('js');

/* Barra de progresso de rolagem */
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

/* Luz que segue o mouse */
const glow = document.querySelector('.glow');
addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    glow.style.setProperty('--mx', e.clientX + 'px');
    glow.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });

/* Aparecer ao rolar */
const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

/* Carrossel de projetos */
const car = document.querySelector('.carousel');
const view = car.querySelector('.viewport');
const track = car.querySelector('.track');
const slides = [...track.children];
const dotsBox = document.querySelector('.dots');
const count = document.querySelector('.count');
const pad = (n) => String(n).padStart(2, '0');
let i = 0, startX = null, dx = 0;

const dots = slides.map((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', `Ir para o projeto ${n + 1}`);
    b.addEventListener('click', () => go(n));
    dotsBox.append(b);
    return b;
});

function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.inert = k !== i; });
    dots.forEach((d, k) => { d.classList.toggle('active', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    count.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
}

car.querySelector('.prev').addEventListener('click', () => go(i - 1));
car.querySelector('.next').addEventListener('click', () => go(i + 1));
view.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
});

/* Arrastar com o mouse ou o dedo */
view.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) return;
    startX = e.clientX; dx = 0;
    view.setPointerCapture(e.pointerId);
    track.classList.add('dragging');
});
view.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`;
});
const endDrag = () => {
    if (startX === null) return;
    track.classList.remove('dragging');
    go(Math.abs(dx) > 60 ? i + (dx < 0 ? 1 : -1) : i);
    startX = null;
};
view.addEventListener('pointerup', endDrag);
view.addEventListener('pointercancel', endDrag);

go(0);