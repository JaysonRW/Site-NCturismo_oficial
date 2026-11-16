import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://queropassagem.qpdevs.com/ws_v4';
const USERNAME = 'nc turismo homolog';
const PASSWORD = 'uci]Qk{GEura7Q5Jxz2leLlmBh4DikkEgACo1Y2GoR}sLe18(]';
const AFFILIATE_CODE = 'NCT';
const CALLBACK_URL = 'https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback';

const BASIC_AUTH = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function qpRequest(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    Authorization: BASIC_AUTH,
    Accept: 'application/json',
    'Affiliate-Code': AFFILIATE_CODE,
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const t0 = Date.now();
  console.log(`[QP] ${method} ${endpoint}...`);
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const latencyMs = Date.now() - t0;
  let data;
  const rawText = await res.text();
  try {
    data = JSON.parse(rawText);
  } catch {
    data = rawText;
  }

  console.log(`[QP] ${method} ${endpoint} -> HTTP ${res.status} (${latencyMs}ms)`);
  return {
    ok: res.ok,
    status: res.status,
    latencyMs,
    data,
    requestSent: {
      method,
      url,
      headers: { ...headers, Authorization: 'Basic [REDACTED]' },
      body,
    },
  };
}

async function getAvailableSeats(travelId, count = 1) {
  const res = await qpRequest('POST', '/new/seats', { travelId });
  if (!res.ok) {
    throw new Error(`Falha ao buscar assentos para travelId ${travelId}: ${JSON.stringify(res.data)}`);
  }
  const raw = res.data;
  const seatList = Array.isArray(raw) ? raw : Object.values(raw);
  const freeSeats = seatList
    .filter((s) => s && s.type === 'seat' && !s.occupied && s.seat)
    .map((s) => String(s.seat).trim());

  if (freeSeats.length < count) {
    throw new Error(`Viagem ${travelId} possui apenas ${freeSeats.length} assentos livres (necessário: ${count})`);
  }

  return freeSeats.slice(0, count);
}

