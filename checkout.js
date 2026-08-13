const checkoutCart = window.MabonCart;
const checkoutItems = document.querySelector("[data-checkout-items]");
const checkoutEmpty = document.querySelector("[data-checkout-empty]");
const checkoutSummary = document.querySelector("[data-checkout-summary]");
const checkoutTotal = document.querySelector("[data-checkout-total]");
const checkoutPositionCount = document.querySelector("[data-checkout-position-count]");
const checkoutPositionLabel = document.querySelector("[data-checkout-position-label]");
const checkoutForm = document.querySelector("[data-checkout-form]");
const checkoutSubmit = document.querySelector("[data-checkout-submit]");
const checkoutStatus = document.querySelector("[data-checkout-status]");

function checkoutPositionWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "позиция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "позиции";
  return "позиций";
}

function createCheckoutItem(item) {
  const article = document.createElement("article");
  const imageLink = document.createElement("a");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const collection = document.createElement("p");
  const title = document.createElement("a");
  const variant = document.createElement("p");
  const controls = document.createElement("div");
  const stepper = document.createElement("div");
  const minus = document.createElement("button");
  const output = document.createElement("output");
  const plus = document.createElement("button");
  const remove = document.createElement("button");
  const price = document.createElement("strong");

  article.className = "checkout-item";

  imageLink.className = "checkout-item__image";
  imageLink.href = item.url;
  image.src = item.image;
  image.alt = item.name;
  image.loading = "lazy";
  imageLink.append(image);

  body.className = "checkout-item__body";
  collection.className = "checkout-item__collection";
  collection.textContent = item.collection;
  title.className = "checkout-item__name";
  title.href = item.url;
  title.textContent = item.name;
  variant.className = "checkout-item__variant";
  variant.textContent = `Исполнение: ${item.variantName}`;

  controls.className = "checkout-item__controls";
  stepper.className = "cart-stepper";
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", `Уменьшить количество: ${item.name}`);
  output.value = String(item.quantity);
  output.textContent = String(item.quantity);
  output.setAttribute("aria-label", `Количество: ${item.quantity}`);
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `Увеличить количество: ${item.name}`);
  remove.className = "checkout-item__remove";
  remove.type = "button";
  remove.textContent = "Удалить";
  remove.setAttribute("aria-label", `Удалить из корзины: ${item.name}`);

  minus.addEventListener("click", () => checkoutCart.setItemQuantity(item, item.quantity - 1));
  plus.addEventListener("click", () => checkoutCart.setItemQuantity(item, item.quantity + 1));
  remove.addEventListener("click", () => checkoutCart.removeItem(item.id));

  stepper.append(minus, output, plus);
  controls.append(stepper, remove);
  body.append(collection, title, variant, controls);

  price.className = "checkout-item__price";
  price.textContent = checkoutCart.formatPrice(item.price * item.quantity);

  article.append(imageLink, body, price);
  return article;
}

function renderCheckout() {
  if (!checkoutCart || !checkoutItems) return;
  const items = checkoutCart.getItems();
  const hasItems = items.length > 0;

  checkoutItems.replaceChildren(...items.map(createCheckoutItem));
  checkoutItems.hidden = !hasItems;
  checkoutEmpty.hidden = hasItems;
  checkoutSummary.hidden = !hasItems;
  checkoutTotal.textContent = checkoutCart.formatPrice(checkoutCart.getTotal());
  checkoutPositionCount.textContent = String(items.length);
  checkoutPositionLabel.textContent = checkoutPositionWord(items.length);
  checkoutSubmit.disabled = !hasItems;

  if (!hasItems && checkoutStatus) checkoutStatus.textContent = "Добавьте хотя бы один объект, чтобы оформить заказ.";
  if (hasItems && checkoutStatus?.textContent.startsWith("Добавьте")) checkoutStatus.textContent = "";
}

checkoutForm?.addEventListener("input", () => {
  if (checkoutStatus && !checkoutStatus.textContent.startsWith("Демо-заказ")) checkoutStatus.textContent = "";
});

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutCart?.getItems().length) {
    checkoutStatus.textContent = "Сначала добавьте товар в корзину.";
    return;
  }

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    checkoutStatus.textContent = "Проверьте обязательные поля.";
    return;
  }

  checkoutStatus.textContent = "Демо-заказ сформирован. Подключение оплаты и CRM потребуется перед запуском сайта.";
});

window.addEventListener("mabon-cart-change", renderCheckout);
renderCheckout();
