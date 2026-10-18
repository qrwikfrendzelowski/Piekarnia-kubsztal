import { fetchData } from '../api/client.js';
import { store } from './state.js';

const routes = new Set(['home', 'menu', 'order', 'contact']);
const dataCache = new Map();
const pageTitles = {
  home: 'Domowe wypieki każdego dnia',
  menu: 'Nasze wypieki',
  order: 'Zamów online',
  contact: 'Kontakt i godziny otwarcia',
};

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function loadJSON(name) {
  if (!dataCache.has(name)) dataCache.set(name, fetchData(name));
  return dataCache.get(name);
}

async function getProducts() {
  const data = await loadJSON('products');
  const products = Array.isArray(data.products) ? data.products : [];
  store.setProducts(products);
  return products;
}

async function getBakery() {
  return loadJSON('bakery-info');
}

function productCard(product) {
  const title = escapeHTML(product.title);
  const description = escapeHTML(product.description);
  const id = escapeHTML(product.id);
  const image = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f5ecd9"/><ellipse cx="400" cy="330" rx="230" ry="150" fill="#c17f0c"/><text x="400" y="540" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#3d2617">${title}</text></svg>`)}`;

  return `<li><article class="product-card">
    <figure class="product-card__media"><img class="product-card__image" src="${image}" alt="${title}" width="800" height="600" loading="lazy"></figure>
    <div class="product-card__body"><h3 class="product-card__title">${title}</h3>
      <p class="product-card__description">${description}</p>
      <div class="product-card__footer"><p class="product-card__price">${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(product.price))}</p>
        <a class="product-card__button" href="/zamow?product=${encodeURIComponent(id)}" data-link>Zamów</a>
      </div>
    </div>
  </article></li>`;
}

function productGrid(products) {
  return `<ul class="product-grid">${products.map(productCard).join('')}</ul>`;
}

function renderHome(products, bakery) {
  const featured = products.slice(0, 3);
  return `<section class="section"><div class="container">
    <header class="section__header"><p class="section__subtitle">Wypiekamy na miejscu od ${escapeHTML(bakery.history?.founded ?? '')} roku</p>
      <h1>${escapeHTML(bakery.name)}</h1><p class="section__subtitle">${escapeHTML(bakery.tagline)}</p></header>
    <p class="section__header"><a class="navbar__cta" href="/wypieki" data-link>Zobacz menu</a></p>
    <h2>Polecamy z pieca</h2>${productGrid(featured)}
  </div></section>`;
}

function renderMenu(products) {
  const categories = [...new Set(products.map((product) => product.category))];
  return `<section class="section"><div class="container"><header class="section__header">
    <h1>Nasze wypieki</h1><p class="section__subtitle">Codziennie świeże, przygotowane z dobrych składników.</p></header>
    ${categories.map((category) => `<section class="section" aria-labelledby="category-${escapeHTML(category)}"><h2 id="category-${escapeHTML(category)}">${escapeHTML(category.replaceAll('-', ' '))}</h2>${productGrid(products.filter((product) => product.category === category))}</section>`).join('')}
  </div></section>`;
}

function renderOrder(products) {
  const queryProduct = new URLSearchParams(window.location.search).get('product');
  const rows = products.map((product) => {
    const id = escapeHTML(product.id);
    const title = escapeHTML(product.title);
    const checked = product.id === queryProduct ? ' checked' : '';
    const value = product.id === queryProduct ? '1' : '0';
    return `<li data-cart-item>
      <input id="product-${id}" name="products" type="checkbox" value="${id}"${checked} aria-label="Wybierz ${title}" aria-invalid="false">
      <label for="product-${id}">${title} <span>(${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(product.price))})</span></label>
      <button type="button" data-cart-action="add" aria-label="Dodaj ${title} do koszyka">Dodaj</button>
      <button type="button" data-cart-action="decrement" aria-label="Zmniejsz ilość ${title}" aria-controls="quantity-${id}" disabled>−</button>
      <label class="visually-hidden" for="quantity-${id}">Ilość: ${title}</label>
      <input id="quantity-${id}" name="quantity-${id}" type="number" value="${value}" min="0" step="1" inputmode="numeric" aria-label="Ilość ${title}" aria-controls="cart-count"${value === '0' ? ' disabled' : ''}>
      <button type="button" data-cart-action="increment" aria-label="Zwiększ ilość ${title}" aria-controls="quantity-${id}">+</button>
    </li>`;
  }).join('');

  return `<section class="section"><div class="container"><header class="section__header"><h1>Zamów online</h1><p class="section__subtitle">Wybierz produkty i termin odbioru.</p></header>
    <form id="order-form" aria-labelledby="order-form-title" novalidate><h2 id="order-form-title">Dane zamówienia</h2>
      <div><label for="customer-name">Imię i nazwisko</label><input id="customer-name" name="name" type="text" autocomplete="name" required aria-describedby="customer-name-error" aria-invalid="false"><p id="customer-name-error" aria-live="polite"></p></div>
      <div><label for="customer-email">E-mail</label><input id="customer-email" name="email" type="email" autocomplete="email" required aria-describedby="customer-email-error" aria-invalid="false"><p id="customer-email-error" aria-live="polite"></p></div>
      <div><label for="pickup-date">Data odbioru</label><input id="pickup-date" name="pickupDate" type="date" required aria-describedby="pickup-date-error" aria-invalid="false"><p id="pickup-date-error" aria-live="polite"></p></div>
      <fieldset id="order-products" aria-describedby="product-selection-help product-selection-error" aria-invalid="false"><legend>Produkty</legend><p id="product-selection-help">Wybierz co najmniej jeden produkt i jego ilość.</p><p id="product-selection-error" aria-live="polite"></p><ul>${rows}</ul></fieldset>
      <p id="cart-count" role="status" aria-live="polite" aria-atomic="true">Koszyk: 0 produktów</p>
      <div><label for="dietary-requirements">Alergie i uwagi</label><textarea id="dietary-requirements" name="dietaryRequirements" rows="4" aria-describedby="dietary-requirements-help"></textarea><p id="dietary-requirements-help">Pole opcjonalne.</p></div>
      <button type="submit">Sprawdź zamówienie</button><p id="order-form-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </form>
  </div></section>`;
}

