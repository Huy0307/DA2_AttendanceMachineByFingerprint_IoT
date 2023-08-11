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
const deletebtn = document.getElementById("delete");
const deletedatabtn = document.getElementById("delete-data");
const deleteidbtn = document.getElementById("delete-id");
const Allbtn = document.getElementById("All");
const All = document.getElementsByClassName("container");
const Weekbtn = document.getElementById("Weekly");
const Week = document.getElementsByClassName("container2");
const Load = document.getElementById("Load");
const Load1 = document.getElementById("Load1");
const Detailbtn = document.getElementById("Detail");
const Detail = document.getElementsByClassName("container3");
const Addbtn = document.getElementById("Add");
const Add = document.getElementsByClassName("container4");
const Changebtn = document.getElementById("Change");
const UID = document.getElementById("IDADD2");
const inputUID = document.getElementById("IDADD");
const inputName = document.getElementById("NameADD");
const inputGenderOptions = document.querySelectorAll(".Gender");
const inputBirth = document.getElementById("BirthADD");
const inputPhone = document.getElementById("PhoneADD");
const Submit = document.getElementById("Submit");
const warning = document.getElementById("warning");
const Upload = document.getElementById("Upload");
const fileInput = document.getElementById("fileInput");
const imageContainer = document.getElementById("imageContainer");
const Imageshow = document.getElementById("Imageshow");
const User = document.getElementById("UID");
const Name = document.getElementById("Name");
const Birth = document.getElementById("Birth");
const Gender = document.getElementById("Gender");
const Phone = document.getElementById("Phone");
const Early = document.getElementById("Early");
const Ontime = document.getElementById("Ontime");
const Late = document.getElementById("Late");
const Timeout = document.getElementById("Timeout");
const Addnew = document.getElementById("Add-new");
const Changedata = document.getElementById("Change-data");
const Shortenall = document.getElementById("Shorten-all");
const Shortenweekly = document.getElementById("Shorten-weekly");
const table1 = document.getElementById("table1");
const table2 = document.getElementById("table2");
const Download = document.getElementById("Download");
const left = document.getElementById("left");
const right = document.getElementById("right");
const Search = document.getElementById("Search");

// "----------------------------------------------Bar-------------------------------------------------------"
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
    }
    if (Webmode["Login"] == "False") {
      icon.innerHTML = "login";
      name.innerHTML = "Login";
      arrow.style.display = "none";
      for (var i = 0; i < drop.length; i++) {
        drop[i].style.display = "none";
      }
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
// "----------------------------------------------------Bar----------------------------------------------------------"


// "----------------------------------------------Weekly datas-------------------------------------------------------"
var rowCount = 10;
var addRow = 10;
Load.addEventListener('click', function () {
  addRow += 10;
  rowCount = addRow;
  Shortenweekly.style.display = "block";
  SelectAllData();
});

firebase.database().ref('Workspace').on('value', function (snapshot) {
  if (snapshot.exists()) {
    rowCount = 10;
  }
})

firebase.database().ref('Workspace').on('value', function (AllRecords) {
  AllRecords.forEach(function (CurentRecord) {
    firebase.database().ref('Workspace').child(CurentRecord.key).on('value', function (snapshot) {
      if (snapshot.exists()) {
        rowCount = 10;
      }
    })
  })
})

Shortenweekly.onclick = function () {
  addRow = 10;
  rowCount = addRow;
  Load.style.display = "block";
  SelectAllData();
  Shortenweekly.style.display = "none";
}

function SelectAllData() {
  firebase.database().ref('Workspace').limitToFirst(rowCount).on('value', function (AllRecords) {
    deleteAllRows('tbody2');
    var records = [];
    AllRecords.forEach(function (CurentRecord) {
      records.push(CurentRecord);
    });
    records.reverse();
    records.forEach(function (CurentRecord) {
      var isDataAvailable = records.length >= rowCount;
      var Day = CurentRecord.key;
      firebase.database().ref('Workspace').child(CurentRecord.key).limitToLast(rowCount).on('value', function (AllRecords) {
        var records = [];
        AllRecords.forEach(function (CurentRecord) {
          records.push(CurentRecord);
        });
        records.reverse();
        records.forEach(function (CurentRecord) {
          var Time = CurentRecord.key;
          var userID = CurentRecord.val().UserID;
          var Status = CurentRecord.val().Status;
          var Temp = CurentRecord.val().Temp;
          rowCount -= 1;
          AddItemsToTable(Day, Time, userID, Status, Temp);
        })
        var isDataAvailable2 = records.length >= rowCount;
        if (!isDataAvailable && !isDataAvailable2) {
          Load.style.display = "none";
        } else {
          Load.style.display = "block";
        }
      });
    });
  });
}

function AddItemsToTable(Day, Time, userID, Status, Temp) {
  var tbody = document.getElementById('tbody2');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  td1.innerHTML = Day;
  td2.innerHTML = Time;
  td3.innerHTML = userID;
  td4.innerHTML = Status;
  td5.innerHTML = Temp;
  if (Temp >= "37") {
    td1.style.backgroundColor = "red";
    td1.style.color = "#fafafa";
    td2.style.backgroundColor = "red";
    td2.style.color = "#fafafa";
    td3.style.backgroundColor = "red";
    td3.style.color = "#fafafa";
    td4.style.backgroundColor = "red";
    td4.style.color = "#fafafa";
    td5.style.backgroundColor = "red";
    td5.style.color = "#fafafa";
  }
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  tbody.appendChild(trow);
}

deletebtn.onclick = function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Please enter password!',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          return firebase.database().ref("/Login").once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Webmode = snapshot.val();
              const change = {
                Username: Webmode["User"],
                Password: password
              };
              return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                if (snapshot.exists()) {
                  var Password = snapshot.val();
                  if (Password["Password"] == change.Password) {
                    firebase.database().ref('Workspace').remove()
                    Swal.fire(
                      "",
                      "Delete successful",
                      "success"
                    );
                  } else {
                    Swal.fire(
                      "",
                      "Delete failed! Wrong password!",
                      "error"
                    );
                  }
                }
              });
            }
          });
        }
      });
    }
  });
};
// "----------------------------------------------Weekly datas-------------------------------------------------------"

