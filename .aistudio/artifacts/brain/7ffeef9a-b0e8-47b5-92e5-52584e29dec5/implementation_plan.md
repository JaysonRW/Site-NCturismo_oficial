# Módulo Rodoviário NC Turismo — Consulta de Passagens e Mapa de Poltronas (Fase 1: Etapas A, B e C)

Implementação da nova vertical **Rodoviário** no portal da NC Turismo, entregando uma experiência completa de pesquisa de passagens rodoviárias (diretas e conexões), filtros avançados e consulta/seleção interativa de poltronas em múltiplos andares, sustentada por um backend próprio com adaptador para a API Quero Passagem (`ws_v4`) operando em **Modo Demonstração explícito** por padrão e pronto para chaveamento imediato para **Sandbox** via variáveis de ambiente.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo consolidam suas escolhas confirmadas e as regras de segurança e arquitetura da especificação da Quero Passagem antes de iniciarmos a codificação.

- **Escopo Confirmado da Fase 1 (Etapas A, B e C)**:
  - **Etapa A (Base Executável & Backend Proxy)**: Servidor backend Express integrado ao Vite na porta 3000 expondo as rotas internas `/api/rodoviario/*`, controle de orçamento de chamadas (rate-limit de 90 req/min), cache de catálogos e separação estrita entre `APP_MODE=demo` e `APP_MODE=sandbox`.
  - **Etapa B (Pesquisa Rodoviária Real/Demo)**: Autocomplete de localidades (`CIT_...` cidades e `ROD_...` rodoviárias), catálogo de viações, busca independente de viagens diretas e conexões, filtros locais (viação, classe da poltrona, turno de partida, faixa de preço e tipo de viagem) e ordenação.
  - **Etapa C (Mapa de Poltronas Multi-Andar & Conexões)**: Renderização matricial (`position.x`, `position.y`, `floor`) diferenciando 1º e 2º andar, trechos de conexão, assentos livres, ocupados e espaços não vendáveis (`emptyOrReservedSpace`), permitindo selecionar poltronas por passageiro.
- **Modo de Operação Inicial Confirmado**:
  - **Modo Demo Ativo + Proxy Sandbox Pronto**: Sem credenciais externas configuradas, o sistema opera com fixtures sintéticas fiéis ao contrato `ws_v4` e exibe identificação clara de ambiente (**"Modo Demonstração"**). Ao preencher `QP_USERNAME`, `QP_PASSWORD`, `QP_AFFILIATE_CODE` e `APP_MODE=sandbox` no servidor, o adaptador passa a consultar `https://queropassagem.qpdevs.com/ws_v4` com HTTP Basic Auth sem expor segredos no navegador.
- **Posicionamento Confirmado na Navegação**:
  - **Item Direto no Menu Principal (`Rodoviário`)**: Adicionado na barra superior principal do cabeçalho (desktop e mobile) levando diretamente à view `#rodoviario`.
- **Evolução Planejada (Fase 2 — Etapas D, E e F)**:
  - Pré-reserva (`POST /new/booking`), checkout (`pix`, `preApproved`, cartão tokenizado), webhooks e cancelamentos ficarão preparados na arquitetura e serão ativados na Fase 2 após homologação da leitura no Sandbox.

---

## 1. Overview & Core Concept

