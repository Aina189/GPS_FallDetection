#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>
#define BUTTON_PIN1 35  // GPIO21 pin connected to button
#define BUTTON_PIN2 34  // GPIO21 pin connected to button
#define MODEM_RX 16     // RX2 => connecté au TX du module
#define MODEM_TX 17     // TX2 => connecté au RX du module
#define RXD2 3
#define TXD2 1
#define LED_PIN1 27
#define LED_PIN2 26
#define LED_PIN3 25
#define BUZZER_PIN 14

//Mpu variable
Adafruit_MPU6050 mpu;

//sim variable
HardwareSerial sim800(2);

//Gps variable
TinyGPSPlus gps;
HardwareSerial gpsSerial(0);

boolean fall = false;        // Variable pour savoir si une chute a été détectée
unsigned long fallTime = 0;  // Temps de détection de la chute
float initialZ = 0.0;        // Valeur d'accélération Z initiale pour vérifier le retournement
float initialX = 0.0;        // Valeur d'accélération X initiale pour vérifier le retournement
float initialY = 0.0;        // Valeur d'accélération Y initiale pour vérifier le retournement

// Variables will change:
int btn1;
int btn2;

//Wifi & websocket local
// const char* ssid = "AllForOneIT";
// const char* password = "AllS@fe123!.";
// const char* websockets_server_host = "192.168.0.117";  // IP PC (serveur Spring Boot)
// const uint16_t websockets_server_port = 8080;

//Wifi & websocket phone
const char* ssid = "iPhone 8";
const char* password = "12345678";
const char* websockets_server_host = "172.20.10.2";  // IP PC (serveur Spring Boot)
const uint16_t websockets_server_port = 8080;

String position = "-18.924442702179174, 47.548936373018044";

using namespace websockets;
WebsocketsClient client;

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Reçu du serveur : ");
  Serial.println(message.data());
}

//mpuFuction
void mpuInit() {
  // Initialisation du capteur MPU6050
  if (!mpu.begin()) {
    Serial.println("Échec de la connexion au capteur MPU6050");
    while (1) {
      delay(50);  // Boucle infinie si le capteur n'est pas trouvé
    }
  }

  // Configuration du capteur MPU6050
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  delay(1000);
  Serial.println("Capteur MPU6050 initialisé avec succès !");
  digitalWrite(LED_PIN2, HIGH);
}

// Connexion WiFi
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
  Serial.begin(115200);
  sim800.begin(9600, SERIAL_8N1, MODEM_RX, MODEM_TX);
  gpsSerial.begin(9600, SERIAL_8N1, RXD2, TXD2);
  wifiInit();
  mpuInit();

  pinMode(BUTTON_PIN1, INPUT);
  pinMode(BUTTON_PIN2, INPUT);

  // Définir le callback quand un message est reçu
  client.onMessage(onMessageCallback);

  // Connecter au serveur WebSocket
  String url = "ws://" + String(websockets_server_host) + ":" + String(websockets_server_port) + "/ws";
  bool connected = client.connect(url);

  if (connected) {
    Serial.println("Connecté au serveur WebSocket !");
    client.send("Hello depuis l'ESP32");
    digitalWrite(LED_PIN3, HIGH);
  } else {
    Serial.println("Échec de la connexion WebSocket !");
  }

  signalBuzzer();
}



void loop() {
  client.poll();  // Très important : permet de garder la connexion vivante
  sendValue();
  mpuReadValue();
  alertBuzzer();
}

//button function
void sendValue() {
  btn1 = digitalRead(BUTTON_PIN1);
  btn2 = digitalRead(BUTTON_PIN2);

  if (btn1 == LOW) {
    printLocation(gps);
    activeAlert(1);
  }
  if (btn2 == LOW) {
    discardAlert();
  }
}

void activeAlert(int value) {
  Serial.println("The state changed  HIGH");
  fall = true;
  alertBuzzer();
  //ici sms send
  sendSms(value);
  client.send("1");
  delay(500);
}

void discardAlert() {
  Serial.println("The state changed Low");
  client.send("0");
  fall = false;
  delay(500);
}

