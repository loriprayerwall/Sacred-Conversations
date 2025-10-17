/* Wholehearted Legacy — Prayer Wall (client render) */
/* Data source: prayers.json hosted in the same GitHub Pages repo */

(function(){
  function esc(s){
    return String(s || '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  }

  function render(prayers){
    const LIST = document.getElementById('wl-list');
    const CARD_TPL = document.getElementById('wl-card');

    if (!Array.isArray(prayers) || prayers.length === 0) {
      LIST.innerHTML = '<p style="color:#786d66">No public prayers yet.</p>';
      return;
    }

    const pub = prayers
      .filter(p => String(p.public || 'YES').toUpperCase() === 'YES')
      .sort((a,b) => new Date(b.time || 0) - new Date(a.time || 0));

    const frag = document.createDocumentFragment();

    pub.forEach(p => {
      const node = CARD_TPL.content.cloneNode(true);
      node.querySelector('.wl-name').textContent = p.name || 'Anonymous';
      node.querySelector('.wl-time').textContent = p.time || '';
      node.querySelector('.wl-text').innerHTML = esc(p.text || '');
      frag.appendChild(node);
    });

    LIST.innerHTML = '';
    LIST.appendChild(frag);
  }

  async function load(){
    try {
      const res = await fetch('https://loriprayerwall.github.io/Sacred-Conversations/prayers.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load prayers.json');
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error(err);
      const LIST = document.getElementById('wl-list');
      LIST.innerHTML = '<p style="color:#a00">There was a problem loading prayers. Please try again shortly.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
