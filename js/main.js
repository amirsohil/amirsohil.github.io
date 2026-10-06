/* Amir Sohil — Portfolio: shared site behaviour */

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  initMobileNav();
  initHeroCanvas();
  initMarquee();
  initBackToTop();
  initContactForm();
  initCopyButtons();
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
});

/* ---------------- Active nav link ---------------- */
function markActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const target = a.getAttribute('href');
    if (target === path || (path === '' && target === 'index.html')) {
      a.classList.add('is-active');
    }
  });
}

/* ---------------- Mobile nav ---------------- */
function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!toggle || !overlay) return;
  const open = () => { overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('is-open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------------- Hero network canvas ----------------
   A sparse, slow-drifting node graph — a nod to graph-database
   work (Neo4j/Transferium) and "seeing the whole field." Pauses
   entirely under prefers-reduced-motion. */
function initHeroCanvas(){
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  let nodes = [];
  const LINK_DIST = 170;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 26000);
    nodes = Array.from({ length: Math.max(18, Math.min(count, 60)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.6,
      pulse: Math.random() * Math.PI * 2,
      lit: Math.random() < 0.12
    }));
  }

  function step(){
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy; n.pulse += 0.012;
      if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.strokeStyle = `rgba(205, 253, 80, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      const glow = n.lit ? (Math.sin(n.pulse) + 1) / 2 : 0;
      ctx.beginPath();
      ctx.fillStyle = n.lit ? `rgba(205, 253, 80, ${0.35 + glow * 0.5})` : 'rgba(243, 242, 233, 0.28)';
      ctx.arc(n.x, n.y, n.r + (n.lit ? glow * 1.2 : 0), 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  step();
  if (!reduceMotion) window.addEventListener('resize', resize);
}

/* ---------------- Marquee ---------------- */
function initMarquee(){
  document.querySelectorAll('.marquee-track').forEach(track => {
    // duplicate content once so the 50%-translate loop is seamless
    if (!track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = 'true';
    }
  });
}

/* ---------------- Back to top ---------------- */
function initBackToTop(){
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 700);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------- Contact form → mailto ----------------
   No backend on GitHub Pages, so this composes a mailto: link
   from the fields and opens the visitor's mail client directly. */
function initContactForm(){
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
    window.location.href = `mailto:bhmasohail@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ---------------- Copy-to-clipboard ---------------- */
function initCopyButtons(){
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1600);
      } catch {
        btn.textContent = 'Press Cmd/Ctrl+C';
      }
    });
  });
}