// "----------------------------------------------All datas----------------------------------------------------------"
var rowCount1 = 10;
Load1.addEventListener('click', function () {
  rowCount1 += 15;
  Shortenall.style.display = "block";
  SelectAllData1();
});

Shortenall.onclick = function () {
  rowCount1 = 10;
  Load1.style.display = "block";
  SelectAllData1();
  Shortenall.style.display = "none";
}

function SelectAllData1() {
  firebase.database().ref('UserID').limitToFirst(rowCount1).on('value', function (AllRecords) {
    deleteAllRows('tbody1');
    var records = [];
    AllRecords.forEach(function (CurentRecord) {
      records.push(CurentRecord);
    });
    records.reverse();
    records.forEach(function (CurentRecord) {
      var UserID = CurentRecord.key;
      var Name = CurentRecord.child("Name").val();
      var WeekDayObj = CurentRecord.child("WeekDay").val();
      var MonObj = WeekDayObj.Mon;
      var Mon = MonObj.Status;
      var TueObj = WeekDayObj.Tue;
      var Tue = TueObj.Status;
      var WedObj = WeekDayObj.Wed;
      var Wed = WedObj.Status;
      var ThuObj = WeekDayObj.Thu;
      var Thu = ThuObj.Status;
      var FriObj = WeekDayObj.Fri;
      var Fri = FriObj.Status;
      var SatObj = WeekDayObj.Sat;
      var Sat = SatObj.Status;
      var SunObj = WeekDayObj.Sun;
      var Sun = SunObj.Status;
      AddItemsToTable1(UserID, Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun);
    });
    var numRecords = records.length;
    if (numRecords < rowCount1) {
      Load1.style.display = "none";
    } else {
      Load1.style.display = "block";
    }
  });
}

function AddItemsToTable1(UserID, Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun) {
  var tbody = document.getElementById('tbody1');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  var td6 = document.createElement('td');
  var td7 = document.createElement('td');
  var td8 = document.createElement('td');
  var td9 = document.createElement('td');
  td1.innerHTML = UserID;
  td2.innerHTML = Name;
  td2.style.textAlign = "left";
  td3.innerHTML = Mon;
  td4.innerHTML = Tue;
  td5.innerHTML = Wed;
  td6.innerHTML = Thu;
  td7.innerHTML = Fri;
  td8.innerHTML = Sat;
  td9.innerHTML = Sun;
  if (Mon == "Early") {
    td3.style.backgroundColor = "green";
    td3.style.color = "#fafafa"
  }
  if (Tue == "Early") {
    td4.style.backgroundColor = "green";
    td4.style.color = "#fafafa"
  }
  if (Wed == "Early") {
    td5.style.backgroundColor = "green";
    td5.style.color = "#fafafa"
  }
  if (Thu == "Early") {
    td6.style.backgroundColor = "green";
    td6.style.color = "#fafafa"
  }
  if (Fri == "Early") {
    td7.style.backgroundColor = "green";
    td7.style.color = "#fafafa"
  }
  if (Sat == "Early") {
    td8.style.backgroundColor = "green";
    td8.style.color = "#fafafa"
  }
  if (Sun == "Early") {
    td9.style.backgroundColor = "green";
    td9.style.color = "#fafafa"
  }
  if (Mon == "Late") {
    td3.style.backgroundColor = "red";
    td3.style.color = "#fafafa"
  }
  if (Tue == "Late") {
    td4.style.backgroundColor = "red";
    td4.style.color = "#fafafa"
  }
  if (Wed == "Late") {
    td5.style.backgroundColor = "red";
    td5.style.color = "#fafafa"
  }
  if (Thu == "Late") {
    td6.style.backgroundColor = "red";
    td6.style.color = "#fafafa"
  }
  if (Fri == "Late") {
    td7.style.backgroundColor = "red";
    td7.style.color = "#fafafa"
  }
  if (Sat == "Late") {
    td8.style.backgroundColor = "red";
    td8.style.color = "#fafafa"
  }
  if (Sun == "Late") {
    td9.style.backgroundColor = "red";
    td9.style.color = "#fafafa"
  }
  if (Mon == "Timeout") {
    td3.style.backgroundColor = "#909008";
    td3.style.color = "#fafafa"
  }
  if (Tue == "Timeout") {
    td4.style.backgroundColor = "#909008";
    td4.style.color = "#fafafa"
  }
  if (Wed == "Timeout") {
    td5.style.backgroundColor = "#909008";
    td5.style.color = "#fafafa"
  }
  if (Thu == "Timeout") {
    td6.style.backgroundColor = "#909008";
    td6.style.color = "#fafafa"
  }
  if (Fri == "Timeout") {
    td7.style.backgroundColor = "#909008";
    td7.style.color = "#fafafa"
  }
  if (Sat == "Timeout") {
    td8.style.backgroundColor = "#909008";
    td8.style.color = "#fafafa"
  }
  if (Sun == "Timeout") {
    td9.style.backgroundColor = "#909008";
    td9.style.color = "#fafafa"
  }
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  trow.appendChild(td6);
  trow.appendChild(td7);
  trow.appendChild(td8);
  trow.appendChild(td9);
  tbody.insertBefore(trow, tbody.firstChild);
}

