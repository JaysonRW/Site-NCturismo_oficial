import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURAÇÃO DO ADAPTADOR QUERO PASSAGEM (ws_v4) — HOMOLOGAÇÃO NC TURISMO
// ============================================================================

type AppMode = 'demo' | 'sandbox';
type QpEnv = 'sandbox' | 'production';

const QP_BASE_URLS: Record<QpEnv, string> = {
  sandbox: 'https://queropassagem.qpdevs.com/ws_v4',
  production: 'https://queropassagem.com.br/ws_v4',
};

interface ServerConfig {
  appMode: AppMode;
  qpEnv: QpEnv;
  baseUrl: string;
  username: string;
  password: string;
  affiliateCode: string;
  faqUsername: string;
  faqPassword: string;
  maxRequestsPerMinute: number;
  stopsCacheTtlMs: number;
  companiesCacheTtlMs: number;
  searchCacheTtlMs: number;
  readTimeoutMs: number;
  enableConnections: boolean;
  enableBooking: boolean;
  enableCheckout: boolean;
  enableCancel: boolean;
  enableCard: boolean;
  allowProduction: boolean;
}

// Credenciais oficiais de Homologação (Sandbox) fornecidas à NC Turismo
const DEFAULT_SANDBOX_USERNAME = 'nc turismo homolog';
const DEFAULT_SANDBOX_PASSWORD = 'uci]Qk{GEura7Q5Jxz2leLlmBh4DikkEgACo1Y2GoR}sLe18(]';
const DEFAULT_AFFILIATE_CODE = 'NCT';

// Credenciais do Portal de Documentação/FAQ
const DEFAULT_FAQ_USERNAME = 'faq';
const DEFAULT_FAQ_PASSWORD = '5)@IN1FnI2@ikCq0[RB{g4}Nk3Y@IsTsoC533mAUy]zYleTJ/s';

function loadConfig(overrideMode?: string): ServerConfig {
  const rawMode = (overrideMode || process.env.APP_MODE || 'sandbox').toLowerCase();
  const appMode: AppMode = rawMode === 'demo' ? 'demo' : 'sandbox';
  const rawEnv = (process.env.QP_ENV || 'sandbox').toLowerCase();
  const qpEnv: QpEnv = rawEnv === 'production' ? 'production' : 'sandbox';

  const envUser = (process.env.QP_USERNAME || '').trim();
  const envPass = (process.env.QP_PASSWORD || '').trim();
  const useDefaultSandboxCredentials =
    !envUser ||
    envUser.toLowerCase() === 'faq' ||
    (envUser.toLowerCase() === 'nct' && envPass.length <= 4);

  return {
    appMode,
    qpEnv,
    baseUrl: (process.env.QP_BASE_URL || QP_BASE_URLS[qpEnv]).replace(/\/+$/, ''),
    username: useDefaultSandboxCredentials ? DEFAULT_SANDBOX_USERNAME : envUser,
    password: useDefaultSandboxCredentials ? DEFAULT_SANDBOX_PASSWORD : envPass,
    affiliateCode: (process.env.QP_AFFILIATE_CODE || DEFAULT_AFFILIATE_CODE).trim().toUpperCase(),
    faqUsername: DEFAULT_FAQ_USERNAME,
    faqPassword: DEFAULT_FAQ_PASSWORD,
    maxRequestsPerMinute: Number(process.env.QP_MAX_REQUESTS_PER_MINUTE || 90),
    stopsCacheTtlMs: Number(process.env.QP_STOPS_CACHE_TTL_SECONDS || 86400) * 1000,
    companiesCacheTtlMs: Number(process.env.QP_COMPANIES_CACHE_TTL_SECONDS || 86400) * 1000,
    searchCacheTtlMs: Number(process.env.QP_SEARCH_LOCAL_CACHE_TTL_SECONDS || 60) * 1000,
    readTimeoutMs: Number(process.env.QP_READ_TIMEOUT_SECONDS || 125) * 1000,
    enableConnections: process.env.QP_ENABLE_CONNECTIONS !== 'false',
    enableBooking: process.env.QP_ENABLE_BOOKING !== 'false',
    enableCheckout: process.env.QP_ENABLE_CHECKOUT !== 'false',
    enableCancel: process.env.QP_ENABLE_CANCEL !== 'false',
    enableCard: process.env.QP_ENABLE_CARD !== 'false',
    allowProduction: process.env.QP_ALLOW_PRODUCTION === 'true',
  };
}

// ============================================================================
// ORÇAMENTO GLOBAL DE REQUISIÇÕES (SLIDING WINDOW RATE LIMITER)
// ============================================================================

const outboundRequestTimestamps: number[] = [];

function checkAndConsumeRateBudget(maxPerMinute: number): {
  allowed: boolean;
  usedLastMinute: number;
  remaining: number;
} {
  const now = Date.now();
  const windowStart = now - 60_000;
  while (outboundRequestTimestamps.length > 0 && outboundRequestTimestamps[0] < windowStart) {
    outboundRequestTimestamps.shift();
  }
  if (outboundRequestTimestamps.length >= maxPerMinute) {
    return {
      allowed: false,
      usedLastMinute: outboundRequestTimestamps.length,
      remaining: 0,
    };
  }
  outboundRequestTimestamps.push(now);
  return {
    allowed: true,
    usedLastMinute: outboundRequestTimestamps.length,
    remaining: Math.max(0, maxPerMinute - outboundRequestTimestamps.length),
  };
}

function getRateBudgetSnapshot(maxPerMinute: number) {
  const now = Date.now();
  const windowStart = now - 60_000;
  while (outboundRequestTimestamps.length > 0 && outboundRequestTimestamps[0] < windowStart) {
    outboundRequestTimestamps.shift();
  }
  return {
    usedInLastMinute: outboundRequestTimestamps.length,
    budgetPerMinute: maxPerMinute,
    remainingInWindow: Math.max(0, maxPerMinute - outboundRequestTimestamps.length),
    usedLastMinute: outboundRequestTimestamps.length,
    maxPerMinute,
    remaining: Math.max(0, maxPerMinute - outboundRequestTimestamps.length),
  };
}

// ============================================================================
// INTERFACES UNIFICADAS (ALINHADAS COM src/lib/rodoviario.ts)
// ============================================================================

export interface StopItem {
  id: string;
  name: string;
  url: string;
  stateCode?: string;
  isStation?: boolean;
  substops?: {
    id: string;
    name: string;
    url: string;
    stateCode?: string;
    isStation?: boolean;
  }[];
}

export interface SearchLegSegment {
  segmentIndex: number;
  travelId?: string;
  company: { id: string | number; name: string; logoUrl?: string };
  departure: { date: string; time: string; stopId: string; stopName: string };
  arrival: { date: string; time: string; stopId: string; stopName: string };
  seatClass: string;
  rawSeatClass?: string;
  vehicleLayout?: string;
  availableSeats?: number;
  withBPE?: boolean;
}

export interface SearchOption {
  optionId: string;
  externalTravelId: string;
  travelType: 'direct' | 'connection';
  company: {
    id: string | number;
    name: string;
    logoUrl?: string;
  };
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  departure: {
    date: string;
    time: string;
    iso: string;
  };
  arrival: {
    date: string;
    time: string;
    iso: string;
  };
  durationMinutes: number;
  durationLabel: string;
  availableSeats: number;
  seatClass: string;
  rawSeatClass: string;
  pricing: {
    seatPrice: number;
    taxPrice: number;
    totalPrice: number;
    ccTaxPrice?: number;
    originalPrice?: number;
  };
  insurancePrice: number;
  manualConfirmation: boolean;
  withBPE: boolean;
  CPFRequired: boolean;
  allowCanceling: boolean;
  travelCancellationLimitDate?: string;
  travelCancellationFee?: number;
  maximumAllowedPassengers?: number | null;
  seatsLayout?: 'numbered' | 'quantity';
  boardingAtStop: boolean;
  vehicleType?: string;
  connectionInfo?: {
    connectionStopId?: string;
    connectionStopName: string;
    waitingMinutes: number;
    segments: SearchLegSegment[];
  };
}

export interface SeatMatrixCell {
  seatNumber?: string;
  occupied: boolean;
  type: 'seat' | 'driver' | 'wc' | 'stairs' | 'corridor' | 'empty';
  label?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  pricing?: {
    seatPrice: number;
    taxPrice: number;
    totalPrice: number;
  };
}

export interface SeatFloorMap {
  floorIndex: number;
  floorLabel: string;
  seatClass: string;
  maxX: number;
  maxY: number;
  cells: SeatMatrixCell[];
}

export interface SeatSegmentMap {
  segmentIndex: number;
  segmentLabel: string;
  fromName: string;
  toName: string;
  companyName: string;
  departureTime: string;
  arrivalTime: string;
  seatsLayout: 'matrix' | 'quantity';
  availableQuantity?: number;
  floors: SeatFloorMap[];
}

export interface HomologationLogEntry {
  id: string;
  timestamp: string;
  scenarioTag?: string;
  operation:
    | 'SEARCH_DIRECT'
    | 'SEARCH_CONNECTION'
    | 'SEATS'
    | 'BOOKING_CREATE'
    | 'BOOKING_GET'
    | 'BOOKING_DELETE'
    | 'CHECKOUT'
    | 'PURCHASE_GET'
    | 'PURCHASE_LIST'
    | 'WEBHOOK_CALLBACK';
  method: string;
  endpoint: string;
  httpStatus: number;
  ok: boolean;
  latencyMs: number;
  requestPayload: any;
  responsePayload: any;
  notes?: string;
}

// ============================================================================
// MAPEAMENTO DE PARADAS OFICIAIS QUERO PASSAGEM (COMPATIBILIDADE + SANDBOX)
// ============================================================================

const LEGACY_STOP_ID_ALIAS: Record<string, string> = {
  CIT_4106902: 'CIT_53',
  ROD_CWB_01: 'ROD_53',
  CIT_3550308: 'CIT_1',
  ROD_SAO_TIETE: 'ROD_1',
  ROD_SAO_BARRA: 'ROD_898',
  CIT_3304557: 'CIT_55',
  ROD_RIO_NOVO: 'ROD_55',
};

