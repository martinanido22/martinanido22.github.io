const ORDER_ASC_BY_PRICE = "$UP";
const ORDER_DESC_BY_PRICE = "$DOWN";
const ORDER_BY_PROD_RELEVANCE = "Rel.";

const searchBar = document.getElementById("searchProd")

let isSearchActive = 0;

let searchFilteredProducts = []
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Obtener el ID de la categoría desde el local storage y colocarla en la url

let id = localStorage.getItem("catID");
let productList = ("https://japceibal.github.io/emercado-api/cats_products/" + id + ".json");
getProducts(productList);

//Obtener los datos de los productos en formato json utilizando el id obtenido anteriormente

async function getProducts(list) {
    try {
        let response = await fetch(list);
        let data = await response.json()
        currentProductsArray = data.products;
        let catName = data.catName;
        showProductsList(currentProductsArray);
        changeCatName(catName);

    } catch (error) {
        console.error(error);
    }
}

//Cambia el nombre de la categoría

function changeCatName(nameCat) {
    document.getElementById("categoriaNombre").innerHTML = `
    ${nameCat}
    `;
}

//Filtrar productos

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_RELEVANCE) {
        result = array.sort(function (a, b) {
            if (a.soldCount > b.soldCount) { return -1; }
            if (a.soldCount < b.soldCount) { return 1; }
            return 0;
        });
    }

    return result;
}


//Cambia el listado de productos de la categoría

function showProductsList(prodArray) {
    let htmlContentToAppend = "";

    for (let i = 0; i < prodArray.length; i++) {
        let products = prodArray[i];


        if (((minCount == undefined) || (minCount != undefined && parseInt(products.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(products.cost) <= maxCount))) {

            htmlContentToAppend += `
            <div class="list-group">
            <button class="list-group-item list-group-item-action" onclick="productInfo(${products.id})">
                <div class="row">
                        <div class="col-3">
                        <img src="${products.image}" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                                <h4>${products.name} - ${products.currency} ${products.cost}</h4>
                                <p>${products.description}</p>
                            </div>
                            <small class="text-muted">${products.soldCount} Vendidos</small>
                        </div>
  
                    </div>
                </div>
            </button>
            </div>
            `
        }

        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    if (isSearchActive === 1) {
        searchFilteredProducts = sortProducts(currentSortCriteria, searchFilteredProducts);
        showProductsList(searchFilteredProducts)
    }
    if (isSearchActive === 0) {
        currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
        showProductsList(currentProductsArray);
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

    //Filtrar por Precio Ascendente

    document.getElementById("sortAscPrice").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    //Filtrar por Precio Descendente

    document.getElementById("sortDescPrice").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    //Filtrar por Relevancia

    document.getElementById("sortByRelevance").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PROD_RELEVANCE);
    });


    //Limpiar Rango Introducido

    document.getElementById("limpiarRangoPrecio").addEventListener("click", function () {
        document.getElementById("precioMin").value = "";
        document.getElementById("precioMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        if (isSearchActive === 1) {
            showProductsList(searchFilteredProducts)
        }
        if (isSearchActive === 0) {
            showProductsList(currentProductsArray);
        }
    });

    //Filtrar Rango Introducido

    document.getElementById("filtrarRangoPrecio").addEventListener("click", function () {
        minCount = document.getElementById("precioMin").value;
        maxCount = document.getElementById("precioMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        if (isSearchActive === 1) {
            showProductsList(searchFilteredProducts)
        }
        if (isSearchActive === 0) {
            showProductsList(currentProductsArray);
        }

    });



});

function productInfo(productID) {
    localStorage.setItem("productID", productID)
    window.location.href = "product-info.html"
}

//Desafiate entrega 2

function searchProducts() {
    searchFilteredProducts = []

    const searchInfo = searchBar.value.toLowerCase()


    for (let product of currentProductsArray) {

        let prodName = product.name.toLowerCase();

        if (prodName.indexOf(searchInfo) !== -1) {
            searchFilteredProducts.push(product)
        }
    }

    if (searchInfo === "") {
        isSearchActive = 0;
    } else {
        isSearchActive = 1;
    }

    showProductsList(searchFilteredProducts);
    console.log(isSearchActive)
}

searchBar.addEventListener("keyup", searchProducts)

//Cambié los códigos en varias funciones para que
//los filtros se apliquen con los productos que
//el usuario busquea en la barra de buscador