let comments = []
let commentsHTML = ""
let commentList = document.getElementById("prodComments")
let info = []


const id = localStorage.getItem("productID");
const infoURL = "https://japceibal.github.io/emercado-api/products/" + id + ".json";
const commentsURL = "https://japceibal.github.io/emercado-api/products_comments/" + id + ".json";

getInfo(infoURL);

async function getInfo(infoURL) {
    try {
        let response = await fetch(infoURL);
        info = await response.json();
        showInfo(info);
    } catch (error) {
        console.error(error);
    }
}

async function getComments(commentsURL) {
    try {
        let response = await fetch(commentsURL);
        comments = await response.json();
        showComments(comments);
    } catch (error) {
        console.error(error);
    }
}


function showInfo(info) {
    //Selecciona donde poner la información
    document.getElementById("prodInfoList").innerHTML = `
        <div class="row">
            <h1 class="col-10" style="margin-top: 30px; margin-bottom: 30px;">${info.name}</h1>
            <button type="button" id="addProdToCart" class="btn btn-success justify-content-right align-middle" style="height: 40px; margin-top: 35px; width: 100px" onclick="addToCart()">Comprar</button>
        </div><hr>
        <p><b>Precio:</b><br>
          ${info.currency} ${info.cost}</p>

        <p><b>Descripción:</b><br>
          ${info.description}</p>

        <p><b>Categoría:</b><br>
          ${info.category}</p>

        <p><b>Cantidad de vendidos:</b><br>
          ${info.soldCount}</p>

        <p><b>Imágenes ilustrativas:</b></p>

        <div id="prodImg" class="item">

        </div>

        <br><br>
        <hr>
        <br>
    `
    //Carga las imagenes
    let imgList = document.getElementById("prodImg")
    let htmlContentToAppend = ""
    for (let i = 0; i < info.images.length; i++) {
        htmlContentToAppend += `
        <div id="infoImg"><img src="${info.images[i]}"></div>
        `
    }
    imgList.innerHTML = htmlContentToAppend

    //Carga los comentarios
    getComments(commentsURL)
    showComments(comments);

    //Carga los productos relacionados
    //showRelProducts(info.relatedProducts)

    //Carga carrusel de productos relacionados
    showRelProductsCarousel(info.relatedProducts)

}

function showComments(comments) {

    let htmlContentToAppend = ""
    for (let i = 0; i < comments.length; i++) {
        htmlContentToAppend += `
        <div style="border: 1px solid lightgray; padding-top: 12px; padding-left: 20px">
                <p><b>${comments[i].user}</b> - ${comments[i].dateTime} - ${commentScore(comments[i].score)}<br>
                ${comments[i].description}</p>
        </div>
        `
    }

    commentsHTML = htmlContentToAppend
    commentList.innerHTML = htmlContentToAppend;

}

//Arma el string para poner las estrellas en el html

function commentScore(score) {
    let starRateHtml = "";
    let j = 1;
    while (j <= score) {
        starRateHtml += `
        <span class="fa fa-star checked"></span>
        `
        j += 1;
    }
    while (j <= 5) {
        starRateHtml += `
        <span class="fa fa-star"></span>
        `
        j += 1;
    }
    return starRateHtml;
}

function showRelProducts(products) {
    let htmlContentToAppend = ""
    for (const product of products) {
        const {
            id, name, image
        } = product
        htmlContentToAppend += `
            <button class="rel-prod-button" onclick="relProdInfo(${id})">
            <div id="infoImg"><img src="${image}">
                <h3>${name}</h3>
                </div>
            </button>
        `
    }
    document.getElementById("relatedProducts").innerHTML = htmlContentToAppend
}

function relProdInfo(id) {
    localStorage.setItem("productID", id);
    location.reload();
}


//Desafiate de la entrega 3


document.getElementById("publishComment").addEventListener("click", () => {
    let today = new Date();
    let now = today.toLocaleString();

    let htmlContentToAppend = ` 
        <div style="border: 1px solid lightgray; padding-top: 12px; padding-left: 20px">
                <p><b>${getName()}</b> - ${now} - ${commentScore(selectNum())}<br>
                ${document.getElementById("pReview").value}</p>
        </div>
        `
    commentsHTML += htmlContentToAppend
    commentList.innerHTML = commentsHTML
})

function selectNum() {
    return document.getElementById("pScore").value;
}

//Desafiate entrega 4

function showRelProductsCarousel(products) {
    let htmlContentToAppend = ""
    let i = 1
    for (const product of products) {
        const {
            id, name, image
        } = product

        if (i === 1) {
            htmlContentToAppend += `
            <div class="carousel-item active" onclick="relProdInfo(${id})">
                <img src="${image}" class="d-block w-100" alt="">
                <div class="carousel-caption d-none d-md-block">
                    <h4 style="color: gray"><b>${name}</b></h4>
                </div>
            </div>
            `
        } else {
            htmlContentToAppend += `
            <div class="carousel-item" onclick="relProdInfo(${id})">
                <img src="${image}" class="d-block w-100" alt="">
                <div class="carousel-caption d-none d-md-block">
                    <h4 style="color: gray"><b>${name}</b></h4>
                </div>
            </div>
            `
        }


        i += 1

    }

    document.getElementById("carouselProducts").innerHTML = htmlContentToAppend
}

//Desafíate 5

function addToCart() {
    let product = {
        name: info.name,
        currency: info.currency,
        unitCost: info.cost,
        image: info.images[0],
        count: 1,
        id: info.id
    }
    if (localStorage.getItem("cartProducts") === null) {
        let cartProducts = []
        cartProducts.push(product)
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    } else {
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts"))
        let alreadyInCart = false;
        let currentProduct = product;

        for (i = 0; i < cartProducts.length; i++) {
            if (cartProducts[i].id === currentProduct.id) {
                alreadyInCart = true;
                console.log(cartProducts[i].count)
                cartProducts[i].count += 1;
            }
        }

        if (alreadyInCart === true) {
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        } else {
            cartProducts.push(product);
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        }
        console.log(cartProducts)
    }
    window.location.href = "cart.html"
}

//Funcion para arreglar desafiate 3 despues de hacer el 7

function getName() {
    let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"));
    let isLogged = false;
    let email = "";
    let name = "";
    let surname = "";

    for (user of loggedUsers) {
        if (user.logged === true) {
            isLogged = true;
            email = user.pEmail;
            name = user.pFName;
            surname = user.pFSurname;
        }
    }

    //Si el usuario tiene un nombre, se utiliza el mismo en vez del email en la barra del navegador

    if (name != "") {
        return document.getElementById("navEmail").innerHTML = (name + "_" + surname);
    } else {
        return document.getElementById("navEmail").innerHTML = email;
    }
}
