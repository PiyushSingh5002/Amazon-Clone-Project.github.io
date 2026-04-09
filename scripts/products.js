import {storeProducts as defaultProducts} from '../data/store-products.js';

const PRODUCTS_KEY = 'tih-products';

function writeProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function initializeProductsStore() {
  const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

  if (!Array.isArray(savedProducts) || savedProducts.length === 0) {
    writeProducts(defaultProducts);
  }
}

export function getProducts() {
  initializeProductsStore();

  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  return Array.isArray(products) ? products : defaultProducts;
}

export function setProducts(products) {
  if (!Array.isArray(products)) {
    return;
  }

  writeProducts(products);
}

export function getProductsByCategory(category) {
  const products = getProducts();

  if (category === 'all') {
    return products;
  }

  if (category === 'deals') {
    return [...products].sort((a, b) => a.price - b.price).slice(0, 8);
  }

  const mappedCategory = category === 'fashion' ? 'clothes' : category;
  return products.filter((product) => product.category === mappedCategory);
}
