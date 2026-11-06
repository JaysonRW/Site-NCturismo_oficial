# Instruções de implementação — Quero Passagem
## Front-end, backend e testes de integração

**Versão:** 1.0  
**Data de referência:** 28/10/2026  
**Idioma da aplicação e da documentação:** português do Brasil  
**Objetivo:** entregar uma aplicação funcional de consulta e venda de passagens rodoviárias, inicialmente privada e voltada a testes no sandbox da Quero Passagem.

> Entregue este arquivo inteiro à IA responsável pelo desenvolvimento. Ele é uma especificação executável de trabalho, com decisões de arquitetura, contratos, comportamentos e critérios de aceite. A aplicação ainda precisa ser construída. As informações do fornecedor foram verificadas na documentação pública; não houve teste autenticado nesta análise.

---

## 1. Instrução principal para a IA desenvolvedora

Atue como desenvolvedor full stack responsável pela implementação completa deste documento.

Crie um projeto executável, com front-end responsivo, backend próprio e integração com a API rodoviária da Quero Passagem. Entregue código, configuração de ambiente, migrações, testes pertinentes e um README com comandos reproduzíveis.

Não entregue somente layout, imagens, pseudocódigo ou respostas simuladas apresentadas como reais. Faça a primeira etapa funcionar de ponta a ponta antes de acrescentar o restante.

Siga estas regras:

1. Inspecione o repositório existente antes de alterar arquivos. Preserve componentes, padrões e trabalho já realizado quando forem compatíveis com este documento.
2. Se o projeto começar do zero, use a arquitetura de referência da seção 4. Se já houver uma stack viável, adapte-a sem reescrever o projeto inteiro apenas por preferência.
3. Consulte as fontes oficiais da seção 2 antes de codificar o adaptador. Diferencie mudanças documentadas, respostas observadas e hipóteses.
4. Nunca invente credenciais, IDs de localidades, viagens, reservas, compras ou respostas do fornecedor.
5. Sem credenciais, implemente e teste o projeto em modo demonstrativo explícito. Deixe a integração real pronta para configuração. Informe exatamente quais testes externos ficaram pendentes.
6. Com credenciais de homologação, realize inicialmente testes de leitura: configuração, localidades, viações, busca e mapa de poltronas.
7. As operações de reserva, checkout e cancelamento devem ser acionadas de forma explícita pelo testador, no sandbox, com dados de teste apropriados. Não execute transações de produção por iniciativa própria.
8. Não peça ao usuário informações que possam ser obtidas deste documento ou da documentação oficial. Resolva decisões comuns de implementação e registre as escolhas.
9. Mantenha arquivos de configuração com exemplos sem segredos e um relatório honesto de validação.
10. Ao terminar, entregue os comandos para iniciar o projeto, a URL local, o que funciona, o que foi testado e eventuais bloqueios concretos.

**Resultado mínimo obrigatório:** abrir a aplicação, escolher origem, destino e data, pesquisar no sandbox, mostrar resultados reais quando houver credenciais e consultar poltronas de uma opção retornada.

**Resultado completo:** acrescentar passageiros, reserva, checkout, acompanhamento da emissão, bilhetes e operações protegidas de gestão e cancelamento.

## 2. Fontes e qualidade das evidências

### 2.1 Fontes oficiais do fornecedor

- Swagger: https://queropassagem.com.br/api/doc
- Arquivo OpenAPI YAML: https://queropassagem.com.br/docs?ws_v4.yaml
- FAQ de integração e homologação: https://queropassagem.com.br/api/faq
- Referência de cartão indicada pela documentação: https://dev.pagbank.uol.com.br/reference/criar-pagar-pedido-com-cartao

A especificação consultada declara **OpenAPI 3.0.0**, título **Quero Passagem - API Rodoviária** e versão **1.0.0**.

O FAQ complementa o YAML com regras operacionais que não estão inteiramente representadas nos schemas, como limite de requisições, IP de produção, comportamento do sandbox, PIX e callbacks.

### 2.2 Como interpretar este documento

- **Regra do fornecedor:** comportamento descrito nas fontes acima.
- **Decisão deste projeto:** arquitetura, nomes das rotas internas, modelos normalizados, limites internos e experiência de uso propostos aqui.
- **Pendente de confirmação:** detalhe ausente, ambíguo ou divergente que exige uma resposta real do sandbox ou esclarecimento do fornecedor.

As rotas `/api/...` deste documento pertencem à nossa aplicação. As rotas `/stops`, `/new/...` e `/purchase/...` pertencem à Quero Passagem.

### 2.3 Procedimento de conferência

Ao iniciar:

1. Baixe uma cópia do YAML oficial para `docs/vendor/queropassagem-openapi.yaml`, quando o ambiente permitir.
2. Registre data, URL de origem e, se possível, checksum do arquivo.
3. Converta para JSON apenas se necessário; YAML já é uma especificação legível por ferramentas.
4. Registre divergências em `docs/contract-notes.md`.
5. Não trate um cliente gerado automaticamente como contrato suficiente: há inconsistências de modelagem a revisar na seção 19.

Se o download não funcionar, leia o Swagger e o FAQ. Não dependa de comandos colados no Console do navegador.

### 2.4 Documentação da stack

Consulte versões compatíveis e fixe as versões efetivamente usadas nos arquivos de dependências:

- React: https://react.dev/
- Vite: https://vite.dev/guide/
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- Pydantic: https://docs.pydantic.dev/latest/
- HTTPX: https://www.python-httpx.org/
- SQLAlchemy: https://docs.sqlalchemy.org/
- Alembic: https://alembic.sqlalchemy.org/
- PostgreSQL: https://www.postgresql.org/docs/
- Redis: https://redis.io/docs/latest/
- Playwright: https://playwright.dev/
- OpenAPI 3.0 — estrutura de componentes: https://spec.openapis.org/oas/v3.0.3.html#components-object

Não utilize uma versão experimental apenas por ser a mais recente.

## 3. Escopo funcional e ordem de entrega

| Etapa | Funcionalidades | Condição de conclusão |
|---|---|---|
| A — Base executável | Estrutura, configuração, modo demo/sandbox, backend, interface e testes locais | Projeto inicia com comandos documentados |
| B — Pesquisa real | Localidades, viações, viagens diretas e conexões | Busca autenticada com dados do sandbox quando houver acesso |
| C — Poltronas | Layout, andares, disponibilidade e seleção | Mapa correspondente a uma viagem selecionada |
| D — Reserva | Passageiros, seguro opcional, ida e volta, prazo de expiração | Booking criado e consultável no sandbox |
| E — Compra | Métodos disponíveis, checkout, PIX, estados e emissão | Fluxo de homologação validado para cada método habilitado |
| F — Gestão | Consulta/listagem, bilhetes, callbacks, reconciliação e cancelamentos | Operações protegidas com rastreabilidade e validação |

Não deixe as etapas A, B e C incompletas para construir uma área administrativa extensa.

### 3.1 Fora do escopo inicial

- API de hotelaria ou outros produtos não descritos nesta documentação rodoviária.
- Cupons promocionais: a API consultada não oferece esse recurso.
- Cálculo de comissão como se fosse fornecido pela API.
- Combinação manual automática de trechos com compras independentes.
- Publicação comercial em produção antes de cumprir os requisitos do fornecedor.
- CRM completo, programa de fidelidade, marketplace e cadastro público de clientes.

O endpoint de sugestões de conexão deve existir no adaptador e no painel técnico protegido. A venda principal deve priorizar conexões nativas retornadas pela busca de conexões.

## 4. Arquitetura de referência

Para um projeto novo, adote:

| Camada | Escolha de referência | Responsabilidade |
|---|---|---|
| Front-end | React + TypeScript + Vite | Interface, formulários e estados de navegação |
| Estilos | CSS ou Tailwind, com componentes acessíveis | Layout responsivo e identidade configurável |
| Backend | Python + FastAPI + Pydantic | Validação, regras e API interna |
| Cliente HTTP | HTTPX assíncrono | Comunicação autenticada com a Quero Passagem |
| Persistência | PostgreSQL + SQLAlchemy + Alembic | Sessões, reservas, compras e reconciliação |
| Cache/coordenação | Redis | Cache, orçamento de requisições e coordenação entre processos |
| Processamento assíncrono | Worker Python com tarefas persistidas no PostgreSQL | Callbacks e reconciliação |
| Testes | pytest, testes de componentes e Playwright | Contratos críticos e fluxos principais |
| Ambiente local | Docker Compose | Execução reproduzível dos serviços |

