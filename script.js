



// ======shop page========
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('products-container');
  const range = document.getElementById('price-range');
  const priceVal = document.getElementById('max-price-display');
  const genderCheckboxes = document.querySelectorAll('.gender-filter');
  const cartPopup = document.getElementById('cart-popup');

  const products = JSON.parse(localStorage.getItem("allProducts")) || [];

  function renderProducts() {
    const maxPrice = parseInt(range.value);
    const selectedGenders = Array.from(genderCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const urlParams = new URLSearchParams(window.location.search);
    const urlGender = urlParams.get('category');

    const filtered = products.filter(p => {
      // ✅ Skip if missing data
      if (!p || !p.name || !p.image || !p.price || !p.gender || !p.category) return false;

      const matchPrice = p.price <= maxPrice;
      const matchGender = selectedGenders.includes(p.gender);
      const matchUrl = urlGender ? p.gender === urlGender : true;
      return matchPrice && matchGender && matchUrl;
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = "<p>No products match your filters.</p>";
      return;
    }

    filtered.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-content">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <div class="product-price">₹${p.price}</div>
          <div class="product-btns">
            <button class="btn view-btn">View More</button>
            <button class="btn cart-btn">Add to Cart</button>
          </div>
        </div>
      `;

      // ✅ Add to Cart with quantity handling
      div.querySelector('.cart-btn').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.name === p.name);

        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          cart.push({ name: p.name, price: p.price, image: p.image, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        cartPopup.textContent = `${p.name} added to cart!`;
        cartPopup.style.backgroundColor = "#4CAF50";
        cartPopup.style.display = 'block';
        setTimeout(() => cartPopup.style.display = 'none', 2000);
      });

      // ✅ View More
      div.querySelector('.view-btn').addEventListener('click', () => {
        localStorage.setItem('selectedProduct', JSON.stringify(p));
        window.location.href = 'productdetails.html';
      });

      container.appendChild(div);
    });
  }

  // ✅ Cart Count Update
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElement = document.querySelector(".fa-shopping-bag + span");
    if (countElement) {
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      countElement.textContent = totalItems;
    }
  }

  // ✅ Filter events
  range.addEventListener('input', () => {
    priceVal.textContent = `₹${range.value}`;
    renderProducts();
  });

  genderCheckboxes.forEach(cb => cb.addEventListener('change', renderProducts));

  // ✅ Initial UI render
  priceVal.textContent = `₹${range.value}`;
  renderProducts();
  updateCartCount();
});
