const productCatalog = {
  moments: {
    name: "Мгновения",
    image: "assets/hero-moments.webp",
    products: [
      {
        name: "Вместе",
        lead: "Фарфоровая композиция о близости, спокойствии и моменте, который хочется сохранить.",
        more: "Мягкая пластика и матовая поверхность раскрываются при боковом свете, подчёркивая силуэты и едва заметные жесты фигур.",
        height: "24 см",
        width: "18 см",
        weight: "1,2 кг"
      },
      {
        name: "Тихий жест",
        lead: "Небольшая скульптура, построенная вокруг одного сдержанного движения и паузы между людьми.",
        more: "Объект задуман для близкого рассмотрения: детали рук и лица намеренно смягчены, чтобы сохранить ощущение живого воспоминания.",
        height: "21 см",
        width: "15 см",
        weight: "0,9 кг"
      },
      {
        name: "Перед рассветом",
        lead: "Композиция о тишине раннего утра и ощущении времени, которое на мгновение остановилось.",
        more: "Светлая масса фарфора и вытянутый силуэт создают спокойный вертикальный ритм, меняющийся в течение дня.",
        height: "27 см",
        width: "16 см",
        weight: "1,1 кг"
      }
    ]
  },
  motya: {
    name: "Motya MABON",
    image: "assets/collection-forms.webp",
    products: [
      {
        name: "Motya I",
        lead: "Чистая фарфоровая форма, в которой рельеф становится главным рисунком объекта.",
        more: "Вертикальный силуэт по-разному реагирует на мягкий и направленный свет, раскрывая глубину каждой складки.",
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
    variants: [
      { name: "Бисквит", color: "#f5f1eb" },
      { name: "Деколь", color: "#8b5a34" },
      { name: "Ручная роспись", color: "#4b2f20" }
    ],
    products: [
      {
        name: "Хранитель света",
        lead: "Сезонная фарфоровая фигура о домашнем свете и спокойствии зимнего вечера.",
        more: "Один и тот же образ доступен в трёх вариантах исполнения: чистый бисквит, деколь и ручная роспись.",
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

document.title = `${activeProduct.name} — Mabon`;

const productTitle = document.querySelector("[data-product-title]");
const productLead = document.querySelector("[data-product-lead]");
const productMore = document.querySelector("[data-product-more]");
const productImage = document.querySelector("[data-product-main-image]");
const productCollectionLink = document.querySelector("[data-product-collection-link]");
const productHeight = document.querySelector("[data-product-height]");
const productWidth = document.querySelector("[data-product-width]");
const productWeight = document.querySelector("[data-product-weight]");

if (productTitle) productTitle.textContent = activeProduct.name;
if (productLead) productLead.textContent = activeProduct.lead;
if (productMore) productMore.textContent = activeProduct.more;
if (productHeight) productHeight.textContent = activeProduct.height;
if (productWidth) productWidth.textContent = activeProduct.width;
if (productWeight) productWeight.textContent = activeProduct.weight;

if (productCollectionLink) {
  productCollectionLink.textContent = activeProductCollection.name;
  productCollectionLink.href = `collection.html?collection=${activeProductCollectionKey}`;
}

const galleryFrames = [
  { position: "20% center", scale: "1" },
  { position: "50% center", scale: "1.08" },
  { position: "80% center", scale: "1.03" }
];
let galleryIndex = 0;

const galleryCurrent = document.querySelector("[data-gallery-current]");
const galleryTotal = document.querySelector("[data-gallery-total]");

function updateGallery() {
  if (!productImage) return;

  const frame = galleryFrames[galleryIndex];
  productImage.classList.add("is-changing");

  window.setTimeout(() => {
    productImage.src = activeProductCollection.image;
    productImage.alt = `${activeProduct.name}, фотография ${galleryIndex + 1} из ${galleryFrames.length}`;
    productImage.style.objectPosition = frame.position;
    productImage.style.setProperty("--product-image-scale", frame.scale);
    productImage.classList.remove("is-changing");
  }, 140);

  if (galleryCurrent) galleryCurrent.textContent = String(galleryIndex + 1).padStart(2, "0");
  if (galleryTotal) galleryTotal.textContent = String(galleryFrames.length).padStart(2, "0");
}

document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex - 1 + galleryFrames.length) % galleryFrames.length;
  updateGallery();
});

document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex + 1) % galleryFrames.length;
  updateGallery();
});

const productDescriptionToggle = document.querySelector("[data-product-description-toggle]");
productDescriptionToggle?.addEventListener("click", () => {
  const expanded = productDescriptionToggle.getAttribute("aria-expanded") === "true";
  productDescriptionToggle.setAttribute("aria-expanded", String(!expanded));
  if (productMore) productMore.hidden = expanded;
  productDescriptionToggle.textContent = expanded ? "Читать дальше" : "Скрыть текст";
});

const variantFieldset = document.querySelector("[data-product-variants]");
const variantOptions = document.querySelector("[data-variant-options]");
const selectedVariant = document.querySelector("[data-selected-variant]");

if (activeProductCollection.variants?.length && variantFieldset && variantOptions) {
  variantFieldset.hidden = false;

  activeProductCollection.variants.forEach((variant, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const swatch = document.createElement("span");

    input.type = "radio";
    input.name = "product-variant";
    input.value = variant.name;
    input.checked = index === 0;
    input.setAttribute("aria-label", variant.name);
    swatch.style.setProperty("--variant-color", variant.color);

    input.addEventListener("change", () => {
      if (input.checked && selectedVariant) selectedVariant.textContent = variant.name;
    });

    label.append(input, swatch);
    variantOptions.append(label);
  });

  if (selectedVariant) selectedVariant.textContent = activeProductCollection.variants[0].name;
}

updateGallery();
