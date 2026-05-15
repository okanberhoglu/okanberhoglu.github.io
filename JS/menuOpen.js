const navbar = document.getElementsByClassName("navbar");
const menu = document.getElementsByClassName("menu");
const mobileMenuQuery = window.matchMedia("(max-width: 965px)");
let scrollPosition = 0;

function lockBodyScroll() {
  if (!mobileMenuQuery.matches) return;

  scrollPosition = window.scrollY;
  document.body.style.top = `-${scrollPosition}px`;
  document.body.classList.add("menu-scroll-locked");
}

function unlockBodyScroll() {
  if (!document.body.classList.contains("menu-scroll-locked")) return;

  document.body.classList.remove("menu-scroll-locked");
  document.body.style.top = "";
  window.scrollTo(0, scrollPosition);
}

function menuOpen() {
  if (navbar[0].classList.contains("active")) {
    navbar[0].classList.remove("active");
    menu[0].classList.remove("activeMenu");
    unlockBodyScroll();
  } else {
    navbar[0].classList.add("active");
    menu[0].classList.add("activeMenu");
    lockBodyScroll();
  }
}

mobileMenuQuery.addEventListener("change", () => {
  if (!mobileMenuQuery.matches) {
    navbar[0].classList.remove("active");
    menu[0].classList.remove("activeMenu");
    unlockBodyScroll();
  }
});
