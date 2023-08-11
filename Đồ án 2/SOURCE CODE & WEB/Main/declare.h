#include "Library.h"
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
HardwareSerial serialPort(2);  // use UART2
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&serialPort);
TFT_eSPI tft = TFT_eSPI();  // Invoke custom library
int currentPage = 0;
String uid;
const char *ssid = "Minh Huy";
const char *password = "12345678";
#define CALIBRATION_FILE "/TouchCalData1"
#define REPEAT_CAL false
uint16_t x = 0, y = 0;  // To store the touch coordinates
byte main = 0;
const byte enPin = 13;
const byte sensorPin = 14;
const byte buzzer = 32;
char dataBuffer[1024];  // Khai báo một mảng để lưu trữ dữ liệu từ file
int dataLength = 0;     // Độ dài thực tế của dữ liệu
// initialize RTC library
RTC_DS1307 rtc;
DateTime now;
#define API_KEY "AIzaSyA76xKoi3-xjoEvzH0EguwIQM4RfwPT55M"
#define DATABASE_URL "health-59eca-default-rtdb.asia-southeast1.firebasedatabase.app"
// #define FIREBASE_Authorization_key "Zbcesx74PEqnlKwnGIjNSfmaQbEGFoBZSUGBFRLP"
// ENter Authorized Email and Password
#define USER_EMAIL "mphan1111@gmail.com"
#define USER_PASSWORD "PNM532002"
// Enter Firebase storage bucket ID
#define STORAGE_BUCKET_ID "health-59eca.appspot.com"
char result[12];
int id = 55;
FirebaseData fbdo1;
FirebaseData fbdo2;
FirebaseData fbdo3;
FirebaseData fbdo4;
FirebaseData Img;
FirebaseData stream;
FirebaseAuth authentication;
FirebaseConfig configuration;
bool pressed;
int menu = 0;
// Button variables
#define BUTTON_WIDTH 80
#define BUTTON_HEIGHT 40
#define BUTTON_X 80
#define BUTTON_Y 250
#define BUTTON_TEXT_SIZE 2
#define BUTTON_TEXT_COLOR TFT_WHITE
#define BUTTON_COLOR TFT_BLUE
const byte numRows = 4;  // số lượng hàng trên keypad
const byte numCols = 4;  // số lượng cột trên keypad
// sử dụng keypad để điều khiển menu
#define I2CADDR 0x38
char key;
char keys[numRows][numCols] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
// phím được gán trên các hàng và cột
byte rowPins[numRows] = { 7, 6, 5, 4 };  // các hàng từ 0 đến 3
byte colPins[numCols] = { 3, 2, 1, 0 };  // các cột từ 0 đến 3
// khởi tạo Keypad
Keypad_I2C customKeypad(makeKeymap(keys), rowPins, colPins, numRows, numCols, I2CADDR);
bool menuButtonPressed = false;
String Name = "NONE";
String parentPath = "/ENROLL AND DELETE";
String childPath[3] = { "/DELETE", "/ENROLL NAME", "/ENROLL ID" };
volatile bool dataChanged = false;
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