deletedatabtn.onclick = function () {
  Swal.fire({
    title: 'Please enter UserID! Or "All" to delete all data',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (text) => {
      if (text == "All") {
        DELETEALL();
      } else {
        DELETEID(text);
      }
    }
  })
}

function DELETEALL() {
  Swal.fire({
    title: 'Please enter password!',
    input: 'password',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
      return firebase.database().ref("/Login").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
          var Webmode = snapshot.val();
          const change = {
            Username: Webmode["User"],
            Password: password
          };
          return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Password = snapshot.val();
              if (Password["Password"] == change.Password) {
                firebase.database().ref('UserID').remove();
                firebase.storage().ref().delete();
                Swal.fire(
                  "",
                  "Delete successful",
                  "success"
                );
              } else {
                Swal.fire(
                  "",
                  "Delete failed! Wrong password!",
                  "error"
                );
              }
            }
          });
        }
      });
    }
  });
}

function DELETEID(text) {
  firebase.database().ref("UserID").child(text).on("value", function (snapshot) {
    if (snapshot.hasChild("Name")) {
      console.log(snapshot.val())
      var UserID = snapshot.val()
      Swal.fire({
        title: 'Are you sure to delete user: ' + UserID["Name"] + '?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Please enter password!',
            input: 'password',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
              return firebase.database().ref("/Login").once("value").then(function (snapshot) {
                if (snapshot.exists()) {
                  var Webmode = snapshot.val();
                  const change = {
                    Username: Webmode["User"],
                    Password: password
                  };
                  return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                    if (snapshot.exists()) {
                      var Password = snapshot.val();
                      if (Password["Password"] == change.Password) {
                        firebase.database().ref('UserID').child(text).remove();
                        firebase.storage().ref().child(text).delete()
                        firebase.database().ref('ENROLL AND DELETE').child('DELETE').update({
                          UserID: text
                        });
                        Swal.fire(
                          "",
                          "Delete successful",
                          "success"
                        );
                      } else {
                        Swal.fire(
                          "",
                          "Delete failed! Wrong password!",
                          "error"
                        );
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      Swal.fire(
        "",
        "Delete failed! UserID doesn't exit!",
        "error"
      );
    }
  })
}

window.onload = function () {
  SelectAllData();
  SelectAllData1();
  firebase.database().ref("Choose User").update({
    UserID: ""
  })
}
// "----------------------------------------------All datas----------------------------------------------------------"

// "------------------------------------------------Button-----------------------------------------------------------"
var Earlydata = 0;
var Ontimedata = 0;
var Latedata = 0;
var Timeoutdata = 0;
var currentIndex = 0;

Allbtn.onclick = function () {
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "none";
  }
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "block";
  }
  for (var i = 0; i < Detail.length; i++) {
    Detail[i].style.display = "none";
  }
  for (var i = 0; i < Add.length; i++) {
    Add[i].style.display = "none";
  }
  Allbtn.style.backgroundColor = "#3A4F50";
  Allbtn.style.color = "#0EF6CC";
  Weekbtn.style.backgroundColor = "#fafafa";
  Weekbtn.style.color = "black";
  Detailbtn.style.backgroundColor = "#fafafa";
  Detailbtn.style.color = "black";
  Detailbtn.style.display = "block";
  Addbtn.style.backgroundColor = "#fafafa";
  Addbtn.style.color = "black";
}

Weekbtn.onclick = function () {
  firebase.database().ref("Choose User").update({
    UserID: ""
  })
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "none";
  }
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "block";
  }
  for (var i = 0; i < Detail.length; i++) {
    Detail[i].style.display = "none";
  }
  for (var i = 0; i < Add.length; i++) {
    Add[i].style.display = "none";
  }
  Weekbtn.style.backgroundColor = "#3A4F50";
  Weekbtn.style.color = "#0EF6CC";
  Allbtn.style.backgroundColor = "#fafafa";
  Allbtn.style.color = "black";
  Detailbtn.style.backgroundColor = "#fafafa";
  Detailbtn.style.color = "black";
  Detailbtn.style.display = "block";
  Addbtn.style.backgroundColor = "#fafafa";
  Addbtn.style.color = "black";
}

Detailbtn.onclick = function () {
  Earlydata = 0;
  Ontimedata = 0;
  Latedata = 0;
  Timeoutdata = 0;
  currentIndex = 0
  firebase.database().ref("Choose User").update({
    UserID: "1"
  })
  Showdetail();
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "none";
  }
  for (var i = 0; i < Detail.length; i++) {
    Detail[i].style.display = "block";
  }
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "none";
  }
  for (var i = 0; i < Add.length; i++) {
    Add[i].style.display = "none";
  }
  Detailbtn.style.display = "none";
  left.style.display = "none";
  Weekbtn.style.backgroundColor = "#fafafa";
  Weekbtn.style.color = "black";
  Allbtn.style.backgroundColor = "#fafafa";
  Allbtn.style.color = "black";
  Addbtn.style.backgroundColor = "#fafafa";
  Addbtn.style.color = "black";
}

Search.onclick = function () {
  Swal.fire({
    title: 'Please enter UserID you want to find!',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (text) => {
      return firebase.database().ref("UserID").child(text).once("value", function (snapshot) {
        if (snapshot.exists()) {
          firebase.database().ref("Choose User").update({
            UserID: text
          })
        } else {
          Swal.fire(
            "",
            "User doesn't exit!",
            "error"
          );

        }
      }).then(() => {
        Showdetail();
        Detailbtn.style.display = "none";
        firebase.database().ref('UserID').on('value', function (AllRecords) {
          var records = [];
          AllRecords.forEach(function (CurrentRecord) {
            var UserID = CurrentRecord.key;
            records.push(UserID);
          });
          for (var i = 0; i < records.length; i++) {
            if (text == records[i]) {
              currentIndex = i;
              if (currentIndex == 0) {
                left.style.display = "none";
                right.style.display = "block";
              }
              if (currentIndex == records.length - 1) {
                right.style.display = "none";
                left.style.display = "block";
              }
              break;
            }
          }
        });
      })
    }
  })
};

firebase.database().ref('UserID').on('value', function (AllRecords) {
  var records = [];
  AllRecords.forEach(function (CurrentRecord) {
    var UserID = CurrentRecord.key;
    records.push(UserID);
  });

  right.onclick = function () {
    Earlydata = 0;
    Ontimedata = 0;
    Latedata = 0;
    Timeoutdata = 0;
    if (currentIndex < records.length - 1) {
      currentIndex++;
      firebase.database().ref("Choose User").update({
        UserID: records[currentIndex]
      });
      Showdetail();
      if (currentIndex == records.length - 1) {
        right.style.display = "none";
      }
      left.style.display = "block";
    }
  };

  left.onclick = function () {
    Earlydata = 0;
    Ontimedata = 0;
    Latedata = 0;
    Timeoutdata = 0;
    if (currentIndex > 0) {
      currentIndex--;
      firebase.database().ref("Choose User").update({
        UserID: records[currentIndex]
      });
      Showdetail();
      if (currentIndex == 0) {
        left.style.display = "none";
      }
      right.style.display = "block";
    }
  };
});

Addbtn.onclick = function () {
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "none";
  }
  for (var i = 0; i < Add.length; i++) {
    Add[i].style.display = "block";
  }
  Addnew.style.display = "block";
  Changedata.style.display = "none";
  inputUID.style.display = "flex";
  UID.style.display = "none";
  for (var i = 0; i < Detail.length; i++) {
    Detail[i].style.display = "none";
  }
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "none";
  }
  Allbtn.style.backgroundColor = "#fafafa";
  Allbtn.style.color = "black";
  Detailbtn.style.display = "none";
  Weekbtn.style.backgroundColor = "#fafafa";
  Weekbtn.style.color = "black";

  resetInputFields();

  firebase.database().ref("/New User").once("value", function (snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      var Webmode = snapshot.val();
      UID.innerHTML = Webmode["UserID"];
    }
  });
}

