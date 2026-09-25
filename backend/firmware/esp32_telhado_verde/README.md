# ESP32 — temperatura e umidade

O sketch lê um DHT22 e envia uma requisição em lote para `POST /leitura/lote` ao iniciar e depois a cada hora.

## Dependências no Arduino IDE

- Placa `esp32` da Espressif Systems.
- Biblioteca `DHT sensor library` da Adafruit.
- Biblioteca `Adafruit Unified Sensor`, dependência da DHT.

## Configuração

1. Abra `esp32_telhado_verde.ino`.
2. Preencha `WIFI_SSID` e `WIFI_PASSWORD` localmente.
3. Troque `192.168.1.100` pelo IPv4 do computador que executa a API.
4. Confirme `DEVICE_ID` e os IDs dos sensores.
5. Inicie o FastAPI aceitando conexões da rede: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`.
6. Compile, envie à placa e acompanhe o Monitor Serial em 115200 baud.

O firewall do Windows precisa permitir conexões TCP de entrada na porta 8000. O sketch não contém credenciais reais.
