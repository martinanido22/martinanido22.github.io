const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Redirigir al login si no estas iniciaste sesión

function isLogged() {
  if (localStorage.getItem("loggedUsers") === null) {
    window.location.href = "login.html"
  } else {
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

    if (isLogged === false) {
      window.location.href = "login.html"
    } else {
      if (name != "") {
        document.getElementById("navEmail").innerHTML = (name + "_" + surname);
      } else {
        document.getElementById("navEmail").innerHTML = email;
      }
    }
  }
}

isLogged()

//log out

function logOut() {
  let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"));
  for (user of loggedUsers) {
    if (user.logged === true) {
      user.logged = false
      localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
    }
  }
  location.reload();
}