Addbtn.onmouseenter = function () {
  Addbtn.style.backgroundColor = "green";
  Addbtn.style.color = "#fafafa";
}

Addbtn.onmouseleave = function () {
  Addbtn.style.backgroundColor = "#fafafa";
  Addbtn.style.color = "black";
}

Changebtn.onclick = function () {
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "none";
  }
  for (var i = 0; i < Add.length; i++) {
    Add[i].style.display = "block";
  }
  Addnew.style.display = "none";
  Changedata.style.display = "block";
  inputUID.style.display = "none";
  UID.style.display = "flex";
  for (var i = 0; i < Detail.length; i++) {
    Detail[i].style.display = "none";
  }
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "none";
  }
  Detailbtn.style.display = "none";

  firebase.database().ref("Choose User").once("value", function (snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      var Webmode = snapshot.val();
      UID.innerHTML = Webmode["UserID"];
      firebase.database().ref("UserID").child(Webmode["UserID"]).once("value", function (snapshot) {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          var Web = snapshot.val();
          fileInput.value = "";
          inputName.value = Web["Name"];
          inputPhone.value = Web["Phone"];
          var parts = Web["Birth"].split('/');
          var birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
          var formattedBirthDate = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
          inputBirth.value = formattedBirthDate;
          var genderInputs = document.querySelectorAll(".Gender");
          for (var i = 0; i < genderInputs.length; i++) {
            if (genderInputs[i].value === Web["Gender"]) {
              genderInputs[i].checked = true;
              break;
            }
          }
          firebase.storage().ref().child(Webmode["UserID"]).getDownloadURL().then((downloadURL) => {
            console.log(downloadURL);
            const image = document.createElement("img");
            image.src = downloadURL;
            image.style.width = "100%";
            image.style.height = "100%";
            imageContainer.innerHTML = "";
            imageContainer.appendChild(image);
          })
        }
      })
    }
  });
}

Changebtn.onmouseenter = function () {
  Changebtn.style.backgroundColor = "green";
  Changebtn.style.color = "#fafafa";
}

Changebtn.onmouseleave = function () {
  Changebtn.style.backgroundColor = "#fafafa";
  Changebtn.style.color = "black";
}
// "------------------------------------------------Button-----------------------------------------------------------"

// -----------------------------------------------ADD/Change---------------------------------------------------------
function resetInputFields() {
  fileInput.value = "";
  imageContainer.innerHTML = "";
  inputUID.value = "";
  inputName.value = "";
  inputBirth.value = "";
  inputPhone.value = "";
  for (const option of inputGenderOptions) {
    if (option.checked) {
      option.checked = false;
    }
  }
}

