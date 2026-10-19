/**
 * WMAX GAMING APPAREL — Storefront Interactions
 * Handles homepage filtering, mobile menu, quick-add actions, search, and squad newsletter.
 */
document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const searchToggle = document.getElementById("searchToggle");
  const newsletterForm = document.getElementById("newsletterForm");
  const formMessage = document.getElementById("formMessage");
  let toastTimer;

  // Toast notification helper
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Quick Add buttons
  document.querySelectorAll(".quick-add").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const id = button.dataset.id || button.dataset.name.toLowerCase().replace(/\s+/g, "-");
      const name = button.dataset.name || card?.querySelector("h3")?.textContent || "WMAX Piece";
      const price = parseInt(button.dataset.price, 10) || 2799;
      const color = button.dataset.color || card?.querySelector(".product-meta p")?.textContent || "Official Edition";
      const image = button.dataset.image || card?.querySelector("img")?.src || "";

      Cart.addItem({ id, name, price, color, image, quantity: 1 });
      showToast(`${name} added to bag · Click Bag to checkout`);
    });
  });

  // Category filters (All Drops, Hoodies & Jackets, Oversized Tees, Tactical Gear)
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
      const category = button.dataset.filter;
      let visibleCount = 0;

      document.querySelectorAll(".product-card").forEach((card) => {
        const visible = category === "all" || card.dataset.category === category;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      const emptyState = document.getElementById("emptyState");
      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Search functionality
  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      const term = window.prompt("Search hoodies, tees, or esports drops:");
      if (!term || !term.trim()) return;

      const cleanTerm = term.trim().toLowerCase();
      const cards = [...document.querySelectorAll(".product-card")];
      const matches = cards.filter((card) => card.textContent.toLowerCase().includes(cleanTerm));

      cards.forEach((card) => {
        card.hidden = !matches.includes(card);
      });

      document.querySelectorAll(".filter").forEach((f) => f.classList.remove("active"));

      const emptyState = document.getElementById("emptyState");
      if (emptyState) {
        emptyState.hidden = matches.length !== 0;
      }

      const dropsSection = document.getElementById("drops") || document.getElementById("new");
      if (dropsSection) {
        dropsSection.scrollIntoView({ behavior: "smooth" });
      }

      showToast(matches.length ? `${matches.length} matching piece${matches.length === 1 ? "" : "s"} found` : "No matching drops found");
    });
  }

  // Newsletter Form
  if (newsletterForm && formMessage) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("emailInput");
      const email = emailInput ? emailInput.value.trim() : "";
      if (!email) return;

      const contactEmail = (window.FORME_CONFIG && window.FORME_CONFIG.contactEmail) || "growwithmax6@gmail.com";
      formMessage.textContent = `Welcome to the Wmax Squad! Use code WMAX10 at checkout for 10% off. Inquiries: ${contactEmail}`;
      newsletterForm.reset();
    });
  }
});
