# Notas de Contrato e Decisões Técnicas — Quero Passagem (`ws_v4`)

> **📌 Registro Operacional (Pendência de Credenciais Sandbox):**
> As credenciais oficiais da API Quero Passagem (`QP_USERNAME`, `QP_PASSWORD` e `QP_AFFILIATE_CODE`) serão recebidas e configuradas **amanhã**.
> Enquanto isso, o projeto está focado **100% na experiência de Frontend**, operando de forma transparente com `APP_MODE=demo` e dados estruturados fiéis ao contrato `ws_v4`. Quando as credenciais chegarem amanhã, bastará adicioná-las ao `.env` do servidor e alterar `APP_MODE=sandbox` em `server.ts` — sem necessidade de refatorar nenhum componente do Frontend.

## 1. Visão Geral da Integração
Este documento registra as decisões de arquitetura, normalização de contratos e tratamento de ambiguidades da documentação oficial da API **Quero Passagem (`https://queropassagem.qpdevs.com/ws_v4`)** implementadas no módulo **Rodoviário** da NC Turismo (Etapas A, B e C).

## 2. Isolamento de Credenciais e Segurança (Server-Side Proxy)
- **Decisão**: O frontend React nunca realiza chamadas diretas para `queropassagem.qpdevs.com` e nenhuma variável de credencial (`QP_USERNAME`, `QP_PASSWORD`, `QP_AFFILIATE_CODE`) utiliza prefixo `VITE_`.
- **Implementação**: Todas as chamadas passam exclusivamente pelo backend Express (`/server.ts`) sob o namespace `/api/rodoviario/*`.
- **Opacidade de `travelId`**: Os identificadores brutos de viagem retornados pela Quero Passagem (incluindo chaves compostas de conexão separadas por `|`) são armazenados em memória no servidor (`travelHandleStore`) e substituídos por um `optionId` opaco enviado ao cliente.

## 3. Tratamento de Ambiguidades da Documentação Oficial (`ws_v4`)

### 3.1. `affiliateCode` vs Header `Affiliate-Code`
- **Ambiguidade**: A documentação menciona `affiliateCode` no payload JSON de busca e também o header HTTP `Affiliate-Code` em alguns endpoints.
- **Solução Adotada**: O `QueroPassagemService` em `/server.ts` injeta o `QP_AFFILIATE_CODE` tanto no header `Affiliate-Code` (quando presente) quanto no corpo JSON de `POST /new/search`, garantindo compatibilidade total com qualquer versão do gateway `ws_v4`.

### 3.2. `include-seat-tex` vs `include-seat-tax`
- **Ambiguidade**: A documentação oficial da Quero Passagem apresenta a grafia `"include-seat-tex": true` no exemplo de `POST /new/search`.
- **Solução Adotada**: O serviço envia `"include-seat-tex": true` exatamente conforme documentado pelo provedor e o parser de resposta aceita tanto `seatTax`/`taxPrice`/`tax` quanto preços aninhados em `price`.

### 3.3. Conexões Nativas (`travel-type = "connection"` e `|` no `travelId`)
- **Regra**: Quando o usuário ativa "Incluir conexões", o sistema dispara duas chamadas paralelas e independentes (`direct` e `connection`).
- **Mapa de Poltronas em Conexões**: Quando o `travelId` contém o delimitador `|` (dois trechos), o endpoint `POST /api/rodoviario/seats` consulta `POST /new/seats` mantendo o `travel-id` composto ou desmembrando os segmentos e devolve um array `segments[]` estruturado para que o usuário selecione a poltrona do **Trecho 1** e do **Trecho 2** separadamente.

### 3.4. `seatsLayout`: `matrix` vs `quantity`
- **Regra**: Nem toda viação retorna poltronas numeradas (`matrix`). Quando a API retorna `seatsLayout = "quantity"`, o modal de poltronas exibe claramente a mensagem de alocação por quantidade disponível sem quebrar a renderização 2D.

## 4. Limite de Requisições (Rate Limit) e Estratégia de Cache
- **Orçamento**: Limite de segurança configurado em **90 requisições/minuto** (abaixo do teto de 100 req/min da Quero Passagem).
- **Caches Implementados**:
  - `GET /stops` e `GET /companies`: TTL de 24 horas (86.400s).
  - `POST /new/search`: TTL curto de 60 segundos por chave `from|to|date|type`, preservando `fetchedAt` e `expiresAt` originais.
