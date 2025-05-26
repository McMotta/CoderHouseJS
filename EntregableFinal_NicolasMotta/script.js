// Clase para gestionar productos
class Product {
  constructor(id, name, description, price, category, stock, icon) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.icon = icon;
  }
}

// Clase para gestionar items del carrito
class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// Clase principal del E-commerce
class EcommerceSimulator {
  constructor() {
    this.products = [];
    this.cart = [];
    this.filteredProducts = [];
    this.categories = new Set();
    this.init();
  }

  // Inicializar el simulador
  async init() {
    await this.loadProducts();
    this.setupEventListeners();
    this.renderProducts();
    this.updateCartCount();
  }

  // Cargar productos (simulando API con JSON)
  async loadProducts() {
    document.getElementById("loading").style.display = "block";

    // Simular delay de carga
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Datos JSON simulados
    const productsData = [
      {
        id: 1,
        name: "Laptop Gaming MSI",
        description: "Laptop para gaming con RTX 4060, 16GB RAM, SSD 512GB",
        price: 1299.99,
        category: "Laptops",
        stock: 15,
        icon: "fas fa-laptop",
      },
      {
        id: 2,
        name: "iPhone 15 Pro",
        description: "Smartphone Apple con chip A17 Pro, 128GB, cámara 48MP",
        price: 999.99,
        category: "Smartphones",
        stock: 8,
        icon: "fas fa-mobile-alt",
      },
      {
        id: 3,
        name: "Monitor 4K Samsung",
        description: "Monitor 27 pulgadas, 4K UHD, 144Hz, HDR10",
        price: 449.99,
        category: "Monitores",
        stock: 12,
        icon: "fas fa-desktop",
      },
      {
        id: 4,
        name: "Auriculares Sony WH-1000XM5",
        description: "Auriculares inalámbricos con cancelación de ruido activa",
        price: 349.99,
        category: "Audio",
        stock: 20,
        icon: "fas fa-headphones",
      },
      {
        id: 5,
        name: "Teclado Mecánico Corsair",
        description: "Teclado mecánico RGB, switches Cherry MX Red",
        price: 129.99,
        category: "Periféricos",
        stock: 25,
        icon: "fas fa-keyboard",
      },
      {
        id: 6,
        name: "Mouse Gaming Logitech G502",
        description: "Mouse gaming con sensor HERO 25K, RGB personalizable",
        price: 79.99,
        category: "Periféricos",
        stock: 30,
        icon: "fas fa-mouse",
      },
      {
        id: 7,
        name: "SSD NVMe 1TB",
        description: "Disco sólido NVMe PCIe 4.0, velocidades hasta 7000 MB/s",
        price: 149.99,
        category: "Almacenamiento",
        stock: 18,
        icon: "fas fa-hdd",
      },
      {
        id: 8,
        name: "Webcam Logitech C920",
        description: "Webcam Full HD 1080p con micrófono integrado",
        price: 89.99,
        category: "Accesorios",
        stock: 22,
        icon: "fas fa-video",
      },
      {
        id: 9,
        name: "Tablet iPad Air",
        description: "Tablet Apple con chip M1, 64GB, pantalla 10.9 pulgadas",
        price: 599.99,
        category: "Tablets",
        stock: 10,
        icon: "fas fa-tablet-alt",
      },
      {
        id: 10,
        name: "Smartwatch Apple Watch",
        description: "Reloj inteligente con GPS, monitor de salud, 45mm",
        price: 429.99,
        category: "Wearables",
        stock: 14,
        icon: "fas fa-clock",
      },
    ];

    // Convertir datos a objetos Product
    this.products = productsData.map(
      (data) =>
        new Product(
          data.id,
          data.name,
          data.description,
          data.price,
          data.category,
          data.stock,
          data.icon
        )
    );

    this.filteredProducts = [...this.products];

    // Extraer categorías únicas
    this.products.forEach((product) => {
      this.categories.add(product.category);
    });

    this.populateCategoryFilter();
    document.getElementById("loading").style.display = "none";
  }

  // Poblar el filtro de categorías
  populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    this.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  // Configurar event listeners
  setupEventListeners() {
    // Cerrar modal al hacer clic fuera
    document.getElementById("cartModal").addEventListener("click", (e) => {
      if (e.target.id === "cartModal") {
        this.toggleCart();
      }
    });
  }

