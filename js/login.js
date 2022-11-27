document.getElementById("ingresar").addEventListener("click", () => {
    evaluarDatos()
})

function evaluarDatos() {
    let email = document.getElementById("emailBar").value;
    let pw = document.getElementById("passwordBar").value;

    //Evalua si cumple los requisitos del login

    if ((pw.length < 8) || !(email.includes("@"))) {
        document.getElementById("alert").innerHTML = `
        <p>Email o Contraseña erroneo.</p>
        `
    } else {

        //Crea Logged Users y un usuario con el email introducido en el login

        if (localStorage.getItem("loggedUsers") === null) {
            let loggedUsers = [];
            let user = {
                logged: true,
                pFName: "",
                pFSurname: "",
                pEmail: email,
                pSName: "",
                pSSurname: "",
                pNumber: "",
                pImage: "",
            }
            loggedUsers.push(user);
            localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
        } else {

            //Si ya existe logged users, se fija si el usuario ya existe

            let userExists = false;
            let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"));
            for (user of loggedUsers) {
                if (user.pEmail === email) {
                    user.logged = true;
                    userExists = true;
                }
            }
            if (userExists === false) {
                let user = {
                    logged: true,
                    pFName: "",
                    pFSurname: "",
                    pEmail: email,
                    pSName: "",
                    pSSurname: "",
                    pNumber: "",
                    pImage: "",
                }
                loggedUsers.push(user);
            }
            localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
        }

        window.location.href = "index.html"
    }
}

//Desafíate 1

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    const responsePayload = decodeJwtResponse(response.credential);

    loginWithGoogle(responsePayload)
}
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "107909054441-s8fkk7tm1i144g2ic5pg00523281htaf.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog


}

function decodeJwtResponse(jwt) {
    var base64Url = jwt.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function loginWithGoogle(responsePayload) {
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    let surname = ""
    if (responsePayload.family_name === undefined){
        surname = ""
    } else {
        surname = responsePayload.family_name
    }

    if (localStorage.getItem("loggedUsers") === null) {
        let loggedUsers = [];
        let user = {
            logged: true,
            pFName: responsePayload.given_name,
            pFSurname: surname,
            pEmail: responsePayload.email,
            pSName: "",
            pSSurname: "",
            pNumber: "",
            pImage: responsePayload.picture,
        }
        loggedUsers.push(user);
        localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
    } else {

        //Si ya existe logged users, se fija si el usuario ya existe

        let userExists = false;
        let loggedUsers = JSON.parse(localStorage.getItem("loggedUsers"));
        for (user of loggedUsers) {
            if (user.pEmail === responsePayload.email) {
                user.logged = true;
                userExists = true;
            }
        }
        if (userExists === false) {
            let user = {
                logged: true,
                pFName: responsePayload.given_name,
                pFSurname: surname,
                pEmail: responsePayload.email,
                pSName: "",
                pSSurname: "",
                pNumber: "",
                pImage: responsePayload.picture,
            }
            loggedUsers.push(user);
        }
        localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers));
    }
    window.location.href = "index.html"
}
