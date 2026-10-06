// "See it in action" carousel: shows as many screens as fit (3 on desktop and tablet),
// advances one page at a time, and pauses on hover, focus, touch, when hidden or off-screen,
// and for visitors who prefer reduced motion. Without JS the track is a plain swipeable strip.
(function () {
  const root = document.querySelector('.carousel');
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsBox = root.querySelector('.c-dots');
  const prevBtn = root.querySelector('.c-prev');
  const nextBtn = root.querySelector('.c-next');
  const pauseBtn = root.querySelector('.c-pause');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL_MS = 4500;

  let timer = null;
  let userPaused = reduceMotion.matches;   // the Pause button state
  let hoverPaused = false;
  let visible = false;
  let pages = 1;

  const perView = () => {
    const w = slides[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(track.clientWidth / (w || 1)));
  };
  const currentPage = () => {
    const step = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    const index = Math.round(track.scrollLeft / (step || 1));
    return Math.min(pages - 1, Math.floor(index / perView() + 0.001));
  };
  const goTo = (page, fromUser) => {
    const n = (page + pages) % pages;
    const target = slides[Math.min(slides.length - 1, n * perView())];
    track.setAttribute('aria-live', fromUser ? 'polite' : 'off');
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  };

  const buildDots = () => {
    pages = Math.ceil(slides.length / perView());
    dotsBox.textContent = '';
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      const from = i * perView() + 1;
      const to = Math.min(slides.length, from + perView() - 1);
      b.setAttribute('aria-label', from === to ? `Show screen ${from}` : `Show screens ${from} to ${to}`);
      b.addEventListener('click', () => { goTo(i, true); restart(); });
      dotsBox.appendChild(b);
    }
    markDot();
  };
  const markDot = () => {
    const p = currentPage();
    Array.from(dotsBox.children).forEach((d, i) => d.setAttribute('aria-current', i === p ? 'true' : 'false'));
  };

  const running = () => !userPaused && !hoverPaused && visible && !document.hidden && pages > 1;
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const restart = () => {
    stop();
    if (running()) timer = setInterval(() => goTo(currentPage() + 1, false), INTERVAL_MS);
  };
  const syncPauseButton = () => {
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    root.classList.toggle('is-paused', userPaused);
  };

  prevBtn.addEventListener('click', () => { goTo(currentPage() - 1, true); restart(); });
  nextBtn.addEventListener('click', () => { goTo(currentPage() + 1, true); restart(); });
  pauseBtn.addEventListener('click', () => { userPaused = !userPaused; syncPauseButton(); restart(); });

  root.addEventListener('mouseenter', () => { hoverPaused = true; stop(); });
  root.addEventListener('mouseleave', () => { hoverPaused = false; restart(); });
  root.addEventListener('focusin', () => { hoverPaused = true; stop(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { hoverPaused = false; restart(); } });
  track.addEventListener('touchstart', () => { userPaused = true; syncPauseButton(); stop(); }, { passive: true });

  let scrollTimer = null;
  track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(markDot, 80); }, { passive: true });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentPage() + 1, true); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentPage() - 1, true); restart(); }
  });

  document.addEventListener('visibilitychange', restart);
  reduceMotion.addEventListener?.('change', () => { if (reduceMotion.matches) { userPaused = true; syncPauseButton(); } restart(); });
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; restart(); }, { threshold: 0.35 }).observe(root);

  let resizeTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { buildDots(); goTo(currentPage(), false); }, 150); });

  root.classList.add('is-ready');
  buildDots();
  syncPauseButton();
})();