- **What It Does**: Permite que viajantes corporativos, clientes conveniados e passageiros individuais pesquisem passagens de ônibus intermunicipais e interestaduais diretamente no portal da NC Turismo, comparem horários, viações, classes de leito/executivo, visualizem conexões e escolham suas poltronas no mapa real do veículo.
- **Target Audience / Persona**: Gestores de viagens corporativas, colaboradores em deslocamento regional, clientes do portal de benefícios e viajantes individuais (B2C) buscando rotas rodoviárias com a chancela de 37 anos da NC Turismo.
- **Key Value**: Centraliza a consulta rodoviária dentro do ecossistema NC Turismo com transparência tarifária, distinção clara entre cidades e rodoviárias específicas, carregamento progressivo (resultados diretos imediatos enquanto conexões são processadas) e segurança de credenciais server-side.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Acesso via Menu Principal**: O usuário clica em **"Rodoviário"** no menu superior e acessa a página dedicada (`#rodoviario`).
  2. **Busca Estruturada com Autocomplete Validado**:
     - Seleção de **Origem** e **Destino** via autocomplete alimentado pelo catálogo (`/api/rodoviario/stops`), diferenciando visualmente Cidade inteira (`CIT_`) de Rodoviária específica (`ROD_`). O sistema exige seleção de um item real da lista (não aceita texto solto) e oferece botão de inversão rápida Origem ↔ Destino.
     - Seleção de **Data de Ida**, **Data de Volta (opcional)**, **Quantidade de Passageiros** (1 a 6) e chave para **Incluir Conexões**.
  3. **Listagem Progressiva & Filtros em Tempo Real**:
     - Disparo independente da busca direta (`kind=direct`) e busca com conexões (`kind=connection`). Os resultados diretos aparecem imediatamente enquanto um indicador discreto informa se as conexões ainda estão carregando.
     - Em viagens de **Ida e Volta**, o usuário navega por abas claras: *1. Selecionar Trecho de Ida* → *2. Selecionar Trecho de Volta*.
     - Barra lateral (desktop) e gaveta (mobile) de filtros locais: Viação, Categoria (`Convencional`, `Executivo`, `Semi-Leito`, `Leito`, `Leito Cama`), Horário de Partida (Manhã, Tarde, Noite, Madrugada), Faixa de Preço e Direto vs. Conexão, além de ordenação por **Menor Preço**, **Menor Duração** ou **Horário de Partida**.
  4. **Inspeção do Mapa de Poltronas (Etapa C)**:
     - Ao clicar em **"Selecionar Poltronas"** em uma viagem, abre-se o painel/modal de layout do ônibus consultando `POST /api/rodoviario/seats`.
     - Se o ônibus tiver 2 andares (Double Decker) ou se for uma conexão com 2 trechos, abas superiores permitem alternar entre **Andar 1 / Andar 2** e **Trecho 1 / Trecho 2**.
     - O usuário seleciona uma poltrona livre para cada passageiro, visualiza o resumo tarifário detalhado (`seatPrice` + `taxPrice` em `BRL`) e pode prosseguir para a conclusão assistida (ou visualizar os detalhes técnicos da pré-reserva de homologação).

- **Visual Identity & Theme**:
  - **Aesthetic Direction**: Alinhamento integral com as páginas institucionais claras da NC Turismo (`#F8FAFC` background canvas, superfícies em branco puro `#FFFFFF` com bordas sutis `#E2E8F0` e destaques em vermelho institucional `#C8102E`, âmbar `#DB8902` e azul-marinho `#0F172A`).
  - **Typography & Tabular Discipline**: Títulos em `Plus Jakarta Sans` / `Outfit`, textos de interface em `DM Sans` e todos os horários (`08:30`, `14:45`), durações (`06h 15m`), números de poltrona (`12`, `24`) e valores monetários (`R$ 184,90`) com `tabular-nums` / `font-mono` para alinhamento vertical perfeito.
  - **Zero-Pill & Anti-Slop Compliance**: Metadados estáticos nos cards de viagem (como tipo de embarque, BPE e política de cancelamento) apresentados em tipografia limpa separada por `·`, reservando botões segmentados exclusivamente para controles interativos (filtros, ordenação, troca de andar/trecho e seleção de poltrona).

