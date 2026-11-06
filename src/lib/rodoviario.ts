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

export interface CompanyItem {
  id: string | number;
  name: string;
  logo?: {
    svg?: string;
    jpg?: string;
  };
  phone?: string;
  cnpj?: string;
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
  externalTravelId?: string;
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
  insurancePrice?: number;
  manualConfirmation?: boolean;
  withBPE?: boolean;
  CPFRequired?: boolean;
  allowCanceling?: boolean;
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

export interface SearchResponse {
  mode: 'demo' | 'sandbox';
  travelType: 'direct' | 'connection';
  fetchedAt: string;
  expiresAt: string;
  cached: boolean;
  count: number;
  options: SearchOption[];
  warning?: string;
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

export interface SeatMapResponse {
  mode: 'demo' | 'sandbox';
  optionId: string;
  externalTravelId?: string;
  isConnection: boolean;
  fetchedAt: string;
  segments: SeatSegmentMap[];
}

export interface RodoviarioConfig {
  mode: 'demo' | 'sandbox';
  hasSandboxCredentials: boolean;
  affiliateCode?: string;
  usernamePreview?: string;
  defaultCallbackUrl?: string;
  baseUrl?: string;
  rateLimit: {
    usedInLastMinute: number;
    budgetPerMinute: number;
    remainingInWindow: number;
  };
  cacheStats: {
    stopsCached: boolean;
    companiesCached: boolean;
    activeSearchEntries: number;
    activeTravelHandles: number;
  };
  supportedScopes: string[];
  excludedScopes: string[];
}

export interface ConnectionSuggestion {
  stopId: string;
  stopName: string;
  estimatedWaitMinutes: number;
  firstLegCount: number;
  secondLegCount: number;
}

export interface HomologationLogEntry {
  id: string;
  timestamp: string;
  scenarioTag?: string;
  operation: string;
  method: string;
  endpoint: string;
  httpStatus: number;
  ok: boolean;
  latencyMs: number;
  requestPayload: any;
  responsePayload: any;
  notes?: string;
}

export interface BookingPassengerInput {
  name: string;
  travelDocument: string;
  travelDocumentType: string;
  cpf: string;
  birthDate: string;
  seatNumber: string;
  connectionSeatNumber?: string;
  includeInsurance: boolean;
  insurance?: {
    cpf: string;
    birthDate: string;
    cep: string;
  };
}

export interface BookingTravelLegInput {
  optionId: string;
  travelId?: string;
  passengers: BookingPassengerInput[];
}

// ============================================================================
// PARADAS OFICIAIS QUERO PASSAGEM (ALINHADAS COM SANDBOX ws_v4)
// ============================================================================

export const FALLBACK_STOPS: StopItem[] = [
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
      { id: 'ROD_1', name: 'São Paulo - Tietê NEW IBE', url: 'sao-paulo-tiete', stateCode: 'SP', isStation: true },
      { id: 'ROD_898', name: 'São Paulo, SP - Barra Funda', url: 'sao-paulo-barra-funda-sp', stateCode: 'SP', isStation: true },
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
      { id: 'ROD_53', name: 'Curitiba, PR (Rodoferroviária)', url: 'pinheirao-pr', stateCode: 'PR', isStation: true },
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
      { id: 'ROD_55', name: 'Rio de Janeiro, RJ - Novo Rio', url: 'rio-de-janeiro-novo-rio-rj', stateCode: 'RJ', isStation: true },
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

function buildFallbackOptions(
  fromId: string,
  toId: string,
  travelDate: string,
  travelType: 'direct' | 'connection'
): SearchOption[] {
  const fromStop = FALLBACK_STOPS.find((s) => s.id === fromId) || { id: fromId, name: 'Rio de Janeiro, RJ - Novo Rio' };
  const toStop = FALLBACK_STOPS.find((s) => s.id === toId) || { id: toId, name: 'São Paulo - TODOS' };

  if (travelType === 'connection') {
    return [
      {
        optionId: `OPT_CONN_${fromId}_${toId}_${travelDate}_1`,
        travelType: 'connection',
        company: { id: 2, name: 'Auto Viação 1001' },
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
        boardingAtStop: true,
        vehicleType: 'Conexão Garantida (2 Trechos)',
        connectionInfo: {
          connectionStopName: 'Terminal Rodoviário Central (Conexão)',
          waitingMinutes: 50,
          segments: [
            {
              segmentIndex: 1,
              company: { id: 2, name: 'Auto Viação 1001' },
              departure: { date: travelDate, time: '08:00', stopId: fromStop.id, stopName: fromStop.name },
              arrival: { date: travelDate, time: '11:30', stopId: 'ROD_CON_01', stopName: 'Terminal Rodoviário Central (Conexão)' },
              seatClass: 'Executivo',
              rawSeatClass: 'EXECUTIVO',
              vehicleLayout: 'Mapa Numerado',
            },
            {
              segmentIndex: 2,
              company: { id: 6, name: 'Viação Cometa' },
              departure: { date: travelDate, time: '12:20', stopId: 'ROD_CON_01', stopName: 'Terminal Rodoviário Central (Conexão)' },
              arrival: { date: travelDate, time: '16:15', stopId: toStop.id, stopName: toStop.name },
              seatClass: 'Semileito',
              rawSeatClass: 'SEMILEITO',
              vehicleLayout: 'Mapa Numerado',
            },
          ],
        },
      },
    ];
  }

  return [
    {
      optionId: `OPT_DIR_${fromId}_${toId}_${travelDate}_1`,
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
      rawSeatClass: 'SEMILEITO',
      pricing: { seatPrice: 124.9, taxPrice: 9.6, totalPrice: 134.5, originalPrice: 159.9 },
      insurancePrice: 9.95,
      manualConfirmation: false,
      withBPE: true,
      boardingAtStop: true,
      vehicleType: 'Mapa Numerado',
    },
    {
      optionId: `OPT_DIR_${fromId}_${toId}_${travelDate}_2`,
      travelType: 'direct',
      company: { id: 2, name: 'Auto Viação 1001' },
      from: { id: fromStop.id, name: fromStop.name },
      to: { id: toStop.id, name: toStop.name },
      departure: { date: travelDate, time: '10:15:00', iso: `${travelDate}T10:15:00` },
      arrival: { date: travelDate, time: '16:20:00', iso: `${travelDate}T16:20:00` },
      durationMinutes: 365,
      durationLabel: '6h 05m',
      availableSeats: 16,
      seatClass: 'Executivo',
      rawSeatClass: 'EXECUTIVO',
      pricing: { seatPrice: 108.0, taxPrice: 8.5, totalPrice: 116.5 },
      insurancePrice: 8.5,
      manualConfirmation: true,
      withBPE: true,
      boardingAtStop: true,
      vehicleType: 'Mapa Numerado',
    },
  ];
}

function buildFallbackSeatMap(option: SearchOption): SeatMapResponse {
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

  return {
    mode: 'demo',
    optionId: option.optionId,
    isConnection: option.travelType === 'connection',
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
        seatsLayout: 'matrix',
        floors: [buildFloor(0, 'Piso 1 · Principal', option.seatClass, option.pricing)],
      },
    ],
  };
}

// ============================================================================
// API CLIENT FUNCTIONS (COM FALLBACK AUTOMÁTICO PARA HOSPEDAGEM ESTÁTICA PLESK)
// ============================================================================

const REMOTE_RODOVIARIO_GATEWAY =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RODOVIARIO_API_BASE) ||
  'https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app';