Upload.onclick = function () {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const image = document.createElement("img");
    image.src = reader.result;
    image.style.width = "100%"
    image.style.height = "100%"
    imageContainer.innerHTML = "";
    imageContainer.appendChild(image);
    uploadedImage = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }

  document.getElementById("uploadForm").onsubmit = function (e) {
    e.preventDefault();
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
      var imageString = event.target.result.split(',')[1];
      sendBase64ToESP32(imageString);
    };

    reader.readAsDataURL(file);
  };

  function sendBase64ToESP32(base64Data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/base64data", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Base64 data sent to ESP32.");
      }
    };
    xhr.send("data=" + encodeURIComponent(base64Data));
  }
  if (Addnew.style.display == "block") {
    if (inputUID.value == "255") {
      Swal.fire(
        "",
        "Can't use ID 255!",
        "error"
      );
    } else {
      firebase.storage().ref(inputUID.value).put(file)
    }
  }
  if (Changedata.style.display == "block") {
    firebase.database().ref("Choose User").once("value", function (snapshot) {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        var Webmode = snapshot.val();
        firebase.storage().ref().child(Webmode["UserID"]).put(file)
      }
    })
  }
}

var NameUser = "";
var count = 0;
Submit.onclick = function () {
  if (Addnew.style.display == "block") {
    ADDNEW()
  }
  if (Changedata.style.display == "block") {
    CHANGE()
  }
}

function ADDNEW() {
  Swal.fire({
    title: 'Please enter password!',
    input: 'password',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
      return firebase.database().ref("/Login").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
          var Webmode = snapshot.val();
          const change = {
            Username: Webmode["User"],
            Password: password
          };
          return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Password = snapshot.val();
              if (Password["Password"] == change.Password) {
                const user = {
                  UserID: inputUID.value,
                  Name: inputName.value,
                  Gender: getSelectedGender(),
                  Birth: getFormattedBirth(),
                  Phone: inputPhone.value,
                }
                for (var i = user.Name.length - 1; i >= 0; i--) {
                  if (user.Name[i] == " ") {
                    count++;
                    NameUser = user.Name.substring(i + 1);
                  }
                  if (count == 2) {
                    count = 0;
                    break;
                  }
                }
                firebase.database().ref('ENROLL AND DELETE').child('ENROLL ID').update({
                  UserID: user.UserID,
                })
                setTimeout(() => {
                  firebase.database().ref('ENROLL AND DELETE').child('ENROLL NAME').update({
                    Name: NameUser,
                  })
                }, 1000);
                firebase.database().ref('UserID').child(user.UserID).set({
                  Name: user.Name,
                  Gender: user.Gender,
                  Birth: user.Birth,
                  Phone: user.Phone,
                  WeekDay: {
                    Mon: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Tue: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Wed: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Thu: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Fri: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Sat: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    },
                    Sun: {
                      Status: "",
                      Temp: "",
                      Time: ""
                    }
                  }
                })
                Swal.fire(
                  "",
                  "Add successful!",
                  "success"
                );
                for (var i = 0; i < All.length; i++) {
                  All[i].style.display = "block";
                }
                for (var i = 0; i < Add.length; i++) {
                  Add[i].style.display = "none";
                }
                Allbtn.style.backgroundColor = "#3A4F50";
                Allbtn.style.color = "#0EF6CC";
                Detailbtn.style.display = "block";
                if (rowCount1 > 10) {
                  Shortenall.style.display = "block";
                }
              } else {
                Swal.fire(
                  "",
                  "Add failed! Wrong password!",
                  "error"
                );
              }
            }
          })
        }
      }
      )
    }
  })
}

function CHANGE() {
  Swal.fire({
    title: 'Please enter password!',
    input: 'password',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
      return firebase.database().ref("/Login").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
          var Webmode = snapshot.val();
          const change = {
            Username: Webmode["User"],
            Password: password
          };
          return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Password = snapshot.val();
              if (Password["Password"] == change.Password) {
                firebase.database().ref("Choose User").once("value", function (snapshot) {
                  if (snapshot.exists()) {
                    console.log(snapshot.val());
                    var Webmode = snapshot.val();
                    const user = {
                      UserID: Webmode["UserID"],
                      Name: inputName.value,
                      Gender: getSelectedGender(),
                      Birth: getFormattedBirth(),
                      Phone: inputPhone.value,
                    }
                    firebase.database().ref('UserID').child(user.UserID).update({
                      Name: user.Name,
                      Gender: user.Gender,
                      Birth: user.Birth,
                      Phone: user.Phone,
                    })
                    Swal.fire(
                      "",
                      "Update successful!",
                      "success"
                    );
                    for (var i = 0; i < All.length; i++) {
                      All[i].style.display = "block";
                    }
                    for (var i = 0; i < Add.length; i++) {
                      Add[i].style.display = "none";
                    }
                    Allbtn.style.backgroundColor = "#3A4F50";
                    Allbtn.style.color = "#0EF6CC";
                    Detailbtn.style.display = "block";
                    Detailbtn.style.backgroundColor = "#fafafa";
                    Detailbtn.style.color = "black";
                  }
                })
              } else {
                Swal.fire(
                  "",
                  "Change failed! Wrong password!",
                  "error"
                );
              }
            }
          })
        }
      })
    }
  })
}

function getSelectedGender() {
  for (const option of inputGenderOptions) {
    if (option.checked) {
      return option.value;
    }
  }
  return null;
}

