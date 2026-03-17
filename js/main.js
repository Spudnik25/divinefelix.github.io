/* ============================================
   DIVINE FELIX PORTFOLIO — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Custom Cursor ---- */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    });

    const animFollower = () => {
      followerX += (mouseX - followerX - 18) * 0.12;
      followerY += (mouseY - followerY - 18) * 0.12;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animFollower);
    };
    animFollower();

    document.querySelectorAll('a, button, .work-item, .service-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ---- Sticky Nav ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile Menu ---- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Skill Bars ---- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width;
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---- Portfolio Filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.portfolio-item[data-cat]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      workItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = show ? '1' : '0.2';
        item.style.pointerEvents = show ? 'auto' : 'none';
        item.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      });
    });
  });

  /* ---- Newsletter Form — ConvertKit ---- */
  const CK_API_KEY = 'LZLKAgZulQDRjEroi629QA';
  const CK_FORM_ID = '9209140';

  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');

      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#ff4444';
        return;
      }
      input.style.borderColor = '';
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${CK_FORM_ID}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: CK_API_KEY, email: input.value })
        });
        const data = await res.json();
        if (res.ok && data.subscription) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = '#22c55e';
          input.value = '';
          setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; btn.disabled = false; }, 3000);
        } else {
          throw new Error('Failed');
        }
      } catch {
        btn.textContent = 'Try again';
        btn.style.background = '#ff4444';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      }
    });
  });

  /* ---- Contact Form — handled in contact.html ---- */

  /* ---- Marquee duplicate items for seamless loop ---- */
  const tracks = document.querySelectorAll('.marquee-track');
  tracks.forEach(track => {
    if (!track.querySelector('.marquee-clone')) {
      const clone = track.innerHTML;
      track.innerHTML += clone.replace(/marquee-item/g, 'marquee-item marquee-clone');
    }
  });

  /* ---- Smooth section link scrolling ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Number counter animation ---- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---- Testimonials drag scroll ---- */
  const tracks2 = document.querySelectorAll('.testimonials-track');
  tracks2.forEach(track => {
    let isDragging = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', e => {
      isDragging = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => isDragging = false);
    track.addEventListener('mouseup', () => isDragging = false);
    track.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });
  });

  console.log('%cDivine Felix Portfolio — Built with ❤️', 'color: #FF3D00; font-size: 14px; font-weight: bold;');
});
