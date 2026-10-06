/* Amir Sohil — Portfolio: landing page preview sections */

document.addEventListener('DOMContentLoaded', async () => {
  loadInto('#featured-work', 'data/projects.json', renderProjectCard);
  loadInto('#featured-writing', 'data/essays.json', renderEssayRow);
});

async function loadInto(selector, source, renderer){
  const mount = document.querySelector(selector);
  if (!mount) return;
  try {
    const res = await fetch(source);
    const items = (await res.json()).filter(i => i.featured);
    mount.innerHTML = items.map(renderer).join('');
  } catch {
    mount.innerHTML = '';
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function renderProjectCard(item){
  const tags = [...(item.tools || []), ...(item.skills || [])].slice(0, 3)
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  return `
    <a class="card" href="${item.href}">
      <div class="card-media"><img src="${item.image}" alt="" loading="lazy"></div>
      <div class="card-body">
        <div class="card-tags">${tags}</div>
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-desc">${escapeHtml(item.description)}</p>
        <span class="card-link">View project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
      </div>
    </a>`;
}

function renderEssayRow(item){
  return `
    <a class="contact-row" href="${item.href}" style="text-decoration:none;">
      <span class="v" style="gap:18px;">
        <span class="k" style="width:110px; flex-shrink:0;">${(item.skills && item.skills[0]) ? escapeHtml(item.skills[0]) : 'Essay'}</span>
        <span style="color:var(--text); font-weight:600;">${escapeHtml(item.title)}</span>
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><path d="M7 17 17 7M7 7h10v10"/></svg>
    </a>`;
}
