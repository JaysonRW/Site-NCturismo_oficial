# Atualização da Página Benefícios e Parcerias (Visão Landing Page)

## 1. Visão Geral do Produto & Arquitetura

A página **Benefícios e Parcerias** será reestruturada para operar como uma **Landing Page de alta conversão com dupla jornada simultânea**:
1. **Acesso Aberto ao Portal de Viagens (B2C / Público Geral e Conveniados)**: Qualquer visitante pode pesquisar voos, hotéis e pacotes no portal da NC Turismo sem necessidade de cadastro prévio, com destaque imediato no topo da página.
2. **Captação de Novas Empresas e Entidades Parceiras (B2B / RH / Associações)**: Apresentação clara de como organizações podem oferecer cupons mensais e vantagens reais de viagem ao seu público, conduzindo gestores ao formulário de parceria empresarial.

### Fluxo de Interação e Arquitetura da Página

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. DOBRA INICIAL (HERO LP + COMO FUNCIONA + BANNER PANORÂMICO)            │
│                                                                           │
│  [Pesquisar viagens no portal →]          [Quero levar à minha empresa]   │
│                 │                                        │                │
│                 ▼                                        ▼                │
│  ┌─────────────────────────────────────┐   ┌───────────────────────────┐  │
│  │ POPUP SUTIL DE ACEITE DOS TERMOS    │   │ Scroll suave até a seção  │  │
│  │ • Leitura rápida / link p/ Termos   │   │ #formulario-parceria      │  │
│  │ • Checkbox de ciência + Confirmar   │   └───────────────────────────┘  │
│  │ • Registra aceite no Supabase +     │                                  │
│  │   localStorage e abre o Portal B2C  │                                  │
│  └─────────────────────────────────────┘                                  │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. SEÇÕES INSTITUCIONAIS REORGANIZADAS ABAIXO DA DOBRA                    │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │ Portfólio 3 Soluções │─▶│ NC Partners          │─▶│ Vitrine Lazer & │  │
│  │ + Cupons Mensais     │  │ (Sindicatos/Entid.)  │  │ Form B2B (#form)│  │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Visual & Experiência do Usuário (UX)

### Paleta e Atmosfera Visual
- **Superfícies**: Fundo principal em branco puro (`#FFFFFF`) e off-white quente (`#FAF8F5`) no banner panorâmico, contrastando com botões de ação primários em azul-marinho profundo (`#0F172A`), acentos em vermelho institucional NC (`#C51822`) e âmbar dourado (`#DB8902`).
- **Tipografia**: Título principal em escala de impacto (`clamp(2.25rem, 4vw, 3.5rem)`), peso `800`, entrelinha firme (`leading-[1.08]`) e subtítulos editoriais de leitura imediata.
- **Ativos Visuais em Alta Definição**:
  - **Foto Principal do Hero (4:3)**: Família no terminal de embarque do aeroporto observando pela janela panorâmica o Pão de Açúcar (Rio de Janeiro) ao pôr do sol dourado, acompanhada do selo flutuante superior direito `NC Turismo • desde 1989`.
  - **Banner Panorâmico de Conversão (16:9)**: Vista aérea dourada do Rio de Janeiro à esquerda com transição suave (*gradient fade*) para creme aquecido à direita, sustentando a chamada corporativa.

---

## 3. Funcionalidades Principais & Comportamento

### A. Nova Dobra Inicial (Fiel ao Layout de Referência)
- **Coluna Esquerda (Proposta de Valor e CTAs)**:
  - Eyebrow com ícone de avião: `NC BENEFÍCIOS`.
  - Título principal: *"Sua próxima viagem começa aqui."*
  - Parágrafo de destaque em negrito: *"Pesquise voos, hotéis e pacotes no portal da NC Turismo. O acesso para consulta é aberto a todos."*
  - Parágrafo complementar: *"Empresas e entidades parceiras podem disponibilizar cupons mensais ao seu público, conforme as regras de cada campanha."*
  - Dupla de botões lado a lado:
    - Primário (`#0F172A`): **Pesquisar viagens no portal →** (aciona o popup sutil de aceite dos Termos).
    - Secundário (borda escura e fundo branco): **Quero levar esse benefício à minha empresa** (rola suavemente até `#formulario-parceria`).
  - Indicador de confiança com ícone dourado: `✓ Consulta aberta • Sem cadastro para pesquisar` (ou badge personalizado caso o visitante acesse via link com `?convenio=` / `?codigo=`).
- **Faixa Horizontal "Como funciona" (3 Passos com Setas)**:
  1. **Pesquise** (ícone de lupa em card rosé suave): *"Encontre voos, hotéis e pacotes para o seu próximo destino."*
  2. **Veja se há um cupom para você** (ícone de cupom em card rosé suave): *"Caso a sua empresa ou entidade seja parceira, aproveite o benefício."*
  3. **Conte com a equipe NC** (ícone de atendimento em card rosé suave): *"Tire dúvidas e tenha apoio especializado para a sua viagem."*
- **Banner Panorâmico de Parceria**:
  - Card horizontal arredondado com imagem panorâmica do Rio à esquerda, frase *"Sua organização pode oferecer mais possibilidades de viagem."* ao centro e botão âmbar **Conversar sobre uma parceria →** à direita.

### B. Popup Sutil de Aceite dos Termos de Uso (Acesso ao Portal)
- **Gatilho**: Acionado ao clicar em **Pesquisar viagens no portal →** (ou qualquer botão de ida ao portal na página), substituindo o antigo bloco pesado que exigia rolar a página.
- **Experiência no Popup**:
  - Modal compacto, elegante e objetivo com explicação clara de que o portal é aberto para pesquisa de voos, hotéis e pacotes.
  - Checkbox de concordância com os **Termos de Uso do Benefício** e a **Política de Privacidade**, permitindo expandir ou consultar o texto integral dentro do próprio modal sem sair da tela.
  - Botão de confirmação **Aceitar e abrir portal de viagens →**, que grava o aceite no Supabase (`recordTermsAcceptance`) e no navegador (`localStorage`) e abre `http://beneficios.ncturismo.com.br/b2c/` em nova aba.
  - Caso o visitante já tenha aceitado os termos anteriormente no dispositivo, o checkbox já vem pré-marcado para acesso com 1 clique (com opção de revisar os termos a qualquer momento).

### C. Organização das Informações Atuais Abaixo da Dobra
- **Portfólio de 3 Soluções + Regra de Cupons Mensais**: Mantém a apresentação clara de *Benefícios de Viagens NC*, *Gestão de Viagens Corporativas* e *Gestão Integrada*, além do card explicativo de como funcionam os cupons mensais para empresas parceiras.
- **NC Partners (Parcerias Institucionais)**: Seção dedicada a sindicatos, associações, conselhos e cooperativas.
- **Vitrine de Lazer & Formulário B2B (`#formulario-parceria`)**: Destaque para viagens personalizadas de lazer e formulário exclusivo para empresas/RH interessados em cadastrar sua organização no programa.

---

## 4. Plano de Verificação e Qualidade
- **Fluxo de Portal Aberto (B2C)**: Verificar que o clique em *"Pesquisar viagens no portal"* exibe imediatamente o popup sutil de aceite, permite ler os Termos/Política sem sair da página, registra o log no Supabase e redireciona ao portal.
- **Fluxo de Parceria (B2B)**: Verificar que os botões *"Quero levar esse benefício à minha empresa"* e *"Conversar sobre uma parceria"* conduzem suavemente ao formulário empresarial (`#formulario-parceria`), sem misturar o formulário B2B com o aceite do portal B2C.
- **Responsividade e Compilação**: Garantir alinhamento fiel ao layout de referência em desktop e adaptação fluida em telas mobile, validando com `compile_applet` e `lint_applet`.
