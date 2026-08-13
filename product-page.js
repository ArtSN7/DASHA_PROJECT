const productCatalog = {
  moments: {
    name: "Мгновения",
    image: "assets/hero-moments.webp",
    basePrice: 52000,
    products: [
      {
        name: "Вместе",
        lead: "Фарфоровая композиция о близости, спокойствии и моменте, который хочется сохранить.",
        more: "Мягкая пластика и матовая поверхность раскрываются при боковом свете, подчёркивая силуэты и едва заметные жесты фигур. Каждый экземпляр проходит ручную доработку, поэтому поверхность сохраняет небольшие различия и живое присутствие материала.",
        height: "24 см",
        width: "18 см",
        weight: "1,2 кг"
      },
      {
        name: "Тихий жест",
        lead: "Небольшая скульптура, построенная вокруг одного сдержанного движения и паузы между людьми.",
        more: "Объект задуман для близкого рассмотрения: детали рук и лица намеренно смягчены, чтобы сохранить ощущение живого воспоминания. Финальная поверхность дорабатывается вручную после первого обжига.",
        height: "21 см",
        width: "15 см",
        weight: "0,9 кг"
      },
      {
        name: "Перед рассветом",
        lead: "Композиция о тишине раннего утра и ощущении времени, которое на мгновение остановилось.",
        more: "Светлая масса фарфора и вытянутый силуэт создают спокойный вертикальный ритм, меняющийся в течение дня. Небольшой тираж позволяет сохранить внимание к каждой детали.",
        height: "27 см",
        width: "16 см",
        weight: "1,1 кг"
      }
    ]
  },
  motya: {
    name: "Motya MABON",
    image: "assets/collection-forms.webp",
    basePrice: 61000,
    products: [
      {
        name: "Motya I",
        lead: "Чистая фарфоровая форма, в которой рельеф становится главным рисунком объекта.",
        more: "Вертикальный силуэт по-разному реагирует на мягкий и направленный свет, раскрывая глубину каждой складки. Объект проходит несколько этапов ручной шлифовки перед обжигом.",
        height: "31 см",
        width: "17 см",
        weight: "1,4 кг"
      },
      {
        name: "Белый ритм",
        lead: "Скульптурный объект с плавным повторяющимся рельефом и спокойной матовой поверхностью.",
        more: "Форма собрана из чередования плотных и почти невесомых линий, создающих ощущение движения без буквального сюжета.",
        height: "26 см",
        width: "19 см",
        weight: "1,3 кг"
      },
      {
        name: "Линия света",
        lead: "Вытянутая форма, созданная как поверхность для света и меняющихся теней.",
        more: "Рельеф читается постепенно: издалека объект выглядит цельным, а вблизи раскрывает ручную работу и тонкие переходы.",
        height: "34 см",
        width: "14 см",
        weight: "1,5 кг"
      }
    ]
  },
  winter: {
    name: "Хранители Зимы",
    image: "assets/mabon-packaging.webp",
    basePrice: 47000,
    products: [
      {
        name: "Хранитель света",
        lead: "Сезонная фарфоровая фигура о домашнем свете и спокойствии зимнего вечера.",
        more: "Один и тот же образ доступен в трёх вариантах исполнения: чистый бисквит, деколь и ручная роспись. Каждая версия по-разному раскрывает пластику объекта.",
        height: "22 см",
        width: "14 см",
        weight: "0,9 кг"
      },
      {
        name: "Зимняя тишина",
        lead: "Коллекционный персонаж, вдохновлённый первым снегом и ощущением тишины вокруг дома.",
        more: "Фигура сохраняет единый силуэт во всех вариантах, а характер меняется благодаря отделке поверхности и цветовым деталям.",
        height: "20 см",
        width: "13 см",
        weight: "0,8 кг"
      },
      {
        name: "Домой",
        lead: "Фарфоровый хранитель, задуманный как небольшой символ возвращения, тепла и личного пространства.",
        more: "Матовая белая версия подчёркивает пластику, деколь добавляет графику, а ручная роспись делает каждый объект уникальным.",
        height: "23 см",
        width: "15 см",
        weight: "1 кг"
      }
    ]
  }
};

