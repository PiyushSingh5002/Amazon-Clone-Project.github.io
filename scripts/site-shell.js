import {cart} from '../data/cart.js';

const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
const badgeElement = document.querySelector('.js-cart-quantity');

if (badgeElement) {
  badgeElement.textContent = quantity;
}