Use Python e Node em versões suportadas pelas dependências escolhidas. Registre as versões no README e fixe dependências com lockfiles.

O navegador chama exclusivamente o nosso backend para dados da Quero Passagem. O backend adiciona Basic Auth e affiliateCode e chama o fornecedor.

Um único proxy de entrada deve servir o front-end e encaminhar `/api` ao backend. Durante o desenvolvimento, configure o proxy do Vite. Se origens diferentes forem indispensáveis, use uma lista explícita de origens permitidas.

Não implemente um proxy genérico que aceite qualquer URL, método ou caminho enviado pelo navegador.

### 4.1 Estrutura sugerida

- `apps/web/src/features/search/`
- `apps/web/src/features/seats/`
- `apps/web/src/features/booking/`
- `apps/web/src/features/checkout/`
- `apps/web/src/features/orders/`
- `apps/web/src/features/test-panel/`
- `apps/web/src/components/`
- `apps/web/src/lib/`
- `apps/api/app/api/`
- `apps/api/app/core/`
- `apps/api/app/integrations/queropassagem/`
- `apps/api/app/services/`
- `apps/api/app/models/`
- `apps/api/app/schemas/`
- `apps/api/app/workers/`
- `apps/api/tests/`
- `tests/e2e/`
- `docs/vendor/`
- `docs/contract-notes.md`
- `docs/test-report.md`
- `compose.yaml`
- `.env.example`
- `README.md`

O adaptador deve oferecer a mesma interface em modo demo e sandbox, permitindo testar a aplicação sem misturar dados entre os modos.

## 5. Ambientes e configuração

### 5.1 Endereços do fornecedor

| Ambiente | URL base |
|---|---|
| Sandbox | `https://queropassagem.qpdevs.com/ws_v4` |
| Produção | `https://queropassagem.com.br/ws_v4` |

Não derive o ambiente do hostname digitado pelo visitante. O ambiente é configuração exclusiva do servidor.

### 5.2 Exemplo de variáveis

O arquivo `.env.example` deve conter somente placeholders e valores não secretos:

```dotenv
APP_ENV=development
APP_MODE=demo
APP_NAME=Consulta de Passagens
APP_PUBLIC_URL=http://localhost:5173
APP_ALLOWED_ORIGINS=http://localhost:5173

DATABASE_URL=postgresql+asyncpg://APP_USER:APP_PASSWORD@db:5432/qp_app
REDIS_URL=redis://redis:6379/0

SESSION_SECRET=REPLACE_WITH_RANDOM_SECRET
TESTER_USERNAME=REPLACE_WITH_TESTER_NAME
TESTER_PASSWORD_HASH=REPLACE_WITH_PASSWORD_HASH

QP_ENV=sandbox
QP_USERNAME=
QP_PASSWORD=
QP_AFFILIATE_CODE=

QP_CONNECT_TIMEOUT_SECONDS=10
QP_READ_TIMEOUT_SECONDS=125
QP_MAX_REQUESTS_PER_MINUTE=90
QP_STOPS_CACHE_TTL_SECONDS=86400
QP_COMPANIES_CACHE_TTL_SECONDS=86400
QP_SEARCH_LOCAL_CACHE_TTL_SECONDS=60

QP_ENABLE_CONNECTIONS=true
QP_ENABLE_BOOKING=false
QP_ENABLE_CHECKOUT=false
QP_ENABLE_CANCEL=false
QP_ENABLE_CARD=false
QP_ALLOW_PRODUCTION=false

QP_CALLBACK_URL=
VITE_APP_NAME=Consulta de Passagens
VITE_API_BASE=/api
```

Os TTLs e o orçamento de 90 chamadas são decisões iniciais do projeto, não limites publicados pelo fornecedor. Documente e permita ajuste.

### 5.3 Regras de configuração

- `APP_MODE=demo` usa somente fixtures sintéticas e apresenta a identificação “Demonstração”.
- `APP_MODE=sandbox` exige credenciais reais de homologação e exibe “Ambiente de testes”.
- Não altere automaticamente para demo quando a integração real falhar.
- Não use variáveis com prefixo `VITE_` para usuário, senha, código de afiliado ou segredo de sessão.
- O backend deve rejeitar a inicialização do modo sandbox se faltar configuração obrigatória.
- Derive a URL base de `QP_ENV` usando uma tabela interna fixa.
- `QP_ENV=production` deve falhar enquanto `QP_ALLOW_PRODUCTION` não estiver explicitamente habilitado.
- Em produção, rejeite modo demo, configuração incompleta e flags de acesso inseguras.
- As flags de escrita são verificadas no backend. Ocultar um botão não é controle suficiente.
- Forneça um comando local para gerar o segredo de sessão e o hash da senha do testador.
- Não inclua segredos em logs, screenshots, URLs da nossa aplicação ou arquivos de evidência.
- Não reutilize as credenciais da Quero Passagem como login do nosso aplicativo.

## 6. Pré-requisitos para testar a integração real

Será necessário obter com a Quero Passagem:

1. Usuário de homologação.
2. Senha de homologação.
3. Código de afiliado associado ao usuário; o FAQ descreve um código de três caracteres.
4. Habilitação de conexões e confirmação manual, caso esses cenários sejam testados.
5. Saldo/limite fictício e métodos de pagamento disponíveis para o afiliado de teste.
6. Orientação sobre dados de passageiros e documentos aceitos nos testes, quando necessária.

Para callback, é necessária uma URL HTTPS alcançável pelo fornecedor. Um endpoint apenas em localhost não recebe notificações externas. Enquanto essa URL não existir, deixe explícita a pendência e valide a reconciliação por consulta protegida.

Para produção, confirme homologação, credenciais próprias, afiliado habilitado e política de IP de saída.

**Atenção à hospedagem:** o FAQ descreve allowlist de IP público/NAT em produção. Escolha uma infraestrutura com saída compatível ou obtenha a liberação aplicável com o fornecedor. Não presuma que qualquer hospedagem serverless funcionará sem essa verificação.

O fornecedor informa timeout máximo de dois minutos. O cliente, o proxy e a hospedagem precisam suportar a estratégia adotada. O read timeout inicial de 125 segundos é uma decisão técnica; considere também conexão, fila e processamento no prazo total. Caso a plataforma limite requisições curtas, implemente jobs e consulta de resultado.

## 7. Autenticação e cliente Quero Passagem

### 7.1 Autenticação externa

A API declara HTTP Basic Auth:

```http
Authorization: Basic BASE64(usuario:senha)
Accept: application/json
```

Para requests com corpo JSON, envie também `Content-Type: application/json`.

Use a implementação de Basic Auth da biblioteca HTTP. Não construa tokens manualmente no navegador.

O affiliateCode entra:

- No caminho das duas buscas GET.
- No corpo de `POST /new/booking`.
- No corpo de `POST /purchase/list`.
- No antigo POST de busca, que não será usado em novas implementações.

Não acrescente o campo indiscriminadamente nos demais endpoints.

### 7.2 Comportamentos do cliente

Implemente um cliente central com:

- Base URL fixa por ambiente.
- Autenticação aplicada somente ao host esperado.
- TLS verificado; não desative verificação de certificado.
- Redirecionamentos externos não seguidos com credenciais.
- Timeouts e cancelamento controlados.
- Validação de status e de tipo de conteúdo.
- Limite de tamanho de resposta adequado e configurável.
- Tratamento de HTML de gateway como erro de integração, sem repassá-lo ao usuário.
- Parse de erros do fornecedor e tradução para códigos internos.
- Logs com requestId, operação, duração, status e ambiente, sem payloads privados.
- Limitação global das chamadas conforme a seção 16.
- Validação de respostas separada da validação das entradas.