- **Interactive Feedback & Motion**:
  - Skeletons geométricos durante o carregamento da busca e do mapa de poltronas.
  - Tratamento explícito de todos os estados exigidos pela especificação: estado inicial com rotas corporativas sugeridas, busca em andamento, resultados diretos prontos com conexões carregando, falha parcial de conexões sem apagar viagens diretas, busca expirada com botão de atualização em 1 clique e poltrona ocupada/indisponível.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Proxy Server-Side Unificado em Node/Express (`server.ts`) Integrado ao Vite**
  - *Chosen Approach*: Configurar um servidor Express em TypeScript (`server.ts`) montando o Vite em desenvolvimento na porta 3000 e servindo as rotas `/api/rodoviario/*`.
  - *Why*: Preserva 100% da aplicação React/TypeScript atual sem exigir um container Python separado no ambiente de preview, mantendo todas as regras mandatórias de segurança da especificação: credenciais `QP_USERNAME`, `QP_PASSWORD` e `QP_AFFILIATE_CODE` restritas ao servidor, nunca expostas em variáveis `VITE_`, e proteção contra chamadas diretas do navegador ao fornecedor.
  - *Alternatives Considered*: Criar um serviço FastAPI separado exigiria múltiplos processos/portas fora do padrão single-port 3000 do ambiente.

- **Decision 2: Adaptador Dual (`DemoAdapter` vs. `SandboxAdapter`) Sem Fallback Silencioso**
  - *Chosen Approach*: O backend verifica `APP_MODE`. Em `demo`, responde com dados sintéticos estruturados conforme o schema `ws_v4` (incluindo cidades do Sul/Sudeste/Brasil, viações reais do catálogo, viagens diretas, conexões com `|` no `travelId` e matrizes 2D de poltronas com 1 e 2 andares) e sinaliza `mode: "demo"`. Em `sandbox`, exige as variáveis `QP_USERNAME`, `QP_PASSWORD` e `QP_AFFILIATE_CODE` preenchidas; se faltarem ou se o fornecedor retornar erro, retorna erro claro (`INTEGRATION_CONFIG_MISSING` ou `INTEGRATION_AUTH_FAILED`) sem mascarar falhas com dados falsos.
  - *Why*: Cumpre estritamente a regra 5.3 da especificação (*"Não altere automaticamente para demo quando a integração real falhar"*).

- **Decision 3: Controle de Orçamento de Requisições (Rate Limiter 90 req/min) e Cache de Catálogo**
  - *Chosen Approach*: Implementar no servidor um limitador de janela deslizante (máximo 90 chamadas por minuto para a Quero Passagem, abaixo do teto de 100 req/min que causa bloqueio de 30 min por IP) e cache em memória com TTL configurável para `/stops` (24h), `/companies` (24h) e buscas idênticas (60s), preservando o `fetchedAt` original para não mascarar a expiração do `travelId`.
  - *Why*: Protege o IP de saída contra bloqueios acidentais durante testes de autocomplete e múltiplas buscas.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (React 19 + Tailwind)                       │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Header Navigation: [Quem Somos] [Viagens Corp.] [Rodoviário] [Lazer]   │  │
