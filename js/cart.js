"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "cart") {
        renderCartPage();
    }

    if (page === "checkout") {
        initCheckoutPage();
    }
});

/* =========================================
   CART PAGE
========================================= */

function renderCartPage() {
    const container = document.getElementById("cart-content");

    if (!container) {
        return;
    }

    const items = GGun.getCartDetails();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Корзина пока пуста</h2>

                <p>
                    Выбери понравившиеся товары в каталоге G-gun.
                </p>

                <a href="catalog.html" class="btn btn-primary">
                    Перейти в каталог
                </a>
            </div>
        `;

        return;
    }

    const layout = document.createElement("div");
    layout.className = "cart-layout";

    const itemList = document.createElement("div");
    itemList.className = "cart-items";

    items.forEach(item => {
        const row = document.createElement("article");
        row.className = "cart-item";

        const visual = document.createElement("div");
        visual.className = "cart-item-visual";

        visual.appendChild(GGun.productVisual(item));

        const info = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = item.name;

        const category = document.createElement("p");
        category.className = "cart-item-category";
        category.textContent = item.categoryName;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = GGun.formatPrice(item.price);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const minus = document.createElement("button");
        minus.className = "quantity-button";
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Уменьшить количество ${item.name}`);

        const quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.className = "quantity-button";
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Увеличить количество ${item.name}`);

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.type = "button";
        remove.textContent = "Удалить";

        minus.disabled = item.quantity <= 1;
        plus.disabled = item.quantity >= 99;

        minus.addEventListener("click", () => {
            updateCartQuantity(item.id, item.quantity - 1);
        });

        plus.addEventListener("click", () => {
            updateCartQuantity(item.id, item.quantity + 1);
        });

        remove.addEventListener("click", () => {
            removeCartItem(item.id);
        });

        controls.append(minus, quantity, plus, remove);

        info.append(title, category, price, controls);

        const total = document.createElement("div");
        total.className = "cart-item-total";
        total.textContent = GGun.formatPrice(item.subtotal);

        row.append(visual, info, total);
        itemList.appendChild(row);
    });

    const summary = document.createElement("aside");
    summary.className = "cart-summary";

    const heading = document.createElement("h2");
    heading.textContent = "Ваш заказ";

    const quantityRow = createSummaryRow(
        "Количество товаров",
        String(GGun.getCartQuantity())
    );

    const deliveryRow = createSummaryRow(
        "Доставка",
        "Демо"
    );

    const totalRow = createSummaryRow(
        "Итого",
        GGun.formatPrice(GGun.getCartTotal()),
        true
    );

    const checkoutLink = document.createElement("a");
    checkoutLink.href = "checkout.html";
    checkoutLink.className = "btn btn-primary btn-block";
    checkoutLink.textContent = "Оформить заказ";

    const note = document.createElement("p");
    note.className = "summary-note";
    note.textContent =
        "Это демонстрационный заказ. Деньги списываться не будут.";

    summary.append(
        heading,
        quantityRow,
        deliveryRow,
        totalRow,
        checkoutLink,
        note
    );

    layout.append(itemList, summary);
    container.replaceChildren(layout);
}

function createSummaryRow(label, value, isTotal = false) {
    const row = document.createElement("div");
    row.className = isTotal
        ? "summary-row total"
        : "summary-row";

    const name = document.createElement("span");
    name.textContent = label;

    const amount = document.createElement("span");
    amount.textContent = value;

    row.append(name, amount);

    return row;
}

function updateCartQuantity(id, quantity) {
    const cart = GGun.getCart();
    const item = cart.find(entry => entry.id === id);

    if (!item) {
        return;
    }

    item.quantity = Math.max(1, Math.min(99, quantity));

    GGun.saveCart(cart);
    renderCartPage();
}

function removeCartItem(id) {
    const cart = GGun.getCart().filter(item => item.id !== id);

    GGun.saveCart(cart);
    renderCartPage();
}

/* =========================================
   CHECKOUT PAGE
========================================= */

function initCheckoutPage() {
    const container = document.getElementById("checkout-content");

    if (!container) {
        return;
    }

    const items = GGun.getCartDetails();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Нечего оформлять</h2>

                <p>
                    Добавь товары в корзину, чтобы продолжить.
                </p>

                <a href="catalog.html" class="btn btn-primary">
                    Перейти в каталог
                </a>
            </div>
        `;

        return;
    }

    const layout = document.createElement("div");
    layout.className = "checkout-layout";

    const form = document.createElement("form");
    form.className = "checkout-form";
    form.id = "checkout-form";

    form.innerHTML = `
        <div class="demo-notice">
            <strong>Демонстрационный режим.</strong><br>
            Форма имитирует оформление заказа. Не вводи настоящие
            платёжные данные. Никаких реальных списаний не производится.
        </div>

        <h2>Контактные данные</h2>

        <div class="form-grid">
            <div class="form-field">
                <label for="customer-name">Имя</label>
                <input
                    class="input"
                    id="customer-name"
                    name="name"
                    type="text"
                    minlength="2"
                    maxlength="80"
                    autocomplete="name"
                    required
                >
            </div>

            <div class="form-field">
                <label for="customer-email">Электронная почта</label>
                <input
                    class="input"
                    id="customer-email"
                    name="email"
                    type="email"
                    maxlength="254"
                    autocomplete="email"
                    required
                >
            </div>

            <div class="form-field full-width">
                <label for="demo-payment">Способ оплаты</label>

                <select
                    class="select"
                    id="demo-payment"
                    name="payment"
                    required
                >
                    <option value="demo-card">
                        Демонстрационная карта
                    </option>

                    <option value="demo-wallet">
                        Демонстрационный кошелёк
                    </option>

                    <option value="demo-cash">
                        Оплата при получении (демо)
                    </option>
                </select>
            </div>
        </div>

        <button
            class="btn btn-primary btn-block"
            type="submit"
            style="margin-top: 24px;"
        >
            Подтвердить демо-заказ
        </button>
    `;

    const summary = document.createElement("aside");
    summary.className = "cart-summary";

    const heading = document.createElement("h2");
    heading.textContent = "Ваш заказ";

    const itemList = document.createElement("div");
    itemList.className = "checkout-items";

    items.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-item";

        const name = document.createElement("span");
        name.textContent = `${item.name} × ${item.quantity}`;

        const price = document.createElement("span");
        price.textContent = GGun.formatPrice(item.subtotal);

        row.append(name, price);
        itemList.appendChild(row);
    });

    const total = createSummaryRow(
        "Итого",
        GGun.formatPrice(GGun.getCartTotal()),
        true
    );

    const note = document.createElement("p");
    note.className = "summary-note";
    note.textContent =
        "Сумма рассчитана на основе демонстрационных цен каталога.";

    summary.append(heading, itemList, total, note);
    layout.append(form, summary);

    container.replaceChildren(layout);

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        /*
         * Только демонстрация.
         * Данные формы не отправляются на сервер
         * и не сохраняются в заказах.
         */

        const orderNumber =
            "GG-" + Date.now().toString().slice(-8);

        GGun.saveCart([]);

        const success = document.createElement("div");
        success.className = "checkout-success";

        const eyebrow = document.createElement("span");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = "DEMO ORDER";

        const title = document.createElement("h2");
        title.textContent = "Заказ оформлен!";

        const message = document.createElement("p");
        message.textContent =
            `Демонстрационный заказ ${orderNumber} успешно создан. ` +
            "Реальная оплата не производилась, а данные формы не сохранялись.";

        const button = document.createElement("a");
        button.className = "btn btn-primary";
        button.href = "catalog.html";
        button.textContent = "Вернуться в каталог";

        success.append(eyebrow, title, message, button);
        container.replaceChildren(success);
    });
}
