/* ============================================================
   SumCars — Premium Azerbaijani Automotive Marketplace
   app.js | Production Build
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     0. Helpers
  ---------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function throttle(fn, wait) {
    let last = 0;
    return function throttled(...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  function buttonsByText(text) {
    return $$('button').filter((b) => b.textContent.trim() === text);
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPlaceholderLinks();
    initHeaderScroll();
    initMobileNav();
    initSignInModal();
    initWishlist();
    initCardClickThrough();
    initViewToggle();
    initPagination();
    initHeroSearch();
    initSortSelect();
    initNavActiveState();
    initBodyTypeFilters();
    initBrandFilters();
    initCtaButtons();
    initFilterAndTabDelegation();
    initStatCounters();
    initScrollReveal();
  }

  /* ----------------------------------------------------------
     1. Toast notifications
  ---------------------------------------------------------- */
  const toastContainer = $('#toastContainer');
  const TOAST_ICONS = { success: '✓', error: '!', warning: '!', info: 'i' };

  function toast(type, title, message, duration) {
    if (!toastContainer) return;
    duration = duration || 4200;

    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', 'status');

    const icon = document.createElement('div');
    icon.className = 'toast__icon';
    icon.textContent = TOAST_ICONS[type] || TOAST_ICONS.info;

    const body = document.createElement('div');
    body.className = 'toast__body';

    const titleEl = document.createElement('div');
    titleEl.className = 'toast__title';
    titleEl.textContent = title;

    const msgEl = document.createElement('div');
    msgEl.className = 'toast__message';
    msgEl.textContent = message;

    body.appendChild(titleEl);
    body.appendChild(msgEl);
    el.appendChild(icon);
    el.appendChild(body);
    toastContainer.appendChild(el);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      el.classList.add('is-leaving');
      el.addEventListener('animationend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 600); // fallback in case animationend never fires
    };

    const timer = setTimeout(dismiss, duration);
    el.addEventListener('click', () => {
      clearTimeout(timer);
      dismiss();
    });
  }

  /* ----------------------------------------------------------
     2. Placeholder links ("#") shouldn't jump the page
  ---------------------------------------------------------- */
  function initPlaceholderLinks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href="#"]');
      if (a) e.preventDefault();
    });
  }

  /* ----------------------------------------------------------
     3. Header — scroll state
  ---------------------------------------------------------- */
  function initHeaderScroll() {
    const header = $('#siteHeader');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', throttle(onScroll, 100));
    onScroll();
  }

  /* ----------------------------------------------------------
     4. Mobile navigation drawer
  ---------------------------------------------------------- */
  let closeMobileNav = () => {};

  function initMobileNav() {
    const hamburger = $('#hamburgerBtn');
    const mobileNav = $('#mobileNav');
    if (!hamburger || !mobileNav) return;

    const setLock = (locked) => {
      // Only release the scroll lock if the sign-in modal isn't also open.
      const modal = $('#signInModal');
      const modalOpen = modal && modal.classList.contains('is-open');
      document.body.style.overflow = locked || modalOpen ? 'hidden' : '';
    };

    closeMobileNav = () => {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      setLock(false);
    };

    const toggle = () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      setLock(isOpen);
    };

    hamburger.addEventListener('click', toggle);
    $$('.mobile-nav__link').forEach((link) => link.addEventListener('click', closeMobileNav));
  }

  /* ----------------------------------------------------------
     5. Sign-in modal
  ---------------------------------------------------------- */
  function initSignInModal() {
    const modal = $('#signInModal');
    if (!modal) return;

    const closeBtn = $('#closeSignInModal');
    const cancelBtn = $('#cancelSignIn');
    const submitBtn = $('.modal__footer .btn--primary', modal);
    const emailInput = $('#signInEmail');
    const passInput = $('#signInPassword');

    const openTriggers = [$('#openSignIn'), $('.mobile-nav .btn--secondary')].filter(Boolean);

    let lastFocused = null;

    const open = () => {
      lastFocused = document.activeElement;
      closeMobileNav();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      const firstInput = $('input', modal);
      if (firstInput) firstInput.focus();
    };

    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    openTriggers.forEach((trigger) =>
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      })
    );

    closeBtn && closeBtn.addEventListener('click', close);
    cancelBtn && cancelBtn.addEventListener('click', close);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const setError = (input, msg) => {
      input.classList.add('is-error');
      let err = input.parentElement.querySelector('.form-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'form-error';
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
    };

    const clearError = (input) => {
      input.classList.remove('is-error');
      const err = input.parentElement.querySelector('.form-error');
      if (err) err.remove();
    };

    submitBtn &&
      submitBtn.addEventListener('click', () => {
        if (!emailInput || !passInput) return;
        let valid = true;

        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
          setError(emailInput, 'Enter a valid email address.');
          valid = false;
        } else {
          clearError(emailInput);
        }

        if (!passInput.value || passInput.value.length < 6) {
          setError(passInput, 'Password must be at least 6 characters.');
          valid = false;
        } else {
          clearError(passInput);
        }

        if (!valid) return;

        close();
        toast('success', 'Welcome Back', 'You have signed in successfully.');
        emailInput.value = '';
        passInput.value = '';
      });
  }

  /* ----------------------------------------------------------
     6. Wishlist toggle on car cards
  ---------------------------------------------------------- */
  function initWishlist() {
    $$('.car-card__wishlist').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.car-card');
        const title = (card && $('.car-card__title', card)?.textContent) || 'This vehicle';
        const saved = btn.classList.toggle('is-saved');
        btn.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Add to wishlist');
        toast(
          saved ? 'success' : 'info',
          saved ? 'Added to Wishlist' : 'Removed from Wishlist',
          `${title} ${saved ? 'has been saved to' : 'was removed from'} your wishlist.`
        );
      });
    });
  }

  /* ----------------------------------------------------------
     7. Car card click-through
  ---------------------------------------------------------- */
  function initCardClickThrough() {
    $$('.car-card').forEach((card) => {
      card.addEventListener('click', () => {
        const title = $('.car-card__title', card)?.textContent || 'this vehicle';
        toast('info', 'Opening Listing', `Full details for ${title} would open here in the live marketplace.`);
      });
    });
  }

  /* ----------------------------------------------------------
     8. Grid / list view toggle
  ---------------------------------------------------------- */
  function initViewToggle() {
    const toggle = $('.view-toggle');
    const wrap = $('#listings .grid');
    if (!toggle || !wrap) return;

    const buttons = $$('.view-toggle__btn', toggle);
    const gridBtn = buttons[0];
    const listBtn = buttons[1];
    if (!gridBtn || !listBtn) return;

    const setView = (mode) => {
      const cards = $$('.car-card', wrap);
      if (mode === 'grid') {
        gridBtn.classList.add('is-active');
        listBtn.classList.remove('is-active');
        wrap.classList.add('grid--cars');
        wrap.classList.remove('grid--listings');
        cards.forEach((c) => c.classList.remove('car-card--horizontal'));
      } else {
        listBtn.classList.add('is-active');
        gridBtn.classList.remove('is-active');
        wrap.classList.add('grid--listings');
        wrap.classList.remove('grid--cars');
        cards.forEach((c) => c.classList.add('car-card--horizontal'));
      }
    };

    gridBtn.addEventListener('click', () => setView('grid'));
    listBtn.addEventListener('click', () => setView('list'));
  }

  /* ----------------------------------------------------------
     9. Pagination
  ---------------------------------------------------------- */
  function initPagination() {
    const pagination = $('.pagination');
    if (!pagination) return;

    const buttons = $$('.page-btn', pagination);
    if (buttons.length < 3) return;

    const prevBtn = buttons[0];
    const nextBtn = buttons[buttons.length - 1];
    const numberBtns = buttons.filter((b) => /^\d+$/.test(b.textContent.trim()));

    const setActive = (btn, { scroll } = { scroll: true }) => {
      numberBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const idx = numberBtns.indexOf(btn);
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === numberBtns.length - 1;
      if (scroll) {
        $('#listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    numberBtns.forEach((btn) => btn.addEventListener('click', () => setActive(btn)));

    prevBtn.addEventListener('click', () => {
      const idx = numberBtns.findIndex((b) => b.classList.contains('is-active'));
      if (idx > 0) setActive(numberBtns[idx - 1]);
    });

    nextBtn.addEventListener('click', () => {
      const idx = numberBtns.findIndex((b) => b.classList.contains('is-active'));
      if (idx < numberBtns.length - 1) setActive(numberBtns[idx + 1]);
    });
  }

  /* ----------------------------------------------------------
     10. Hero search bar
  ---------------------------------------------------------- */
  function initHeroSearch() {
    const searchBtn = $('.search-bar__btn');
    const searchInput = $('.search-bar__input');
    if (!searchBtn) return;

    const runSearch = () => {
      const query = searchInput ? searchInput.value.trim() : '';
      $('#listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('info', 'Searching SumCars', query ? `Showing results for "${query}".` : 'Showing all featured listings.');
    };

    searchBtn.addEventListener('click', runSearch);
    searchInput &&
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          runSearch();
        }
      });
  }

  /* ----------------------------------------------------------
     11. Sort dropdown
  ---------------------------------------------------------- */
  function initSortSelect() {
    const sortSelect = $('.sort-select');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', () => {
      toast('info', 'Listings Sorted', `Now sorted by "${sortSelect.value}".`);
    });
  }

  /* ----------------------------------------------------------
     12. Header nav — active state for in-page links
  ---------------------------------------------------------- */
  function initNavActiveState() {
    $$('.nav__link[href^="#"]').forEach((link) => {
      if (link.getAttribute('href') === '#') return;
      link.addEventListener('click', () => {
        $$('.nav__link').forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });
  }

  /* ----------------------------------------------------------
     13. Browse-by-body-type filters
  ---------------------------------------------------------- */
  function initBodyTypeFilters() {
    $$('a.card').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const label = $('.text-md', card)?.textContent || 'this category';
        $('#listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('info', 'Filter Applied', `Showing ${label} listings.`);
      });
    });
  }

  /* ----------------------------------------------------------
     14. Brand strip filters
  ---------------------------------------------------------- */
  function initBrandFilters() {
    $$('.brand-strip__item').forEach((item) => {
      item.addEventListener('click', () => {
        $('#listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('info', 'Filter Applied', `Showing ${item.textContent.trim()} listings.`);
      });
    });
  }

  /* ----------------------------------------------------------
     15. Misc CTA buttons (text-matched, no IDs required)
  ---------------------------------------------------------- */
  function initCtaButtons() {
    buttonsByText('Browse Inventory').forEach((b) =>
      b.addEventListener('click', () => $('#listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    );

    buttonsByText('How It Works').forEach((b) =>
      b.addEventListener('click', () => {
        const heading = $$('.section-title').find((h) => h.textContent.includes('Why Choose'));
        heading?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
    );

    buttonsByText('List Your Car').forEach((b) =>
      b.addEventListener('click', () => {
        closeMobileNav();
        toast('info', 'List Your Car', "Our listing wizard would open here — snap a few photos and you're live in minutes.");
      })
    );

    buttonsByText('Get Free Valuation').forEach((b) =>
      b.addEventListener('click', () =>
        toast('info', 'Free Valuation', 'Tell us about your car and we will send an instant market estimate.')
      )
    );
  }

  /* ----------------------------------------------------------
     16. Generic delegation — filter groups, tabs, pills
     (defensive: harmless if these components aren't present)
  ---------------------------------------------------------- */
  function initFilterAndTabDelegation() {
    document.addEventListener('click', (e) => {
      const filterHeader = e.target.closest('.filter-group__header');
      if (filterHeader) {
        filterHeader.closest('.filter-group')?.classList.toggle('is-collapsed');
      }

      const tab = e.target.closest('.tab');
      if (tab) {
        const tabs = tab.closest('.tabs');
        $$('.tab', tabs).forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
      }

      const pillRemove = e.target.closest('.filter-pill__remove');
      if (pillRemove) {
        pillRemove.closest('.filter-pill')?.remove();
      }
    });
  }

  /* ----------------------------------------------------------
     17. Hero stat counters
  ---------------------------------------------------------- */
  function initStatCounters() {
    const stats = $$('.hero__stat-value');
    if (!stats.length) return;

    const animate = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d,]+)(.*)$/);
      if (!match) return;

      const suffix = match[2] || '';
      const hasComma = match[1].includes(',');
      const target = parseInt(match[1].replace(/,/g, ''), 10);
      if (Number.isNaN(target)) return;

      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = (hasComma ? value.toLocaleString('en-US') : String(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      stats.forEach((el) => io.observe(el));
    } else {
      stats.forEach(animate);
    }
  }

  /* ----------------------------------------------------------
     18. Scroll reveal for .fade-in / .stagger-children
  ---------------------------------------------------------- */
  function initScrollReveal() {
    const revealEls = $$('.fade-in, .stagger-children').filter((el) => !el.classList.contains('is-visible'));
    if (!revealEls.length || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
})();
