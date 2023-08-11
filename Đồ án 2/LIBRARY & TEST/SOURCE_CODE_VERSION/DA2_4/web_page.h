#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
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
