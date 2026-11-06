#!/usr/bin/env node
/**
 * Script de Validação Read-Only — API Rodoviária (NC Turismo <-> Quero Passagem Sandbox ws_v4)
 * Importante: Este script valida exclusivamente endpoints de leitura (companies, stops, search, seats),
 * deixando a execução dos cenários de compra (booking/checkout) para o usuário realizar pelo site.
 * Execução: npm run test:api  ou  node scripts/validate-rodoviario-api.mjs
 */

import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_SANDBOX_USERNAME = 'nc turismo homolog';
const DEFAULT_SANDBOX_PASSWORD = 'uci]Qk{GEura7Q5Jxz2leLlmBh4DikkEgACo1Y2GoR}sLe18(]';
const DEFAULT_AFFILIATE_CODE = 'NCT';

const envUser = (process.env.QP_USERNAME || '').trim();
const envPass = (process.env.QP_PASSWORD || '').trim();
const useDefault = !envUser || envUser.toLowerCase() === 'faq' || (envUser.toLowerCase() === 'nct' && envPass.length <= 4);

const USERNAME = useDefault ? DEFAULT_SANDBOX_USERNAME : envUser;
const PASSWORD = useDefault ? DEFAULT_SANDBOX_PASSWORD : envPass;
const AFFILIATE_CODE = (process.env.QP_AFFILIATE_CODE || DEFAULT_AFFILIATE_CODE).trim().toUpperCase();
const SANDBOX_BASE = 'https://queropassagem.qpdevs.com/ws_v4';
const LOCAL_API_BASE = process.env.LOCAL_API_BASE || 'http://localhost:3000/api/rodoviario';

const divider = '================================================================================';
const subDivider = '--------------------------------------------------------------------------------';

function formatStatusBadge(ok) {
  return ok ? '[SUCESSO ✅]' : '[FALHA ❌]';
}

