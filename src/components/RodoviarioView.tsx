import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Bus,
  MapPin,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  Clock,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Info,
  RefreshCw,
  ArrowRight,
  Layers,
  GitBranch,
  Armchair,
  MessageSquare,
  FileCode2,
  Download,
  Copy,
  Check,
  CreditCard,
  Shield,
  Webhook,
  Trash2,
} from 'lucide-react';
import {
  StopItem,
  SearchOption,
  SearchResponse,
  SeatMapResponse,
  SeatMatrixCell,
  ConnectionSuggestion,
  HomologationLogEntry,
  BookingPassengerInput,
  FALLBACK_STOPS,
  fetchRodoviarioConfig,
  searchRodoviarioStops,
  executeRodoviarioSearch,
  fetchRodoviarioSeats,
  fetchConnectionSuggestions,
  createRodoviarioBooking,
  executeRodoviarioCheckout,
  fetchRodoviarioPurchaseGet,
  fetchHomologationLogs,
  clearHomologationLogs,
} from '../lib/rodoviario';

interface RodoviarioViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis?: () => void;
  onOpenBeneficios?: () => void;
}

type SortByOption = 'departure_asc' | 'price_asc' | 'duration_asc' | 'seats_desc';
type TimePeriodFilter = 'all' | 'madrugada' | 'manha' | 'tarde' | 'noite';
type TravelModeFilter = 'all' | 'direct' | 'connection';
type ManualConfirmationFilter = 'all' | 'false' | 'true';

interface SelectedSeatAssignment {
  segmentIndex: number;
  floorIndex: number;
  seatNumber: string;
  seatPrice: number;
  taxPrice: number;
  totalPrice: number;
  passengerNumber: number;
}

interface StagedLegSelection {
  option: SearchOption;
  seats: SelectedSeatAssignment[];
}

interface PassengerFormState {
  name: string;
  travelDocument: string;
  travelDocumentType: string;
  cpf: string;
  birthDate: string;
  cep: string;
  includeInsurance: boolean;
}

const DEFAULT_PASSENGERS: PassengerFormState[] = [
  {
    name: 'Joao Carlos Silva Teste',
    travelDocument: '123456789',
    travelDocumentType: 'RG',
    cpf: '52998224725',
    birthDate: '1990-05-15',
    cep: '80010-000',
    includeInsurance: false,
  },
  {
    name: 'Maria Fernanda Souza Teste',
    travelDocument: '987654321',
    travelDocumentType: 'RG',
    cpf: '39053344705',
    birthDate: '1992-08-20',
    cep: '01310-100',
    includeInsurance: false,
  },
  {
    name: 'Carlos Eduardo Oliveira',
    travelDocument: '456789123',
    travelDocumentType: 'RG',
    cpf: '12345678909',
    birthDate: '1988-11-10',
    cep: '20040-002',
    includeInsurance: false,
  },
  {
    name: 'Ana Paula Santos',
    travelDocument: '741852963',
    travelDocumentType: 'RG',
    cpf: '71428793060',
    birthDate: '1995-03-25',
    cep: '80420-090',
    includeInsurance: false,
  },
  {
    name: 'Pedro Henrique Costa',
    travelDocument: '369258147',
    travelDocumentType: 'RG',
    cpf: '84965915072',
    birthDate: '1985-07-04',
    cep: '04538-132',
    includeInsurance: false,
  },
];

