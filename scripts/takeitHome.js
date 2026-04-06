import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

const showcase = [
  {
    productId: '54e0eccd-8f36-462b-b68a-8182611d9add',
    image: 'https://picsum.photos/seed/holiday1/450/350',
    oldPriceCents: 2899
  },
  {
    productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
    image: 'https://picsum.photos/seed/holiday2/450/350',
    oldPriceCents: 1299
  },
  {
    productId: 'c2a82c5e-aff4-435f-9975-517cfaba2ece',
    image: 'https://picsum.photos/seed/holiday3/450/350',
    oldPriceCents: 3999
  },
  {
    productId: '58b4fc92-e98c-42aa-8c55-b6b79996769a',
    image: 'https://picsum.photos/seed/holiday4/450/350',
    oldPriceCents: 4590
  },
  {
    productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
    image: 'https://picsum.photos/seed/holiday5/450/350',
    oldPriceCents: 2699
  },
  {
    productId: '901eb2ca-386d-432e-82f0-6fb1ee7bf969',
    image: 'https://picsum.photos/seed/holiday6/450/350',
    oldPriceCents: 5299
  }
];

function findProduct(productId) {
  return products.find((product) => product.id === productId);
}

function renderHolidayGrid() {
  const grid = document.querySelector('.js-holiday-grid');
  grid.innerHTML = showcase
    .map((item) => {
      const product = findProduct(item.productId);

      if (!product) {
        return '';
      }

      return `
        <article class="deal-card">
          <img src="${item.image}" alt="${product.name}">
          <h3 class="limit-text-to-2-lines">${product.name}</h3>
          <div class="deal-meta">
            <span class="discount-price">Rs. ${formatCurrency(product.priceCents)}</span>
            <span class="strike-price">Rs. ${formatCurrency(item.oldPriceCents)}</span>
            <div>⭐ ${product.rating.stars} (${product.rating.count})</div>
          </div>
          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </article>
      `;
    })
    .join('');
}

function renderTopPicks() {
  const row = document.querySelector('.js-top-picks-row');
  row.innerHTML = products.slice(0, 10)
    .map((product, index) => `
      <article class="top-pick-card">
        <img src="https://picsum.photos/seed/top-pick-${index + 1}/430/280" alt="${product.name}">
        <h3 class="limit-text-to-2-lines">${product.name}</h3>
        <div class="deal-meta">⭐ ${product.rating.stars} (${product.rating.count})</div>
        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </article>
    `)
    .join('');
}

function renderNewArrivals() {
  const grid = document.querySelector('.js-arrival-grid');
  grid.innerHTML = products.slice(10, 18)
    .map((product, index) => `
      <article class="arrival-card">
        <img src="https://picsum.photos/seed/new-arrival-${index + 1}/430/280" alt="${product.name}">
        <span class="arrival-badge">NEW</span>
        <h3 class="limit-text-to-2-lines">${product.name}</h3>
        <div class="arrival-meta">Rs. ${formatCurrency(product.priceCents)}</div>
        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </article>
    `)
    .join('');
}

function renderSections() {
  renderHolidayGrid();
  renderTopPicks();
  renderNewArrivals();
}

const toastElement = document.querySelector('.js-toast');
let toastTimeoutId;

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;

  const cartBadge = document.querySelector('.js-cart-quantity');
  cartBadge.classList.remove('bump');
  void cartBadge.offsetWidth;
  cartBadge.classList.add('bump');
}

function showAddToCartFeedback(button) {
  button.classList.remove('added');
  void button.offsetWidth;
  button.classList.add('added');

  if (toastElement) {
    toastElement.textContent = '✅ Added to Cart!';
    toastElement.classList.add('show');

    clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
      toastElement.classList.remove('show');
    }, 1500);
  }
}

function attachAddToCartListeners() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
      showAddToCartFeedback(button);
    });
  });
}

renderSections();
attachAddToCartListeners();
updateCartQuantity();

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDotsContainer = document.querySelector('.js-hero-dots');
const nextButton = document.querySelector('.js-hero-next');
const prevButton = document.querySelector('.js-hero-prev');
let currentSlideIndex = 0;
let autoSlideIntervalId;

function renderHeroDots() {
  heroDotsContainer.innerHTML = heroSlides
    .map((_, index) => `
      <button class="hero-dot ${index === currentSlideIndex ? 'is-active' : ''} js-hero-dot"
        data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `)
    .join('');

  document.querySelectorAll('.js-hero-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      currentSlideIndex = Number(dot.dataset.index);
      updateHeroSlide();
      restartAutoSlide();
    });
  });
}

function updateHeroSlide() {
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === currentSlideIndex);
  });

  renderHeroDots();
}

function goToNextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
  updateHeroSlide();
}

function goToPrevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
  updateHeroSlide();
}

function restartAutoSlide() {
  clearInterval(autoSlideIntervalId);
  autoSlideIntervalId = setInterval(goToNextSlide, 3000);
}

if (heroSlides.length > 0) {
  updateHeroSlide();
  restartAutoSlide();

  nextButton.addEventListener('click', () => {
    goToNextSlide();
    restartAutoSlide();
  });

  prevButton.addEventListener('click', () => {
    goToPrevSlide();
    restartAutoSlide();
  });
}

const splashElement = document.querySelector('.js-splash-screen');
const contentElement = document.querySelector('.js-home-content');

setTimeout(() => {
  splashElement.classList.add('hidden');
  contentElement.classList.add('visible');
  document.body.classList.remove('page-loading');
}, 2500);