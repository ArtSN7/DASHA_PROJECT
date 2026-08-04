const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const dropdown = document.querySelector("[data-dropdown]");
const dropdownButton = document.querySelector("[data-dropdown-button]");
const megaMenu = document.querySelector("[data-mega-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const carousel = document.querySelector("[data-carousel]");
const nextButton = document.querySelector("[data-carousel-next]");
const carouselCurrent = document.querySelector("[data-carousel-current]");
const carouselTotal = document.querySelector("[data-carousel-total]");
const carouselNextName = document.querySelector("[data-carousel-next-name]");
const carouselItems = carousel ? [...carousel.querySelectorAll(".collection-item")] : [];
const toast = document.querySelector("[data-toast]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let toastTimer;
let scrollFrame;
let carouselFrame;
let carouselIndex = 0;

function setDropdown(open) {
  if (!dropdownButton || !megaMenu) return;

  dropdownButton.setAttribute("aria-expanded", String(open));
  megaMenu.classList.toggle("is-open", open);
  header.classList.toggle("is-menu-open", open);
}

function setMobileMenu(open) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.classList.toggle("is-open", open);
  header.classList.toggle("is-menu-open", open);
  document.body.classList.toggle("menu-open", open);
}

function showToast() {
  if (!toast) return;

  window.clearTimeout(toastTimer);
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function updateScrollState() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

  header?.classList.toggle("is-scrolled", scrollTop > 32);

  if (progress) {
    progress.style.transform = `scaleX(${ratio})`;
  }

  if (!reducedMotion && scrollTop < window.innerHeight * 1.3) {
    document.documentElement.style.setProperty("--hero-shift", `${scrollTop * 0.08}px`);
  }

  scrollFrame = undefined;
}

function requestScrollUpdate() {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  }
}

dropdownButton?.addEventListener("click", () => {
  const open = dropdownButton.getAttribute("aria-expanded") !== "true";
  setDropdown(open);
});

dropdown?.addEventListener("mouseenter", () => {
  if (window.innerWidth > 760) setDropdown(true);
});

megaMenu?.addEventListener("mouseleave", () => setDropdown(false));

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  setMobileMenu(open);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

document.addEventListener("click", (event) => {
  if (!header?.contains(event.target)) setDropdown(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setDropdown(false);
  setMobileMenu(false);
});

function getCarouselStep() {
  if (!carousel || !carouselItems.length) return 0;
  const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
  return carouselItems[0].getBoundingClientRect().width + gap;
}

function updateCarouselUi() {
  if (!carouselItems.length) return;

  const nextIndex = (carouselIndex + 1) % carouselItems.length;
  const nextName = carouselItems[nextIndex].querySelector(".collection-overlay h3")?.textContent.trim() || "";

  if (carouselCurrent) carouselCurrent.textContent = String(carouselIndex + 1).padStart(2, "0");
  if (carouselTotal) carouselTotal.textContent = String(carouselItems.length).padStart(2, "0");
  if (carouselNextName) carouselNextName.textContent = nextName;
  nextButton?.setAttribute("aria-label", `Показать следующую коллекцию: ${nextName}`);
}

function goToCollection(index, behavior = reducedMotion ? "auto" : "smooth") {
  if (!carousel || !carouselItems.length) return;

  carouselIndex = (index + carouselItems.length) % carouselItems.length;
  carousel.scrollTo({ left: getCarouselStep() * carouselIndex, behavior });
  updateCarouselUi();
}

nextButton?.addEventListener("click", () => goToCollection(carouselIndex + 1));

carousel?.addEventListener(
  "scroll",
  () => {
    if (carouselFrame) return;

    carouselFrame = window.requestAnimationFrame(() => {
      const step = getCarouselStep();
      const nextIndex = step ? Math.round(carousel.scrollLeft / step) : 0;

      if (nextIndex !== carouselIndex && nextIndex >= 0 && nextIndex < carouselItems.length) {
        carouselIndex = nextIndex;
        updateCarouselUi();
      }

      carouselFrame = undefined;
    });
  },
  { passive: true },
);

document.querySelectorAll(".js-placeholder").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    showToast();
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -6%" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelector("[data-year]").textContent = new Date().getFullYear();

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) setMobileMenu(false);
  goToCollection(carouselIndex, "auto");
  requestScrollUpdate();
});

window.requestAnimationFrame(() => {
  document.body.classList.add("is-ready");
  updateCarouselUi();
  updateScrollState();
});
