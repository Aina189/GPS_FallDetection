#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

#define BUTTON_PIN1 35  // GPIO35 (entrée seulement - nécessite résistance pull-up externe)
#define BUTTON_PIN2 34  // GPIO34 (entrée seulement - nécessite résistance pull-up externe)
#define MODEM_RX 16
#define MODEM_TX 17
#define RXD2 3
#define TXD2 1
#define LED_PIN1 27
#define LED_PIN2 26
#define LED_PIN3 25
#define BUZZER_PIN 14

// Variables MPU
Adafruit_MPU6050 mpu;

// Variables SIM800
HardwareSerial sim800(2);

// Variables GPS
TinyGPSPlus gps;
HardwareSerial gpsSerial(0);

// Variables d'état
boolean fall = false;
unsigned long fallTime = 0;
float initialZ = 0.0;
float initialX = 0.0;
float initialY = 0.0;

// Variables pour l'anti-rebond
unsigned long lastDebounceTime1 = 0;
unsigned long lastDebounceTime2 = 0;
unsigned long debounceDelay = 50;
int lastButtonState1 = HIGH;
int lastButtonState2 = HIGH;

// Configuration WiFi & WebSocket
const char* ssid = "AllForOneIT";
const char* password = "AllS@fe123!.";
const char* websockets_server_host = "192.168.0.117";
const uint16_t websockets_server_port = 8080;

String position = "-18.924442702179174, 47.548936373018044";

using namespace websockets;
WebsocketsClient client;

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Reçu du serveur : ");
  Serial.println(message.data());
}

void mpuInit() {
  if (!mpu.begin()) {
    Serial.println("Échec de la connexion au capteur MPU6050");
    while (1) {
      delay(50);
    }
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  delay(1000);
  Serial.println("Capteur MPU6050 initialisé avec succès !");
  digitalWrite(LED_PIN2, HIGH);
}

void wifiInit() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connecté");
}

void setup() {
  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  pinMode(LED_PIN3, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Configuration des boutons avec résistances pull-up externes nécessaires
  pinMode(BUTTON_PIN1, INPUT);
  pinMode(BUTTON_PIN2, INPUT);

  Serial.begin(115200);
  sim800.begin(9600, SERIAL_8N1, MODEM_RX, MODEM_TX);
  gpsSerial.begin(9600, SERIAL_8N1, RXD2, TXD2);
  
  wifiInit();
  mpuInit();

  client.onMessage(onMessageCallback);

  String url = "ws://" + String(websockets_server_host) + ":" + String(websockets_server_port) + "/ws";
  bool connected = client.connect(url);

  if (connected) {
    Serial.println("Connecté au serveur WebSocket !");
    client.send("Hello depuis l'ESP32");
    digitalWrite(LED_PIN3, HIGH);
  } else {
    Serial.println("Échec de la connexion WebSocket !");
  }
}

void loop() {
  client.poll();
  handleButtons();
  mpuReadValue();
  alertBuzzer();
}

void handleButtons() {
  int reading1 = digitalRead(BUTTON_PIN1);
  int reading2 = digitalRead(BUTTON_PIN2);
  
  // Bouton 1
  if (reading1 != lastButtonState1) {
    lastDebounceTime1 = millis();
  }
  
  if ((millis() - lastDebounceTime1) > debounceDelay) {
    if (reading1 == LOW && lastButtonState1 == HIGH) {
      Serial.println("Bouton 1 pressé");
      printLocation(gps);
      activeAlert();
    }
    lastButtonState1 = reading1;
  }
  
  // Bouton 2
  if (reading2 != lastButtonState2) {
    lastDebounceTime2 = millis();
  }
  
  if ((millis() - lastDebounceTime2) > debounceDelay) {
    if (reading2 == LOW && lastButtonState2 == HIGH) {
      Serial.println("Bouton 2 pressé");
      discardAlert();
    }
    lastButtonState2 = reading2;
  }
}

void activeAlert() {
  Serial.println("Alerte activée");
  client.send("1");
  fall = true;
  sendSms();
}

void discardAlert() {
  Serial.println("Alerte désactivée");
  client.send("0");
  fall = false;
}

void mpuReadValue() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  Serial.print("Accélération X: ");
  Serial.print(a.acceleration.x);
  Serial.print(" Y: ");
  Serial.print(a.acceleration.y);
  Serial.print(" Z: ");
  Serial.println(a.acceleration.z);

  if (!fall) {
    if (a.acceleration.z < -9.8) {
      fall = true;
      fallTime = millis();
      initialZ = a.acceleration.z;
      initialX = a.acceleration.x;
      initialY = a.acceleration.y;
      Serial.println("Chute détectée !");
      tone(BUZZER_PIN, 262, 500);
    }
  } else {
    unsigned long currentTime = millis();
    if (currentTime - fallTime > 5000) {
      if (abs(a.acceleration.x - initialX) > 2.0 || abs(a.acceleration.y - initialY) > 2.0) {
        Serial.println("ALERTE: Chute non relevée !");
        printLocation(gps);
        activeAlert();
        tone(BUZZER_PIN, 523, 1000);
      }
      fall = false;
    }
  }
}

void printResponse() {
  while (sim800.available()) {
    Serial.write(sim800.read());
  }
}

void sendSms() {
  sim800.println("AT");
  delay(500);
  printResponse();

  sim800.println("AT+CMGF=1");
  delay(500);
  printResponse();

  sim800.println("AT+CMGS=\"+261381936418\"");
  delay(500);
  printResponse();

  sim800.print("Bonjour depuis ESP32 !, second test " + position);
  delay(500);

  sim800.write(0x1A);
  delay(5000);

  Serial.println("SMS envoyé !");
}

void printLocation(TinyGPSPlus &gps) {
  if (gps.location.isUpdated()) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();
    Serial.print("LAT: ");
    Serial.println(latitude, 6);
    Serial.print("LONG: ");
    Serial.println(longitude, 6);

    position = String(latitude, 6) + "," + String(longitude, 6);
  } else {
    Serial.println("En attente de données GPS valides...");
  }
}

void alertBuzzer() {
  if (fall) {
    digitalWrite(BUZZER_PIN, HIGH);
    digitalWrite(LED_PIN1, HIGH);
    delay(50);
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN1, LOW);
    delay(100);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
}