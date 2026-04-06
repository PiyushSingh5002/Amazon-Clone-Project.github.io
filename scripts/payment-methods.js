import {cart} from '../data/cart.js';
import {addPaymentMethod, deletePaymentMethod, getPaymentMethods} from '../data/user-profile.js';

function updateCartQuantity() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.js-cart-quantity');

  if (badge) {
    badge.textContent = quantity;
  }
}

function maskCardNumber(rawNumber) {
  const cleanNumber = rawNumber.replace(/\s+/g, '');
  const lastFour = cleanNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
}

function renderPaymentMethods() {
  const listElement = document.querySelector('.js-payment-list');
  const paymentMethods = getPaymentMethods();

  if (paymentMethods.length === 0) {
    listElement.innerHTML = '<div class="empty-message">No saved cards yet.</div>';
    return;
  }

  listElement.innerHTML = paymentMethods
    .map((method) => `
      <article class="account-item">
        <div class="account-item-title">${method.cardName}</div>
        <div>${method.cardNumber}</div>
        <div>Expiry: ${method.expiry}</div>
        <button class="button-secondary js-delete-payment" data-id="${method.id}">Delete</button>
      </article>
    `)
    .join('');

  document.querySelectorAll('.js-delete-payment').forEach((button) => {
    button.addEventListener('click', () => {
      deletePaymentMethod(button.dataset.id);
      renderPaymentMethods();
    });
  });
}

document.querySelector('.js-payment-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  addPaymentMethod({
    cardName: formData.get('cardName').toString().trim(),
    cardNumber: maskCardNumber(formData.get('cardNumber').toString().trim()),
    expiry: formData.get('expiry').toString().trim()
  });

  form.reset();
  renderPaymentMethods();
});

updateCartQuantity();
renderPaymentMethods();
