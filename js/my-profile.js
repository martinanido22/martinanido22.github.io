const pFName = document.getElementById("pFName");
const pFSurname = document.getElementById("pFSurname");
const pEmail = document.getElementById("pEmail");

const pSName = document.getElementById("pSName");
const pSSurname = document.getElementById("pSSurname");
const pNumber = document.getElementById("pNumber");
const pImage = document.getElementById("pImage");

let uploaded_image = "";
let newimg = false

loadUserData()
console.log(pImage)


//Carga los datos del usuario

function loadUserData() {
    let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"))
    for (user of loggedUsers) {
        console.log(user)
        if (user.logged) {
            pFName.value = user.pFName;
            pFSurname.value = user.pFSurname;
            pEmail.value = user.pEmail;
            pSName.value = user.pSName;
            pSSurname.value = user.pSSurname;
            pNumber.value = user.pNumber;
            loadUserImage(user.pImage)
        }
    }
}

//Guarda los cambios

function saveChanges() {
    let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"))
    for (user of loggedUsers) {
        if (user.logged) {
            user.pFName = pFName.value
            user.pFSurname = pFSurname.value
            user.pEmail = pEmail.value
            user.pSName = pSName.value
            user.pSSurname = pSSurname.value
            user.pNumber = pNumber.value
            if (newimg) user.pImage = uploaded_image
        }
    }
    localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
}

//Desafíate 7

function loadUserImage(image) {
    if (image === "") {
        document.getElementById("pfPicContainer").innerHTML = `<img id="pfPic" src="/img/img_perfil.png"></img>`
    } else {
        document.getElementById("pfPicContainer").innerHTML = `<img id="pfPic" src=${image}></img>`
    }
}

pImage.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        document.getElementById("pfPicContainer").innerHTML = `<img id="pfPic" src=${uploaded_image}></img>`
    })
    reader.readAsDataURL(this.files[0])
    newimg = true
});

// Validación bootsrap 5
(function () {
    'use strict'


    var forms = document.querySelectorAll('.needs-validation')


    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    saveChanges()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()