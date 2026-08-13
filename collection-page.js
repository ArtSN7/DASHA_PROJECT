const collectionContent = {
  moments: {
    title: "Мгновения",
    hero: "assets/hero-moments.webp",
    heroAlt: "Фарфоровые фигуры из коллекции Мгновения",
    lead: "Коллекция о тихих жестах, близости и времени рядом. Каждая композиция сохраняет момент, который обычно остаётся только в памяти.",
    more: "Фарфор делает эти мгновения осязаемыми: свет скользит по матовой поверхности, а пластика фигур передаёт движение, паузу и внутреннюю тишину.",
    products: ["Вместе", "Тихий жест", "Перед рассветом"],
    author: "Художественная мастерская Mabon",
    authorLead: "Коллекция создавалась как серия наблюдений за повседневной близостью — без постановочных жестов и лишней декоративности.",
    authorMore: "Команда переводила рисунки и пластические этюды в фарфор, сохраняя живое несовершенство ручной работы в каждом объекте.",
    process: "От первого пластилинового этюда до ручной росписи каждая фигура проходит несколько стадий уточнения формы, литья и высокотемпературного обжига."
  },
  motya: {
    title: "Motya MABON",
    hero: "assets/collection-forms.webp",
    heroAlt: "Белые рельефные объекты из коллекции Motya MABON",
    lead: "Motya MABON исследует движение материала и выразительность чистой формы. Белый фарфор становится пространством для света, ритма и тактильного рельефа.",
    more: "В коллекции нет случайной линии: каждая складка и переход поверхности выстроены так, чтобы объект менялся вместе с освещением и точкой зрения.",
    products: ["Motya I", "Белый ритм", "Линия света"],
    author: "Студия формы Mabon",
    authorLead: "Работа над серией началась с поиска силуэта, который выглядит цельным издалека и раскрывает сложную поверхность при близком рассмотрении.",
    authorMore: "Модели многократно пересобирались вручную, пока рельеф не начал одинаково уверенно работать в мягком дневном и направленном вечернем свете.",
    process: "Для сохранения тонкого рельефа мастера контролируют плотность шликера, время набора стенки и режим каждого обжига — от черновой формы до финального объекта."
  },
  winter: {
    title: "Хранители Зимы",
    hero: "assets/mabon-packaging.webp",
    heroAlt: "Объекты и упаковка коллекции Хранители Зимы",
    lead: "Сезонная коллекция о домашнем свете, хрупкости и личных зимних ритуалах. Её объекты задуманы как маленькие хранители спокойствия.",
    more: "Глубокие оттенки упаковки и светлый фарфор создают контраст, в котором каждый предмет ощущается одновременно подарком, символом и частью дома.",
    products: ["Хранитель света", "Зимняя тишина", "Домой"],
    author: "Команда Mabon",
    authorLead: "Образы коллекции собраны из воспоминаний о первом снеге, тёплом свете окон и вещах, которые достают только в особенное время года.",
    authorMore: "Художники и технологи вместе искали баланс между сказочным характером персонажей и точностью коллекционного фарфора.",
    process: "Каждый хранитель проходит ручную доработку после литья, два этапа обжига и финальную сборку. Упаковка проектируется как продолжение истории объекта."
  }
};

const collectionKey = new URLSearchParams(window.location.search).get("collection");
const activeCollectionKey = collectionContent[collectionKey] ? collectionKey : "moments";
const collection = collectionContent[activeCollectionKey];

document.title = `${collection.title} — Mabon`;

const collectionTitle = document.querySelector("[data-collection-title]");
const collectionHero = document.querySelector("[data-collection-hero]");
const collectionLead = document.querySelector("[data-collection-lead]");
const collectionMore = document.querySelector("[data-collection-more]");
const authorName = document.querySelector("[data-author-name]");
const authorLead = document.querySelector("[data-author-lead]");
const authorMore = document.querySelector("[data-author-more]");
const processCopy = document.querySelector("[data-process-copy]");
const collectionFinishes = document.querySelector("[data-collection-finishes]");

if (collectionTitle) collectionTitle.textContent = collection.title;
if (collectionLead) collectionLead.textContent = collection.lead;
if (collectionMore) collectionMore.textContent = collection.more;
if (authorName) authorName.textContent = collection.author;
if (authorLead) authorLead.textContent = collection.authorLead;
if (authorMore) authorMore.textContent = collection.authorMore;
if (processCopy) processCopy.textContent = collection.process;
if (collectionFinishes) collectionFinishes.hidden = activeCollectionKey !== "winter";

if (collectionHero) {
  collectionHero.src = collection.hero;
  collectionHero.alt = collection.heroAlt;
}

document.querySelectorAll("[data-product-image]").forEach((image, index) => {
  image.src = collection.hero;
  image.alt = `${collection.products[index]} — ${collection.title}`;
});

document.querySelectorAll("[data-product-name]").forEach((name, index) => {
  name.textContent = collection.products[index];
});

document.querySelectorAll("[data-product-link]").forEach((link, index) => {
  link.href = `product.html?collection=${activeCollectionKey}&product=${index}`;
  link.setAttribute("aria-label", `Открыть товар ${collection.products[index]}`);
});

window.setupExpandableText?.({
  toggle: document.querySelector("[data-story-toggle]"),
  content: collectionMore,
  collapsedLabel: "Читать дальше",
  expandedLabel: "Скрыть текст"
});

window.setupExpandableText?.({
  toggle: document.querySelector("[data-author-toggle]"),
  content: authorMore,
  collapsedLabel: "Читать подробнее",
  expandedLabel: "Скрыть текст"
});
