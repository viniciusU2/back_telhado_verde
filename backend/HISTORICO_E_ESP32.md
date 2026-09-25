# Histórico fictício e ESP32

## Carga histórica

A carga cria dados horários fictícios de temperatura e umidade sem apagar leituras existentes. Para o dispositivo 1, usa os sensores reservados `1001` e `1002` e não duplica horários em novas execuções.

```powershell
cd backend
python -m scripts.carga_historica --device-id 1 --days 30
```

Parâmetros disponíveis:

- `--device-id`: dispositivo de destino;
- `--days`: período entre 1 e 365 dias;
- `--seed`: semente para reproduzir os mesmos valores.

Esses registros são apenas demonstrações para desenvolvimento e não representam medições reais.

## ESP32

O projeto Arduino está em `firmware/esp32_telhado_verde/`. Ele usa um DHT22 e envia temperatura e umidade em lote a cada hora para o contrato existente:

```text
POST /leitura/lote
```

Antes de gravar a placa, configure Wi-Fi, IP da API, ID do dispositivo e sensores no início do arquivo `.ino`. Inicie o backend na rede local com:

```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Consulte o README do diretório do firmware para bibliotecas e instruções do Arduino IDE.