const productParams = new URLSearchParams(window.location.search);
const requestedCollectionKey = productParams.get("collection");
const activeProductCollectionKey = productCatalog[requestedCollectionKey] ? requestedCollectionKey : "moments";
const activeProductCollection = productCatalog[activeProductCollectionKey];
const requestedProductIndex = Number.parseInt(productParams.get("product") || "0", 10);
const activeProductIndex = Number.isInteger(requestedProductIndex) && activeProductCollection.products[requestedProductIndex]
  ? requestedProductIndex
  : 0;
const activeProduct = activeProductCollection.products[activeProductIndex];

const collectionVariantImages = {
  moments: [
    "assets/product-together-decal.jpg",
    "assets/product-together-bisque.jpg",
    "assets/product-together-painted.jpg"
  ],
  motya: [
    "assets/collection-forms.webp",
    "assets/craft-process.webp",
    "assets/collection-installation.webp"
  ],
  winter: [
    "assets/mabon-packaging.webp",
    "assets/hero-moments.webp",
    "assets/collection-installation.webp"
  ]
};

const productVariants = [
  {
    key: "decal",
    name: "Деколь",
    color: "#31547e",
    priceDelta: 16000,
    material: "Фарфор, кобальтовая деколь"
  },
  {
    key: "bisque",
    name: "Бисквит",
    color: "#eee6dc",
    priceDelta: 0,
    material: "Неглазурованный фарфор, бисквит"
  },
  {
    key: "painted",
    name: "Роспись",
    color: "#783a31",
    priceDelta: 37000,
    material: "Фарфор, ручная роспись, золото"
  }
].map((variant, index) => ({
  ...variant,
  image: collectionVariantImages[activeProductCollectionKey][index]
}));

const productTitle = document.querySelector("[data-product-title]");
const productLead = document.querySelector("[data-product-lead]");
const productMore = document.querySelector("[data-product-more]");
const productImage = document.querySelector("[data-product-main-image]");
const productCollectionLink = document.querySelector("[data-product-collection-link]");
const productPrice = document.querySelector("[data-product-price]");
const detailMaterial = document.querySelector("[data-detail-material]");
const galleryCurrent = document.querySelector("[data-gallery-current]");
const galleryTotal = document.querySelector("[data-gallery-total]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryThumbnails = document.querySelector("[data-gallery-thumbnails]");
const variantOptions = document.querySelector("[data-variant-options]");
const productQuantity = document.querySelector("[data-product-quantity]");
const quantityMinus = document.querySelector("[data-quantity-minus]");
const bagButton = document.querySelector("[data-bag-button]");
const addToCartButton = document.querySelector("[data-add-to-cart]");

document.title = `${activeProduct.name} — Mabon`;
if (productTitle) productTitle.textContent = activeProduct.name;
if (productLead) productLead.textContent = activeProduct.lead;
if (productMore) productMore.textContent = activeProduct.more;

document.querySelectorAll("[data-product-height]").forEach((element) => {
  element.textContent = activeProduct.height;
});
document.querySelectorAll("[data-product-width]").forEach((element) => {
  element.textContent = activeProduct.width;
});
document.querySelectorAll("[data-product-weight]").forEach((element) => {
  element.textContent = activeProduct.weight;
});

if (productCollectionLink) {
  productCollectionLink.textContent = `Коллекция ${activeProductCollection.name}`;
  productCollectionLink.href = `collection.html?collection=${activeProductCollectionKey}`;
}

let activeVariantIndex = 0;
let galleryIndex = 0;
let galleryFrames = [];
let quantity = 0;
let imageChangeTimer;
let addAnimationTimer;

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function getActiveVariantPrice() {
  const variant = productVariants[activeVariantIndex];
  return activeProductCollection.basePrice + (activeProductIndex * 4500) + variant.priceDelta;
}

function getActiveCartItem() {
  const variant = productVariants[activeVariantIndex];
  return {
    id: `${activeProductCollectionKey}:${activeProductIndex}:${variant.key}`,
    collectionKey: activeProductCollectionKey,
    productIndex: activeProductIndex,
    name: activeProduct.name,
    collection: activeProductCollection.name,
    variantKey: variant.key,
    variantName: variant.name,
    price: getActiveVariantPrice(),
    image: variant.image,
    url: `product.html?collection=${activeProductCollectionKey}&product=${activeProductIndex}`
  };
}

function createGalleryFrames() {
  const variant = productVariants[activeVariantIndex];
  const isPortraitProduct = activeProductCollectionKey === "moments";

  return [
    {
      src: variant.image,
      position: "50% 50%",
      scale: 1,
      label: `${activeProduct.name} · ${variant.name} · общий вид`
    },
    {
      src: variant.image,
      position: "50% 30%",
      scale: isPortraitProduct ? 1.42 : 1.18,
      label: `${activeProduct.name} · деталь поверхности`
    },
    {
      src: variant.image,
      position: "50% 76%",
      scale: isPortraitProduct ? 1.5 : 1.24,
      label: `${activeProduct.name} · деталь основания`
    },
    {
      src: activeProductCollectionKey === "moments"
        ? "assets/product-together-interior-console.jpg"
        : activeProductCollection.image,
      position: "50% 50%",
      scale: 1,
      label: `${activeProduct.name} · в интерьере`
    }
  ];
}

function updateGalleryUi() {
  const frame = galleryFrames[galleryIndex];
  if (!frame || !productImage) return;

  window.clearTimeout(imageChangeTimer);
  productImage.classList.add("is-changing");

  imageChangeTimer = window.setTimeout(() => {
    productImage.src = frame.src;
    productImage.alt = frame.label;
    productImage.style.objectPosition = frame.position;
    productImage.style.setProperty("--product-image-scale", frame.scale);
    productImage.classList.remove("is-changing");
  }, 150);

  if (galleryCurrent) galleryCurrent.textContent = String(galleryIndex + 1).padStart(2, "0");
  if (galleryTotal) galleryTotal.textContent = String(galleryFrames.length).padStart(2, "0");
  if (galleryCaption) galleryCaption.textContent = frame.label;

  galleryThumbnails?.querySelectorAll("button").forEach((button, index) => {
    const selected = index === galleryIndex;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "true" : "false");
  });
}

