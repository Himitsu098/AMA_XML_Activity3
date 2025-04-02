document.addEventListener("DOMContentLoaded", function() {
    let productList = document.getElementById("product-list");
    let searchInput = document.getElementById("search");
    let priceFilter = document.getElementById("priceFilter");
    let yearFilters = document.querySelectorAll("input[name='yearFilter']");
    let allProducts = [];

    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            let productCard = `
                <div class='card mb-3'>
                    <img src='${product.image_url}' class='card-img-top' alt='${product.title}'>
                    <div class='card-body'>
                        <h5 class='card-title'>${product.title}</h5>
                        <p class='card-text'>${product.description}</p>
                        <p class='card-text'>Price: ${product.price}</p>
                        <p class='card-text'>Release Year: ${product.release_year}</p>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    }

    fetch("products.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let products = data.getElementsByTagName("gundam_item"); // Use "gundam_item" from your XML
            allProducts = Array.from(products).map(product => ({
                title: product.getElementsByTagName("title")[0]?.textContent || "Unknown",
                description: product.getElementsByTagName("description")[0]?.textContent || "No description available.",
                price: product.getElementsByTagName("price")[0]?.textContent || "N/A",
                release_year: parseInt(product.getElementsByTagName("release_year")[0]?.textContent || "0"),
                image_url: product.getElementsByTagName("image_url")[0]?.textContent || "no-image.jpg"
            }));
            displayProducts(allProducts);
        })
        .catch(error => console.error("Error loading XML:", error));

    function filterProducts() {
        let searchText = searchInput.value.toLowerCase();
        let priceOrder = priceFilter.value;
        let selectedYears = Array.from(yearFilters).filter(checkbox => checkbox.checked).map(checkbox => parseInt(checkbox.value));

        let filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchText) &&
            (selectedYears.length === 0 || selectedYears.includes(product.release_year))
        );

        if (priceOrder === "asc") {
            filteredProducts.sort((a, b) => parseFloat(a.price.replace("USD ", "")) - parseFloat(b.price.replace("USD ", "")));
        } else {
            filteredProducts.sort((a, b) => parseFloat(b.price.replace("USD ", "")) - parseFloat(a.price.replace("USD ", "")));
        }

        displayProducts(filteredProducts);
    }

    searchInput.addEventListener("input", filterProducts);
    priceFilter.addEventListener("change", filterProducts);
    yearFilters.forEach(checkbox => checkbox.addEventListener("change", filterProducts));
});
