/* Amir Sohil — Portfolio: search + tag filter engine
   Powers both portfolio.html and essays.html. The host page sets
   window.FILTER_CONFIG = { source, mount, itemNoun } before this loads. */

document.addEventListener('DOMContentLoaded', async () => {
  const config = window.FILTER_CONFIG;
  if (!config) return;

  const mount = document.querySelector(config.mount);
  if (!mount) return;

  let items = [];
  try {
    const res = await fetch(config.source);
    items = await res.json();
  } catch (err) {
    mount.innerHTML = `<div class="empty-state">Couldn't load ${config.itemNoun} right now \u2014 try refreshing.</div>`;
    return;
  }

  const state = { query: '', tools: new Set(), skills: new Set() };

  const toolNames = uniqueSorted(items.flatMap(i => i.tools || []));
  const skillNames = uniqueSorted(items.flatMap(i => i.skills || []));

  buildFilterPanel(toolNames, skillNames);
  render();

  function uniqueSorted(arr){
    return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
  }

  function buildFilterPanel(tools, skills){
    const panel = document.querySelector('#filter-panel');
    if (!panel) return;

    const searchInput = panel.querySelector('#filter-search');
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });

    renderChipGroup(panel.querySelector('#filter-tools'), tools, state.tools);
    renderChipGroup(panel.querySelector('#filter-skills'), skills, state.skills);

    panel.querySelector('.filter-clear').addEventListener('click', () => {
      state.query = '';
      state.tools.clear();
      state.skills.clear();
      searchInput.value = '';
      panel.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      render();
    });
  }

  function renderChipGroup(container, values, targetSet){
    if (!container) return;
    container.innerHTML = values.map(v =>
      `<button class="chip" type="button" data-value="${escapeHtml(v)}">${escapeHtml(v)}</button>`
    ).join('');
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-value');
        if (targetSet.has(val)) { targetSet.delete(val); chip.classList.remove('is-active'); }
        else { targetSet.add(val); chip.classList.add('is-active'); }
        render();
      });
    });
  }

  function matches(item){
    const haystack = `${item.title} ${item.subtitle || ''} ${item.description}`.toLowerCase();
    if (state.query && !haystack.includes(state.query)) return false;
    if (state.tools.size && !(item.tools || []).some(t => state.tools.has(t))) return false;
    if (state.skills.size && !(item.skills || []).some(s => state.skills.has(s))) return false;
    return true;
  }

  function render(){
    const visible = items.filter(matches);
    const countEl = document.querySelector('#filter-count');
    if (countEl) countEl.textContent = `${visible.length} of ${items.length}`;

    if (!visible.length) {
      mount.innerHTML = `<div class="empty-state">No ${config.itemNoun} match those filters. Try clearing a tag or two.</div>`;
      return;
    }

    mount.innerHTML = visible.map(cardHtml).join('');
  }

  function cardHtml(item){
    const tags = [
      ...(item.tools || []).map(t => `<span class="tag tool">${escapeHtml(t)}</span>`),
      ...(item.skills || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`)
    ].join('');
    return `
      <a class="card" href="${item.href}">
        <div class="card-media"><img src="${item.image}" alt="" loading="lazy"></div>
        <div class="card-body">
          <div class="card-tags">${tags}</div>
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-desc">${escapeHtml(item.description)}</p>
          <span class="card-link">${config.linkLabel || 'View'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
        </div>
      </a>`;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
});
