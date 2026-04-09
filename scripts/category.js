import {addToCart, syncCartFromStorage} from './cart.js';
import {getProductsByCategory} from './products.js';
import {formatCurrency} from './utils/money.js';
import {updateCartBadge} from './site-shell.js';

const CATEGORY_LABELS = {
  utensils: 'Utensils Deals',
  clothes: 'Clothes Deals',
  electronics: 'Electronics Deals',
  books: 'Books and Essentials'
};

const params = new URLSearchParams(window.location.search);
const category = params.get('category') || 'utensils';
const categoryTitle = CATEGORY_LABELS[category] || 'Category Deals';

document.querySelector('.js-category-title').textContent = categoryTitle;

const matchedProducts = getProductsByCategory(category).slice(0, 12);

const categoryGrid = document.querySelector('.js-category-grid');
categoryGrid.innerHTML = matchedProducts
  .map((product) => `
    <article class="category-item">
      <img src="${product.image}" alt="${product.name}">
      <h3 class="limit-text-to-2-lines">${product.name}</h3>
      <div>⭐ ${product.rating.stars} (${product.rating.count})</div>
      <div class="category-price">Rs. ${formatCurrency(product.priceCents)}</div>
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </article>
  `)
  .join('');

const toastElement = document.querySelector('.js-toast');
let toastTimeoutId;

function updateCartQuantity() {
  const quantity = syncCartFromStorage().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.js-cart-quantity').textContent = quantity;
}

function showAddToCartFeedback() {
  toastElement.classList.add('show');
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastElement.classList.remove('show');
  }, 1300);
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    addToCart(button.dataset.productId);
    updateCartQuantity();
    updateCartBadge();
    showAddToCartFeedback();
  });
});

updateCartQuantity();
