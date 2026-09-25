# Telhado Verde

Monorepositório de monitoramento meteorológico com backend FastAPI e dashboard React/TypeScript.

## Estrutura

- `backend/`: API existente, persistência de dispositivos e leituras.
- `frontend/`: cadastro de estações, monitoramento e comparação com uma fonte INMET configurável.

## Backend

```bash
cd backend
poetry install
docker compose up -d
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

A API e sua documentação ficam em `http://localhost:8000`, `/docs`, `/redoc` e `/openapi.json`.

## Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Abra `http://localhost:5173`. Para validar e gerar a versão de produção:

```bash
npm run test
npm run build
```

Consulte [`frontend/README.md`](frontend/README.md) para arquitetura, variáveis de ambiente e lacunas conhecidas do contrato da API.