const HOMOLOGATION_SCENARIOS = [
  {
    tag: '1.1',
    label: '1.1 · Compra simples: Ida com 1 passageiro (manualConfirmation: false)',
    passengers: 1,
    roundTrip: false,
    connection: false,
    manualConfirmation: false,
    insurancePreset: [false],
  },
  {
    tag: '1.2',
    label: '1.2 · Compra simples: Ida e Volta com 1 passageiro (manualConfirmation: false)',
    passengers: 1,
    roundTrip: true,
    connection: false,
    manualConfirmation: false,
    insurancePreset: [false],
  },
  {
    tag: '1.3',
    label: '1.3 · Compra simples: Ida com 2 passageiros (1 COM seguro e 1 SEM seguro)',
    passengers: 2,
    roundTrip: false,
    connection: false,
    manualConfirmation: false,
    insurancePreset: [true, false],
  },
  {
    tag: '1.4',
    label: '1.4 · Compra simples: Ida e Volta com 2 passageiros (1 COM seguro e 1 SEM seguro)',
    passengers: 2,
    roundTrip: true,
    connection: false,
    manualConfirmation: false,
    insurancePreset: [true, false],
  },
  {
    tag: '2.1',
    label: '2.1 · Conexão: Apenas Ida com 1 passageiro (manualConfirmation: false)',
    passengers: 1,
    roundTrip: false,
    connection: true,
    manualConfirmation: false,
    insurancePreset: [false],
  },
  {
    tag: '2.2',
    label: '2.2 · Conexão: Ida e Volta com 1 passageiro (manualConfirmation: false)',
    passengers: 1,
    roundTrip: true,
    connection: true,
    manualConfirmation: false,
    insurancePreset: [false],
  },
  {
    tag: '2.3',
    label: '2.3 · Conexão: 2 passageiros (manualConfirmation: false)',
    passengers: 2,
    roundTrip: false,
    connection: true,
    manualConfirmation: false,
    insurancePreset: [false, false],
  },
  {
    tag: '3.1',
    label: '3.1 · Confirmação Posterior: Ônibus com manualConfirmation: true + Callback URL (Não cancelar)',
    passengers: 1,
    roundTrip: false,
    connection: false,
    manualConfirmation: true,
    insurancePreset: [false],
  },
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const getDefaultFutureDate = (daysAhead = 3) => {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  return target.toISOString().split('T')[0];
};

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const formatDateShort = (yyyyMmDd: string) => {
  if (!yyyyMmDd) return '';
  const parts = yyyyMmDd.split('-');
  if (parts.length !== 3) return yyyyMmDd;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export const RodoviarioView: React.FC<RodoviarioViewProps> = ({
  onBackToHome,
  onOpenBeneficios,
}) => {
  // =========================================================================
  // SYSTEM CONFIG & MODE STATE
  // =========================================================================
  const [activeMode, setActiveMode] = useState<'demo' | 'sandbox'>('sandbox');
  const initialPublicCallbackUrl =
    typeof window !== 'undefined' &&
    window.location.origin.startsWith('https://') &&
    !window.location.origin.includes('localhost')
      ? `${window.location.origin}/api/rodoviario/callback`
      : 'https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback';

  const [defaultCallbackUrl, setDefaultCallbackUrl] = useState<string>(initialPublicCallbackUrl);

  // =========================================================================
  // SEARCH ENGINE STATE (Padrão Inicial: ROD_55 -> CIT_1 para Homologação)
  // =========================================================================
  const [originStop, setOriginStop] = useState<StopItem | null>(FALLBACK_STOPS[0]); // ROD_55: Rio de Janeiro, RJ - Novo Rio
  const [destinationStop, setDestinationStop] = useState<StopItem | null>(FALLBACK_STOPS[1]); // CIT_1: São Paulo - TODOS
  const [originQuery, setOriginQuery] = useState(FALLBACK_STOPS[0].name);
  const [destinationQuery, setDestinationQuery] = useState(FALLBACK_STOPS[1].name);

  const [originSuggestions, setOriginSuggestions] = useState<StopItem[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<StopItem[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const [departureDate, setDepartureDate] = useState<string>(getDefaultFutureDate(3));
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [includeConnections, setIncludeConnections] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  // =========================================================================
  // ROUND-TRIP & RESULTS STATE
  // =========================================================================
  const [activeTripStep, setActiveTripStep] = useState<'outbound' | 'inbound'>('outbound');
  const [stagedOutboundLeg, setStagedOutboundLeg] = useState<StagedLegSelection | null>(null);

  // Outbound Direct & Connection independent states
  const [outboundDirectLoading, setOutboundDirectLoading] = useState(false);
  const [outboundConnLoading, setOutboundConnLoading] = useState(false);
  const [outboundDirectRes, setOutboundDirectRes] = useState<SearchResponse | null>(null);
  const [outboundConnRes, setOutboundConnRes] = useState<SearchResponse | null>(null);
  const [outboundError, setOutboundError] = useState<string | null>(null);

  // Inbound Direct & Connection independent states
  const [inboundDirectLoading, setInboundDirectLoading] = useState(false);
  const [inboundConnLoading, setInboundConnLoading] = useState(false);
  const [inboundDirectRes, setInboundDirectRes] = useState<SearchResponse | null>(null);
  const [inboundConnRes, setInboundConnRes] = useState<SearchResponse | null>(null);
  const [inboundError, setInboundError] = useState<string | null>(null);

  // Fallback Connection Suggestions when 0 results
  const [connectionSuggestions, setConnectionSuggestions] = useState<ConnectionSuggestion[]>([]);

  // =========================================================================
  // LOCAL FILTERS & SORT STATE
  // =========================================================================
  const [sortBy, setSortBy] = useState<SortByOption>('departure_asc');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriodFilter>('all');
  const [travelModeFilter, setTravelModeFilter] = useState<TravelModeFilter>('all');
  const [manualConfirmationFilter, setManualConfirmationFilter] =
    useState<ManualConfirmationFilter>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  // =========================================================================
  // SEAT MAP & HOMOLOGATION CHECKOUT MODAL STATE
  // =========================================================================
  const [selectedOptionForSeats, setSelectedOptionForSeats] = useState<SearchOption | null>(null);
  const [seatMapData, setSeatMapData] = useState<SeatMapResponse | null>(null);
  const [seatMapLoading, setSeatMapLoading] = useState(false);
  const [seatMapError, setSeatMapError] = useState<string | null>(null);
  const [activeSegmentTab, setActiveSegmentTab] = useState<number>(1);
  const [activeFloorTab, setActiveFloorTab] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatAssignment[]>([]);
  const [seatSelectionConfirmation, setSeatSelectionConfirmation] = useState<boolean>(false);

  // Homologation Booking & Checkout state (Inside Modal)
  const [selectedScenarioTag, setSelectedScenarioTag] = useState<string>('1.1');
  const [passengersForm, setPassengersForm] = useState<PassengerFormState[]>(DEFAULT_PASSENGERS);
  const [buyerEmail, setBuyerEmail] = useState<string>('homologacao@ncturismo.com.br');
  const [buyerName, setBuyerName] = useState<string>('NC Turismo Homologacao');
  const [buyerCpf, setBuyerCpf] = useState<string>('52998224725');
  const [buyerPhone, setBuyerPhone] = useState<string>('(41) 3281-1167');
  const [paymentMethod, setPaymentMethod] = useState<'preApproved' | 'creditCard' | 'pix'>('creditCard');
  const [cardNumber, setCardNumber] = useState<string>('4111 1111 1111 1111');
  const [cardHolder, setCardHolder] = useState<string>('NC TURISMO TESTE');
  const [cardExpiresAt, setCardExpiresAt] = useState<string>('2030-10');
  const [cardCvv, setCardCvv] = useState<string>('123');
  const [includeCallbackUrl, setIncludeCallbackUrl] = useState<boolean>(false);
  const [customCallbackUrl, setCustomCallbackUrl] = useState<string>(initialPublicCallbackUrl);

  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedPurchase, setCompletedPurchase] = useState<any | null>(null);

  // Homologation Logs Drawer/Modal State
  const [showHomologationPanel, setShowHomologationPanel] = useState<boolean>(false);
  const [homologationLogs, setHomologationLogs] = useState<HomologationLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [purchaseLookupId, setPurchaseLookupId] = useState<string>('');
  const [purchaseLookupEmail, setPurchaseLookupEmail] = useState<string>('homologacao@ncturismo.com.br');
  const [purchaseLookupLoading, setPurchaseLookupLoading] = useState<boolean>(false);
  const [purchaseLookupResult, setPurchaseLookupResult] = useState<any | null>(null);

  // Refs for closing dropdowns on outside click
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // INITIALIZATION & CONFIG LOAD
  // =========================================================================
  useEffect(() => {
    fetchRodoviarioConfig().then((cfg) => {
      setActiveMode(cfg.mode);
      if (
        cfg.defaultCallbackUrl &&
        !cfg.defaultCallbackUrl.includes('localhost') &&
        !cfg.defaultCallbackUrl.includes('127.0.0.1')
      ) {
        setDefaultCallbackUrl(cfg.defaultCallbackUrl);
        setCustomCallbackUrl(cfg.defaultCallbackUrl);
      }
    });
    fetchHomologationLogs().then(setHomologationLogs);
  }, []);

  // Run initial search automatically so user sees live Sandbox results on page open
  useEffect(() => {
    handleRunSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close autocomplete dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Origin Stop Search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchRodoviarioStops(originQuery, activeMode).then(setOriginSuggestions);
    }, 180);
    return () => clearTimeout(timer);
  }, [originQuery, activeMode]);

  // Debounced Destination Stop Search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchRodoviarioStops(destinationQuery, activeMode).then(setDestinationSuggestions);
    }, 180);
    return () => clearTimeout(timer);
  }, [destinationQuery, activeMode]);

  // =========================================================================
  // HANDLERS: SEARCH & AUTOCOMPLETE
  // =========================================================================
  const handleSwapStops = () => {
    const tempStop = originStop;
    const tempQuery = originQuery;
    setOriginStop(destinationStop);
    setOriginQuery(destinationQuery);
    setDestinationStop(tempStop);
    setDestinationQuery(tempQuery);
    setValidationError(null);
  };

  const handleSelectOrigin = (stop: StopItem) => {
    setOriginStop(stop);
    setOriginQuery(stop.name);
    setShowOriginDropdown(false);
    setValidationError(null);
  };

  const handleSelectDestination = (stop: StopItem) => {
    setDestinationStop(stop);
    setDestinationQuery(stop.name);
    setShowDestinationDropdown(false);
    setValidationError(null);
  };

  const handleRunSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);
    setOutboundError(null);
    setInboundError(null);
    setConnectionSuggestions([]);
    setStagedOutboundLeg(null);

    if (!originStop || originStop.name.trim() !== originQuery.trim()) {
      setValidationError('Selecione uma cidade ou rodoviária válida na lista de Origem.');
      return;
    }
    if (!destinationStop || destinationStop.name.trim() !== destinationQuery.trim()) {
      setValidationError('Selecione uma cidade ou rodoviária válida na lista de Destino.');
      return;
    }
    if (originStop.id === destinationStop.id) {
      setValidationError('Origem e destino não podem ser iguais.');
      return;
    }

    const today = getTodayDate();
    if (!departureDate || departureDate < today) {
      setValidationError('A data de ida deve ser hoje ou uma data futura válida.');
      return;
    }

    if (returnDate && returnDate < departureDate) {
      setValidationError('A data de volta deve ser igual ou posterior à data de ida.');
      return;
    }

    setActiveTripStep('outbound');
    setOutboundDirectLoading(true);
    setOutboundDirectRes(null);
    setOutboundConnRes(null);

    if (includeConnections) {
      setOutboundConnLoading(true);
    }

    // Outbound Direct fetch
    executeRodoviarioSearch({
      from: originStop.id,
      to: destinationStop.id,
      travelDate: departureDate,
      travelType: 'direct',
      mode: activeMode,
    })
      .then((res) => {
        setOutboundDirectRes(res);
        if (res.options.length === 0) {
          fetchConnectionSuggestions(originStop.id, destinationStop.id, activeMode).then(
            setConnectionSuggestions
          );
        }
      })
      .catch((err) => {
        setOutboundError(err.message || 'Erro ao buscar viagens diretas.');
      })
      .finally(() => {
        setOutboundDirectLoading(false);
      });

    // Outbound Connection fetch (parallel & independent)
    if (includeConnections) {
      executeRodoviarioSearch({
        from: originStop.id,
        to: destinationStop.id,
        travelDate: departureDate,
        travelType: 'connection',
        mode: activeMode,
      })
        .then((res) => {
          setOutboundConnRes(res);
        })
        .catch(() => {})
        .finally(() => {
          setOutboundConnLoading(false);
        });
    }

    // Inbound Search if returnDate is set
    if (returnDate) {
      setInboundDirectLoading(true);
      setInboundDirectRes(null);
      setInboundConnRes(null);
      if (includeConnections) setInboundConnLoading(true);

      executeRodoviarioSearch({
        from: destinationStop.id,
        to: originStop.id,
        travelDate: returnDate,
        travelType: 'direct',
        mode: activeMode,
      })
        .then((res) => {
          setInboundDirectRes(res);
        })
        .catch((err) => {
          setInboundError(err.message || 'Erro ao buscar viagens de volta.');
        })
        .finally(() => {
          setInboundDirectLoading(false);
        });

      if (includeConnections) {
        executeRodoviarioSearch({
          from: destinationStop.id,
          to: originStop.id,
          travelDate: returnDate,
          travelType: 'connection',
          mode: activeMode,
        })
          .then((res) => {
            setInboundConnRes(res);
          })
          .catch(() => {})
          .finally(() => {
            setInboundConnLoading(false);
          });
      }
    }
  };

  // =========================================================================
  // DERIVED RESULTS & LOCAL FILTERING
  // =========================================================================
  const activeDirectRes = activeTripStep === 'outbound' ? outboundDirectRes : inboundDirectRes;
  const activeConnRes = activeTripStep === 'outbound' ? outboundConnRes : inboundConnRes;
  const isDirectLoading = activeTripStep === 'outbound' ? outboundDirectLoading : inboundDirectLoading;
  const isConnLoading = activeTripStep === 'outbound' ? outboundConnLoading : inboundConnLoading;
  const activeError = activeTripStep === 'outbound' ? outboundError : inboundError;

  const combinedOptions = useMemo(() => {
    const directList = activeDirectRes?.options || [];
    const connList = includeConnections ? activeConnRes?.options || [] : [];
    return [...directList, ...connList];
  }, [activeDirectRes, activeConnRes, includeConnections]);

  const availableCompanies = useMemo(() => {
    const set = new Set<string>();
    combinedOptions.forEach((opt) => set.add(opt.company.name));
    return Array.from(set);
  }, [combinedOptions]);

  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    combinedOptions.forEach((opt) => set.add(opt.seatClass));
    return Array.from(set);
  }, [combinedOptions]);

  const highestOptionPrice = useMemo(() => {
    if (combinedOptions.length === 0) return 1000;
    const max = Math.max(...combinedOptions.map((o) => o.pricing.totalPrice));
    return Math.ceil(max / 10) * 10 + 50;
  }, [combinedOptions]);

  useEffect(() => {
    setMaxPriceFilter(highestOptionPrice);
  }, [highestOptionPrice]);

  const filteredAndSortedOptions = useMemo(() => {
    return combinedOptions
      .filter((opt) => {
        if (travelModeFilter !== 'all' && opt.travelType !== travelModeFilter) return false;
        if (manualConfirmationFilter === 'false' && Boolean(opt.manualConfirmation) !== false)
          return false;
        if (manualConfirmationFilter === 'true' && Boolean(opt.manualConfirmation) !== true)
          return false;
        if (selectedCompanies.length > 0 && !selectedCompanies.includes(opt.company.name)) return false;
        if (selectedClasses.length > 0 && !selectedClasses.includes(opt.seatClass)) return false;
        if (opt.pricing.totalPrice > maxPriceFilter) return false;

        if (timePeriod !== 'all') {
          const hour = parseInt(opt.departure.time.split(':')[0] || '0', 10);
          if (timePeriod === 'madrugada' && !(hour >= 0 && hour < 6)) return false;
          if (timePeriod === 'manha' && !(hour >= 6 && hour < 12)) return false;
          if (timePeriod === 'tarde' && !(hour >= 12 && hour < 18)) return false;
          if (timePeriod === 'noite' && !(hour >= 18 && hour <= 23)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.pricing.totalPrice - b.pricing.totalPrice;
        if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
        if (sortBy === 'seats_desc') return b.availableSeats - a.availableSeats;
        return a.departure.time.localeCompare(b.departure.time);
      });
  }, [
    combinedOptions,
    travelModeFilter,
    manualConfirmationFilter,
    selectedCompanies,
    selectedClasses,
    maxPriceFilter,
    timePeriod,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCompanies([]);
    setSelectedClasses([]);
    setTimePeriod('all');
    setTravelModeFilter('all');
    setManualConfirmationFilter('all');
    setMaxPriceFilter(highestOptionPrice);
  };

  // =========================================================================
  // HANDLERS: SEAT MAP & HOMOLOGATION SCENARIO PRESETS
  // =========================================================================
  const applyScenarioDefaults = (option: SearchOption, isRoundTrip: boolean, paxCount: number) => {
    const isConn = option.travelType === 'connection';
    const isManual = Boolean(option.manualConfirmation);

    let detectedTag = '1.1';
    if (isManual) {
      detectedTag = '3.1';
    } else if (isConn) {
      if (isRoundTrip) detectedTag = '2.2';
      else if (paxCount >= 2) detectedTag = '2.3';
      else detectedTag = '2.1';
    } else {
      if (isRoundTrip && paxCount >= 2) detectedTag = '1.4';
      else if (!isRoundTrip && paxCount >= 2) detectedTag = '1.3';
      else if (isRoundTrip && paxCount === 1) detectedTag = '1.2';
      else detectedTag = '1.1';
    }

    setSelectedScenarioTag(detectedTag);
    setIncludeCallbackUrl(isManual);

    // Nos cenários 1.3 e 1.4, pré-marca automaticamente 1 passageiro COM seguro e 1 SEM seguro!
    setPassengersForm((prev) =>
      prev.map((p, idx) => ({
        ...p,
        includeInsurance: (detectedTag === '1.3' || detectedTag === '1.4') && idx === 0,
      }))
    );
  };

  const handleOpenSeatMap = async (option: SearchOption) => {
    setSelectedOptionForSeats(option);
    setSeatMapData(null);
    setSeatMapError(null);
    setSelectedSeats([]);
    setActiveSegmentTab(1);
    setActiveFloorTab(0);
    setSeatSelectionConfirmation(false);
    setBookingError(null);
    setCreatedBooking(null);
    setCheckoutError(null);
    setCompletedPurchase(null);
    setSeatMapLoading(true);

    applyScenarioDefaults(option, Boolean(returnDate), passengersCount);

    try {
      const response = await fetchRodoviarioSeats(option, activeMode);
      setSeatMapData(response);
      if (response.segments.length > 0) {
        setActiveSegmentTab(response.segments[0].segmentIndex);
        if (response.segments[0].floors.length > 0) {
          setActiveFloorTab(response.segments[0].floors[0].floorIndex);
        }
      }
    } catch (err: any) {
      setSeatMapError(err.message || 'Não foi possível carregar o mapa de poltronas desta viagem.');
    } finally {
      setSeatMapLoading(false);
    }
  };

  const handleCloseSeatMap = () => {
    setSelectedOptionForSeats(null);
    setSeatMapData(null);
    setSelectedSeats([]);
    setSeatSelectionConfirmation(false);
    setCreatedBooking(null);
    setCompletedPurchase(null);
  };

  const handleStageOutboundAndGoToInbound = () => {
    if (!selectedOptionForSeats) return;
    setStagedOutboundLeg({
      option: selectedOptionForSeats,
      seats: [...selectedSeats],
    });
    handleCloseSeatMap();
    setActiveTripStep('inbound');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleToggleSeat = (cell: SeatMatrixCell, segmentIndex: number, floorIndex: number) => {
    if (cell.type !== 'seat' || cell.occupied || !cell.seatNumber) return;

    const existingIdx = selectedSeats.findIndex(
      (s) => s.segmentIndex === segmentIndex && s.seatNumber === cell.seatNumber
    );

    if (existingIdx >= 0) {
      const updated = selectedSeats.filter((_, idx) => idx !== existingIdx);
      const reindexed = updated.map((item) => {
        const sameSeg = updated.filter((u) => u.segmentIndex === item.segmentIndex);
        return {
          ...item,
          passengerNumber: sameSeg.indexOf(item) + 1,
        };
      });
      setSelectedSeats(reindexed);
      setSeatSelectionConfirmation(false);
      setCreatedBooking(null);
      return;
    }

    const currentSegSeats = selectedSeats.filter((s) => s.segmentIndex === segmentIndex);
    if (currentSegSeats.length >= passengersCount) {
      const withoutOldest = selectedSeats.filter(
        (s) => !(s.segmentIndex === segmentIndex && s.passengerNumber === passengersCount)
      );
      const nextSeat: SelectedSeatAssignment = {
        segmentIndex,
        floorIndex,
        seatNumber: cell.seatNumber,
        seatPrice: cell.pricing?.seatPrice ?? selectedOptionForSeats?.pricing.seatPrice ?? 0,
        taxPrice: cell.pricing?.taxPrice ?? selectedOptionForSeats?.pricing.taxPrice ?? 0,
        totalPrice: cell.pricing?.totalPrice ?? selectedOptionForSeats?.pricing.totalPrice ?? 0,
        passengerNumber: passengersCount,
      };
      setSelectedSeats([...withoutOldest, nextSeat]);
      setCreatedBooking(null);
      return;
    }

    const nextSeat: SelectedSeatAssignment = {
      segmentIndex,
      floorIndex,
      seatNumber: cell.seatNumber,
      seatPrice: cell.pricing?.seatPrice ?? selectedOptionForSeats?.pricing.seatPrice ?? 0,
      taxPrice: cell.pricing?.taxPrice ?? selectedOptionForSeats?.pricing.taxPrice ?? 0,
      totalPrice: cell.pricing?.totalPrice ?? selectedOptionForSeats?.pricing.totalPrice ?? 0,
      passengerNumber: currentSegSeats.length + 1,
    };

    const updatedList = [...selectedSeats, nextSeat];
    setSelectedSeats(updatedList);
    setSeatSelectionConfirmation(false);
    setCreatedBooking(null);

    // Em viagens com conexão (2 trechos), assim que o usuário seleciona todas as poltronas do 1º trecho,
    // avança automaticamente para a aba do 2º trecho para escolher o connectionSeatNumber!
    if (
      seatMapData &&
      seatMapData.segments.length > 1 &&
      segmentIndex === 1 &&
      currentSegSeats.length + 1 >= passengersCount
    ) {
      const seg2Count = updatedList.filter((s) => s.segmentIndex === 2).length;
      if (seg2Count < passengersCount) {
        const seg2Obj = seatMapData.segments.find((s) => s.segmentIndex === 2);
        setActiveSegmentTab(2);
        if (seg2Obj && seg2Obj.floors.length > 0) {
          setActiveFloorTab(seg2Obj.floors[0].floorIndex);
        }
      }
    }
  };

  // =========================================================================
  // HANDLERS: HOMOLOGATION BOOKING & CHECKOUT (USER-TRIGGERED ONLY)
  // =========================================================================
  const buildLegPassengersPayload = (
    option: SearchOption,
    seatsForLeg: SelectedSeatAssignment[]
  ): BookingPassengerInput[] => {
    const isConn = option.travelType === 'connection';
    const seg1Seats = seatsForLeg
      .filter((s) => s.segmentIndex === 1)
      .sort((a, b) => a.passengerNumber - b.passengerNumber);
    const seg2Seats = seatsForLeg
      .filter((s) => s.segmentIndex === 2)
      .sort((a, b) => a.passengerNumber - b.passengerNumber);

    return Array.from({ length: passengersCount }).map((_, idx) => {
      const pForm = passengersForm[idx] || DEFAULT_PASSENGERS[idx] || DEFAULT_PASSENGERS[0];
      const primarySeat = seg1Seats[idx]?.seatNumber || seatsForLeg[idx]?.seatNumber || '01';
      const connSeat = isConn ? seg2Seats[idx]?.seatNumber || primarySeat : undefined;

      return {
        name: pForm.name,
        travelDocument: pForm.travelDocument,
        travelDocumentType: pForm.travelDocumentType || 'RG',
        cpf: pForm.cpf,
        birthDate: pForm.birthDate,
        seatNumber: primarySeat,
        ...(isConn && connSeat ? { connectionSeatNumber: connSeat } : {}),
        includeInsurance: pForm.includeInsurance,
        ...(pForm.includeInsurance
          ? {
              insurance: {
                cpf: pForm.cpf,
                birthDate: pForm.birthDate,
                cep: pForm.cep || '80010-000',
              },
            }
          : {}),
      };
    });
  };

  const handleExecuteBooking = async () => {
    if (!selectedOptionForSeats) return;
    setBookingLoading(true);
    setBookingError(null);
    setCreatedBooking(null);
    setCompletedPurchase(null);

    try {
      const travelsPayload = [];

      // Se estamos na etapa de Volta e existe uma Ida salva, enviamos [Ida, Volta] no mesmo booking!
      if (activeTripStep === 'inbound' && stagedOutboundLeg) {
        travelsPayload.push({
          optionId: stagedOutboundLeg.option.optionId,
          travelId: stagedOutboundLeg.option.externalTravelId,
          passengers: buildLegPassengersPayload(stagedOutboundLeg.option, stagedOutboundLeg.seats),
        });
      }

      travelsPayload.push({
        optionId: selectedOptionForSeats.optionId,
        travelId: selectedOptionForSeats.externalTravelId,
        passengers: buildLegPassengersPayload(selectedOptionForSeats, selectedSeats),
      });

      const res = await createRodoviarioBooking({
        scenarioTag: selectedScenarioTag,
        travels: travelsPayload,
      });

      setCreatedBooking(res.booking);
      fetchHomologationLogs().then(setHomologationLogs);
    } catch (err: any) {
      setBookingError(err.message || 'Falha ao criar pré-reserva no Sandbox.');
      fetchHomologationLogs().then(setHomologationLogs);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleExecuteCheckout = async () => {
    if (!createdBooking?.id) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    setCompletedPurchase(null);

    try {
      const res = await executeRodoviarioCheckout({
        scenarioTag: selectedScenarioTag,
        bookingId: createdBooking.id,
        email: buyerEmail,
        buyer:
          paymentMethod === 'preApproved'
            ? true
            : {
                name: buyerName,
                cpf: buyerCpf,
                phone: buyerPhone,
              },
        payment: {
          method: paymentMethod,
          ...(paymentMethod === 'creditCard'
            ? {
                cardNumber,
                holder: cardHolder,
                expiresAt: cardExpiresAt,
                securityCode: cardCvv,
                installment: 1,
              }
            : {}),
        },
        includeCallbackUrl,
        callbackURL: customCallbackUrl || defaultCallbackUrl,
        externalId: `NCT-${selectedScenarioTag.replace('.', '_')}-${Date.now()}`,
      });

      setCompletedPurchase(res.purchase);
      fetchHomologationLogs().then(setHomologationLogs);
    } catch (err: any) {
      setCheckoutError(err.message || 'Falha ao processar checkout no Sandbox.');
      fetchHomologationLogs().then(setHomologationLogs);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLookupPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseLookupId.trim() || !purchaseLookupEmail.trim()) return;
    setPurchaseLookupLoading(true);
    setPurchaseLookupResult(null);
    try {
      const res = await fetchRodoviarioPurchaseGet({
        id: Number(purchaseLookupId.trim()),
        email: purchaseLookupEmail.trim(),
        scenarioTag: '3.1',
      });
      setPurchaseLookupResult(res.purchase);
      fetchHomologationLogs().then(setHomologationLogs);
    } catch (err: any) {
      setPurchaseLookupResult({ error: err.message });
      fetchHomologationLogs().then(setHomologationLogs);
    } finally {
      setPurchaseLookupLoading(false);
    }
  };

  const handleDownloadJsonLogs = async () => {
    try {
      const res = await fetch('/api/rodoviario/consolidated-dossier');
      const data = await res.json();
      const payload = data?.dossier || {
        affiliateCode: 'NCT',
        generatedAt: new Date().toISOString(),
        logs: homologationLogs,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossie-homologacao-queropassagem-nct-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const blob = new Blob([JSON.stringify(homologationLogs, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossie-homologacao-queropassagem-nct-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadMarkdownLogs = async () => {
    try {
      const res = await fetch('/api/rodoviario/consolidated-dossier');
      const data = await res.json();
      let mdText = String(data?.markdown || '');
      if (!mdText) {
        const lines: string[] = [
          '# Dossiê Consolidado de Homologação API Rodoviária — NC Turismo (Afiliado: NCT)',
          `Gerado em: ${new Date().toISOString()}`,
          '',
        ];
        homologationLogs.forEach((log, idx) => {
          lines.push(
            `## ${idx + 1}. [${log.operation}] ${log.scenarioTag ? `Cenário ${log.scenarioTag} — ` : ''}${log.timestamp}`
          );
          lines.push(`- **Endpoint**: \`${log.method} ${log.endpoint}\``);
          lines.push(`- **Status HTTP**: \`${log.httpStatus}\` (${log.latencyMs}ms)`);
          if (log.notes) lines.push(`- **Observação**: ${log.notes}`);
          lines.push('\n### Request\n```json\n' + JSON.stringify(log.requestPayload, null, 2) + '\n```');
          lines.push('\n### Response\n```json\n' + JSON.stringify(log.responsePayload, null, 2) + '\n```\n---\n');
        });
        mdText = lines.join('\n');
      }
      const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossie-homologacao-queropassagem-nct-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const handleCopyLog = (log: HomologationLogEntry) => {
    const formatted = JSON.stringify(
      {
        scenario: log.scenarioTag,
        operation: log.operation,
        endpoint: `${log.method} ${log.endpoint}`,
        httpStatus: log.httpStatus,
        timestamp: log.timestamp,
        request: log.requestPayload,
        response: log.responsePayload,
      },
      null,
      2
    );
    navigator.clipboard.writeText(formatted);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  const activeSegmentObj = useMemo(() => {
    if (!seatMapData) return null;
    return (
      seatMapData.segments.find((s) => s.segmentIndex === activeSegmentTab) ||
      seatMapData.segments[0] ||
      null
    );
  }, [seatMapData, activeSegmentTab]);

  const activeFloorObj = useMemo(() => {
    if (!activeSegmentObj) return null;
    return (
      activeSegmentObj.floors.find((f) => f.floorIndex === activeFloorTab) ||
      activeSegmentObj.floors[0] ||
      null
    );
  }, [activeSegmentObj, activeFloorTab]);

  const totalSelectedSeatsValue = useMemo(() => {
    const currentLegTotal = selectedSeats.reduce((acc, s) => acc + s.totalPrice, 0);
    const outboundStagedTotal =
      activeTripStep === 'inbound' && stagedOutboundLeg
        ? stagedOutboundLeg.seats.reduce((acc, s) => acc + s.totalPrice, 0)
        : 0;
    return currentLegTotal + outboundStagedTotal;
  }, [selectedSeats, activeTripStep, stagedOutboundLeg]);

  const requiredSegmentsCount = seatMapData?.segments.length || 1;
  const totalRequiredSelections = requiredSegmentsCount * passengersCount;
  const isAllSeatsSelected =
    (activeSegmentObj?.seatsLayout === 'quantity' && totalRequiredSelections > 0) ||
    (selectedSeats.length === totalRequiredSelections && totalRequiredSelections > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#C8102E] selection:text-white pt-28 pb-20">
      {/* =====================================================================
          TOP HEADER / BREADCRUMB + BOTÃO PAINEL DE HOMOLOGAÇÃO
         ===================================================================== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-200/90">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-slate-600 hover:text-[#C8102E] text-xs md:text-sm uppercase tracking-wider font-semibold transition-colors py-2 px-4 rounded-full bg-white hover:bg-red-50/50 border border-slate-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#C8102E]" />
            Voltar para o site principal
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-600 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Sandbox Quero Passagem Ativo (Afiliado: NCT)</span>
            </span>

            <button
              type="button"
              onClick={() => {
                fetchHomologationLogs().then(setHomologationLogs);
                setShowHomologationPanel(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#C8102E] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <FileCode2 size={14} />
              <span>Painel de Homologação &amp; Logs (.MD / .JSON)</span>
              {homologationLogs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#DB8902] text-white text-[10px]">
                  {homologationLogs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          HERO & SEARCH ENGINE CONSOLE (UNIFIED BANNER + SEARCH BAR)
         ===================================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-10">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/60 overflow-visible">
          {/* Soft warm daylight radial highlights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* =================================================================
              UNIFIED HERO BANNER (TEXT ON LEFT + CITIES & TRADITIONAL BUS MONTAGE ON RIGHT)
             ================================================================= */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/90 to-red-50/30 shadow-sm mb-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT COLUMN: Unified Editorial Information */}
              <div className="lg:col-span-6 xl:col-span-6 p-6 sm:p-8 lg:p-9 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#C8102E] mb-3">
                  <Sparkles size={15} className="text-[#C8102E] shrink-0" />
                  <span>Portal Rodoviário NC Turismo • Consulta e Seleção de Assentos</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-tight text-slate-900 leading-[1.15] mb-3.5">
                  Pesquisa Rodoviária Nacional com{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8102E] to-[#DB8902]">
                    Mapa de Poltronas em Tempo Real
                  </span>
                </h1>

                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-5">
                  Consulte horários, classes de conforto, conexões garantidas e disponibilidade de assentos em mais de 300 viações brasileiras. Pesquisa aberta para todos os viajantes e condições especiais para empresas cadastradas na NC Turismo.
                </p>

                {/* Clean Destinos & Conforto Pills */}
                <div className="flex items-center flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                    <MapPin size={13} className="text-[#C8102E]" />
                    Curitiba • São Paulo • Rio de Janeiro
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                    <Bus size={13} className="text-[#DB8902]" />
                    Leito Cama, Semileito &amp; Executivo
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Visual Montage (Curitiba + São Paulo + Rio de Janeiro Backdrop + Traditional Coach Bus) */}
              <div className="lg:col-span-6 xl:col-span-6 relative min-h-[260px] sm:min-h-[300px] lg:min-h-full overflow-hidden bg-slate-100">
                {/* 3-City Montage Grid in Background (Curitiba | São Paulo | Rio de Janeiro) */}
                <div className="absolute inset-0 grid grid-cols-3 gap-0.5 bg-white/80">
                  {/* City 1: Curitiba */}
                  <div className="relative h-full overflow-hidden group/city">
                    <img
                      src="/assets/rodoviario/curitiba.jpg"
                      alt="Curitiba, PR - Jardim Botânico"
                      className="w-full h-full object-cover object-center brightness-105 group-hover/city:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 shadow-2xs border border-white">
                        Curitiba · PR
                      </span>
                    </div>
                  </div>

                  {/* City 2: São Paulo */}
                  <div className="relative h-full overflow-hidden group/city">
                    <img
                      src="/assets/rodoviario/sao-paulo.jpg"
                      alt="São Paulo, SP - Avenida Paulista"
                      className="w-full h-full object-cover object-center brightness-105 group-hover/city:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 shadow-2xs border border-white">
                        São Paulo · SP
                      </span>
                    </div>
                  </div>

                  {/* City 3: Rio de Janeiro */}
                  <div className="relative h-full overflow-hidden group/city">
                    <img
                      src="/assets/rodoviario/rio-de-janeiro.jpg"
                      alt="Rio de Janeiro, RJ - Pão de Açúcar"
                      className="w-full h-full object-cover object-center brightness-105 group-hover/city:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 shadow-2xs border border-white">
                        Rio · RJ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Soft left blend into the white editorial column */}
                <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent z-10 pointer-events-none" />

                {/* Foreground Traditional Coach Bus Highlight Card */}
                <div className="absolute bottom-3.5 right-3.5 left-3.5 sm:left-auto sm:w-[330px] md:w-[360px] z-20 rounded-xl overflow-hidden bg-white/95 backdrop-blur-md border-2 border-white shadow-xl">
                  <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                    <img
                      src="/assets/rodoviario/onibus-tradicional.jpg"
                      alt="Ônibus Rodoviário Tradicional Brasileiro"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-900 shadow-xs">
                        <Bus size={12} className="text-[#C8102E]" />
                        Ônibus Rodoviário Tradicional
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#C8102E] text-white text-[10px] font-mono font-bold uppercase shadow-xs">
                        +300 Viações
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SEARCH ENGINE BAR (LIGHT SURFACE)
             ================================================================= */}
          <form
            onSubmit={handleRunSearch}
            className="relative z-20 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-end">
              {/* ORIGEM AUTOCOMPLETE */}
              <div className="lg:col-span-3 relative" ref={originRef}>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                  Origem (Cidade ou ID ex: ROD_55)
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C8102E] pointer-events-none"
                  />
                  <input
                    type="text"
                    value={originQuery}
                    onFocus={() => setShowOriginDropdown(true)}
                    onChange={(e) => {
                      setOriginQuery(e.target.value);
                      setShowOriginDropdown(true);
                    }}
                    placeholder="Ex: Rio de Janeiro ou ROD_55"
                    className="w-full pl-10 pr-20 py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 focus:outline-none text-sm font-medium text-slate-900 placeholder-slate-400 transition-all shadow-2xs"
                  />
                  {originStop && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {originStop.id}
                    </span>
                  )}
                </div>

                {/* Origin Dropdown */}
                {showOriginDropdown && originSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl shadow-slate-300/70 z-50 divide-y divide-slate-100">
                    {originSuggestions.map((stop) => (
                      <div key={stop.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectOrigin(stop)}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-red-50/40 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin
                              size={14}
                              className={stop.id.startsWith('CIT_') ? 'text-[#C8102E] shrink-0' : 'text-[#DB8902] shrink-0'}
                            />
                            <span className="text-xs sm:text-sm text-slate-900 font-semibold truncate">
                              {stop.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 shrink-0">
                            {stop.id}
                          </span>
                        </button>

                        {stop.substops && stop.substops.length > 0 && (
                          <div className="bg-slate-50/90 pl-6 divide-y divide-slate-100 border-t border-slate-100">
                            {stop.substops.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() =>
                                  handleSelectOrigin({
                                    id: sub.id,
                                    name: sub.name,
                                    url: sub.url,
                                    stateCode: sub.stateCode,
                                    isStation: true,
                                  })
                                }
                                className="w-full px-3 py-2 text-left hover:bg-amber-50/60 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                              >
                                <span className="text-xs text-slate-700 font-medium truncate">↳ {sub.name}</span>
                                <span className="text-[10px] font-mono font-semibold text-[#DB8902]">{sub.id}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SWAP BUTTON */}
              <div className="lg:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapStops}
                  title="Inverter Origem e Destino"
                  className="w-full lg:w-11 h-11 rounded-xl bg-white hover:bg-red-50/60 border border-slate-200 hover:border-[#C8102E]/40 flex items-center justify-center text-slate-600 hover:text-[#C8102E] shadow-2xs transition-all cursor-pointer"
                >
                  <ArrowLeftRight size={17} />
                </button>
              </div>

              {/* DESTINO AUTOCOMPLETE */}
              <div className="lg:col-span-3 relative" ref={destinationRef}>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                  Destino (Cidade ou ID ex: CIT_1)
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DB8902] pointer-events-none"
                  />
                  <input
                    type="text"
                    value={destinationQuery}
                    onFocus={() => setShowDestinationDropdown(true)}
                    onChange={(e) => {
                      setDestinationQuery(e.target.value);
                      setShowDestinationDropdown(true);
                    }}
                    placeholder="Ex: São Paulo ou CIT_1"
                    className="w-full pl-10 pr-20 py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 focus:outline-none text-sm font-medium text-slate-900 placeholder-slate-400 transition-all shadow-2xs"
                  />
                  {destinationStop && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {destinationStop.id}
                    </span>
                  )}
                </div>

                {/* Destination Dropdown */}
                {showDestinationDropdown && destinationSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl shadow-slate-300/70 z-50 divide-y divide-slate-100">
                    {destinationSuggestions.map((stop) => (
                      <div key={stop.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectDestination(stop)}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-red-50/40 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin
                              size={14}
                              className={stop.id.startsWith('CIT_') ? 'text-[#C8102E] shrink-0' : 'text-[#DB8902] shrink-0'}
                            />
                            <span className="text-xs sm:text-sm text-slate-900 font-semibold truncate">
                              {stop.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 shrink-0">
                            {stop.id}
                          </span>
                        </button>

                        {stop.substops && stop.substops.length > 0 && (
                          <div className="bg-slate-50/90 pl-6 divide-y divide-slate-100 border-t border-slate-100">
                            {stop.substops.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() =>
                                  handleSelectDestination({
                                    id: sub.id,
                                    name: sub.name,
                                    url: sub.url,
                                    stateCode: sub.stateCode,
                                    isStation: true,
                                  })
                                }
                                className="w-full px-3 py-2 text-left hover:bg-amber-50/60 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                              >
                                <span className="text-xs text-slate-700 font-medium truncate">↳ {sub.name}</span>
                                <span className="text-[10px] font-mono font-semibold text-[#DB8902]">{sub.id}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DATA DE IDA */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                  Data de Ida
                </label>
                <div className="relative">
                  <Calendar
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 focus:outline-none text-sm font-mono tabular-nums font-medium text-slate-900 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* DATA DE VOLTA (OPCIONAL) */}
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                  Volta (Opcional)
                </label>
                <input
                  type="date"
                  min={departureDate || getTodayDate()}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-2.5 py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 focus:outline-none text-xs font-mono tabular-nums font-medium text-slate-900 transition-all shadow-2xs"
                />
              </div>

              {/* BOTÃO BUSCAR */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  disabled={outboundDirectLoading}
                  className="w-full h-[46px] rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:opacity-95 text-white font-bold text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {outboundDirectLoading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Buscar Ônibus</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Secondary Search Controls Row */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-5">
                {/* Passageiros */}
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-[#C8102E]" />
                  <span className="text-slate-600 font-medium">Passageiros:</span>
                  <div className="inline-flex items-center rounded-lg bg-white border border-slate-200 p-0.5 shadow-2xs">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPassengersCount(num)}
                        className={`px-2.5 py-1 rounded-md font-mono tabular-nums text-xs font-bold transition-colors cursor-pointer ${
                          passengersCount === num
                            ? 'bg-[#C8102E] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Conexões */}
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeConnections}
                    onChange={(e) => setIncludeConnections(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-[#C8102E]" />
                  <span className="text-slate-700 font-medium">
                    Incluir viagens com conexão (Cenário 2)
                  </span>
                </label>

                {returnDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReturnDate('');
                      setStagedOutboundLeg(null);
                      setActiveTripStep('outbound');
                    }}
                    className="text-xs text-[#C8102E] hover:underline font-medium cursor-pointer"
                  >
                    Limpar data de volta ({formatDateShort(returnDate)})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReturnDate(getDefaultFutureDate(5))}
                    className="text-xs text-slate-700 hover:text-[#C8102E] underline decoration-slate-300 font-medium cursor-pointer"
                  >
                    + Adicionar Data de Volta (Cenários 1.2, 1.4 e 2.2)
                  </button>
                )}
              </div>

              {/* Quick Homologation & Popular Routes */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 font-mono uppercase text-[11px] font-semibold">
                  Atalhos Homologação:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOriginStop(FALLBACK_STOPS[0]); // ROD_55
                    setOriginQuery(FALLBACK_STOPS[0].name);
                    setDestinationStop(FALLBACK_STOPS[1]); // CIT_1
                    setDestinationQuery(FALLBACK_STOPS[1].name);
                  }}
                  className="text-xs text-[#C8102E] hover:underline font-bold cursor-pointer"
                >
                  ROD_55 → CIT_1 (Rio → SP)
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setOriginStop(FALLBACK_STOPS[3]); // CIT_53 Curitiba
                    setOriginQuery(FALLBACK_STOPS[3].name);
                    setDestinationStop(FALLBACK_STOPS[1]); // CIT_1 São Paulo
                    setDestinationQuery(FALLBACK_STOPS[1].name);
                  }}
                  className="text-xs text-slate-700 hover:text-[#C8102E] font-medium underline decoration-slate-300 cursor-pointer"
                >
                  Curitiba → São Paulo
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setOriginStop(FALLBACK_STOPS[1]); // CIT_1 São Paulo
                    setOriginQuery(FALLBACK_STOPS[1].name);
                    setDestinationStop(FALLBACK_STOPS[0]); // ROD_55 Rio
                    setDestinationQuery(FALLBACK_STOPS[0].name);
                  }}
                  className="text-xs text-slate-700 hover:text-[#C8102E] font-medium underline decoration-slate-300 cursor-pointer"
                >
                  São Paulo → Rio de Janeiro
                </button>
              </div>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs sm:text-sm text-red-800">
                <AlertCircle size={18} className="text-[#C8102E] shrink-0" />
                <span className="font-medium">{validationError}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* =====================================================================
          MAIN WORKSPACE: FILTERS SIDEBAR + RESULTS FEED
         ===================================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Round-Trip Step Tabs & Staged Outbound Banner (when returnDate is active) */}
        {returnDate && (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTripStep('outbound')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTripStep === 'outbound'
                      ? 'bg-[#C8102E] text-white shadow-sm shadow-red-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  1. Viagem de Ida · {formatDateShort(departureDate)} (
                  {(outboundDirectRes?.options.length || 0) + (outboundConnRes?.options.length || 0)})
                </button>
                <ArrowRight size={16} className="text-slate-400" />
                <button
                  type="button"
                  onClick={() => setActiveTripStep('inbound')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTripStep === 'inbound'
                      ? 'bg-[#C8102E] text-white shadow-sm shadow-red-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  2. Viagem de Volta · {formatDateShort(returnDate)} (
                  {(inboundDirectRes?.options.length || 0) + (inboundConnRes?.options.length || 0)})
                </button>
              </div>

              <span className="text-xs text-slate-500">
                Para compra de Ida e Volta (Cenários 1.2, 1.4 e 2.2), escolha primeiro as poltronas da Ida e depois da Volta.
              </span>
            </div>

            {stagedOutboundLeg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    <strong>Ida Selecionada:</strong> {stagedOutboundLeg.option.company.name} (
                    {stagedOutboundLeg.option.departure.time.slice(0, 5)}) · Poltrona(s):{' '}
                    <strong className="font-mono">
                      {stagedOutboundLeg.seats.map((s) => s.seatNumber).join(', ')}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStagedOutboundLeg(null);
                    setActiveTripStep('outbound');
                  }}
                  className="text-xs text-red-700 hover:underline font-semibold cursor-pointer"
                >
                  Alterar Ida
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =================================================================
              LEFT SIDEBAR: LOCAL FILTERS (INCLUDING HOMOLOGATION FILTER)
             ================================================================= */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#C8102E]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Filtros da Busca
                </h2>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#C8102E] hover:underline font-medium cursor-pointer"
              >
                Limpar
              </button>
            </div>

            {/* Filter Homologação: manualConfirmation false vs true */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold mb-2">
                Filtro Homologação (manualConfirmation)
              </h3>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Todos os ônibus' },
                  {
                    id: 'false',
                    label: 'manualConfirmation: false (Cenários 1 e 2)',
                  },
                  {
                    id: 'true',
                    label: 'manualConfirmation: true (Cenário 3.1 Callback)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setManualConfirmationFilter(opt.id as ManualConfirmationFilter)
                    }
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                      manualConfirmationFilter === opt.id
                        ? 'bg-[#C8102E] text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 1: Tipo de Viagem (Direto vs Conexão) */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
                Modalidade do Trecho
              </h3>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'direct', label: 'Diretas (Cen. 1/3)' },
                  { id: 'connection', label: 'Conexões (Cen. 2)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTravelModeFilter(tab.id as TravelModeFilter)}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      travelModeFilter === tab.id
                        ? 'bg-white text-[#C8102E] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Período de Saída */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
                Horário de Embarque
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Qualquer horário', sub: '00h - 24h' },
                  { id: 'manha', label: 'Manhã', sub: '06h - 11h59' },
                  { id: 'tarde', label: 'Tarde', sub: '12h - 17h59' },
                  { id: 'noite', label: 'Noite', sub: '18h - 23h59' },
                  { id: 'madrugada', label: 'Madrugada', sub: '00h - 05h59' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTimePeriod(p.id as TimePeriodFilter)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      timePeriod === p.id
                        ? 'border-[#C8102E] bg-red-50/50 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] font-mono tabular-nums text-slate-400">{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Classe de Poltrona */}
            {availableClasses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
                  Classe da Poltrona
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {availableClasses.map((cls) => {
                    const checked = selectedClasses.includes(cls);
                    return (
                      <label
                        key={cls}
                        className="flex items-center justify-between gap-2 text-xs text-slate-700 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedClasses((prev) =>
                                checked ? prev.filter((c) => c !== cls) : [...prev, cls]
                              );
                            }}
                            className="rounded border-slate-300 text-[#C8102E] focus:ring-[#C8102E]"
                          />
                          <span className="font-medium">{cls}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-400">
                          {combinedOptions.filter((o) => o.seatClass === cls).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter 4: Viação / Operadora */}
            {availableCompanies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
                  Viação Operadora
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availableCompanies.map((comp) => {
                    const checked = selectedCompanies.includes(comp);
                    return (
                      <label
                        key={comp}
                        className="flex items-center justify-between gap-2 text-xs text-slate-700 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedCompanies((prev) =>
                                checked ? prev.filter((c) => c !== comp) : [...prev, comp]
                              );
                            }}
                            className="rounded border-slate-300 text-[#C8102E] focus:ring-[#C8102E]"
                          />
                          <span className="font-medium truncate max-w-[160px]">{comp}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-400">
                          {combinedOptions.filter((o) => o.company.name === comp).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter 5: Teto de Preço */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Preço Máximo
                </h3>
                <span className="text-xs font-mono tabular-nums font-bold text-[#C8102E]">
                  {formatBRL(maxPriceFilter)}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={highestOptionPrice}
                step={10}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#C8102E] cursor-pointer"
              />
            </div>

            {/* Corporate Support Box */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-red-50/50 border border-amber-200/80 space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                  Viagens Corporativas &amp; Grupos
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Empresas cadastradas contam com faturamento centralizado, política de viagens e cupons mensais conforme elegibilidade.
                </p>
                {onOpenBeneficios && (
                  <button
                    type="button"
                    onClick={onOpenBeneficios}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-red-50/60 border border-amber-300/80 text-xs font-bold text-[#C8102E] flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Conhecer benefícios corporativos</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* =================================================================
              RIGHT WORKSPACE: PROGRESSIVE RESULTS & SORT BAR
             ================================================================= */}
          <div className="lg:col-span-9 space-y-4">
            {/* Top Status & Sort Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900">
                    {activeTripStep === 'outbound'
                      ? `${originStop?.name.split(',')[0] || 'Origem'} → ${destinationStop?.name.split(',')[0] || 'Destino'}`
                      : `${destinationStop?.name.split(',')[0] || 'Destino'} → ${originStop?.name.split(',')[0] || 'Origem'}`}
                  </h2>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono tabular-nums text-slate-600">
                    {formatDateShort(activeTripStep === 'outbound' ? departureDate : returnDate)}
                  </span>
                </div>

                {/* Progressive loading status for direct vs connection */}
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                    {filteredAndSortedOptions.length} horários exibidos
                  </span>
                  <span>·</span>
                  <span>
                    Diretas: <strong className="font-mono tabular-nums">{activeDirectRes?.options.length ?? 0}</strong>
                  </span>
                  {includeConnections && (
                    <>
                      <span>·</span>
                      <span>
                        Conexões:{' '}
                        {isConnLoading ? (
                          <span className="text-[#DB8902] font-mono">buscando em paralelo...</span>
                        ) : (
                          <strong className="font-mono tabular-nums">{activeConnRes?.options.length ?? 0}</strong>
                        )}
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span className="text-emerald-700 font-mono">
                    manualConfirmation=false:{' '}
                    <strong>
                      {combinedOptions.filter((o) => !o.manualConfirmation).length}
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="text-amber-700 font-mono">
                    manualConfirmation=true:{' '}
                    <strong>
                      {combinedOptions.filter((o) => Boolean(o.manualConfirmation)).length}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortByOption)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] cursor-pointer"
                >
                  <option value="departure_asc">Horário de saída (mais cedo)</option>
                  <option value="price_asc">Menor preço total</option>
                  <option value="duration_asc">Menor tempo de viagem</option>
                  <option value="seats_desc">Maior disponibilidade de poltronas</option>
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {activeError && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold">{activeError}</h3>
                    <p className="text-xs text-amber-800 mt-1">
                      Verifique os parâmetros selecionados ou tente novamente em instantes.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunSearch()}
                  className="px-4 py-2.5 rounded-xl bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider shrink-0 hover:bg-[#a50d26] transition-colors cursor-pointer"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isDirectLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="h-4 w-48 bg-slate-200 rounded" />
                      <div className="h-6 w-72 bg-slate-200 rounded" />
                      <div className="h-3 w-56 bg-slate-100 rounded" />
                    </div>
                    <div className="w-40 space-y-2">
                      <div className="h-7 w-28 bg-slate-200 rounded ml-auto" />
                      <div className="h-10 w-full bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State + Connection Availability Fallback */}
            {!isDirectLoading && !activeError && filteredAndSortedOptions.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center mx-auto">
                  <Bus size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nenhuma viagem encontrada com os filtros atuais
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Tente limpar os filtros laterais, habilitar conexões ou selecionar o atalho oficial ROD_55 → CIT_1.
                  </p>
                </div>

                {connectionSuggestions.length > 0 && (
                  <div className="max-w-lg mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                    <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-2">
                      Sugestões de Conexão Viáveis
                    </div>
                    <div className="space-y-2">
                      {connectionSuggestions.map((sug) => (
                        <div
                          key={sug.stopId}
                          className="flex items-center justify-between text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
                        >
                          <span>
                            Conexão via <strong>{sug.stopName}</strong>
                          </span>
                          <span className="font-mono tabular-nums text-slate-500">
                            Espera ~{sug.estimatedWaitMinutes} min · {sug.firstLegCount} saídas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#a50d26] transition-colors cursor-pointer"
                  >
                    Restaurar Todos os Horários
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                TRIP OPTION CARDS (LIGHT & CRISP + HOMOLOGATION METADATA)
               =============================================================== */}
            <div className="space-y-3.5">
              {filteredAndSortedOptions.map((option) => {
                const isConn = option.travelType === 'connection';
                const isManual = Boolean(option.manualConfirmation);
                return (
                  <article
                    key={option.optionId}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#C8102E]/40 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left Column: Company + Route Timeline */}
                      <div className="flex-1 space-y-4">
                        {/* Top metadata row with Prominent Operator (Viação) Identification */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50/90 border border-[#C8102E]/25 text-slate-900 shadow-2xs">
                            <span className="w-6 h-6 rounded-lg bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Bus size={14} />
                            </span>
                            <span className="text-xs sm:text-sm tracking-tight">
                              <span className="text-slate-600 font-semibold">Viação:</span>{' '}
                              <strong className="text-[#C8102E] font-extrabold uppercase">
                                {option.company.name}
                              </strong>
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/90 font-bold text-slate-700">
                            <Armchair size={13} className="text-[#DB8902]" />
                            <span>Classe: {option.seatClass}</span>
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] uppercase font-bold border ${
                              isConn
                                ? 'bg-amber-50 text-[#DB8902] border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isConn ? 'Conexão (Cenário 2)' : 'Viagem Direta'}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                              isManual
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isManual
                              ? 'manualConfirmation: true (Cenário 3.1)'
                              : 'manualConfirmation: false (Cenários 1 e 2)'}
                          </span>
                          {option.insurancePrice !== undefined && option.insurancePrice > 0 && (
                            <span className="text-slate-600 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              Seguro: {formatBRL(option.insurancePrice)}
                            </span>
                          )}
                        </div>

                        {/* Timeline Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
                          {/* Departure */}
                          <div className="sm:col-span-2">
                            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                              {option.departure.time.slice(0, 5)}
                            </div>
                            <div className="text-xs font-medium text-slate-600 truncate" title={option.from.name}>
                              {option.from.name}
                            </div>
                          </div>

                          {/* Duration & Connector Line */}
                          <div className="sm:col-span-3 flex flex-col items-center">
                            <div className="text-xs font-mono tabular-nums text-slate-500 mb-1 flex items-center gap-1">
                              <Clock size={12} className="text-[#C8102E]" />
                              <span>{option.durationLabel}</span>
                            </div>
                            <div className="w-full flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-slate-300" />
                              <div className="flex-1 h-[2px] bg-slate-200 relative">
                                {isConn && (
                                  <span
                                    title="Parada de Conexão"
                                    className="w-2.5 h-2.5 rounded-full bg-[#DB8902] border-2 border-white absolute left-1/2 -translate-x-1/2 -top-[4px]"
                                  />
                                )}
                              </div>
                              <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold mt-1 font-mono tabular-nums">
                              {option.availableSeats} poltronas livres
                            </div>
                          </div>

                          {/* Arrival */}
                          <div className="sm:col-span-2 sm:text-right">
                            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                              {option.arrival.time.slice(0, 5)}
                            </div>
                            <div className="text-xs font-medium text-slate-600 truncate" title={option.to.name}>
                              {option.to.name}
                            </div>
                          </div>
                        </div>

                        {/* Connection Details Sub-bar if connection */}
                        {isConn && option.connectionInfo && (
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
                            <div className="font-semibold flex items-center gap-1.5">
                              <GitBranch size={14} className="text-amber-700" />
                              <span>
                                Conexão em {option.connectionInfo.connectionStopName} · Tempo de espera:{' '}
                                <strong className="font-mono tabular-nums">
                                  {option.connectionInfo.waitingMinutes} min
                                </strong>
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-900/90 font-mono tabular-nums">
                              {option.connectionInfo.segments.map((seg) => (
                                <div key={seg.segmentIndex} className="flex items-center gap-1.5">
                                  <Bus size={12} className="text-[#C8102E] shrink-0" />
                                  <span>
                                    Trecho {seg.segmentIndex}: {seg.departure.time} → {seg.arrival.time} (
                                    <strong>Viação: {seg.company.name}</strong> · {seg.seatClass})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Price Breakdown & Seat Map Trigger */}
                      <div className="lg:w-60 lg:border-l lg:border-slate-100 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
                        <div className="text-left lg:text-right">
                          {option.pricing.originalPrice && (
                            <div className="text-xs font-mono tabular-nums text-slate-400 line-through">
                              {formatBRL(option.pricing.originalPrice)}
                            </div>
                          )}
                          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                            {formatBRL(option.pricing.totalPrice)}
                          </div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500">
                            Tarifa {formatBRL(option.pricing.seatPrice)} + Taxas {formatBRL(option.pricing.taxPrice)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenSeatMap(option)}
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 shadow-sm shadow-red-600/20 transition-all cursor-pointer shrink-0 w-auto lg:w-full"
                        >
                          <span className="flex items-center gap-2">
                            <Armchair size={15} />
                            <span>Selecionar Poltronas</span>
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-white/90 normal-case tracking-normal">
                            Viação: {option.company.name}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STAGE C: 2D MULTI-FLOOR SEAT MAP + HOMOLOGATION BOOKING & CHECKOUT
         ===================================================================== */}
      {selectedOptionForSeats && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mapa de Poltronas e Emissão Homologação"
        >
          <div className="bg-white rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header with High-Visibility Bus Operator Banner */}
            <div className="bg-gradient-to-r from-slate-50 via-white to-red-50/40 text-slate-900 px-6 py-5 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold flex-wrap">
                    <span>
                      {activeTripStep === 'outbound' ? 'Trecho de Ida' : 'Trecho de Volta'} · Seleção de Poltronas em Tempo Real
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        selectedOptionForSeats.manualConfirmation
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      manualConfirmation: {String(Boolean(selectedOptionForSeats.manualConfirmation))}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {selectedOptionForSeats.from.name} → {selectedOptionForSeats.to.name}
                  </h3>
                </div>

                {/* Destaque Principal da Viação / Operadora no Topo do Modal */}
                <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#a50d26] text-white shadow-md shadow-red-600/20 border border-red-700/30">
                    <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/25">
                      <Bus size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-red-100 font-semibold leading-none">
                        Operadora do Ônibus
                      </div>
                      <div className="text-sm sm:text-base font-extrabold tracking-tight leading-snug mt-0.5">
                        Viação: {activeSegmentObj?.companyName || selectedOptionForSeats.company.name}
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-slate-900">
                    <Armchair size={18} className="text-[#DB8902] shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold leading-none">
                        Classe &amp; Horário
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mt-0.5">
                        {selectedOptionForSeats.seatClass} ·{' '}
                        <span className="font-mono">
                          {(activeSegmentObj?.departureTime || selectedOptionForSeats.departure.time).slice(0, 5)} →{' '}
                          {(activeSegmentObj?.arrivalTime || selectedOptionForSeats.arrival.time).slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseSeatMap}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#C8102E] border border-slate-200 transition-colors cursor-pointer"
                    aria-label="Fechar mapa de poltronas"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[82vh] overflow-y-auto bg-white">
              {seatMapLoading && (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw size={28} className="animate-spin text-[#C8102E] mx-auto" />
                  <p className="text-sm font-medium text-slate-600">
                    Consultando matriz física do veículo ({selectedOptionForSeats.company.name}) no Sandbox Quero Passagem (POST /new/seats)...
                  </p>
                </div>
              )}

              {seatMapError && (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0" />
                  <div className="text-sm">{seatMapError}</div>
                </div>
              )}

              {!seatMapLoading && !seatMapError && seatMapData && activeSegmentObj && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left 7 Cols: Operator Banner + Segment Selector + Floor Selector + 2D Vehicle Matrix */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Prominent Operator Identification Bar directly above the Seat Map */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/90 via-white to-amber-50/60 border-2 border-[#C8102E]/25 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/20">
                          <Bus size={22} />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                            Você está selecionando poltronas no ônibus da
                          </div>
                          <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                            <span>
                              Viação:{' '}
                              <span className="text-[#C8102E] underline decoration-[#C8102E]/30 underline-offset-4">
                                {activeSegmentObj.companyName || selectedOptionForSeats.company.name}
                              </span>
                            </span>
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                              {selectedOptionForSeats.seatClass}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/80">
                        <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                          Embarque → Chegada
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-900">
                          {(activeSegmentObj.departureTime || selectedOptionForSeats.departure.time).slice(0, 5)} →{' '}
                          {(activeSegmentObj.arrivalTime || selectedOptionForSeats.arrival.time).slice(0, 5)}
                        </span>
                      </div>
                    </div>

                    {/* Segment Tabs (for Connections with `|`) */}
                    {seatMapData.segments.length > 1 && (
                      <div className="space-y-2">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                          1. Escolha as Poltronas dos 2 Trechos da Conexão (seatNumber &amp; connectionSeatNumber)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {seatMapData.segments.map((seg) => {
                            const segSelectedCount = selectedSeats.filter(
                              (s) => s.segmentIndex === seg.segmentIndex
                            ).length;
                            const isCurrent = activeSegmentTab === seg.segmentIndex;
                            return (
                              <button
                                key={seg.segmentIndex}
                                type="button"
                                onClick={() => {
                                  setActiveSegmentTab(seg.segmentIndex);
                                  setActiveFloorTab(seg.floors[0]?.floorIndex ?? 0);
                                }}
                                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'border-[#C8102E] bg-red-50/40 text-slate-900 shadow-2xs'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold">{seg.segmentLabel}</span>
                                  <span className="text-[11px] font-mono tabular-nums font-bold px-2 py-0.5 rounded bg-[#C8102E] text-white">
                                    {segSelectedCount}/{passengersCount}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-800 mt-1.5 font-bold flex items-center gap-1.5">
                                  <Bus size={13} className="text-[#C8102E] shrink-0" />
                                  <span>Viação: {seg.companyName}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                                  {selectedOptionForSeats.seatClass} · {seg.departureTime} → {seg.arrivalTime}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Floor Tabs (Double Decker Piso 1 / Piso 2) */}
                    {activeSegmentObj.floors.length > 1 && (
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Layers size={15} className="text-[#C8102E]" />
                          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                            Andar do Ônibus ({activeSegmentObj.companyName}):
                          </span>
                        </div>
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                          {activeSegmentObj.floors.map((fl) => (
                            <button
                              key={fl.floorIndex}
                              type="button"
                              onClick={() => setActiveFloorTab(fl.floorIndex)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                activeFloorTab === fl.floorIndex
                                  ? 'bg-[#C8102E] text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {fl.floorLabel}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legend + Operator Quick Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                      <div className="flex flex-wrap items-center gap-5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-white border-2 border-emerald-600 text-emerald-700 font-mono text-[10px] font-bold inline-flex items-center justify-center shadow-2xs">
                            01
                          </span>
                          <span className="font-semibold">Livre (Clique p/ escolher)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#C8102E] border-2 border-[#C8102E] text-white font-mono text-[10px] font-bold inline-flex items-center justify-center shadow-2xs">
                            ✓
                          </span>
                          <span className="font-semibold text-[#C8102E]">Selecionada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-200 border border-slate-300 text-slate-400 font-mono text-[10px] font-bold inline-flex items-center justify-center">
                            X
                          </span>
                          <span className="text-slate-500">Ocupada</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <Bus size={13} className="text-[#C8102E]" />
                        <span>Viação: {activeSegmentObj.companyName || selectedOptionForSeats.company.name}</span>
                      </div>
                    </div>

                    {/* Quantity Layout Fallback or 2D Matrix */}
                    {activeSegmentObj.seatsLayout === 'quantity' ? (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                        <Info size={24} className="text-slate-600 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-900">
                          Alocação por Quantidade (Sem Poltrona Numerada)
                        </h4>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                          A <strong>Viação: {activeSegmentObj.companyName || selectedOptionForSeats.company.name}</strong> opera este trecho com{' '}
                          <strong className="font-mono tabular-nums">
                            {activeSegmentObj.availableQuantity ?? 20} lugares disponíveis
                          </strong>
                          . O assento é escolhido diretamente no embarque.
                        </p>
                      </div>
                    ) : (
                      activeFloorObj && (
                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 overflow-x-auto">
                          <div className="min-w-[540px]">
                            {/* Cabin Top Identification Header */}
                            <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-3 px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                                <Bus size={14} className="text-[#C8102E]" />
                                <span>← Frente (Cabine) · Viação: {activeSegmentObj.companyName || selectedOptionForSeats.company.name}</span>
                              </span>
                              <span className="font-bold text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200/70">
                                {activeFloorObj.floorLabel}
                              </span>
                              <span className="text-slate-500">Fundo do Veículo →</span>
                            </div>

                            {/* Render rows across y = 0..maxY and x = 0..maxX */}
                            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2 relative">
                              {Array.from({ length: activeFloorObj.maxY + 1 }).map((_, rowY) => (
                                <div
                                  key={rowY}
                                  className="grid gap-1.5 items-center"
                                  style={{
                                    gridTemplateColumns: `repeat(${activeFloorObj.maxX + 1}, minmax(36px, 1fr))`,
                                  }}
                                >
                                  {Array.from({ length: activeFloorObj.maxX + 1 }).map((__, colX) => {
                                    const cell = activeFloorObj.cells.find(
                                      (c) => c.position.x === colX && c.position.y === rowY
                                    );

                                    if (!cell || cell.type === 'corridor' || cell.type === 'empty') {
                                      return (
                                        <div
                                          key={`${colX}-${rowY}`}
                                          className="h-9 rounded-lg flex items-center justify-center text-[9px] font-mono text-slate-300"
                                        >
                                          {rowY === 2 && colX === Math.floor(activeFloorObj.maxX / 2)
                                            ? 'CORREDOR'
                                            : ''}
                                        </div>
                                      );
                                    }

                                    if (cell.type === 'driver' || cell.type === 'wc' || cell.type === 'stairs') {
                                      return (
                                        <div
                                          key={`${colX}-${rowY}`}
                                          className="h-9 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-mono font-bold flex items-center justify-center select-none"
                                          title={cell.label}
                                        >
                                          {cell.label}
                                        </div>
                                      );
                                    }

                                    const isSelected = selectedSeats.some(
                                      (s) =>
                                        s.segmentIndex === activeSegmentObj.segmentIndex &&
                                        s.seatNumber === cell.seatNumber
                                    );

                                    return (
                                      <button
                                        key={`${colX}-${rowY}`}
                                        type="button"
                                        disabled={cell.occupied}
                                        onClick={() =>
                                          handleToggleSeat(
                                            cell,
                                            activeSegmentObj.segmentIndex,
                                            activeFloorObj.floorIndex
                                          )
                                        }
                                        className={`h-9 rounded-xl font-mono tabular-nums text-xs font-bold transition-all flex items-center justify-center ${
                                          cell.occupied
                                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                            : isSelected
                                            ? 'bg-[#C8102E] text-white border-2 border-[#C8102E] shadow-md scale-105 cursor-pointer ring-2 ring-red-200'
                                            : 'bg-white text-slate-800 border-2 border-emerald-600 hover:bg-emerald-50 cursor-pointer'
                                        }`}
                                        title={
                                          cell.occupied
                                            ? `Poltrona ${cell.seatNumber} Ocupada (${activeSegmentObj.companyName || selectedOptionForSeats.company.name})`
                                            : `Viação: ${activeSegmentObj.companyName || selectedOptionForSeats.company.name} · Poltrona ${cell.seatNumber} · ${formatBRL(
                                                cell.pricing?.totalPrice ??
                                                  selectedOptionForSeats.pricing.totalPrice
                                              )}`
                                        }
                                      >
                                        {cell.seatNumber}
                                      </button>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Right 5 Cols: Passenger Form + Homologation Booking & Checkout Studio */}
                  <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                          Emissão &amp; Homologação Sandbox
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                          {passengersCount} {passengersCount === 1 ? 'Passageiro' : 'Passageiros'}
                          {returnDate && stagedOutboundLeg ? ' · Ida + Volta' : ''}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Total: {formatBRL(totalSelectedSeatsValue)}
                      </span>
                    </div>

                    {/* Resumo Evidente da Viação no Painel Lateral de Confirmação */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-red-50 border border-[#C8102E]/20 text-[#C8102E] flex items-center justify-center shrink-0">
                          <Bus size={16} />
                        </span>
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold leading-none">
                            Empresa Operadora Confirmada
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                            Viação:{' '}
                            <span className="text-[#C8102E]">
                              {activeSegmentObj.companyName || selectedOptionForSeats.company.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                        {selectedOptionForSeats.seatClass}
                      </span>
                    </div>

                    {/* Selected Seats Pills */}
                    {selectedSeats.length === 0 ? (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 text-xs text-slate-600 text-center space-y-1">
                        <div className="font-bold text-slate-800">
                          Clique nas poltronas verdes (livres) ao lado para selecionar ({selectedSeats.length}/
                          {totalRequiredSelections})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Ônibus operado por{' '}
                          <strong className="text-[#C8102E]">
                            Viação: {activeSegmentObj.companyName || selectedOptionForSeats.company.name}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedSeats.map((s) => {
                          const segCompany =
                            seatMapData.segments.find((seg) => seg.segmentIndex === s.segmentIndex)
                              ?.companyName || selectedOptionForSeats.company.name;
                          return (
                            <div
                              key={`${s.segmentIndex}-${s.seatNumber}`}
                              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs shadow-2xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900">
                                    Passageiro {s.passengerNumber}
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span className="font-mono text-white bg-[#C8102E] px-2 py-0.5 rounded-md font-bold">
                                    Poltrona {s.seatNumber}
                                  </span>
                                  {seatMapData.segments.length > 1 && (
                                    <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                      {s.segmentIndex === 1 ? '1º Trecho' : '2º Trecho'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                                  <Bus size={12} className="text-[#C8102E] shrink-0" />
                                  <span>Viação: {segCompany}</span>
                                </div>
                              </div>
                              <span className="font-mono tabular-nums font-bold text-slate-900 shrink-0">
                                {formatBRL(s.totalPrice)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Se o usuário preencheu Data de Volta e ainda está na Ida, botão para salvar Ida e escolher a Volta */}
                    {returnDate && activeTripStep === 'outbound' && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                        <div className="text-xs text-amber-950 font-medium">
                          Você selecionou uma <strong>Data de Volta ({formatDateShort(returnDate)})</strong>. Para os Cenários <strong>1.2, 1.4 ou 2.2</strong>, salve as poltronas da Ida para escolher a Volta:
                        </div>
                        <button
                          type="button"
                          disabled={!isAllSeatsSelected}
                          onClick={handleStageOutboundAndGoToInbound}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#DB8902] hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Salvar Poltronas da Ida e Escolher a Volta →
                        </button>
                      </div>
                    )}

                    {/* Seletor do Cenário Oficial da Quero Passagem */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                        Cenário de Homologação (Identificação nos Logs .MD / .JSON)
                      </label>
                      <select
                        value={selectedScenarioTag}
                        onChange={(e) => {
                          const tag = e.target.value;
                          setSelectedScenarioTag(tag);
                          setIncludeCallbackUrl(tag === '3.1');
                          if (tag === '1.3' || tag === '1.4') {
                            setPassengersForm((prev) =>
                              prev.map((p, idx) => ({ ...p, includeInsurance: idx === 0 }))
                            );
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#C8102E]"
                      >
                        {HOMOLOGATION_SCENARIOS.map((sc) => (
                          <option key={sc.tag} value={sc.tag}>
                            {sc.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dados dos Passageiros + Seguro Individual (Cenários 1.3 e 1.4) */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {Array.from({ length: passengersCount }).map((_, idx) => {
                        const pForm = passengersForm[idx] || DEFAULT_PASSENGERS[idx] || DEFAULT_PASSENGERS[0];
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                Dados do Passageiro {idx + 1}
                              </span>
                              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <input
                                  type="checkbox"
                                  checked={pForm.includeInsurance}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setPassengersForm((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, includeInsurance: checked } : item
                                      )
                                    );
                                    setCreatedBooking(null);
                                  }}
                                  className="rounded text-emerald-600"
                                />
                                <Shield size={12} />
                                <span>Incluir Seguro (insurance)</span>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-500">Nome Completo</label>
                                <input
                                  type="text"
                                  value={pForm.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPassengersForm((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                                    );
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-slate-500">Documento (RG)</label>
                                <input
                                  type="text"
                                  value={pForm.travelDocument}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPassengersForm((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, travelDocument: val } : item
                                      )
                                    );
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-slate-500">CPF (Obrigatório p/ Seguro)</label>
                                <input
                                  type="text"
                                  value={pForm.cpf}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPassengersForm((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, cpf: val } : item))
                                    );
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-slate-500">Data Nasc. (YYYY-MM-DD)</label>
                                <input
                                  type="date"
                                  value={pForm.birthDate}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPassengersForm((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, birthDate: val } : item
                                      )
                                    );
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                                />
                              </div>
                              {pForm.includeInsurance && (
                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-mono text-emerald-700 font-bold">
                                    CEP para Apólice de Seguro (insurance.cep)
                                  </label>
                                  <input
                                    type="text"
                                    value={pForm.cep}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setPassengersForm((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, cep: val } : item))
                                      );
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/40 text-xs font-mono"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* PASSO 1: BOTÃO GERAR PRÉ-RESERVA (POST /new/booking) */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      {seatMapData.segments.length > 1 && !isAllSeatsSelected && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                          <div className="font-semibold">
                            Atenção (Viagem com Conexão): selecione {passengersCount}{' '}
                            {passengersCount === 1 ? 'poltrona' : 'poltronas'} no <strong>1º Trecho</strong> e{' '}
                            {passengersCount} no <strong>2º Trecho</strong> ({selectedSeats.length}/
                            {totalRequiredSelections} selecionadas).
                          </div>
                          {activeSegmentTab === 1 &&
                            selectedSeats.filter((s) => s.segmentIndex === 1).length >= passengersCount && (
                              <button
                                type="button"
                                onClick={() => {
                                  const seg2Obj = seatMapData.segments.find((s) => s.segmentIndex === 2);
                                  setActiveSegmentTab(2);
                                  if (seg2Obj && seg2Obj.floors.length > 0) {
                                    setActiveFloorTab(seg2Obj.floors[0].floorIndex);
                                  }
                                }}
                                className="w-full py-2 px-3 rounded-lg bg-[#DB8902] text-white font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                              >
                                Escolher Poltrona do 2º Trecho da Conexão →
                              </button>
                            )}
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={!isAllSeatsSelected || bookingLoading}
                        onClick={handleExecuteBooking}
                        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
                      >
                        {bookingLoading ? (
                          <>
                            <RefreshCw size={15} className="animate-spin" />
                            <span>Criando Booking no Sandbox...</span>
                          </>
                        ) : (
                          <>
                            <span>1. Gerar Pré-Reserva (POST /new/booking)</span>
                          </>
                        )}
                      </button>

                      {bookingError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                          <strong>Erro no Booking:</strong> {bookingError}
                        </div>
                      )}
                    </div>

                    {/* PASSO 2: CHECKOUT (POST /new/checkout) — Exibido após criar o booking */}
                    {createdBooking && (
                      <div className="p-4 rounded-2xl bg-white border-2 border-[#C8102E]/30 space-y-3.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-600" />
                            Booking Criado: <code className="font-mono">{createdBooking.id.slice(0, 12)}...</code>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Cenário {selectedScenarioTag}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500">E-mail do Comprador</label>
                            <input
                              type="email"
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500">Método de Pagamento</label>
                            <select
                              value={paymentMethod}
                              onChange={(e) =>
                                setPaymentMethod(e.target.value as 'preApproved' | 'creditCard' | 'pix')
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                            >
                              <option value="creditCard">creditCard (Cartão Teste 4111... · Recomendado)</option>
                              <option value="pix">pix (QR Code)</option>
                              <option value="preApproved">preApproved (Requer liberação no afiliado)</option>
                            </select>
                          </div>
                        </div>

                        {paymentMethod === 'creditCard' && (
                          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="col-span-3">
                              <label className="block text-[10px] font-mono text-slate-500">
                                Cartão de Teste Sandbox (cardNumber)
                              </label>
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs bg-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono text-slate-500">Validade (YYYY-MM)</label>
                              <input
                                type="text"
                                value={cardExpiresAt}
                                onChange={(e) => setCardExpiresAt(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500">CVV</label>
                              <input
                                type="text"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs bg-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Callback URL Toggle (Crucial para Cenário 3.1 vs Cenários 1 e 2) */}
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-950">
                            <input
                              type="checkbox"
                              checked={includeCallbackUrl}
                              onChange={(e) => setIncludeCallbackUrl(e.target.checked)}
                              className="rounded text-[#C8102E]"
                            />
                            <Webhook size={13} className="text-[#C8102E]" />
                            <span>Enviar callbackURL no Checkout (Obrigatório no Cenário 3.1)</span>
                          </label>
                          {includeCallbackUrl && (
                            <input
                              type="text"
                              value={customCallbackUrl}
                              onChange={(e) => setCustomCallbackUrl(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-mono text-[11px]"
                            />
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={checkoutLoading}
                          onClick={handleExecuteCheckout}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {checkoutLoading ? (
                            <>
                              <RefreshCw size={15} className="animate-spin" />
                              <span>Processando Checkout no Sandbox...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard size={15} />
                              <span>2. Finalizar Compra de Homologação (POST /new/checkout)</span>
                            </>
                          )}
                        </button>

                        {checkoutError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                            <strong>Erro no Checkout:</strong> {checkoutError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* RESULTADO DO CHECKOUT */}
                    {completedPurchase && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2.5 text-xs text-emerald-950">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm flex items-center gap-1.5">
                            <CheckCircle2 size={17} className="text-emerald-600" />
                            Compra Registrada! ID #{completedPurchase.id}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono font-bold uppercase text-[10px]">
                            status: {completedPurchase.status}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900">
                          O <strong>request</strong> e o <strong>response</strong> desta operação já foram gravados automaticamente no Painel de Homologação para exportação em <code>.md</code> ou <code>.json</code>.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            handleCloseSeatMap();
                            setShowHomologationPanel(true);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileCode2 size={14} />
                          <span>Abrir Painel de Homologação e Baixar .MD / .JSON</span>
                        </button>
                      </div>
                    )}

                    {/* Atendimento Consultivo NC Turismo */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">
                        Precisa de apoio da equipe NC Turismo?
                      </span>
                      <a
                        href={`https://wa.me/554132811153?text=${encodeURIComponent(
                          `Olá! Consultei no Portal Rodoviário NC Turismo a viagem ${selectedOptionForSeats.from.name} -> ${selectedOptionForSeats.to.name} em ${formatDateShort(
                            selectedOptionForSeats.departure.date
                          )} às ${selectedOptionForSeats.departure.time.slice(0, 5)} (${
                            selectedOptionForSeats.company.name
                          }).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        <MessageSquare size={13} />
                        <span>Atendimento WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAINEL DE HOMOLOGAÇÃO QUERO PASSAGEM (EXPORTAR .MD / .JSON & CALLBACKS)
         ===================================================================== */}
      {showHomologationPanel && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Painel de Homologação Quero Passagem"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#DB8902] font-bold">
                  Homologação Oficial Quero Passagem · Afiliado NCT
                </div>
                <h3 className="text-lg font-bold mt-0.5">
                  Evidências de Requests &amp; Responses (.MD / .JSON) + Webhook Callback
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHomologationPanel(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
              {/* Top Bar: Webhook URL + Export Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="lg:col-span-7 space-y-1">
                  <div className="text-xs font-mono uppercase text-[#C8102E] font-bold flex items-center gap-1.5">
                    <Webhook size={14} />
                    <span>URL Oficial de Callback (Cenário 3.1 · manualConfirmation: true)</span>
                  </div>
                  <div className="font-mono text-xs text-slate-800 bg-white px-3 py-2 rounded-xl border border-slate-200 select-all break-all">
                    {defaultCallbackUrl}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Quando a equipe da Quero Passagem aprovar uma compra e cancelar a outra no Cenário 3.1, o webhook acima receberá a notificação e sincronizará automaticamente o <code>POST /purchase/get</code>.
                  </p>
                </div>

                <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadMarkdownLogs}
                    className="px-4 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a50d26] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Baixar Dossiê Consolidado (.MD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJsonLogs}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Baixar Dossiê Consolidado (.JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setLogsLoading(true);
                      const updated = await fetchHomologationLogs();
                      setHomologationLogs(updated);
                      setLogsLoading(false);
                    }}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
                    title="Atualizar logs"
                  >
                    <RefreshCw size={15} className={logsLoading ? 'animate-spin' : ''} />
                  </button>

                  {homologationLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={async () => {
                        await clearHomologationLogs();
                        setHomologationLogs([]);
                      }}
                      className="p-2.5 rounded-xl bg-white hover:bg-red-50 border border-slate-200 text-red-600 cursor-pointer"
                      title="Limpar logs"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Consulta Manual de Pedido (POST /purchase/get) */}
              <form
                onSubmit={handleLookupPurchase}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-end gap-3"
              >
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold mb-1">
                    Consultar Pedido (POST /purchase/get) — ID Numérico
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 123456"
                    value={purchaseLookupId}
                    onChange={(e) => setPurchaseLookupId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold mb-1">
                    E-mail do Comprador
                  </label>
                  <input
                    type="email"
                    value={purchaseLookupEmail}
                    onChange={(e) => setPurchaseLookupEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={purchaseLookupLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  {purchaseLookupLoading ? 'Consultando...' : 'Consultar Status (/purchase/get)'}
                </button>
                {purchaseLookupResult && (
                  <div className="w-full mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono overflow-x-auto">
                    Status Retornado: <strong>{purchaseLookupResult.status || purchaseLookupResult.error}</strong>
                  </div>
                )}
              </form>

              {/* Lista de Logs Capturados */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Histórico de Operações Gravadas ({homologationLogs.length})
                </h4>

                {homologationLogs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
                    Nenhuma operação de Booking ou Checkout realizada ainda. Selecione um ônibus na tela principal, escolha as poltronas e clique em <strong>Gerar Pré-Reserva</strong> e <strong>Finalizar Compra</strong> para capturar os payloads.
                  </div>
                ) : (
                  homologationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                    >
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {log.scenarioTag && (
                            <span className="px-2 py-0.5 rounded bg-[#C8102E] text-white font-mono font-bold">
                              Cenário {log.scenarioTag}
                            </span>
                          )}
                          <span className="font-mono font-bold text-slate-900">{log.operation}</span>
                          <span className="font-mono text-slate-500">
                            {log.method} {log.endpoint}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold ${
                              log.ok
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            HTTP {log.httpStatus} ({log.latencyMs}ms)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLog(log)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                          >
                            {copiedLogId === log.id ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar JSON</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 text-[11px] font-mono">
                        <div className="p-3.5 overflow-x-auto max-h-60">
                          <div className="text-slate-400 uppercase font-bold mb-1">Request Payload</div>
                          <pre className="text-slate-800">{JSON.stringify(log.requestPayload, null, 2)}</pre>
                        </div>
                        <div className="p-3.5 overflow-x-auto max-h-60 bg-slate-50/50">
                          <div className="text-slate-400 uppercase font-bold mb-1">Response Payload</div>
                          <pre className="text-slate-800">{JSON.stringify(log.responsePayload, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
