// FAQ interactions: search + accessible accordion
// Place this file at assets/js/faq.js and include with `defer` in HTML

document.addEventListener('DOMContentLoaded', () => {
  // Config: allow multiple open items?
  const allowMultiple = (document.querySelector('#faq-accordion')?.dataset.allowMultiple === 'true');

  // Elements
  const accordion = document.getElementById('faq-accordion');
  const toggles = accordion ? Array.from(accordion.querySelectorAll('.accordion-toggle')) : [];
  const panels = accordion ? Array.from(accordion.querySelectorAll('.accordion-panel')) : [];
  const searchInput = document.getElementById('faq-search');
  const clearBtn = document.getElementById('clear-search');

  // ---------- Accessible accordion behavior ----------
  toggles.forEach(button => {
    // Keyboard: Enter / Space toggle
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
      // allow arrow navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = toggles.indexOf(button);
        const nextIdx = e.key === 'ArrowDown' ? (idx + 1) % toggles.length : (idx - 1 + toggles.length) % toggles.length;
        toggles[nextIdx].focus();
      }
    });

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const panelId = button.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      if (!allowMultiple) {
        // close others
        toggles.forEach(t => {
          if (t !== button) {
            t.setAttribute('aria-expanded', 'false');
            const otherPanel = document.getElementById(t.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.hidden = true;
          }
        });
      }

      // toggle clicked
      button.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) panel.hidden = isExpanded; // if was expanded, hide; else show
    });
  });

  // Close all on load (ensure ARIA states are consistent)
  toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  panels.forEach(p => p.hidden = true);

  // ---------- Live search ----------
  if (searchInput) {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    const noResultEl = document.createElement('p');
    noResultEl.className = 'no-results';
    noResultEl.textContent = 'No results found. Try different keywords.';
    noResultEl.style.color = 'var(--muted)';
    noResultEl.style.marginTop = '12px';

    function normalize(s) {
      return s.trim().toLowerCase();
    }

    function filterFAQs() {
      const q = normalize(searchInput.value || '');
      let visibleCount = 0;

      items.forEach(item => {
        const questionEl = item.querySelector('.q');
        const panelEl = item.querySelector('.accordion-panel');
        const text = [
          questionEl?.textContent || '',
          panelEl?.textContent || ''
        ].join(' ').toLowerCase();

        if (!q || text.includes(q)) {
          item.style.display = ''; // show
          visibleCount++;
        } else {
          item.style.display = 'none'; // hide
        }
      });

      // show no-results when needed
      const parent = document.querySelector('.accordion');
      if (parent) {
        const existing = parent.querySelector('.no-results');
        if (visibleCount === 0) {
          if (!existing) parent.appendChild(noResultEl);
        } else {
          if (existing) existing.remove();
        }
      }
    }

    searchInput.addEventListener('input', filterFAQs);
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      filterFAQs();
    });
  }

  // ---------- Progressive enhancement: expand first item on larger screens ----------
  if (window.matchMedia && window.matchMedia('(min-width:920px)').matches) {
    const firstToggle = toggles[0];
    if (firstToggle) {
      firstToggle.setAttribute('aria-expanded', 'true');
      const panel = document.getElementById(firstToggle.getAttribute('aria-controls'));
      if (panel) panel.hidden = false;
    }
  }

  // ---------- small helper: update year in footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
