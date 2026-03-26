/* ============================================================
   FAB IMPACT SIGNWORKS — main.js v5
   ============================================================
   Changes from v4:
   - Navbar hide/show on scroll removed
   - Hamburger / mobile menu removed
   - Active nav link highlighting removed
   - Smooth scroll updated (offset now topbar only)

   Remaining modules:
   1.  Header height offset (CSS variables)
   2.  Scroll reveal — IntersectionObserver
   3.  Counter animation — stats numbers
   4.  Smooth scroll — with topbar offset
   5.  Hero scroll indicator — fade on scroll
   6.  FAQ accordion
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HEADER HEIGHT
     Sets --topbar-h CSS variable so all scroll offsets stay
     accurate on any screen size or zoom level.
     Navbar is removed in v5 so --navbar-h stays 0px from CSS.
  ============================================================ */
  const topbar = document.getElementById('topbar');

  function setHeaderHeights() {
    if (topbar) {
      document.documentElement.style.setProperty('--topbar-h', topbar.offsetHeight + 'px');
    }
  }

  setHeaderHeights();
  window.addEventListener('resize', setHeaderHeights, { passive: true });


  /* ============================================================
     2. SCROLL REVEAL
     Watches all .reveal, .reveal-left, .reveal-right elements.
     Adds .visible once they enter the viewport.
     Unobserves after firing — each element animates once only.
  ============================================================ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ============================================================
     3. COUNTER ANIMATION
     Watches the stats section. When it enters the viewport,
     counts up project and year numbers with an ease-out curve.
     Fires once only.
  ============================================================ */
  const countProjects = document.getElementById('count-projects');
  const countYears    = document.getElementById('count-years');
  let countersStarted = false;

  function animateCounter(el, target, duration) {
    if (!el) return;
    const startTime = performance.now();

    function tick(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.stats');

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounter(countProjects, 100, 1800);
          animateCounter(countYears,    5,   1200);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }


  /* ============================================================
     4. SMOOTH SCROLL
     Intercepts all anchor link clicks and scrolls smoothly
     with the topbar height subtracted from the offset.
     Navbar is gone in v5 so only topbar height is needed.
  ============================================================ */
  function getHeaderOffset() {
    return (topbar ? topbar.offsetHeight : 0) + 16; // 16px extra breathing room
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const offset = targetEl.getBoundingClientRect().top
                   + window.scrollY
                   - getHeaderOffset();

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ============================================================
     5. HERO SCROLL INDICATOR
     Fades out the scroll arrow as the user scrolls down.
     Fully invisible by 200px scroll depth.
  ============================================================ */
  const heroScroll = document.querySelector('.hero__scroll');

  if (heroScroll) {
    window.addEventListener('scroll', () => {
      const opacity = Math.max(0, 1 - window.scrollY / 200);
      heroScroll.style.opacity = opacity;
    }, { passive: true });
  }


  /* ============================================================
     6. FAQ ACCORDION
     One question open at a time.
     Clicking an open question closes it.
     Clicking a closed question opens it and closes any other.
  ============================================================ */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all items first
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq__question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // If this item was closed, open it
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

});
