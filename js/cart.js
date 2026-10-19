/**
 * FORME — Cart Management Service
 * Single source of truth for persistent cart storage, calculations, and updates.
 */
const Cart = {
  /**
   * Retrieves cart items from localStorage.
   * @returns {Array} List of cart item objects.
   */
  getItems() {
    try {
      const key = (window.FORME_CONFIG && window.FORME_CONFIG.storageKey) || "wmax_cart";
      const raw = localStorage.getItem(key) || localStorage.getItem("wmax_cart") || localStorage.getItem("forme_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to read cart from localStorage:", e);
      return [];
    }
  },

  /**
   * Saves cart items array to localStorage and updates UI badges.
   * @param {Array} items
   */
  saveItems(items) {
    try {
      const key = (window.FORME_CONFIG && window.FORME_CONFIG.storageKey) || "wmax_cart";
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
    this.updateBadges();
  },

  /**
   * Adds an item to the cart or increments its quantity if already present.
   * @param {Object} product
   */
  addItem(product) {
    const items = this.getItems();
    const existingIndex = items.findIndex((i) => i.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity = (items[existingIndex].quantity || 1) + (product.quantity || 1);
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        color: product.color || "Standard Edit",
        image: product.image || "",
        quantity: product.quantity || 1
      });
    }

    this.saveItems(items);
    return items;
  },

  /**
   * Modifies the quantity of an item at the specified index.
   * Removes the item if quantity drops to 0.
   */
  updateQuantity(index, quantity) {
    const items = this.getItems();
    if (items[index]) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      this.saveItems(items);
    }
    return items;
  },

  /**
   * Removes an item by index.
   */
  removeItem(index) {
    const items = this.getItems();
    if (items[index]) {
      items.splice(index, 1);
      this.saveItems(items);
    }
    return items;
  },

  /**
   * Clears the entire cart.
   */
  clear() {
    const key = (window.FORME_CONFIG && window.FORME_CONFIG.storageKey) || "wmax_cart";
    localStorage.removeItem(key);
    localStorage.removeItem("forme_cart");
    this.updateBadges();
  },

  /**
   * Returns total number of individual pieces in the bag.
   */
  getCount() {
    return this.getItems().reduce((total, item) => total + (item.quantity || 1), 0);
  },

  /**
   * Returns raw subtotal in INR.
   */
  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  },

  /**
   * Formats numbers into currency format (₹).
   */
  formatCurrency(num) {
    const symbol = (window.FORME_CONFIG && window.FORME_CONFIG.currencySymbol) || "₹";
    return `${symbol}${Math.max(0, Math.round(num)).toLocaleString("en-IN")}`;
  },

  /**
   * Updates any bag counter badge elements in the current document.
   */
  updateBadges() {
    const count = this.getCount();
    const badge = document.getElementById("bagCount");
    if (badge) {
      badge.textContent = count;
    }
  }
};

window.Cart = Cart;

// Synchronize badge on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Cart.updateBadges());
} else {
  Cart.updateBadges();
}
