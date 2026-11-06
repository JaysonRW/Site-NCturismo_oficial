# Relatório de Homologação e Testes — Portal Rodoviário NC Turismo (Etapas A, B e C)

## 1. Resumo da Execução
- **Status Geral**: APROVADO (Etapas A, B e C concluídas e verificadas)
- **Modos Homologados**:
  - `APP_MODE=demo`: Operacional com fixtures sintéticas fiéis aos contratos `ws_v4` (`CIT_`, `ROD_`, conexões com `|`, matrizes Double Decker de 2 andares e células especiais `WC`, `ESC`, `MOT`).
  - `APP_MODE=sandbox`: Proxy server-side pronto para `https://queropassagem.qpdevs.com/ws_v4` com validação explícita de credenciais (`QP_USERNAME`, `QP_PASSWORD`, `QP_AFFILIATE_CODE`).

## 2. Cenários Validados

| ID | Cenário de Teste | Etapa | Resultado |
|----|------------------|-------|-----------|
| T01 | Inicialização Full-Stack Express + Vite na porta 3000 (`server.ts`) | Etapa A | Passou |
| T02 | Isolamento de segredos (zero credenciais `QP_*` no bundle cliente) | Etapa A | Passou |
| T03 | Controle de Rate Limit (sliding window 90 req/min) e Cache `/stops` | Etapa A | Passou |
| T04 | Autocomplete de Origem/Destino diferenciando Cidade (`CIT_`) e Rodoviária (`ROD_`) | Etapa B | Passou |
| T05 | Bloqueio de submissão com texto livre não selecionado ou origem == destino | Etapa B | Passou |
| T06 | Busca paralela e independente para viagens Diretas (`direct`) e Conexões (`connection`) | Etapa B | Passou |
| T07 | Filtros locais (Horário, Classe, Viação, Modalidade, Teto de Preço) e Ordenação | Etapa B | Passou |
| T08 | Suporte a Ida e Volta com abas independentes por trecho | Etapa B | Passou |
| T09 | Renderização do Mapa de Poltronas 2D (`position.x`, `position.y`, `floor`) com Piso 1 e Piso 2 | Etapa C | Passou |
| T10 | Seleção de poltronas em viagens com Conexão (Trecho 1 + Trecho 2 via `|`) | Etapa C | Passou |
| T11 | Bloqueio de clique em assentos ocupados (`occupied: true`) e células de serviço (`WC`, `ESC`, `MOT`) | Etapa C | Passou |
| T12 | Exclusão explícita de checkout/emissão (`POST /new/booking` bloqueado por escopo) | Escopo | Passou |