function buildGalleryThumbnails() {
  if (!galleryThumbnails) return;
  galleryThumbnails.replaceChildren();

  galleryFrames.forEach((frame, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.setAttribute("aria-label", `Показать: ${frame.label}`);
    image.src = frame.src;
    image.alt = "";
    image.loading = index === 0 ? "eager" : "lazy";
    image.style.objectPosition = frame.position;
    image.style.setProperty("--thumb-scale", frame.scale);
    button.append(image);
    button.addEventListener("click", () => {
      galleryIndex = index;
      updateGalleryUi();
    });
    galleryThumbnails.append(button);
  });
}

function setVariant(index) {
  activeVariantIndex = index;
  galleryIndex = 0;
  galleryFrames = createGalleryFrames();
  buildGalleryThumbnails();
  updateGalleryUi();

  const variant = productVariants[activeVariantIndex];
  if (productPrice) {
    productPrice.textContent = formatPrice(getActiveVariantPrice());
  }
  if (detailMaterial) detailMaterial.textContent = variant.material;
  syncProductQuantity();
}

productVariants.forEach((variant, index) => {
  if (!variantOptions) return;

  const label = document.createElement("label");
  const input = document.createElement("input");
  const content = document.createElement("span");
  const circle = document.createElement("i");
  const name = document.createElement("b");

  label.className = "product-variant";
  input.type = "radio";
  input.name = "product-variant";
  input.value = variant.key;
  input.checked = index === 0;
  input.setAttribute("aria-label", variant.name);
  content.className = "product-variant__content";
  circle.style.setProperty("--variant-color", variant.color);
  name.textContent = variant.name;
  content.append(circle, name);
  label.append(input, content);
  input.addEventListener("change", () => {
    if (input.checked) setVariant(index);
  });
  variantOptions.append(label);
});

document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex - 1 + galleryFrames.length) % galleryFrames.length;
  updateGalleryUi();
});

document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex + 1) % galleryFrames.length;
  updateGalleryUi();
});

const productDescriptionToggle = document.querySelector("[data-product-description-toggle]");
window.setupExpandableText?.({
  toggle: productDescriptionToggle,
  content: productMore,
  collapsedLabel: "Читать дальше",
  expandedLabel: "Скрыть текст"
});

