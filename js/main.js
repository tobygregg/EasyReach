/* ==========================================================================
   EASY REACH — INTERACTIONS
   --------------------------------------------------------------------------
   Plain JavaScript, no build step. Sections (search for the headings):
   1. Header + sticky mobile CTA      4. Before/after sliders
   2. Mobile menu (sheet)             5. Floating bubbles
   3. Scroll reveal + van scene       6. Quote form (FormSubmit via fetch)
   3b. Services explorer (tabs, swipe, keyboard)
   ========================================================================== */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Header + sticky CTA ------------------------------------- */
  const header = $('#header');
  const sticky = $('#sticky-cta');
  const hero = $('#top');
  const quote = $('#quote');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    if (sticky) {
      const heroBottom = hero ? hero.offsetHeight - 160 : 400;
      const qTop = quote ? quote.getBoundingClientRect().top + y : Infinity;
      const inQuote = y + window.innerHeight > qTop + 240 && y < qTop + quote.offsetHeight - 200;
      const show = y > heroBottom && !inQuote;
      sticky.classList.toggle('show', show);
      sticky.setAttribute('aria-hidden', String(!show));
      $$('a', sticky).forEach((a) => (a.tabIndex = show ? 0 : -1));
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 2. Mobile menu --------------------------------------------- */
  const menu = $('#menu');
  const openBtn = $('#menu-open');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('[data-close].burger', menu)?.focus(), 50);
    else openBtn.focus({ preventScroll: true });
  };
  openBtn?.addEventListener('click', () => setMenu(true));
  $$('[data-close]', menu).forEach((el) => el.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches && menu.classList.contains('open')) setMenu(false); });

  /* ---------- 3. Scroll reveal + van scene ------------------------------- */
  const reveals = $$('.reveal, .reveal-left');
  const observed = $$('[data-observe]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io2.unobserve(en.target); } });
    }, { threshold: 0.35 });
    observed.forEach((el) => io2.observe(el));
  } else {
    reveals.concat(observed).forEach((el) => el.classList.add('in'));
  }
  // hero marker highlight
  $$('.marker').forEach((m) => m.classList.add('in'));

  /* ---------- 3b. Services explorer -------------------------------------- */
  const exp = $('[data-svc]');
  if (exp) {
    const list = $('.svc-tabs', exp);
    const tabs = $$('.svc-tab', exp);
    const panels = $$('.svc-panel', exp);
    const ind = $('.svc-ind', exp);
    const wrap = $('.svc-panels', exp);
    const desktop = window.matchMedia('(min-width: 1024px)');
    let cur = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));

    const placeIndicator = () => {
      if (!ind) return;
      const t = tabs[cur];
      if (desktop.matches) {
        ind.style.height = t.offsetHeight + 'px';
        ind.style.transform = `translateY(${t.offsetTop}px)`;
        ind.style.opacity = '1';
      } else ind.style.opacity = '0';
    };

    const go = (i, { focus = false, scroll = true } = {}) => {
      i = (i + tabs.length) % tabs.length;
      const first = panels.every((p) => !p.classList.contains('active'));
      if (i === cur && !first) { if (focus) tabs[i].focus(); return; }
      cur = i;
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p, k) => {
        const on = k === i;
        p.hidden = !on;
        p.classList.remove('active');
        if (on) { void p.offsetWidth; p.classList.add('active'); }   // restart the entrance animations
      });
      placeIndicator();
      if (scroll && !desktop.matches) {
        const t = tabs[i];
        list.scrollTo({ left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
      if (focus) tabs[i].focus();
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => go(i));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        if (k === 'ArrowDown' || k === 'ArrowRight') { go(i + 1, { focus: true }); e.preventDefault(); }
        else if (k === 'ArrowUp' || k === 'ArrowLeft') { go(i - 1, { focus: true }); e.preventDefault(); }
        else if (k === 'Home') { go(0, { focus: true }); e.preventDefault(); }
        else if (k === 'End') { go(tabs.length - 1, { focus: true }); e.preventDefault(); }
      });
    });
    exp.addEventListener('click', (e) => {
      if (e.target.closest('.svc-next')) go(cur + 1, { scroll: true });
      else if (e.target.closest('.svc-prev')) go(cur - 1, { scroll: true });
    });

    // Swipe the photo card on touch screens
    let sx = 0, sy = 0, tracking = false;
    wrap.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    desktop.addEventListener('change', placeIndicator);
    window.addEventListener('resize', placeIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);
    go(cur, { scroll: false });
    placeIndicator();
  }

  /* ---------- 4. Before / after sliders ---------------------------------- */
  $$('[data-ba]').forEach((el) => {
    let dragging = false;
    let pos = 50;
    const set = (p, announce = true) => {
      pos = Math.max(0, Math.min(100, p));
      el.style.setProperty('--pos', pos + '%');
      if (announce) el.setAttribute('aria-valuenow', Math.round(pos));
    };
    const fromEvent = (e) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
      fromEvent(e);
      stopHint();
    });
    el.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    const end = () => { dragging = false; el.classList.remove('dragging'); };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft') { set(pos - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { set(pos + step); e.preventDefault(); }
      else if (e.key === 'Home') { set(0); e.preventDefault(); }
      else if (e.key === 'End') { set(100); e.preventDefault(); }
      stopHint();
    });

    // Gentle "come play with me" nudge the first time it scrolls into view
    let hinted = false;
    let raf;
    function stopHint() { hinted = true; cancelAnimationFrame(raf); }
    if (!reduce && 'IntersectionObserver' in window) {
      const hio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting || hinted) return;
          hinted = true; hio.disconnect();
          const t0 = performance.now(), dur = 2200;
          const tick = (t) => {
            const k = Math.min(1, (t - t0) / dur);
            if (dragging) return;
            set(50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k * 0.2), false);
            if (k < 1) raf = requestAnimationFrame(tick); else set(50, false);
          };
          setTimeout(() => { raf = requestAnimationFrame(tick); }, 500);
        });
      }, { threshold: 0.6 });
      hio.observe(el);
    }
  });

  /* ---------- 5. Floating bubbles ---------------------------------------- */
  if (!reduce) {
    $$('[data-bubbles]').forEach((wrap) => {
      const n = parseInt(wrap.dataset.bubbles, 10) || 12;
      for (let i = 0; i < n; i++) {
        const b = document.createElement('span');
        b.className = 'bubble';
        const size = 8 + Math.random() * 40;
        b.style.cssText =
          `--x:${(Math.random() * 100).toFixed(1)}%;--size:${size.toFixed(0)}px;` +
          `--dur:${(9 + Math.random() * 11).toFixed(1)}s;--delay:${(-Math.random() * 20).toFixed(1)}s;` +
          `--sway:${(-30 + Math.random() * 60).toFixed(0)}px;--rise:${(wrap.offsetHeight * 1.1 || 600).toFixed(0)}px`;
        wrap.appendChild(b);
      }
    });
  }

  /* ---------- Reviews: clone the row so the strip loops forever ---------- */
  $$('.rev-track').forEach((track) => {
    const set = $('.rev-set', track);
    if (!set || track.querySelector('.rev-set[aria-hidden]')) return;
    const clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('a, button', clone).forEach((el) => (el.tabIndex = -1));
    track.appendChild(clone);
  });

  /* ---------- Service buttons pre-select the form dropdown --------------- */
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => {
    const sel = $('#f-service');
    if (!sel) return;
    const v = a.dataset.service;
    const opt = [...sel.options].find((o) => o.textContent.trim().toLowerCase() === v.toLowerCase());
    if (opt) sel.value = opt.value || opt.textContent;
  }));

  /* ---------- 6. Quote form (FormSubmit, AJAX) --------------------------- */
  const form = $('#quote-form');
  if (form) {
    const btn = $('#form-submit');
    const err = $('#form-error');
    const ok = $('#form-success');
    const fields = $('.form-fields', form);
    const showError = (msg) => { err.textContent = msg; err.classList.remove('hidden'); };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.classList.add('hidden');

      // Honeypot filled in = bot. Pretend success.
      if ($('[name="_honey"]', form).value) { fields.style.display = 'none'; ok.classList.add('show'); return; }

      // Basic validation
      const missing = $$('[required]', form).find((f) => !f.value.trim());
      if (missing) { missing.focus(); showError('Please fill in the fields marked with *'); return; }
      const email = $('[name="email"]', form);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.focus(); showError('That email address doesn’t look right. Could you check it?'); return; }

      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      try {
        // FormSubmit AJAX endpoint (same address as the form action)
        const url = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const res = await fetch(url, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === 'false' || data.success === false) throw new Error(data.message || 'Request failed');
        fields.style.display = 'none';
        ok.classList.add('show');
        ok.focus({ preventScroll: true });
        ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        form.reset();
      } catch (_) {
        showError('Sorry, something went wrong sending that. Please try again, or call us on 07781 112 488.');
      } finally {
        btn.removeAttribute('aria-busy');
        btn.disabled = false;
      }
    });
  }

  /* ---------- Footer year ------------------------------------------------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
