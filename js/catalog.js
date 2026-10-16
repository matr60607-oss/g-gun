"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("catalog-search");
    const sortSelect = document.getElementById("catalog-sort");
    const filtersContainer = document.getElementById("category-filters");
    const productsContainer = document.getElementById("catalog-products");
    const resultCount = document.getElementById("catalog-result-count");

    if (
        !searchInput ||
        !sortSelect ||
        !filtersContainer ||
        !productsContainer
    ) {
        return;
    }

    let activeCategory = "all";

    function renderCatalog() {
        const query = searchInput.value.trim().toLocaleLowerCase("ru");

        let products = GGun.products.filter(product => {
            const matchesCategory =
                activeCategory === "all" ||
                product.category === activeCategory;

            const searchableText = [
                product.name,
                product.categoryName,
                product.description
            ].join(" ").toLocaleLowerCase("ru");

            const matchesSearch = searchableText.includes(query);

            return matchesCategory && matchesSearch;
        });

        switch (sortSelect.value) {
            case "price-asc":
                products.sort((a, b) => a.price - b.price);
                break;

            case "price-desc":
                products.sort((a, b) => b.price - a.price);
                break;

            case "name":
                products.sort((a, b) =>
                    a.name.localeCompare(b.name, "ru")
                );
                break;
        }

        GGun.renderProductGrid(productsContainer, products);

        resultCount.textContent =
            `Найдено товаров: ${products.length}`;
    }

    filtersContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-category]");

        if (!button) {
            return;
        }

        activeCategory = button.dataset.category;

        filtersContainer.querySelectorAll("[data-category]")
            .forEach(filter => {
                filter.classList.toggle(
                    "active",
                    filter === button
                );
            });

        renderCatalog();
    });

    searchInput.addEventListener("input", renderCatalog);
    sortSelect.addEventListener("change", renderCatalog);

    // Поддержка ссылок вида catalog.html?category=gear
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");

    const allowedCategories = [
        "models",
        "gear",
        "accessories"
    ];

    if (allowedCategories.includes(requestedCategory)) {
        activeCategory = requestedCategory;

        filtersContainer.querySelectorAll("[data-category]")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.category === activeCategory
                );
            });
    }

    renderCatalog();
});
