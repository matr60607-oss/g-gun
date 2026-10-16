/* =========================================
   G-GUN — MAIN APPLICATION
========================================= */

"use strict";

/*
 * Демонстрационные товары.
 * Все модели вымышлены и предназначены для каталога
 * коллекционных предметов и игрового снаряжения.
 */

const PRODUCTS = [
    {
        id: "phantom-x",
        name: "Phantom X",
        category: "models",
        categoryName: "Коллекционные модели",
        price: 45900,
        badge: "Хит",
        visual: "PX",
        description:
            "Коллекционная модель в минималистичном индустриальном стиле. " +
            "Подойдёт для оформления витрины или тематической коллекции.",
        specs: {
            "Коллекция": "Phantom Series",
            "Материал": "Композит",
            "Цвет": "Graphite Black",
            "Назначение": "Коллекционный предмет"
        }
    },

    {
        id: "specter-01",
        name: "Specter 01",
        category: "models",
        categoryName: "Коллекционные модели",
        price: 62500,
        badge: "Новинка",
        visual: "S01",
        description:
            "Дизайнерская модель с геометрическими линиями и строгим " +
            "внешним оформлением. Часть демонстрационной коллекции G-gun.",
        specs: {
            "Коллекция": "Specter Series",
            "Материал": "Полимер",
            "Цвет": "Matte Black",
            "Назначение": "Коллекционный предмет"
        }
    },

    {
        id: "raven-mk2",
        name: "Raven MK-II",
        category: "models",
        categoryName: "Коллекционные модели",
        price: 38700,
        badge: "",
        visual: "RV",
        description:
            "Компактная коллекционная модель с лаконичным дизайном. " +
            "Выполнена в стилистике футуристических игровых предметов.",
        specs: {
            "Коллекция": "Raven Series",
            "Материал": "Композит",
            "Цвет": "Dark Grey",
            "Назначение": "Коллекционный предмет"
        }
    },

    {
        id: "tactical-pack",
        name: "Tactical Pack",
        category: "gear",
        categoryName: "Снаряжение",
        price: 24900,
        badge: "Популярное",
        visual: "TP",
        description:
            "Тематический рюкзак для повседневного использования. " +
            "Практичный дизайн, несколько отделений и спокойная расцветка.",
        specs: {
            "Тип": "Рюкзак",
            "Материал": "Полиэстер",
            "Цвет": "Olive Black",
            "Назначение": "Повседневное использование"
        }
    },

    {
        id: "urban-vest",
        name: "Urban Vest",
        category: "gear",
        categoryName: "Снаряжение",
        price: 31500,
        badge: "",
        visual: "UV",
        description:
            "Декоративный жилет в городском стиле для косплея, фотосессий " +
            "и тематических образов.",
        specs: {
            "Тип": "Декоративный жилет",
            "Материал": "Текстиль",
            "Цвет": "Urban Black",
            "Назначение": "Косплей и стиль"
        }
    },

    {
        id: "field-gloves",
        name: "Field Gloves",
        category: "accessories",
        categoryName: "Аксессуары",
        price: 7900,
        badge: "",
        visual: "FG",
        description:
            "Текстильные перчатки с нескользящей поверхностью. " +
            "Подходят для повседневного использования и активного отдыха.",
        specs: {
            "Тип": "Перчатки",
            "Материал": "Текстиль",
            "Цвет": "Black",
            "Назначение": "Аксессуар"
        }
    },

    {
        id: "operator-case",
        name: "Operator Case",
        category: "accessories",
        categoryName: "Аксессуары",
        price: 11900,
        badge: "Новинка",
        visual: "OC",
        description:
            "Универсальный кейс для хранения небольших коллекционных " +
            "предметов и аксессуаров.",
        specs: {
            "Тип": "Кейс",
            "Материал": "Пластик и текстиль",
            "Цвет": "Graphite",
            "Назначение": "Хранение аксессуаров"
        }
    },

    {
        id: "blackout-kit",
        name: "Blackout Kit",
        category: "accessories",
        categoryName: "Аксессуары",
        price: 15900,
        badge: "",
        visual: "BK",
        description:
            "Набор тематических аксессуаров в едином тёмном стиле. " +
            "Создан для оформления коллекций и игровых образов.",
        specs: {
            "Тип": "Набор аксессуаров",
            "Материал": "Комбинированный",
            "Цвет": "Black",
            "Назначение": "Аксессуары"
        }
    }
];

/* =========================================
   UTILITIES
========================================= */

