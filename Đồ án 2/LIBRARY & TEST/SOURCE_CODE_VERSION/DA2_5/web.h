#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "FS.h"
#include <SPI.h>
#include <SD.h>
extern "C" {
#include "crypto/base64.h"
}
struct Data {
  float tempC = 0;
  int FingerID = 0;
  uint8_t id = 0;
  uint8_t id_enr = 255;
  uint8_t id_del = 255;
  uint8_t finger_id = 0;
  int mode = 2;
  byte to = 0;
  byte e = 0;
  byte l = 0;
  byte f = 2;
  byte o = 0;
  int pass;
  int late_minutes;
  byte s;
  byte checkin = 0;
  byte checkout = 0;
  byte success = 0;
};
Data data;
AsyncWebServer server(80);
void serveHTML(String path, String contentType) {
  server.on("/", HTTP_GET, [path](AsyncWebServerRequest *request) {  // Thêm [path] vào đây
    request->send(SD, path, "text/html");                            // Sử dụng biến path thay vì request->url()
  });
}
void convertToImageName(uint8_t finger_id, char *result) {
  char imageName[10];  // Định nghĩa một mảng ký tự có độ dài đủ để chứa chuỗi "/id.jpg"

  itoa(finger_id, imageName, 10);  // Chuyển đổi số nguyên thành chuỗi ký tự

  // Nếu bạn muốn thêm dấu '/' vào đầu chuỗi
  char finalName[30];  // Định nghĩa một mảng ký tự có độ dài đủ để chứa chuỗi "/id.jpg" và ký tự kết thúc chuỗi ('\0')
  finalName[0] = '/';
  strcpy(finalName + 1, imageName);  // Sao chép chuỗi imageName vào sau ký tự '/'
  strcat(finalName, ".jpg");         // Nối chuỗi ".jpg" vào cuối

  strcpy(result, finalName);  // Sao chép chuỗi finalName vào biến tham chiếu 'result'
}
void serveCSS(String path, String contentType) {
  server.on("/", HTTP_GET, [path](AsyncWebServerRequest *request) {  // Thêm [path] vào đây
    request->send(SD, path, "text/css");                             // Sử dụng biến path thay vì request->url()
  });
}

void serveJS(String path, String contentType) {
  server.on("/", HTTP_GET, [path](AsyncWebServerRequest *request) {  // Thêm [path] vào đây
    request->send(SD, path, "application/javascript");               // Sử dụng biến path thay vì request->url()
  });
}

void serveImage(String path, String contentType) {
  server.on("/", HTTP_GET, [path](AsyncWebServerRequest *request) {  // Thêm [path] vào đây
    request->send(SD, path, "image/jpeg");                           // Sử dụng biến path thay vì request->url()
  });
}

void serveImage_png(String path, String contentType) {
  server.on("/", HTTP_GET, [path](AsyncWebServerRequest *request) {  // Thêm [path] vào đây
    request->send(SD, path, "image/png");                            // Sử dụng biến path thay vì request->url()
  });
}

void handleBase64Data(AsyncWebServerRequest *request) {
  if (request->hasArg("data")) {
    String imageString = request->arg("data");
    Serial.println("Base64 Image Data:");
    Serial.println(imageString);

    size_t outputLength;
    unsigned char *decoded = base64_decode((const unsigned char *)imageString.c_str(), imageString.length(), &outputLength);

    Serial.print("Length of decoded message: ");
    Serial.println(outputLength);

    char result[30];  // Định nghĩa một mảng ký tự để chứa kết quả
    convertToImageName(data.id_enr, result);
    Serial.println(result);  // In ra chuỗi kết quả
    File file = SD.open(result, FILE_WRITE);
    if (file) {
      file.write(decoded, outputLength);
      file.close();
      Serial.println("File has been written to the SD card.");
    } else {
      Serial.println("Error opening the file for writing.");
    }
    free(decoded);
    request->send(200, "text/plain", "Base64 data received successfully.");
  } else {
    request->send(400, "text/plain", "No data received.");
  }
}
void web_server() {
  // Serve HTML files
  serveHTML("/index.html", "text/html");
  serveHTML("/Change.html", "text/html");
  serveHTML("/Login.html", "text/html");
  serveHTML("/Signup.html", "text/html");
  serveHTML("/Support.html", "text/html");
  serveHTML("/Workspace.html", "text/html");

  // Serve CSS files
  serveCSS("/Home", "text/css");
  serveCSS("/Style.css", "text/css");
  serveCSS("/Support.css", "text/css");
  serveCSS("/Workspace.css", "text/css");

  // Serve JS files
  // serveJS("/Bar.js", "application/javascript");
  serveJS("/Change.js", "application/javascript");
  serveJS("/Home.js", "application/javascript");
  serveJS("/Login.js", "application/javascript");
  serveJS("/Signup.js", "application/javascript");
  serveJS("/Workspace.js", "application/javascript");
  server.on("/base64data", HTTP_POST, [](AsyncWebServerRequest *request) {
    handleBase64Data(request);  // Pass the request object to the handler
  });
  // Serve images from "/img/Icon" folder
  serveImage_png("/img/Icon/edit.png", "image/png");
  serveImage_png("/img/Icon/github.png", "image/png");
  serveImage_png("/img/Icon/info.png", "image/png");
  serveImage_png("/img/Icon/key.png", "image/png");
  serveImage_png("/img/Icon/Light_github.png", "image/png");
  serveImage_png("/img/Icon/login.png", "image/png");
  serveImage_png("/img/Icon/project_management.png", "image/png");
  serveImage_png("/img/Icon/workspace.png", "image/png");

  // Serve images from "/img/Background" folder
  serveImage("/img/Background/images.jpg", "image/jpeg");
  serveImage("/img/Background/bg.png", "image/png");
  serveImage_png("/img/Background/IOT_bg.png", "image/png");
  serveImage_png("/img/Background/spkt.png", "image/png");

  // Serve images from "/img/Profile" folder
  serveImage("/img/Profile/PNM.jpg", "image/jpeg");
  serveImage_png("/img/Profile/ĐNMH.png", "image/png");
  server.serveStatic("/", SD, "/");
  server.begin();
}
