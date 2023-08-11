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
#include <iostream>
#include <string>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "driver/rtc_io.h"
#include <ArduinoJson.h>  // Thư viện hỗ trợ JSON
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include "SDESP.h"
#include <Adafruit_MLX90614.h>
#include <JPEGDecoder.h>
#include <TFT_eSPI.h>  // Hardware-specific library
#include "RTClib.h"
#include <Keypad.h>
#include <Keypad_I2C.h>
#include <Arduino.h>  //Search ở Tools --> Boards Manager --> Arduino AVR Boards
#include <Adafruit_Fingerprint.h>
#include "C:/Users/DELL/Downloads/Blynk_Release_v1.1.0/libraries/TFT_eSPI/examples/GUI Widgets/Buttons/Button_demo/Free_Fonts.h"