# Próximos 10 Passos Lógicos para o Sales Prospector Catarina IA

Baseado no relatório "Sales Prospector Catarina IA - Dossiê Executivo" e nas correções já aplicadas, aqui estão os próximos 10 passos lógicos para estabilizar, proteger e preparar o projeto para produção:

1.  **Implementar Rotação de Refresh Tokens (Auth P2)**
    *   **Contexto**: O relatório aponta "Sem JWT refresh token ou mecanismo de revogação".
    *   **Ação**: Implementar estratégia de Refresh Token com rotação no banco de dados. Adicionar `expiresIn` curto (ex: 15min) para Access Token e longo (ex: 7 dias) para Refresh Token.
    *   **Impacto**: Segurança e UX (sessão persistente segura).

2.  **Migrar Cache In-Memory para Redis (Infra P1/P2)**
    *   **Contexto**: O cache atual é `CacheModule.register({ isGlobal: true })` padrão em memória. O relatório alerta "Cache em memória — não sobrevive a restart".
    *   **Ação**: Configurar `cache-manager-redis-store` no `app.module.ts`. Garantir que `SalesService`, `TelephonyService` e `VectorService` usem a instância Redis.
    *   **Impacto**: Persistência de dados voláteis e suporte a escalabilidade horizontal.

3.  **Configurar Dead Letter Queue (DLQ) Real para Workers (Resiliência P1)**
    *   **Contexto**: Adicionamos logs de falha, mas os jobs falhos apenas "morrem".
    *   **Ação**: Criar uma fila dedicada `failed-jobs` no BullMQ. Implementar lógica para mover jobs falhos após N tentativas para essa fila e criar uma interface/API para reprocessamento manual.
    *   **Impacto**: Observabilidade e recuperação de falhas em processos críticos (envio de e-mail, enriquecimento).

4.  **Implementar Soft Delete e Retenção de Dados (Compliance P2)**
    *   **Contexto**: "Sem soft-delete... Sem retenção automática".
    *   **Ação**: Adicionar campo `deletedAt` (DateTime?) nos modelos `Contact`, `Communication` e `AuditLog`. Criar um CronJob (via `@nestjs/schedule`) para expurgar fisicamente dados antigos (ex: AuditLog > 1 ano).
    *   **Impacto**: Conformidade com LGPD e higiene do banco de dados.

5.  **Refinar PiiRedactionService (Privacidade P2)**
    *   **Contexto**: O serviço atual só cobre CPF e cartão.
    *   **Ação**: Expandir regex para cobrir e-mail, telefone e CNPJ em campos de texto livre antes de enviar para LLMs (Gemini).
    *   **Impacto**: Proteção de dados sensíveis contra vazamento para terceiros (AI providers).

6.  **Criar Testes de Integração (E2E) para Fluxos Críticos (Qualidade P2)**
    *   **Contexto**: "Testes insuficientes".
    *   **Ação**: Criar suíte de testes E2E usando `@nestjs/testing` e `supertest` cobrindo o fluxo completo: Login -> Criar Lead -> Gerar Texto -> Simular Webhook -> Verificar Crédito.
    *   **Impacto**: Garantia de estabilidade antes de deploys.

7.  **Implementar Rate Limiting por Tenant (Segurança/Custo P2)**
    *   **Contexto**: "Throttling global 100 req/min — sem limite por tenant no AI".
    *   **Ação**: Implementar um `ThrottlerGuard` customizado que use `req.user.orgId` como chave. Definir limites específicos para rotas de IA (`/sales/generate`, `/playbooks/generate`).
    *   **Impacto**: Proteção contra abuso e controle de custos da API do Gemini.

8.  **Documentar API com Swagger Completo (DX)**
    *   **Contexto**: O Swagger existe mas precisa de refinamento nos DTOs e Respostas.
    *   **Ação**: Decorar todos os Controllers e DTOs com `@ApiProperty`, `@ApiOperation` e `@ApiResponse`. Garantir que os schemas de Webhook e Auth estejam claros.
    *   **Impacto**: Facilita a integração do Frontend e de parceiros.

9.  **Dockerizar para Produção (DevOps)**
    *   **Contexto**: Preparar para deploy real.
    *   **Ação**: Criar `Dockerfile` otimizado (multi-stage build) para API e Worker. Criar `docker-compose.prod.yml` com Redis e Postgres persistentes e variáveis de ambiente seguras.
    *   **Impacto**: Portabilidade e prontidão para deploy (AWS/GCP/DigitalOcean).

10. **Monitoramento e Alertas (Observabilidade)**
    *   **Contexto**: "Sem SLOs definidos".
    *   **Ação**: Integrar Sentry para captura de erros em tempo real. Configurar health checks mais robustos no `HealthController` (verificar conectividade com Stripe/Twilio/Gemini além do DB).
    *   **Impacto**: Capacidade de resposta rápida a incidentes em produção.
