#include "SDESP.h"
void setup() {
  setup_sd();
  listDir(SD, "/", 0);
  createDir(SD, "/mydir");
  listDir(SD, "/", 0);
  removeDir(SD, "/mydir");
  listDir(SD, "/", 2);
  writeFile(SD, "/hello1.txt", "Hello ");
  appendFile(SD, "/hello1.txt", "World!\n");
  appendFile(SD, "/hello1.txt", "HelloH ");
  appendFile(SD, "/hello1.txt", "WorldH!\n");
  readFile(SD, "/hello1.txt");
  deleteFile(SD, "/foo.txt");
  renameFile(SD, "/hello1.txt", "/fooh.txt");
  readFile(SD, "/fooh.txt");
  testFileIO(SD, "/test.txt");
  Serial.printf("Total space: %lluMB\n", SD.totalBytes() / (1024 * 1024));
  Serial.printf("Used space: %lluMB\n", SD.usedBytes() / (1024 * 1024));
}

void loop() {
}