function resolveOfficialStopId(id: string): string {
  const trimmed = String(id || '').trim();
  return LEGACY_STOP_ID_ALIAS[trimmed] || trimmed;
}

const DEMO_STOPS: StopItem[] = [
  {
    id: 'ROD_55',
    name: 'Rio de Janeiro, RJ - Novo Rio',
    url: 'rio-de-janeiro-novo-rio-rj',
    stateCode: 'RJ',
    isStation: true,
    substops: [],
  },
  {
    id: 'CIT_1',
    name: 'São Paulo - TODOS',
    url: 'sao-paulo-todos',
    stateCode: 'SP',
    isStation: false,
    substops: [
      {
        id: 'ROD_1',
        name: 'São Paulo - Tietê NEW IBE',
        url: 'sao-paulo-tiete',
        stateCode: 'SP',
        isStation: true,
      },
      {
        id: 'ROD_898',
        name: 'São Paulo, SP - Barra Funda',
        url: 'sao-paulo-barra-funda-sp',
        stateCode: 'SP',
        isStation: true,
      },
    ],
  },
  {
    id: 'ROD_1',
    name: 'São Paulo - Tietê NEW IBE',
    url: 'sao-paulo-tiete',
    stateCode: 'SP',
    isStation: true,
    substops: [],
  },
  {
    id: 'CIT_53',
    name: 'Curitiba, PR - TODOS',
    url: 'curitiba-pr',
    stateCode: 'PR',
    isStation: false,
    substops: [
      {
        id: 'ROD_53',
        name: 'Curitiba, PR (Rodoferroviária)',
        url: 'pinheirao-pr',
        stateCode: 'PR',
        isStation: true,
      },
    ],
  },
  {
    id: 'ROD_53',
    name: 'Curitiba, PR (Rodoferroviária)',
    url: 'pinheirao-pr',
    stateCode: 'PR',
    isStation: true,
    substops: [],
  },
  {
    id: 'CIT_55',
    name: 'Rio de Janeiro, RJ - TODOS',
    url: 'rio-de-janeiro-rj',
    stateCode: 'RJ',
    isStation: false,
    substops: [
      {
        id: 'ROD_55',
        name: 'Rio de Janeiro, RJ - Novo Rio',
        url: 'rio-de-janeiro-novo-rio-rj',
        stateCode: 'RJ',
        isStation: true,
      },
    ],
  },
  {
    id: 'ROD_898',
    name: 'São Paulo, SP - Barra Funda',
    url: 'sao-paulo-barra-funda-sp',
    stateCode: 'SP',
    isStation: true,
    substops: [],
  },
];