Não aceite credenciais ou affiliateCode arbitrários no payload do visitante.

## 8. Mapa completo dos endpoints identificados

Os caminhos abaixo são relativos a `/ws_v4`.

| Método | Caminho externo | Uso |
|---|---|---|
| GET | `/companies` | Listar viações |
| GET | `/companies/{companyId}` | Detalhar uma viação |
| GET | `/stops` | Listar cidades, estações e rodoviárias |
| GET | `/stops/{stopId}` | Detalhar uma localidade |
| POST | `/new/search` | Busca antiga, obsoleta; não usar no fluxo novo |
| GET | `/new/search/{from}/{to}/{travelDate}/{affiliateCode}` | Buscar viagens diretas |
| GET | `/new/search-connections/{from}/{to}/{travelDate}/{affiliateCode}` | Buscar viagens com conexão |
| POST | `/new/seats` | Consultar poltronas |
| POST | `/new/booking` | Criar pré-reserva |
| GET | `/new/booking/{bookingID}` | Consultar pré-reserva |
| DELETE | `/new/booking/{bookingID}` | Remover pré-reserva ativa |
| POST | `/new/checkout` | Processar pagamento e compra |
| POST | `/purchase/list` | Listar compras do afiliado |
| POST | `/purchase/get` | Consultar uma compra |
| POST | `/purchase/voucher/cancel` | Solicitar cancelamento por passageiro/bilhete |
| POST | `/purchase/cancel` | Solicitar cancelamento da compra |
| POST | `/purchase/updateExternalId` | Atualizar referência externa |
| GET | `/new/payment/key` | Obter chave pública para cartão tokenizado |
| POST | `/connection/suggestions` | Consultar sugestões de conexão manual |

São **19 operações documentadas**, incluindo o POST de busca obsoleto. O cliente novo deve implementar as 18 operações atuais; nem todas precisam aparecer na jornada principal.

### 8.1 Tipos dos identificadores

| Identificador externo | Tipo a respeitar |
|---|---|
| companyId no caminho de detalhe | Inteiro positivo |
| stopId / from / to | String retornada pelo catálogo, como CIT_... ou ROD_... |
| travelId | String opaca; pode conter separador de conexão |
| bookingID / bookingId | String opaca |
| ID da compra | Inteiro positivo |
| passengerId da compra | Inteiro positivo |
| externalId | String de correlação definida pelo nosso backend |

Os textos entre sinais de menor/maior nos exemplos são placeholders. Substitua-os pelo valor real e pelo tipo correto: um ID numérico no JSON enviado ao fornecedor deve continuar numérico, mesmo quando o placeholder ilustrativo aparece entre aspas. O número 123456 usado em exemplos não representa uma compra utilizável.

## 9. API interna a construir

Todas as rotas abaixo são decisões deste projeto. O backend deve gerar sua própria documentação OpenAPI.

| Rota interna | Permissão e finalidade | Integração |
|---|---|---|
| `GET /api/health` | Saúde básica sem segredos | Sem chamada ao fornecedor |
| `POST /api/session/login` | Login do testador, com limite de tentativas | Autenticação local |
| `POST /api/session/logout` | Encerrar sessão | Autenticação local |
| `GET /api/config` | Configuração pública mínima da sessão | Modo e features, sem credenciais |
| `GET /api/stops?q=...` | Autocomplete local/cache | `GET /stops` |
| `GET /api/stops/{stopId}` | Detalhe da localidade | `GET /stops/{stopId}` |
| `GET /api/companies` | Lista/cache | `GET /companies` |
| `GET /api/companies/{companyId}` | Detalhe da viação | `GET /companies/{companyId}` |
| `GET /api/search?from=...&to=...&date=...&kind=direct` | Busca direta | Busca GET direta |
| `GET /api/search?...&kind=connection` | Busca de conexões | Busca GET com conexões |
| `POST /api/seats` | Mapa de uma opção válida da sessão | `POST /new/seats` |
| `POST /api/bookings` | Criar reserva da sessão | `POST /new/booking` |
| `GET /api/bookings/{localBookingId}` | Consultar reserva pertencente à sessão | `GET /new/booking/{bookingID}` |
| `DELETE /api/bookings/{localBookingId}` | Remover reserva com ação explícita | `DELETE /new/booking/{bookingID}` |
| `GET /api/payments/public-key` | Chave pública para método habilitado | `GET /new/payment/key` |
| `POST /api/checkouts` | Checkout com chave de idempotência local | `POST /new/checkout` |
| `GET /api/orders/{localOrderId}` | Consultar compra pertencente à sessão | `POST /purchase/get` |
| `POST /api/orders/{localOrderId}/cancel` | Cancelar compra da sessão com confirmação | `POST /purchase/cancel` |
| `POST /api/orders/{localOrderId}/cancel-passenger` | Cancelar bilhete autorizado | `POST /purchase/voucher/cancel` |
| `POST /api/webhooks/queropassagem` | Receber gatilho externo | Enfileirar reconciliação |
| `POST /api/admin/purchases/search` | Apenas administração/testador autorizado | `POST /purchase/list` |
| `PATCH /api/admin/orders/{localOrderId}/external-id` | Administração com auditoria | `POST /purchase/updateExternalId` |
| `POST /api/admin/connection-suggestions` | Painel técnico protegido | `POST /connection/suggestions` |

Os IDs locais devem ser opacos e diferentes dos IDs externos quando apropriado. Verifique propriedade da reserva/compra em cada request. Não basta conhecer um ID ou informar um e-mail para acessar dados na nossa aplicação.

A área de testes pode usar um login de testador e sessões locais, sem implementar cadastro público. Rotas administrativas exigem papel explícito; não dependem apenas de estarem fora do menu.

### 9.1 Resposta de erro interna

```json
{
  "error": {
    "code": "SEARCH_EXPIRED",
    "message": "Essa pesquisa expirou. Faça uma nova busca.",
    "retryable": false,
    "requestId": "identificador-local"
  }
}
```

Adote códigos internos como `VALIDATION_ERROR`, `INTEGRATION_AUTH_FAILED`, `INTEGRATION_ACCESS_DENIED`, `RATE_LIMITED`, `UPSTREAM_TIMEOUT`, `UPSTREAM_UNAVAILABLE`, `CONTRACT_MISMATCH`, `SEARCH_EXPIRED`, `BOOKING_EXPIRED` e `CHECKOUT_OUTCOME_UNKNOWN`.

Uma falha de autenticação do fornecedor não deve ser apresentada como senha incorreta do visitante.

### 9.2 Contratos internos mínimos

Defina os DTOs da nossa API antes de conectar as telas. Os nomes a seguir são decisões do projeto e não campos adicionais do fornecedor.

| Operação | Corpo ou resposta interna |
|---|---|
| Resultado de autocomplete | `{ items: [{ id, name, type, parentLabel? }] }` |
| Resultado de busca | `{ searchId, kind, fetchedAt, expiresAt, items: SearchOption[] }` |
| `POST /api/seats` | `{ optionId, orientation: "horizontal", type: "matrix" }` |
| `POST /api/bookings` | `{ travels: [{ optionId, passengers: [...] }] }` |
| Resposta de booking | `{ localBookingId, expiresAt, paymentMethods, travels }` |
| `POST /api/checkouts` | `{ localBookingId, email, buyer, payment }` |
| Resposta de checkout | `{ localOrderId, status, payment?, travels?, reconciliationPending }` |
| Cancelar compra | Corpo vazio ou motivo interno opcional; a referência vem do pedido local da URL |
| Cancelar bilhete | `{ passengerId }`, validado contra os passageiros do pedido autorizado |

Cada `SearchOption` deve ter `optionId` opaco, origem, destino, viação, partida, chegada, duração em segundos, classe, disponibilidade, layout, preço, regras relevantes e conexão quando existir. Mantenha o `travelId` original no backend, associado à opção, à pesquisa e à sessão.

O backend resolve `optionId` para o identificador externo e rejeita opções expiradas, de outra sessão ou de outro ambiente. Não aceite preço, affiliateCode, callbackURL ou externalId impostos pelo navegador.