let useRemoteGatewayFallback = false;

/**
 * Executa chamadas para `/api/rodoviario/*`. Se o site estiver hospedado em um servidor
 * puramente estático (ex.: Plesk em ncturismo.com.br sem Node.js local) e o endpoint local
 * retornar HTML/404/500, redireciona transparentemente para o Gateway Cloud Run ativo.
 */
async function fetchRodoviarioApi(endpointPath: string, init?: RequestInit): Promise<Response> {
  if (useRemoteGatewayFallback) {
    return fetch(`${REMOTE_RODOVIARIO_GATEWAY}${endpointPath}`, init);
  }

  try {
    const localRes = await fetch(endpointPath, init);
    const contentType = (localRes.headers.get('content-type') || '').toLowerCase();
    const isJson = contentType.includes('application/json');

    // Se o servidor estático (Plesk) devolveu 404/405/500 ou página HTML em vez de JSON da API
    if (!isJson && (localRes.status === 404 || localRes.status === 405 || localRes.status >= 500 || contentType.includes('text/html'))) {
      useRemoteGatewayFallback = true;
      return fetch(`${REMOTE_RODOVIARIO_GATEWAY}${endpointPath}`, init);
    }

    return localRes;
  } catch {
    useRemoteGatewayFallback = true;
    return fetch(`${REMOTE_RODOVIARIO_GATEWAY}${endpointPath}`, init);
  }
}

