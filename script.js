const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const tiltCard = document.querySelector('.tilt-sample');

if (tiltCard) {
  const tiltDemo = tiltCard.querySelector('.tilt-demo');

  tiltCard.addEventListener('pointermove', (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width) - 0.5) * 18;
    const rotateX = (0.5 - (y / bounds.height)) * 18;

    tiltDemo.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  tiltCard.addEventListener('pointerleave', () => {
    tiltDemo.style.transform = '';
  });
}