Os passageiros da rota interna usam os campos validados da seção 13. Para os valores monetários normalizados, defina uma representação única, por exemplo `{ currency: "BRL", amountCents: 2240 }`, e documente o mapeamento do Decimal externo.

Todas as operações locais de escrita devem aceitar o header `Idempotency-Key`, vinculado à sessão. Esse header é do nosso backend; não o envie ao fornecedor alegando suporte externo.

Regras para status HTTP interno:

- 200/201 para resultado conhecido bem-sucedido, conforme a operação.
- 202 para uma operação aceita que continua em reconciliação.
- 400/422 para entrada inválida.
- 401/403 para autenticação/autorização da nossa aplicação.
- 404 para recurso local não acessível ou inexistente, sem revelar propriedade de outra sessão.
- 409 para conflito de idempotência, estado ou disponibilidade.
- 429 para o limite da nossa aplicação.
- 502/503/504 para erro de contrato, indisponibilidade ou timeout externo conforme o caso.

O corpo de erro continua seguindo a seção 9.1. Não propague um 401 externo como logout do testador.

## 10. Telas e experiência de uso

### 10.1 Direção visual

Crie uma interface limpa, rápida e adequada a celular, tablet e desktop.

- Marca e nome configuráveis, inicialmente “Consulta de Passagens”.
- Fundo claro, bom contraste e cor de ação consistente.
- Busca em destaque; resultados legíveis com preço e horários prioritários.
- Sem inventar logotipo, avaliações, descontos ou selos de confiança.
- Formatação monetária em BRL e textos em português.
- Navegação por teclado, foco visível, labels, mensagens de erro próximas ao campo e avisos acessíveis.
- Layout funcional em larguras próximas a 360 px, 768 px e 1440 px.

### 10.2 Página principal

Campos:

- Origem, com autocomplete.
- Destino, com autocomplete.
- Botão para inverter origem/destino.
- Data de ida.
- Volta opcional.
- Quantidade de passageiros.
- Opção de incluir conexões.
- Botão “Buscar passagens”.

Não considere texto digitado como uma localidade selecionada. Exija um item real retornado pela base.

Valide datas, origem diferente de destino e limite de passageiros conforme a opção escolhida. Não fixe um teto universal que substitua `maximumAllowedPassengers`.

### 10.3 Resultados

Cada card apresenta, quando os dados existirem:

- Nome e logo da viação.
- Origem e destino, com o ponto exato de embarque/desembarque.
- Data/hora de partida e chegada.
- Indicação explícita de chegada em outro dia.
- Duração.
- Categoria da poltrona.
- Preço por passageiro e composição disponível.
- Informação de conexão e tempo de espera.
- Quantidade de lugares, sem garantir disponibilidade até a emissão.
- Comodidades.
- Informação de bilhete eletrônico e confirmação posterior.
- Botão “Selecionar”.

Filtros locais: viação, categoria, faixa de horário, faixa de preço e direto/conexão. Ordenação por preço, partida e duração. Não crie parâmetros de filtro externos que não existam na API.

### 10.4 Estados obrigatórios

A interface deve diferenciar:

- Estado inicial.
- Busca em andamento.
- Resultados diretos prontos e conexões ainda carregando.
- Nenhuma viagem disponível.
- Falha somente na busca de conexões.
- Erro de configuração ou indisponibilidade.
- Busca expirada.
- Poltrona indisponível.
- Reserva expirada.
- Aguardando pagamento.
- Aguardando confirmação.
- Compra emitida.
- Resultado do checkout ainda desconhecido.
- Cancelamento em processamento.

Preserve os dados já digitados quando for seguro recuperá-los. Não mantenha documentos de passageiros em localStorage.

O painel técnico protegido pode mostrar ambiente, status de conexão, IDs mascarados e diagnósticos. A jornada normal do passageiro deve usar termos de negócio, sem detalhes de stack ou payloads.

## 11. Localidades, viações e busca

### 11.1 Localidades

`GET /stops` fornece os identificadores aceitos nas buscas:

- `CIT_...`: cidade.
- `ROD_...`: rodoviária/estação.

Os registros documentados incluem `id`, `name`, `url`, `type` e `substops`. O detalhe pode trazer endereço, estado, coordenadas, imagens e relações cidade/estação.

O FAQ também documenta `GET /stops?showAllSubStops=1`. Esse parâmetro deve ser verificado no sandbox, pois não aparece no YAML consultado.

Implemente:

1. Cache do catálogo no backend.
2. Busca por nome/estado com normalização de acentos e caixa.
3. Limite da quantidade de sugestões retornadas ao navegador.
4. Identificação visual entre cidade inteira e rodoviária específica.
5. Tratamento de coordenadas zeradas como indisponíveis.
6. Atualização do cache configurável e refresh protegido.

O parâmetro `q` da nossa rota é processado pela nossa aplicação; não é um parâmetro de busca documentado para `/stops` do fornecedor.

Não faça uma chamada ao fornecedor para cada tecla digitada. Não mantenha uma tabela estática de IDs presumidos para Curitiba, São Paulo ou qualquer outra cidade.

### 11.2 Viações

Use `GET /companies` para catálogo e `GET /companies/{companyId}` para detalhes/logos.

Faça lazy loading dos detalhes e cache; não solicite todos os detalhes a cada busca. Descrições podem conter HTML: sanitize antes de renderizar, ou transforme em texto.

### 11.3 Busca direta e com conexão

O backend monta os caminhos com:

- `from`: ID real da origem.
- `to`: ID real do destino.
- `travelDate`: data `YYYY-MM-DD`.
- `affiliateCode`: valor da configuração do servidor.

Faça chamadas independentes para diretos e conexões, quando habilitadas. A interface deve poder mostrar diretos antes de as conexões terminarem. Uma falha parcial não deve apagar os resultados válidos da outra chamada.

No backend, conte cada chamada no limite global. Faça coalescência de requests idênticos e cancele resultados obsoletos na UI quando o usuário iniciar outra busca.

### 11.4 Campos relevantes da resposta

| Campo externo | Uso |
|---|---|
| `id` | Identificador usado como travelId |
| `company` | Viações |
| `from` / `to` | Pontos de embarque e desembarque |
| `departure` / `arrival` | Objetos com data e hora local |
| `travelDuration` | Duração em segundos |
| `availableSeats` | Disponibilidade informada |
| `seatsLayout` | `numbered` ou `quantity` |
| `seatClass` | Categoria da poltrona |
| `price` | Preço e taxas |
| `insurance` | Preço do seguro |
| `withBPE` | Indicador de bilhete eletrônico |
| `manualConfirmation` | Possibilidade de confirmação posterior |
| `CPFRequired` | Regra de documento |
| `maximumAllowedPassengers` | Restrição que precisa ser interpretada a partir do contrato real |
| `allowCanceling` e campos de cancelamento | Política aplicável |
| `amenities` | Comodidades |
| `connection` | Dados adicionais da conexão nativa |

Normalize os nomes para o front-end se necessário, preservando a origem de cada campo no adaptador.

### 11.5 Preços e horários

O objeto de preço documenta `seatPrice`, `taxPrice`, `price` e `ccTaxPrice`. Segundo o FAQ, `ccTaxPrice` não compõe o total `price` da busca.

Use Decimal no backend ou centavos inteiros para cálculos internos. Não some taxas por suposição. Na reserva, use as opções e totais de `paymentMethods` para apresentar o valor do método escolhido.

Na ida e volta, faça pesquisas separadas para cada sentido. Não multiplique um valor de ida para estimar a volta. Multiplicação por passageiros é estimativa de interface até a validação da reserva.

Datas e horas de partida/chegada são locais à cidade da rodoviária, sem conversão implícita para UTC. Não interprete uma string sem timezone como UTC. Para cálculos entre cidades, confirme os fusos correspondentes; prefira `travelDuration` quando fornecido.

O modelo comercial NET ou Comissionado é definido no afiliado. A API não informa o modelo nem o valor da comissão; não invente uma comissão no dashboard.

