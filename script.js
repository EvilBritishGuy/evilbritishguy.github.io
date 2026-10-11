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

const constellationCanvas = document.querySelector('.constellation-canvas');

if (constellationCanvas) {
  const context = constellationCanvas.getContext('2d');

  if (context) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const paths = [
      [[0.2, 0.27], [0.43, 0.27]],
      [[0.43, 0.27], [0.43, 0.65], [0.4, 0.73], [0.33, 0.78], [0.24, 0.78], [0.18, 0.73]],
      [[0.59, 0.28], [0.59, 0.76]],
      [[0.81, 0.28], [0.81, 0.76]],
      [[0.59, 0.51], [0.81, 0.51]]
    ];
    const pointer = { x: -1000, y: -1000, active: false };
    let particles = [];
    let width = 0;
    let height = 0;
    let isVisible = false;
    let animationFrame = null;

    const createParticles = () => {
      particles = [];

      paths.forEach((path) => {
        for (let segment = 0; segment < path.length - 1; segment += 1) {
          const start = path[segment];
          const end = path[segment + 1];
          const dx = (end[0] - start[0]) * width;
          const dy = (end[1] - start[1]) * height;
          const steps = Math.max(1, Math.round(Math.hypot(dx, dy) / 11));

          for (let step = 0; step <= steps; step += 1) {
            const progress = step / steps;
            const x = (start[0] + (end[0] - start[0]) * progress) * width;
            const y = (start[1] + (end[1] - start[1]) * progress) * height;
            particles.push({
              x,
              y,
              homeX: x,
              homeY: y,
              vx: 0,
              vy: 0,
              size: 0.9 + Math.random() * 1.1,
              phase: Math.random() * Math.PI * 2,
              color: Math.random() > 0.82 ? '#f3d697' : '#9be9df'
            });
          }
        }
      });

      for (let index = 0; index < 48; index += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          size: 0.45 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
          color: '#d5e8ef'
        });
      }
    };

    const resizeCanvas = () => {
      const bounds = constellationCanvas.getBoundingClientRect();
      const mobilePixelRatio = window.matchMedia('(max-width: 720px)').matches ? 1.25 : 2;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, mobilePixelRatio);
      width = bounds.width;
      height = bounds.height;
      constellationCanvas.width = Math.round(width * pixelRatio);
      constellationCanvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const render = (time = 0) => {
      animationFrame = null;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (pointer.active && distance < 112) {
          const force = (1 - distance / 112) * 1.45;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx += (particle.homeX - particle.x) * 0.018;
        particle.vy += (particle.homeY - particle.y) * 0.018;
        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const twinkle = reducedMotion.matches ? 1 : 0.72 + Math.sin(time * 0.0015 + particle.phase) * 0.28;
        const speed = Math.hypot(particle.vx, particle.vy);
        const radius = particle.size + Math.min(speed * 0.16, 1.3);

        context.globalAlpha = twinkle;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = particle.size > 1.3 ? 10 : 5;
        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;

      if (isVisible) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    constellationCanvas.addEventListener('pointermove', (event) => {
      const bounds = constellationCanvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });

    constellationCanvas.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    new ResizeObserver(resizeCanvas).observe(constellationCanvas);
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible && animationFrame === null) {
        animationFrame = requestAnimationFrame(render);
      } else if (!isVisible && animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }).observe(constellationCanvas);
    resizeCanvas();
  }
}

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
