# Viação Smart

Repositório monorepo da Viação Smart, reunindo o aplicativo atual, o app mobile,
o painel web e o backend.

## Estrutura

- `frontend/app/` - app mobile Expo/React Native das telas de abastecimento e checklists
- `web/` - painel Next.js
- `backend/` - API Django REST
- `docs/` - documentação do projeto
- `src/` - versão Expo atual já existente neste repositório

## App mobile

```powershell
cd frontend/app
npm install
npm start
```

## Painel web

```powershell
cd web
npm install
npm run dev
```

## Backend

Consulte [`.env.example`](.env.example) e execute:

```powershell
docker compose up --build
```

## Aplicativo Expo existente

A versão atual na raiz continua disponível:

```powershell
npm install
npm start
```
