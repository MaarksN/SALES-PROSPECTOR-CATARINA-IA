# Sales Prospector Catarina IA

Monorepo JavaScript/TypeScript para prospecção comercial com:

- **API** em NestJS (`apps/api`)
- **Web app** em React + Vite (`apps/web`)
- **Worker** Node.js com BullMQ (`apps/worker`)
- **Lib compartilhada** (`libs/shared`)
- Orquestração via **Turborepo**

## Requisitos

- Node.js **20+**
- npm **10+**
- (Opcional) Docker e Docker Compose

## Estrutura

```text
apps/
  api/      # Backend NestJS
  web/      # Frontend React + Vite
  worker/   # Worker de filas (BullMQ)
libs/
  shared/   # Utilitários compartilhados
packages/
  sdk/      # SDK interno
```

## Configuração de ambiente

1. Copie o exemplo:

```bash
cp .env.example .env
```

2. Preencha os valores necessários no `.env`.

> O arquivo `.env` é ignorado pelo Git.

## Instalação

```bash
npm install
```

## Execução local

### Rodar tudo em modo desenvolvimento (Turborepo)

```bash
npm run dev
```

### Rodar serviços separadamente

```bash
npm run dev:api
npm run dev:web
npm run dev:worker
```

## Build

```bash
npm run build
```

Build específico:

```bash
npm run build:api
npm run build:web
```

## Testes

Smoke test do monorepo:

```bash
npm test
```

Testes da API:

```bash
npm run test:api
```

## Docker (opcional)

```bash
docker compose up --build
```

## Observações

- O projeto foi importado de um ZIP e reorganizado sem aninhamento de repositório.
- Artefatos binários de verificação (PNG) não são versionados para manter compatibilidade do repositório.
- Se houver problemas de compatibilidade, valide versões de Node/npm e variáveis de ambiente.