### 11.6 Expiração

O FAQ informa validade de até uma hora em produção e três horas no sandbox. O YAML menciona uma hora nas buscas.

Registre `fetchedAt` e um prazo conservador derivado do ambiente; uma rejeição do fornecedor por expiração prevalece sobre nosso cronômetro. Um cache hit não reinicia a validade do travelId.

Guarde a relação entre a opção selecionada e a sessão. Antes de reservar, consulte poltronas e trate expiração ou alteração de preço/disponibilidade.

## 12. Poltronas e conexões

### 12.1 Payload externo de poltronas

Exemplo estrutural; substitua o identificador por uma viagem real retornada na mesma sessão:

```json
{
  "travelId": "<TRAVEL_ID_RETORNADO_NA_BUSCA>",
  "orientation": "horizontal",
  "type": "matrix"
}
```

Opções documentadas:

- `orientation`: `vertical` ou `horizontal`.
- `type`: `matrix` ou `list`.

A resposta pode incluir diferentes andares e, em conexão nativa, mapas de mais de um trecho.

Renderize usando `position.x`, `position.y`, `position.z` e `floor`. Separe explicitamente andar e trecho; não sobreponha todos os lugares em uma grade única.

Respeite `occupied` e `type`. Elementos sem poltrona vendável, como `emptyOrReservedSpace`, não podem ser selecionados.

Para `seatsLayout=quantity`, implemente um fluxo de quantidade apenas após validar o contrato real. Enquanto não houver evidência suficiente, mostre a restrição e impeça uma reserva com número de poltrona inventado.

### 12.2 Seleção

- Associe uma poltrona a cada passageiro por trecho.
- Impeça duplicação de poltrona dentro do mesmo mapa.
- Atualize o mapa antes de reservar, sem polling agressivo.
- Aceite que a disponibilidade possa mudar entre consulta e compra.
- Se a seleção ficar inválida, peça nova escolha mantendo os demais dados.

### 12.3 Conexão nativa

O travelId pode ser composto e conter `|`. Preserve esse identificador integral no corpo das chamadas.

Use `seatNumber` para o primeiro segmento e `connectionSeatNumber` para o segmento de conexão.

A conexão nativa utiliza um booking e um checkout. O FAQ descreve tratamento conjunto da compra. Não substitua esse fluxo por duas compras independentes.

### 12.4 Sugestão de conexão manual

```json
{
  "from": "<STOP_ID_ORIGEM>",
  "to": "<STOP_ID_DESTINO>",
  "travelDate": "<YYYY-MM-DD>"
}
```

`POST /connection/suggestions` retorna sugestões com `from`, `node` e `to`.

O painel técnico pode mostrar sugestões e permitir pesquisar os segmentos separadamente. Não prometa uma compra única: o FAQ descreve compras independentes e regras próprias de cancelamento para conexões montadas manualmente.

## 13. Passageiros e reserva

### 13.1 Payload externo de booking

```json
{
  "affiliateCode": "<INJETADO_PELO_BACKEND>",
  "travels": [
    {
      "travelId": "<TRAVEL_ID_REAL>",
      "passengers": [
        {
          "name": "<NOME_DO_PASSAGEIRO_DE_TESTE>",
          "travelDocument": "<DOCUMENTO_DE_TESTE_VALIDO>",
          "travelDocumentType": "RG",
          "seatNumber": "<POLTRONA_SELECIONADA>",
          "birthDate": "<YYYY-MM-DD>",
          "insurance": null
        }
      ]
    }
  ]
}
```

O exemplo demonstra estrutura, não oferece dados prontos para envio. Os tipos de documento aceitos e o preenchimento de CPF devem ser confirmados para o cenário testado.

Para conexão nativa, inclua `connectionSeatNumber`. Para ida e volta, inclua o segundo objeto em `travels` com a viagem de retorno e os passageiros/poltronas correspondentes.

A API limita o booking a até dois travels e ao contexto de ida ou ida e volta. Não use essa estrutura como lote genérico de viagens.

### 13.2 Regras de passageiros

- Nome, documento e poltrona conforme o cenário.
- Data de nascimento em `YYYY-MM-DD` quando exigida/enviada.
- Se `CPFRequired=true`, exija CPF válido conforme o contrato real do fornecedor.
- Não invente uma propriedade `cpf` no payload de passageiros sem verificar onde o fornecedor espera esse documento.
- Respeite disponibilidade e limites por opção.
- Seguro é opcional e desmarcado por padrão.
- Para seguro, envie `insurance` com `cpf`, `birthDate` e `cep`.
- Para não contratação, use o formato aceito documentado, como `insurance: null`.
- Não inclua cobertura de seguro inventada: obtenha os termos oficiais aplicáveis antes de disponibilizar contratação comercial.
- Estrangeiros têm condições específicas no FAQ; deixe esse fluxo fora do primeiro teste até validar documento, pagamento e ausência de seguro.

### 13.3 Resposta e validade

O schema `bookingSchema` mostra `id`, `expiresAt`, `paymentMethods` e `travels`. O checkout espera `bookingId`. Faça o mapeamento explicitamente.

O FAQ também usa o termo bookingId para o retorno; confirme o nome realmente recebido e registre a divergência.

Normalize a resposta para um objeto interno com `localBookingId` e referência externa privada. Use `expiresAt` como prazo real. O tempo típico informado no FAQ não deve substituir o timestamp recebido.

A interface apresenta resumo, prazo restante, passageiros e opções de pagamento. Depois da expiração, desabilita checkout e solicita nova consulta/reserva.

Use `GET /new/booking/{bookingID}` para validar a reserva e `DELETE` para remover uma reserva ativa mediante ação do usuário. Resposta 404 pode significar expiração/inexistência; o comportamento depende do estado local.

A pré-reserva não deve ser apresentada como bilhete já emitido.

## 14. Checkout, pagamentos e emissão

### 14.1 Regras gerais

- Mostre apenas métodos presentes em `paymentMethods` da reserva.
- `preApproved` depende da configuração/limite do afiliado; não é pagamento gratuito.
- Revalide reserva, valores, método e propriedade antes do checkout.
- O backend constrói `callbackURL` e `externalId`; não aceita uma URL arbitrária do navegador.
- Crie um pedido local e um externalId estável antes da chamada.
- Desabilite duplo clique na UI e implemente idempotência no backend.
- Não guarde número de cartão, CVV, credenciais ou token de cartão em logs/fixtures.

### 14.2 Exemplo externo de PIX

```json
{
  "bookingId": "<BOOKING_ID_DO_FORNECEDOR>",
  "email": "<EMAIL_DE_TESTE_AUTORIZADO>",
  "buyer": {
    "name": "<NOME_DO_COMPRADOR_DE_TESTE>",
    "cpf": "<CPF_DE_TESTE_VALIDO>",
    "phone": "<TELEFONE_DE_TESTE>"
  },
  "payment": {
    "method": "pix"
  },
  "callbackURL": "<URL_HTTPS_CONFIGURADA_NO_BACKEND>",
  "externalId": "<REFERENCIA_LOCAL_ESTAVEL>"
}
```

Use somente dados de teste apropriados ao ambiente. Credenciais de sandbox não autorizam enviar dados reais desnecessários.

Segundo o FAQ, o PIX pode retornar `payment.pix.qrcode` e `payment.pix.plain`. Exiba o QR Code e o código copia e cola se esses campos estiverem presentes. Não gere um código próprio nem presuma que o pagamento já foi confirmado.

Confirme o comportamento real do PIX no sandbox antes de considerá-lo validado.

### 14.3 Exemplo externo de preApproved

```json
{
  "bookingId": "<BOOKING_ID_DO_FORNECEDOR>",
  "email": "<EMAIL_DE_TESTE_AUTORIZADO>",
  "buyer": true,
  "payment": {
    "method": "preApproved"
  },
  "callbackURL": "<URL_HTTPS_CONFIGURADA_NO_BACKEND>",
  "externalId": "<REFERENCIA_LOCAL_ESTAVEL>"
}
```

