const MABON_CART_KEY = "mabon-cart-v1";
const cartReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatCartPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function cartWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
}

function normalizeCartItem(item) {
  if (!item || typeof item.id !== "string") return null;
  const price = Number(item.price);
  const quantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1);
  if (!Number.isFinite(price) || price < 0) return null;

  return {
    id: item.id,
    collectionKey: String(item.collectionKey || "moments"),
    productIndex: Number.parseInt(item.productIndex, 10) || 0,
    name: String(item.name || "Объект Mabon"),
    collection: String(item.collection || "Mabon"),
    variantKey: String(item.variantKey || "default"),
    variantName: String(item.variantName || "Стандартное исполнение"),
    price,
    image: String(item.image || "assets/hero-moments.webp"),
    url: String(item.url || "product.html"),
    quantity
  };
}

function loadCartItems() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(MABON_CART_KEY) || "[]");
    return Array.isArray(stored) ? stored.map(normalizeCartItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

let cartItems = loadCartItems();
let cartPinned = false;
let cartDrawerHovered = false;
let cartCloseTimer;
let cartPreviewTimer;
let cartReturnFocus;

const cartDrawer = document.createElement("div");
cartDrawer.className = "cart-drawer";
cartDrawer.hidden = true;
cartDrawer.setAttribute("aria-hidden", "true");
cartDrawer.innerHTML = `
  <button class="cart-drawer__backdrop" type="button" tabindex="-1" aria-label="Закрыть корзину" data-cart-close></button>
  <aside class="cart-drawer__panel" role="dialog" aria-modal="false" aria-labelledby="cart-drawer-title">
    <header class="cart-drawer__header">
      <div class="cart-drawer__heading">
        <span>Ваш выбор</span>
        <h2 id="cart-drawer-title">Корзина</h2>
      </div>
      <button class="cart-drawer__close" type="button" aria-label="Закрыть корзину" data-cart-close><span></span><span></span></button>
    </header>
    <div class="cart-drawer__body">
      <div class="cart-drawer__empty" data-cart-empty>
        <span>Пока пусто</span>
        <p>Выберите фарфоровый объект — мы сохраним его здесь для оформления.</p>
        <a href="index.html#collections">Смотреть коллекции</a>
      </div>
      <div class="cart-drawer__items" data-cart-items></div>
    </div>
    <footer class="cart-drawer__footer" data-cart-footer>
      <div class="cart-drawer__total"><span>Итого</span><strong data-cart-total>0 ₽</strong></div>
      <a class="cart-drawer__checkout" href="checkout.html" data-cart-checkout>Продолжить оформление <span aria-hidden="true">→</span></a>
      <p class="cart-drawer__note">Стоимость доставки рассчитывается при оформлении.</p>
    </footer>
  </aside>
  <p class="visually-hidden" aria-live="polite" data-cart-live></p>
`;
document.body.append(cartDrawer);

const cartPanel = cartDrawer.querySelector(".cart-drawer__panel");
const cartItemsContainer = cartDrawer.querySelector("[data-cart-items]");
const cartEmpty = cartDrawer.querySelector("[data-cart-empty]");
const cartFooter = cartDrawer.querySelector("[data-cart-footer]");
const cartTotal = cartDrawer.querySelector("[data-cart-total]");
const cartCheckout = cartDrawer.querySelector("[data-cart-checkout]");
const cartLive = cartDrawer.querySelector("[data-cart-live]");
const cartCloseButton = cartDrawer.querySelector(".cart-drawer__close");
const bagButtons = [...document.querySelectorAll("[data-bag-button]")];

function getCartCount() {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartSnapshot() {
  return cartItems.map((item) => ({ ...item }));
}

function createDrawerItem(item) {
  const article = document.createElement("article");
  const mediaLink = document.createElement("a");
  const image = document.createElement("img");
  const content = document.createElement("div");
  const collection = document.createElement("span");
  const titleLink = document.createElement("a");
  const variant = document.createElement("p");
  const controls = document.createElement("div");
  const quantity = document.createElement("div");
  const minus = document.createElement("button");
  const output = document.createElement("output");
  const plus = document.createElement("button");
  const price = document.createElement("strong");
  const remove = document.createElement("button");

  article.className = "cart-drawer__item";
  mediaLink.className = "cart-drawer__image";
  mediaLink.href = item.url;
  image.src = item.image;
  image.alt = item.name;
  content.className = "cart-drawer__item-main";
  collection.className = "cart-drawer__collection";
  collection.textContent = item.collection;
  titleLink.className = "cart-drawer__name";
  titleLink.href = item.url;
  titleLink.textContent = item.name;
  variant.className = "cart-drawer__variant";
  variant.textContent = item.variantName;
  controls.className = "cart-drawer__item-bottom";
  quantity.className = "cart-stepper cart-stepper--small";
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", `Уменьшить количество: ${item.name}`);
  output.value = String(item.quantity);
  output.textContent = String(item.quantity);
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `Увеличить количество: ${item.name}`);
  price.className = "cart-drawer__price";
  price.textContent = formatCartPrice(item.price * item.quantity);
  remove.className = "cart-drawer__remove";
  remove.type = "button";
  remove.textContent = "Удалить";
  remove.setAttribute("aria-label", `Удалить из корзины: ${item.name}`);

  minus.addEventListener("click", () => setCartItemQuantity(item, item.quantity - 1));
  plus.addEventListener("click", () => setCartItemQuantity(item, item.quantity + 1));
  remove.addEventListener("click", () => removeCartItem(item.id));

  mediaLink.append(image);
  quantity.append(minus, output, plus);
  controls.append(quantity, price);
  content.append(collection, titleLink, variant, controls, remove);
  article.append(mediaLink, content);
  return article;
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();
  const hasItems = cartItems.length > 0;

  bagButtons.forEach((button) => {
    const badge = button.querySelector("[data-bag-count]");
    if (badge) badge.textContent = String(count);
    button.setAttribute("aria-label", `Корзина, ${count} ${cartWord(count)}`);
    button.setAttribute("aria-expanded", String(cartDrawer.classList.contains("is-open")));
  });

  cartItemsContainer.replaceChildren(...cartItems.map(createDrawerItem));
  cartEmpty.hidden = hasItems;
  cartFooter.hidden = !hasItems;
  cartTotal.textContent = formatCartPrice(total);
  cartCheckout.setAttribute("aria-disabled", String(!hasItems));
  cartDrawer.querySelector("#cart-drawer-title").textContent = hasItems ? `Корзина · ${cartItems.length}` : "Корзина";
}

function announceCart(message) {
  if (!cartLive) return;
  cartLive.textContent = "";
  window.requestAnimationFrame(() => {
    cartLive.textContent = message;
  });
}

function persistCart(message) {
  window.localStorage.setItem(MABON_CART_KEY, JSON.stringify(cartItems));
  renderCart();
  if (message) announceCart(message);
  window.dispatchEvent(new CustomEvent("mabon-cart-change", { detail: getCartSnapshot() }));
}

function addCartItem(item, amount = 1, options = {}) {
  const normalized = normalizeCartItem({ ...item, quantity: amount });
  if (!normalized) return;
  const existing = cartItems.find((entry) => entry.id === normalized.id);
  if (existing) {
    existing.quantity += Math.max(1, Number.parseInt(amount, 10) || 1);
    Object.assign(existing, { ...normalized, quantity: existing.quantity });
  } else {
    cartItems.push(normalized);
  }
  persistCart(`${normalized.name} добавлен в корзину`);

  if (options.preview !== false) {
    openCart({ pinned: false });
    window.clearTimeout(cartPreviewTimer);
    cartPreviewTimer = window.setTimeout(() => {
      if (!cartPinned && !cartDrawerHovered) closeCart();
    }, 2800);
  }
}

function setCartItemQuantity(itemOrId, nextQuantity) {
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
  if (!id) return;
  const quantity = Math.max(0, Number.parseInt(nextQuantity, 10) || 0);
  const existingIndex = cartItems.findIndex((entry) => entry.id === id);

  if (quantity === 0) {
    if (existingIndex >= 0) {
      const [removed] = cartItems.splice(existingIndex, 1);
      persistCart(`${removed.name} удалён из корзины`);
    }
    return;
  }

  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity = quantity;
    persistCart(`Количество изменено: ${cartItems[existingIndex].name}`);
    return;
  }

  const normalized = normalizeCartItem({ ...itemOrId, quantity });
  if (!normalized) return;
  cartItems.push(normalized);
  persistCart(`${normalized.name} добавлен в корзину`);
}

