/* Wholehearted Legacy — Prayer Wall (client render)
   Data source: Live JSON from Apps Script Web App (/exec)
*/
(function(){
  const DATA_URL = "https://script.google.com/macros/s/AKfycbyPz3RQjAt8pJZLjg4OuK6N_J5jy3v4HnNuo5LBhfGAi1pdOdCoRxj0HnQKwlDmsVtUqw/exec";

  function esc(s){
    return String(s || '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  }

  function render(rows){
    const LIST = document.getElementById('wl-list');
    const CARD_TPL = document.getElementById('wl-card');

    if (!Array.isArray(rows) || rows.length === 0) {
      LIST.innerHTML = '<p style="color:#786d66">No public prayers yet.</p>';
      return;
    }

    // Data from Apps Script already filters to public and sorts newest first
    const frag = document.createDocumentFragment();

    rows.forEach(p => {
      const node = CARD_TPL.content.cloneNode(true);
      node.querySelector('.wl-name').textContent = p.name || 'Anonymous';
      node.querySelector('.wl-time').textContent = p.time || '';
      // Keep HTML-safe text rendering
      node.querySelector('.wl-text').innerHTML = esc(p.text || '');
      frag.appendChild(node);
    });

    LIST.innerHTML = '';
    LIST.appendChild(frag);
  }

  async function load(){
    const LIST = document.getElementById('wl-list');
    try {
      // Prevent stale caching; handle CORS-friendly fetch
      const res = await fetch(DATA_URL + `?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error(err);
      LIST.innerHTML = '<p style="color:#a00">There was a problem loading prayers. Please try again shortly.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
