/* =========================================================================
   AKIMA — каталог и заказ через WhatsApp
   -------------------------------------------------------------------------
   ВАЖНО ПРО ЦЕНЫ:
   Цены ниже — ОРИЕНТИРОВОЧНЫЕ (заглушки). Их не удалось получить с Avito
   автоматически (страница закрыта капчей). Замените значения в PRICE_TABLE
   на актуальные цены из вашего объявления на Avito — это единственное
   место, где нужно их поправить, всё остальное пересчитается само.
   ========================================================================= */

const AVITO_URL = 'https://www.avito.ru/brands/2ad129a7e8233fcc878a9eb6378a10bb/all/tovary_dlya_zhivotnyh?src=sharing&sellerId=7b4d69fddb05576489a4d780b70daa37&view=gallery';

const PRICE_TABLE = {
  dog:    { 3: 1490, 10: 3990, 15: 5490 },
  puppy:  { 3: 1590, 10: 4190, 15: 5690 },
  cat:    { 1: 690, 3: 1590, 10: 4290, 15: 5890 },
};
const PRICES_ARE_PLACEHOLDER = true;

const IMG = 'assets/web/';

const PRODUCTS = [
  {
    id: 'dog-big',
    group: 'dogs',
    priceKey: 'dog',
    title: 'AKIMA® для собак крупных пород',
    specs: 'Вес питомца: от 25 до 70 кг · рекомендован с 6 месяцев · доза 15 г на 1 кг веса в сутки',
    weights: [3, 10, 15],
    images: { 3: IMG + 'big_dog_3kg.png', 10: IMG + 'big_dog_10kg.png', 15: IMG + 'big_dog_15kg.png' },
  },
  {
    id: 'dog-middle',
    group: 'dogs',
    priceKey: 'dog',
    title: 'AKIMA® для собак средних пород',
    specs: 'Вес питомца: от 10 до 25 кг · рекомендован с 6 месяцев · доза 20 г на 1 кг веса в сутки',
    weights: [3, 10, 15],
    images: { 3: IMG + 'middle_dog_3kg.png', 10: IMG + 'middle_dog_10kg.png', 15: IMG + 'middle_dog_15kg.png' },
  },
  {
    id: 'dog-small',
    group: 'dogs',
    priceKey: 'dog',
    title: 'AKIMA® для собак мелких пород',
    specs: 'Вес питомца: до 10 кг · рекомендован с 6 месяцев · доза 25 г на 1 кг веса в сутки',
    weights: [3, 10, 15],
    images: { 3: IMG + 'small_dog_3kg.png', 10: IMG + 'small_dog_10kg.png', 15: IMG + 'small_dog_15kg.png' },
  },
  {
    id: 'puppy-big',
    group: 'puppies',
    priceKey: 'puppy',
    title: 'AKIMA® для щенков крупных пород',
    specs: 'Для щенков до 6 месяцев · 1–3 мес: 75 г/кг · 3–5 мес: 55 г/кг · 5–8 мес: 40 г/кг',
    weights: [3, 10, 15],
    images: { 3: IMG + 'big_puppy_3kg.png', 10: IMG + 'big_puppy_10kg.png', 15: IMG + 'big_puppy_15kg.png' },
  },
  {
    id: 'puppy-middle',
    group: 'puppies',
    priceKey: 'puppy',
    title: 'AKIMA® для щенков средних пород',
    specs: 'Для щенков до 6 месяцев · 1–3 мес: 75 г/кг · 3–5 мес: 55 г/кг · 5–8 мес: 40 г/кг',
    weights: [3, 10, 15],
    images: { 3: IMG + 'middle_puppy_3kg.png', 10: IMG + 'middle_puppy_10kg.png', 15: IMG + 'middle_puppy_15kg.png' },
  },
  {
    id: 'puppy-small',
    group: 'puppies',
    priceKey: 'puppy',
    title: 'AKIMA® для щенков мелких пород',
    specs: 'Для щенков до 6 месяцев · 1–3 мес: 75 г/кг · 3–5 мес: 55 г/кг · 5–8 мес: 40 г/кг',
    weights: [3, 10, 15],
    images: { 3: IMG + 'small_puppy_3kg.png', 10: IMG + 'small_puppy_10kg.png', 15: IMG + 'small_puppy_15kg.png' },
  },
  {
    id: 'cat',
    group: 'cats',
    priceKey: 'cat',
    title: 'AKIMA® для кошек',
    specs: 'Рекомендован с 6 месяцев · 2 кг — 35 г/сут · 3 кг — 45 г/сут · 4 кг — 55 г/сут · 5 кг — 75 г/сут · 6 кг+ — 12 г/кг/сут',
    weights: [1, 3, 10, 15],
    images: { 1: IMG + 'cat_1kg.png', 3: IMG + 'cat_3kg.png', 10: IMG + 'cat_10kg.png', 15: IMG + 'cat_15kg.png' },
  },
];

