/* =============================================
   SMOOTH SCROLL — powered by Lenis
   Mouse-wheel / trackpad input is eased so the page glides to a stop
   instead of halting instantly. Touch devices keep their native momentum.
   ============================================= */
(function () {
  if (typeof Lenis === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({
    lerp: 0.1, 
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.lenis = lenis;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link || event.defaultPrevented) return;

    const hash = link.getAttribute("href");
    if (hash.length < 2) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, { duration: 1 });
    history.pushState(null, "", hash);
  });
})();