function updateProductQuantityUi() {
  if (productQuantity) productQuantity.value = String(quantity);
  if (quantityMinus) quantityMinus.disabled = quantity === 0;
  if (addToCartButton) addToCartButton.textContent = quantity > 0 ? "Добавить ещё" : "Добавить в корзину";
}

function syncProductQuantity() {
  quantity = window.MabonCart?.getQuantity(getActiveCartItem().id) || 0;
  updateProductQuantityUi();
}

function setQuantity(nextQuantity) {
  quantity = Math.max(0, nextQuantity);
  if (window.MabonCart) {
    window.MabonCart.setItemQuantity(getActiveCartItem(), quantity);
  }
  updateProductQuantityUi();
}

function playAddAnimation() {
  if (!addToCartButton) return;

  window.clearTimeout(addAnimationTimer);
  addToCartButton.classList.remove("is-added");
  bagButton?.classList.remove("is-updated");
  void addToCartButton.offsetWidth;
  addToCartButton.classList.add("is-added");
  bagButton?.classList.add("is-updated");
  addToCartButton.textContent = "Добавлено ✓";

  addAnimationTimer = window.setTimeout(() => {
    addToCartButton.classList.remove("is-added");
    bagButton?.classList.remove("is-updated");
    addToCartButton.textContent = quantity > 0 ? "Добавить ещё" : "Добавить в корзину";
  }, 950);
}

addToCartButton?.addEventListener("click", () => {
  if (window.MabonCart) {
    window.MabonCart.addItem(getActiveCartItem(), 1, { preview: true });
    syncProductQuantity();
  } else {
    setQuantity(quantity + 1);
  }
  playAddAnimation();
});
document.querySelector("[data-quantity-plus]")?.addEventListener("click", () => setQuantity(quantity + 1));
quantityMinus?.addEventListener("click", () => setQuantity(quantity - 1));
window.addEventListener("mabon-cart-change", syncProductQuantity);

document.querySelectorAll("[data-disclosure-trigger]").forEach((trigger) => {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!isExpanded));
    trigger.closest(".product-disclosure")?.classList.toggle("is-open", !isExpanded);
    if (panel) panel.hidden = isExpanded;
  });
});

const relatedNames = {
  moments: ["Тихий жест", "Перед рассветом", "Свет рядом", "Пауза", "Двое"],
  motya: ["Белый ритм", "Линия света", "Motya II", "Рельеф", "Белое движение"],
  winter: ["Зимняя тишина", "Домой", "Хранитель утра", "Первый снег", "Тёплое окно"]
};
const relatedImages = activeProductCollectionKey === "moments"
  ? [
      "assets/product-together-bisque.jpg",
      "assets/product-together-decal.jpg",
      "assets/product-together-painted.jpg",
      "assets/hero-moments.webp",
      "assets/product-together-interior-shelf.jpg"
    ]
  : [
      activeProductCollection.image,
      "assets/collection-forms.webp",
      "assets/collection-installation.webp",
      "assets/craft-process.webp",
      activeProductCollection.image
    ];

const relatedTrack = document.querySelector("[data-related-track]");
relatedNames[activeProductCollectionKey].forEach((name, index) => {
  if (!relatedTrack) return;

  const article = document.createElement("article");
  const link = document.createElement("a");
  const imageWrap = document.createElement("div");
  const image = document.createElement("img");
  const meta = document.createElement("div");
  const title = document.createElement("h3");
  const price = document.createElement("span");

  article.className = "related-product";
  link.href = `product.html?collection=${activeProductCollectionKey}&product=${index % activeProductCollection.products.length}`;
  link.setAttribute("aria-label", `Открыть товар ${name}`);
  imageWrap.className = "related-product__image";
  image.src = relatedImages[index];
  image.alt = name;
  image.loading = "lazy";
  image.style.objectPosition = `${30 + (index * 10)}% center`;
  meta.className = "related-product__meta";
  title.textContent = name;
  price.textContent = formatPrice(activeProductCollection.basePrice + 4000 + (index * 5500));

  imageWrap.append(image);
  meta.append(title, price);
  link.append(imageWrap, meta);
  article.append(link);
  relatedTrack.append(article);
});

setVariant(0);