│  └───────────────────────────────────────┬────────────────────────────────┘  │
│                                          ▼                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ RodoviarioView (#rodoviario)                                           │  │
│  │  ├─ Banner de Ambiente (Modo Demonstração / Ambiente de Testes Sandbox)│  │
│  │  ├─ BuscadorRodoviario (Autocomplete CIT_/ROD_, Datas, Pax, Conexões)  │  │
│  │  ├─ Filtros & Ordenação (Viação, Classe, Horário, Preço, Direto/Conex.)│  │
│  │  ├─ ListaResultadosViagem (Cards Ida / Volta, Status de Conexões)      │  │
│  │  └─ MapaPoltronasModal (Matriz X/Y, Andar 1/2, Trecho 1/2, Resumo BRL) │  │
│  └───────────────────────────────────────┬────────────────────────────────┘  │
└──────────────────────────────────────────┼───────────────────────────────────┘
                                           │ HTTP JSON (/api/rodoviario/*)
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                 SERVIDOR BACKEND (Express + Vite · Porta 3000)               │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Rotas Internas (/api/rodoviario/*)                                     │  │
│  │  ├─ GET  /api/rodoviario/config         (Modo atual, flags e limites)  │  │
│  │  ├─ GET  /api/rodoviario/stops?q=...    (Autocomplete normalizado)     │  │
│  │  ├─ GET  /api/rodoviario/companies      (Catálogo de viações em cache) │  │
│  │  ├─ GET  /api/rodoviario/search         (Busca direta ou conexão)      │  │
│  │  └─ POST /api/rodoviario/seats          (Mapa de poltronas por option) │  │
│  └───────────────────────────────────────┬────────────────────────────────┘  │
│                                          ▼                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ QueroPassagemService (Rate Budget 90/min + Cache TTL + Session Store)  │  │
│  │  ├─ [APP_MODE = demo]    ──► Fixtures Sintéticas Fiéis ao Contrato v4  │  │
│  │  └─ [APP_MODE = sandbox] ──► HTTP Basic Auth + AffiliateCode Injection │  │
│  └───────────────────────────────────────┬────────────────────────────────┘  │
└──────────────────────────────────────────┼───────────────────────────────────┘
                                           │ HTTPS (Somente quando sandbox)
                                           ▼
                       https://queropassagem.qpdevs.com/ws_v4
```

- **Data Model & State**:
  - **Catálogo de Localidades (`StopItem`)**: `id` (`CIT_...` ou `ROD_...`), `name`, `state`, `type` (`city` | `station`), `parentLabel`.
  - **Sessão de Pesquisa (`SearchSession`)**: Armazena no backend o vínculo entre `searchId`, `optionId` opaco entregue ao front-end, o `travelId` original da Quero Passagem, `fetchedAt` e `expiresAt` (evitando que o cliente manipule `travelId` ou preços).
  - **Opção de Viagem Normalizada (`SearchOption`)**: `optionId`, `company` (`id`, `name`, `logo`), `from` (`id`, `name`), `to` (`id`, `name`), `departure` (`date`, `time`), `arrival` (`date`, `time`, `nextDay`), `durationSeconds`, `seatClass`, `availableSeats`, `seatsLayout` (`numbered` | `quantity`), `price` (`seatCents`, `taxCents`, `totalCents`, `currency: 'BRL'`), `withBPE`, `allowCanceling`, `CPFRequired`, `maximumAllowedPassengers`, `amenities`, e metadados de `connection` (quando aplicável).
  - **Mapa de Poltronas (`SeatMapResponse`)**: Lista de segmentos (`segments` — 1 para viagem direta, 2 para conexão nativa), cada um contendo andares (`floors`), matriz de assentos (`number`, `label`, `x`, `y`, `floor`, `occupied`, `type`: `seat` | `emptyOrReservedSpace` | `driver` | `stairs` | `wc`) e regras de seleção.

- **Interactive Component & State Mapping**:
  - **Autocomplete de Origem/Destino**: Filtra com debounce de 200ms em `/api/rodoviario/stops?q=...`, ignorando acentos/caixa; bloqueia submissão se `originStop.id === destinationStop.id` ou se nenhuma localidade válida da lista tiver sido selecionada.
  - **Busca Paralela Independente**: Dispara `GET /api/rodoviario/search?...&kind=direct` e, se a opção "Incluir conexões" estiver marcada, dispara em paralelo `kind=connection`. Usa `AbortController` para cancelar buscas anteriores caso o usuário altere os filtros e clique em buscar novamente.
  - **Seleção de Poltronas por Passageiro**: No modal de poltronas, o usuário vê a lista de passageiros (`Passageiro 1`, `Passageiro 2`...) e clica nos assentos disponíveis na matriz visual; o componente impede a seleção de `occupied: true` ou espaços estruturais, impede poltronas duplicadas no mesmo trecho e calcula o subtotal em tempo real.