Este é o cenário padrão descrito no FAQ. Não aplique `buyer: true` a PIX/cartão indiscriminadamente.

### 14.4 Cartão tokenizado

O fluxo de referência utiliza:

1. `GET /new/payment/key`.
2. Integração oficial do PagBank/PagSeguro para gerar o valor criptografado/tokenizado.
3. Envio no checkout de `payment.method=creditCard`, `payment.token`, `payment.holder` e `payment.lastFourDigits`.

A implementação do SDK e a relação exata entre encryptedCard/token devem ser conferidas na documentação atual do PagBank. Não invente código de tokenização.

Mantenha `QP_ENABLE_CARD=false` até concluir essa verificação. Se o cartão permanecer pendente, a aplicação deve continuar funcional para busca e para os métodos de teste disponíveis.

O fornecedor também documenta envio de dados de cartão, mas este projeto deve priorizar tokenização. Não construa armazenamento de cartão.

As parcelas vêm das opções do booking. O YAML usa `instalment` e `instalments` em partes da resposta, enquanto erros mencionam `payment.installment`; confirme o campo de request antes de enviar parcelamento.

### 14.5 Estados da compra

Estados documentados:

- `awaiting_payment`
- `paid`
- `canceled`
- `in_refund_process`
- `refund`
- `refund_partial`
- `in_confirmation_process`
- `canceled_partial`

Preserve o estado bruto e mantenha uma tradução para a interface. Se aparecer um novo estado, apresente um estado neutro e registre a necessidade de atualizar o contrato.

O passageiro também possui `state` próprio. Não confunda pagamento da compra com emissão de cada bilhete.

O link `bpe` fica no passageiro após a emissão/confirmação aplicável. Exiba “Ver bilhete” somente quando houver URL válida, sem fabricar links. Trate essa URL como informação privada da compra, mesmo que o recurso externo não exija autenticação.

### 14.6 Falhas e resultado desconhecido

Um timeout de checkout não comprova ausência de compra. Não reenvie automaticamente.

Persistir:

- Tentativa local.
- Booking associado.
- ExternalId.
- Estado “resultado desconhecido”.
- Horário e correlação técnica.

Reconcilie por `/purchase/get` usando a referência disponível e o e-mail armazenado, ou por listagem administrativa autorizada se necessário. Não crie outra compra enquanto houver possibilidade de duplicidade.

O FAQ descreve um erro específico de processamento como compra não realizada; não generalize essa interpretação para todo 503, desconexão ou timeout. Só permita nova tentativa após classificar o resultado e verificar que ela é apropriada.

## 15. Compras, callbacks e cancelamentos

### 15.1 Consulta

O endpoint externo `POST /purchase/get` aceita identificação por `id` ou `externalId`, com e-mail conforme o cenário. Use a referência e o e-mail vinculados ao pedido local; não confie em dados arbitrários do navegador para autorização.

O FAQ apresenta uma exceção em que o mesmo usuário autenticado pode consultar apenas com ID. Para o fluxo inicial, preserve o e-mail no backend e siga a forma documentada de consulta.

### 15.2 Listagem administrativa

`POST /purchase/list` exige affiliateCode. O corpo pode incluir filtros de data, status, método de pagamento, passageiro, bilhete, referência externa e cartão.

O FAQ/especificação descrevem:

- Período padrão de compra quando não há filtro.
- Intervalos limitados de data, com divergência de redação sobre a borda de 90 dias.
- `showAllPurchases` controlando escopo de usuário/afiliado.

No primeiro teste, use intervalos curtos, como sete dias. Confirme a borda antes de permitir o máximo. Não exponha `showAllPurchases=true` por padrão.

Não invente paginação no fornecedor. Paginação da nossa tela, se necessária, pode ser aplicada ao conjunto obtido dentro do filtro autorizado.

### 15.3 Callback

A documentação apresenta notificações como:

```json
{
  "id": 123456,
  "change": "purchase_update"
}
```

Outro valor documentado para `change` é `ticket_update`.

O endpoint da nossa aplicação deve:

1. Validar tipo, tamanho e campos do corpo.
2. Relacionar o ID a uma compra local conhecida.
3. Persistir uma tarefa de reconciliação antes de confirmar o recebimento.
4. Responder 200 rapidamente após aceitar o evento de forma durável.
5. Consultar `/purchase/get` com credenciais do servidor no worker.
6. Atualizar a compra somente com a resposta autenticada dessa consulta.
7. Coalescer eventos repetidos e tolerar ordem diferente.
8. Aplicar limites de entrada e de chamadas externas.

Não há assinatura de webhook descrita nas fontes consultadas. Não invente header de assinatura nem confie no evento como comprovação de pagamento. A notificação é um gatilho; a consulta autenticada determina o estado.

Notificações para IDs desconhecidos não devem disparar consultas ilimitadas. Registre o mínimo necessário e ignore-as de forma controlada.

Se a gravação durável falhar, não declare o processamento concluído. O FAQ informa ausência de política automática de retry de notificação, portanto implemente reconciliação periódica independente.

### 15.4 Reconciliação

Implemente um worker com backoff, limite de tentativas, prazo máximo e orçamento global de API.

Monitore compras pendentes e tentativas de checkout com resultado desconhecido. A interface consulta o estado local; cada atualização de tela não deve gerar automaticamente uma chamada externa.

Sugestão inicial de intervalos: 15 s, 30 s, 60 s e depois intervalos maiores, ajustados à fila global. Essa sequência é decisão do projeto e deve ser reduzida ou espaçada conforme o volume.

Não mantenha polling de um segundo por pedido. Não utilize apenas tarefas em memória do processo web para trabalho que precisa sobreviver a reinícios.

### 15.5 Cancelamento

Antes de apresentar ou executar cancelamento:

- Consulte o estado atual.
- Verifique campos de elegibilidade e prazo da compra/passagens.
- Mostre quais passageiros/trechos serão afetados.
- Mostre a multa documentada, quando informada.
- Solicite confirmação explícita na interface.

Compra inteira:

```json
{
  "id": "<ID_DA_COMPRA>",
  "email": "<EMAIL_VINCULADO>"
}
```

Passageiro/bilhete:

```json
{
  "id": "<ID_DA_COMPRA>",
  "passengerId": "<ID_REAL_DO_PASSAGEIRO_NA_COMPRA>",
  "email": "<EMAIL_VINCULADO>"
}
```

O cancelamento parcial usa o ID do passageiro retornado pelo fornecedor, não o índice do array.

Conexões nativas têm restrições ao cancelamento isolado de uma perna. Compras pendentes também possuem regras específicas, incluindo prazo de espera descrito no FAQ. Revalide a regra atual antes de executar.

Distinga pedido de cancelamento, bilhete cancelado, reembolso em processamento e reembolso concluído. Um erro pode indicar que o bilhete foi devolvido e o reembolso depende de atendimento; não informe simplesmente que “nada aconteceu”.

Não envie novamente uma solicitação já em processamento. Para resultado incerto, reconcilie primeiro.

### 15.6 ExternalId

`POST /purchase/updateExternalId` é uma operação administrativa.

Se houver alteração, mantenha o identificador local imutável e um histórico de referências externas. Não destrua a referência usada em tentativas anteriores de checkout/reconciliação.

## 16. Limites, cache e concorrência

### 16.1 Orçamento de chamadas

O FAQ informa **100 requisições por minuto por IP**, abrangendo todos os endpoints, e bloqueio de **30 minutos** ao exceder.

Implemente um limite interno inicial de 90 chamadas por minuto:

- Compartilhado por todos os processos que usam o mesmo IP de saída.
- Aplicado a buscas, catálogos, reservas, pagamentos, worker e administração.
- Com janela deslizante/coordenação atômica, sem rajadas que ultrapassem a janela do fornecedor.
- Considerando cada chamada paralela como uma requisição separada.
- Com filas limitadas e erro recuperável quando não houver orçamento.
- Com prioridade para operações de reserva/compra já em andamento.

Se outros sistemas usarem o mesmo IP, reserve margem adicional. O limite interno não garante proteção se ignorar esse tráfego.

### 16.2 Cache