async function runValidation() {
  console.log(divider);
  console.log(' VALIDAÇÃO HOMOLOGAÇÃO SANDBOX — API RODOVIÁRIA QUERO PASSAGEM (NC TURISMO)');
  console.log(` Data/Hora: ${new Date().toISOString()}`);
  console.log(divider);

  // ---------------------------------------------------------------------------
  // 1. VERIFICAÇÃO DE CREDENCIAIS CARREGADAS
  // ---------------------------------------------------------------------------
  console.log('\n1) CREDENCIAIS DE HOMOLOGAÇÃO (SANDBOX)');
  console.log(subDivider);
  const hasCredentials = Boolean(USERNAME && PASSWORD && AFFILIATE_CODE);
  console.log(` • Status Configuração : ${formatStatusBadge(hasCredentials)}`);
  console.log(` • Usuário (Basic Auth): "${USERNAME}"`);
  console.log(` • Senha (Basic Auth)  : ${'*'.repeat(12)} (${PASSWORD.length} caracteres)`);
  console.log(` • Código de Afiliado  : "${AFFILIATE_CODE}"`);
  console.log(` • URL Homologação     : ${SANDBOX_BASE}`);

  const basicAuthHeader = `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}`;
  const travelDate = new Date(Date.now() + 3 * 86400_000).toISOString().split('T')[0];

  // ---------------------------------------------------------------------------
  // 2. TESTE DIRETO NO WEBSERVICE SANDBOX QUERO PASSAGEM (SOMENTE LEITURA)
  // ---------------------------------------------------------------------------
  console.log('\n2) TESTE DIRETO NO SANDBOX QUERO PASSAGEM (https://queropassagem.qpdevs.com/ws_v4)');
  console.log(subDivider);

  let sandboxAllOk = true;
  let sampleTravelId = null;

  // 2.1 GET /companies
  try {
    const t0 = Date.now();
    const res = await fetch(`${SANDBOX_BASE}/companies`, {
      headers: { Authorization: basicAuthHeader, Accept: 'application/json' },
    });
    const data = await res.json();
    const ok = res.ok && Array.isArray(data) && data.length > 0;
    if (!ok) sandboxAllOk = false;
    console.log(
      ` • GET  /companies                            : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | ${Array.isArray(data) ? data.length : 0} viações`
    );
  } catch (err) {
    sandboxAllOk = false;
    console.log(` • GET  /companies                            : ${formatStatusBadge(false)} | Erro: ${err.message}`);
  }

  // 2.2 GET /stops
  try {
    const t0 = Date.now();
    const res = await fetch(`${SANDBOX_BASE}/stops`, {
      headers: { Authorization: basicAuthHeader, Accept: 'application/json' },
    });
    const data = await res.json();
    const ok = res.ok && Array.isArray(data) && data.length > 0;
    if (!ok) sandboxAllOk = false;
    console.log(
      ` • GET  /stops                                : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | ${Array.isArray(data) ? data.length : 0} localidades`
    );
  } catch (err) {
    sandboxAllOk = false;
    console.log(` • GET  /stops                                : ${formatStatusBadge(false)} | Erro: ${err.message}`);
  }

  // 2.3 GET /new/search/ROD_55/CIT_1/{date}/{affiliateCode}
  try {
    const t0 = Date.now();
    const res = await fetch(`${SANDBOX_BASE}/new/search/ROD_55/CIT_1/${travelDate}/${AFFILIATE_CODE}`, {
      headers: { Authorization: basicAuthHeader, Accept: 'application/json' },
    });
    const data = await res.json();
    const ok = res.ok && Array.isArray(data) && data.length > 0;
    if (!ok) sandboxAllOk = false;
    const manualTrueCount = Array.isArray(data) ? data.filter((t) => t.manualConfirmation === true).length : 0;
    const manualFalseCount = Array.isArray(data) ? data.filter((t) => t.manualConfirmation === false).length : 0;
    sampleTravelId = Array.isArray(data) && data[0] ? data[0].id : null;
    console.log(
      ` • GET  /new/search/ROD_55/CIT_1/${travelDate}/${AFFILIATE_CODE} : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | ${
        Array.isArray(data) ? data.length : 0
      } viagens (manualConfirmation=false: ${manualFalseCount} | manualConfirmation=true: ${manualTrueCount})`
    );
  } catch (err) {
    sandboxAllOk = false;
    console.log(` • GET  /new/search/...                       : ${formatStatusBadge(false)} | Erro: ${err.message}`);
  }

  // 2.4 GET /new/search-connections/ROD_55/CIT_1/{date}/{affiliateCode}
  try {
    const t0 = Date.now();
    const res = await fetch(
      `${SANDBOX_BASE}/new/search-connections/ROD_55/CIT_1/${travelDate}/${AFFILIATE_CODE}`,
      {
        headers: { Authorization: basicAuthHeader, Accept: 'application/json' },
      }
    );
    const data = await res.json();
    const ok = res.ok && Array.isArray(data);
    if (!ok) sandboxAllOk = false;
    console.log(
      ` • GET  /new/search-connections/ROD_55/CIT_1  : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | ${
        Array.isArray(data) ? data.length : 0
      } conexões`
    );
  } catch (err) {
    sandboxAllOk = false;
    console.log(` • GET  /new/search-connections/...           : ${formatStatusBadge(false)} | Erro: ${err.message}`);
  }

  // 2.5 POST /new/seats
  if (sampleTravelId) {
    try {
      const t0 = Date.now();
      const res = await fetch(`${SANDBOX_BASE}/new/seats`, {
        method: 'POST',
        headers: {
          Authorization: basicAuthHeader,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          travelId: sampleTravelId,
          orientation: 'horizontal',
          type: 'matrix',
        }),
      });
      const data = await res.json();
      const ok = res.ok && Array.isArray(data) && data.length > 0;
      if (!ok) sandboxAllOk = false;
      console.log(
        ` • POST /new/seats                            : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | Mapa real carregado`
      );
    } catch (err) {
      sandboxAllOk = false;
      console.log(` • POST /new/seats                            : ${formatStatusBadge(false)} | Erro: ${err.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. TESTE DA API INTERNA DO APLICATIVO (BFF / EXPRESS PORTA 3000)
  // ---------------------------------------------------------------------------
  console.log('\n3) TESTE DA API INTERNA DA APLICAÇÃO (/api/rodoviario/*)');
  console.log(subDivider);

  let internalAllOk = true;
  try {
    const t0 = Date.now();
    const res = await fetch(`${LOCAL_API_BASE}/health`);
    const data = await res.json();
    const ok = res.ok && data.status === 'ok';
    if (!ok) internalAllOk = false;
    console.log(
      ` • GET  /api/rodoviario/health                : ${formatStatusBadge(ok)} | HTTP ${res.status} (${Date.now() - t0}ms) | mode=${data.mode} | affiliate=${data.affiliateCode}`
    );
  } catch (err) {
    internalAllOk = false;
    console.log(` • GET  /api/rodoviario/health                : ${formatStatusBadge(false)} | Erro: ${err.message}`);
  }

  console.log('\n' + divider);
  console.log(' RESUMO FINAL DA VALIDAÇÃO:');
  console.log(` 1. Sandbox Quero Passagem (ws_v4 • NCT)      : ${formatStatusBadge(sandboxAllOk)}`);
  console.log(` 2. API Interna Express (/api/rodoviario/*)   : ${formatStatusBadge(internalAllOk)}`);
  console.log(' 3. Compras de Teste (Booking/Checkout)       : PRONTAS NO FRONT-END (Nenhuma compra executada pelo script)');
  console.log(divider);
}

runValidation().catch((err) => {
  console.error('[ERRO FATAL NO SCRIPT DE VALIDAÇÃO]:', err);
  process.exit(1);
});
