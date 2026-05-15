(function () {
  const nav = document.querySelector(".desktop-nav");
  if (!nav) return;

  const links = Array.from(document.querySelectorAll(".desktop-nav-link"));
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
  }

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
