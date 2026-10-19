/**
 * WMAX GAMING — Main Script Entrypoint
 * Loads central configuration, shared cart service, and storefront controller.
 */
// If not already loaded via modular scripts:
if (typeof FORME_CONFIG === "undefined") {
  const configScript = document.createElement("script");
  configScript.src = "js/config.js";
  document.head.appendChild(configScript);
}

if (typeof Cart === "undefined") {
  const cartScript = document.createElement("script");
  cartScript.src = "js/cart.js";
  document.head.appendChild(cartScript);
}

const shopScript = document.createElement("script");
shopScript.src = "js/shop.js";
document.head.appendChild(shopScript);