- Catálogos de localidades/viações: cache configurável, com refresh.
- Resultados de busca: cache curto e chave que inclua ambiente, afiliado, origem, destino, data e tipo de busca.
- Nunca misture resultados de diferentes afiliados.
- Poltronas: sem cache prolongado; qualquer reutilização deve ser muito curta e validada antes da reserva.
- Reservas e compras: estado persistido com reconciliação, não cache público.
- Nunca armazene respostas privadas em CDN pública.

O FAQ descreve cache de busca do próprio fornecedor. Não use isso como justificativa para tratar preço/poltrona como garantia até a compra.

### 16.3 Retentativas

- Operações de leitura: retry limitado com backoff e jitter apenas para falhas transitórias e dentro do orçamento.
- POSTs de consulta, como purchase/get, podem ser tratados por semântica de leitura, não apenas pelo verbo HTTP.
- Erros de validação, autenticação, permissão ou contrato: não repetir automaticamente.
- Booking, checkout, cancelamento e atualização de externalId: não repetir cegamente.
- Em timeout de operação com efeito, consultar o estado antes de decidir qualquer repetição.

## 17. Persistência e idempotência

### 17.1 Entidades mínimas

| Entidade | Dados principais |
|---|---|
| Sessão/testador | Identificador, expiração, papel e vínculo de acesso |
| Pesquisa | Parâmetros, ambiente, afiliado, fetchedAt e validade |
| Opção selecionada | Referência à pesquisa e travelId externo |
| Reserva local | Dono, bookingId externo, expiresAt, estado e seleção |
| Pedido local | Dono, externalId, purchaseId externo, estado e totais |
| Tentativa de operação | Chave, hash do payload, status, resultado e timestamps |
| Evento de callback | Compra conhecida, tipo, recebimento e processamento |
| Tarefa de reconciliação | Referência, próxima execução, tentativas e erro sanitizado |
| Auditoria administrativa | Autor, operação, alvo e resultado |

Mantenha ambiente na identificação de entidades externas para impedir colisões entre demo, sandbox e produção.

Não persista o corpo completo de requests por conveniência. Guarde os campos necessários, limite acesso a dados de passageiros e documente retenção e descarte.

### 17.2 Idempotência da nossa aplicação

O fornecedor não documenta uma chave geral de idempotência. Implemente a proteção local e declare seu alcance.

- Receba uma chave local por operação de escrita.
- Vincule-a ao dono, tipo de operação e hash do payload.
- Use unicidade/transação no banco para bloquear chamadas concorrentes.
- A mesma chave com payload diferente retorna conflito.
- Repetição concluída retorna o resultado local existente.
- Operação em andamento retorna acompanhamento, sem novo envio.
- Operação de resultado desconhecido segue reconciliação.
- Reinício do processo não pode apagar essas garantias.

ExternalId é uma referência de correlação. Não presuma que o fornecedor impeça compras duplicadas por externalId.

Se o worker cair após o fornecedor aceitar uma operação e antes da gravação local, reconcilie; não reenvie automaticamente.

## 18. Segurança aplicável ao projeto

Implemente controles concretos e proporcionais:

1. Segredos apenas no backend, fora do Git e do bundle.
2. Aplicação de testes acessível somente a testadores autorizados quando publicada.
3. Sessão em cookie HttpOnly, SameSite apropriado e Secure em HTTPS.
4. Proteção CSRF nas operações de escrita autenticadas por cookie.
5. CORS explícito quando necessário.
6. Validação de entrada no backend, inclusive IDs, datas e tamanhos.
7. Autorização por dono em reservas, compras e bilhetes.
8. Rotas administrativas separadas e auditadas.
9. Rate limit de login, busca e webhook na nossa aplicação.
10. Sanitização de HTML retornado e validação de URLs exibidas.
11. Redação de dados privados em logs e evidências.
12. Sem chave administrativa fixa embutida no JavaScript público.
13. Sem PII em query strings ou localStorage.
14. Sem endpoints de debug públicos que retornem configuração completa.

O callback externo não utiliza a sessão do testador. A proteção dele segue a seção 15.3, com consulta autenticada e limites próprios.

Para demonstração local, use dados sintéticos inequívocos. Para homologação, use dados autorizados pelo fornecedor; não gere documentos aleatórios alegando que são válidos para testes.

## 19. Ambiguidades e lacunas que a implementação deve tratar

### 19.1 Objetos e arrays

Alguns endpoints declaram uma resposta array e referenciam schemas que também são arrays, como ocorre em catálogos/busca. Outros descrevem objetos, mas os representam como arrays no contrato.

Não aplique `flat(Infinity)` indiscriminadamente.

Para cada endpoint:

1. Observe uma resposta real de sandbox.
2. Crie uma fixture sanitizada.
3. Valide a forma exata.
4. Normalize no adaptador somente as variações comprovadas.
5. Faça a aplicação retornar `CONTRACT_MISMATCH` se encontrar uma forma incompatível.
6. Registre a divergência para manutenção.

Não gere compras fictícias para “corrigir” uma resposta que não foi compreendida.

### 19.2 Pontos específicos

| Ponto | Tratamento exigido |
|---|---|
| `components.requests` no YAML | É uma organização não padrão para componentes OpenAPI 3.0; revisar suporte de geradores e referências antes de usá-los |
| `bookingSchema.id` versus uso de bookingId no FAQ | Confirmar campo recebido e mapear explicitamente para checkout |
| Arrays de booking/checkout/purchase/get | Confirmar formato e cardinalidade; não selecionar o primeiro item sem validar |
| `maximumAllowedPassengers` modelado como objeto/nulável | Confirmar formato real; não comparar um objeto com um número |
| `amenities` | Confirmar objeto/lista antes de renderizar vários itens |
| `showAllSubStops` | Documentado no FAQ, ausente dos parâmetros do YAML consultado |
| `payment.pix` | Detalhado no FAQ, ausente do schema resumido de pagamento consultado |
| Parcelamento | Confirmar spelling e formato do campo enviado |
| Seguro: data de nascimento | Request usa YYYY-MM-DD; o FAQ descreve DD/MM/YYYY no retorno de booking |
| `seatsLayout=quantity` | Validar payload de reserva específico |
| Documentos e CPFRequired | Confirmar o tipo e o campo exigido em cada cenário |
| Assinatura de callback | Não documentada; nunca confiar somente no evento |
| Idempotência externa | Não documentada; não assumir deduplicação do fornecedor |
| Rate-limit headers | Não documentados; não depender de Retry-After existir |
| Erro de gateway/IP | Pode não seguir o JSON usual; classificar sem revelar HTML ao visitante |
| Campos obrigatórios | Nem todos os schemas têm listas required completas; cruzar FAQ, exemplos e respostas reais |

O adaptador pode tolerar campos extras para compatibilidade futura, mas não deve ignorar a ausência de campos essenciais.

### 19.3 Critério para considerar uma função validada

Uma função só recebe a marca “validada no sandbox” após request autenticado e resposta inspecionada. Teste com fixture é validação local, não evidência de integração externa.

Para um endpoint ainda não observado, mantenha o cliente implementado e a validação pendente identificada. Não declare a API inteira testada a partir de uma única consulta bem-sucedida.

## 20. Plano de testes

Os testes automatizados comuns devem funcionar sem rede externa. Chamadas reais ao sandbox ficam em uma suíte separada e opt-in.

### 20.1 Testes locais prioritários

- Credenciais nunca aparecem no bundle, respostas públicas ou logs.
- Configuração inválida impede modo sandbox.
- Produção bloqueada por padrão.
- Datas e IDs inválidos são rejeitados no backend.
- Autocomplete exige uma seleção real.
- Falha de conexões não elimina viagens diretas.
- Resposta antiga de busca não sobrescreve uma busca mais recente.
- Validade de travelId não reinicia em cache hit.
- Poltronas ocupadas, espaços vazios e andares são tratados corretamente.
- Poltronas de conexões são associadas ao trecho correto.
- Expiração de booking bloqueia checkout.
- Duplo clique e chamadas concorrentes não duplicam a operação.
- Timeout de checkout gera reconciliação, não nova compra.
- Sessão A não acessa reserva/compra da sessão B.
- Webhook falso não define pagamento ou emissão.
- Eventos repetidos são processados sem chamadas ilimitadas.
- Limite global considera web, worker e todas as instâncias.
- Formatos inesperados do fornecedor geram erro de contrato.
- Reinício durante reconciliação mantém tarefa e estado.
- Nenhuma compra demo é confundida com uma compra sandbox.

