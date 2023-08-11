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

const togglePassword = document.getElementById("togglePassword");
const inputPassword = document.getElementById("password");
const inputUsername = document.getElementById("username");
const iconLoading = document.getElementById("loading");
const submit = document.getElementById('submit');
const maxlogin = 5;
const countdownTime = 30;
let count = 0;
let countdownIntervalId;

const onToggleTypePassword = () => {
    togglePassword.classList.toggle("fa-eye-slash");

    if (inputPassword.type === "password") {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
};

togglePassword.addEventListener("mouseenter", onToggleTypePassword);
togglePassword.addEventListener("mouseleave", onToggleTypePassword);

const checkUsername = (username) => {
    if (!username) return "Please enter Username!";
    else if (username.length < 5)
        return "Username requires 5 characters!";
    else return true;
};
const checkPassword = (password) => {
    if (!password) return "Please enter Password!";
    else if (password.length < 5)
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
const validation = (username, password) => {
    const errorUsername = document.getElementById("errorUsername");
    const errorPassword = document.getElementById("errorPassword");

    // validation username;
    let messageErrorUsername = checkUsername(username);
    if (typeof messageErrorUsername === "string") {
        showError(errorUsername, messageErrorUsername);
    } else {
        hideError(errorUsername);
    }

    // validation password;
    let messageErrorPassword = checkPassword(password);
    if (typeof messageErrorPassword === "string") {
        showError(errorPassword, messageErrorPassword);
    } else {
        hideError(errorPassword);
    }

    if (messageErrorUsername === true && messageErrorPassword === true) {
        return true;
    }
    return false;
};

const login = () => {
    const user = {
        username: inputUsername.value,
        password: inputPassword.value
    };
    firebase.database().ref("/users").child(user.username).on("value", function (snapshot) {
        if (snapshot.exists()) {
            console.log(snapshot.val())
            var Password = snapshot.val()
            if (Password["Password"] == user.password) {
                firebase.database().ref("/Login").update({
                    "Login": "True",
                    "User": user.username
                })
                swal(
                    "",
                    "Login successful",
                    "success"
                );
                window.onclick = function () {
                    window.location.href = "index.html";
                }
                return true;
            }
        }
        swal(
            "",
            "Login failed! Wrong username or password!",
            "error"
        );
        count++;

    })
};

function startCountdown(time) {
    submit.disabled = true;
    submit.innerHTML = time + 's';

    countdownIntervalId = setInterval(() => {
        time--;
        submit.innerHTML = time + 's';
        localStorage.setItem("countdownTime", time);

        if (time <= 0) {
            clearInterval(countdownIntervalId);
            submit.disabled = false;
            submit.innerHTML = 'Login';
            count = 0;
            localStorage.removeItem("countdownTime");
        }
    }, 1000);
}

if (localStorage.getItem("countdownTime")) {
    var countdownTimeload = parseInt(localStorage.getItem("countdownTime"));
    startCountdown(countdownTimeload);
}

const showLoading = () => {
    iconLoading.style.display = "flex";
};
const hideLoading = () => {
    iconLoading.style.display = "none";
};
const onSubmitForm = (form) => {
    const username = form.username.value;
    const password = form.password.value;
    const checkValidation = validation(username, password);
    if (checkValidation === true) {
        showLoading();
        setTimeout(() => {
            login();
            if (count >= maxlogin) {
                startCountdown(countdownTime);
            }
            hideLoading();
        }, 500);
    }
};

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
  