function renderContact(bakery) {
  const hours = (bakery.openingHours ?? []).map((entry) => `<li><strong>${escapeHTML(entry.day)}:</strong> ${entry.closed ? 'zamknięte' : `${escapeHTML(entry.open)}–${escapeHTML(entry.close)}`}</li>`).join('');
  const address = bakery.address ?? {};
  return `<section class="section"><div class="container"><header class="section__header"><h1>Odwiedź nas</h1><p class="section__subtitle">${escapeHTML(bakery.tagline)}</p></header>
    <div class="container"><h2>Kontakt</h2><address><p>${escapeHTML(address.street)}<br>${escapeHTML(address.postalCode)} ${escapeHTML(address.city)}<br>${escapeHTML(address.country)}</p>
      <p><a href="tel:${escapeHTML(bakery.phone)}">${escapeHTML(bakery.phone)}</a><br><a href="mailto:${escapeHTML(bakery.email)}">${escapeHTML(bakery.email)}</a></p></address>
      <h2>Godziny otwarcia</h2><ul>${hours}</ul><h2>Nasza historia</h2><p>${escapeHTML(bakery.history?.narrative ?? '')}</p>
    </div></div></section>`;
}

const renderers = {
  home: async () => renderHome(await getProducts(), await getBakery()),
  menu: async () => renderMenu(await getProducts()),
  order: async () => renderOrder(await getProducts()),
  contact: async () => renderContact(await getBakery()),
};

export async function loadShell() {
  const [navigation, footer, bakery] = await Promise.all([
    fetch('/src/components/ui/navbar.html').then((response) => response.ok ? response.text() : Promise.reject(new Error('Navigation could not be loaded.'))),
    fetch('/src/components/ui/footer.html').then((response) => response.ok ? response.text() : Promise.reject(new Error('Footer could not be loaded.'))),
    getBakery().catch((error) => { console.error(error); return null; }),
  ]);
  document.querySelector('#nav-root').innerHTML = navigation;
  document.querySelector('#footer-root').innerHTML = footer;

  if (bakery) {
    const footerRoot = document.querySelector('#footer-root');
    const phone = footerRoot.querySelector('a[href^="tel:"]');
    const email = footerRoot.querySelector('a[href^="mailto:"]');
    const footerAddress = footerRoot.querySelector('.footer__links li:last-child');
    if (phone) { phone.href = `tel:${bakery.phone}`; phone.textContent = bakery.phone; }
    if (email) { email.href = `mailto:${bakery.email}`; email.textContent = bakery.email; }
    if (footerAddress) footerAddress.textContent = `${bakery.address.street}, ${bakery.address.postalCode} ${bakery.address.city}`;
  }
}

/** Loads a data-backed view module on demand and renders it into the main mount point. */
export async function loadView(route, target = document.querySelector('#main-content'), isCurrent = () => true) {
  if (!routes.has(route)) throw new RangeError(`Unknown view: ${route}`);
  if (!target) throw new Error('The #main-content mount point is missing.');

  target.setAttribute('aria-busy', 'true');
  const content = await renderers[route]();
  if (!isCurrent()) return;
  target.innerHTML = content;
  target.removeAttribute('aria-busy');
  document.title = `${pageTitles[route]} | Piekarnia Kubulek`;

  if (route === 'order') {
    const form = target.querySelector('#order-form');
    const [{ initializeCartHandler }, { initializeOrderForm }] = await Promise.all([
      import('../handlers/cartHandler.js'),
      import('../handlers/formValidation.js'),
    ]);
    if (!isCurrent() || !form.isConnected) return;
    initializeCartHandler(form);
    initializeOrderForm(form);
    form.addEventListener('cart:change', () => {
      const cart = Array.from(form.querySelectorAll('[data-cart-item]')).map((item) => ({
        id: item.querySelector('input[type="checkbox"]').value,
        quantity: Number(item.querySelector('input[type="number"]').value),
      })).filter((item) => item.quantity > 0);
      store.setCart(cart);
    });
    form.querySelectorAll('[data-cart-item] input[type="number"]').forEach((input) => {
      if (Number(input.value) > 0) input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}
