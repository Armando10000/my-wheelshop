// Product database
const products = [
  {
    id: 1,
    name: "BBS LM",
    price: 299,
    image: "images/wheel1.jpg",
    size: '18"',
    bolt: "5x114.3",
    offset: "+35mm",
    finish: "Silver with polished lip",
  },
  {
    id: 2,
    name: "OZ Racing Superturismo",
    price: 279,
    image: "images/wheel2.jpg",
    size: '17"',
    bolt: "5x112",
    offset: "+40mm",
    finish: "Matt Black",
  },
  {
    id: 3,
    name: "Enkei RPF1",
    price: 349,
    image: "images/wheel3.jpg",
    size: '18"',
    bolt: "5x100",
    offset: "+45mm",
    finish: "Silver",
  },
  {
    id: 4,
    name: "Work Meister S1",
    price: 399,
    image: "images/wheel4.jpg",
    size: '19"',
    bolt: "5x114.3",
    offset: "+22mm",
    finish: "Gold",
  },
  {
    id: 5,
    name: "Rotiform BLQ",
    price: 329,
    image: "images/wheel5.jpg",
    size: '20"',
    bolt: "5x112",
    offset: "+35mm",
    finish: "Silver Machined",
  },
  {
    id: 6,
    name: "Volk Racing TE37",
    price: 449,
    image: "images/wheel6.jpg",
    size: '18"',
    bolt: "5x114.3",
    offset: "+30mm",
    finish: "Bronze",
  },
  {
    id: 7,
    name: "HRE Performance P101",
    price: 899,
    image: "images/wheel7.jpg",
    size: '19"',
    bolt: "5x112",
    offset: "+40mm",
    finish: "Satin Black",
  },
  {
    id: 8,
    name: "Method Race Wheels",
    price: 249,
    image: "images/wheel8.jpg",
    size: '17"',
    bolt: "6x139.7",
    offset: "+0mm",
    finish: "Matt Black",
  },
];

// ===== LOCALSTORAGE FUNCTIONS =====
// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem("wheelCart");
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("wheelCart", JSON.stringify(cart));
}

// ===== ADD TO CART FUNCTION =====
function addToCart(productId) {
  console.log("Adding product ID:", productId); // Debug: Check if function runs

  // Find the product
  const product = products.find((p) => p.id === productId);

  if (!product) {
    alert("Product not found!");
    return;
  }

  // Get current cart
  let cart = getCart();

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    // Increase quantity
    existingItem.quantity = (existingItem.quantity || 1) + 1;
    alert("Quantity updated in cart!");
  } else {
    // Add new item with quantity
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      quantity: 1,
    });
    alert("Product added to cart!");
  }

  // Save to localStorage
  saveCart(cart);

  // Optional: Log cart to console to verify
  console.log("Current cart:", getCart());
}

// ===== REMOVE FROM CART FUNCTION =====
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);

  // Refresh cart display if we're on cart page
  if (window.location.pathname.includes("cart.html")) {
    displayCart();
  }
}

// ===== DISPLAY CART ON CART PAGE =====
function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  const totalSpan = document.getElementById("total-amount");

  if (!cartContainer) return; // Not on cart page

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    if (totalSpan) totalSpan.textContent = "0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;

    html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 100px;">
                <div>
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size || "N/A"}</p>
                </div>
                <div>
                    <p>€${item.price}</p>
                </div>
                <div>
                    <p>Qty: ${item.quantity || 1}</p>
                </div>
                <div>
                    <p>€${itemTotal}</p>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
  });

  cartContainer.innerHTML = html;
  if (totalSpan) totalSpan.textContent = total;

  // Add remove button listeners
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId);
    });
  });
}

// ===== SET UP ADD TO CART BUTTONS =====
function setupAddToCartButtons() {
  console.log("Setting up Add to Cart buttons..."); // Debug

  const buttons = document.querySelectorAll(".add-to-cart");
  console.log("Found", buttons.length, "buttons"); // Debug

  buttons.forEach((button) => {
    // Remove any existing listeners
    button.removeEventListener("click", handleAddToCart);
    // Add new listener
    button.addEventListener("click", handleAddToCart);
  });
}

function handleAddToCart(e) {
  e.preventDefault(); // Prevent any default button behavior
  console.log("Button clicked!"); // Debug

  const productId = parseInt(e.target.dataset.id);
  console.log("Product ID:", productId); // Debug

  if (!isNaN(productId)) {
    addToCart(productId);
  } else {
    console.error("Invalid product ID");
  }
}

// ===== LOAD PRODUCT DETAIL ON PRODUCT.HTML =====
function loadProductDetail() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  if (!productId) return; // No ID in URL

  const product = products.find((p) => p.id === productId);

  if (!product) return; // Product not found

  // Update page with product details
  const nameEl = document.getElementById("detail-name");
  const priceEl = document.getElementById("detail-price");
  const imageEl = document.getElementById("detail-image");
  const sizeEl = document.getElementById("detail-size");
  const boltEl = document.getElementById("detail-bolt");
  const offsetEl = document.getElementById("detail-offset");
  const finishEl = document.getElementById("detail-finish");
  const addBtn = document.querySelector(".add-to-cart");

  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `€${product.price}`;
  if (imageEl) imageEl.src = product.image;
  if (sizeEl) sizeEl.textContent = `Size: ${product.size}`;
  if (boltEl) boltEl.textContent = `Bolt Pattern: ${product.bolt}`;
  if (offsetEl) offsetEl.textContent = `Offset: ${product.offset}`;
  if (finishEl) finishEl.textContent = `Finish: ${product.finish}`;
  if (addBtn) addBtn.dataset.id = product.id;
}

// ===== INITIALIZE EVERYTHING WHEN PAGE LOADS =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded!"); // Debug
  setupAddToCartButtons();
  displayCart();
  loadProductDetail();
});

// Also run setup after any dynamic content changes
document.addEventListener("click", (e) => {
  // If we click anywhere, make sure buttons still work
  setTimeout(setupAddToCartButtons, 50);
});
