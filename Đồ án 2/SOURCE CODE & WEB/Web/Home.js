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

const toggleSwitch = document.querySelector('input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
const Workspace = document.getElementById("Workspace")
const home = document.getElementById("home")
const login = document.getElementById("ic")
const logout = document.getElementById("logout")
const name = document.getElementById("nameic")
const icon = document.getElementById("icon");
const arrow = document.getElementById("arrow");
const Mode = document.getElementById("mode");
const drop = document.getElementsByClassName("dropdown-content");

home.onclick = function () {
  window.location.href = "index.html";
}

login.addEventListener("click", function () {
  if (icon.innerHTML === "login") {
    window.location.href = "Login.html";
  }
});

logout.onclick = function () {
  firebase.database().ref("/Login").update({
    "Login": "False",
    "User": "None"
  })
};

firebase.database().ref("/Login").on("value", function (snapshot) {
  if (snapshot.exists()) {
    console.log(snapshot.val())
    var Webmode = snapshot.val()
    if (Webmode["Login"] == "True") {
      icon.innerHTML = "account_circle";
      name.innerHTML = Webmode["User"];
      arrow.style.display = "flex";
      arrow.onclick = function () {
        for (var i = 0; i < drop.length; i++) {
          var style = window.getComputedStyle(drop[i]);
          if (style.display === "none") {
            drop[i].style.display = "block";
          } else {
            drop[i].style.display = "none";
          }
        }
      };
      Workspace.onclick = function () {
        window.location.href = "Workspace.html";
      }
    } else {
      for (var i = 0; i < drop.length; i++) {
        drop[i].style.display = "none";
      }
    }
    if (Webmode["Login"] == "False") {
      icon.innerHTML = "login";
      name.innerHTML = "Login";
      arrow.style.display = "none";
      Workspace.onclick = function () {
        swal(
          "",
          "Please login to use this feature!",
          "info"
        )
      }
    }
  }
});

if (currentTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
  toggleSwitch.checked = true;
} else {
  document.documentElement.classList.add('light-mode');
  toggleSwitch.checked = false;
}

if (currentTheme) {
  document.documentElement.classList.add(currentTheme);
  toggleSwitch.checked = currentTheme === 'dark';
}

function switchTheme() {
  if (toggleSwitch.checked) {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
  else {
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
}

Mode.onclick = function () {
  toggleSwitch.checked = !toggleSwitch.checked;
  switchTheme();
}

toggleSwitch.addEventListener('change', switchTheme, false);

// get time
function Dong_ho() {
  var gio = document.getElementById("gio");
  var phut = document.getElementById("phut");
  var Gio_hien_tai = new Date().getHours();
  var Phut_hien_tai = new Date().getMinutes();
  // var Giay_hien_tai = new Date().getSeconds();
  Gio_hien_tai = Gio_hien_tai < 10 ? "0" + Gio_hien_tai : Gio_hien_tai;
  Phut_hien_tai = Phut_hien_tai < 10 ? "0" + Phut_hien_tai : Phut_hien_tai;
  // Giay_hien_tai = Giay_hien_tai < 10 ? "0" + Giay_hien_tai : Giay_hien_tai;
  // var Time = Gio_hien_tai + ":" + Phut_hien_tai + ":" + Giay_hien_tai
  gio.innerHTML = Gio_hien_tai;
  phut.innerHTML = Phut_hien_tai;
  //   firebase.database().ref('Current data').update({
  //     Time: Time,
  //   })
}
var Dem_gio = setInterval(Dong_ho, 1000);
// end

// get day
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function Lich() {
  var thu = document.getElementById("thu");
  var ngay = document.getElementById("ngay");
  var thang = document.getElementById("thang");
  var nam = document.getElementById("nam");
  var Thu_hien_tai = new Date().getDay();
  var Ngay_hien_tai = new Date().getDate();
  var Thang_hien_tai = new Date().getMonth() + 1;
  var Nam_hien_tai = new Date().getFullYear();
  Ngay_hien_tai = Ngay_hien_tai < 10 ? "0" + Ngay_hien_tai : Ngay_hien_tai;
  Thang_hien_tai = Thang_hien_tai < 10 ? "0" + Thang_hien_tai : Thang_hien_tai;
  thu.innerHTML = weekDays[Thu_hien_tai];
  ngay.innerHTML = Ngay_hien_tai;
  thang.innerHTML = Thang_hien_tai;
  nam.innerHTML = Nam_hien_tai;
  firebase.database().ref('Current data').update({
    Day: week[Thu_hien_tai],
  })
}
var Dem_ngay = setInterval(Lich, 1000);
// end

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

