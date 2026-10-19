/**
 * WMAX GAMING APPAREL — Application Configuration
 * Official merchandise & streetwear settings for @WmaxGaming6
 */
const FORME_CONFIG = {
  storeName: "WMAX GAMING",
  storeTagline: "Official Gaming Streetwear · Season 01 Drop",
  creatorName: "Max Gaming",
  youtubeHandle: "@WmaxGaming6",
  youtubeUrl: "https://www.youtube.com/@WmaxGaming6/videos",
  instagramHandle: "@wmaxfromhell",
  
  // Client's primary email address
  contactEmail: "growwithmax6@gmail.com",
  
  // Shipping thresholds & rates in INR
  freeShippingThreshold: 2999,
  standardShippingFee: 199,
  expressShippingFee: 350,
  
  // Active promotional discounts for stream community
  promoCodes: {
    "WMAX10": { discount: 0.10, description: "10% off for Wmax Squad community" },
    "FORME10": { discount: 0.10, description: "10% off your entire order" },
    "BGMI10": { discount: 0.10, description: "10% off esports close-encounter drop" }
  },
  
  // Tax calculation: 5% GST included
  gstRate: 0.05,
  currencySymbol: "₹",
  storageKey: "wmax_cart"
};

// Expose globally
window.FORME_CONFIG = FORME_CONFIG;
