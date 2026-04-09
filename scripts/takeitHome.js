import {addToCart, syncCartFromStorage} from './cart.js';
import {getProducts, getProductsByCategory} from './products.js';
import {updateCartBadge} from './site-shell.js';

const CATEGORY_TITLES = {
  all: 'All Products',
  deals: 'Best Deals',
  electronics: 'Electronics',
  fashion: 'Fashion',
  clothes: 'Clothes',
  books: 'Books',
  utensils: 'Utensils'
};

let selectedCategory = 'all';
let toastTimeoutId;

const toastElement = document.querySelector('.js-toast');
const productsTitleElement = document.querySelector('.js-products-title');
const productsCountElement = document.querySelector('.js-products-count');
const productsGridElement = document.querySelector('.js-filtered-products-grid');

function formatPrice(value) {
  return (value / 100).toFixed(2);
}

function normalizeCategory(category) {
  if (category === 'fashion') {
    return 'clothes';
  }

  return category;
}

function getFilteredProducts(category) {
  if (category === 'all') {
    return getProducts();
  }

  return getProductsByCategory(normalizeCategory(category));
}

function renderProductGrid() {
  const filteredProducts = getFilteredProducts(selectedCategory);

  productsGridElement.classList.add('is-updating');

  productsTitleElement.textContent = CATEGORY_TITLES[selectedCategory] || 'Products';
  productsCountElement.textContent = `${filteredProducts.length} items`;

  productsGridElement.innerHTML = filteredProducts
    .map((product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <h3 class="limit-text-to-2-lines">${product.name}</h3>
        <div class="product-rating">⭐ ${product.rating}</div>
        <div class="product-price">Rs. ${formatPrice(product.price)}</div>
        <button class="button-primary add-to-cart-button js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </article>
    `)
    .join('');

  requestAnimationFrame(() => {
    productsGridElement.classList.remove('is-updating');
  });
}

function renderMiniCategoryGrid(category) {
  const miniGrid = document.querySelector(`.js-mini-grid-${category}`);
  const products = category === 'deals'
    ? [...getProducts()].sort((a, b) => a.price - b.price).slice(0, 4)
    : getProductsByCategory(category).slice(0, 4);

  if (!miniGrid) {
    return;
  }

  miniGrid.innerHTML = products
    .map((product) => `
      <article class="mini-item">
        <img src="${product.image}" alt="${product.name}">
        <p class="limit-text-to-2-lines">${product.name}</p>
      </article>
    `)
    .join('');
}

function updateActiveCategoryUI() {
  document.querySelectorAll('.nav-chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.category === selectedCategory);
  });

  document.querySelectorAll('.category-card').forEach((card) => {
    card.classList.toggle('is-active', card.dataset.category === normalizeCategory(selectedCategory));
  });
}

function setCategory(category) {
  if (selectedCategory === category) {
    return;
  }

  selectedCategory = category;
  updateActiveCategoryUI();
  renderProductGrid();
}

function attachCategoryHandlers() {
  document.querySelector('.secondary-nav').addEventListener('click', (event) => {
    const chip = event.target.closest('.nav-chip');

    if (!chip) {
      return;
    }

    event.preventDefault();
    setCategory(chip.dataset.category);
  });

  document.querySelector('.category-deck').addEventListener('click', (event) => {
    const categoryCard = event.target.closest('.category-card');
    const seeMoreLink = event.target.closest('.see-more-link');

    if (seeMoreLink) {
      event.preventDefault();
      setCategory(seeMoreLink.dataset.category);
      return;
    }

    if (categoryCard) {
      setCategory(categoryCard.dataset.category);
    }
  });
}

function updateCartQuantity() {
  const cartItems = syncCartFromStorage();
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.js-cart-quantity');

  cartBadge.textContent = cartQuantity;
  cartBadge.classList.remove('bump');
  void cartBadge.offsetWidth;
  cartBadge.classList.add('bump');
}

function showAddToCartFeedback(button) {
  button.classList.remove('added');
  void button.offsetWidth;
  button.classList.add('added');

  toastElement.classList.add('show');
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastElement.classList.remove('show');
  }, 1400);
}

function attachAddToCartHandler() {
  productsGridElement.addEventListener('click', (event) => {
    const button = event.target.closest('.js-add-to-cart');

    if (!button) {
      return;
    }

    addToCart(button.dataset.productId);
    updateCartQuantity();
    updateCartBadge();
    showAddToCartFeedback(button);
  });
}

function initHeroSlider() {
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
}

function initSplashScreen() {
  const splashElement = document.querySelector('.js-splash-screen');
  const contentElement = document.querySelector('.js-home-content');

  setTimeout(() => {
    splashElement.classList.add('hidden');
    contentElement.classList.add('visible');
    document.body.classList.remove('page-loading');
  }, 2200);
}

function init() {
  renderMiniCategoryGrid('deals');
  renderMiniCategoryGrid('utensils');
  renderMiniCategoryGrid('clothes');
  renderMiniCategoryGrid('electronics');
  renderMiniCategoryGrid('books');

  attachCategoryHandlers();
  attachAddToCartHandler();
  selectedCategory = '';
  setCategory('all');
  updateCartQuantity();
  initHeroSlider();
  initSplashScreen();
}

init();