function removeCartItem(id) {
  const item = cartItems.find((entry) => entry.id === id);
  if (!item) return;
  cartItems = cartItems.filter((entry) => entry.id !== id);
  persistCart(`${item.name} удалён из корзины`);
}

function clearCart() {
  cartItems = [];
  persistCart("Корзина очищена");
}

function openCart({ pinned = true, focus = pinned } = {}) {
  window.clearTimeout(cartCloseTimer);
  window.clearTimeout(cartPreviewTimer);
  if (pinned) cartPinned = true;
  if (!cartDrawer.classList.contains("is-open")) cartPinned = pinned;
  cartReturnFocus = pinned ? document.activeElement : cartReturnFocus;
  cartDrawer.hidden = false;
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.classList.toggle("is-preview", !cartPinned);
  cartPanel.setAttribute("aria-modal", String(cartPinned));
  document.body.classList.toggle("cart-open", cartPinned);
  bagButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
  window.requestAnimationFrame(() => {
    cartDrawer.classList.add("is-open");
    if (focus) cartCloseButton?.focus();
  });
}

function closeCart({ restoreFocus = cartPinned } = {}) {
  if (!cartDrawer.classList.contains("is-open")) return;
  const shouldRestore = restoreFocus;
  cartPinned = false;
  cartDrawerHovered = false;
  cartDrawer.classList.remove("is-open", "is-preview");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartPanel.setAttribute("aria-modal", "false");
  document.body.classList.remove("cart-open");
  bagButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
  window.clearTimeout(cartCloseTimer);
  cartCloseTimer = window.setTimeout(() => {
    cartDrawer.hidden = true;
  }, cartReducedMotion ? 0 : 480);
  if (shouldRestore) cartReturnFocus?.focus?.();
}

