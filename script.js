let allProducts = [];
let currentCategory = "all";

async function loadProducts() {

    const response = await fetch("data/products.json");
    allProducts = await response.json();

    renderCategories();
    renderProducts(allProducts);
}

function renderProducts(products) {

    const container = document.getElementById("productList");

    container.innerHTML = "";

    products.forEach(product => {

        const firstImage =
            "./Gambar Produk/" + product.gambar[0];

        container.innerHTML += `
            <div class="product-card">

                <div class="image-slider">

                    ${product.badge ? `
                        <div class="product-badge ${product.badge.toLowerCase().replace(/\s+/g,'-')}">
                            ${product.badge}
                        </div>
                    ` : ""}

                    <button class="slider-btn prev">‹</button>

                    <img
                        src="${firstImage}"
                        alt="${product.nama_produk}"
                        class="product-image"
                        loading="lazy"
                        data-index="0"
                        data-images='${JSON.stringify(product.gambar)}'
                    >

                    <button class="slider-btn next">›</button>

                </div>

                <h3>
                    ${product.nomer}. ${product.nama_produk}
                </h3>

                <div class="button-group">

                    <a
                        href="${product.tiktok_url}"
                        target="_blank"
                        class="btn btn-tiktok"
                    >
                        Beli di TikTok
                    </a>

                    ${product.shopee_url
                        ? `
                        <a
                            href="${product.shopee_url}"
                            target="_blank"
                            class="btn btn-shopee"
                        >
                            Beli di Shopee
                        </a>
                        `
                        : ""
                    }

                </div>

            </div>
        `;
    });
}

function renderCategories() {

    const container =
        document.getElementById("categoryList");

    const categories = [
        "Dress",
        "Atasan",
        "Celana",
        "Rok",
        "Tas",
        "Sepatu",
        "Jumpsuit",
        "Outer"
    ];

    container.innerHTML = "";

    categories.forEach(category => {

        container.innerHTML += `
            <button
                class="category-btn"
                data-category="${category}">
                ${category}
            </button>
        `;
    });

    container.innerHTML += `
        <button
            class="category-btn active"
            data-category="all">
            Semua
        </button>
    `;
}

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const keyword =
            this.value.toLowerCase();

        const hero =
            document.querySelector(".hero-banner");

        const categories =
            document.querySelector(".category-grid");

        if (keyword.trim() !== "") {

            categories.style.display = "none";

        } else {

            categories.style.display = "";
        }

        const filtered =
            allProducts.filter(product => {

                return (
                    String(product.nomer)
                        .includes(keyword)

                    ||

                    product.nama_produk
                        .toLowerCase()
                        .includes(keyword)
                );
            });

        renderProducts(filtered);
    });

document.addEventListener("click", function(e) {

    if (
        e.target.classList.contains("prev") ||
        e.target.classList.contains("next")
    ) {

        const slider =
            e.target.closest(".image-slider");

        const img =
            slider.querySelector(".product-image");

        const images =
            JSON.parse(img.dataset.images);

        let index =
            Number(img.dataset.index);

        if (e.target.classList.contains("next")) {

            index++;

            if (index >= images.length) {
                index = 0;
            }

        } else {

            index--;

            if (index < 0) {
                index = images.length - 1;
            }
        }

        img.src =
            "./Gambar Produk/" + images[index];

        img.dataset.index = index;

        return;
    }

    if (!e.target.classList.contains("category-btn")) {
        return;
    }

    const category =
        e.target.dataset.category;

    if (currentCategory === category) {

        document
            .querySelectorAll(".category-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        currentCategory = "";

        document.getElementById(
            "sectionTitle"
        ).textContent = "";

        renderProducts([]);

        return;
    }

    document
        .querySelectorAll(".category-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    e.target.classList.add("active");

    currentCategory = category;

    const title =
        document.getElementById("sectionTitle");

    if (category === "all") {

    title.textContent =
        "Semua Kategori Produk";

    renderProducts(allProducts);

    return;
    }

    const filtered =
        allProducts.filter(
            product =>
                product.kategori === category
        );

    renderProducts(filtered);

    title.textContent =
        "Produk " + category;
});

loadProducts();
