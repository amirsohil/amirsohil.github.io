/* Amir Sohil — Portfolio: detail page behaviours
   Used by project-page-template.html / essay-page-template.html
   (and any page you build from them). Loads after js/main.js. */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initScrollspy();
  initAccordion();
  initTabs();
  initCounters();
  initGalleryLightbox();
  initDemoSlider();
  initFootnotes();
  initRevealOnScroll();
  initShareLink();
  initReadingTime();
  initRelated();
});

/* ---------------- Reading progress bar ---------------- */
function initProgressBar(){
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------------- TOC scrollspy ---------------- */
function initScrollspy(){
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (!links.length) return;
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: '-100px 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ---------------- Accordion ---------------- */
function initAccordion(){
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    const item = trigger.closest('.accordion-item');
    const panel = item.querySelector('.accordion-panel');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // close siblings for a cleaner single-open feel; delete this loop to allow several open at once
      item.parentElement.querySelectorAll('.accordion-item.is-open').forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('is-open');
          sibling.querySelector('.accordion-panel').style.maxHeight = null;
          sibling.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : null;
    });
  });
}

/* ---------------- Tabs ---------------- */
function initTabs(){
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = [...tabs.querySelectorAll('.tab-btn')];
    const panels = [...tabs.querySelectorAll('.tab-panel')];
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        panels[i]?.classList.add('is-active');
      });
    });
  });
}

/* ---------------- Animated stat counters ---------------- */
function initCounters(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(n => observer.observe(n));
}

/* ---------------- Gallery lightbox ---------------- */
function initGalleryLightbox(){
  const galleries = document.querySelectorAll('.gallery-grid');
  if (!galleries.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lightbox-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <button class="lightbox-prev" aria-label="Previous">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
    </button>
    <img alt="">
    <button class="lightbox-next" aria-label="Next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
    </button>`;
  document.body.appendChild(box);

  const img = box.querySelector('img');
  let current = [];
  let index = 0;

  const open = (images, i) => {
    current = images; index = i;
    img.src = current[index].src;
    img.alt = current[index].alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { box.classList.remove('is-open'); document.body.style.overflow = ''; };
  const step = (dir) => {
    index = (index + dir + current.length) % current.length;
    img.src = current[index].src;
    img.alt = current[index].alt || '';
  };

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  galleries.forEach(gallery => {
    const thumbs = [...gallery.querySelectorAll('button img')];
    thumbs.forEach((thumb, i) => {
      thumb.closest('button').addEventListener('click', () => open(thumbs, i));
    });
  });
}

/* ---------------- Generic "try it" demo slider ----------------
   Wire any <input type="range"> inside a .demo-panel to a readout
   and a bar fill. Swap the formula in `compute()` for your own. */
function initDemoSlider(){
  document.querySelectorAll('.demo-panel[data-demo]').forEach(panel => {
    const input = panel.querySelector('input[type="range"]');
    const readout = panel.querySelector('.demo-readout');
    const bar = panel.querySelector('.demo-bar-fill');
    if (!input) return;

    const unit = panel.getAttribute('data-unit') || '';

    // Example formula: readout mirrors the slider directly, bar fills
    // proportionally to the slider's range. Replace `compute` with
    // whatever your demo is actually illustrating.
    const compute = (val) => val;

    const update = () => {
      const min = parseFloat(input.min || 0);
      const max = parseFloat(input.max || 100);
      const val = parseFloat(input.value);
      const result = compute(val);
      if (readout) readout.textContent = `${result}${unit}`;
      if (bar) bar.style.width = `${((val - min) / (max - min)) * 100}%`;
    };

    input.addEventListener('input', update);
    update();
  });
}

/* ---------------- Footnotes: jump + highlight ---------------- */
function initFootnotes(){
  document.querySelectorAll('.fn-ref').forEach(ref => {
    ref.addEventListener('click', (e) => {
      const target = document.querySelector(ref.getAttribute('href'));
      if (!target) return;
      target.classList.add('fn-highlight');
      setTimeout(() => target.classList.remove('fn-highlight'), 1600);
    });
  });
}

/* ---------------- Reveal on scroll ---------------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(i => observer.observe(i));
}

/* ---------------- Copy page link ---------------- */
function initShareLink(){
  document.querySelectorAll('[data-copy-link]').forEach(btn => {
    const original = btn.innerHTML;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        btn.textContent = 'Copied';
        setTimeout(() => { btn.innerHTML = original; }, 1600);
      } catch {
        btn.textContent = 'Press Cmd/Ctrl+C';
      }
    });
  });
}

/* ---------------- Auto reading time ---------------- */
function initReadingTime(){
  const el = document.querySelector('[data-reading-time]');
  const prose = document.querySelector('.prose');
  if (!el || !prose) return;
  const words = prose.textContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  el.textContent = `${minutes} min read`;
}

/* ---------------- "More work" / "Read next" ---------------- */
async function initRelated(){
  const mount = document.querySelector('[data-related-source]');
  if (!mount) return;
  const source = mount.getAttribute('data-related-source');
  const exclude = mount.getAttribute('data-related-exclude') || '';
  const limit = parseInt(mount.getAttribute('data-related-limit') || '3', 10);
  try {
    const res = await fetch(source);
    const items = (await res.json()).filter(i => i.title !== exclude).slice(0, limit);
    mount.innerHTML = items.map(item => {
      const tags = [...(item.tools || []), ...(item.skills || [])].slice(0, 2)
        .map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
      return `
        <a class="card" href="${item.href}">
          <div class="card-media"><img src="${item.image}" alt="" loading="lazy"></div>
          <div class="card-body">
            <div class="card-tags">${tags}</div>
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            <p class="card-desc">${escapeHtml(item.description)}</p>
            <span class="card-link">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
          </div>
        </a>`;
    }).join('');
  } catch {
    mount.closest('section')?.remove();
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
