/**
 * FORME — Checkout Controller
 * Powers dynamic cart rendering, promo codes, shipping methods, form validation, and order processing.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Config & Cart references
  const cfg = window.FORME_CONFIG || {
    contactEmail: "growwithmax6@gmail.com",
    freeShippingThreshold: 2999,
    standardShippingFee: 199,
    expressShippingFee: 350,
    promoCodes: { "FORME10": { discount: 0.10 } },
    gstRate: 0.05
  };

  // DOM Elements
  const cartItemsList = document.getElementById("cartItemsList");
  const cartEmptyNotice = document.getElementById("cartEmptyNotice");
  const summaryItemCount = document.getElementById("summaryItemCount");
  const subtotalAmount = document.getElementById("subtotalAmount");
  const discountRow = document.getElementById("discountRow");
  const discountAmount = document.getElementById("discountAmount");
  const discountPercentText = document.getElementById("discountPercentText");
  const shippingAmount = document.getElementById("shippingAmount");
  const standardShippingDisplay = document.getElementById("standardShippingDisplay");
  const taxAmount = document.getElementById("taxAmount");
  const finalTotalAmount = document.getElementById("finalTotalAmount");
  const buttonPayText = document.getElementById("buttonPayText");
  const submitOrderBtn = document.getElementById("submitOrderBtn");
  const checkoutForm = document.getElementById("checkoutForm");

  const promoInput = document.getElementById("promoInput");
  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const promoFeedback = document.getElementById("promoFeedback");

  const orderSuccessModal = document.getElementById("orderSuccessModal");
  const modalOrderNumber = document.getElementById("modalOrderNumber");
  const modalCustomerEmail = document.getElementById("modalCustomerEmail");
  const modalDeliveryEstimate = document.getElementById("modalDeliveryEstimate");
  const modalPaymentMethod = document.getElementById("modalPaymentMethod");
  const modalTotalPaid = document.getElementById("modalTotalPaid");
  const modalContinueBtn = document.getElementById("modalContinueBtn");

  // Always hide the modal on page load (safety guard)
  if (orderSuccessModal) orderSuccessModal.hidden = true;

  // State
  let appliedDiscount = 0; // fraction, e.g. 0.10

  // Read selected shipping method
  function getShippingMethod() {
    const checked = document.querySelector('input[name="shippingMethod"]:checked');
    return checked ? checked.value : "standard";
  }

  // Read selected payment option
  function getPaymentOption() {
    const checked = document.querySelector('input[name="paymentOption"]:checked');
    return checked ? checked.value : "card";
  }

  // Render bag contents and update summary
  function renderCart() {
    const items = Cart.getItems();

    if (items.length === 0) {
      cartItemsList.innerHTML = "";
      cartEmptyNotice.hidden = false;
      summaryItemCount.textContent = "0 items";
      subtotalAmount.textContent = Cart.formatCurrency(0);
      discountRow.hidden = true;
      shippingAmount.textContent = Cart.formatCurrency(0);
      taxAmount.textContent = Cart.formatCurrency(0);
      finalTotalAmount.textContent = Cart.formatCurrency(0);
      buttonPayText.textContent = "Bag is Empty";
      submitOrderBtn.disabled = true;
      return;
    }

    submitOrderBtn.disabled = false;
    cartEmptyNotice.hidden = true;

    const totalCount = Cart.getCount();
    summaryItemCount.textContent = `${totalCount} item${totalCount === 1 ? "" : "s"}`;

    cartItemsList.innerHTML = items
      .map(
        (item, index) => `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-image">
            <img src="${item.image || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80'}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">${item.color || 'Standard Edit'}</div>
            <div class="cart-item-qty-wrap">
              <button type="button" class="qty-btn btn-decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
              <span class="qty-number">${item.quantity || 1}</span>
              <button type="button" class="qty-btn btn-increase" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-item-price-wrap">
            <span class="cart-item-price">${Cart.formatCurrency(item.price * (item.quantity || 1))}</span>
            <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Remove item" title="Remove">✕</button>
          </div>
        </div>
      `
      )
      .join("");

    updateTotals();
  }

  // Recalculate price totals
  function updateTotals() {
    const items = Cart.getItems();
    const subtotal = Cart.getSubtotal();
    const shippingMethod = getShippingMethod();

    // Discount calculation
    let discountVal = 0;
    if (appliedDiscount > 0) {
      discountVal = Math.round(subtotal * appliedDiscount);
      discountRow.hidden = false;
      discountPercentText.textContent = `${Math.round(appliedDiscount * 100)}%`;
      discountAmount.textContent = `-${Cart.formatCurrency(discountVal)}`;
    } else {
      discountRow.hidden = true;
    }

    // Shipping cost calculation
    let shippingCost = 0;
    if (shippingMethod === "express") {
      shippingCost = cfg.expressShippingFee;
      shippingAmount.textContent = Cart.formatCurrency(shippingCost);
    } else {
      if (subtotal >= cfg.freeShippingThreshold || subtotal === 0) {
        shippingCost = 0;
        shippingAmount.textContent = "Free";
      } else {
        shippingCost = cfg.standardShippingFee;
        shippingAmount.textContent = Cart.formatCurrency(shippingCost);
      }
    }

    if (standardShippingDisplay) {
      standardShippingDisplay.textContent = subtotal >= cfg.freeShippingThreshold ? "Free" : Cart.formatCurrency(cfg.standardShippingFee);
    }

    // Taxes: 5% GST included
    const taxableBase = Math.max(0, subtotal - discountVal);
    const estTax = Math.round((taxableBase * cfg.gstRate) / (1 + cfg.gstRate));

    const finalTotal = taxableBase + shippingCost;

    subtotalAmount.textContent = Cart.formatCurrency(subtotal);
    taxAmount.textContent = `${Cart.formatCurrency(estTax)} (included)`;
    finalTotalAmount.textContent = Cart.formatCurrency(finalTotal);
    buttonPayText.textContent = `Place Order · ${Cart.formatCurrency(finalTotal)}`;
  }

  // Quantity modification and deletion
  cartItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const index = parseInt(target.dataset.index, 10);
    if (isNaN(index)) return;

    const items = Cart.getItems();
    if (!items[index]) return;

    if (target.classList.contains("btn-increase")) {
      Cart.updateQuantity(index, (items[index].quantity || 1) + 1);
      renderCart();
    } else if (target.classList.contains("btn-decrease")) {
      Cart.updateQuantity(index, (items[index].quantity || 1) - 1);
      renderCart();
    } else if (target.classList.contains("cart-item-remove")) {
      Cart.removeItem(index);
      renderCart();
    }
  });

  // Shipping selection change
  document.querySelectorAll('input[name="shippingMethod"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".delivery-option").forEach((opt) => opt.classList.remove("active"));
      radio.closest(".delivery-option")?.classList.add("active");
      updateTotals();
    });
  });

  // Payment tab switching
  document.querySelectorAll(".payment-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".payment-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const radio = tab.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const targetPanelId = tab.dataset.target;
      document.querySelectorAll(".payment-panel").forEach((panel) => {
        panel.classList.remove("active");
      });
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // Promo Code Application
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        promoFeedback.className = "promo-feedback error";
        promoFeedback.textContent = "Please enter a coupon code.";
        return;
      }

      const promo = cfg.promoCodes && cfg.promoCodes[code];
      if (promo) {
        appliedDiscount = promo.discount;
        promoFeedback.className = "promo-feedback success";
        promoFeedback.textContent = `Coupon "${code}" applied: ${promo.description || 'Discount applied'}.`;
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        applyPromoBtn.textContent = "Applied";
        updateTotals();
      } else {
        promoFeedback.className = "promo-feedback error";
        promoFeedback.textContent = "Invalid code. Try using WMAX10 for 10% off.";
      }
    });

    promoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyPromoBtn.click();
      }
    });
  }

  // Credit Card formatting
  const cardNumberInput = document.getElementById("cardNumber");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").slice(0, 16);
      val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = val;
    });
  }

  // Card Expiry formatting
  const cardExpiryInput = document.getElementById("cardExpiry");
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (val.length >= 2) {
        val = val.slice(0, 2) + " / " + val.slice(2);
      }
      e.target.value = val;
    });
  }

  // Validation helper
  function validateField(groupId, isValid) {
    const group = document.getElementById(groupId);
    if (!group) return true;
    if (isValid) {
      group.classList.remove("has-error");
      return true;
    } else {
      group.classList.add("has-error");
      return false;
    }
  }

  // Checkout form submit
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (Cart.getItems().length === 0) {
      alert("Your shopping bag is empty. Please select a piece to continue.");
      return;
    }

    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const address = document.getElementById("addressLine1").value.trim();
    const city = document.getElementById("city").value.trim();
    const postal = document.getElementById("postalCode").value.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = phone.replace(/\D/g, "").length >= 10;
    const firstValid = firstName.length > 0;
    const lastValid = lastName.length > 0;
    const addressValid = address.length > 0;
    const cityValid = city.length > 0;
    const postalValid = postal.replace(/\D/g, "").length === 6;

    let valid = true;
    if (!validateField("groupEmail", emailValid)) valid = false;
    if (!validateField("groupPhone", phoneValid)) valid = false;
    if (!validateField("groupFirstName", firstValid)) valid = false;
    if (!validateField("groupLastName", lastValid)) valid = false;
    if (!validateField("groupAddress", addressValid)) valid = false;
    if (!validateField("groupCity", cityValid)) valid = false;
    if (!validateField("groupPostal", postalValid)) valid = false;

    if (!valid) {
      const firstError = document.querySelector(".form-group.has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Submit animation
    submitOrderBtn.disabled = true;
    const originalText = buttonPayText.textContent;
    buttonPayText.textContent = "Securing Order...";

    setTimeout(() => {
      const orderRef = Math.floor(10000 + Math.random() * 90000);
      modalOrderNumber.textContent = `#WMAX-${orderRef}`;
      modalCustomerEmail.textContent = email;

      const shippingMethod = getShippingMethod();
      modalDeliveryEstimate.textContent = shippingMethod === "express" ? "1–2 Business Days (Priority)" : "3–5 Business Days (Standard)";

      const paymentMethod = getPaymentOption();
      const methodLabels = {
        card: "Credit / Debit Card",
        upi: "UPI / Net Banking",
        cod: "Cash on Delivery"
      };
      modalPaymentMethod.textContent = methodLabels[paymentMethod] || "Card";
      modalTotalPaid.textContent = finalTotalAmount.textContent;

      // Show confirmation modal
      orderSuccessModal.hidden = false;

      // Clear cart
      Cart.clear();
      submitOrderBtn.disabled = false;
      buttonPayText.textContent = originalText;
    }, 1200);
  });

  // Modal continue shopping
  modalContinueBtn.addEventListener("click", () => {
    window.location.href = "index.html#drops";
  });

  // If cart is empty, render helper button to add sample piece
  const emptyNoticeContainer = document.getElementById("cartEmptyNotice");
  if (emptyNoticeContainer && !emptyNoticeContainer.querySelector(".btn-sample-add")) {
    const sampleBtn = document.createElement("button");
    sampleBtn.type = "button";
    sampleBtn.className = "button button-dark button-small btn-sample-add";
    sampleBtn.style.marginTop = "10px";
    sampleBtn.style.marginLeft = "8px";
    sampleBtn.textContent = "+ Add Sample Hoodie";
    sampleBtn.addEventListener("click", () => {
      Cart.addItem({
        id: "close-combat-hoodie",
        name: "Close Combat Oversized Hoodie",
        price: 2799,
        color: "380 GSM French Terry · Jet Black",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
        quantity: 1
      });
      renderCart();
    });
    emptyNoticeContainer.appendChild(sampleBtn);
  }

  // Initial render
  renderCart();
});
