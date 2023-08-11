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
const toggleEAPassword = document.getElementById("toggleEAPassword");
const inputPassword = document.getElementById("password");
const inputUsername = document.getElementById("username");
const inputEApassword = document.getElementById("EApassword")
const iconLoading = document.getElementById("loading");

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

togglePassword.addEventListener("mouseenter", onToggleTypePassword);
togglePassword.addEventListener("mouseleave", onToggleTypePassword);
toggleEAPassword.addEventListener("mouseenter", onToggleTypeEAPassword);
toggleEAPassword.addEventListener("mouseleave", onToggleTypeEAPassword);

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

const validation = (username, password, EApassword) => {
  const errorUsername = document.getElementById("errorUsername");
  const errorPassword = document.getElementById("errorPassword");
  const errorEAPassword = document.getElementById("errorEAPassword");

  let messageErrorUsername = checkUsername(username);
  if (typeof messageErrorUsername === "string") {
    showError(errorUsername, messageErrorUsername);
  } else {
    hideError(errorUsername);
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

  if (messageErrorUsername === true && messageErrorPassword === true && messageErrorEAPassword === true) {
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
  const username = form.username.value;
  const password = form.password.value;
  const EApassword = form.EApassword.value;
  const checkValidation = validation(username, password, EApassword);
  if (checkValidation === true) {
    showLoading();
    setTimeout(() => {
      if (inputEApassword.value != inputPassword.value) {
        swal(
          "",
          "Passworld does not match! Please enter again!",
          "error"
        );
      } else {
        const user = {
          Username: inputUsername.value,
          Password: inputPassword.value
        };
        firebase.database().ref("/users").child(user.Username).on("value", function (snapshot) {
          if (snapshot.exists()) {
            swal(
              "",
              "Username already exists!",
              "error"
            );
          } else {
            firebase.database().ref('users/' + user.Username).set({
              Password: user.Password
            })
            swal(
              "",
              "Sign Up Success!",
              "success"
            );
            window.onclick = function () {
              window.location.href = "Login.html";
            }
          }
        })
      };
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
