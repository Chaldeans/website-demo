/* =========================
   KASSA TECH — FINAL script.js (PERSISTENT CART)
   Copy + paste this entire file
   ========================= */

const CART_KEY = "kassa_cart_v1";

const products = [
  // GAMING PCs
  { id: 101, name: "Kassa 'Dominion' Build", cat: "pcs", price: 5299.0, label: "Flagship", desc: "RTX 4090 | i9-14900KS | 64GB DDR5. Includes custom liquid cooling and a 3-year performance guarantee.", img: "dominion.jpg" },
  { id: 102, name: "Kassa 'Velocity' Pro", cat: "pcs", price: 3450.0, label: "Elite", desc: "RTX 4080 Super | Ryzen 7 7800X3D. The perfect balance for 4K competitive gaming.", img: "velocity.jpg" },
  { id: 103, name: "Kassa 'Ghost' SFF", cat: "pcs", price: 2899.0, label: "Compact", desc: "High-performance mini-ITX build. RTX 4070 Ti Super in a small-footprint enthusiast chassis.", img: "ghost.jpg" },
  { id: 104, name: "Kassa 'Apex' Tier-1", cat: "pcs", price: 2150.0, label: "Performance", desc: "RTX 4070 | i7-14700K. Engineered for 1440p high-refresh rate dominance.", img: "apex.jpg" },
  { id: 105, name: "Kassa 'E-Streamer' X", cat: "pcs", price: 3950.0, label: "Workstation", desc: "Dual-chamber design optimized for streaming and heavy video editing without frame drops.", img: "streamer.jpg" },

  // MONITORS
  { id: 201, name: "ASUS Swift PG248QP", cat: "monitors", price: 949.0, label: "540Hz", desc: "The world's fastest E-TN panel. We pre-calibrate every unit for color accuracy.", img: "mon-1.jpg" },
  { id: 202, name: "Samsung Odyssey G9 OLED", cat: "monitors", price: 1899.0, label: "Ultrawide", desc: "49-inch curved OLED. Inspected for dead pixels and panel uniformity before shipping.", img: "samsung.jpg" },
  { id: 203, name: "ZOWIE XL2566K", cat: "monitors", price: 649.0, label: "Esports", desc: "360Hz with DyAc+. The gold standard for professional FPS competitors.", img: "mon-3.jpg" },
  { id: 204, name: "LG UltraGear 32GS95UE", cat: "monitors", price: 1499.0, label: "Dual-Mode", desc: "Switchable 4K 240Hz / 1080p 480Hz. The most versatile OLED on the market.", img: "mon-4.jpg" },
  { id: 205, name: "Alienware AW3225QF", cat: "monitors", price: 1249.0, label: "4K OLED", desc: "32-inch QD-OLED. Stunning 4K visuals with the speed of 240Hz refresh.", img: "mon-5.jpg" },

  // MICE & KEYBOARDS
  { id: 301, name: "Logitech G Pro X Superlight 2", cat: "mice", price: 179.0, label: "Pro", desc: "Equipped with hybrid optical-mechanical switches and 4K wireless polling.", img: "mouse-1.jpg" },
  { id: 401, name: "Wooting 60HE+ (Customized)", cat: "keyboards", price: 225.0, label: "Best Seller", desc: "Hall Effect switches with Rapid Trigger. Hand-lubed for a superior acoustic profile.", img: "kb-1.jpg" },
  { id: 302, name: "Razer Viper V3 Pro", cat: "mice", price: 175.0, label: "54g", desc: "Ultra-lightweight champion with 8KHz wireless polling capability.", img: "mouse-2.jpg" },
  { id: 404, name: "ASUS ROG Azoth", cat: "keyboards", price: 279.0, label: "Enthusiast", desc: "75% layout with OLED screen. Gasket-mounted for a premium typing experience.", img: "kb-4.jpg" },
  { id: 303, name: "Finalmouse UltralightX", cat: "mice", price: 249.0, label: "Limited", desc: "Carbon fiber composite. Only 29 grams. The ultimate in aiming agility.", img: "mouse-3.jpg" },

  // SERVICES
  { id: 501, name: "Elite System Latency Strip", cat: "tuning", price: 175.0, label: "Service", desc: "Deep Windows kernel optimization. We reduce DPC latency for smoother mouse movement.", img: "tune-1.jpg" },
  { id: 502, name: "Professional RAM Overclocking", cat: "tuning", price: 225.0, label: "Service", desc: "Manual sub-timing tuning. Increase your 1% low FPS by up to 25%.", img: "tune-2.jpg" },
  { id: 503, name: "Kassa 'Zero-Bloat' OS", cat: "software", price: 125.0, label: "Software", desc: "Custom Windows image with all telemetry and unnecessary services permanently removed.", img: "tune-3.jpg" },
  { id: 504, name: "Full System Health Audit", cat: "software", price: 85.0, label: "Support", desc: "Thermal analysis, malware removal, and driver stability check-up.", img: "tune-4.jpg" },
  { id: 505, name: "Remote BIOS Tuning", cat: "tuning", price: 110.0, label: "Remote", desc: "Expert overclocking and power limit adjustment performed via secure remote session.", img: "tune-5.jpg" }
];

/* =========================
   CART (persistent)
   ========================= */
let cart = loadCart();

/* =========================
   Startup
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  handleUrlParameters();
  wireCartButtons();
  updateCartUI();
});

/* =========================
   Cart persistence helpers
   ========================= */
