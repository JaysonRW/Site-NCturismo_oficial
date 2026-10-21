# Plano de Implementação: Gestão de Leads, Códigos de Empresas & Painel ADM

Este plano estabelece a arquitetura, modelo de dados, fluxos de validação de acesso corporativo e painel de gestão para a **NC Turismo**, com base no alinhamento das respostas:
1. **Destino dos Leads:** Armazenamento em banco de dados Supabase + Notificação automática para `atendimento@ncturismo.com.br` e direcionamento estruturado para o WhatsApp `(41) 99683-0144` (`5541996830144`).
2. **Validação de Códigos Únicos:** Base de empresas gerenciável diretamente pelo **Painel ADM** do site, onde administradores podem cadastrar, visualizar, ativar e revogar empresas conveniadas e seus códigos corporativos.
3. **Recuperação de Código Esquecido:** Formulário de solicitação no portal do beneficiário que registra o pedido no Painel ADM e encaminha os dados preenchidos diretamente ao suporte no WhatsApp da agência para atendimento ágil.

---

## 1. Visão Geral & Decisões Arquiteturais

| Módulo | Decisão Técnica |
|---|---|
| **Captura & Despacho de Leads** | Gravação no Supabase (tabela `leads_parcerias`) + fallback resiliente no `localStorage` + geração de link direto para o WhatsApp oficial com texto contextualizado + trigger de e-mail |
| **Portal do Beneficiário** | Formulário exigindo **Nome da Empresa** + **Código Único da Empresa** (ex: `NC-VOLVO-2026`, `NC-OAB-2026`), validando contra a tabela `empresas_conveniadas` |
| **Recuperação de Código** | Modal intuitivo *"Esqueceu o código de acesso?"* onde o colaborador informa nome, e-mail corporativo, empresa e celular; grava o pedido em `solicitacoes_codigo` e abre atendimento no WhatsApp |
| **Painel Administrativo (`#admin`)** | Duas novas abas dedicadas: **"Leads & Parcerias"** (com filtros, status de contato, exportação CSV e atalhos rápidos) e **"Empresas Conveniadas"** (cadastro de empresas, geração de códigos e gestão de convênios) |

---

## 2. Scripts SQL para Atualização do Banco de Dados (Supabase)

Você pode aplicar a seguinte query diretamente no **SQL Editor** do seu painel do Supabase:

```sql
-- ============================================================================
-- 1. TABELA DE LEADS DE PARCERIAS E BENEFÍCIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads_parcerias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    empresa TEXT NOT NULL,
    cargo TEXT,
    interesse TEXT NOT NULL DEFAULT 'beneficios-parcerias',
    tipo_organizacao TEXT,
    publico_beneficiado TEXT,
    quantidade_pessoas TEXT,
    origem_pagina TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    privacidade_aceita BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'novo', -- 'novo', 'em_contato', 'proposta_enviada', 'convertido', 'descartado'
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. TABELA DE EMPRESAS CONVENIADAS & CÓDIGOS ÚNICOS DE ACESSO
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.empresas_conveniadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    codigo_acesso TEXT NOT NULL UNIQUE, -- Ex: 'NC-COPEL-2026', 'NC-RENAULT-2026'
    dominio_email TEXT, -- Opcional: ex 'copel.com', 'renault.com'
    desconto_percentual NUMERIC DEFAULT 10,
    tipo TEXT DEFAULT 'empresa', -- 'empresa', 'associacao', 'cooperativa', 'federacao'
    ativa BOOLEAN NOT NULL DEFAULT true,
    total_beneficiados_estimado INTEGER DEFAULT 0,
    contato_rh_nome TEXT,
    contato_rh_email TEXT,
    contato_rh_telefone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 3. TABELA DE SOLICITAÇÕES DE CÓDIGO (ESQUECI MEU CÓDIGO)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.solicitacoes_codigo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_colaborador TEXT NOT NULL,
    email_corporativo TEXT NOT NULL,
    telefone TEXT,
    nome_empresa TEXT NOT NULL,
    empresa_id UUID REFERENCES public.empresas_conveniadas(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pendente', -- 'pendente', 'atendido', 'invalido'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 4. ÍNDICES E DADOS INICIAIS DE DEMONSTRAÇÃO
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_leads_parcerias_status ON public.leads_parcerias(status);
CREATE INDEX IF NOT EXISTS idx_leads_parcerias_created ON public.leads_parcerias(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_empresas_codigo ON public.empresas_conveniadas(codigo_acesso);

-- Empresas piloto para teste imediato de validação no portal:
INSERT INTO public.empresas_conveniadas (nome, codigo_acesso, tipo, ativa, desconto_percentual)
VALUES 
    ('NC Turismo Matriz', 'NC-TURISMO-VIP', 'empresa', true, 15),
    ('Associação dos Magistrados', 'NC-AMAPAR-2026', 'associacao', true, 10),
    ('Cooperativa de Crédito Sicredi', 'NC-SICREDI-2026', 'cooperativa', true, 12),
    ('Federação das Indústrias', 'NC-FIEP-2026', 'federacao', true, 10)
ON CONFLICT (codigo_acesso) DO NOTHING;

-- Habilitar RLS e criar políticas de leitura/escrita permissivas para clientes da NC
ALTER TABLE public.leads_parcerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_conveniadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_codigo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insercao publica de leads" ON public.leads_parcerias FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de leads autenticada" ON public.leads_parcerias FOR SELECT USING (true);
CREATE POLICY "Permitir atualizacao de leads autenticada" ON public.leads_parcerias FOR UPDATE USING (true);

CREATE POLICY "Permitir consulta publica de empresas ativas" ON public.empresas_conveniadas FOR SELECT USING (true);
CREATE POLICY "Permitir gestao de empresas autenticada" ON public.empresas_conveniadas FOR ALL USING (true);

CREATE POLICY "Permitir insercao publica de solicitacoes" ON public.solicitacoes_codigo FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de solicitacoes autenticada" ON public.solicitacoes_codigo FOR SELECT USING (true);
CREATE POLICY "Permitir update de solicitacoes autenticada" ON public.solicitacoes_codigo FOR UPDATE USING (true);
```

