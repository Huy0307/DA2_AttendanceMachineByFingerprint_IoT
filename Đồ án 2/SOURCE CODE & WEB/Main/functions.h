#include "web.h"
void delay_millis(unsigned long ms) {
  unsigned long current_time = millis();  // Lấy thời điểm hiện tại
  while (millis() - current_time < ms) {  // Kiểm tra nếu thời gian chạy đã vượt quá khoảng thời gian cần delay
    // Chờ
  }
}
void Menu() {
  // Setup menu button
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_CYAN);
  tft.setTextSize(BUTTON_TEXT_SIZE);
  tft.setTextDatum(MC_DATUM);
  tft.drawFastHLine(0, 60, tft.width(), TFT_CYAN);
  tft.drawString("MENU", 120, 35);
  tft.fillRoundRect(5, 15, 50, 40, 5, TFT_CYAN);
  tft.setTextColor(TFT_BLACK);
  tft.setTextSize(BUTTON_TEXT_SIZE);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("<==", 30, 35);
  tft.fillRoundRect(0, 75, tft.width(), 40, 5, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(BUTTON_TEXT_SIZE);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("ENROLL", 120, 95);
  tft.fillRoundRect(0, 135, tft.width(), 40, 5, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("DELETE", 120, 155);
  tft.fillRoundRect(0, 195, tft.width(), 40, 5, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("LIST", 120, 215);
  while (currentPage == 1) {
    pressed = tft.getTouch(&x, &y);
    if (pressed && x > 5 && x < 55 && y > 15 && y < 40) {
      tft.fillRoundRect(5, 15, 50, 40, 5, TFT_RED);
      tft.setTextColor(TFT_BLACK);
      tft.setTextSize(BUTTON_TEXT_SIZE);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("<==", 30, 35);
      delay_millis(200);
      currentPage = 0;
      main = 1;
    }
    if (pressed && x > 0 && x < tft.width() && y > 75 && y < 115) {
      tft.fillRoundRect(0, 75, tft.width(), 40, 5, TFT_GREEN);
      tft.setTextColor(TFT_WHITE);
      tft.setTextSize(BUTTON_TEXT_SIZE);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("ENROLL", 120, 95);
      delay_millis(200);
      menu = 1;
      currentPage = 3;
    }
    if (pressed && x > 0 && x < tft.width() && y > 135 && y < 175) {
      tft.fillRoundRect(0, 135, tft.width(), 40, 5, TFT_GREEN);
      tft.setTextColor(TFT_WHITE);
      tft.setTextSize(2);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("DELETE", 120, 155);
      delay_millis(200);
      menu = 2;
      currentPage = 3;
    }
    if (pressed && x > 0 && x < tft.width() && y > 195 && y < 235) {
      tft.fillRoundRect(0, 195, tft.width(), 40, 5, TFT_GREEN);
      tft.setTextColor(TFT_WHITE);
      tft.setTextSize(2);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("LIST", 120, 215);
      delay_millis(200);
      menu = 3;
      currentPage = 3;
    }
    delay(100);
  }
}
void displayDayOfWeek() {
  char dow_matrix[7][12] = { "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY" };
  byte x_pos[7] = { 50, 50, 38, 14, 26, 50, 26 };
  static byte previous_dow = 8;
  // print day of the week
  tft.setTextSize(4);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);     // set text color to cyan and black background
  tft.fillRect(14, 72, 216, 28, TFT_BLACK);  // draw rectangle (erase day from the display)
  tft.setCursor(x_pos[now.dayOfTheWeek()], 72);
  tft.print(dow_matrix[now.dayOfTheWeek()]);
  Serial.println(dow_matrix[now.dayOfTheWeek()]);
}
unsigned long readPass() {
  unsigned long startTime = millis();
  String passString;
  unsigned long num = 0;
  bool keyPressed = false;
  while (num == 0 && millis() - startTime < 7000) {
    key = customKeypad.getKey();
    if (key != NO_KEY) {  // Kiểm tra xem có sự kiện nhấn nút mới không
      keyPressed = true;
      if (key >= '0' && key <= '9') {
        passString += key;
        Serial.println(key);
        tft.setTextSize(2);
        tft.setTextDatum(MC_DATUM);
        tft.setCursor(70 + (passString.length() - 1) * 20, 200);
        tft.print("*");
      } else if (key == '#') {
        if (passString.length() > 0) {
          num = passString.toInt();
          Serial.println(num);
        }
      } else if (key == '*') {
        if (passString.length() > 0) {
          passString.remove(passString.length() - 1);
          Serial.println(passString);
          tft.fillRect(65, 200 - 5, 115, 25, TFT_WHITE);
          for (int i = passString.length() - 1; i >= 0; i--) {
            tft.setTextSize(2);
            tft.setTextDatum(MC_DATUM);
            tft.setCursor(70 + i * 20, 200);
            tft.print("*");
          }
        }
      }
    }
    if (keyPressed) {
      startTime = millis();
      keyPressed = false;
    }
    pressed = tft.getTouch(&x, &y);
    if (pressed && x > 5 && x < 55 && y > 15 && y < 40) {
      tft.fillRoundRect(5, 15, 50, 40, 5, TFT_CYAN);
      tft.setTextColor(TFT_WHITE);
      tft.setTextSize(BUTTON_TEXT_SIZE);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("<==", 30, 35);
      delay_millis(200);
      currentPage = 1;
      menu = 0;
      num = 255;
      Menu();
    }
    delay(100);
  }
  if (num == 255) {
    return 255;
  } else {
    return num;
  }
}
unsigned long readNumber() {
  unsigned long startTime = millis();
  String inputString;
  unsigned long num = 0;
  bool keyPressed = false;
  while (num == 0 && millis() - startTime < 7000) {
    key = customKeypad.getKey();
    if (key != NO_KEY) {  // Kiểm tra xem có sự kiện nhấn nút mới không
      keyPressed = true;
      if (key >= '0' && key <= '9') {
        inputString += key;
        int x = inputString.toInt();
        Serial.println(key);
        tft.setTextSize(2);
        tft.setTextDatum(MC_DATUM);
        tft.setCursor(90, 200);
        tft.print(inputString);
      } else if (key == '#') {
        if (inputString.length() > 0) {
          num = inputString.toInt();
          Serial.println(num);
        }
      } else if (key == '*') {
        if (inputString.length() > 0) {
          inputString.remove(inputString.length() - 1);
          Serial.println(inputString);
          tft.fillRect(85, 200 - 5, 125, 25, TFT_WHITE);
          for (int i = inputString.length() - 1; i >= 0; i--) {
            tft.setTextSize(2);
            tft.setTextDatum(MC_DATUM);
            tft.setCursor(90, 200);
            tft.print(inputString);
          }
        }
      }
    }
    if (keyPressed) {
      startTime = millis();
      keyPressed = false;
    }
  }
  if (num == 0) {
    return 255;
  } else {
    return num;
  }
}
void fingerprintSetup() {
  unsigned long currentMillis = millis();
  // pinMode(buttonPin, INPUT_PULLUP);  // Cấu hình chân nút bấm là INPUT_PULLUP để tránh nhiễu
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println(F("Sensor Ready"));
  } else {
    Serial.println(F("Sensor not found"));
    while (1) {
      delay(1);
      Serial.println(F("Sensor not found"));
    }
  }
}
int extractNumberFromJson(const char *jsonString) {
  // Định nghĩa bộ nhớ đệm để lưu trữ dữ liệu từ JSON
  StaticJsonDocument<200> doc;

  // Phân tích chuỗi JSON
  DeserializationError error = deserializeJson(doc, jsonString);

  // Kiểm tra lỗi
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return 0;  // Hoặc giá trị mặc định nếu xử lý lỗi
  }

  // Lấy giá trị của trường "UserID"
  const char *userId = doc["UserID"];

  // Chuyển đổi chuỗi sang số nguyên
  int userIdInt = atoi(userId);

  return userIdInt;
}
String extractNameFromJson(const char *jsonString) {
  // Định nghĩa bộ nhớ đệm để lưu trữ dữ liệu từ JSON
  StaticJsonDocument<200> doc;

  // Phân tích chuỗi JSON
  DeserializationError error = deserializeJson(doc, jsonString);

  // Kiểm tra lỗi
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return "";  // Hoặc giá trị mặc định nếu xử lý lỗi
  }

  // Lấy giá trị của trường "Name"
  const char *name = doc["Name"];

  return String(name);
}
void streamCallback(MultiPathStream stream) {
  size_t numChild = sizeof(childPath) / sizeof(childPath[0]);

  for (size_t i = 0; i < numChild; i++) {
    if (stream.get(childPath[i])) {
      Serial.println("Stream ");
      Serial.println(stream.get(childPath[i]));
      Serial.println();
      Serial.printf("path: %s, event: %s, type: %s, value: %s", stream.dataPath.c_str(), stream.eventType.c_str(), stream.type.c_str(), stream.value.c_str());
      if (stream.dataPath == "/ENROLL ID") {
        Serial.println("Connection!!");
        data.id_enr = extractNumberFromJson(stream.value.c_str());
        Serial.println(data.id_enr);
      }
      if (stream.dataPath == "/ENROLL NAME") {
        Serial.println(F("Connection!!"));
        Name = extractNameFromJson(stream.value.c_str());
        Serial.println(Name);
      }
      if (stream.dataPath == "/DELETE") {
        Serial.println("Connection!!");
        data.id_del = extractNumberFromJson(stream.value.c_str());
        Serial.println(data.id_del);
      }
    }
  }
  Serial.println();
  Serial.printf("Received stream payload size: %d (Max. %d)\n\n", stream.payloadLength(), stream.maxPayloadLength());
}
void streamTimeoutCallback(bool timeout) {
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream.httpCode(), stream.errorReason().c_str());
}
void main_lcd() {
  tft.drawFastVLine(0, 0, 320, TFT_BLUE);
  tft.drawFastVLine(238, 0, 320, TFT_BLUE);
  tft.drawFastHLine(0, 0, 240, TFT_BLUE);
  tft.drawFastHLine(0, 318, 240, TFT_BLUE);
  tft.fillRect(0, 150, tft.width(), 2, TFT_BLUE);
  tft.fillRect(0, 59, tft.width(), 2, TFT_BLUE);
  tft.fillRect(0, 150, tft.width(), 2, TFT_BLUE);
  tft.setTextWrap(false);                  // turn off text wrap option
  tft.setTextColor(TFT_WHITE, TFT_BLACK);  // set text color to white and black background
  tft.setTextSize(2);                      // text size = 2
  tft.setCursor(15, 10);                   // move cursor to position (0, 10) pixel
  tft.print("ATTENDANCE MACHINE");
  tft.setTextSize(4);  // text size = 4
  tft.setTextColor(TFT_MAGENTA, TFT_BLACK);
  tft.setCursor(64, 163);
  tft.print("TIME");
  displayDayOfWeek();
  // Setup menu button
  tft.fillRect(BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_COLOR);
  tft.setTextColor(BUTTON_TEXT_COLOR);
  tft.setTextSize(BUTTON_TEXT_SIZE);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("MENU", BUTTON_X + BUTTON_WIDTH / 2, BUTTON_Y + BUTTON_HEIGHT / 2);
}
void RTC_display() {
  if (main == 1) {
    tft.fillScreen(TFT_BLACK);
    main_lcd();
    main = 0;
  }
  now = rtc.now();  // read current time and date from the RTC chip
  tft.setTextSize(4);
  // print date
  tft.setCursor(1, 111);
  tft.setTextColor(TFT_YELLOW, TFT_BLACK);  // set text color to yellow and black background
  tft.printf("%02u-%02u-%04u", now.day() % 100, now.month() % 100, now.year());

  // print time
  tft.setCursor(26, 202);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);  // set text color to green and black background
  tft.printf("%02u:%02u:%02u", now.hour() % 100, now.minute() % 100, now.second() % 100);
  if (currentPage == 0) {
    pressed = tft.getTouch(&x, &y);
    if (pressed && x > BUTTON_X && x < BUTTON_X + BUTTON_WIDTH && y > BUTTON_Y && y < BUTTON_Y + BUTTON_HEIGHT) {
      tft.fillRect(BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, TFT_GREEN);
      tft.setTextColor(BUTTON_TEXT_COLOR);
      tft.setTextSize(BUTTON_TEXT_SIZE);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("MENU", BUTTON_X + BUTTON_WIDTH / 2, BUTTON_Y + BUTTON_HEIGHT / 2);
      currentPage = 1;
    }
    delay_millis(100);
  }
}
void showTime(uint32_t msTime) {
  //tft.setCursor(0, 0);
  //tft.setTextFont(1);
  //tft.setTextSize(2);
  //tft.setTextColor(TFT_WHITE, TFT_BLACK);
  //tft.print(F(" JPEG drawn in "));
  //tft.print(msTime);
  //tft.println(F(" ms "));
  Serial.print(F(" JPEG drawn in "));
  Serial.print(msTime);
  Serial.println(F(" ms "));
}
void jpegRender(int xpos, int ypos) {

  //jpegInfo(); // Print information from the JPEG file (could comment this line out)

  uint16_t *pImg;
  uint16_t mcu_w = JpegDec.MCUWidth;
  uint16_t mcu_h = JpegDec.MCUHeight;
  uint32_t max_x = JpegDec.width;
  uint32_t max_y = JpegDec.height;

  bool swapBytes = tft.getSwapBytes();
  tft.setSwapBytes(true);

  // Jpeg images are draw as a set of image block (tiles) called Minimum Coding Units (MCUs)
  // Typically these MCUs are 16x16 pixel blocks
  // Determine the width and height of the right and bottom edge image blocks
  uint32_t min_w = jpg_min(mcu_w, max_x % mcu_w);
  uint32_t min_h = jpg_min(mcu_h, max_y % mcu_h);

  // save the current image block size
  uint32_t win_w = mcu_w;
  uint32_t win_h = mcu_h;

  // record the current time so we can measure how long it takes to draw an image
  uint32_t drawTime = millis();

  // save the coordinate of the right and bottom edges to assist image cropping
  // to the screen size
  max_x += xpos;
  max_y += ypos;

  // Fetch data from the file, decode and display
  while (JpegDec.read()) {  // While there is more data in the file
    pImg = JpegDec.pImage;  // Decode a MCU (Minimum Coding Unit, typically a 8x8 or 16x16 pixel block)

    // Calculate coordinates of top left corner of current MCU
    int mcu_x = JpegDec.MCUx * mcu_w + xpos;
    int mcu_y = JpegDec.MCUy * mcu_h + ypos;

    // check if the image block size needs to be changed for the right edge
    if (mcu_x + mcu_w <= max_x) win_w = mcu_w;
    else win_w = min_w;

    // check if the image block size needs to be changed for the bottom edge
    if (mcu_y + mcu_h <= max_y) win_h = mcu_h;
    else win_h = min_h;

    // copy pixels into a contiguous block
    if (win_w != mcu_w) {
      uint16_t *cImg;
      int p = 0;
      cImg = pImg + win_w;
      for (int h = 1; h < win_h; h++) {
        p += mcu_w;
        for (int w = 0; w < win_w; w++) {
          *cImg = *(pImg + w + p);
          cImg++;
        }
      }
    }

    // calculate how many pixels must be drawn
    uint32_t mcu_pixels = win_w * win_h;

    // draw image MCU block only if it will fit on the screen
    if ((mcu_x + win_w) <= tft.width() && (mcu_y + win_h) <= tft.height())
      tft.pushImage(mcu_x, mcu_y, win_w, win_h, pImg);
    else if ((mcu_y + win_h) >= tft.height())
      JpegDec.abort();  // Image has run off bottom of screen so abort decoding
  }

  tft.setSwapBytes(swapBytes);

  showTime(millis() - drawTime);  // These lines are for sketch testing only
}
void jpegInfo() {

  // Print information extracted from the JPEG file
  Serial.println("JPEG image info");
  Serial.println("===============");
  Serial.print(F("Width      :"));
  Serial.println(JpegDec.width);
  Serial.print(F("Height     :"));
  Serial.println(JpegDec.height);
  Serial.print(F("Components :"));
  Serial.println(JpegDec.comps);
  Serial.print(F("MCU / row  :"));
  Serial.println(JpegDec.MCUSPerRow);
  Serial.print(F("MCU / col  :"));
  Serial.println(JpegDec.MCUSPerCol);
  Serial.print(F("Scan type  :"));
  Serial.println(JpegDec.scanType);
  Serial.print(F("MCU width  :"));
  Serial.println(JpegDec.MCUWidth);
  Serial.print(F("MCU height :"));
  Serial.println(JpegDec.MCUHeight);
  Serial.println(F("==============="));
  Serial.println("");
}
void drawSdJpeg(const char *filename, int xpos, int ypos) {

  // Open the named file (the Jpeg decoder library will close it)
  File jpegFile = SD.open(filename, FILE_READ);  // or, file handle reference for SD library

  if (!jpegFile) {
    Serial.print("ERROR: File \"");
    Serial.print(filename);
    Serial.println("\" not found!");
    return;
  }

  Serial.println("===========================");
  Serial.print("Drawing file: ");
  Serial.println(filename);
  Serial.println("===========================");

  // Use one of the following methods to initialise the decoder:
  bool decoded = JpegDec.decodeSdFile(jpegFile);  // Pass the SD file handle to the decoder,
  //bool decoded = JpegDec.decodeSdFile(filename);  // or pass the filename (String or character array)

  if (decoded) {
    // print information about the image to the serial port
    jpegInfo();
    // render the image onto the screen at given coordinates
    jpegRender(xpos, ypos);
  } else {
    Serial.println("Jpeg file format not supported!");
  }
}
void readJPG(const char *filename) {
  // Open the named file (the Jpeg decoder library will close it)
  File jpegFile = SD.open(filename, FILE_READ);  // or, file handle reference for SD library

  if (!jpegFile) {
    Serial.print("ERROR: File \"");
    Serial.print(filename);
    Serial.println("\" not found!");
    return;
  }

  Serial.println("===========================");
  Serial.print("Drawing file: ");
  Serial.println(filename);
  Serial.println("===========================");
}
void renameJpgFile(const char* oldFileName, const char* newFileName) {
  if (SD.exists(oldFileName)) {
    if (SD.rename(oldFileName, newFileName)) {
      Serial.printf("File \"%s\" has been renamed to \"%s\"\n", oldFileName, newFileName);
    } else {
      Serial.println("Failed to rename the file!");
    }
  } else {
    Serial.println("File not found!");
  }
}
uint8_t getFingerprintEnroll(uint8_t &id, byte &s) {

  int p = -1;
  tft.fillScreen(TFT_LIGHTGREY);
  int x = 0;
  int y = 0;
  tft.drawFastVLine(0, 240, 80, TFT_BLUE);
  tft.drawFastVLine(238, 240, 80, TFT_BLUE);
  tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
    tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
  drawSdJpeg("/scan_finger.jpg", x, y);
  tft.setTextSize(2);
  tft.setTextColor(TFT_BLUE);
  tft.setCursor(35, 280);
  tft.print("PUSH FINGER!!!");
  Serial.print(F("Waiting for valid finger to enroll as #"));
  Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println(F("Image taken"));
        break;
      case FINGERPRINT_NOFINGER:
        Serial.println(F("."));
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        s = 0;
        break;
      case FINGERPRINT_IMAGEFAIL:
        s = 0;
        break;
      default:
        Serial.println(F("Error Occured!!"));
        s = 0;
        break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println(F("Image converted"));
      break;
    case FINGERPRINT_IMAGEMESS:
      s = 0;
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      s = 0;
      return p;
    case FINGERPRINT_FEATUREFAIL:
      s = 0;
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      s = 0;
      return p;
    default:
      Serial.println(F("Error Occured!!"));
      s = 0;
      return p;
  }
  tft.fillScreen(TFT_LIGHTGREY);
  tft.drawFastVLine(0, 240, 80, TFT_BLUE);
  tft.drawFastVLine(238, 240, 80, TFT_BLUE);
  tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
    tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
  drawSdJpeg("/remove_finger.jpg", x, y);
  tft.setTextSize(2);
  tft.setTextColor(TFT_BLUE);
  tft.setCursor(30, 280);
  tft.print("REMOVE FINGER!!!");
  Serial.println(F("Remove finger"));
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  p = -1;
  Serial.println(F("Place same finger again"));
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println(F("Image taken"));
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(F("."));
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        s = 0;
        break;
      case FINGERPRINT_IMAGEFAIL:
        s = 0;
        break;
      default:
        Serial.println(F("Error Occured!!"));
        s = 0;
        break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println(F("Image converted"));
      break;
    case FINGERPRINT_IMAGEMESS:
      s = 0;
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      s = 0;
      return p;
    case FINGERPRINT_FEATUREFAIL:
      s = 0;
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      s = 0;
      return p;
    default:
      Serial.println(F("Error Occured!!"));
      s = 0;
      return p;
  }

  // OK converted!
  Serial.print(F("Creating model for #"));
  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println(F("Prints matched!"));
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    s = 0;
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    s = 0;
    return p;
  } else {
    Serial.println(F("Error Occured!!"));
    s = 0;
    return p;
  }

  // Serial.print("ID ");
  // Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println(F("Stored!"));
    s = 1;
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    s = 0;
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    s = 0;
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    s = 0;
    return p;
  } else {
    Serial.println(F("Error Occured!!"));
    s = 0;
    return p;
  }

  return true;
}
uint8_t getFingerprintID(uint8_t &finger_id, byte &f) {
  uint8_t p = finger.getImage();
  int x = 0;
  int y = 0;
  switch (p) {
    case FINGERPRINT_OK:
      drawSdJpeg("/enroll_finger.jpg", x, y);
      delay_millis(1000);
      tft.fillScreen(TFT_LIGHTGREY);
      tft.drawFastVLine(0, 240, 80, TFT_BLUE);
      tft.drawFastVLine(238, 240, 80, TFT_BLUE);
      tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
        tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
      drawSdJpeg("/finding_finger.jpg", x, y);
      tft.setTextSize(2);
      tft.setTextColor(TFT_BLUE);
      tft.setCursor(10, 280);
      tft.print("FINDING FINGER!!!");
      delay_millis(1000);
      Serial.println(F("Image taken"));
      f = 1;
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(F("No finger detected"));
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      return p;
    case FINGERPRINT_IMAGEFAIL:
      return p;
    default:
      Serial.println(F("Error Occured!!"));
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println(F("Image converted"));
      f = 1;
      break;
    case FINGERPRINT_IMAGEMESS:
      f = 0;
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      f = 0;
      return p;
    case FINGERPRINT_FEATUREFAIL:
      f = 0;
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      f = 0;
      return p;
    default:
      Serial.println(F("Error Occured!!"));
      f = 0;
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println(F("Found a print match!"));
    f = 1;
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    f = 0;
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    f = 0;
    Serial.println("Finger not found");
    return p;
  } else {
    f = 0;
    Serial.println(F("Error Occured!!"));
    return p;
  }

  // found a match!
  finger_id = finger.fingerID;
  return finger.fingerID;
}
uint8_t deleteFingerprint(uint8_t &id) {
  uint8_t p = -1;
  Serial.print(F("Waiting for valid finger to delete as #"));
  Serial.println(id);
  p = finger.deleteModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println(F("Deleted!"));
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
  } else if (p == FINGERPRINT_BADLOCATION) {
  } else if (p == FINGERPRINT_FLASHERR) {
  } else {
    Serial.print(F("Error Occured: 0x"));
    Serial.println(p, HEX);
  }

  return p;
}
void buttonBack() {
  tft.fillScreen(TFT_WHITE);
  tft.fillRoundRect(5, 15, 50, 40, 5, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(BUTTON_TEXT_SIZE);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("<==", 30, 35);
}
void readFiles(fs::FS &fs, const char *path) {
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file) {
    Serial.println("Failed to open file for reading");
    return;
  }

  // Đọc dữ liệu từ file và lưu vào mảng dataBuffer
  int i = 0;
  while (file.available()) {
    dataBuffer[i] = file.read();
    i++;
  }
  dataLength = i;

  file.close();
}
void parseCSV(const char *data, int length, int targetID) {
  // Bỏ qua dòng tiêu đề
  int startIndex = 0;
  while (data[startIndex] != '\n') {
    startIndex++;
  }
  startIndex++;  // Đặt startIndex tại ký tự đầu tiên của dòng dữ liệu thứ nhất
  int endIndex = startIndex;
  int currentID = 0;
  char currentName[50];
  while (endIndex < length) {
    // Đọc ID
    while (data[endIndex] != ',') {
      currentID = currentID * 10 + (data[endIndex] - '0');
      endIndex++;
    }
    endIndex++;  // Bỏ qua dấu phẩy

    // Đọc NAME
    int nameIndex = 0;
    while (data[endIndex] != '\n') {
      currentName[nameIndex] = data[endIndex];
      endIndex++;
      nameIndex++;
    }
    endIndex++;  // Bỏ qua ký tự xuống dòng

    // So sánh ID với targetID
    if (currentID == targetID) {
      currentName[nameIndex] = '\0';  // Kết thúc chuỗi NAME
      Serial.print(F("ID: "));
      Serial.print(currentID);
      Serial.print(F(", NAME: "));
      Serial.println(currentName);
      tft.setTextColor(TFT_RED, TFT_BLACK);  // set text color to white and black background
      tft.setTextSize(3);                    // text size = 2
      tft.setCursor(90, 250);                // move cursor to position (0, 10) pixel
      tft.print(currentID);
      tft.setTextColor(TFT_RED, TFT_BLACK);  // set text color to white and black background
      tft.setTextSize(3);                    // text size = 2
      tft.setCursor(90, 280);
      tft.print(currentName);
      break;
    }
    // Reset ID và NAME
    currentID = 0;
    memset(currentName, 0, sizeof(currentName));
  }
}
void writeToSDCard(const char *filePath, const char *data) {
  // Open the file in write mode
  File file = SD.open(filePath, FILE_WRITE);
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  file.println("ID,NAME");
  // Write the data to the file
  file.print(data);

  // Close the file
  file.close();
}
void parseAndRemoveCSV(const char *data, int length, int targetID) {
  // Create a temporary buffer to store the new CSV data after removing the matching entry
  char newData[length];
  int newIndex = 0;

  // Bỏ qua dòng tiêu đề
  int startIndex = 0;
  while (data[startIndex] != '\n') {
    startIndex++;
  }
  startIndex++;  // Đặt startIndex tại ký tự đầu tiên của dòng dữ liệu thứ nhất
  int endIndex = startIndex;
  int currentID = 0;
  char currentName[50];

  // Loop through the CSV data to find and remove the matching entry
  while (endIndex < length) {
    // Đọc ID
    while (data[endIndex] != ',') {
      currentID = currentID * 10 + (data[endIndex] - '0');
      endIndex++;
    }
    endIndex++;  // Bỏ qua dấu phẩy

    // Đọc NAME
    int nameIndex = 0;
    while (data[endIndex] != '\n') {
      currentName[nameIndex] = data[endIndex];
      endIndex++;
      nameIndex++;
    }
    endIndex++;  // Bỏ qua ký tự xuống dòng

    // So sánh ID với targetID
    if (currentID == targetID) {
      // Skip the matching entry by not copying it to the new data buffer
    } else {
      // Copy the non-matching entry to the new data buffer
      for (int i = startIndex; i < endIndex; i++) {
        newData[newIndex] = data[i];
        newIndex++;
      }
    }

    // Reset ID và NAME
    currentID = 0;
    memset(currentName, 0, sizeof(currentName));
    startIndex = endIndex;  // Update the start index for the next entry
  }

  // Null-terminate the new data buffer to create a valid C-string
  newData[newIndex] = '\0';

  // Print the remaining CSV data to the serial monitor
  Serial.println(F("Remaining Data in CSV:"));
  Serial.println(newData);
  deleteFile(SD, "/DATA_HUMAN.csv");
  writeToSDCard("/DATA_HUMAN.csv", newData);
  newIndex = 0;
  // Now newData contains the CSV data without the matching ID and Name
  // You can use this data as needed for further processing.
}
void touch_calibrate() {
  uint16_t calData[5];
  uint8_t calDataOK = 0;

  // check file system exists
  if (!SPIFFS.begin()) {
    Serial.println("Formatting file system");
    SPIFFS.format();
    SPIFFS.begin();
  }

  // check if calibration file exists and size is correct
  if (SPIFFS.exists(CALIBRATION_FILE)) {
    if (REPEAT_CAL) {
      // Delete if we want to re-calibrate
      SPIFFS.remove(CALIBRATION_FILE);
    } else {
      File f = SPIFFS.open(CALIBRATION_FILE, "r");
      if (f) {
        if (f.readBytes((char *)calData, 14) == 14)
          calDataOK = 1;
        f.close();
      }
    }
  }

  if (calDataOK && !REPEAT_CAL) {
    // calibration data valid
    tft.setTouch(calData);
  } else {
    // data not valid so recalibrate
    tft.fillScreen(TFT_BLACK);
    tft.setCursor(20, 0);
    tft.setTextFont(2);
    tft.setTextSize(1);
    tft.setTextColor(TFT_WHITE, TFT_BLACK);

    tft.println("Touch corners as indicated");

    tft.setTextFont(1);
    tft.println();

    if (REPEAT_CAL) {
      tft.setTextColor(TFT_RED, TFT_BLACK);
      tft.println("Set REPEAT_CAL to false to stop this running again!");
    }

    tft.calibrateTouch(calData, TFT_MAGENTA, TFT_BLACK, 15);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.println("Calibration complete!");

    // store data
    File f = SPIFFS.open(CALIBRATION_FILE, "w");
    if (f) {
      f.write((const unsigned char *)calData, 14);
      f.close();
    }
  }
}
void SDcard() {
  DateTime now = rtc.now();
  if (data.finger_id != 0 || data.tempC != 0) {
    Serial.println(F("Opening file"));
    if (data.finger_id != 0) {
      appendFile(SD, "/DATA.csv", "ID: ");
      String fid = String(data.finger_id);
      appendFile(SD, "/DATA.csv", fid.c_str());  // Lưu id vào file
      appendFile(SD, "/DATA.csv", ",");          // Phân cách
      char buf2[] = "YY/MM/DD";
      char buf3[] = "hh:mm:ss";
      appendFile(SD, "/DATA.csv", now.toString(buf2));
      appendFile(SD, "/DATA.csv", ",");  // Phân cách
      appendFile(SD, "/DATA.csv", now.toString(buf3));
      appendFile(SD, "/DATA.csv", ",");  // Phân cách
      if (data.e == 1 && data.checkin == 1) {
        appendFile(SD, "/DATA.csv", "EARLY");
        appendFile(SD, "/DATA.csv", ",");  // Phân cách
        appendFile(SD, "/DATA.csv", "CHECKIN");
      } else if (data.o == 1 && data.checkin == 1) {
        appendFile(SD, "/DATA.csv", "ON TIME");
        appendFile(SD, "/DATA.csv", ",");  // Phân cách
        appendFile(SD, "/DATA.csv", "CHECKIN");
      } else if (data.l == 1 && data.checkin == 1) {
        appendFile(SD, "/DATA.csv", "LATE: ");
        char late[20];
        int Late = data.late_minutes - 15;
        sprintf(late, "%d", Late);
        appendFile(SD, "/DATA.csv", late);
        appendFile(SD, "/DATA.csv", ",");  // Phân cách
        appendFile(SD, "/DATA.csv", "CHECKIN");
      } else if (data.to == 1) {
        appendFile(SD, "/DATA.csv", "TIME OUT");
        Serial.println("TIME OUT");
      } else if (data.checkout == 1 && data.success == 1) {
        appendFile(SD, "/DATA.csv", "CHECKOUT SUCCESS");
      }
      appendFile(SD, "/DATA.csv", "\n");  // Xuống dòng để lưu thông tin tiếp theo
    }
    if (data.tempC != 0) {
      appendFile(SD, "/TEMP.csv", "TEMP: ");
      char temp[20];
      dtostrf(data.tempC, 6, 2, temp);
      appendFile(SD, "/TEMP.csv", temp);  // Lưu tempC vào file
      appendFile(SD, "/TEMP.csv", ",");   // Phân cách
      char buf2[] = "YY/MM/DD";
      char buf3[] = "hh:mm:ss";
      appendFile(SD, "/TEMP.csv", now.toString(buf2));
      appendFile(SD, "/TEMP.csv", ",");  // Phân cách
      appendFile(SD, "/TEMP.csv", now.toString(buf3));
      appendFile(SD, "/TEMP.csv", "\n");
    }
  }
}
void readTemp() {
  byte sensorValue = digitalRead(sensorPin);
  Serial.println("LOW");
  if (sensorValue == LOW) {
    Serial.println("TEMP");
    data.tempC = mlx.readObjectTempC();
    digitalWrite(buzzer, HIGH);
    delay_millis(250);
    digitalWrite(buzzer, LOW);
    tft.setTextSize(3);
    tft.fillScreen(TFT_WHITE);
    tft.setTextColor(TFT_RED);
    tft.drawString("TEMPERATURE:", 130, 95);
    tft.setTextSize(3);
    tft.setTextColor(TFT_BLUE);
    tft.drawString(String(data.tempC), 120, 155);
    if (data.tempC >= 37.5) {
      digitalWrite(buzzer, HIGH);
      delay_millis(1000);
      digitalWrite(buzzer, LOW);
    }
    delay_millis(1000);
    SDcard();
  }
}
void Time() {
  DateTime now = rtc.now();
  if (data.finger_id != 0) {
    if (now.hour() >= 7 && now.hour() < 9) {
      data.checkin = 1;
      data.late_minutes = (now.hour() - 8) * 60 + now.minute();
      if (data.late_minutes <= 0) {
        data.e = 1;
        Serial.print(F("E"));
      } else if (data.late_minutes <= 15) {
        data.o = 1;
        Serial.print(F("O"));
      } else {
        data.l = 1;
        Serial.print(F("L\n"));
      }
    } else if (now.hour() >= 16 && now.hour() <= 17) {
      data.checkout = 1;
      data.success = 1;
      Serial.println(F("CHECKOUT"));
    } else if (now.hour() < 16 || now.hour() > 17 || now.hour() < 7 || now.hour() > 9) {
      data.to = 1;
      Serial.print(F("Time out1"));
    }
  }
}
void PathImgFB(uint8_t finger_id, char *path) {
  DateTime now = rtc.now();
  char imageName[10];                                                        // Định nghĩa một mảng ký tự có độ dài đủ để chứa chuỗi "15.jpg"
  itoa(finger_id, imageName, 10);                                            // Chuyển đổi số nguyên thành chuỗi ký tự
  char timestamp[19];                                                        // Định nghĩa một mảng ký tự có độ dài đủ để chứa chuỗi thời gian
  sprintf(timestamp, "%02d_%02d_%04d", now.day(), now.month(), now.year());  // Tạo chuỗi thời gian với dấu cách
  // Nếu bạn muốn thêm dấu '/' vào đầu chuỗi
  char finalName[50];  // Định nghĩa một mảng ký tự có độ dài đủ để chứa chuỗi "/scan_data/15.jpg" và ký tự kết thúc chuỗi ('\0')
  strcpy(finalName, "/");
  strcat(finalName, timestamp);  // Nối chuỗi timestamp vào cuối
  strcat(finalName, "/");
  if (data.e == 1 && data.checkin == 1) {
    strcat(finalName, "Early/");  // Thêm thư mục "Early/"
  } else if (data.o == 1 && data.checkin == 1) {
    strcat(finalName, "OnTime/");  // Thêm thư mục "OnTime/"
  } else if (data.l == 1 && data.checkin == 1) {
    strcat(finalName, "Late/");  // Thêm thư mục "Late/"
  } else if (data.to == 1) {
    strcat(finalName, "TimeOut/");  // Thêm thư mục "TimeOut/"
  } else if (data.checkout == 1 && data.success == 1) {
    strcat(finalName, "CheckOut/");  // Thêm thư mục "CheckOut/"
  }
  strcat(finalName, imageName);  // Nối chuỗi imageName vào cuối
  strcat(finalName, ".jpg");     // Nối chuỗi ".jpg" vào cuối
  strcpy(path, finalName);       // Sao chép chuỗi finalName vào biến tham chiếu 'path' với kích thước tối đa được chỉ định
}
void function() {
  while (menu == 1) {
    buttonBack();
    tft.setTextColor(TFT_ORANGE);
    tft.setTextSize(2);
    tft.setTextDatum(MC_DATUM);
    tft.drawString("ENROLL", 130, 10);
    tft.drawString("ENTER PASSWORD", 130, 80);
    tft.drawFastVLine(60, 190, 30, TFT_BLUE);
    tft.drawFastVLine(180, 190, 30, TFT_BLUE);
    tft.drawFastHLine(60, 190, 120, TFT_BLUE),
      tft.drawFastHLine(60, 220, 120, TFT_BLUE);
    data.pass = readPass();
    if (data.pass == 123) {
      tft.fillScreen(TFT_WHITE);
      tft.setTextColor(TFT_ORANGE);
      tft.setTextSize(2);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("ENROLL", 130, 10);
      tft.drawString("ENTER ID", 130, 80);
      data.id = readNumber();
      if (data.id != 255) {
        Serial.println(data.id);
        getFingerprintEnroll(data.id, data.s);
        if (data.s == 1) {
          tft.fillScreen(TFT_LIGHTGREY);
          int x = 0;
          int y = 0;
          tft.drawFastVLine(0, 240, 80, TFT_BLUE);
          tft.drawFastVLine(238, 240, 80, TFT_BLUE);
          tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
            tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
          drawSdJpeg("/scan_success.jpg", x, y);
          tft.setTextSize(3);
          tft.setTextColor(TFT_BLUE);
          tft.setCursor(30, 280);
          tft.print("ENROLLED!!");
          delay_millis(1000);
          data.id = 255;
          currentPage = 1;
          menu = 0;
          Menu();
        } else if (data.s == 0) {
          tft.fillScreen(TFT_LIGHTGREY);
          int x = 0;
          int y = 0;
          tft.drawFastVLine(0, 240, 80, TFT_BLUE);
          tft.drawFastVLine(238, 240, 80, TFT_BLUE);
          tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
            tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
          drawSdJpeg("/scan_fail.jpg", x, y);
          tft.setTextSize(3);
          tft.setTextColor(TFT_BLUE);
          tft.setCursor(30, 280);
          tft.print("SCAN FAILED!!");
          delay_millis(1000);
          menu = 1;
          function();
        }
      }
    }
  }
  while (menu == 2) {
    buttonBack();
    tft.setTextColor(TFT_ORANGE);
    tft.setTextSize(2);
    tft.setTextDatum(MC_DATUM);
    tft.drawString("DELETE", 130, 10);
    tft.drawString("ENTER PASSWORD", 130, 80);
    tft.drawFastVLine(60, 190, 30, TFT_BLUE);
    tft.drawFastVLine(180, 190, 30, TFT_BLUE);
    tft.drawFastHLine(60, 190, 120, TFT_BLUE),
      tft.drawFastHLine(60, 220, 120, TFT_BLUE);
    data.pass = readPass();
    if (data.pass == 123) {
      tft.fillScreen(TFT_WHITE);
      tft.setTextColor(TFT_ORANGE);
      tft.setTextSize(2);
      tft.setTextDatum(MC_DATUM);
      tft.drawString("DELETE", 130, 10);
      tft.drawString("ENTER ID", 130, 80);
      data.id = readNumber();
      if (data.id != 255) {
        Serial.println(data.id);
        deleteFingerprint(data.id);
        tft.drawString("DELETE ID!!", 130, 150);
        readFiles(SD, "/DATA_HUMAN.csv");
        Serial.println(F("Data read from file:"));
        for (int i = 0; i < dataLength; i++) {
          Serial.write(dataBuffer[i]);
        }
        parseAndRemoveCSV(dataBuffer, dataLength, data.id);
        Serial.println(data.id);
        deleteFingerprint(data.id);
        char result[12];  // Định nghĩa một mảng ký tự để chứa kết quả
        convertToImageName(data.id, result);
        Serial.println(result);  // In ra chuỗi kết quả
        deleteFile(SD, result);
        delay_millis(1000);
        data.id = 0;
        currentPage = 1;
        menu = 0;
        Menu();
      } else {
        menu = 2;
        function();
      }
    }
  }
  while (menu == 3) {
    buttonBack();
    tft.setTextColor(TFT_ORANGE);
    tft.setTextSize(2);
    tft.setTextDatum(MC_DATUM);
    tft.drawString("LIST", 130, 10);
    tft.drawString("ENTER PASSWORD", 130, 80);
    tft.drawFastVLine(60, 190, 30, TFT_BLUE);
    tft.drawFastVLine(180, 190, 30, TFT_BLUE);
    tft.drawFastHLine(60, 190, 120, TFT_BLUE),
      tft.drawFastHLine(60, 220, 120, TFT_BLUE);
    data.pass = readPass();
  }
}
void getID_FB_ENR() {
  if (data.id_enr != 255 && !Name.equals("NONE")) {
    Serial.println(data.id_enr);
    Serial.println(Name);
    String fid = String(data.id_enr);
    char result[12];  // Định nghĩa một mảng ký tự để chứa kết quả
    convertToImageName(data.id_enr, result);
    Serial.println(result);  // In ra chuỗi kết quả
    renameJpgFile("/255.jpg", result);
    appendFile(SD, "/DATA_HUMAN.csv", fid.c_str());
    appendFile(SD, "/DATA_HUMAN.csv", ",");  // Phân cách
    appendFile(SD, "/DATA_HUMAN.csv", Name.c_str());
    appendFile(SD, "/DATA_HUMAN.csv", "\n");
    // delete[] toDecode;
    Serial.println(data.id_enr);
    getFingerprintEnroll(data.id_enr, data.s);
    // char *toDecode = const_cast<char *>(Image.c_str());
    if (data.s == 1) {
      tft.fillScreen(TFT_LIGHTGREY);
      int x = 0;
      int y = 0;
      tft.drawFastVLine(0, 240, 80, TFT_BLUE);
      tft.drawFastVLine(238, 240, 80, TFT_BLUE);
      tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
        tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
      drawSdJpeg("/scan_success.jpg", x, y);
      tft.setTextSize(3);
      tft.setTextColor(TFT_BLUE);
      tft.setCursor(30, 280);
      tft.print("ENROLLED!!");
      delay_millis(1000);
      data.id_enr = 255;
      Name = "NONE";
      currentPage = 0;
      main = 1;
    } else if (data.s == 0) {
      tft.fillScreen(TFT_LIGHTGREY);
      int x = 0;
      int y = 0;
      tft.drawFastVLine(0, 240, 80, TFT_BLUE);
      tft.drawFastVLine(238, 240, 80, TFT_BLUE);
      tft.drawFastHLine(0, 242, tft.width(), TFT_BLUE),
        tft.drawFastHLine(0, 318, tft.width(), TFT_BLUE);
      drawSdJpeg("/scan_fail.jpg", x, y);
      tft.setTextSize(3);
      tft.setTextColor(TFT_BLUE);
      tft.setCursor(30, 280);
      tft.print("SCAN FAILED!!");
      delay_millis(1000);
      currentPage = 0;
      main = 1;
    }
    if (Firebase.ready()) {
      Serial.printf("Set ENROLL ID... %s\n", Firebase.RTDB.setString(&fbdo2, F("/ENROLL AND DELETE/ENROLL ID/UserID"), "255") ? "ok" : fbdo2.errorReason().c_str());
      Serial.printf("Set ENROLL NAME... %s\n", Firebase.RTDB.setString(&fbdo2, F("/ENROLL AND DELETE/ENROLL NAME/Name"), "NONE") ? "ok" : fbdo2.errorReason().c_str());
    }
    data.id_enr = 255;
    Name = "NONE";
  }
}
void getID_FB_DEL() {
  if (data.id_del != 255) {
    Serial.println(data.id_del);
    if (Firebase.ready()) {
      Serial.printf("Set DELETE ID... %s\n", Firebase.RTDB.setString(&fbdo2, F("/ENROLL AND DELETE/DELETE/UserID"), "255") ? "ok" : fbdo2.errorReason().c_str());
    }
    readFiles(SD, "/DATA_HUMAN.csv");
    Serial.println(F("Data read from file:"));
    for (int i = 0; i < dataLength; i++) {
      Serial.write(dataBuffer[i]);
    }
    parseAndRemoveCSV(dataBuffer, dataLength, data.id_del);
    tft.fillScreen(TFT_BLACK);
    Serial.println(data.id_del);
    deleteFingerprint(data.id_del);
    char result[12];  // Định nghĩa một mảng ký tự để chứa kết quả
    convertToImageName(data.id_del, result);
    Serial.println(result);  // In ra chuỗi kết quả
    deleteFile(SD, result);
    tft.drawString("DELETE ID!!", 130, 150);
    delay_millis(1000);
    data.id_del = 255;
    currentPage = 0;
    main = 1;
  }
}