function saveCart() {
  try {
    // store only IDs (smaller + future-proof)
    const ids = cart.map((p) => p.id);
    localStorage.setItem(CART_KEY, JSON.stringify(ids));
  } catch (e) {
    // if storage blocked, cart still works in-memory
    console.warn("Cart could not be saved:", e);
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    // rebuild cart from product list
    return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  } catch (e) {
    console.warn("Cart could not be loaded:", e);
    return [];
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

/* =========================
   Cart wiring
   ========================= */
function wireCartButtons() {
  const openBtn = document.getElementById("open-cart");
  const closeBtn = document.getElementById("close-cart");
  const overlay = document.getElementById("cart-overlay");
  const wipeBtn = document.getElementById("wipe-cart");
  const sidebar = document.getElementById("cart-sidebar");

  const openCart = () => {
    sidebar?.classList.add("open");
    overlay?.classList.add("show");
  };

  const closeCart = () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
  };

  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeCart();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeCart);
  }

  // ESC closes cart + modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      const modal = document.getElementById("product-modal");
      modal?.classList.remove("active");
    }
  });

  if (wipeBtn) {
    wipeBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      if (confirm("Confirm: Wipe all items from manifest?")) clearCart();
    });
  }
}

/* =========================
   Shop rendering
   ========================= */
function renderShop() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (p) => `
      <div class="glass-card product-box" data-category="${p.cat}" onclick="showProductDetails(${p.id})">
        ${p.label ? `<div class="pill-label">${p.label}</div>` : ""}
        <div class="product-img-container">
          <img src="${p.img}" alt="${escapeHtml(p.name)}" class="product-image"
               onerror="this.src='https://via.placeholder.com/300x200?text=Hardware'">
        </div>
        <div class="card-content">
          <h4>${escapeHtml(p.name)}</h4>
          <p class="price-tag">$${formatMoney(p.price)}</p>
        </div>
        <button class="btn-primary add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
      </div>
    `
    )
    .join("");
}

function filterShop(category, element) {
  if (!document.getElementById("product-grid")) {
    window.location.href = `shop.html?cat=${category}`;
    return;
  }

  document.querySelectorAll(".cat-link").forEach((link) => link.classList.remove("active"));
  if (element) element.classList.add("active");

  document.querySelectorAll(".product-box").forEach((card) => {
    const itemCat = card.getAttribute("data-category");
    card.style.display = category === "all" || itemCat === category ? "block" : "none";
  });
}

function handleUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("cat");
  if (category) filterShop(category);
}

/* =========================
   Modal
   ========================= */
function showProductDetails(id) {
  const p = products.find((item) => item.id === id);
  const modal = document.getElementById("product-modal");
  const body = document.getElementById("modal-body");
  if (!p || !modal || !body) return;

  body.innerHTML = `
    <div class="modal-layout">
      <img src="${p.img}" class="modal-img" onerror="this.src='https://via.placeholder.com/400x300?text=Kassa+Elite'">
      <div class="modal-info">
        <span class="pill-label">${escapeHtml(p.cat.toUpperCase())}</span>
        <h2>${escapeHtml(p.name)}</h2>
        <p class="modal-desc">${escapeHtml(p.desc)}</p>
        <h3 class="modal-price">$${formatMoney(p.price)}</h3>
        <button class="btn-primary" onclick="addToCart(${p.id}); closeModal()">Add to Manifest</button>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("product-modal")?.classList.remove("active");
}

/* =========================
   Cart logic
   ========================= */
function addToCart(productId) {
  const item = products.find((p) => p.id === productId);
  if (!item) return;

  cart.push(item);
  saveCart();
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.getElementById("cart-items");
  const badge = document.getElementById("cart-count");
  const totalContainer = document.getElementById("cart-total");

  if (!cartContainer || !badge || !totalContainer) return;

  badge.innerText = String(cart.length);
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">No hardware selected.</p>';
    totalContainer.innerText = "$0.00";
    return;
  }

  cartContainer.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <div class="cart-left">
          <h5 title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h5>
          <small class="cart-price">$${formatMoney(item.price)}</small>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})">REMOVE</button>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalContainer.innerText = `$${formatMoney(total)}`;
}

/* =========================
   Form handler (Services page)
   ========================= */
document.addEventListener("submit", (e) => {
  if (e.target && e.target.id === "kassa-form") {
    e.preventDefault();

    const container = document.getElementById("form-container") || e.target.parentElement;

    e.target.style.opacity = "0";
    e.target.style.transition = "opacity 0.4s ease";

    setTimeout(() => {
      container.innerHTML = `
        <div style="text-align:center; padding:20px 0; animation: fadeIn 0.5s ease-out;">
          <span class="pill-label" style="margin:0 auto 20px;">Status: Encrypted</span>
          <h2 class="purple-gradient" style="font-size:2rem; margin-bottom:15px;">TRANSMISSION RECEIVED</h2>
          <p style="color:#888; font-size:0.95rem; line-height:1.6;">
            Your project details have been uplinked to our technical lead.
            Expect a response within 24 operational hours.
          </p>
          <button class="btn-primary" style="margin-top:30px; width:auto; padding:12px 30px;" onclick="location.reload()">Send New Brief</button>
        </div>
      `;
    }, 400);
  }
});

/* =========================
   Helpers
   ========================= */
function formatMoney(num) {
  return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
