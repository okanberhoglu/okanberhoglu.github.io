const navbar = document.getElementsByClassName("navbar");
const menu = document.getElementsByClassName("menu");
const menuSectionLinks = document.querySelectorAll(".menu-list a[href^='#']");
const mobileMenuQuery = window.matchMedia("(max-width: 965px)");
let scrollPosition = 0;

function lockBodyScroll() {
  if (!mobileMenuQuery.matches) return;

  scrollPosition = window.scrollY;
  document.body.style.top = `-${scrollPosition}px`;
  document.body.classList.add("menu-scroll-locked");
}

function jumpToScrollPosition(position) {
  const originalScrollBehavior = document.documentElement.style.scrollBehavior;

  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, position);
  document.documentElement.style.scrollBehavior = originalScrollBehavior;
}

function unlockBodyScroll(position = scrollPosition) {
  if (!document.body.classList.contains("menu-scroll-locked")) return;

  document.body.classList.remove("menu-scroll-locked");
  document.body.style.top = "";
  jumpToScrollPosition(position);
}

function closeMenu(position = scrollPosition) {
  navbar[0].classList.remove("active");
  menu[0].classList.remove("activeMenu");
  unlockBodyScroll(position);
}

function openMenu() {
  navbar[0].classList.add("active");
  menu[0].classList.add("activeMenu");
  lockBodyScroll();
}

function menuOpen() {
  if (navbar[0].classList.contains("active")) {
    closeMenu();
    return;
  }

  openMenu();
}

menuSectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.hash);

    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    closeMenu(target.offsetTop);
    history.pushState(null, "", link.hash);
  });
});

mobileMenuQuery.addEventListener("change", () => {
  if (!mobileMenuQuery.matches) {
    closeMenu();
  }
});
