const firebaseConfig = {
    apiKey: "AIzaSyA76xKoi3-xjoEvzH0EguwIQM4RfwPT55M",
    authDomain: "health-59eca.firebaseapp.com",
    databaseURL: "https://health-59eca-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "health-59eca",
    storageBucket: "health-59eca.appspot.com",
    messagingSenderId: "1095808364266",
    appId: "1:1095808364266:web:bfa216a78acb9072147193",
    measurementId: "G-3D1813PSL9"
};

firebase.initializeApp(firebaseConfig);

const toggleoldPassword = document.getElementById("toggleoldPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleEAPassword = document.getElementById("toggleEAPassword");
const User = document.getElementById("username")
const inputoldpassword = document.getElementById("oldpassword")
const inputPassword = document.getElementById("password");
const inputEApassword = document.getElementById("EApassword")
const iconLoading = document.getElementById("loading");

firebase.database().ref("/Login").on("value", function (snapshot) {
    if (snapshot.exists()) {
        console.log(snapshot.val())
        var Webmode = snapshot.val()
        if (Webmode["Login"] == "True") {
            User.innerHTML = Webmode["User"];
        }
    }
})

const onToggleTypeoldPassword = () => {
    toggleoldPassword.classList.toggle("fa-eye-slash");

    if (inputoldpassword.type === "password") {
        inputoldpassword.type = "text";
    } else {
        inputoldpassword.type = "password";
    }
};

const onToggleTypePassword = () => {
    togglePassword.classList.toggle("fa-eye-slash");

    if (inputPassword.type === "password") {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
};

const onToggleTypeEAPassword = () => {
    toggleEAPassword.classList.toggle("fa-eye-slash");

    if (inputEApassword.type === "password") {
        inputEApassword.type = "text";
    } else {
        inputEApassword.type = "password";
    }
};

toggleoldPassword.addEventListener("mouseenter", onToggleTypeoldPassword);
toggleoldPassword.addEventListener("mouseleave", onToggleTypeoldPassword);
togglePassword.addEventListener("mouseenter", onToggleTypePassword);
togglePassword.addEventListener("mouseleave", onToggleTypePassword);
toggleEAPassword.addEventListener("mouseenter", onToggleTypeEAPassword);
toggleEAPassword.addEventListener("mouseleave", onToggleTypeEAPassword);

const checkoldPassword = (oldpassword) => {
    if (!oldpassword) return "Please enter old password!";
    else if (oldpassword.length < 5)
        return "Password requires 5 characters!";
    else return true;
};
const checkPassword = (password) => {
    if (!password) return "Please enter new password!";
    else if (password.length < 5)
        return "Password requires 5 characters!";
    else return true;
};
const checkEAPassword = (EApassword) => {
    if (!EApassword) return "Please enter password again!";
    else if (EApassword.length < 5)
        return "Password requires 5 characters!";
    else return true;
};

const showError = (element, message) => {
    element.style.display = "block";
    element.innerHTML = message;
    element.className = "message__error";
};

const hideError = (element) => {
    element.style.display = "none";
};

const validation = (oldpassword, password, EApassword) => {
    const erroroldPassword = document.getElementById("erroroldPassword");
    const errorPassword = document.getElementById("errorPassword");
    const errorEAPassword = document.getElementById("errorEAPassword");

    let messageErroroldPassword = checkoldPassword(oldpassword);
    if (typeof messageErroroldPassword === "string") {
        showError(erroroldPassword, messageErroroldPassword);
    } else {
        hideError(erroroldPassword);
    }

    let messageErrorPassword = checkPassword(password);
    if (typeof messageErrorPassword === "string") {
        showError(errorPassword, messageErrorPassword);
    } else {
        hideError(errorPassword);
    }

    let messageErrorEAPassword = checkEAPassword(EApassword);
    if (typeof messageErrorEAPassword === "string") {
        showError(errorEAPassword, messageErrorEAPassword);
    } else {
        hideError(errorEAPassword);
    }

    if (messageErrorPassword === true && messageErrorEAPassword === true && messageErroroldPassword === true) {
        return true;
    }
    return false;
};

const showLoading = () => {
    iconLoading.style.display = "flex";
};
const hideLoading = () => {
    iconLoading.style.display = "none";
};


const onSubmitForm = (form) => {
    const oldpassword = form.oldpassword.value;
    const password = form.password.value;
    const EApassword = form.EApassword.value;
    const checkValidation = validation(oldpassword, password, EApassword);
    if (checkValidation === true) {
        showLoading();
        setTimeout(() => {
            firebase.database().ref("/Login").on("value", function (snapshot) {
                if (snapshot.exists()) {
                    console.log(snapshot.val())
                    var Webmode = snapshot.val()
                    const change = {
                        Username: Webmode["User"],
                        Password: inputoldpassword.value
                    };
                    firebase.database().ref("/users").child(change.Username).on("value", function (snapshot) {
                        if (snapshot.exists()) {
                            console.log(snapshot.val())
                            var Password = snapshot.val()
                            if (Password["Password"] == change.Password) {
                                if (inputEApassword.value != inputPassword.value) {
                                    swal(
                                        "",
                                        "Passworld does not match! Please enter again!",
                                        "error"
                                    );
                                } else {
                                    firebase.database().ref("/Login").on("value", function (snapshot) {
                                        if (snapshot.exists()) {
                                            console.log(snapshot.val())
                                            var Webmode = snapshot.val()
                                            const user = {
                                                Username: Webmode["User"],
                                                Password: inputPassword.value
                                            };
                                            firebase.database().ref('users/' + user.Username).set({
                                                Password: user.Password
                                            })
                                            swal(
                                                "",
                                                "Change password Success, please login again!",
                                                "success"
                                            );
                                            firebase.database().ref("/Login").update({
                                                "Login": "False",
                                                "User": "None"
                                            })
                                            window.onclick = function () {
                                                window.location.href = "Login.html";
                                            }
                                        }
                                    })
                                }
                            } else {
                                swal(
                                    "",
                                    "Change password failed! Wrong old password!",
                                    "error"
                                );
                            }
                        }
                    })
                }
            })
            hideLoading();
        }, 500);
    }
}

firebase.database().ref("Current data").on("value", function (snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val())
      var UserID = snapshot.val()
      firebase.database().ref("UserID").child(UserID["UserID"]).child("WeekDay").child(UserID["Day"]).update({
        Status: UserID["Status"],
        Time: UserID["Time"],
        Temp: UserID["Temp"]
      })
      firebase.database().ref("Workspace").child(UserID["Date"]).child(UserID["Time"]).update({
        Status: UserID["Status"],
        UserID: UserID["UserID"],
        Temp: UserID["Temp"]
      })
      if ((UserID["UserID"] == "0") && (UserID["Status"] == " ")) {
        firebase.database().ref("Workspace").child(UserID["Date"]).child(UserID["Time"]).update({
          Status: "",
          UserID: "",
          Temp: UserID["Temp"]
        })
        firebase.database().ref("UserID").child(UserID["UserID"]).remove();
      }
    }
  })
  