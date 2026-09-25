# Telhado Verde — frontend

Dashboard React/TypeScript para as estações próprias do Telhado Verde e uma fonte INMET configurável.

## Execução

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

O backend deve estar em `http://localhost:8000` (ou no endereço definido em `VITE_API_URL`). Para produção:

```bash
npm run test
npm run build
npm run preview
```

## Variáveis de ambiente

- `VITE_API_URL`: backend FastAPI existente.
- `VITE_INMET_API_URL`: endpoint/proxy que entrega o contrato `{ estacao, dados }`. A URL fica somente na camada de serviço.
- `VITE_USE_MOCK_DATA`: `true` habilita o exemplo local exclusivamente durante desenvolvimento; o padrão é `false`.
- `VITE_STATION_TIMEZONE`: fuso usado na apresentação, por padrão `America/Bahia`.

## Arquitetura

- `services/`: clientes HTTP do backend e do INMET, validação e erros compreensíveis.
- `types/`: contratos brutos e modelo meteorológico normalizado.
- `utils/`: adaptadores separados, UTC/fuso, unidades, vento, distância, agregação, comparação e estatística.
- `hooks/`: TanStack Query, cache, atualização automática a cada 15 minutos e preservação do último resultado.
- `components/` e `pages/`: interface responsiva, acessível e sem nomes técnicos do INMET.

Os gráficos e indicadores comparativos usam exclusivamente observações reais retornadas pelas APIs. Lacunas não são conectadas nem preenchidas.

## Contrato existente e lacunas

O frontend usa exatamente `GET/POST /dispositivo/`, `PUT/DELETE /dispositivo/{id}` e `GET /leitura/?skip=0&limit=1000`. O contrato atual não possui:

- autenticação;
- campos de município, UF, altitude, status ou última comunicação no dispositivo;
- vínculo persistido com estação INMET;
- histórico oficial do INMET;
- filtro de leituras por `id_dispositivo`, intervalo de datas ou cursor além dos primeiros 1.000 registros.

Por isso o filtro por dispositivo é aplicado no cliente sobre a resposta existente. Para grandes volumes, o backend deverá ganhar paginação/intervalo e `id_dispositivo`; para vínculo permanente, deverá definir e documentar esse relacionamento.

O mapa é esquemático e o botão externo usa OpenStreetMap, sem chave de API. Quando `DISTANCIA_EM_KM` não está presente, aplica-se Haversine.