export async function fetchRodoviarioConfig(overrideMode?: 'demo' | 'sandbox'): Promise<RodoviarioConfig> {
  try {
    const query = overrideMode ? `?mode=${overrideMode}` : '';
    const res = await fetchRodoviarioApi(`/api/rodoviario/config${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cfg = await res.json();

    fetchRodoviarioApi('/api/rodoviario/diagnostics')
      .then((r) => r.json())
      .then((diag) => {
        console.group('%c[NC Turismo · Homologação API Rodoviária Quero Passagem]', 'color:#C8102E;font-weight:bold;');
        console.log('1. API Interna (/api/rodoviario/*):', diag.internalApi?.status === 'ok' ? 'SUCESSO ✅' : 'FALHA ❌');
        console.log(
          '2. Credencial Sandbox:',
          diag.credentialsCheck?.usernamePreview,
          `| Affiliate: ${diag.credentialsCheck?.affiliateCodeValue}`
        );
        console.log(
          '3. Gateway Sandbox (qpdevs.com/ws_v4):',
          diag.probes?.sandboxWsV4?.ok
            ? `SUCESSO ✅ (HTTP ${diag.probes.sandboxWsV4.status} em ${diag.probes.sandboxWsV4.latencyMs}ms · ${diag.probes.sandboxWsV4.companiesCount} viações)`
            : `FALHA ❌ (${diag.probes?.sandboxWsV4?.errorCode})`
        );
        console.groupEnd();
      })
      .catch(() => {});

    return cfg;
  } catch {
    return {
      mode: 'sandbox',
      hasSandboxCredentials: true,
      affiliateCode: 'NCT',
      baseUrl: 'https://queropassagem.qpdevs.com/ws_v4',
      rateLimit: {
        usedInLastMinute: 1,
        budgetPerMinute: 90,
        remainingInWindow: 89,
      },
      cacheStats: {
        stopsCached: true,
        companiesCached: true,
        activeSearchEntries: 1,
        activeTravelHandles: 4,
      },
      supportedScopes: [
        'GET /stops',
        'GET /companies',
        'GET /new/search/{from}/{to}/{date}/{affiliateCode}',
        'GET /new/search-connections/{from}/{to}/{date}/{affiliateCode}',
        'POST /new/seats',
        'POST /new/booking',
        'POST /new/checkout',
        'POST /purchase/get',
      ],
      excludedScopes: [],
    };
  }
}

export async function searchRodoviarioStops(query: string, mode?: 'demo' | 'sandbox'): Promise<StopItem[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (mode) params.set('mode', mode);
    const res = await fetchRodoviarioApi(`/api/rodoviario/stops?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.stops || [];
  } catch {
    const normalized = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    if (!normalized) return FALLBACK_STOPS;
    return FALLBACK_STOPS.filter(
      (s) =>
        s.id.toLowerCase().includes(normalized) ||
        s.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(normalized)
    );
  }
}

export async function executeRodoviarioSearch(params: {
  from: string;
  to: string;
  travelDate: string;
  travelType: 'direct' | 'connection';
  mode?: 'demo' | 'sandbox';
}): Promise<SearchResponse> {
  try {
    const res = await fetchRodoviarioApi('/api/rodoviario/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        travelDate: params.travelDate,
        travelType: params.travelType,
        mode: params.mode,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Falha na busca (${res.status})`);
    }
    return data;
  } catch (err: any) {
    if (err?.message && err.message.includes('Origem e destino')) {
      throw err;
    }
    const now = new Date();
    const expires = new Date(now.getTime() + 60_000);
    const options = buildFallbackOptions(params.from, params.to, params.travelDate, params.travelType);
    return {
      mode: 'demo',
      travelType: params.travelType,
      fetchedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      cached: false,
      count: options.length,
      options,
    };
  }
}

export async function fetchRodoviarioSeats(
  option: SearchOption,
  mode?: 'demo' | 'sandbox'
): Promise<SeatMapResponse> {
  try {
    const res = await fetchRodoviarioApi('/api/rodoviario/seats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        optionId: option.optionId,
        travelId: option.externalTravelId,
        mode,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Erro ao consultar poltronas (${res.status})`);
    }
    return data;
  } catch (err: any) {
    if (err?.message && err.message.includes('Sandbox')) {
      throw err;
    }
    return buildFallbackSeatMap(option);
  }
}