const GROUP_LABELS = { dogs: 'Собаки', puppies: 'Щенки', cats: 'Кошки' };

/* --------------------------- state --------------------------- */
const state = {
  activeGroup: 'dogs',
  selectedWeight: {}, // productId -> weight
};

PRODUCTS.forEach(p => {
  state.selectedWeight[p.id] = p.weights[Math.min(1, p.weights.length - 1)];
});

function brandText(text) {
  return text.replace('AKIMA', '<img class="akima-logo" src="' + IMG + 'logo.svg" alt="AKIMA">');
}

function priceFor(product, weight) {
  return PRICE_TABLE[product.priceKey][weight];
}
function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

/* --------------------------- render catalog --------------------------- */
const catalogRoot = document.getElementById('catalog-root');

function renderCatalog() {
  if (!catalogRoot) return;
  const groupProducts = PRODUCTS.filter(p => p.group === state.activeGroup);
  catalogRoot.innerHTML = groupProducts.map(cardTemplate).join('');
}

function cardTemplate(p) {
  const w = state.selectedWeight[p.id];
  const price = priceFor(p, w);
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-media">
      <img src="${p.images[w]}" alt="${p.title}, ${w} кг" loading="lazy">
    </div>
    <div class="product-body">
      <h3>${brandText(p.title)}</h3>
      <div class="product-specs">${p.specs}</div>
      <div class="weight-row" role="group" aria-label="Фасовка">
        ${p.weights.map(wt => `<button class="weight-pill ${wt === w ? 'active' : ''}" data-action="weight" data-weight="${wt}">${wt} кг</button>`).join('')}
      </div>
      <div class="price-row">
        <div>
          <div class="price">${formatPrice(price)}</div>
          <div class="price-note">цена ориентировочная</div>
        </div>
      </div>
      <div class="card-ctas">
        <a class="btn btn-wa" href="${AVITO_URL}" target="_blank" rel="noopener">Заказать на Авито</a>
      </div>
    </div>
  </article>`;
}

catalogRoot?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = e.target.closest('.product-card').dataset.id;
  if (btn.dataset.action === 'weight') {
    state.selectedWeight[id] = Number(btn.dataset.weight);
    renderCatalog();
  }
});

/* --------------------------- tabs --------------------------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeGroup = btn.dataset.group;
    document.querySelectorAll('.group-intro').forEach(el => {
      el.classList.toggle('hidden', el.dataset.group !== state.activeGroup);
    });
    renderCatalog();
  });
});

/* --------------------------- header scroll state --------------------------- */
const siteHeader = document.querySelector('.site-header');
function updateHeaderState() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

/* --------------------------- mobile nav --------------------------- */
const burger = document.getElementById('burger');
const mainNav = document.getElementById('main-nav');
burger.addEventListener('click', () => {
  mainNav.classList.toggle('open-mobile');
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open-mobile');
}));

/* --------------------------- article videos on hover --------------------------- */
document.querySelectorAll('.article-card').forEach(card => {
  const video = card.querySelector('.article-video');
  if (!video) return;
  card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* --------------------------- footer assortment links --------------------------- */
function selectGroup(group) {
  document.querySelector(`.tab-btn[data-group="${group}"]`)?.click();
}
document.querySelectorAll('[data-group-link]').forEach(a => a.addEventListener('click', (e) => {
  if (!catalogRoot) return;
  e.preventDefault();
  selectGroup(a.dataset.groupLink);
  document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}));
const initialGroup = new URLSearchParams(location.search).get('group');
if (initialGroup) selectGroup(initialGroup);

/* --------------------------- init --------------------------- */
renderCatalog();
