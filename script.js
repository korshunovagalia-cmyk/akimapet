/* =========================================================================
   AKIMA — каталог и заказ через WhatsApp
   -------------------------------------------------------------------------
   ВАЖНО ПРО ЦЕНЫ:
   Цены ниже — ОРИЕНТИРОВОЧНЫЕ (заглушки). Их не удалось получить с Avito
   автоматически (страница закрыта капчей). Замените значения в PRICE_TABLE
   на актуальные цены из вашего объявления на Avito — это единственное
   место, где нужно их поправить, всё остальное пересчитается само.
   ========================================================================= */

const WHATSAPP_PHONE = '79169120908'; // номер для приёма заказов в WhatsApp
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
  qty: {},            // productId -> quantity
  cart: [],           // [{productId, weight, qty}]
};

PRODUCTS.forEach(p => {
  state.selectedWeight[p.id] = p.weights[Math.min(1, p.weights.length - 1)];
  state.qty[p.id] = 1;
});

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
  const qty = state.qty[p.id];
  const price = priceFor(p, w);
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-media">
      <img src="${p.images[w]}" alt="${p.title}, ${w} кг" loading="lazy">
    </div>
    <div class="product-body">
      <h3>${p.title}</h3>
      <div class="product-specs">${p.specs}</div>
      <div class="weight-row" role="group" aria-label="Фасовка">
        ${p.weights.map(wt => `<button class="weight-pill ${wt === w ? 'active' : ''}" data-action="weight" data-weight="${wt}">${wt} кг</button>`).join('')}
      </div>
      <div class="qty-row">
        <button class="qty-btn" data-action="dec">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" data-action="inc">+</button>
      </div>
      <div class="price-row">
        <div>
          <div class="price">${formatPrice(price)}</div>
          <div class="price-note">цена ориентировочная</div>
        </div>
      </div>
      <div class="card-ctas">
        <button class="btn btn-ghost" data-action="add-cart">В корзину</button>
        <a class="btn btn-wa" href="${AVITO_URL}" target="_blank" rel="noopener">Заказать на Авито</a>
      </div>
    </div>
  </article>`;
}

catalogRoot?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const card = e.target.closest('.product-card');
  const id = card.dataset.id;
  const product = PRODUCTS.find(p => p.id === id);
  const action = btn.dataset.action;

  if (action === 'weight') {
    state.selectedWeight[id] = Number(btn.dataset.weight);
    renderCatalog();
  } else if (action === 'inc') {
    state.qty[id] = Math.min(20, state.qty[id] + 1);
    renderCatalog();
  } else if (action === 'dec') {
    state.qty[id] = Math.max(1, state.qty[id] - 1);
    renderCatalog();
  } else if (action === 'add-cart') {
    addToCart(product, state.selectedWeight[id], state.qty[id]);
    showToast(`Добавлено: ${product.title}, ${state.selectedWeight[id]} кг`);
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

/* --------------------------- cart --------------------------- */
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEls = document.querySelectorAll('.cart-count');

function addToCart(product, weight, qty) {
  const existing = state.cart.find(i => i.productId === product.id && i.weight === weight);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ productId: product.id, weight, qty });
  }
  renderCart();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  renderCart();
}

function cartTotalCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}
function cartTotalPrice() {
  return state.cart.reduce((sum, i) => {
    const product = PRODUCTS.find(p => p.id === i.productId);
    return sum + priceFor(product, i.weight) * i.qty;
  }, 0);
}

function renderCart() {
  cartCountEls.forEach(el => el.textContent = cartTotalCount());

  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Корзина пока пуста.<br>Выберите корм в каталоге.</div>';
  } else {
    cartItemsEl.innerHTML = state.cart.map((item, idx) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      const price = priceFor(product, item.weight) * item.qty;
      return `
      <div class="cart-item">
        <img src="${product.images[item.weight]}" alt="">
        <div class="cart-item-info">
          <h5>${product.title}</h5>
          <span>${item.weight} кг × ${item.qty}</span>
          <div class="cart-item-row">
            <strong>${formatPrice(price)}</strong>
            <button class="cart-remove" data-idx="${idx}">Удалить</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }
  cartTotalEl.textContent = formatPrice(cartTotalPrice());
}

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cart-remove');
  if (!btn) return;
  removeFromCart(Number(btn.dataset.idx));
});

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}
document.querySelectorAll('[data-open-cart]').forEach(el => el.addEventListener('click', openCart));
document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

/* --------------------------- WhatsApp order --------------------------- */
function buildOrderMessage(lines) {
  const rows = lines.map(({ product, weight, qty }) => {
    const price = priceFor(product, weight) * qty;
    return `• ${product.title} — ${weight} кг × ${qty} шт = ${formatPrice(price)}`;
  });
  const total = lines.reduce((sum, { product, weight, qty }) => sum + priceFor(product, weight) * qty, 0);
  return [
    'Здравствуйте! Хочу сделать заказ на сайте AKIMA:',
    '',
    ...rows,
    '',
    `Итого: ${formatPrice(total)}`,
    '',
    'Пожалуйста, подтвердите наличие и стоимость доставки.',
  ].join('\n');
}

function openWhatsAppOrder(lines) {
  const text = encodeURIComponent(buildOrderMessage(lines));
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (state.cart.length === 0) return;
  const lines = state.cart.map(i => ({
    product: PRODUCTS.find(p => p.id === i.productId),
    weight: i.weight,
    qty: i.qty,
  }));
  openWhatsAppOrder(lines);
});

/* --------------------------- toast --------------------------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

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
renderCart();
