#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

const char *ssid = "BAD_Group";
const char *password = "deocodau";

AsyncWebServer webServer(80);

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Route to handle GET requests and serve the HTML page
  webServer.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    handleRoot(request);  // Pass the request object to the handler
  });

  // Route to handle POST requests and receive the base64 data
  webServer.on("/base64data", HTTP_POST, [](AsyncWebServerRequest *request) {
    handleBase64Data(request);  // Pass the request object to the handler
  });

  webServer.begin();
}

void loop() {
  // webServer.handleClient();
}

void handleRoot(AsyncWebServerRequest *request) {
  String htmlPage = R"html(
      <!DOCTYPE html>
      <html>
      <head>
          <title>Image to Base64</title>
      </head>
      <body>

      <h2>Upload an image:</h2>
      <form method="post" enctype="multipart/form-data" id="uploadForm">
          <input type="file" name="image" id="imageInput">
          <input type="submit" value="Upload" id="submitButton">
      </form>

      <script>
          document.getElementById("uploadForm").onsubmit = function (e) {
              e.preventDefault();
              var fileInput = document.getElementById('imageInput');
              var file = fileInput.files[0];
              var reader = new FileReader();

              reader.onload = function (event) {
                  var imageString = event.target.result.split(',')[1]; // Lấy phần base64 sau dấu phẩy
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
      </script>

      </body>
      </html>
    )html";
  request->send(200, "text/html", htmlPage);
}

void handleBase64Data(AsyncWebServerRequest *request) {
  if (request->hasArg("data")) {
    String imageString = request->arg("data");
    Serial.println("Base64 Image Data:");
    Serial.println(imageString);

    request->send(200, "text/plain", "Base64 data received successfully.");
  } else {
    request->send(400, "text/plain", "No data received.");
  }
}
