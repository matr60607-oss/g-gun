"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("product-detail");
    const breadcrumb = document.getElementById("product-breadcrumb");

    if (!container) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = GGun.getProduct(productId);

    if (!product) {
        document.title = "Товар не найден — G-gun";

        container.innerHTML = `
            <div class="empty-state">
                <h2>Товар не найден</h2>
                <p>
                    Возможно, товар не существует или ссылка указана неверно.
                </p>
                <a href="catalog.html" class="btn btn-primary">
                    Вернуться в каталог
                </a>
            </div>
        `;

        return;
    }

    document.title = `${product.name} — G-gun`;

    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    const layout = document.createElement("section");
    layout.className = "product-detail";

    const visual = document.createElement("div");
    visual.className = "product-detail-visual";
    visual.appendChild(GGun.productVisual(product));

    const info = document.createElement("div");
    info.className = "product-detail-info";

    const category = document.createElement("span");
    category.className = "eyebrow";
    category.textContent = product.categoryName;

    const title = document.createElement("h1");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-detail-description";
    description.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-detail-price";
    price.textContent = GGun.formatPrice(product.price);

    const note = document.createElement("p");
    note.className = "product-detail-note";
    note.textContent =
        "Демонстрационная цена. Реальная покупка недоступна.";

    const actions = document.createElement("div");
    actions.className = "product-detail-actions";

    const addButton = document.createElement("button");
    addButton.className = "btn btn-primary";
    addButton.type = "button";
    addButton.textContent = "Добавить в корзину";

    addButton.addEventListener("click", () => {
        GGun.addToCart(product.id);
    });

    const backLink = document.createElement("a");
    backLink.className = "btn btn-outline";
    backLink.href = "catalog.html";
    backLink.textContent = "Назад в каталог";

    actions.append(addButton, backLink);

    const specs = document.createElement("div");
    specs.className = "product-specs";

    Object.entries(product.specs).forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "product-spec-row";

        const key = document.createElement("span");
        key.textContent = label;

        const val = document.createElement("span");
        val.textContent = value;

        row.append(key, val);
        specs.appendChild(row);
    });

    info.append(
        category,
        title,
        description,
        price,
        note,
        actions,
        specs
    );

    layout.append(visual, info);
    container.replaceChildren(layout);
});