const GGun = {
    products: PRODUCTS,

    formatPrice(price) {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "KZT",
            maximumFractionDigits: 0
        }).format(price);
    },

    getProduct(id) {
        return PRODUCTS.find(product => product.id === id);
    },

    getCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem("ggun-cart") || "[]"
            );

            if (!Array.isArray(cart)) {
                return [];
            }

            return cart
                .filter(item =>
                    item &&
                    typeof item.id === "string" &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0
                )
                .filter(item => this.getProduct(item.id))
                .map(item => ({
                    id: item.id,
                    quantity: Math.min(item.quantity, 99)
                }));
        } catch {
            return [];
        }
    },

    saveCart(cart) {
        localStorage.setItem("ggun-cart", JSON.stringify(cart));
        this.updateCartCount();
    },

    addToCart(id, quantity = 1) {
        const product = this.getProduct(id);

        if (!product) {
            return false;
        }

        const cart = this.getCart();
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity = Math.min(
                99,
                existing.quantity + quantity
            );
        } else {
            cart.push({
                id,
                quantity: Math.min(99, quantity)
            });
        }

        this.saveCart(cart);
        this.showToast(`${product.name} добавлен в корзину`);

        return true;
    },

    getCartDetails() {
        return this.getCart()
            .map(item => {
                const product = this.getProduct(item.id);

                return {
                    ...product,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                };
            });
    },

    getCartTotal() {
        return this.getCartDetails().reduce(
            (total, item) => total + item.subtotal,
            0
        );
    },

    getCartQuantity() {
        return this.getCart().reduce(
            (total, item) => total + item.quantity,
            0
        );
    },

    updateCartCount() {
        const count = document.getElementById("cart-count");

        if (count) {
            count.textContent = this.getCartQuantity();
        }
    },

    showToast(message) {
        let container = document.querySelector(".toast-container");

        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            container.setAttribute("aria-live", "polite");

            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;

        container.appendChild(toast);

        window.setTimeout(() => {
            toast.remove();

            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 2800);
    },

    productVisual(product, extraClass = "") {
        if (product.image) {
            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.remove();
            });

            return image;
        }

        const visual = document.createElement("div");
        visual.className = `product-visual ${extraClass}`.trim();

        const label = document.createElement("span");
        label.textContent = product.visual || "G-GUN";

        visual.appendChild(label);

        return visual;
    },

    createProductCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageLink = document.createElement("a");
        imageLink.className = "product-card-image";
        imageLink.href = `product.html?id=${encodeURIComponent(product.id)}`;
        imageLink.setAttribute("aria-label", `Открыть ${product.name}`);

        imageLink.appendChild(this.productVisual(product));

        if (product.badge) {
            const badge = document.createElement("span");
            badge.className = "product-badge";
            badge.textContent = product.badge;
            imageLink.appendChild(badge);
        }

        const content = document.createElement("div");
        content.className = "product-card-content";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.categoryName;

        const title = document.createElement("h3");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-card-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-card-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = this.formatPrice(product.price);

        const link = document.createElement("a");
        link.className = "product-card-link";
        link.href = `product.html?id=${encodeURIComponent(product.id)}`;
        link.textContent = "Подробнее ↗";

        bottom.append(price, link);
        content.append(category, title, description, bottom);
        card.append(imageLink, content);

        return card;
    },

    renderProductGrid(container, products) {
        if (!container) {
            return;
        }

        container.replaceChildren();

        if (products.length === 0) {
            const message = document.createElement("p");
            message.className = "muted";
            message.textContent = "Товары не найдены.";

            container.appendChild(message);
            return;
        }

        products.forEach(product => {
            container.appendChild(this.createProductCard(product));
        });
    },

    renderHeader() {
        const header = document.getElementById("site-header");

        if (!header) {
            return;
        }

        const currentPage = document.body.dataset.page || "home";

        const navItems = [
            { href: "index.html", label: "Главная", page: "home" },
            { href: "catalog.html", label: "Каталог", page: "catalog" },
            { href: "catalog.html?category=gear", label: "Снаряжение", page: "gear" }
        ];

        const inner = document.createElement("div");
        inner.className = "header-inner";

        const logo = document.createElement("a");
        logo.className = "logo";
        logo.href = "index.html";
        logo.setAttribute("aria-label", "G-gun — главная");

        logo.innerHTML = `
            <span class="logo-mark">G</span>
            <span class="logo-copy">
                <strong>G-gun</strong>
                <small>GEAR & GUN</small>
            </span>
        `;

        const nav = document.createElement("nav");
        nav.className = "main-nav";
        nav.id = "main-nav";
        nav.setAttribute("aria-label", "Основная навигация");

        navItems.forEach(item => {
            const link = document.createElement("a");
            link.href = item.href;
            link.textContent = item.label;

            if (
                item.page === currentPage ||
                (item.page === "gear" && currentPage === "gear")
            ) {
                link.classList.add("active");
            }

            nav.appendChild(link);
        });

        const actions = document.createElement("div");
        actions.className = "header-actions";

        const cartLink = document.createElement("a");
        cartLink.className = "cart-link";
        cartLink.href = "cart.html";

        cartLink.innerHTML = `
            <span class="cart-link-label">Корзина</span>
            <span class="cart-count" id="cart-count">0</span>
        `;

        const menuButton = document.createElement("button");
        menuButton.className = "mobile-menu-button";
        menuButton.type = "button";
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "Открыть меню");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-controls", "main-nav");

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        actions.append(cartLink, menuButton);
        inner.append(logo, nav, actions);
        header.replaceChildren(inner);

        this.updateCartCount();
    },

    renderFooter() {
        const footer = document.getElementById("site-footer");

        if (!footer) {
            return;
        }

        footer.innerHTML = `
            <div class="footer-inner">
                <div>
                    <a class="logo" href="index.html">
                        <span class="logo-mark">G</span>
                        <span class="logo-copy">
                            <strong>G-gun</strong>
                            <small>GEAR & GUN</small>
                        </span>
                    </a>

                    <p class="footer-copy">
                        Коллекция. Стиль. Индивидуальность.
                    </p>
                </div>

                <nav class="footer-links" aria-label="Навигация в подвале">
                    <a href="index.html">Главная</a>
                    <a href="catalog.html">Каталог</a>
                    <a href="cart.html">Корзина</a>
                </nav>
            </div>

            <div class="footer-disclaimer">
                G-gun — демонстрационный проект. Представленные товары,
                цены и заказы используются исключительно для демонстрации
                интерфейса. Реальные платежи не принимаются.
            </div>
        `;
    },

    init() {
        this.renderHeader();
        this.renderFooter();
        this.updateCartCount();

        const featured = document.getElementById("featured-products");

        if (featured) {
            this.renderProductGrid(
                featured,
                PRODUCTS.slice(0, 3)
            );
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    GGun.init();
});