function getFormattedBirth() {
  const date = new Date(inputBirth.value);
  const day = date.getDate();
  const formattedDay = day < 10 ? "0" + day : day;
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? "0" + month : month;
  const year = date.getFullYear();
  return `${formattedDay}/${formattedMonth}/${year}`;
}
// -----------------------------------------------ADD/Change---------------------------------------------------------

// -------------------------------------------------Detail---------------------------------------------------------
function Showdetail() {
  firebase.database().ref("Choose User").once("value", function (snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      var Webmode = snapshot.val();
      Imageshow.innerHTML = "";
      firebase.database().ref("UserID").child(Webmode["UserID"]).once("value", function (snapshot) {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          var Web = snapshot.val();
          User.innerHTML = Webmode["UserID"];
          Name.innerHTML = Web["Name"]
          if (Web["Name"].length >= 20) {
            Name.style.fontSize = "80%";
          } else {
            Name.style.fontSize = "100%"
          }
          if (Web["Birth"] == "NaN/NaN/NaN") {
            Birth.innerHTML = ""
          } else {
            Birth.innerHTML = Web["Birth"]
          }
          if (Web["Gender"] == "") {
            Gender.innerHTML = ""
          } else {
            Gender.innerHTML = Web["Gender"]
          }
          Phone.innerHTML = Web["Phone"]
          firebase.database().ref("UserID").child(Webmode["UserID"]).child("WeekDay").on('value', function (AllRecords) {
            var table = document.getElementById("tbody3");
            var rowCounttable = table.rows.length;
            for (var i = rowCounttable - 1; i >= 0; i--) {
              table.deleteRow(i);
            }
            Earlydata = 0;
            Ontimedata = 0;
            Latedata = 0;
            Timeoutdata = 0;
            var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            var sortedRecords = [];
            weekdays.forEach(function (day) {
              AllRecords.forEach(function (CurentRecord) {
                if (CurentRecord.key === day) {
                  sortedRecords.push({ day: day, data: CurentRecord.val() });
                }
              });
            });
            sortedRecords.forEach(function (record) {
              var Day = record.day;
              var Time = record.data.Time;
              var Status = record.data.Status;
              var Temp = record.data.Temp;
              AddItems(Day, Time, Status, Temp);
            })
          })
        }
      })
      firebase.storage().ref().child(Webmode["UserID"]).getDownloadURL().then((downloadURL) => {
        console.log(downloadURL);
        const image = document.createElement("img");
        image.src = downloadURL;
        image.style.width = "100%";
        image.style.height = "100%";
        Imageshow.appendChild(image);
      })
    }
  })
}

function AddItems(Day, Time, Status, Temp) {
  var tbody = document.getElementById('tbody3');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  td1.innerHTML = Day;
  td2.innerHTML = Time;
  td3.innerHTML = Status;
  td4.innerHTML = Temp;
  if (Status == "Early") {
    Earlydata += 100;
  }
  if (Status == "Ontime") {
    Ontimedata += 100;
  }
  if (Status == "Late") {
    Latedata += 100;
  }
  if (Status == "Timeout") {
    Timeoutdata += 100;
  }
  if (Temp >= "37") {
    td1.style.backgroundColor = "red";
    td1.style.color = "#fafafa";
    td4.style.backgroundColor = "red";
    td4.style.color = "#fafafa";
  }
  Early.style.width = Earlydata + 'px';
  Ontime.style.width = Ontimedata + 'px';
  Late.style.width = Latedata + 'px';
  Timeout.style.width = Timeoutdata + 'px';
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  tbody.appendChild(trow);
}