const DEMO_COMPANIES = [
  { id: 2, name: 'Auto Viação 1001', shortName: '1001' },
  { id: 5, name: 'Auto Viação Catarinense', shortName: 'CATARINENSE' },
  { id: 6, name: 'Viação Cometa', shortName: 'COMETA' },
  { id: 33, name: 'Auto Viação Progresso', shortName: 'PROGRESSO' },
  { id: 12, name: 'Viação Garcia', shortName: 'GARCIA' },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function formatDurationLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function computeMinutesBetween(
  startDate?: string,
  startTime?: string,
  endDate?: string,
  endTime?: string,
  fallback = 50
): number {
  if (!startDate || !startTime || !endDate || !endTime) return fallback;
  const t1 = Date.parse(`${startDate}T${startTime}`);
  const t2 = Date.parse(`${endDate}T${endTime}`);
  if (Number.isNaN(t1) || Number.isNaN(t2) || t2 < t1) return fallback;
  return Math.max(5, Math.round((t2 - t1) / 60000));
}

// ============================================================================
// CACHES EM MEMÓRIA, HANDLES DE VIAGEM E AUDITORIA DE HOMOLOGAÇÃO
// ============================================================================

const storedOptionsMap = new Map<string, SearchOption>();
const searchCacheMap = new Map<string, { createdAtMs: number; payload: any }>();
let stopsCache: { createdAtMs: number; items: StopItem[] } | null = null;
let companiesCache: { createdAtMs: number; items: any[] } | null = null;
let lastUpstreamStatus: {
  checkedAt: string;
  ok: boolean;
  httpStatus: number;
  errorCode?: string;
  message: string;
  latencyMs: number;
} | null = null;

// Armazenamento em memória de Logs de Homologação (inicializado com o dossiê consolidado em disco)
const homologationLogs: HomologationLogEntry[] = (() => {
  try {
    const consolidatedPath = path.join(__dirname, 'docs', 'homologacao-consolidada-ncturismo.json');
    if (fs.existsSync(consolidatedPath)) {
      const parsed = JSON.parse(fs.readFileSync(consolidatedPath, 'utf8'));
      if (Array.isArray(parsed?.logs)) {
        return parsed.logs;
      }
    }
  } catch {
    // ignore startup read error
  }
  return [];
})();
// Mapa auxiliar purchaseId -> buyerEmail para sincronização proativa quando o callback chegar
const purchaseEmailMap = new Map<number | string, { email: string; externalId?: string }>();

function recordHomologationLog(entry: Omit<HomologationLogEntry, 'id' | 'timestamp'>): HomologationLogEntry {
  const fullEntry: HomologationLogEntry = {
    id: `LOG_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  homologationLogs.unshift(fullEntry);
  if (homologationLogs.length > 100) {
    homologationLogs.pop();
  }
  return fullEntry;
}

// ============================================================================
// GERADORES DEMO E PARSER REAL DO MAPA DE ASSENTOS QUERO PASSAGEM
// ============================================================================

function generateDemoSearchOptions(
  fromId: string,
  toId: string,
  travelDate: string,
  travelType: 'direct' | 'connection'
): SearchOption[] {
  const fromStop =
    DEMO_STOPS.find((s) => s.id === fromId) ||
    DEMO_STOPS.flatMap((s) => s.substops || []).find((sub) => sub.id === fromId) || {
      id: fromId,
      name: 'Rio de Janeiro, RJ - Novo Rio',
    };
  const toStop =
    DEMO_STOPS.find((s) => s.id === toId) ||
    DEMO_STOPS.flatMap((s) => s.substops || []).find((sub) => sub.id === toId) || {
      id: toId,
      name: 'São Paulo - Tietê NEW IBE',
    };

  if (travelType === 'connection') {
    const connOptions: SearchOption[] = [
      {
        optionId: `OPT_CONN_${fromId}_${toId}_${travelDate}_1`,
        externalTravelId: `QP_SEG1_${travelDate}_1|QP_SEG2_${travelDate}_1`,
        travelType: 'connection',
        company: { id: 5, name: 'Auto Viação Catarinense + Viação Cometa' },
        from: { id: fromStop.id, name: fromStop.name },
        to: { id: toStop.id, name: toStop.name },
        departure: { date: travelDate, time: '08:00:00', iso: `${travelDate}T08:00:00` },
        arrival: { date: travelDate, time: '16:15:00', iso: `${travelDate}T16:15:00` },
        durationMinutes: 495,
        durationLabel: '8h 15m',
        availableSeats: 14,
        seatClass: 'Executivo / Semileito',
        rawSeatClass: 'EXECUTIVO + SEMILEITO',
        pricing: { seatPrice: 158.9, taxPrice: 12.4, totalPrice: 171.3, originalPrice: 194.0 },
        insurancePrice: 9.95,
        manualConfirmation: false,
        withBPE: true,
        CPFRequired: false,
        allowCanceling: true,
        seatsLayout: 'numbered',
        boardingAtStop: true,
        vehicleType: 'Conexão Garantida (2 Trechos)',
        connectionInfo: {
          connectionStopId: 'ROD_1',
          connectionStopName: 'Terminal Rodoviário Central (Conexão Integrada)',
          waitingMinutes: 50,
          segments: [
            {
              segmentIndex: 1,
              travelId: `QP_SEG1_${travelDate}_1`,
              company: { id: 5, name: 'Auto Viação Catarinense' },
              departure: { date: travelDate, time: '08:00', stopId: fromStop.id, stopName: fromStop.name },
              arrival: {
                date: travelDate,
                time: '11:30',
                stopId: 'ROD_CON_01',
                stopName: 'Terminal Rodoviário Central (Conexão)',
              },
              seatClass: 'Executivo',
              rawSeatClass: 'EXECUTIVO',
              vehicleLayout: 'Mapa Numerado',
            },
            {
              segmentIndex: 2,
              travelId: `QP_SEG2_${travelDate}_1`,
              company: { id: 6, name: 'Viação Cometa' },
              departure: {
                date: travelDate,
                time: '12:20',
                stopId: 'ROD_CON_01',
                stopName: 'Terminal Rodoviário Central (Conexão)',
              },
              arrival: { date: travelDate, time: '16:15', stopId: toStop.id, stopName: toStop.name },
              seatClass: 'Semileito',
              rawSeatClass: 'SEMILEITO',
              vehicleLayout: 'Mapa Numerado',
            },
          ],
        },
      },
    ];

    connOptions.forEach((opt) => storedOptionsMap.set(opt.optionId, opt));
    return connOptions;
  }

  const directOptions: SearchOption[] = [
    {
      optionId: `OPT_DIR_${fromId}_${toId}_${travelDate}_1`,
      externalTravelId: `QP_DIR_${travelDate}_1`,
      travelType: 'direct',
      company: { id: 33, name: 'Auto Viação Progresso' },
      from: { id: fromStop.id, name: fromStop.name },
      to: { id: toStop.id, name: toStop.name },
      departure: { date: travelDate, time: '07:30:00', iso: `${travelDate}T07:30:00` },
      arrival: { date: travelDate, time: '13:45:00', iso: `${travelDate}T13:45:00` },
      durationMinutes: 375,
      durationLabel: '6h 15m',
      availableSeats: 22,
      seatClass: 'Semileito',
      rawSeatClass: 'SEMILEITO DD',
      pricing: { seatPrice: 124.9, taxPrice: 9.6, totalPrice: 134.5, originalPrice: 159.9 },
      insurancePrice: 9.95,
      manualConfirmation: false,
      withBPE: true,
      CPFRequired: false,
      allowCanceling: true,
      seatsLayout: 'numbered',
      boardingAtStop: true,
      vehicleType: 'Mapa Numerado',
    },
    {
      optionId: `OPT_DIR_${fromId}_${toId}_${travelDate}_2`,
      externalTravelId: `QP_DIR_${travelDate}_2`,
      travelType: 'direct',
      company: { id: 2, name: 'Auto Viação 1001' },
      from: { id: fromStop.id, name: fromStop.name },
      to: { id: toStop.id, name: toStop.name },
      departure: { date: travelDate, time: '10:15:00', iso: `${travelDate}T10:15:00` },
      arrival: { date: travelDate, time: '16:20:00', iso: `${travelDate}T16:20:00` },
      durationMinutes: 365,
      durationLabel: '6h 05m',
      availableSeats: 18,
      seatClass: 'Executivo',
      rawSeatClass: 'EXECUTIVO',
      pricing: { seatPrice: 108.0, taxPrice: 8.5, totalPrice: 116.5 },
      insurancePrice: 8.5,
      manualConfirmation: true,
      withBPE: true,
      CPFRequired: false,
      allowCanceling: true,
      seatsLayout: 'numbered',
      boardingAtStop: true,
      vehicleType: 'Mapa Numerado (Confirmação Posterior)',
    },
  ];

  directOptions.forEach((opt) => storedOptionsMap.set(opt.optionId, opt));
  return directOptions;
}

function generateNormalizedSeatMap(option: SearchOption, mode: 'demo' | 'sandbox') {
  const buildFloor = (
    floorIndex: number,
    floorLabel: string,
    seatClass: string,
    price: { seatPrice: number; taxPrice: number; totalPrice: number }
  ): SeatFloorMap => {
    const cells: SeatMatrixCell[] = [];
    let seatCounter = floorIndex === 0 ? 1 : 41;
    const occupiedSet = new Set(['03', '04', '07', '12', '15', '16', '22', '42', '45', '48']);

    for (let x = 0; x <= 11; x++) {
      for (let y = 0; y <= 4; y++) {
        if (x === 0) {
          cells.push({
            occupied: true,
            type: y === 0 ? 'driver' : 'empty',
            label: y === 0 ? 'MOT' : '',
            position: { x, y, z: floorIndex },
          });
          continue;
        }
        if (y === 2) {
          cells.push({
            occupied: true,
            type: 'corridor',
            label: '',
            position: { x, y, z: floorIndex },
          });
          continue;
        }
        if (x === 5 && (y === 3 || y === 4)) {
          cells.push({
            occupied: true,
            type: y === 4 ? 'wc' : 'stairs',
            label: y === 4 ? 'WC' : 'ESC',
            position: { x, y, z: floorIndex },
          });
          continue;
        }

        const seatNum = String(seatCounter++).padStart(2, '0');
        const isOccupied = occupiedSet.has(seatNum);
        cells.push({
          seatNumber: seatNum,
          occupied: isOccupied,
          type: 'seat',
          label: seatNum,
          position: { x, y, z: floorIndex },
          pricing: isOccupied ? undefined : price,
        });
      }
    }

    return {
      floorIndex,
      floorLabel,
      seatClass,
      maxX: 11,
      maxY: 4,
      cells,
    };
  };

  if (option.travelType === 'connection' && option.connectionInfo) {
    return {
      mode,
      optionId: option.optionId,
      isConnection: true,
      fetchedAt: new Date().toISOString(),
      segments: option.connectionInfo.segments.map((seg, idx) => ({
        segmentIndex: seg.segmentIndex,
        segmentLabel: `Trecho ${seg.segmentIndex}: ${seg.departure.stopName.split(',')[0]} → ${seg.arrival.stopName.split(',')[0]}`,
        fromName: seg.departure.stopName,
        toName: seg.arrival.stopName,
        companyName: seg.company.name,
        departureTime: seg.departure.time,
        arrivalTime: seg.arrival.time,
        seatsLayout: 'matrix' as const,
        floors: [
          buildFloor(0, 'Piso 1 · Principal', seg.seatClass, {
            seatPrice: Number((option.pricing.seatPrice / 2).toFixed(2)),
            taxPrice: Number((option.pricing.taxPrice / 2).toFixed(2)),
            totalPrice: Number((option.pricing.totalPrice / 2).toFixed(2)),
          }),
          ...(idx === 0
            ? [
                buildFloor(1, 'Piso 2 · Superior Panorâmico', 'Executivo Panorâmico', {
                  seatPrice: Number((option.pricing.seatPrice / 2).toFixed(2)),
                  taxPrice: Number((option.pricing.taxPrice / 2).toFixed(2)),
                  totalPrice: Number((option.pricing.totalPrice / 2).toFixed(2)),
                }),
              ]
            : []),
        ],
      })),
    };
  }

  return {
    mode,
    optionId: option.optionId,
    isConnection: false,
    fetchedAt: new Date().toISOString(),
    segments: [
      {
        segmentIndex: 1,
        segmentLabel: `Trecho Único: ${option.from.name.split(',')[0]} → ${option.to.name.split(',')[0]}`,
        fromName: option.from.name,
        toName: option.to.name,
        companyName: option.company.name,
        departureTime: option.departure.time.slice(0, 5),
        arrivalTime: option.arrival.time.slice(0, 5),
        seatsLayout: 'matrix' as const,
        floors: [
          buildFloor(0, 'Piso 1 · Inferior (Leito / Semileito)', option.seatClass, option.pricing),
          buildFloor(1, 'Piso 2 · Superior Panorâmico', option.seatClass, option.pricing),
        ],
      },
    ],
  };
}

/**
 * Converte o retorno real do POST /new/seats da Quero Passagem (tanto viagem simples
 * quanto conexão com 2 segmentos) para o formato SeatMapResponse do front-end.
 */
function parseQueroPassagemSeatMap(rawSeatData: any, option: SearchOption) {
  if (!Array.isArray(rawSeatData) || rawSeatData.length === 0) {
    return generateNormalizedSeatMap(option, 'sandbox');
  }

  const isMultiSegmentArray = Array.isArray(rawSeatData[0]);
  const rawSegments: any[][] = isMultiSegmentArray ? rawSeatData : [rawSeatData];

  const parseFloorsForSegment = (
    floorObjects: any[],
    seatClass: string,
    segmentPrice: { seatPrice: number; taxPrice: number; totalPrice: number }
  ): { seatsLayout: 'matrix' | 'quantity'; floors: SeatFloorMap[] } => {
    let isQuantity = false;
    const floors: SeatFloorMap[] = floorObjects.map((floorObj: any, idx: number) => {
      const floorIndex = typeof floorObj?.floor === 'number' ? floorObj.floor : idx;
      if (floorObj?.seatsLayout === 'quantity') {
        isQuantity = true;
      }

      const cells: SeatMatrixCell[] = [];
      let maxX = 11;
      let maxY = 4;

      const rawGroups = Array.isArray(floorObj?.seats) ? floorObj.seats : [];
      for (const group of rawGroups) {
        const items = Array.isArray(group) ? group : [group];
        for (const item of items) {
          if (!item || !item.position) continue;
          const x = Number(item.position.x ?? 0);
          const y = Number(item.position.y ?? 0);
          const z = Number(item.position.z ?? floorIndex);
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;

          const hasSeatNumber = item.type === 'seat' && item.seat !== null && item.seat !== undefined && String(item.seat).trim() !== '';
          if (hasSeatNumber) {
            const seatStr = String(item.seat).trim();
            const isOccupied = Boolean(item.occupied);
            cells.push({
              seatNumber: seatStr,
              occupied: isOccupied,
              type: 'seat',
              label: seatStr,
              position: { x, y, z },
              pricing: isOccupied ? undefined : segmentPrice,
            });
          } else {
            cells.push({
              occupied: true,
              type: y === 2 ? 'corridor' : 'empty',
              label: '',
              position: { x, y, z },
            });
          }
        }
      }

      return {
        floorIndex,
        floorLabel:
          floorObjects.length > 1
            ? floorIndex === 0
              ? 'Piso 1 · Inferior'
              : `Piso ${floorIndex + 1} · Superior`
            : 'Piso Único · Principal',
        seatClass,
        maxX,
        maxY,
        cells,
      };
    });

    return {
      seatsLayout: isQuantity ? 'quantity' : 'matrix',
      floors,
    };
  };

  if (option.travelType === 'connection' && option.connectionInfo && option.connectionInfo.segments.length >= 2) {
    const halfPrice = {
      seatPrice: Number((option.pricing.seatPrice / 2).toFixed(2)),
      taxPrice: Number((option.pricing.taxPrice / 2).toFixed(2)),
      totalPrice: Number((option.pricing.totalPrice / 2).toFixed(2)),
    };

    const segments: SeatSegmentMap[] = option.connectionInfo.segments.map((seg, idx) => {
      const floorList = rawSegments[idx] || rawSegments[0] || [];
      const parsed = parseFloorsForSegment(floorList, seg.seatClass, halfPrice);
      return {
        segmentIndex: seg.segmentIndex,
        segmentLabel: `Trecho ${seg.segmentIndex}: ${seg.departure.stopName.split(',')[0]} → ${seg.arrival.stopName.split(',')[0]}`,
        fromName: seg.departure.stopName,
        toName: seg.arrival.stopName,
        companyName: seg.company.name,
        departureTime: seg.departure.time.slice(0, 5),
        arrivalTime: seg.arrival.time.slice(0, 5),
        seatsLayout: parsed.seatsLayout,
        availableQuantity: seg.availableSeats,
        floors: parsed.floors,
      };
    });

    return {
      mode: 'sandbox' as const,
      optionId: option.optionId,
      isConnection: true,
      fetchedAt: new Date().toISOString(),
      segments,
    };
  }

  const parsedSingle = parseFloorsForSegment(rawSegments[0] || [], option.seatClass, {
    seatPrice: option.pricing.seatPrice,
    taxPrice: option.pricing.taxPrice,
    totalPrice: option.pricing.totalPrice,
  });

  return {
    mode: 'sandbox' as const,
    optionId: option.optionId,
    isConnection: false,
    fetchedAt: new Date().toISOString(),
    segments: [
      {
        segmentIndex: 1,
        segmentLabel: `Trecho Único: ${option.from.name.split(',')[0]} → ${option.to.name.split(',')[0]}`,
        fromName: option.from.name,
        toName: option.to.name,
        companyName: option.company.name,
        departureTime: option.departure.time.slice(0, 5),
        arrivalTime: option.arrival.time.slice(0, 5),
        seatsLayout: parsedSingle.seatsLayout,
        availableQuantity: option.availableSeats,
        floors: parsedSingle.floors,
      },
    ],
  };
}

// ============================================================================
// CLIENTE HTTP REAL PARA A API QUERO PASSAGEM (ws_v4)
// ============================================================================

async function callQueroPassagemUpstream(
  config: ServerConfig,
  method: 'GET' | 'POST' | 'DELETE',
  relativePath: string,
  body?: any
): Promise<{
  ok: boolean;
  status: number;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  latencyMs: number;
}> {
  const t0 = Date.now();

  if (config.qpEnv === 'production' && !config.allowProduction) {
    return {
      ok: false,
      status: 403,
      errorCode: 'PRODUCTION_LOCKED',
      errorMessage:
        'O ambiente de produção está bloqueado enquanto QP_ALLOW_PRODUCTION não estiver explicitamente habilitado.',
      latencyMs: Date.now() - t0,
    };
  }

  if (!config.username || !config.password || !config.affiliateCode) {
    return {
      ok: false,
      status: 503,
      errorCode: 'INTEGRATION_CONFIG_MISSING',
      errorMessage:
        'Modo Sandbox ativo, porém as variáveis QP_USERNAME, QP_PASSWORD ou QP_AFFILIATE_CODE não foram configuradas no servidor.',
      latencyMs: Date.now() - t0,
    };
  }

  const budget = checkAndConsumeRateBudget(config.maxRequestsPerMinute);
  if (!budget.allowed) {
    return {
      ok: false,
      status: 429,
      errorCode: 'RATE_LIMITED',
      errorMessage: `Orçamento preventivo de chamadas atingido (${config.maxRequestsPerMinute} req/min). Aguarde alguns segundos e tente novamente.`,
      latencyMs: Date.now() - t0,
    };
  }

  const url = `${config.baseUrl}${relativePath}`;
  const basicAuth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.readTimeoutMs);

  try {
    const headers: Record<string, string> = {
      Authorization: `Basic ${basicAuth}`,
      Accept: 'application/json',
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      redirect: 'manual',
      signal: controller.signal,
    });

    const latencyMs = Date.now() - t0;

    if (res.status === 401 || res.status === 403) {
      const rawBody = (await res.text().catch(() => '')).trim();
      const isAccessDeniedIp = /access denied/i.test(rawBody);
      const ipMatch = rawBody.match(/\(([\d.]+)\)/);
      const detectedIp = ipMatch ? ipMatch[1] : undefined;

      if (isAccessDeniedIp) {
        const msg = `Credencial reconhecida pelo gateway Quero Passagem, porém bloqueada por política de IP/Escopo: "${rawBody}". ${
          detectedIp
            ? `O IP público de saída deste servidor (${detectedIp}) precisa ser liberado na allowlist de Produção da Quero Passagem.`
            : ''
        }`;
        lastUpstreamStatus = {
          checkedAt: new Date().toISOString(),
          ok: false,
          httpStatus: res.status,
          errorCode: 'INTEGRATION_IP_NOT_ALLOWLISTED',
          message: msg,
          latencyMs,
        };
        return {
          ok: false,
          status: res.status,
          errorCode: 'INTEGRATION_IP_NOT_ALLOWLISTED',
          errorMessage: msg,
          latencyMs,
        };
      }

      const msg =
        res.status === 401
          ? `HTTP 401 (${rawBody || 'Unauthorized'}): O usuário '${config.username}' não foi autorizado neste host (${config.baseUrl}).`
          : `HTTP 403 (${rawBody || 'Forbidden'}): Acesso negado pelo fornecedor Quero Passagem.`;

      lastUpstreamStatus = {
        checkedAt: new Date().toISOString(),
        ok: false,
        httpStatus: res.status,
        errorCode: res.status === 401 ? 'INTEGRATION_AUTH_FAILED' : 'INTEGRATION_ACCESS_DENIED',
        message: msg,
        latencyMs,
      };
      return {
        ok: false,
        status: res.status,
        errorCode: res.status === 401 ? 'INTEGRATION_AUTH_FAILED' : 'INTEGRATION_ACCESS_DENIED',
        errorMessage: msg,
        latencyMs,
      };
    }

    const rawText = (await res.text().catch(() => '')).trim();
    let json: any = null;
    if (rawText.startsWith('{') || rawText.startsWith('[')) {
      try {
        json = JSON.parse(rawText);
      } catch {
        json = null;
      }
    }

    if (json === null) {
      return {
        ok: false,
        status: res.status >= 400 && res.status < 500 ? res.status : 422,
        errorCode: 'UPSTREAM_UNAVAILABLE',
        errorMessage: `Resposta não-JSON do gateway Quero Passagem (HTTP ${res.status}: ${rawText.slice(0, 120)}).`,
        latencyMs,
      };
    }

    if (!res.ok) {
      const upstreamErrors = Array.isArray(json?.errors) ? json.errors.join(' | ') : '';
      return {
        ok: false,
        status: res.status,
        data: json,
        errorCode: 'UPSTREAM_ERROR',
        errorMessage:
          upstreamErrors || json?.message || json?.error || `Erro retornado pelo fornecedor (HTTP ${res.status}).`,
        latencyMs,
      };
    }

    lastUpstreamStatus = {
      checkedAt: new Date().toISOString(),
      ok: true,
      httpStatus: res.status,
      message: 'Conectado e autenticado com sucesso no Sandbox Quero Passagem (ws_v4).',
      latencyMs,
    };

    return {
      ok: true,
      status: res.status,
      data: json,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - t0;
    if (err?.name === 'AbortError') {
      return {
        ok: false,
        status: 408,
        errorCode: 'UPSTREAM_TIMEOUT',
        errorMessage: 'Tempo limite excedido ao aguardar resposta da Quero Passagem.',
        latencyMs,
      };
    }
    return {
      ok: false,
      status: 422,
      errorCode: 'UPSTREAM_UNAVAILABLE',
      errorMessage: 'Não foi possível estabelecer conexão segura com o servidor da Quero Passagem.',
      latencyMs,
    };
  } finally {
    clearTimeout(timeout);
  }
}

const VALID_SANDBOX_CPFS = [
  '52998224725',
  '39053344705',
  '12345678909',
  '71428793060',
  '84965915072',
];

function isValidMod11Cpf(raw: string): boolean {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum1 = 0;
  for (let i = 0; i < 9; i++) sum1 += Number(digits[i]) * (10 - i);
  let d1 = 11 - (sum1 % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== Number(digits[9])) return false;

  let sum2 = 0;
  for (let i = 0; i < 10; i++) sum2 += Number(digits[i]) * (11 - i);
  let d2 = 11 - (sum2 % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === Number(digits[10]);
}

function resolveSandboxCpf(raw: string | undefined, idx = 0): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (isValidMod11Cpf(digits)) return digits;
  return VALID_SANDBOX_CPFS[idx % VALID_SANDBOX_CPFS.length];
}

function safeClientHttpStatus(status?: number): number {
  if (!status || status < 400) return 400;
  // Evita códigos 403, 502, 503 e 504 que o proxy Nginx intercepta com HTML estático (/warmup.html)
  if ([403, 502, 503, 504].includes(status)) return 422;
  return status;
}

const PUBLIC_CALLBACK_FALLBACK =
  'https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback';

function resolvePublicCallbackUrl(req: express.Request, customUrl?: string): string {
  const candidate = String(customUrl || process.env.QP_CALLBACK_URL || '').trim();
  if (
    candidate.startsWith('https://') &&
    !candidate.includes('localhost') &&
    !candidate.includes('127.0.0.1')
  ) {
    return candidate;
  }

  const forwardedHost = String(req.headers['x-forwarded-host'] || '')
    .split(',')[0]
    .trim();
  if (
    forwardedHost &&
    !forwardedHost.includes('localhost') &&
    !forwardedHost.includes('127.0.0.1')
  ) {
    return `https://${forwardedHost}/api/rodoviario/callback`;
  }

  const hostHeader = String(req.get('host') || '').trim();
  if (hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('127.0.0.1')) {
    return `https://${hostHeader}/api/rodoviario/callback`;
  }

  return PUBLIC_CALLBACK_FALLBACK;
}

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR EXPRESS + VITE
// ============================================================================

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  const makeRequestId = () => `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. GET /api/rodoviario/health
  app.get('/api/rodoviario/health', (_req, res) => {
    const cfg = loadConfig();
    res.json({
      ok: true,
      status: 'ok',
      mode: cfg.appMode,
      qpEnv: cfg.qpEnv,
      baseUrl: cfg.baseUrl,
      affiliateCode: cfg.affiliateCode,
      hasSandboxCredentials: Boolean(cfg.username && cfg.password && cfg.affiliateCode),
      timestamp: new Date().toISOString(),
    });
  });

  // 2. GET /api/rodoviario/config
  app.get('/api/rodoviario/config', (req, res) => {
    const cfg = loadConfig(req.query.mode as string | undefined);
    const budget = getRateBudgetSnapshot(cfg.maxRequestsPerMinute);
    const hasSandboxCredentials = Boolean(cfg.username && cfg.password && cfg.affiliateCode);
    const defaultCallbackUrl = resolvePublicCallbackUrl(req);

    res.json({
      ok: true,
      mode: cfg.appMode,
      appMode: cfg.appMode,
      modeLabel:
        cfg.appMode === 'demo'
          ? 'Modo Demonstração (Fixtures Sintéticas)'
          : 'Homologação Oficial Quero Passagem (Sandbox ws_v4 • NCT)',
      qpEnv: cfg.qpEnv,
      baseUrl: cfg.baseUrl,
      affiliateCode: cfg.affiliateCode,
      usernamePreview: cfg.username,
      defaultCallbackUrl,
      hasSandboxCredentials,
      sandboxConfigured: hasSandboxCredentials,
      lastUpstreamStatus,
      rateLimit: {
        usedInLastMinute: budget.usedInLastMinute,
        budgetPerMinute: budget.budgetPerMinute,
        remainingInWindow: budget.remainingInWindow,
      },
      rateBudget: budget,
      cacheStats: {
        stopsCached: Boolean(stopsCache),
        companiesCached: Boolean(companiesCache),
        activeSearchEntries: searchCacheMap.size,
        activeTravelHandles: storedOptionsMap.size,
      },
      features: {
        connections: cfg.enableConnections,
        booking: cfg.enableBooking,
        checkout: cfg.enableCheckout,
        cancel: cfg.enableCancel,
        card: cfg.enableCard,
      },
      supportedScopes: [
        'GET /stops (Cache + Autocomplete)',
        'GET /companies',
        'GET /new/search/{from}/{to}/{date}/{affiliateCode}',
        'GET /new/search-connections/{from}/{to}/{date}/{affiliateCode}',
        'POST /new/seats (Multi-Floor + Multi-Segment)',
        'POST /new/booking (Homologação Cenários 1, 2 e 3)',
        'POST /new/checkout (Homologação + Callback URL)',
        'POST /purchase/get & /api/rodoviario/callback',
      ],
      excludedScopes: [],
    });
  });

  // 3. GET /api/rodoviario/diagnostics — Validação Read-Only End-to-End
  app.get('/api/rodoviario/diagnostics', async (_req, res) => {
    const cfg = loadConfig('sandbox');
    const faqAuth = Buffer.from(`${cfg.faqUsername}:${cfg.faqPassword}`).toString('base64');

    // Teste 1: Portal de Documentação/FAQ Quero Passagem
    let faqPortalProbe = { status: 0, ok: false, latencyMs: 0 };
    try {
      const t0 = Date.now();
      const faqRes = await fetch('https://queropassagem.com.br/api/faq', {
        headers: { Authorization: `Basic ${faqAuth}` },
      });
      faqPortalProbe = { status: faqRes.status, ok: faqRes.ok, latencyMs: Date.now() - t0 };
    } catch {
      faqPortalProbe = { status: 503, ok: false, latencyMs: 0 };
    }

    // Teste 2: Gateway Sandbox (qpdevs.com/ws_v4/companies)
    const sandboxProbe = await callQueroPassagemUpstream(
      { ...cfg, qpEnv: 'sandbox', baseUrl: QP_BASE_URLS.sandbox },
      'GET',
      '/companies'
    );

    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      internalApi: {
        status: 'ok',
        expressPort: PORT,
        configuredAppMode: cfg.appMode,
        configuredQpEnv: cfg.qpEnv,
        targetBaseUrl: cfg.baseUrl,
      },
      credentialsCheck: {
        hasUsername: Boolean(cfg.username),
        usernamePreview: cfg.username,
        hasPassword: Boolean(cfg.password),
        passwordLength: cfg.password.length,
        hasAffiliateCode: Boolean(cfg.affiliateCode),
        affiliateCodeValue: cfg.affiliateCode || null,
      },
      probes: {
        faqAndDocsPortal: faqPortalProbe,
        sandboxWsV4: {
          ok: sandboxProbe.ok,
          status: sandboxProbe.status,
          latencyMs: sandboxProbe.latencyMs,
          companiesCount: Array.isArray(sandboxProbe.data) ? sandboxProbe.data.length : 0,
          errorCode: sandboxProbe.errorCode,
          errorMessage: sandboxProbe.errorMessage,
        },
      },
    });
  });

  // 4. GET /api/rodoviario/stops?q=...
  app.get('/api/rodoviario/stops', async (req, res) => {
    const cfg = loadConfig(req.query.mode as string | undefined);
    const query = String(req.query.q || '').trim();
    const normalizedQuery = normalizeText(query);

    let allStops: StopItem[] = [];
    let activeMode: AppMode = cfg.appMode;
    let upstreamWarning: string | undefined;

    if (cfg.appMode === 'demo') {
      allStops = DEMO_STOPS;
    } else {
      const now = Date.now();
      if (stopsCache && now - stopsCache.createdAtMs < cfg.stopsCacheTtlMs) {
        allStops = stopsCache.items;
      } else {
        const upstream = await callQueroPassagemUpstream(cfg, 'GET', '/stops');
        if (upstream.ok && Array.isArray(upstream.data)) {
          const parsedStops: StopItem[] = upstream.data.map((item: any) => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            url: String(item.url || item.id || '').toLowerCase(),
            stateCode: String(item.state || item.uf || ''),
            isStation: String(item.id || '').startsWith('ROD_') || item.type === 'station',
            substops: Array.isArray(item.substops)
              ? item.substops.map((sub: any) => ({
                  id: String(sub.id || ''),
                  name: String(sub.name || ''),
                  url: String(sub.url || sub.id || '').toLowerCase(),
                  stateCode: String(sub.state || item.state || ''),
                  isStation: true,
                }))
              : [],
          }));

          // Garantir que ROD_55, ROD_1 e ROD_53 também sejam diretamente pesquisáveis pelo ID no topo
          const topPriorityStations: StopItem[] = [];
          for (const city of parsedStops) {
            if (Array.isArray(city.substops)) {
              for (const sub of city.substops) {
                if (['ROD_55', 'ROD_1', 'ROD_53', 'ROD_898'].includes(sub.id)) {
                  topPriorityStations.push({
                    id: sub.id,
                    name: sub.name,
                    url: sub.url,
                    stateCode: sub.stateCode,
                    isStation: true,
                    substops: [],
                  });
                }
              }
            }
          }

          allStops = [...topPriorityStations, ...parsedStops];
          stopsCache = { createdAtMs: now, items: allStops };
        } else {
          allStops = DEMO_STOPS;
          activeMode = 'demo';
          upstreamWarning = upstream.errorMessage;
        }
      }
    }

    const filtered = normalizedQuery
      ? allStops.filter(
          (s) =>
            normalizeText(s.id) === normalizedQuery ||
            normalizeText(s.id).includes(normalizedQuery) ||
            normalizeText(s.name).includes(normalizedQuery) ||
            normalizeText(s.stateCode || '').includes(normalizedQuery) ||
            (s.substops &&
              s.substops.some(
                (sub) =>
                  normalizeText(sub.id).includes(normalizedQuery) ||
                  normalizeText(sub.name).includes(normalizedQuery)
              ))
        )
      : allStops;

    // Priorizar correspondência exata de ID (ex: ROD_55, CIT_1, CIT_53)
    filtered.sort((a, b) => {
      const aExact = normalizeText(a.id) === normalizedQuery ? -1 : 0;
      const bExact = normalizeText(b.id) === normalizedQuery ? -1 : 0;
      return aExact - bExact;
    });

    const sliced = filtered.slice(0, 30);
    res.json({
      ok: true,
      mode: activeMode,
      count: sliced.length,
      stops: sliced,
      items: sliced,
      warning: upstreamWarning,
    });
  });

  // 5. GET /api/rodoviario/companies
  app.get('/api/rodoviario/companies', async (_req, res) => {
    const cfg = loadConfig();
    if (cfg.appMode === 'demo') {
      return res.json({ ok: true, mode: 'demo', companies: DEMO_COMPANIES, items: DEMO_COMPANIES });
    }

    const now = Date.now();
    if (companiesCache && now - companiesCache.createdAtMs < cfg.companiesCacheTtlMs) {
      return res.json({
        ok: true,
        mode: 'sandbox',
        companies: companiesCache.items,
        items: companiesCache.items,
      });
    }

    const upstream = await callQueroPassagemUpstream(cfg, 'GET', '/companies');
    if (!upstream.ok) {
      return res.json({
        ok: true,
        mode: 'demo',
        companies: DEMO_COMPANIES,
        items: DEMO_COMPANIES,
        warning: upstream.errorMessage,
      });
    }

    const rawList = Array.isArray(upstream.data) ? upstream.data : [];
    companiesCache = { createdAtMs: now, items: rawList };
    res.json({ ok: true, mode: 'sandbox', companies: rawList, items: rawList });
  });

  // 6. HANDLER UNIFICADO PARA BUSCA DE VIAGENS (GET e POST /api/rodoviario/search)
  const handleSearchRequest = async (req: express.Request, res: express.Response) => {
    const isPost = req.method === 'POST';
    const rawParams = isPost ? req.body || {} : req.query || {};

    const from = resolveOfficialStopId(String(rawParams.from || ''));
    const to = resolveOfficialStopId(String(rawParams.to || ''));
    const travelDate = String(rawParams.travelDate || rawParams.departureDate || rawParams.date || '').trim();
    const rawType = String(rawParams.travelType || rawParams.kind || 'direct').toLowerCase();
    const travelType: 'direct' | 'connection' = rawType === 'connection' ? 'connection' : 'direct';
    const cfg = loadConfig(rawParams.mode as string | undefined);
    const requestId = makeRequestId();

    if (!from || !to || !travelDate) {
      return res.status(400).json({
        ok: false,
        message: 'Informe origem, destino e data válidos para realizar a pesquisa.',
        error: { code: 'VALIDATION_ERROR', message: 'Parâmetros obrigatórios ausentes.', requestId },
      });
    }

    if (from === to) {
      return res.status(422).json({
        ok: false,
        message: 'Origem e destino não podem ser iguais.',
        error: { code: 'VALIDATION_ERROR', message: 'Origem e destino iguais.', requestId },
      });
    }

    const cacheKey = `${cfg.appMode}:${cfg.affiliateCode || 'NCT'}:${from}:${to}:${travelDate}:${travelType}`;
    const now = Date.now();
    const cached = searchCacheMap.get(cacheKey);
    if (cached && now - cached.createdAtMs < cfg.searchCacheTtlMs) {
      return res.json({ ...cached.payload, cached: true });
    }

    const fetchedAt = new Date(now).toISOString();
    const validityMs = cfg.qpEnv === 'production' ? 60 * 60 * 1000 : 3 * 60 * 60 * 1000;
    const expiresAt = new Date(now + validityMs).toISOString();

    if (cfg.appMode === 'demo') {
      const options = generateDemoSearchOptions(from, to, travelDate, travelType);
      const payload = {
        ok: true,
        mode: 'demo' as const,
        travelType,
        fetchedAt,
        expiresAt,
        cached: false,
        count: options.length,
        directCount: travelType === 'direct' ? options.length : 0,
        options,
        items: options,
      };
      searchCacheMap.set(cacheKey, { createdAtMs: now, payload });
      return res.json(payload);
    }

    const endpointPath =
      travelType === 'connection'
        ? `/new/search-connections/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(travelDate)}/${encodeURIComponent(cfg.affiliateCode)}`
        : `/new/search/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(travelDate)}/${encodeURIComponent(cfg.affiliateCode)}`;

    const upstream = await callQueroPassagemUpstream(cfg, 'GET', endpointPath);

    if (!upstream.ok || !Array.isArray(upstream.data)) {
      const fallbackOptions = generateDemoSearchOptions(from, to, travelDate, travelType);
      return res.json({
        ok: true,
        mode: 'demo' as const,
        upstreamStatus: upstream.status,
        upstreamErrorCode: upstream.errorCode,
        warning:
          upstream.errorMessage ||
          'Não foi possível consultar o Sandbox da Quero Passagem. Exibindo viagens de contingência.',
        travelType,
        fetchedAt,
        expiresAt,
        cached: false,
        count: fallbackOptions.length,
        directCount: travelType === 'direct' ? fallbackOptions.length : 0,
        options: fallbackOptions,
        items: fallbackOptions,
      });
    }

    const options: SearchOption[] = upstream.data.map((raw: any, idx: number) => {
      const optionId = `OPT_SBX_${travelType.toUpperCase()}_${Date.now()}_${idx + 1}`;
      const seatPrice = Number(raw?.price?.seatPrice ?? raw?.price?.price ?? 0);
      const taxPrice = Number(raw?.price?.taxPrice ?? 0);
      const totalPrice = Number(raw?.price?.price ?? seatPrice + taxPrice);
      const ccTaxPrice = raw?.price?.ccTaxPrice !== undefined ? Number(raw.price.ccTaxPrice) : undefined;
      const insurancePrice = Number(raw?.insurance ?? 0);
      const depDate = String(raw?.departure?.date || travelDate);
      const depTime = String(raw?.departure?.time || '08:00:00');
      const arrDate = String(raw?.arrival?.date || travelDate);
      const arrTime = String(raw?.arrival?.time || '14:00:00');
      const durationSec = Number(raw?.travelDuration || 21600);
      const durationMinutes = Math.max(1, Math.round(durationSec / 60));
      const externalTravelId = String(raw?.id || '');
      const manualConfirmation = Boolean(raw?.manualConfirmation);
      const withBPE = Boolean(raw?.withBPE);
      const CPFRequired = Boolean(raw?.CPFRequired);
      const allowCanceling = raw?.allowCanceling !== false;
      const seatsLayout: 'numbered' | 'quantity' = raw?.seatsLayout === 'quantity' ? 'quantity' : 'numbered';

      let connectionInfo: SearchOption['connectionInfo'] | undefined;
      if (travelType === 'connection' && raw?.connection) {
        const [seg1Id, seg2Id] = externalTravelId.split('|');
        const nodeStopId = String(raw.connection?.node?.id || 'ROD_CON');
        const nodeStopName = String(raw.connection?.node?.name || 'Terminal de Conexão');
        const waitArrDate = String(raw.connection?.waitingInformation?.arrival?.date || depDate);
        const waitArrTime = String(raw.connection?.waitingInformation?.arrival?.time || depTime);
        const waitDepDate = String(raw.connection?.waitingInformation?.departure?.date || depDate);
        const waitDepTime = String(raw.connection?.waitingInformation?.departure?.time || depTime);
        const waitingMinutes = computeMinutesBetween(waitArrDate, waitArrTime, waitDepDate, waitDepTime, 60);

        const seg2CompanyName = String(raw.connection?.company?.name || raw?.company?.name || 'Viação Oficial');
        const seg2SeatClass = String(raw.connection?.seatClass || raw?.seatClass || 'Executivo');

        connectionInfo = {
          connectionStopId: nodeStopId,
          connectionStopName: nodeStopName,
          waitingMinutes,
          segments: [
            {
              segmentIndex: 1,
              travelId: seg1Id || externalTravelId,
              company: {
                id: raw?.company?.id ?? 1,
                name: String(raw?.company?.name || 'Viação 1º Trecho'),
              },
              departure: {
                date: depDate,
                time: depTime.slice(0, 5),
                stopId: String(raw?.from?.id || from),
                stopName: String(raw?.from?.name || from),
              },
              arrival: {
                date: waitArrDate,
                time: waitArrTime.slice(0, 5),
                stopId: nodeStopId,
                stopName: nodeStopName,
              },
              seatClass: String(raw?.seatClass || 'Executivo'),
              rawSeatClass: String(raw?.seatClass || 'EXECUTIVO'),
              availableSeats: Number(raw?.availableSeats ?? 10),
              withBPE,
            },
            {
              segmentIndex: 2,
              travelId: seg2Id || externalTravelId,
              company: {
                id: raw.connection?.company?.id ?? 2,
                name: seg2CompanyName,
              },
              departure: {
                date: waitDepDate,
                time: waitDepTime.slice(0, 5),
                stopId: nodeStopId,
                stopName: nodeStopName,
              },
              arrival: {
                date: arrDate,
                time: arrTime.slice(0, 5),
                stopId: String(raw?.to?.id || to),
                stopName: String(raw?.to?.name || to),
              },
              seatClass: seg2SeatClass,
              rawSeatClass: seg2SeatClass,
              availableSeats: Number(raw.connection?.availableSeats ?? 10),
              withBPE: Boolean(raw.connection?.withBPE),
            },
          ],
        };
      }

      const mapped: SearchOption = {
        optionId,
        externalTravelId,
        travelType,
        company: {
          id: raw?.company?.id ?? idx + 1,
          name:
            travelType === 'connection' && raw?.connection?.company?.name && raw.connection.company.name !== raw?.company?.name
              ? `${raw?.company?.name} + ${raw.connection.company.name}`
              : String(raw?.company?.name || 'Viação Oficial'),
          logoUrl: raw?.company?.logo?.svg || raw?.company?.logo?.jpg,
        },
        from: {
          id: String(raw?.from?.id || from),
          name: String(raw?.from?.name || from),
        },
        to: {
          id: String(raw?.to?.id || to),
          name: String(raw?.to?.name || to),
        },
        departure: {
          date: depDate,
          time: depTime,
          iso: `${depDate}T${depTime}`,
        },
        arrival: {
          date: arrDate,
          time: arrTime,
          iso: `${arrDate}T${arrTime}`,
        },
        durationMinutes,
        durationLabel: formatDurationLabel(durationMinutes),
        availableSeats: Number(raw?.availableSeats ?? 10),
        seatClass:
          travelType === 'connection' && raw?.connection?.seatClass
            ? `${raw?.seatClass} / ${raw.connection.seatClass}`
            : String(raw?.seatClass || 'Executivo'),
        rawSeatClass: String(raw?.rawSeatClass || raw?.seatClass || 'EXECUTIVO'),
        pricing: {
          seatPrice,
          taxPrice,
          totalPrice,
          ccTaxPrice,
        },
        insurancePrice,
        manualConfirmation,
        withBPE,
        CPFRequired,
        allowCanceling,
        travelCancellationLimitDate: raw?.travelCancellationLimitDate || undefined,
        travelCancellationFee:
          raw?.travelCancellationFee !== undefined ? Number(raw.travelCancellationFee) : undefined,
        maximumAllowedPassengers: raw?.maximumAllowedPassengers ?? null,
        seatsLayout,
        boardingAtStop: true,
        vehicleType: seatsLayout === 'quantity' ? 'Alocação por Quantidade' : 'Mapa Numerado',
        connectionInfo,
      };

      storedOptionsMap.set(optionId, mapped);
      return mapped;
    });

    const payload = {
      ok: true,
      mode: 'sandbox' as const,
      travelType,
      fetchedAt,
      expiresAt,
      cached: false,
      count: options.length,
      directCount: travelType === 'direct' ? options.length : 0,
      options,
      items: options,
    };

    searchCacheMap.set(cacheKey, { createdAtMs: now, payload });
    res.json(payload);
  };

  app.post('/api/rodoviario/search', handleSearchRequest);
  app.get('/api/rodoviario/search', handleSearchRequest);

  // 7. POST /api/rodoviario/seats — Mapa de Poltronas Real (Simples e Conexão)
  app.post('/api/rodoviario/seats', async (req, res) => {
    const { optionId, travelId, mode } = req.body || {};
    const cfg = loadConfig(mode);

    const stored = optionId ? storedOptionsMap.get(String(optionId)) : undefined;
    const effectiveTravelId = String(travelId || stored?.externalTravelId || '');
    const targetOption: SearchOption =
      stored ||
      generateDemoSearchOptions('ROD_55', 'CIT_1', new Date().toISOString().slice(0, 10), 'direct')[0];

    if (
      cfg.appMode === 'demo' ||
      !effectiveTravelId ||
      effectiveTravelId.startsWith('QP_DIR_') ||
      effectiveTravelId.startsWith('QP_SEG1_')
    ) {
      return res.json(generateNormalizedSeatMap(targetOption, 'demo'));
    }

    const requestBody = {
      travelId: effectiveTravelId,
      orientation: 'horizontal',
      type: 'matrix',
    };

    const upstream = await callQueroPassagemUpstream(cfg, 'POST', '/new/seats', requestBody);

    if (!upstream.ok) {
      return res.status(safeClientHttpStatus(upstream.status)).json({
        ok: false,
        message: upstream.errorMessage || 'Falha ao consultar mapa de poltronas no Sandbox.',
        errorCode: upstream.errorCode,
      });
    }

    const parsedMap = parseQueroPassagemSeatMap(upstream.data, targetOption);
    res.json({
      ...parsedMap,
      externalTravelId: effectiveTravelId,
    });
  });

  // 8. POST /api/rodoviario/booking — Criação de Pré-Reserva no Sandbox Quero Passagem
  // (Acionado exclusivamente pelo usuário no front-end para os Cenários 1, 2 e 3)
  app.post('/api/rodoviario/booking', async (req, res) => {
    const cfg = loadConfig('sandbox');
    const { scenarioTag, travels, affiliateCode } = req.body || {};

    if (!Array.isArray(travels) || travels.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Informe ao menos 1 trecho (travels) para gerar a pré-reserva (booking).',
      });
    }

    // Monta o payload estritamente no padrão OpenAPI BookingRequestSchema da Quero Passagem
    const qpPayload = {
      affiliateCode: String(affiliateCode || cfg.affiliateCode || DEFAULT_AFFILIATE_CODE).trim(),
      travels: travels.map((leg: any) => {
        const storedOpt = leg.optionId ? storedOptionsMap.get(String(leg.optionId)) : undefined;
        const resolvedTravelId = String(leg.travelId || storedOpt?.externalTravelId || '').trim();
        const isConnectionLeg = resolvedTravelId.includes('|');

        return {
          travelId: resolvedTravelId,
          passengers: Array.isArray(leg.passengers)
            ? leg.passengers.map((p: any, pIdx: number) => {
                const validCpf = resolveSandboxCpf(p.cpf, pIdx);
                const passengerObj: Record<string, any> = {
                  name: String(p.name || `Passageiro Teste ${pIdx + 1}`).trim(),
                  travelDocument: String(p.travelDocument || `12345678${pIdx + 1}`).trim(),
                  travelDocumentType: String(p.travelDocumentType || 'RG').trim(),
                  seatNumber: String(p.seatNumber || '').trim(),
                  birthDate: String(p.birthDate || '1990-05-15').trim(),
                  cpf: validCpf,
                };

                // Apenas envia connectionSeatNumber se for uma viagem com conexão (`|`)!
                if (
                  isConnectionLeg ||
                  (p.connectionSeatNumber !== undefined &&
                    p.connectionSeatNumber !== null &&
                    String(p.connectionSeatNumber).trim() !== '')
                ) {
                  passengerObj.connectionSeatNumber = String(
                    p.connectionSeatNumber || p.seatNumber || ''
                  ).trim();
                }

                // Cenários 1.3 e 1.4: Apenas envia o objeto insurance para o passageiro COM seguro!
                if (p.includeInsurance && p.insurance) {
                  const insuredCpf = resolveSandboxCpf(p.insurance.cpf || p.cpf, pIdx);
                  passengerObj.insurance = {
                    cpf: insuredCpf,
                    birthDate: String(p.insurance.birthDate || p.birthDate || '1990-05-15').trim(),
                    cep: String(p.insurance.cep || '80010-000').trim(),
                  };
                } else if (p.insurance && p.insurance.cpf && p.includeInsurance !== false) {
                  const insuredCpf = resolveSandboxCpf(p.insurance.cpf || p.cpf, pIdx);
                  passengerObj.insurance = {
                    cpf: insuredCpf,
                    birthDate: String(p.insurance.birthDate || p.birthDate || '1990-05-15').trim(),
                    cep: String(p.insurance.cep || '80010-000').trim(),
                  };
                }

                return passengerObj;
              })
            : [],
        };
      }),
    };

    const upstream = await callQueroPassagemUpstream(cfg, 'POST', '/new/booking', qpPayload);

    const logEntry = recordHomologationLog({
      scenarioTag: scenarioTag ? String(scenarioTag) : undefined,
      operation: 'BOOKING_CREATE',
      method: 'POST',
      endpoint: `${cfg.baseUrl}/new/booking`,
      httpStatus: upstream.status,
      ok: upstream.ok,
      latencyMs: upstream.latencyMs,
      requestPayload: qpPayload,
      responsePayload: upstream.data ?? { error: upstream.errorMessage },
      notes: `Pré-reserva com ${qpPayload.travels.length} trecho(s)`,
    });

    if (!upstream.ok) {
      return res.status(safeClientHttpStatus(upstream.status)).json({
        ok: false,
        message: upstream.errorMessage || 'Erro ao criar booking na Quero Passagem.',
        upstreamData: upstream.data,
        logEntry,
      });
    }

    const bookingObject = Array.isArray(upstream.data) ? upstream.data[0] : upstream.data;
    res.json({
      ok: true,
      booking: bookingObject,
      rawResponse: upstream.data,
      requestSent: qpPayload,
      logEntry,
    });
  });

  // 9. GET e DELETE /api/rodoviario/booking/:bookingId
  app.get('/api/rodoviario/booking/:bookingId', async (req, res) => {
    const cfg = loadConfig('sandbox');
    const bookingId = encodeURIComponent(String(req.params.bookingId || '').trim());
    const upstream = await callQueroPassagemUpstream(cfg, 'GET', `/new/booking/${bookingId}`);

    const logEntry = recordHomologationLog({
      operation: 'BOOKING_GET',
      method: 'GET',
      endpoint: `${cfg.baseUrl}/new/booking/${bookingId}`,
      httpStatus: upstream.status,
      ok: upstream.ok,
      latencyMs: upstream.latencyMs,
      requestPayload: { bookingID: req.params.bookingId },
      responsePayload: upstream.data ?? { error: upstream.errorMessage },
    });

    res.status(upstream.ok ? 200 : safeClientHttpStatus(upstream.status)).json({
      ok: upstream.ok,
      booking: upstream.data,
      message: upstream.errorMessage,
      logEntry,
    });
  });

  app.delete('/api/rodoviario/booking/:bookingId', async (req, res) => {
    const cfg = loadConfig('sandbox');
    const bookingId = encodeURIComponent(String(req.params.bookingId || '').trim());
    const upstream = await callQueroPassagemUpstream(cfg, 'DELETE', `/new/booking/${bookingId}`);

    const logEntry = recordHomologationLog({
      operation: 'BOOKING_DELETE',
      method: 'DELETE',
      endpoint: `${cfg.baseUrl}/new/booking/${bookingId}`,
      httpStatus: upstream.status,
      ok: upstream.ok,
      latencyMs: upstream.latencyMs,
      requestPayload: { bookingID: req.params.bookingId },
      responsePayload: upstream.data ?? { error: upstream.errorMessage },
    });

    res.status(upstream.ok ? 200 : safeClientHttpStatus(upstream.status)).json({
      ok: upstream.ok,
      data: upstream.data,
      message: upstream.errorMessage,
      logEntry,
    });
  });

  // 10. POST /api/rodoviario/checkout — Finalização de Compra no Sandbox Quero Passagem
  // (Acionado exclusivamente pelo usuário no front-end para os Cenários 1, 2 e 3)
  app.post('/api/rodoviario/checkout', async (req, res) => {
    const cfg = loadConfig('sandbox');
    const {
      scenarioTag,
      bookingId,
      email,
      buyer,
      payment,
      callbackURL,
      includeCallbackUrl,
      externalId,
    } = req.body || {};

    if (!bookingId || !email) {
      return res.status(400).json({
        ok: false,
        message: 'Os campos bookingId e email são obrigatórios para realizar o checkout.',
      });
    }

    const resolvedCallbackUrl = resolvePublicCallbackUrl(req, callbackURL);

    const paymentMethod = String(payment?.method || 'creditCard').trim();

    let formattedPayment: Record<string, any> = { method: paymentMethod };
    if (paymentMethod === 'creditCard') {
      if (payment?.token) {
        formattedPayment = {
          method: 'creditCard',
          token: String(payment.token).trim(),
          holder: String(payment.holder || 'NC TURISMO TESTE').trim(),
          lastFourDigits: String(payment.lastFourDigits || '1111').trim(),
          ...(payment.installment ? { installment: Number(payment.installment) } : {}),
        };
      } else {
        formattedPayment = {
          method: 'creditCard',
          cardNumber: String(payment?.cardNumber || '4111 1111 1111 1111').trim(),
          holder: String(payment?.holder || 'NC TURISMO TESTE').trim(),
          expiresAt: String(payment?.expiresAt || '2030-10').trim(),
          securityCode: String(payment?.securityCode || '123').trim(),
          ...(payment?.installment ? { installment: Number(payment.installment) } : {}),
        };
      }
    } else if (paymentMethod === 'pix') {
      formattedPayment = { method: 'pix' };
    } else {
      formattedPayment = { method: 'preApproved' };
    }

    // Regra oficial do FAQ Quero Passagem:
    // - Nos Cenários 1 e 2 (manualConfirmation: false), omitir callbackURL força o fluxo síncrono imediato.
    // - No Cenário 3 (manualConfirmation: true), enviar callbackURL público (https://...) é obrigatório e retorna in_confirmation_process.
    const qpCheckoutPayload: Record<string, any> = {
      bookingId: String(bookingId).trim(),
      email: String(email).trim(),
      buyer:
        buyer === true
          ? true
          : {
              name: String(buyer?.name || 'NC Turismo Homologação').trim(),
              cpf: resolveSandboxCpf(buyer?.cpf, 0),
              ...(buyer?.cnpj ? { cnpj: String(buyer.cnpj).trim() } : {}),
              phone: String(buyer?.phone || '(41) 3281-1167').trim(),
            },
      payment: formattedPayment,
      externalId: String(externalId || `NCT-${Date.now()}`).trim(),
    };

    if (includeCallbackUrl || String(scenarioTag) === '3.1') {
      qpCheckoutPayload.callbackURL = resolvedCallbackUrl;
    }

    let upstream = await callQueroPassagemUpstream(cfg, 'POST', '/new/checkout', qpCheckoutPayload);

    // Se o ônibus exige manualConfirmation: true e o usuário havia desmarcado includeCallbackUrl,
    // a Quero Passagem retorna "The supplied callbackURL is invalid.". Reenviamos automaticamente com a URL pública válida!
    if (
      !upstream.ok &&
      !qpCheckoutPayload.callbackURL &&
      /callbackURL is invalid/i.test(String(upstream.errorMessage || ''))
    ) {
      qpCheckoutPayload.callbackURL = resolvedCallbackUrl;
      upstream = await callQueroPassagemUpstream(cfg, 'POST', '/new/checkout', qpCheckoutPayload);
    }

    const purchaseObj = Array.isArray(upstream.data) ? upstream.data[0] : upstream.data;
    if (purchaseObj?.id) {
      purchaseEmailMap.set(purchaseObj.id, {
        email: qpCheckoutPayload.email,
        externalId: qpCheckoutPayload.externalId,
      });
    }

    const logEntry = recordHomologationLog({
      scenarioTag: scenarioTag ? String(scenarioTag) : undefined,
      operation: 'CHECKOUT',
      method: 'POST',
      endpoint: `${cfg.baseUrl}/new/checkout`,
      httpStatus: upstream.status,
      ok: upstream.ok,
      latencyMs: upstream.latencyMs,
      requestPayload: qpCheckoutPayload,
      responsePayload: upstream.data ?? { error: upstream.errorMessage },
      notes: purchaseObj?.status
        ? `Pedido #${purchaseObj.id} · Status: ${purchaseObj.status}`
        : undefined,
    });

    if (!upstream.ok) {
      return res.status(safeClientHttpStatus(upstream.status)).json({
        ok: false,
        message: upstream.errorMessage || 'Falha ao processar checkout no Sandbox.',
        upstreamData: upstream.data,
        requestSent: qpCheckoutPayload,
        logEntry,
      });
    }

    res.json({
      ok: true,
      purchase: purchaseObj,
      rawResponse: upstream.data,
      requestSent: qpCheckoutPayload,
      logEntry,
    });
  });

  // 11. POST /api/rodoviario/purchase/get — Consulta Atualizada da Reserva
  app.post('/api/rodoviario/purchase/get', async (req, res) => {
    const cfg = loadConfig('sandbox');
    const { id, externalId, email, scenarioTag } = req.body || {};

    const qpPayload: Record<string, any> = {
      email: String(email || 'homologacao@ncturismo.com.br').trim(),
    };
    if (id !== undefined && id !== null && String(id).trim() !== '') {
      qpPayload.id = Number(id);
    }
    if (externalId) {
      qpPayload.externalId = String(externalId).trim();
    }

    const upstream = await callQueroPassagemUpstream(cfg, 'POST', '/purchase/get', qpPayload);

    const purchaseObj = Array.isArray(upstream.data) ? upstream.data[0] : upstream.data;
    const logEntry = recordHomologationLog({
      scenarioTag: scenarioTag ? String(scenarioTag) : undefined,
      operation: 'PURCHASE_GET',
      method: 'POST',
      endpoint: `${cfg.baseUrl}/purchase/get`,
      httpStatus: upstream.status,
      ok: upstream.ok,
      latencyMs: upstream.latencyMs,
      requestPayload: qpPayload,
      responsePayload: upstream.data ?? { error: upstream.errorMessage },
      notes: purchaseObj?.status ? `Status sincronizado: ${purchaseObj.status}` : undefined,
    });

    res.status(upstream.ok ? 200 : safeClientHttpStatus(upstream.status)).json({
      ok: upstream.ok,
      purchase: purchaseObj,
      rawResponse: upstream.data,
      message: upstream.errorMessage,
      logEntry,
    });
  });

  // 12. POST /api/rodoviario/callback — Receptor Oficial de Webhook Quero Passagem (Cenário 3.1)
  app.post('/api/rodoviario/callback', async (req, res) => {
    const payload = req.body || {};
    const purchaseId = payload?.id;
    const changeType = payload?.change || 'purchase_update';

    const webhookLog = recordHomologationLog({
      scenarioTag: '3.1',
      operation: 'WEBHOOK_CALLBACK',
      method: 'POST',
      endpoint: '/api/rodoviario/callback',
      httpStatus: 200,
      ok: true,
      latencyMs: 1,
      requestPayload: payload,
      responsePayload: { status: 'received', id: purchaseId, change: changeType },
      notes: `Callback Quero Passagem recebido (id=${purchaseId}, change=${changeType})`,
    });

    // Sincronização proativa recomendada pelo FAQ: ao receber o gatilho no callback,
    // consulta automaticamente POST /purchase/get para registrar o novo status (paid ou canceled).
    if (purchaseId) {
      const knownBuyer = purchaseEmailMap.get(Number(purchaseId)) || purchaseEmailMap.get(String(purchaseId));
      const syncEmail = knownBuyer?.email || 'homologacao@ncturismo.com.br';
      const cfg = loadConfig('sandbox');
      const getPayload = { id: Number(purchaseId), email: syncEmail };

      callQueroPassagemUpstream(cfg, 'POST', '/purchase/get', getPayload)
        .then((syncRes) => {
          const syncedPurchase = Array.isArray(syncRes.data) ? syncRes.data[0] : syncRes.data;
          recordHomologationLog({
            scenarioTag: '3.1',
            operation: 'PURCHASE_GET',
            method: 'POST',
            endpoint: `${cfg.baseUrl}/purchase/get`,
            httpStatus: syncRes.status,
            ok: syncRes.ok,
            latencyMs: syncRes.latencyMs,
            requestPayload: getPayload,
            responsePayload: syncRes.data ?? { error: syncRes.errorMessage },
            notes: `Sincronização automática pós-callback #${purchaseId} -> status=${syncedPurchase?.status || 'desconhecido'}`,
          });
        })
        .catch(() => {});
    }

    res.status(200).json({
      ok: true,
      receivedAt: webhookLog.timestamp,
      id: purchaseId,
      change: changeType,
    });
  });

  // 13. GET e DELETE /api/rodoviario/homologation-logs — Painel e Exportação (.json / .md)
  app.get('/api/rodoviario/homologation-logs', (req, res) => {
    const format = String(req.query.format || '').toLowerCase();

    if (format === 'md' || format === 'markdown') {
      const lines: string[] = [
        '# Relatório de Homologação API Rodoviária — NC Turismo (Afiliado: NCT)',
        `Gerado em: ${new Date().toISOString()}`,
        `Ambiente: ${QP_BASE_URLS.sandbox}`,
        '',
      ];

      homologationLogs.forEach((log, idx) => {
        lines.push(`## ${idx + 1}. [${log.operation}] ${log.scenarioTag ? `Cenário ${log.scenarioTag} — ` : ''}${log.timestamp}`);
        lines.push(`- **Endpoint**: \`${log.method} ${log.endpoint}\``);
        lines.push(`- **Status HTTP**: \`${log.httpStatus}\` (${log.latencyMs}ms)`);
        if (log.notes) lines.push(`- **Observação**: ${log.notes}`);
        lines.push('\n### Request');
        lines.push('```json');
        lines.push(JSON.stringify(log.requestPayload, null, 2));
        lines.push('```');
        lines.push('\n### Response');
        lines.push('```json');
        lines.push(JSON.stringify(log.responsePayload, null, 2));
        lines.push('```\n---\n');
      });

      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="homologacao-queropassagem-nct.md"');
      return res.send(lines.join('\n'));
    }

    res.json({
      ok: true,
      affiliateCode: DEFAULT_AFFILIATE_CODE,
      count: homologationLogs.length,
      logs: homologationLogs,
    });
  });

  app.delete('/api/rodoviario/homologation-logs', (_req, res) => {
    homologationLogs.length = 0;
    res.json({ ok: true, count: 0, logs: [] });
  });

  // 13b. GET /api/rodoviario/consolidated-dossier — Retorna o Dossiê Consolidado Oficial (.md e .json)
  app.get('/api/rodoviario/consolidated-dossier', (_req, res) => {
    try {
      const mdPath = path.join(__dirname, 'docs', 'homologacao-consolidada-ncturismo.md');
      const jsonPath = path.join(__dirname, 'docs', 'homologacao-consolidada-ncturismo.json');
      const markdown = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
      const jsonObj = fs.existsSync(jsonPath)
        ? JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
        : { affiliateCode: DEFAULT_AFFILIATE_CODE, logs: homologationLogs };
      res.json({
        ok: true,
        affiliateCode: DEFAULT_AFFILIATE_CODE,
        markdown,
        dossier: jsonObj,
      });
    } catch (err: any) {
      res.status(400).json({
        ok: false,
        message: err?.message || 'Erro ao carregar dossiê consolidado.',
      });
    }
  });

  // 14. GET e POST /api/rodoviario/connection-suggestions
  const handleConnectionSuggestions = async (req: express.Request, res: express.Response) => {
    const params = req.method === 'POST' ? req.body || {} : req.query || {};
    const from = resolveOfficialStopId(String(params.from || 'ROD_55'));
    const to = resolveOfficialStopId(String(params.to || 'CIT_1'));

    res.json({
      ok: true,
      suggestions: [
        {
          stopId: 'ROD_1',
          stopName: 'São Paulo - Tietê NEW IBE',
          estimatedWaitMinutes: 50,
          firstLegCount: 6,
          secondLegCount: 8,
        },
        {
          stopId: 'ROD_53',
          stopName: 'Curitiba, PR (Rodoferroviária)',
          estimatedWaitMinutes: 45,
          firstLegCount: 4,
          secondLegCount: 5,
        },
      ],
      from,
      to,
    });
  };

  app.get('/api/rodoviario/connection-suggestions', handleConnectionSuggestions);
  app.post('/api/rodoviario/connection-suggestions', handleConnectionSuggestions);

  // Google Search Console HTML file verification
  app.get('/googlee3ac6d137dc9f055.html', (_req, res) => {
    res.type('text/html').send('google-site-verification: googlee3ac6d137dc9f055.html');
  });

  // Vite middleware in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NC Turismo Server + Rodoviário API listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
