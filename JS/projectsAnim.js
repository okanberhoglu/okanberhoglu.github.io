let projIndex = 0;
const track = document.getElementById("projectsTrack");
const cards = track ? track.querySelectorAll(".proj-card") : [];
const dots = document.querySelectorAll(".proj-dot");
const leftArrow = document.querySelector(".proj-arrow-left");
const rightArrow = document.querySelector(".proj-arrow-right");

function getVisibleCount() {
  const vw = document.querySelector(".projects-viewport");
  if (!vw) return 3;
  return Math.max(1, Math.floor(vw.clientWidth / getSlideStep()));
}

function getSlideStep() {
  const firstCard = cards[0];
  if (!firstCard || !track) return 284;

  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function clampProjectIndex() {
  const max = Math.max(0, cards.length - getVisibleCount());
  projIndex = Math.max(0, Math.min(projIndex, max));
}

function updateSlider() {
  if (!track) return;

  clampProjectIndex();
  track.style.transform = `translateX(-${projIndex * getSlideStep()}px)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === projIndex));
  if (leftArrow) leftArrow.disabled = projIndex === 0;
  if (rightArrow)
    rightArrow.disabled = projIndex >= cards.length - getVisibleCount();
}

window.slideProjects = function (dir) {
  const max = cards.length - getVisibleCount();
  projIndex = Math.max(0, Math.min(projIndex + dir, max));
  updateSlider();
};

window.goToProject = function (i) {
  projIndex = i;
  updateSlider();
};

updateSlider();
window.addEventListener("resize", updateSlider);

/* 3D Parallax on each card */
cards.forEach((card) => {
  const inner = card.querySelector(".proj-card-inner");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -y * 10;
    const rotY = x * 10;
    const shine = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.07) 0%, transparent 65%)`;
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    inner.style.backgroundImage = shine;
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    inner.style.backgroundImage = "none";
  });
});
