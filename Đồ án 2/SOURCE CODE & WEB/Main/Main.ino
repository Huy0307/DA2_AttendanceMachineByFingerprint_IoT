#include "functions.h"
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println(F("Connecting to WiFi..."));
  }
  Serial.println(WiFi.localIP());
  rtc.begin();
  // rtc.adjust(DateTime(2023, 8, 11, 16, 50, 20));
  now = rtc.now();
  mlx.begin();
  fingerprintSetup();
  Serial.print(F("done"));
  tft.begin();
  digitalWrite(33, HIGH);  // Touch controller chip select (if used)
  digitalWrite(15, HIGH);  // TFT screen chip select
  digitalWrite(5, HIGH);
  pinMode(sensorPin, INPUT);
  pinMode(buzzer, OUTPUT);
  digitalWrite(buzzer, LOW);
  pinMode(enPin, OUTPUT);
  digitalWrite(enPin, HIGH);
  Serial.print(F("done\n"));
  tft.init();
  touch_calibrate();
  tft.setRotation(0);
  tft.fillScreen(TFT_BLACK);
  customKeypad.begin(makeKeymap(keys));
  // Initialize RTC

  main_lcd();
  if (!SD.begin(5)) {
    Serial.println("Card Mount Failed");
    return;
  }
  uint8_t cardType = SD.cardType();

  if (cardType == CARD_NONE) {
    Serial.println("No SD card attached");
    return;
  }

  Serial.print("SD Card Type: ");
  if (cardType == CARD_MMC) {
    Serial.println(F("MMC"));
  } else if (cardType == CARD_SD) {
    Serial.println(F("SDSC"));
  } else if (cardType == CARD_SDHC) {
    Serial.println(F("SDHC"));
  } else {
    Serial.println(F("UNKNOWN"));
  }

  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %lluMB\n", cardSize);

  Serial.println(F("initialisation done."));
  configuration.api_key = API_KEY;
  configuration.database_url = DATABASE_URL;
  authentication.user.email = USER_EMAIL;
  authentication.user.password = USER_PASSWORD;
  configuration.token_status_callback = tokenStatusCallback;
  Firebase.begin(&configuration, &authentication);
  Firebase.reconnectWiFi(true);
  stream.keepAlive(5, 5, 1);
  if (!Firebase.RTDB.beginMultiPathStream(&stream, parentPath.c_str()))
    Serial.printf("sream begin error, %s\n\n", stream.errorReason().c_str());

  Firebase.RTDB.setMultiPathStreamCallback(&stream, streamCallback, streamTimeoutCallback);
  Serial.println(F("Getting User UID"));
  while ((authentication.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = authentication.token.uid.c_str();
  Serial.print(F("User UID: "));
  Serial.println(uid);
  Serial.print(F("done"));
  // Update database path
  web_server();
}
void loop() {
  DateTime now = rtc.now();
  char timestamp[19];
  char datestamp[19];
  sprintf(datestamp, "%02d-%02d", now.day(), now.month());
  sprintf(timestamp, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  switch (currentPage) {
    case 0: RTC_display(); break;
    case 1: Menu(); break;
    case 3: function(); break;
  }
  getID_FB_DEL();
  getID_FB_ENR();
  if (!stream.httpConnected()) {
    // Server was disconnected!
  }
  // After calling stream.keepAlive, now we can track the server connecting status
  readTemp();
  if (data.tempC != 0) {
    if (Firebase.ready()) {
      Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo2, "/Current data/Temp", data.tempC) ? "ok" : fbdo2.errorReason().c_str());
      Serial.printf("Set Date... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Date", String(datestamp)) ? "ok" : fbdo2.errorReason().c_str());
      Serial.printf("Set Time... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Time", String(timestamp)) ? "ok" : fbdo2.errorReason().c_str());
      Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", " ") ? "ok" : fbdo2.errorReason().c_str());
      Serial.printf("Set UserID... %s\n", Firebase.RTDB.setInt(&fbdo2, "/Current data/UserID", 0) ? "ok" : fbdo2.errorReason().c_str());
    }
    tft.fillScreen(TFT_BLACK);
    main_lcd();
    data.tempC = 0;
  }
  // if ((now.hour() >= 7 && now.hour() <= 10) || (now.hour() >= 16 && now.hour() < 18)) {
  getFingerprintID(data.finger_id, data.f);
  if (data.finger_id != 0) {
    Serial.println(data.finger_id);
    tft.fillScreen(TFT_BLACK);
    int x = 0;
    int y = 0;
    tft.drawFastVLine(0, 240, 80, TFT_BLUE);
    tft.drawFastVLine(238, 240, 80, TFT_BLUE);
    tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
      tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
    char result[12];  // Định nghĩa một mảng ký tự để chứa kết quả
    char path[30];
    char RTDBpath[60];
    convertToImageName(data.finger_id, result);
    Serial.println(result);    // In ra chuỗi kết quả
    drawSdJpeg(result, x, y);  // This draws a jpeg pulled off the SD Card
    readFiles(SD, "/DATA_HUMAN.csv");
    Serial.println(F("Data read from file:"));
    for (int i = 0; i < dataLength; i++) {
      Serial.write(dataBuffer[i]);
    }
    parseCSV(dataBuffer, dataLength, data.finger_id);
    Time();
    if (Firebase.ready()) {
      Serial.print(F("Uploading Photo... "));
      PathImgFB(data.finger_id, path);
      if (Firebase.Storage.upload(&fbdo1, STORAGE_BUCKET_ID, result, mem_storage_type_sd, path, "image/jpg")) {
        Serial.printf("\nDownload URL: %s\n", fbdo1.downloadURL().c_str());
      } else {
        Serial.println(fbdo1.errorReason());
      }
      if (data.finger_id != 0) {
        if (Firebase.ready()) {
          Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo2, "/Current data/Temp", 0) ? "ok" : fbdo2.errorReason().c_str());
          Serial.printf("Set Date... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Date", String(datestamp)) ? "ok" : fbdo2.errorReason().c_str());
          Serial.printf("Set Time... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Time", String(timestamp)) ? "ok" : fbdo2.errorReason().c_str());
          Serial.printf("Set UserID... %s\n", Firebase.RTDB.setInt(&fbdo2, "/Current data/UserID", data.finger_id) ? "ok" : fbdo2.errorReason().c_str());
        }
        if (data.e == 1 && data.checkin == 1) {
          if (Firebase.ready()) {
            Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", "Early") ? "ok" : fbdo2.errorReason().c_str());
          }
        } else if (data.o == 1 && data.checkin == 1) {
          if (Firebase.ready()) {
            Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", "OnTime") ? "ok" : fbdo2.errorReason().c_str());
          }
        } else if (data.l == 1 && data.checkin == 1) {
          if (Firebase.ready()) {
            Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", "Late") ? "ok" : fbdo2.errorReason().c_str());
          }
        } else if (data.to == 1) {
          if (Firebase.ready()) {
            Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", "Timeout") ? "ok" : fbdo2.errorReason().c_str());
          }
        } else if (data.checkout == 1 && data.success == 1) {
          if (Firebase.ready()) {
            Serial.printf("Set Status... %s\n", Firebase.RTDB.setString(&fbdo2, "/Current data/Status", "Checkout") ? "ok" : fbdo2.errorReason().c_str());
          }
        }
      }
    }
    SDcard();
    data.finger_id = 0;
    data.e = 0;
    data.o = 0;
    data.l = 0;
    data.to = 0;
    data.checkin = 0;
    data.checkout = 0;
    data.success = 0;
    delay_millis(1000);
    tft.fillScreen(TFT_BLACK);
    main_lcd();
  }
  if (data.f == 0) {
    tft.fillScreen(TFT_LIGHTGREY);
    tft.drawFastVLine(0, 240, 80, TFT_BLUE);
    tft.drawFastVLine(238, 240, 80, TFT_BLUE);
    tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
      tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
    drawSdJpeg("/finger_dont_know.jpg", x, y);
    tft.setTextSize(2);
    tft.setTextColor(TFT_BLUE);
    tft.setCursor(40, 280);
    tft.print("NOT FOUND!!!");
    delay_millis(1000);
    tft.fillScreen(TFT_BLACK);
    main_lcd();
    data.f = 2;
  }
}
