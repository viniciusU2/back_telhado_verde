#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Preencha localmente. Não publique credenciais reais no repositório.
const char* WIFI_SSID = "SUA_REDE_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA_WIFI";

// Use o IP do computador na rede local. "localhost" apontaria para o ESP32.
const char* API_URL = "http://192.168.1.100:8000/leitura/lote";

constexpr uint8_t DHT_PIN = 4;
constexpr uint8_t DHT_TYPE = DHT22;
constexpr int DEVICE_ID = 1;
constexpr int TEMPERATURE_SENSOR_ID = 1;
constexpr int HUMIDITY_SENSOR_ID = 2;
constexpr unsigned long SEND_INTERVAL_MS = 60UL * 60UL * 1000UL;

DHT dht(DHT_PIN, DHT_TYPE);
unsigned long lastSendAt = 0;
bool firstReading = true;

bool connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return true;

  Serial.print("Conectando ao Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  const unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 20000UL) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  return WiFi.status() == WL_CONNECTED;
}

bool sendReading(float temperature, float humidity) {
  if (!connectWiFi()) {
    Serial.println("Wi-Fi indisponível; tentativa adiada.");
    return false;
  }

  HTTPClient http;
  http.setConnectTimeout(10000);
  http.setTimeout(15000);
  if (!http.begin(API_URL)) {
    Serial.println("Não foi possível iniciar a requisição HTTP.");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  char payload[256];
  snprintf(
    payload,
    sizeof(payload),
    "{\"id_dispositivo\":%d,\"leituras\":[{\"tipo\":\"temperatura\",\"id_sensor\":%d,\"valor\":%.1f},{\"tipo\":\"umidade\",\"id_sensor\":%d,\"valor\":%.1f}]}",
    DEVICE_ID,
    TEMPERATURE_SENSOR_ID,
    temperature,
    HUMIDITY_SENSOR_ID,
    humidity
  );

  const int statusCode = http.POST(reinterpret_cast<uint8_t*>(payload), strlen(payload));
  const String response = statusCode > 0 ? http.getString() : http.errorToString(statusCode);
  Serial.printf("API HTTP %d: %s\n", statusCode, response.c_str());
  http.end();
  return statusCode >= 200 && statusCode < 300;
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  connectWiFi();
}

void loop() {
  const unsigned long now = millis();
  if (firstReading || now - lastSendAt >= SEND_INTERVAL_MS) {
    const float humidity = dht.readHumidity();
    const float temperature = dht.readTemperature();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Falha ao ler o DHT22; nova tentativa em 30 segundos.");
      delay(30000);
      return;
    }

    if (sendReading(temperature, humidity)) {
      lastSendAt = now;
      firstReading = false;
    } else {
      delay(30000);
    }
  }
  delay(1000);
}