### 20.2 Smoke test real de leitura

Com credenciais configuradas:

1. Inicie em sandbox.
2. Consulte `/companies`.
3. Consulte `/stops` e selecione IDs retornados.
4. Busque uma data futura apropriada ao ambiente.
5. Se não houver viagens, registre o resultado vazio; não trate isso automaticamente como erro de código.
6. Selecione uma opção real.
7. Consulte `/new/seats`.
8. Registre status, duração e campos relevantes com dados sanitizados.

Se ocorrer 401/403, verifique configuração, vínculo do afiliado, habilitação e restrições do ambiente. Não tente contornar controles de acesso.

### 20.3 Homologação transacional

A documentação oficial informa cenários para novas OBTs, com condições próprias para parceiros de backoffice. Confirme qual classificação se aplica ao projeto.

Matriz de referência:

| Cenário | Verificação |
|---|---|
| Ida, um passageiro | Busca, poltrona, booking, checkout e consulta |
| Ida e volta, um passageiro | Duas viagens corretas no mesmo booking |
| Ida, dois passageiros | Um com seguro e outro sem |
| Ida e volta, dois passageiros | Poltronas e seguro por passageiro/trecho |
| Conexão só ida, se habilitada | Mapas e duas poltronas por passageiro |
| Conexão ida e volta, se habilitada | Identificadores e trechos corretos |
| Conexão para dois passageiros, se habilitada | Quantidade e associação de poltronas |
| Confirmação manual, se habilitada | Compras pendentes e callbacks de desfecho |
| Cancelamento de teste | Elegibilidade, resposta e reconciliação |
| Reserva expirada | Bloqueio de checkout e recuperação da interface |

Nos cenários comuns, o FAQ orienta usar `manualConfirmation=false`; confirmação manual é um cenário separado. Não cancele antecipadamente as compras que precisam permanecer pendentes para a validação de callback.

Registre os IDs de pedidos de homologação e evidências sanitizadas conforme solicitado pela equipe do fornecedor. O pacote destinado ao fornecedor deve seguir a solicitação deles e ser compartilhado pelo responsável, sem publicar dados de acesso.

### 20.4 Critérios de aceite da interface

- Fluxo funcional em desktop e celular.
- Formulários acessíveis por teclado.
- Preços, datas e prazos apresentados sem ambiguidade.
- Estado de conexão não bloqueia resultados diretos.
- Voltar uma etapa preserva informações apropriadas.
- Falhas recuperáveis oferecem uma ação clara.
- Nenhum botão principal sem implementação real ou indisponibilidade explicada.
- Modo demo e sandbox sempre distinguíveis.
- Nenhum dado de produção usado em screenshots de teste.

## 21. Sequência sugerida de implementação

### Passo 1 — Inicialização

Crie a estrutura, dependências, ambiente, banco, cache, login privado e health check. Entregue o comando de inicialização funcionando.

### Passo 2 — Adaptador

Implemente autenticação, erros, timeouts, limites e modos demo/sandbox. Adicione os métodos atuais mapeados, sem usar o POST de busca obsoleto.

### Passo 3 — Busca

Implemente catálogo, autocomplete, busca direta/conexão e resultados. Valide primeiro com fixtures e depois com sandbox, quando houver credenciais.

### Passo 4 — Poltronas

Implemente leitura de mapas, andares, segmentos e seleção por passageiro. Resolva formato real antes de reservar.

### Passo 5 — Reserva

Implemente formulários, seguro opcional, ida e volta, persistência e controle de expiração. Valide no sandbox com ação explícita do testador.

### Passo 6 — Pagamento

Implemente o método disponível para homologação, valores do booking e controle de duplicidade. Depois acrescente PIX e cartão conforme a habilitação e evidências disponíveis.

### Passo 7 — Estado e emissão

Implemente compra local, consulta, callback, worker, reconciliação e bilhete.

### Passo 8 — Gestão

Implemente listagem protegida, cancelamentos e atualização administrativa de externalId. Aplique elegibilidade e auditoria.

### Passo 9 — Revisão

Execute testes, build, validação responsiva e verificação de segredos. Produza relatório e instruções de execução. Não amplie o escopo enquanto houver falha nos fluxos obrigatórios.

## 22. Execução e entrega do projeto

A IA deve implementar e testar um fluxo reproduzível, preferencialmente com Docker Compose:

```bash
docker compose up --build
```

Esse comando é uma meta de entrega; o projeto ainda será criado. O README deve informar portas, migração inicial, criação do testador e eventuais comandos adicionais realmente necessários.

Também devem existir comandos documentados para:

- Instalar dependências do front-end.
- Rodar front-end e backend em desenvolvimento.
- Executar migrações.
- Gerar hash de senha e segredo de sessão.
- Executar testes locais.
- Executar smoke tests opt-in no sandbox.
- Gerar build do front-end.
- Iniciar o worker.
- Limpar somente dados de teste mediante ação explícita.
- Configurar callback HTTPS.
- Alterar de demo para sandbox.

Não apresente comandos que não tenham sido implementados.

### 22.1 Entregáveis obrigatórios

1. Código do front-end e backend.
2. Arquivos de dependências e lockfiles.
3. `.env.example` sem segredos.
4. Dockerfiles e Compose funcionais.
5. Migrações e persistência mínima.
6. Cliente Quero Passagem com modelos e tratamento de erros.
7. Fixtures claramente sintéticas ou sanitizadas.
8. Testes relevantes.
9. README de execução e configuração.
10. `docs/contract-notes.md` com divergências reais.
11. `docs/test-report.md` com validações executadas.
12. Documentação das rotas internas.

### 22.2 Modelo do relatório de testes

Para cada cenário, registrar:

- Ambiente e data.
- Objetivo.
- Pré-condições.
- Operação testada.
- Resultado esperado.
- Resultado observado.
- Status: passou, falhou ou não executado.
- Motivo quando não executado.
- Evidência sanitizada.
- Pendência e impacto.

“Não executado por falta de credenciais” é uma conclusão válida. “Integração pronta e validada” sem chamadas reais não é.

### 22.3 Critério final de conclusão

O trabalho estará pronto para testes do usuário quando:

- A aplicação iniciar pelo procedimento documentado.
- O modo demo permitir percorrer os fluxos sem chamadas externas.
- O modo sandbox estiver conectado ou exigir apenas as credenciais/configurações claramente identificadas.
- A busca e o mapa de poltronas estiverem funcionais.
- As operações de escrita estiverem implementadas com flags e proteção contra duplicidade.
- Cada método de pagamento não validado permanecer explicitamente indisponível.
- Nenhum segredo for entregue no código ou na interface.
- As pendências forem específicas e verificáveis.

O trabalho estará homologado apenas depois de cumprir os cenários exigidos pelo fornecedor e receber a liberação aplicável. Este documento não substitui essa validação.

## 23. Mensagem curta para acompanhar este arquivo

> Implemente o projeto descrito neste Markdown. Primeiro inspecione o repositório e valide as fontes oficiais. Construa front-end e backend funcionais, seguindo a ordem de entrega e usando sandbox por padrão. Não entregue apenas um protótipo visual. Se faltarem credenciais, conclua a implementação e os testes locais em modo demo explícito, deixando a integração real pronta para configuração e informando quais testes externos não foram executados. Não invente contratos ou respostas, não exponha segredos e não execute transações de produção. Entregue código, comandos de execução, documentação e relatório de testes.

---

**Resumo do que falta fornecer para testes reais:** usuário de homologação, senha de homologação, affiliateCode e, para cenários assíncronos, uma URL HTTPS de callback. Os demais passos de implementação estão definidos neste documento.