void mpuReadValue() {
  // Variables pour stocker les événements de capteur
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Affichage des valeurs d'accélération (X, Y, Z)
  // Serial.print("Accélération X: ");
  // Serial.print(a.acceleration.x);
  // Serial.print(" Y: ");
  // Serial.print(a.acceleration.y);
  // Serial.print(" Z: ");
  // Serial.println(a.acceleration.z);

  // Logique de détection de chute
  if (!fall) {
    // Vérification si l'accélération sur l'axe Z indique une chute
    if (a.acceleration.z < -9.8) {  // Chute si l'accélération en Z est très faible
      fall = true;
      fallTime = millis();          // Enregistrer le moment de la chute
      initialZ = a.acceleration.z;  // Enregistrer la valeur d'accélération Z initiale
      initialX = a.acceleration.x;  // Enregistrer la valeur d'accélération X initiale
      initialY = a.acceleration.y;  // Enregistrer la valeur d'accélération Y initiale
      Serial.println("Chute détectée !");
      tone(15, 262, 500);  // Émet un son de 262 Hz pendant 500 ms
    }
  } else {
    // Si une chute a été détectée, vérifier si l'appareil s'est redressé dans les 5 secondes
    unsigned long currentTime = millis();
    if (currentTime - fallTime > 5000) {  // Si 5 secondes se sont écoulées depuis la chute
      // Vérification si l'inclinaison est toujours présente
      if (abs(a.acceleration.x - initialX) > 2.0 || abs(a.acceleration.y - initialY) > 2.0) {
        // Si l'inclinaison est toujours significative sur les axes X ou Y, l'appareil ne s'est pas redressé
        Serial.println("ALERTE: Chute non relevée !");  //function to send message
        printLocation(gps);

        activeAlert(0);
        client.send("1");
        // Activer l'alert
        tone(15, 523, 1000);  // Émet un son de 523 Hz pendant 1 seconde pour alerter
      }
      // fall = false;  // Réinitialiser l'état de chute
    }
  }

  // delay(1000);
}

void printResponse() {
  while (sim800.available()) {
    Serial.write(sim800.read());
  }
}

void sendSms(int state) {
  sim800.println("AT");
  delay(500);
  printResponse();

  sim800.println("AT+CMGF=1");
  delay(500);
  printResponse();

  sim800.println("AT+CMGS=\"+261381936418\"");
  delay(500);

  //Attente de l'invite ">"
  unsigned long timeout = millis();
  while (!sim800.find(">")) {
    if (millis() - timeout > 5000) {
      Serial.println("Erreur : pas d'invite >");
      return;  // Quitter pour éviter crash
    }
  }

  String message;
  if (state == 0) {
    message.reserve(160);
    message = "Alerte chute ! Pos: ";
    message += position;
    message += "\nhttps://maps.google.com/?q=";
    message += position;
  } else {
    message.reserve(160);
    message = "Alerte probleme ! ";
    message += position;
    message += "\nhttps://maps.google.com/?q=";
    message += position;
  }

  sim800.print(message);
  sim800.write(26);  // CTRL+Z
  delay(5000);
  printResponse();

  Serial.println("SMS envoyé !");
}

// Envoi du SMS (Ctrl+Z = 0x1A)
//   sim800.write(0x1A);
//   delay(500);

//   Serial.println("SMS envoyé !");
// }

void printLocation(TinyGPSPlus& gps) {
  if (gps.location.isUpdated()) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();
    Serial.print("LAT: ");
    Serial.println(latitude, 6);
    Serial.print("LONG: ");
    Serial.println(longitude, 6);

    // Maj position
    position = String(latitude, 6) + "," + String(longitude, 6);

  } else {
    Serial.println("Waiting for valid GPS data...");
  }
}

void alertBuzzer() {
  static unsigned long previousMillis = 0;
  static bool buzzerState = false;
  const unsigned long interval = 150;  // Intervalle de clignotement

  if (fall) {
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      buzzerState = !buzzerState;  // alterne ON/OFF

      digitalWrite(BUZZER_PIN, buzzerState);
      digitalWrite(LED_PIN1, buzzerState);
    }
  } else {
    // Éteint tout si pas de chute
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN1, LOW);
  }
}


void signalBuzzer() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100 - (i * 20));  // le bip devient plus rapide
    digitalWrite(BUZZER_PIN, LOW);
    delay(150 - (i * 30));  // et la pause aussi
  }
}
