/**
 * FORME — Checkout Script Entrypoint
 * Loads central configuration, shared cart service, and checkout controller.
 */
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

const checkoutScript = document.createElement("script");
checkoutScript.src = "js/checkout.js";
document.head.appendChild(checkoutScript);
