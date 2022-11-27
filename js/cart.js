const URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json"
const creditCard = document.getElementById("creditCard")
const transferency = document.getElementById("transferency")
const purchaseAlert = document.getElementById("purchaseAlert")
let emptyCart = false
let auxCart = []



//fetch

async function getCartInfo(URL) {
    if (localStorage.getItem("cartProducts") === null) {
        try {
            emptyCart = true
            let response = await fetch(URL);
            let cart = []
            let product = await response.json();
            cart.push(product.articles[0])
            showCart(cart);
        } catch (error) {
            console.error(error);
        }
    } else {
        emptyCart = false
        let cart = JSON.parse(localStorage.getItem("cartProducts"))
        cartItemsArray = cart
        console.log(cart)
        showCart(cart)
    }
}

//cargar imagen

function loadImage(image) {
    return `<img style="width:50px" src="${image}">`
}

//calcular subtotal



//cambiar cantidad y calcular subtotal en tiempo real


function updateCount(id) {
    let count = document.getElementById(`${id}-count`).value
    let currency = document.getElementById(`${id}-currency`).firstChild.nodeValue
    let unitCost = document.getElementById(`${id}-unitCost`).firstChild.nodeValue
    document.getElementById(`${id}-Subtotal`).innerHTML = calcSubtotal(currency, unitCost, count)
    if (!(localStorage.getItem("cartProducts") === null)) {
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts"))
        for (product of cartProducts) {
            if (product.id === id) {
                product.count = Number(count)
            }
        }
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts))
    }
}

//Mostrar el carrito


function showCart(cart) {
    let htmlContentToAppend = ""
    for (product of cart) {
        console.log(product)
        const {
            id, name, count, unitCost, currency, image
        } = product

        console.log(`${name} - ${count} - ${currency} ${unitCost} - ${image} - ${id}`)
        htmlContentToAppend += `
        <tr>
            <td>${loadImage(image)}</th>
            <td>${name}</td>
            <td><span id="${id}-currency">${currency}</span> <span id="${id}-unitCost">${unitCost}</span></td>
            <td><input class="border border-1 rounded" type="number" min="1" onkeyup="updateCount(${id}); calcTotal();" onclick="updateCount(${id}); calcTotal();" style="width: 60px;" id="${id}-count" value="${count}"></td>
            <td><b><span id="${id}-Subtotal">${calcSubtotal(currency, unitCost, count)}</span></b></td>
            <td><button type="button" onclick="eraseProduct(${id})" class="btn btn-outline-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
</svg></button></td>
            <td></td>
        </tr>
        `
    }
    document.getElementById("cart").innerHTML = htmlContentToAppend
    calcTotal()
}


getCartInfo(URL);


//Validación de compra

function checkModalValidity() {
    const payMethod = document.getElementById("paymentMethod")
    if (creditCard.checked) {
        document.getElementById("payMethodTransfer").setAttribute("disabled", "")
        document.getElementById("payMethodCredit").removeAttribute("disabled");
        payMethod.innerText = "Tarjeta de crédito"
    } else if (transferency.checked) {
        document.getElementById("payMethodCredit").setAttribute("disabled", "")
        document.getElementById("payMethodTransfer").removeAttribute("disabled");
        payMethod.innerText = "Transferencia bancaria"
    } else {
        document.getElementById("payMethodCredit").setAttribute("disabled", "");
        document.getElementById("payMethodTransfer").setAttribute("disabled", "");
        payMethod.innerText = "No ha seleccionado"
    }
}

//confirmar pago

function confirmPayment() {
    const payModal = document.getElementById("payModal")

    const cardNumber = document.getElementById("cardNumber");
    const expirationDate = document.getElementById("expirationDate");
    const securityCode = document.getElementById("securityCode");
    const accountNumber = document.getElementById("accountNumber")

    creditCard.setAttribute('onclick', 'confirmPayment(); checkModalValidity()')
    transferency.setAttribute('onclick', 'confirmPayment(); checkModalValidity()')
    cardNumber.setAttribute('onkeyup', 'confirmPayment()')
    expirationDate.setAttribute('onkeyup', 'confirmPayment()')
    securityCode.setAttribute('onkeyup', 'confirmPayment()')
    accountNumber.setAttribute('onkeyup', 'confirmPayment()')

    if (creditCard.checked) {

        if ((cardNumber.value !== "") && (expirationDate.value !== "") && (securityCode.value !== "")) {
            payModal.classList.remove("is-invalid");
            payModal.classList.add("is-valid");
        } else {
            payModal.classList.add("is-invalid");
            payModal.classList.remove("is-valid");
        }
    } else if (transferency.checked) {
        if (accountNumber.value !== "") {
            payModal.classList.remove("is-invalid");
            payModal.classList.add("is-valid");
        } else {
            payModal.classList.add("is-invalid");
            payModal.classList.remove("is-valid");
        }
    } else {
        payModal.classList.add("is-invalid");
    }
}


(function () {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    confirmPayment()
                } else {
                    alertPurchase()
                }



                form.classList.add('was-validated')

            }, false)
        })
})()

//alerta de compra

function alertPurchase() {

    purchaseAlert.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        ¡Has comprado con éxito!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `

}

//calcular total

function calcTotal() {
    let total = 0
    let subTotal = document.getElementsByClassName("rawPrice");
    for (unit of subTotal) {
        let cost = unit.firstChild.nodeValue
        let price = convertToNumber(cost)
        if (cost.includes("UYU")) {
            price = (price * 0.025)
        }
        total = Number(total) + Number(price)
        
    }
    console.log(total)
    document.getElementById("productsCost").innerHTML = Math.round(total)
    calcShipment()
}

function convertToNumber(number) {
    let input = JSON.stringify(number);
    let res = input.replace(/\D/g, '');
    return res
}

function calcSubtotal(currency, unitCost, count) {
    return `<span class="rawPrice">${currency} ${unitCost * count}<span>`
}

//calcular envío

function calcShipment() {
    const cost = document.getElementById("productsCost").innerText
    let shippingCost = 0
    if (document.getElementsByClassName("shipMth")[0].checked) {
        shippingCost = ((cost / 100) * 15);
    } else if (document.getElementsByClassName("shipMth")[1].checked) {
        shippingCost = ((cost / 100) * 7);
    } else if (document.getElementsByClassName("shipMth")[2].checked) {
        shippingCost = ((cost / 100) * 5);
    }
    document.getElementById("shippingCost").innerHTML = Math.round(shippingCost)
    calcFinalCost(cost, shippingCost)
}

//calcular total final

function calcFinalCost(cost, shippingCost) {
    const finalCostHTML = document.getElementById("finalCost")
    let finalCost = (Number(cost) + Number(shippingCost))
    finalCostHTML.innerHTML = Math.round(finalCost)
}

//Desafíate 6

function eraseProduct(id){
    if (!emptyCart) {
        let cart = JSON.parse(localStorage.getItem("cartProducts"))
        console.log(cart)
        for (i=0; i < cart.length; i++){         
            if (cart[i].id === id) {
                cart.splice(i, 1)
            }       
        } 
        localStorage.setItem("cartProducts", JSON.stringify(cart))
        showCart(cart)
    } else {
        showCart(auxCart)
    }
}