  // Renderizar productos
  renderProducts() {
    const productsGrid = document.getElementById("productsGrid");
    productsGrid.innerHTML = "";

    if (this.filteredProducts.length === 0) {
      productsGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px;"></i>
                            <h3>No se encontraron productos</h3>
                            <p>Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    `;
      return;
    }

    this.filteredProducts.forEach((product) => {
      const productCard = this.createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }

  // Crear tarjeta de producto
  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
                    <div class="product-image">
                        <i class="${product.icon}"></i>
                    </div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${
                      product.description
                    }</div>
                    <div class="product-price">$${product.price.toLocaleString(
                      "es-AR",
                      { minimumFractionDigits: 2 }
                    )}</div>
                    <div class="product-stock">Stock disponible: ${
                      product.stock
                    } unidades</div>
                    <button class="add-to-cart-btn" onclick="ecommerce.addToCart(${
                      product.id
                    })" ${product.stock === 0 ? "disabled" : ""}>
                        <i class="fas fa-cart-plus"></i> ${
                          product.stock === 0
                            ? "Sin Stock"
                            : "Agregar al Carrito"
                        }
                    </button>
                `;
    return card;
  }

  // Agregar producto al carrito
  addToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = this.cart.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Stock insuficiente",
          text: `Solo hay ${product.stock} unidades disponibles`,
          confirmButtonColor: "#667eea",
        });
        return;
      }
    } else {
      this.cart.push(new CartItem(product));
    }

    this.updateCartCount();

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: `${product.name} fue agregado al carrito`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  }

  // Actualizar contador del carrito
  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = totalItems;
  }

  // Toggle del modal del carrito
  toggleCart() {
    const modal = document.getElementById("cartModal");
    const isVisible = modal.style.display === "block";

    if (isVisible) {
      modal.style.display = "none";
    } else {
      this.renderCart();
      modal.style.display = "block";
    }
  }

  // Renderizar carrito
  renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutSection = document.getElementById("checkoutSection");

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h3>Tu carrito está vacío</h3>
                            <p>Agrega algunos productos para comenzar</p>
                        </div>
                    `;
      cartTotal.textContent = "Total: $0.00";
      checkoutSection.style.display = "none";
      return;
    }

    cartItems.innerHTML = "";
    let total = 0;

    this.cart.forEach((item, index) => {
      const itemElement = this.createCartItemElement(item, index);
      cartItems.appendChild(itemElement);
      total += item.getTotalPrice();
    });

    cartTotal.textContent = `Total: $${total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })}`;
    checkoutSection.style.display = "block";
  }

  // Crear elemento del item del carrito
  createCartItemElement(cartItem, index) {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${
                          cartItem.product.name
                        }</div>
                        <div class="cart-item-price">$${cartItem.product.price.toLocaleString(
                          "es-AR",
                          { minimumFractionDigits: 2 }
                        )} c/u</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="ecommerce.updateQuantity(${index}, ${
      cartItem.quantity - 1
    })">-</button>
                            <span>Cantidad: ${cartItem.quantity}</span>
                            <button class="quantity-btn" onclick="ecommerce.updateQuantity(${index}, ${
      cartItem.quantity + 1
    })">+</button>
                        </div>
                        <div><strong>Subtotal: $${cartItem
                          .getTotalPrice()
                          .toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                          })}</strong></div>
                    </div>
                    <button class="remove-item" onclick="ecommerce.removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                `;
    return div;
  }

  // Actualizar cantidad en el carrito
  updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(index);
      return;
    }

    const cartItem = this.cart[index];
    if (newQuantity > cartItem.product.stock) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: `Solo hay ${cartItem.product.stock} unidades disponibles`,
        confirmButtonColor: "#667eea",
      });
      return;
    }

    cartItem.quantity = newQuantity;
    this.updateCartCount();
    this.renderCart();
  }

  // Eliminar del carrito
  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.updateCartCount();
    this.renderCart();
  }

  // Filtrar productos
  filterProducts() {
    const categoryFilter = document.getElementById("categoryFilter").value;
    const priceFilter =
      parseFloat(document.getElementById("priceFilter").value) || Infinity;
    const searchFilter = document
      .getElementById("searchFilter")
      .value.toLowerCase();

    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesPrice = product.price <= priceFilter;
      const matchesSearch =
        !searchFilter ||
        product.name.toLowerCase().includes(searchFilter) ||
        product.description.toLowerCase().includes(searchFilter);

      return matchesCategory && matchesPrice && matchesSearch;
    });

    this.renderProducts();
  }

  // Procesar checkout
  async processCheckout() {
    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      Swal.fire({
        icon: "error",
        title: "Datos incompletos",
        text: "Por favor completa todos los campos",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    // Mostrar loading durante el proceso
    Swal.fire({
      title: "Procesando compra...",
      html: "Por favor espera mientras procesamos tu pedido",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Reducir stock de productos
    this.cart.forEach((cartItem) => {
      const product = this.products.find((p) => p.id === cartItem.product.id);
      if (product) {
        product.stock -= cartItem.quantity;
      }
    });

    // Generar número de orden
    const orderNumber = "ORD-" + Date.now();
    const total = this.cart.reduce(
      (sum, item) => sum + item.getTotalPrice(),
      0
    );

    // Crear resumen de la orden
    const orderSummary = this.cart
      .map(
        (item) =>
          `${item.product.name} (x${item.quantity}) - ${item
            .getTotalPrice()
            .toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
      )
      .join("<br>");

    // Limpiar carrito
    this.cart = [];
    this.updateCartCount();
    this.toggleCart();
    this.renderProducts(); // Actualizar stock en la vista

    // Mostrar confirmación de compra
    Swal.fire({
      icon: "success",
      title: "¡Compra realizada con éxito!",
      html: `
                        <div style="text-align: left; margin: 20px 0;">
                            <p><strong>Número de orden:</strong> ${orderNumber}</p>
                            <p><strong>Cliente:</strong> ${customerName}</p>
                            <p><strong>Email:</strong> ${customerEmail}</p>
                            <p><strong>Dirección:</strong> ${customerAddress}</p>
                            <hr style="margin: 15px 0;">
                            <p><strong>Productos:</strong></p>
                            <div style="margin-left: 10px; font-size: 0.9em;">
                                ${orderSummary}
                            </div>
                            <hr style="margin: 15px 0;">
                            <p><strong>Total pagado:</strong> ${total.toLocaleString(
                              "es-AR",
                              { minimumFractionDigits: 2 }
                            )}</p>
                            <p><strong>Método de pago:</strong> ${this.getPaymentMethodName(
                              paymentMethod
                            )}</p>
                        </div>
                        <p style="color: #28a745; font-weight: bold;">
                            <i class="fas fa-truck"></i> Tu pedido será enviado en 2-3 días hábiles
                        </p>
                    `,
      confirmButtonText: "Continuar comprando",
      confirmButtonColor: "#667eea",
      width: "600px",
    });
  }

  // Obtener nombre del método de pago
  getPaymentMethodName(method) {
    const methods = {
      credit: "Tarjeta de Crédito",
      debit: "Tarjeta de Débito",
      transfer: "Transferencia Bancaria",
    };
    return methods[method] || method;
  }
}

// Instanciar el simulador al cargar la página
let ecommerce;

// Funciones globales para ser llamadas desde el HTML
function toggleCart() {
  ecommerce.toggleCart();
}

function filterProducts() {
  ecommerce.filterProducts();
}

function processCheckout() {
  ecommerce.processCheckout();
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  ecommerce = new EcommerceSimulator();
});

// Funciones adicionales para mejorar la experiencia

// Animación de entrada para las tarjetas de producto
function animateProductCards() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Observador de intersección para animaciones
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "slideInUp 0.6s ease forwards";
    }
  });
}, observerOptions);

// CSS para animaciones adicionales
const additionalStyles = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .product-card {
                opacity: 0;
                animation: slideInUp 0.6s ease forwards;
            }

            .cart-item {
                animation: slideInLeft 0.3s ease forwards;
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Efectos hover mejorados */
            .add-to-cart-btn {
                position: relative;
                overflow: hidden;
            }

            .add-to-cart-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            .add-to-cart-btn:hover::before {
                left: 100%;
            }

            /* Mejoras responsive adicionales */
            @media (max-width: 480px) {
                .product-card {
                    padding: 15px;
                }
                
                .cart-content {
                    padding: 15px;
                    margin: 10px;
                }
                
                .form-group input,
                .form-group select {
                    font-size: 16px; /* Evita zoom en iOS */
                }
            }

            /* Indicador de carga personalizado */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(102, 126, 234, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-size: 1.2rem;
            }

            /* Efecto de pulsación en botones */
            .add-to-cart-btn:active,
            .quantity-btn:active,
            .checkout-btn:active {
                transform: scale(0.95);
            }

            /* Mejorar accesibilidad */
            .add-to-cart-btn:focus,
            .quantity-btn:focus,
            .checkout-btn:focus,
            input:focus,
            select:focus {
                outline: 3px solid #667eea;
                outline-offset: 2px;
            }

            /* Indicador de stock bajo */
            .low-stock {
                color: #ff4757;
                font-weight: bold;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;

// Inyectar estilos adicionales
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Funcionalidad adicional: notificaciones de stock bajo
function checkLowStock() {
  const lowStockProducts = ecommerce?.products.filter(
    (product) => product.stock <= 5 && product.stock > 0
  );

  if (lowStockProducts && lowStockProducts.length > 0) {
    const stockElements = document.querySelectorAll(".product-stock");
    stockElements.forEach((element) => {
      const stockText = element.textContent;
      const stockNumber = parseInt(stockText.match(/\d+/)[0]);
      if (stockNumber <= 5 && stockNumber > 0) {
        element.classList.add("low-stock");
        element.textContent = `⚠️ ${stockText} - ¡Últimas unidades!`;
      }
    });
  }
}

// Ejecutar verificación de stock bajo después de cargar productos
setTimeout(checkLowStock, 2000);

// Funciones de utilidad para mejorar la experiencia

// Formatear números como moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar teléfono (formato argentino)
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Funcionalidad de scroll suave
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Event listener para mejorar la experiencia de scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.transform = "translateY(-10px)";
    header.style.boxShadow = "0 15px 50px rgba(31, 38, 135, 0.5)";
  } else {
    header.style.transform = "translateY(0)";
    header.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.37)";
  }
});

// Prevenir zoom en inputs en dispositivos móviles
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  document.addEventListener("touchstart", function () {}, { passive: true });
}