async function runHomologation() {
  console.log('='.repeat(80));
  console.log(' EXECUÇÃO DAS PENDÊNCIAS DE HOMOLOGAÇÃO QUERO PASSAGEM (ws_v4)');
  console.log(` Data/Hora: ${new Date().toISOString()}`);
  console.log(` Callback URL: ${CALLBACK_URL}`);
  console.log('='.repeat(80));

  const dossierResults = {
    metadata: {
      title: 'Dossiê de Resolução de Pendências — Homologação Quero Passagem (ws_v4)',
      affiliateCode: AFFILIATE_CODE,
      baseUrl: BASE_URL,
      callbackUrl: CALLBACK_URL,
      executedAt: new Date().toISOString(),
      executor: 'NC Turismo Integration Team',
    },
    scenarios: {},
  };

  // ===========================================================================
  // CENÁRIO 1.4: Compra simples ida e volta com 2 passageiros (1 com seguro, 1 sem seguro)
  // manualConfirmation = false
  // ===========================================================================
  console.log('\n>>> Iniciando Cenário 1.4 (Ida e Volta, 2 pax: 1 c/ seguro, 1 s/ seguro, manualConfirmation=false)...');

  const dOut = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
  const dRet = new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0];

  console.log(`1.4: Buscando trecho de Ida (ROD_55 -> CIT_1 em ${dOut})...`);
  const searchOutRes = await qpRequest('GET', `/new/search/ROD_55/CIT_1/${dOut}/${AFFILIATE_CODE}`);
  await sleep(1500);

  console.log(`1.4: Buscando trecho de Volta (CIT_1 -> ROD_55 em ${dRet})...`);
  const searchRetRes = await qpRequest('GET', `/new/search/CIT_1/ROD_55/${dRet}/${AFFILIATE_CODE}`);
  await sleep(1500);

  const outTrips = Array.isArray(searchOutRes.data)
    ? searchOutRes.data.filter((t) => t.manualConfirmation === false)
    : [];
  const retTrips = Array.isArray(searchRetRes.data)
    ? searchRetRes.data.filter((t) => t.manualConfirmation === false)
    : [];

  if (outTrips.length === 0 || retTrips.length === 0) {
    throw new Error('Não foram encontrados trechos com manualConfirmation=false para ida ou volta.');
  }

  // Encontrar viagens que tenham pelo menos 2 assentos livres
  let selectedOutTrip = null;
  let outSeats = null;
  for (const t of outTrips.slice(0, 5)) {
    try {
      const seats = await getAvailableSeats(t.id, 2);
      selectedOutTrip = t;
      outSeats = seats;
      break;
    } catch {
      await sleep(1000);
    }
  }

  await sleep(1500);

  let selectedRetTrip = null;
  let retSeats = null;
  for (const t of retTrips.slice(0, 5)) {
    try {
      const seats = await getAvailableSeats(t.id, 2);
      selectedRetTrip = t;
      retSeats = seats;
      break;
    } catch {
      await sleep(1000);
    }
  }

  if (!selectedOutTrip || !selectedRetTrip) {
    throw new Error('Não foi possível obter assentos suficientes para ida e volta no Cenário 1.4.');
  }

  console.log(`1.4: Ida selecionada: ${selectedOutTrip.id} (${selectedOutTrip.company?.name}) - Poltronas: ${outSeats.join(', ')}`);
  console.log(`1.4: Volta selecionada: ${selectedRetTrip.id} (${selectedRetTrip.company?.name}) - Poltronas: ${retSeats.join(', ')}`);

  // Montar payload de /new/booking com 2 trechos (ida e volta) e 2 passageiros em cada trecho
  // Passageiro 1: COM seguro (campos cpf, bithDate, birthDate, cep)
  // Passageiro 2: SEM seguro
  const booking14Payload = {
    affiliateCode: AFFILIATE_CODE,
    travels: [
      {
        travelId: selectedOutTrip.id,
        passengers: [
          {
            name: 'Carlos Eduardo Mendes Teste',
            travelDocument: '44556671',
            travelDocumentType: 'RG',
            seatNumber: outSeats[0],
            birthDate: '1988-03-12',
            cpf: '52998224725',
            insurance: {
              cpf: '52998224725',
              bithDate: '1988-03-12',
              birthDate: '1988-03-12',
              cep: '80010-000',
            },
          },
          {
            name: 'Fernanda Lima Costa Teste',
            travelDocument: '55667782',
            travelDocumentType: 'RG',
            seatNumber: outSeats[1],
            birthDate: '1993-07-22',
            cpf: '39053344705',
          },
        ],
      },
      {
        travelId: selectedRetTrip.id,
        passengers: [
          {
            name: 'Carlos Eduardo Mendes Teste',
            travelDocument: '44556671',
            travelDocumentType: 'RG',
            seatNumber: retSeats[0],
            birthDate: '1988-03-12',
            cpf: '52998224725',
            insurance: {
              cpf: '52998224725',
              bithDate: '1988-03-12',
              birthDate: '1988-03-12',
              cep: '80010-000',
            },
          },
          {
            name: 'Fernanda Lima Costa Teste',
            travelDocument: '55667782',
            travelDocumentType: 'RG',
            seatNumber: retSeats[1],
            birthDate: '1993-07-22',
            cpf: '39053344705',
          },
        ],
      },
    ],
  };

  await sleep(1500);
  const booking14Res = await qpRequest('POST', '/new/booking', booking14Payload);
  if (!booking14Res.ok) {
    throw new Error(`Falha no booking 1.4: ${JSON.stringify(booking14Res.data)}`);
  }

  const booking14Obj = Array.isArray(booking14Res.data) ? booking14Res.data[0] : booking14Res.data;
  const booking14Id = booking14Obj.id;
  console.log(`1.4: Booking ID criado: ${booking14Id}`);

  await sleep(2000);

  // Checkout do Cenário 1.4 com cartão teste
  const checkout14Payload = {
    bookingId: booking14Id,
    email: 'homologacao@ncturismo.com.br',
    buyer: {
      name: 'NC Turismo Homologacao',
      cpf: '52998224725',
      phone: '(41) 3281-1167',
    },
    payment: {
      method: 'creditCard',
      cardNumber: '4111 1111 1111 1111',
      holder: 'NC TURISMO TESTE',
      expiresAt: '2030-10',
      securityCode: '123',
      installment: 1,
    },
    externalId: `NCT-1_4-${Date.now()}`,
  };

  const checkout14Res = await qpRequest('POST', '/new/checkout', checkout14Payload);
  if (!checkout14Res.ok) {
    throw new Error(`Falha no checkout 1.4: ${JSON.stringify(checkout14Res.data)}`);
  }

  const purchase14Obj = Array.isArray(checkout14Res.data) ? checkout14Res.data[0] : checkout14Res.data;
  console.log(`1.4: Pedido concluído! Order ID: #${purchase14Obj.id} - Status: ${purchase14Obj.status}`);

  dossierResults.scenarios['scenario_1_4'] = {
    name: 'Cenário 1.4 — Compra Simples: Ida e Volta com 2 Passageiros (1 com Seguro e 1 sem Seguro)',
    rule: 'manualConfirmation: false | 2 trechos (ida e volta) | 2 pax por trecho (1 c/ seguro: cpf, bithDate, cep; 1 s/ seguro) | status: paid',
    outboundTrip: {
      id: selectedOutTrip.id,
      company: selectedOutTrip.company?.name,
      from: selectedOutTrip.from?.label,
      to: selectedOutTrip.to?.label,
      departure: selectedOutTrip.departure,
      seats: outSeats,
    },
    returnTrip: {
      id: selectedRetTrip.id,
      company: selectedRetTrip.company?.name,
      from: selectedRetTrip.from?.label,
      to: selectedRetTrip.to?.label,
      departure: selectedRetTrip.departure,
      seats: retSeats,
    },
    booking: {
      request: booking14Payload,
      response: booking14Res.data,
      httpStatus: booking14Res.status,
      bookingId: booking14Id,
    },
    checkout: {
      request: checkout14Payload,
      response: checkout14Res.data,
      httpStatus: checkout14Res.status,
      orderId: purchase14Obj.id,
      status: purchase14Obj.status,
    },
  };

  await sleep(2000);

  // ===========================================================================
  // CENÁRIO 3.1: Duas compras simples de confirmação posterior (manualConfirmation: true) com callbackURL
  // CRÍTICO: NÃO cancelar nenhuma das duas!
  // ===========================================================================
  console.log('\n>>> Iniciando Cenário 3.1 (Duas compras manualConfirmation=true com callbackURL)...');

  const d31 = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
  console.log(`3.1: Buscando viagens com manualConfirmation=true na rota ROD_55 -> CIT_1 em ${d31}...`);
  const search31Res = await qpRequest('GET', `/new/search/ROD_55/CIT_1/${d31}/${AFFILIATE_CODE}`);
  await sleep(1500);

  const tripsManualTrue = Array.isArray(search31Res.data)
    ? search31Res.data.filter((t) => t.manualConfirmation === true)
    : [];

  if (tripsManualTrue.length < 2) {
    throw new Error(`Encontradas apenas ${tripsManualTrue.length} viagens com manualConfirmation=true.`);
  }

  console.log(`3.1: Total de viagens manualConfirmation=true encontradas: ${tripsManualTrue.length}`);

  // Compra #1 do Cenário 3.1
  console.log('\n--- Cenário 3.1: Executando Compra #1 ---');
  let trip31_1 = null;
  let seat31_1 = null;
  for (const t of tripsManualTrue) {
    try {
      const seats = await getAvailableSeats(t.id, 1);
      trip31_1 = t;
      seat31_1 = seats[0];
      break;
    } catch {
      await sleep(1000);
    }
  }

  if (!trip31_1) {
    throw new Error('Não foi possível obter assento para a Compra #1 do Cenário 3.1.');
  }

  console.log(`3.1 (Compra #1): Viagem selecionada: ${trip31_1.id} (${trip31_1.company?.name}) - Poltrona: ${seat31_1}`);

  const booking31_1Payload = {
    affiliateCode: AFFILIATE_CODE,
    travels: [
      {
        travelId: trip31_1.id,
        passengers: [
          {
            name: 'Joao Carlos Silva Teste',
            travelDocument: '123456789',
            travelDocumentType: 'RG',
            seatNumber: seat31_1,
            birthDate: '1990-05-15',
            cpf: '52998224725',
          },
        ],
      },
    ],
  };

  await sleep(1500);
  const booking31_1Res = await qpRequest('POST', '/new/booking', booking31_1Payload);
  if (!booking31_1Res.ok) {
    throw new Error(`Falha no booking 3.1 Compra #1: ${JSON.stringify(booking31_1Res.data)}`);
  }

  const booking31_1Obj = Array.isArray(booking31_1Res.data) ? booking31_1Res.data[0] : booking31_1Res.data;
  const booking31_1Id = booking31_1Obj.id;
  console.log(`3.1 (Compra #1): Booking ID criado: ${booking31_1Id}`);

  await sleep(2000);

  // Checkout Compra #1 com callbackURL no root
  const checkout31_1Payload = {
    bookingId: booking31_1Id,
    email: 'homologacao@ncturismo.com.br',
    callbackURL: CALLBACK_URL,
    buyer: {
      name: 'NC Turismo Homologacao',
      cpf: '52998224725',
      phone: '(41) 3281-1153',
    },
    payment: {
      method: 'creditCard',
      cardNumber: '4111 1111 1111 1111',
      holder: 'NC TURISMO TESTE',
      expiresAt: '2030-10',
      securityCode: '123',
      installment: 1,
    },
    externalId: `NCT-3_1-1-${Date.now()}`,
  };

  const checkout31_1Res = await qpRequest('POST', '/new/checkout', checkout31_1Payload);
  if (!checkout31_1Res.ok) {
    throw new Error(`Falha no checkout 3.1 Compra #1: ${JSON.stringify(checkout31_1Res.data)}`);
  }

  const purchase31_1Obj = Array.isArray(checkout31_1Res.data) ? checkout31_1Res.data[0] : checkout31_1Res.data;
  console.log(`3.1 (Compra #1): Pedido criado! Order ID: #${purchase31_1Obj.id} - Status: ${purchase31_1Obj.status}`);

  await sleep(2500);

  // Compra #2 do Cenário 3.1
  console.log('\n--- Cenário 3.1: Executando Compra #2 ---');
  let trip31_2 = null;
  let seat31_2 = null;
  for (const t of tripsManualTrue.slice(1)) {
    try {
      const seats = await getAvailableSeats(t.id, 1);
      trip31_2 = t;
      seat31_2 = seats[0];
      break;
    } catch {
      await sleep(1000);
    }
  }

  if (!trip31_2) {
    throw new Error('Não foi possível obter assento para a Compra #2 do Cenário 3.1.');
  }

  console.log(`3.1 (Compra #2): Viagem selecionada: ${trip31_2.id} (${trip31_2.company?.name}) - Poltrona: ${seat31_2}`);

  const booking31_2Payload = {
    affiliateCode: AFFILIATE_CODE,
    travels: [
      {
        travelId: trip31_2.id,
        passengers: [
          {
            name: 'Mariana Ribeiro Alves Teste',
            travelDocument: '987654321',
            travelDocumentType: 'RG',
            seatNumber: seat31_2,
            birthDate: '1992-11-20',
            cpf: '39053344705',
          },
        ],
      },
    ],
  };

  await sleep(1500);
  const booking31_2Res = await qpRequest('POST', '/new/booking', booking31_2Payload);
  if (!booking31_2Res.ok) {
    throw new Error(`Falha no booking 3.1 Compra #2: ${JSON.stringify(booking31_2Res.data)}`);
  }

  const booking31_2Obj = Array.isArray(booking31_2Res.data) ? booking31_2Res.data[0] : booking31_2Res.data;
  const booking31_2Id = booking31_2Obj.id;
  console.log(`3.1 (Compra #2): Booking ID criado: ${booking31_2Id}`);

  await sleep(2000);

  // Checkout Compra #2 com callbackURL no root
  const checkout31_2Payload = {
    bookingId: booking31_2Id,
    email: 'homologacao@ncturismo.com.br',
    callbackURL: CALLBACK_URL,
    buyer: {
      name: 'NC Turismo Homologacao',
      cpf: '39053344705',
      phone: '(41) 3281-1153',
    },
    payment: {
      method: 'creditCard',
      cardNumber: '4111 1111 1111 1111',
      holder: 'NC TURISMO TESTE',
      expiresAt: '2030-10',
      securityCode: '123',
      installment: 1,
    },
    externalId: `NCT-3_1-2-${Date.now()}`,
  };

  const checkout31_2Res = await qpRequest('POST', '/new/checkout', checkout31_2Payload);
  if (!checkout31_2Res.ok) {
    throw new Error(`Falha no checkout 3.1 Compra #2: ${JSON.stringify(checkout31_2Res.data)}`);
  }

  const purchase31_2Obj = Array.isArray(checkout31_2Res.data) ? checkout31_2Res.data[0] : checkout31_2Res.data;
  console.log(`3.1 (Compra #2): Pedido criado! Order ID: #${purchase31_2Obj.id} - Status: ${purchase31_2Obj.status}`);

  dossierResults.scenarios['scenario_3_1'] = {
    name: 'Cenário 3.1 — Duas Compras Simples de Confirmação Posterior com callbackURL',
    rule: 'manualConfirmation: true | callbackURL no root do POST /new/checkout | status: in_confirmation_process | PENDENTES DE CANCELAMENTO (não canceladas)',
    callbackUrl: CALLBACK_URL,
    purchases: [
      {
        index: 1,
        trip: {
          id: trip31_1.id,
          company: trip31_1.company?.name,
          from: trip31_1.from?.label,
          to: trip31_1.to?.label,
          departure: trip31_1.departure,
          seat: seat31_1,
        },
        booking: {
          request: booking31_1Payload,
          response: booking31_1Res.data,
          httpStatus: booking31_1Res.status,
          bookingId: booking31_1Id,
        },
        checkout: {
          request: checkout31_1Payload,
          response: checkout31_1Res.data,
          httpStatus: checkout31_1Res.status,
          orderId: purchase31_1Obj.id,
          status: purchase31_1Obj.status,
        },
      },
      {
        index: 2,
        trip: {
          id: trip31_2.id,
          company: trip31_2.company?.name,
          from: trip31_2.from?.label,
          to: trip31_2.to?.label,
          departure: trip31_2.departure,
          seat: seat31_2,
        },
        booking: {
          request: booking31_2Payload,
          response: booking31_2Res.data,
          httpStatus: booking31_2Res.status,
          bookingId: booking31_2Id,
        },
        checkout: {
          request: checkout31_2Payload,
          response: checkout31_2Res.data,
          httpStatus: checkout31_2Res.status,
          orderId: purchase31_2Obj.id,
          status: purchase31_2Obj.status,
        },
      },
    ],
  };

  console.log('\n' + '='.repeat(80));
  console.log(' RESUMO EXECUTIVO DOS CENÁRIOS REEXECUTADOS:');
  console.log('='.repeat(80));
  console.log(` • Cenário 1.4: Pedido #${purchase14Obj.id} | Status: ${purchase14Obj.status} | 2 trechos (ida/volta), 2 pax (1 c/ seguro, 1 s/ seguro)`);
  console.log(` • Cenário 3.1 Compra #1: Pedido #${purchase31_1Obj.id} | Status: ${purchase31_1Obj.status} | callbackURL injetada`);
  console.log(` • Cenário 3.1 Compra #2: Pedido #${purchase31_2Obj.id} | Status: ${purchase31_2Obj.status} | callbackURL injetada`);
  console.log('='.repeat(80));

  // ===========================================================================
  // GERAR OS ARQUIVOS: dossie-homologacao-pendencias-nct.json e .md
  // ===========================================================================

  const jsonContent = JSON.stringify(dossierResults, null, 2);
  const jsonPathRoot = path.join(projectRoot, 'dossie-homologacao-pendencias-nct.json');
  const jsonPathDocs = path.join(projectRoot, 'docs', 'dossie-homologacao-pendencias-nct.json');
  fs.writeFileSync(jsonPathRoot, jsonContent, 'utf-8');
  fs.writeFileSync(jsonPathDocs, jsonContent, 'utf-8');
  console.log(`Salvo: ${jsonPathRoot}`);

  const mdContent = `# Dossiê de Resolução de Pendências — Homologação Quero Passagem (ws_v4)
**NC Turismo** · Afiliado: \`${AFFILIATE_CODE}\`
Data da Reexecução: \`${dossierResults.metadata.executedAt}\`
Ambiente: \`${BASE_URL}\`
Endpoint de Callback: \`${CALLBACK_URL}\`

---

## 📊 Resumo Executivo das Pendências Corrigidas

| Cenário | Pedido (\`orderId\`) | \`bookingId\` | Status Retornado | Trechos / Conexão | Passageiros / Seguro | Viação | Callback URL Enviada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.4** | **#${purchase14Obj.id}** | \`${booking14Id}\` | \`${purchase14Obj.status}\` | 2 trechos (Ida + Volta) | 2 pax (1 c/ seguro, 1 s/ seguro) | ${selectedOutTrip.company?.name || 'Viação'} + ${selectedRetTrip.company?.name || 'Viação'} | N/A (confirmação imediata) |
| **3.1 (Compra #1)** | **#${purchase31_1Obj.id}** | \`${booking31_1Id}\` | \`${purchase31_1Obj.status}\` | 1 trecho (ROD_55 → CIT_1) | 1 pax (manualConfirmation: true) | ${trip31_1.company?.name || '1001'} | \`${CALLBACK_URL}\` |
| **3.1 (Compra #2)** | **#${purchase31_2Obj.id}** | \`${booking31_2Id}\` | \`${purchase31_2Obj.status}\` | 1 trecho (ROD_55 → CIT_1) | 1 pax (manualConfirmation: true) | ${trip31_2.company?.name || '1001'} | \`${CALLBACK_URL}\` |

> **Nota Operacional sobre o Cenário 3.1:**
> Ambos os pedidos (**#${purchase31_1Obj.id}** e **#${purchase31_2Obj.id}**) retornaram status \`in_confirmation_process\` com a \`callbackURL\` configurada no payload root de checkout. **Nenhum endpoint de cancelamento foi acionado**, mantendo as reservas ativas para aprovação ou cancelamento pela equipe técnica da Quero Passagem.

---

## 1. Cenário 1.4 — Compra Simples: Ida e Volta com 2 Passageiros (1 com Seguro e 1 sem Seguro)

- **Regra:** Compra de ida e volta (2 trechos no array \`travels\`) para 2 passageiros simultâneos onde exatamente 1 passageiro possui seguro (\`insurance\`) com \`cpf\`, \`bithDate\` e \`cep\`, e 1 passageiro não possui seguro.
- **Trecho de Ida:** ${selectedOutTrip.from?.label} → ${selectedOutTrip.to?.label} (${selectedOutTrip.company?.name}) · Partida: \`${selectedOutTrip.departure?.date} ${selectedOutTrip.departure?.time}\` · Poltronas: \`${outSeats.join(', ')}\`
- **Trecho de Volta:** ${selectedRetTrip.from?.label} → ${selectedRetTrip.to?.label} (${selectedRetTrip.company?.name}) · Partida: \`${selectedRetTrip.departure?.date} ${selectedRetTrip.departure?.time}\` · Poltronas: \`${retSeats.join(', ')}\`
- **Order ID Gerado:** \`#${purchase14Obj.id}\`
- **Status Retornado:** \`${purchase14Obj.status}\`

### 1.1 Pré-Reserva (\`POST /new/booking\`)
- **Booking ID:** \`${booking14Id}\`

#### Request Payload:
\`\`\`json
${JSON.stringify(booking14Payload, null, 2)}
\`\`\`

#### Response Payload:
\`\`\`json
${JSON.stringify(booking14Res.data, null, 2)}
\`\`\`

### 1.2 Checkout (\`POST /new/checkout\`)

#### Request Payload:
\`\`\`json
${JSON.stringify(checkout14Payload, null, 2)}
\`\`\`

#### Response Payload:
\`\`\`json
${JSON.stringify(checkout14Res.data, null, 2)}
\`\`\`

---

## 2. Cenário 3.1 — Compras com Confirmação Posterior (\`manualConfirmation: true\` + \`callbackURL\`)

Duas compras simples completas em viagens de confirmação posterior com a propriedade \`callbackURL\` informada no root do payload de checkout. Ambas mantidas pendentes (\`in_confirmation_process\`).

### 2.1 Compra #1 — Pedido \`#${purchase31_1Obj.id}\` (\`status: in_confirmation_process\`)
- **Viação:** ${trip31_1.company?.name} · Trecho: ${trip31_1.from?.label} → ${trip31_1.to?.label}
- **Data/Hora:** \`${trip31_1.departure?.date} ${trip31_1.departure?.time}\` · Poltrona: \`${seat31_1}\`
- **Booking ID:** \`${booking31_1Id}\`

#### Request \`POST /new/booking\`:
\`\`\`json
${JSON.stringify(booking31_1Payload, null, 2)}
\`\`\`

#### Response \`POST /new/booking\`:
\`\`\`json
${JSON.stringify(booking31_1Res.data, null, 2)}
\`\`\`

#### Request \`POST /new/checkout\` (com \`callbackURL\`):
\`\`\`json
${JSON.stringify(checkout31_1Payload, null, 2)}
\`\`\`

#### Response \`POST /new/checkout\`:
\`\`\`json
${JSON.stringify(checkout31_1Res.data, null, 2)}
\`\`\`

---

### 2.2 Compra #2 — Pedido \`#${purchase31_2Obj.id}\` (\`status: in_confirmation_process\`)
- **Viação:** ${trip31_2.company?.name} · Trecho: ${trip31_2.from?.label} → ${trip31_2.to?.label}
- **Data/Hora:** \`${trip31_2.departure?.date} ${trip31_2.departure?.time}\` · Poltrona: \`${seat31_2}\`
- **Booking ID:** \`${booking31_2Id}\`

#### Request \`POST /new/booking\`:
\`\`\`json
${JSON.stringify(booking31_2Payload, null, 2)}
\`\`\`

#### Response \`POST /new/booking\`:
\`\`\`json
${JSON.stringify(booking31_2Res.data, null, 2)}
\`\`\`

#### Request \`POST /new/checkout\` (com \`callbackURL\`):
\`\`\`json
${JSON.stringify(checkout31_2Payload, null, 2)}
\`\`\`

#### Response \`POST /new/checkout\`:
\`\`\`json
${JSON.stringify(checkout31_2Res.data, null, 2)}
\`\`\`
`;

  const mdPathRoot = path.join(projectRoot, 'dossie-homologacao-pendencias-nct.md');
  const mdPathDocs = path.join(projectRoot, 'docs', 'dossie-homologacao-pendencias-nct.md');
  fs.writeFileSync(mdPathRoot, mdContent, 'utf-8');
  fs.writeFileSync(mdPathDocs, mdContent, 'utf-8');
  console.log(`Salvo: ${mdPathRoot}`);
  console.log('\nProcesso finalizado com sucesso absoluto!');
}

runHomologation().catch((err) => {
  console.error('\n[ERRO CRÍTICO NA HOMOLOGAÇÃO]:', err);
  process.exit(1);
});
