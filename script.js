const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const dropdown = document.querySelector("[data-dropdown]");
const dropdownButton = document.querySelector("[data-dropdown-button]");
const megaMenu = document.querySelector("[data-mega-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const carousel = document.querySelector("[data-carousel]");
const carouselCurrent = document.querySelector("[data-carousel-current]");
const carouselTotal = document.querySelector("[data-carousel-total]");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const carouselItems = carousel ? [...carousel.querySelectorAll(".collection-item")] : [];
const toast = document.querySelector("[data-toast]");
const toastMessage = toast?.querySelector("[data-toast-message]");
const callbackForm = document.querySelector("[data-callback-form]");
const callbackOpen = document.querySelector("[data-callback-open]");
const callbackInput = document.querySelector("[data-callback-input]");
const callbackName = document.querySelector("[data-callback-name]");
const callbackMessage = document.querySelector("[data-callback-message]");
const callbackCount = document.querySelector("[data-callback-count]");
const callbackLabel = document.querySelector("[data-callback-label]");
const callbackStatus = document.querySelector("[data-callback-status]");
const callbackMethods = callbackForm ? [...callbackForm.querySelectorAll('input[name="callback-method"]')] : [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let toastTimer;
let scrollFrame;
let carouselFrame;
let carouselIndex = 0;
let callbackDialog;
let callbackClose;
let callbackCloseTimer;
let callbackReturnFocus;

if (callbackForm && callbackOpen) {
  callbackDialog = document.createElement("div");
  const callbackBackdrop = document.createElement("button");
  callbackClose = document.createElement("button");
  const callbackTitle = callbackForm.querySelector(".callback-form__head h2");

  callbackDialog.className = "callback-dialog";
  callbackDialog.hidden = true;
  callbackDialog.setAttribute("role", "dialog");
  callbackDialog.setAttribute("aria-modal", "true");
  callbackDialog.setAttribute("aria-hidden", "true");
  if (callbackTitle) {
    callbackTitle.id = "callback-dialog-title";
    callbackDialog.setAttribute("aria-labelledby", callbackTitle.id);
  }

  callbackBackdrop.className = "callback-dialog__backdrop";
  callbackBackdrop.type = "button";
  callbackBackdrop.tabIndex = -1;
  callbackBackdrop.setAttribute("aria-label", "Закрыть форму обратной связи");

  callbackClose.className = "callback-dialog__close";
  callbackClose.type = "button";
  callbackClose.setAttribute("aria-label", "Закрыть форму обратной связи");
  callbackClose.innerHTML = "<span></span><span></span>";

  callbackForm.before(callbackDialog);
  callbackForm.prepend(callbackClose);
  callbackDialog.append(callbackBackdrop, callbackForm);

  callbackBackdrop.addEventListener("click", () => setCallbackDialog(false));
  callbackClose.addEventListener("click", () => setCallbackDialog(false));
}

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

function setCallbackDialog(open) {
  if (!callbackDialog || !callbackOpen) return;

  window.clearTimeout(callbackCloseTimer);
  callbackOpen.setAttribute("aria-expanded", String(open));
  callbackDialog.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("callback-open", open);

  if (open) {
    callbackReturnFocus = document.activeElement;
    callbackDialog.hidden = false;
    window.requestAnimationFrame(() => {
      callbackDialog.classList.add("is-open");
      callbackClose?.focus();
    });
    return;
  }

  callbackDialog.classList.remove("is-open");
  callbackCloseTimer = window.setTimeout(() => {
    callbackDialog.hidden = true;
  }, reducedMotion ? 0 : 480);
  callbackReturnFocus?.focus?.();
}

function showToast(message = "Раздел будет доступен в полной версии сайта") {
  if (!toast) return;

  window.clearTimeout(toastTimer);
  if (toastMessage) toastMessage.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

window.setupExpandableText = ({ toggle, content, collapsedLabel, expandedLabel }) => {
  if (!toggle || !content) return;

  content.classList.add("expandable-copy");
  content.hidden = false;
  content.setAttribute("aria-hidden", "true");
  content.style.height = "0px";

  content.addEventListener("transitionend", (event) => {
    if (event.propertyName === "height" && toggle.getAttribute("aria-expanded") === "true") {
      content.style.height = "auto";
    }
  });

  toggle.addEventListener("click", () => {
    const willExpand = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willExpand));
    toggle.textContent = willExpand ? expandedLabel : collapsedLabel;
    content.setAttribute("aria-hidden", String(!willExpand));

    if (reducedMotion) {
      content.classList.toggle("is-expanded", willExpand);
      content.style.height = willExpand ? "auto" : "0px";
      return;
    }

    if (willExpand) {
      content.classList.add("is-expanded");
      window.requestAnimationFrame(() => {
        content.style.height = `${content.scrollHeight}px`;
      });
      return;
    }

    content.style.height = `${content.scrollHeight}px`;
    window.requestAnimationFrame(() => {
      content.classList.remove("is-expanded");
      content.style.height = "0px";
    });
  });
};

function configureCallbackField(method) {
  if (!callbackInput || !callbackLabel) return;

  const isPhone = method === "phone";
  callbackInput.type = isPhone ? "tel" : "email";
  callbackInput.autocomplete = isPhone ? "tel" : "email";
  callbackInput.inputMode = isPhone ? "tel" : "email";
  callbackInput.placeholder = isPhone ? "+7 (___) ___-__-__" : "Ваш email";
  callbackLabel.textContent = isPhone ? "Номер телефона" : "Электронная почта";
  callbackInput.value = "";

  if (isPhone) {
    callbackInput.setAttribute("pattern", "[+0-9()\\-\\s]{10,}");
  } else {
    callbackInput.removeAttribute("pattern");
  }

  if (callbackStatus) callbackStatus.textContent = "";
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
  if (event.key === "Escape") {
    setDropdown(false);
    setMobileMenu(false);
    setCallbackDialog(false);
    return;
  }

  if (event.key !== "Tab" || !callbackDialog?.classList.contains("is-open")) return;
  const focusable = [...callbackDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

function getCarouselStep() {
  if (!carousel || !carouselItems.length) return 0;
  const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
  return carouselItems[0].getBoundingClientRect().width + gap;
}

function updateCarouselUi() {
  if (!carouselItems.length) return;

  if (carouselCurrent) carouselCurrent.textContent = String(carouselIndex + 1).padStart(2, "0");
  if (carouselTotal) carouselTotal.textContent = String(carouselItems.length).padStart(2, "0");
}

function goToCollection(index, behavior = reducedMotion ? "auto" : "smooth") {
  if (!carousel || !carouselItems.length) return;

  carouselIndex = (index + carouselItems.length) % carouselItems.length;
  carousel.scrollTo({ left: getCarouselStep() * carouselIndex, behavior });
  updateCarouselUi();
}

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

carouselPrev?.addEventListener("click", () => goToCollection(carouselIndex - 1));
carouselNext?.addEventListener("click", () => goToCollection(carouselIndex + 1));
callbackOpen?.addEventListener("click", () => setCallbackDialog(true));

document.querySelectorAll(".js-placeholder").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(element.dataset.toastMessage);
  });
});

callbackMethods.forEach((method) => {
  method.addEventListener("change", () => {
    if (!method.checked) return;
    configureCallbackField(method.value);
    callbackInput?.focus();
  });
});

callbackInput?.addEventListener("input", () => {
  if (callbackStatus) callbackStatus.textContent = "";
});

callbackName?.addEventListener("input", () => {
  if (callbackStatus) callbackStatus.textContent = "";
});

callbackMessage?.addEventListener("input", () => {
  if (callbackCount) callbackCount.textContent = String(callbackMessage.value.length);
  if (callbackStatus) callbackStatus.textContent = "";
});

callbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!callbackForm.reportValidity()) return;

  const method = callbackMethods.find((option) => option.checked)?.value;
  const name = callbackName?.value.trim();
  if (callbackStatus) {
    const greeting = name ? `Спасибо, ${name}!` : "Спасибо!";
    callbackStatus.textContent = method === "phone"
      ? `${greeting} Мы свяжемся с вами по телефону.`
      : `${greeting} Мы ответим на указанный email.`;
  }
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
