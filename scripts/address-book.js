import {cart} from '../data/cart.js';
import {addAddress, deleteAddress, getAddresses} from '../data/user-profile.js';

function updateCartQuantity() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.js-cart-quantity');

  if (badge) {
    badge.textContent = quantity;
  }
}

function renderAddresses() {
  const listElement = document.querySelector('.js-address-list');
  const addresses = getAddresses();

  if (addresses.length === 0) {
    listElement.innerHTML = '<div class="empty-message">No saved addresses yet.</div>';
    return;
  }

  listElement.innerHTML = addresses
    .map((address) => `
      <article class="account-item">
        <div class="account-item-title">${address.fullName}</div>
        <div>${address.addressLine}, ${address.city}, ${address.state} - ${address.pinCode}</div>
        <div>Phone: ${address.phone}</div>
        <button class="button-secondary js-delete-address" data-id="${address.id}">Delete</button>
      </article>
    `)
    .join('');

  document.querySelectorAll('.js-delete-address').forEach((button) => {
    button.addEventListener('click', () => {
      deleteAddress(button.dataset.id);
      renderAddresses();
    });
  });
}

document.querySelector('.js-address-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  addAddress({
    fullName: formData.get('fullName').toString().trim(),
    phone: formData.get('phone').toString().trim(),
    addressLine: formData.get('addressLine').toString().trim(),
    city: formData.get('city').toString().trim(),
    state: formData.get('state').toString().trim(),
    pinCode: formData.get('pinCode').toString().trim()
  });

  form.reset();
  renderAddresses();
});

updateCartQuantity();
renderAddresses();