function scheduleCartClose() {
  window.clearTimeout(cartCloseTimer);
  cartCloseTimer = window.setTimeout(() => {
    if (!cartPinned && !cartDrawerHovered) closeCart({ restoreFocus: false });
  }, 240);
}

bagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (cartDrawer.classList.contains("is-open") && cartPinned) {
      closeCart();
    } else {
      openCart({ pinned: true, focus: true });
    }
  });

  button.addEventListener("mouseenter", () => {
    if (!window.matchMedia("(hover: hover)").matches || cartPinned) return;
    window.clearTimeout(cartCloseTimer);
    openCart({ pinned: false, focus: false });
  });

  button.addEventListener("mouseleave", () => {
    if (!cartPinned) scheduleCartClose();
  });
});

cartPanel.addEventListener("mouseenter", () => {
  cartDrawerHovered = true;
  window.clearTimeout(cartCloseTimer);
  window.clearTimeout(cartPreviewTimer);
});

cartPanel.addEventListener("mouseleave", () => {
  cartDrawerHovered = false;
  if (!cartPinned) scheduleCartClose();
});

cartDrawer.querySelectorAll("[data-cart-close]").forEach((button) => {
  button.addEventListener("click", () => closeCart());
});

cartCheckout.addEventListener("click", (event) => {
  if (!cartItems.length) event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
    closeCart();
    return;
  }

  if (event.key !== "Tab" || !cartPinned || !cartDrawer.classList.contains("is-open")) return;
  const focusable = [...cartPanel.querySelectorAll('button:not([disabled]), [href], output, [tabindex]:not([tabindex="-1"])')]
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

window.addEventListener("storage", (event) => {
  if (event.key !== MABON_CART_KEY) return;
  cartItems = loadCartItems();
  renderCart();
  window.dispatchEvent(new CustomEvent("mabon-cart-change", { detail: getCartSnapshot() }));
});

window.MabonCart = {
  addItem: addCartItem,
  clear: clearCart,
  close: closeCart,
  formatPrice: formatCartPrice,
  getCount: getCartCount,
  getItems: getCartSnapshot,
  getQuantity: (id) => cartItems.find((item) => item.id === id)?.quantity || 0,
  getTotal: getCartTotal,
  open: openCart,
  removeItem: removeCartItem,
  setItemQuantity: setCartItemQuantity
};

renderCart();