deleteidbtn.onclick = function () {
  firebase.database().ref("Choose User").on("value", function (snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val())
      var Web = snapshot.val()
      firebase.database().ref("UserID").child(Web["UserID"]).on("value", function (snapshot) {
        if (snapshot.exists()) {
          console.log(snapshot.val())
          var UserID = snapshot.val()
          Swal.fire({
            title: 'Are you sure to delete user: ' + UserID["Name"] + '?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'Please enter password!',
                input: 'password',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                  return firebase.database().ref("/Login").once("value").then(function (snapshot) {
                    if (snapshot.exists()) {
                      var Webmode = snapshot.val();
                      const change = {
                        Username: Webmode["User"],
                        Password: password
                      };
                      return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                        if (snapshot.exists()) {
                          var Password = snapshot.val();
                          if (Password["Password"] == change.Password) {
                            firebase.database().ref('UserID').child(Web["UserID"]).remove();
                            firebase.storage().ref().child(Web["UserID"]).delete()
                            firebase.database().ref('ENROLL AND DELETE').child('DELETE').update({
                              UserID: Web["UserID"]
                            });
                            Swal.fire(
                              "",
                              "Delete successful",
                              "success"
                            );
                            firebase.database().ref("Choose User").update({
                              UserID: ""
                            })
                            for (var i = 0; i < All.length; i++) {
                              All[i].style.display = "block";
                            }
                            for (var i = 0; i < Detail.length; i++) {
                              Detail[i].style.display = "none";
                            }
                            Allbtn.style.backgroundColor = "#3A4F50";
                            Allbtn.style.color = "#0EF6CC"
                            Detailbtn.style.backgroundColor = "#fafafa";
                            Detailbtn.style.color = "black"
                          } else {
                            Swal.fire(
                              "",
                              "Delete failed! Wrong password!",
                              "error"
                            );
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      })
    }
  })
}
// -------------------------------------------------Detail---------------------------------------------------------

//----------------------------------------------Update data--------------------------------------------------------
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

firebase.database().ref("Current data").on("value", function (snapshot) {
  if (snapshot.exists()) {
    console.log(snapshot.val())
    var Webmode = snapshot.val()
    if (Webmode["Update"] == "Update") {
      firebase.database().ref("Current data").update({
        Update: "None"
      });
      firebase.database().ref('UserID').on('value', function (AllRecords) {
        AllRecords.forEach(function (CurentRecord) {
          var UserID = CurentRecord.key;
          firebase.database().ref("UserID").child(UserID).update({
            WeekDay: {
              Mon: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Tue: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Wed: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Thu: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Fri: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Sat: {
                Status: "",
                Temp: "",
                Time: ""
              },
              Sun: {
                Status: "",
                Temp: "",
                Time: ""
              }
            }
          });
        })
      })
    }
  }
})
//----------------------------------------------Update data--------------------------------------------------------

//---------------------------------------------Download data--------------------------------------------------------
Download.onclick = function () {
  Swal.fire({
    title: 'Please choose the data you want to download!',
    html: `
      <div>
        <input type="radio" id="option1" name="downloadOption" value="realtime" style="float: left; clear: both; margin-right: 10px; margin-top: 3px">
        <label for="option1" style="display: block; float: left;">1. Realtime datas</label>
      </div>
      <div>
        <input type="radio" id="option2" name="downloadOption" value="all" style="float: left; clear: both; margin-right: 10px; margin-top: 3px">
        <label for="option2" style="display: block; float: left;">2. All datas</label>
      </div>
      <div>
        <input type="radio" id="option3" name="downloadOption" value="full" style="float: left; clear: both; margin-right: 10px; margin-top: 3px">
        <label for="option3" style="display: block; float: left;">3. Full</label>
      </div>
    `,
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const radios = document.getElementsByName('downloadOption');
      let selectedValue;
      for (const radio of radios) {
        if (radio.checked) {
          selectedValue = radio.value;
          break;
        }
      }
      if (selectedValue === "realtime") {
        RTDownload();
        Swal.fire(
          "",
          "Download successful",
          "success"
        );
      }
      if (selectedValue === "all") {
        ALLDownload();
        firebase.database().ref("Current data").update({
          Update: "Update"
        })
        Swal.fire(
          "",
          "Download successful",
          "success"
        );
      }
      if (selectedValue === "full") {
        RTDownload();
        ALLDownload();
        firebase.database().ref("Current data").update({
          Update: "Update"
        })
        Swal.fire(
          "",
          "Download successful",
          "success"
        );
      }
    }
  })
}

function RTDownload() {
  firebase.database().ref('Workspace').once('value')
    .then(function (AllRecords) {
      deleteAllRows('tbody4')
      var records = [];
      AllRecords.forEach(function (CurentRecord) {
        records.push(CurentRecord);
      });
      records.reverse();
      return Promise.all(records.map(function (CurentRecord) {
        var Day = CurentRecord.key;
        return firebase.database().ref('Workspace').child(CurentRecord.key).once('value')
          .then(function (AllRecords) {
            var records = [];
            AllRecords.forEach(function (CurentRecord) {
              records.push(CurentRecord);
            });
            records.reverse();
            return Promise.all(records.map(function (CurentRecord) {
              var Time = CurentRecord.key;
              var userID = CurentRecord.val().UserID;
              var Status = CurentRecord.val().Status;
              var Temp = CurentRecord.val().Temp;
              AddItemsToRealtime(Day, Time, userID, Status, Temp);
            }));
          });
      }));
    }).then(function () {
      exportToExcel(table1, "Realtime.xlsx");
    })
  function AddItemsToRealtime(Day, Time, userID, Status, Temp) {
    var tbody = document.getElementById('tbody4');
    var trow = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    td1.innerHTML = Day;
    td2.innerHTML = Time;
    td3.innerHTML = userID;
    td4.innerHTML = Status;
    td5.innerHTML = Temp;
    if (Temp >= "37") {
      td1.style.backgroundColor = "red";
      td1.style.color = "#fafafa";
      td2.style.backgroundColor = "red";
      td2.style.color = "#fafafa";
      td3.style.backgroundColor = "red";
      td3.style.color = "#fafafa";
      td4.style.backgroundColor = "red";
      td4.style.color = "#fafafa";
      td5.style.backgroundColor = "red";
      td5.style.color = "#fafafa";
    }
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    tbody.appendChild(trow);
  }
}

function ALLDownload() {
  firebase.database().ref('UserID').once('value', function (AllRecords) {
    deleteAllRows('tbody5')
    var records = [];
    AllRecords.forEach(function (CurentRecord) {
      records.push(CurentRecord);
    });
    records.reverse();
    return Promise.all(records.map(function (CurentRecord) {
      var UserID = CurentRecord.key;
      var Name = CurentRecord.child("Name").val();
      if (Name == null) {
        return Promise.resolve();
      }
      var Birth = CurentRecord.child("Birth").val();
      if (Birth == "NaN/NaN/NaN") {
        Birth = ""
      }
      var Gender = CurentRecord.child("Gender").val();
      var Phone = CurentRecord.child("Phone").val();
      var WeekDayObj = CurentRecord.child("WeekDay").val();
      var MonObj = WeekDayObj.Mon;
      var Mon = "Mon";
      var TimeMon = MonObj.Time;
      var StatusMon = MonObj.Status;
      var TempMon = MonObj.Temp;
      var TueObj = WeekDayObj.Tue;
      var Tue = "Tue";
      var TimeTue = TueObj.Time;
      var StatusTue = TueObj.Status;
      var TempTue = TueObj.Temp;
      var WedObj = WeekDayObj.Wed;
      var Wed = "Wed";
      var TimeWed = WedObj.Time;
      var StatusWed = WedObj.Status;
      var TempWed = WedObj.Temp;
      var ThuObj = WeekDayObj.Thu;
      var Thu = "Thu";
      var TimeThu = ThuObj.Time;
      var StatusThu = ThuObj.Status;
      var TempThu = ThuObj.Temp;
      var FriObj = WeekDayObj.Fri;
      var Fri = "Fri";
      var TimeFri = FriObj.Time;
      var StatusFri = FriObj.Status;
      var TempFri = FriObj.Temp;
      var SatObj = WeekDayObj.Sat;
      var Sat = "Sat";
      var TimeSat = SatObj.Time;
      var StatusSat = SatObj.Status;
      var TempSat = SatObj.Temp;
      var SunObj = WeekDayObj.Sun;
      var Sun = "Sun";
      var TimeSun = SunObj.Time;
      var StatusSun = SunObj.Status;
      var TempSun = SunObj.Temp;
      AddItemsToAll(UserID, Name, Birth, Gender, Phone, Mon, TimeMon, StatusMon, TempMon,
        Tue, TimeTue, StatusTue, TempTue, Wed, TimeWed, StatusWed, TempWed, Thu, TimeThu, StatusThu, TempThu,
        Fri, TimeFri, StatusFri, TempFri, Sat, TimeSat, StatusSat, TempSat, Sun, TimeSun, StatusSun, TempSun);
    }));
  }).then(function (results) {
    if (results) {
      exportToExcel(table2, "All.xlsx");
    }
  })

  function AddItemsToAll(UserID, Name, Birth, Gender, Phone, Mon, TimeMon, StatusMon, TempMon,
    Tue, TimeTue, StatusTue, TempTue, Wed, TimeWed, StatusWed, TempWed, Thu, TimeThu, StatusThu, TempThu,
    Fri, TimeFri, StatusFri, TempFri, Sat, TimeSat, StatusSat, TempSat, Sun, TimeSun, StatusSun, TempSun) {
    var tbody = document.getElementById('tbody5');
    var trow = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');
    var td10 = document.createElement('td');
    var td11 = document.createElement('td');
    var td12 = document.createElement('td');
    var td13 = document.createElement('td');
    var td14 = document.createElement('td');
    var td15 = document.createElement('td');
    var td16 = document.createElement('td');
    var td17 = document.createElement('td');
    var td18 = document.createElement('td');
    var td19 = document.createElement('td');
    var td20 = document.createElement('td');
    var td21 = document.createElement('td');
    var td22 = document.createElement('td');
    var td23 = document.createElement('td');
    var td24 = document.createElement('td');
    var td25 = document.createElement('td');
    var td26 = document.createElement('td');
    var td27 = document.createElement('td');
    var td28 = document.createElement('td');
    var td29 = document.createElement('td');
    var td30 = document.createElement('td');
    var td31 = document.createElement('td');
    var td32 = document.createElement('td');
    var td33 = document.createElement('td');
    td1.innerHTML = UserID
    td2.innerHTML = Name;
    td2.style.textAlign = "left";
    td3.innerHTML = Birth;
    td4.innerHTML = Gender;
    td5.innerHTML = Phone;
    td6.innerHTML = Mon;
    td7.innerHTML = TimeMon;
    td8.innerHTML = StatusMon;
    td9.innerHTML = TempMon;
    td10.innerHTML = Tue;
    td11.innerHTML = TimeTue;
    td12.innerHTML = StatusTue;
    td13.innerHTML = TempTue;
    td14.innerHTML = Wed;
    td15.innerHTML = TimeWed;
    td16.innerHTML = StatusWed;
    td17.innerHTML = TempWed;
    td18.innerHTML = Thu;
    td19.innerHTML = TimeThu;
    td20.innerHTML = StatusThu;
    td21.innerHTML = TempThu;
    td22.innerHTML = Fri;
    td23.innerHTML = TimeFri;
    td24.innerHTML = StatusFri;
    td25.innerHTML = TempFri;
    td26.innerHTML = Sat;
    td27.innerHTML = TimeSat;
    td28.innerHTML = StatusSat;
    td29.innerHTML = TempSat;
    td30.innerHTML = Sun;
    td31.innerHTML = TimeSun;
    td32.innerHTML = StatusSun;
    td33.innerHTML = TempSun;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);
    trow.appendChild(td8);
    trow.appendChild(td9);
    trow.appendChild(td10);
    trow.appendChild(td11);
    trow.appendChild(td12);
    trow.appendChild(td13);
    trow.appendChild(td14);
    trow.appendChild(td15);
    trow.appendChild(td16);
    trow.appendChild(td17);
    trow.appendChild(td18);
    trow.appendChild(td19);
    trow.appendChild(td20);
    trow.appendChild(td21);
    trow.appendChild(td22);
    trow.appendChild(td23);
    trow.appendChild(td24);
    trow.appendChild(td25);
    trow.appendChild(td26);
    trow.appendChild(td27);
    trow.appendChild(td28);
    trow.appendChild(td29);
    trow.appendChild(td30);
    trow.appendChild(td31);
    trow.appendChild(td32);
    trow.appendChild(td33);
    tbody.insertBefore(trow, tbody.firstChild);
  }
}

function exportToExcel(table, filename) {
  const ws = XLSX.utils.table_to_sheet(table);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const fileName = filename;
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

function deleteAllRows(tbody) {
  var tbody = document.getElementById(tbody);
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