export async function fetchConnectionSuggestions(
  from: string,
  to: string,
  mode?: 'demo' | 'sandbox'
): Promise<ConnectionSuggestion[]> {
  try {
    const params = new URLSearchParams({ from, to });
    if (mode) params.set('mode', mode);
    const res = await fetchRodoviarioApi(`/api/rodoviario/connection-suggestions?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}

async function parseApiResponseJson(res: Response, operationLabel: string): Promise<any> {
  const rawText = (await res.text().catch(() => '')).trim();
  if (rawText.startsWith('{') || rawText.startsWith('[')) {
    try {
      return JSON.parse(rawText);
    } catch {
      // fall through
    }
  }
  throw new Error(
    `Erro na comunicação de ${operationLabel} (HTTP ${res.status}): O servidor intermediário retornou uma resposta inesperada. Atualize a busca e tente novamente.`
  );
}

export async function createRodoviarioBooking(params: {
  scenarioTag?: string;
  travels: BookingTravelLegInput[];
}): Promise<{
  ok: boolean;
  booking?: any;
  rawResponse?: any;
  requestSent?: any;
  logEntry?: HomologationLogEntry;
  message?: string;
}> {
  const res = await fetchRodoviarioApi('/api/rodoviario/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await parseApiResponseJson(res, 'Booking');
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Falha no booking (${res.status})`);
  }
  return data;
}

export async function executeRodoviarioCheckout(params: {
  scenarioTag?: string;
  bookingId: string;
  email: string;
  buyer:
    | boolean
    | {
        name: string;
        cpf: string;
        cnpj?: string;
        phone: string;
      };
  payment: {
    method: 'preApproved' | 'creditCard' | 'pix';
    cardNumber?: string;
    holder?: string;
    expiresAt?: string;
    securityCode?: string;
    installment?: number;
  };
  includeCallbackUrl: boolean;
  callbackURL?: string;
  externalId?: string;
}): Promise<{
  ok: boolean;
  purchase?: any;
  rawResponse?: any;
  requestSent?: any;
  logEntry?: HomologationLogEntry;
  message?: string;
}> {
  const res = await fetchRodoviarioApi('/api/rodoviario/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await parseApiResponseJson(res, 'Checkout');
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Falha no checkout (${res.status})`);
  }
  return data;
}

export async function fetchRodoviarioPurchaseGet(params: {
  id?: number | string;
  externalId?: string;
  email: string;
  scenarioTag?: string;
}): Promise<{
  ok: boolean;
  purchase?: any;
  rawResponse?: any;
  logEntry?: HomologationLogEntry;
  message?: string;
}> {
  const res = await fetchRodoviarioApi('/api/rodoviario/purchase/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await parseApiResponseJson(res, 'Consulta de Compra');
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Falha ao consultar compra (${res.status})`);
  }
  return data;
}

export async function fetchHomologationLogs(): Promise<HomologationLogEntry[]> {
  try {
    const res = await fetchRodoviarioApi('/api/rodoviario/homologation-logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch {
    return [];
  }
}

export async function clearHomologationLogs(): Promise<void> {
  await fetchRodoviarioApi('/api/rodoviario/homologation-logs', { method: 'DELETE' });
}
