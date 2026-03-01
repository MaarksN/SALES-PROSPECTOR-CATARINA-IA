# Checklist P0 — Segurança & Auth (Prompt 1)

Fonte: `Sales Prospector Catarina IA.html` (seção `PROMPT 1 — Segurança & Auth (P0s)`).

## Status geral
- **Última atualização:** 2026-02-26
- **Responsável:** Codex
- **Estado:** Em progresso (itens essenciais aplicados em código; validação fim-a-fim pendente no ambiente)

## Tarefas obrigatórias

### 1) `apps/api/src/sales/sales.controller.ts`
- [x] Reativar `@UseGuards(JwtAuthGuard)` em `GET /sales/leads` e `POST /sales/leads`.
- [x] Trocar fallback `default-company-id` por `req.user.orgId`.

### 2) `apps/api/src/auth/auth.service.ts`
- [x] `signIn()` validando senha com `bcrypt.compare(pass, user.passwordHash)`.
- [x] `signUp()` com hash via `bcrypt.hash(pass, 12)`.
- [x] Payload JWT com `orgId` e `role`.
- [x] `expiresIn: '8h'` ao assinar token.

### 3) `apps/api/src/auth/jwt-auth.guard.ts` + `apps/api/src/common/guards/tenant.guard.ts`
- [x] Removido fallback hardcoded de segredo em produção.
- [x] Uso de `process.env.JWT_SECRET` como fonte de segredo.

### 4) `apps/api/src/billing/stripe.controller.ts` + `apps/api/src/main.ts`
- [x] Validação de assinatura de webhook com corpo bruto.
- [x] Decorador `@RawBody()` criado e aplicado no endpoint.
- [x] Parser `raw` configurado para rota `/stripe/webhook`.
- [ ] Substituir fallback atual por `stripe.webhooks.constructEvent(...)` assim que o pacote `stripe` puder ser instalado no ambiente.

### 5) `apps/api/src/organizations/organizations.controller.ts`
- [x] `getMyOrg()` filtrando por vínculo de membership do usuário autenticado.

## Critérios de aceite
- [ ] Endpoints de sales retornam `401` sem bearer válido (pendente teste de integração local).
- [x] `AuthService.signIn` cobre senha válida/inválida com testes unitários.
- [ ] `POST /stripe/webhook` com assinatura inválida retorna `400` (implementado em código; pendente execução e2e local).
- [x] Sem segredo hardcoded no fluxo de guard/module de JWT.
- [ ] Zero erros TypeScript strict (pendente validação completa de build no ambiente atual).

## Bloqueios do ambiente
- Sem acesso ao registry npm neste ambiente (`403`) para instalar dependências adicionais.
- `jest` indisponível localmente para execução imediata dos testes adicionados.
