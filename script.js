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
                    <img src='${product.image}' class='card-img-top' alt='${product.name}'>
                    <div class='card-body'>
                        <h5 class='card-title'>${product.name}</h5>
                        <p class='card-text'>Price: $${product.price}</p>
                        <p class='card-text'>Year: ${product.year}</p>
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
            let products = data.getElementsByTagName("product");
            allProducts = Array.from(products).map(product => ({
                name: product.getElementsByTagName("name")[0].textContent,
                price: parseFloat(product.getElementsByTagName("price")[0].textContent),
                year: parseInt(product.getElementsByTagName("year")[0].textContent),
                image: product.getElementsByTagName("image")[0].textContent
            }));
            displayProducts(allProducts);
        });

    function filterProducts() {
        let searchText = searchInput.value.toLowerCase();
        let priceOrder = priceFilter.value;
        let selectedYears = Array.from(yearFilters).filter(checkbox => checkbox.checked).map(checkbox => parseInt(checkbox.value));

        let filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchText) &&
            (selectedYears.length === 0 || selectedYears.includes(product.year))
        );

        if (priceOrder === "asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    }

    searchInput.addEventListener("input", filterProducts);
    priceFilter.addEventListener("change", filterProducts);
    yearFilters.forEach(checkbox => checkbox.addEventListener("change", filterProducts));
});