---

## 3. Componentes e Alterações no Frontend

### A. Integração de Despacho no `LeadForm.tsx`
- Persistência assíncrona na tabela `leads_parcerias` do Supabase.
- Disparo de aviso assíncrono para a caixa `atendimento@ncturismo.com.br` via Webhook/Function ou dispatch seguro.
- Atualização do número oficial do WhatsApp para `(41) 99683-0144` (`5541996830144`).
- No pós-envio, botão com visual refinado abrindo o WhatsApp com a mensagem pré-formatada completa.

### B. Portal do Beneficiário em `BeneficiosViagensView.tsx`
- **Validação de Código de Acesso:**
  - Campo de entrada com **Nome da Organização** (com busca/datalist inteligente das empresas cadastradas) e **Código de Acesso Único**.
  - Validação em tempo real no Supabase (com cache local resiliente).
  - Feedback visual de sucesso: *"Convênio Validado: [Nome da Empresa] - Acesso Liberado com Descontos Exclusivos"*.
- **Modal "Esqueci meu código de acesso":**
  - Botão sutil abaixo do campo de código.
  - Campos: Nome completo, E-mail corporativo, Empresa e WhatsApp.
  - Gravação automática em `solicitacoes_codigo` + botão imediato *"Solicitar via WhatsApp do Suporte"*.

### C. Módulos no Painel Administrativo (`AdminDashboard.tsx`)
- **Nova Aba: "Leads & Oportunidades"**
  - Tabela com filtros por status (`Novo`, `Em Contato`, `Convertido`), pesquisa por nome/empresa.
  - Visualização de campos condicionais (público, volume de pessoas) e UTMs completas.
  - Botões de ação rápida: *Abrir WhatsApp*, *Copiar Dados*, *Marcar como Atendido*.
  - Exportação de leads em arquivo `.csv`.
- **Nova Aba: "Empresas Conveniadas"**
  - Tabela de empresas cadastradas com seus códigos únicos de acesso.
  - Botão *"Cadastrar Nova Empresa Conveniada"*:
    - Campos: Nome da Empresa, CNPJ (opcional), Código de Acesso (com botão para gerar código automático ex: `NC-EMPRESA-2026`), Tipo de Organização, % de Desconto, Contato do RH.
  - Toggle de ativação/pausa imediata do código.
  - Lista de solicitações de códigos esquecidos com status de resolução.

---

## 4. Plano de Validação & Testes

1. **Teste de Captura:**
   - Preencher o formulário como empresa com interesse em "Benefícios e Parcerias".
   - Confirmar persistência no Supabase e no `localStorage`.
   - Testar o link do WhatsApp para `5541996830144`.
2. **Teste de Validação de Código:**
   - Digitar código inválido: receber mensagem explicativa e convite para recuperar código.
   - Digitar código válido (`NC-TURISMO-VIP` ou `NC-AMAPAR-2026`): verificar liberação com mensagem de boas-vindas da empresa.
3. **Teste de Recuperação de Código:**
   - Acionar o modal de recuperação, preencher os dados e verificar inserção em `solicitacoes_codigo`.
4. **Teste no Painel Administrativo:**
   - Acessar `#admin` com credenciais ou login rápido.
   - Navegar na aba "Leads" e constatar o lead recém-cadastrado.
   - Criar uma nova empresa com código customizado e testá-lo imediatamente no portal.
5. **Verificação de Compilação & Lint:**
   - Executar `lint_applet` e `compile_applet` para assegurar build 100% limpo.
