# Dossiê Consolidado de Homologação — Quero Passagem (`ws_v4`) · NC Turismo (`NCT`)

- **Empresa / Afiliado:** NC Turismo (`affiliateCode: NCT`)
- **Usuário Basic Auth (Sandbox):** `nc turismo homolog`
- **Endpoint Base Homologação:** `https://queropassagem.qpdevs.com/ws_v4/`
- **URL de Callback (Webhook Cenário 3.1):** `https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback` (também ativa em `https://ais-dev-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback`)
- **Data da Consolidação:** 2026-11-05T20:40:40.380Z

---

## 📊 Resumo Executivo dos Cenários Homologados

| Cenário | Pedido (`orderId`) | `bookingId` | Status Retornado | Trechos / Conexão | Passageiros / Seguro | Viação | Valor Total |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.1** | `#99020340` | `a6cd2142bb974f5554015a411de2f19d` | `paid` | 1 viagem(ns) (ROD_53 → ROD_193) | 1 pax (0 c/ seguro) | Progresso | R$ 74.82 |
| **1.1** | `#99020342` | `404e823b6822d28b25ad4702e1b32d28` | `paid` | 1 viagem(ns) (ROD_53 → ROD_193) | 1 pax (1 c/ seguro) | Progresso | R$ 85.77 |
| **1.2** | `#99020343` | `8e89a01b020736131e74e43ec20c80d6` | `paid` | 2 viagem(ns) (ROD_53 → ROD_193 / ROD_193 → ROD_53) | 1 pax (0 c/ seguro) | Progresso + Sampaio | R$ 148.64 |
| **1.2** | `#99020348` | `e24f47d473c9cc98d845462339006376` | `paid` | 2 viagem(ns) (ROD_53 → ROD_65 / ROD_65 → ROD_53) | 1 pax (0 c/ seguro) | Progresso + Sampaio | R$ 124.49 |
| **1.3** | `#99020345` | `22028e9ad82908e2de670324c8a7497c` | `paid` | 1 viagem(ns) (ROD_53 → ROD_193) | 2 pax (1 c/ seguro) | Progresso | R$ 160.59 |
| **1.4** | `#99020346` | `9adc5a8fca5c3faed4fd055741503670` | `paid` | 1 viagem(ns) (ROD_53 → ROD_193) | 2 pax (1 c/ seguro) | Sampaio | R$ 46.47 |
| **1.4** | `#99020366` | `9b8e83fb62894dc94b5182dcadcadb08` | `paid` | 2 viagem(ns) (ROD_53 → ROD_65 / ROD_65 → ROD_53) | 2 pax (0 c/ seguro) | Progresso + Progresso | R$ 272.46 |
| **2.1** | `#99020311` | `3164f344f116986af954c1d8963df346` | `paid` | 1 viagem(ns) (ROD_53 → ROD_2501) | 1 pax (1 c/ seguro) | Progresso | R$ 48.54 |
| **2.1** | `#99020347` | `b93e0692885be0b3480e2cbea0e28adb` | `paid` | 1 viagem(ns) c/ conexão (2 seg.) (ROD_53 → ROD_1 / ROD_1 → ROD_65) | 1 pax (0 c/ seguro) | Progresso + Sampaio | R$ 101.33 |
| **2.2** | `#99020365` | `ff3fca2abfd5e176510b33cf1f073bc0` | `paid` | 2 viagem(ns) c/ conexão (4 seg.) (ROD_53 → ROD_1 / ROD_1 → ROD_65 / ROD_65 → ROD_380 / ROD_380 → ROD_53) | 1 pax (0 c/ seguro) | Progresso + Sampaio + Progresso + Sampaio | R$ 214.36 |
| **2.3** | `#99020364` | `b157703423add126a976ada3f271dcbe` | `paid` | 1 viagem(ns) c/ conexão (2 seg.) (ROD_53 → ROD_1 / ROD_1 → ROD_65) | 2 pax (0 c/ seguro) | Progresso + Sampaio | R$ 202.66 |
| **3.1** | `#99020312` | `8e92513df2c142ac6bc21958be0d350f` | `in_confirmation_process` | 1 viagem(ns) (ROD_53 → ROD_2501) | 1 pax (0 c/ seguro) | LiraBus | R$ 100.00 |
| **3.1** | `#99020362` | `9f0d13e8db78625957746c34cbe11d0f` | `in_confirmation_process` | 1 viagem(ns) (ROD_53 → ROD_3520) | 1 pax (0 c/ seguro) | 1001 | R$ 100.00 |

> **Nota Importante sobre o Cenário 3.1 (`manualConfirmation: true`):**
> Conforme solicitado nas instruções de homologação, as duas compras simples do **Cenário 3.1** (**Pedido `#99020312`** e **Pedido `#99020362`**) retornaram status `in_confirmation_process` e **foram mantidas pendentes (não foram canceladas)** para que a equipe técnica da Quero Passagem possa aprovar uma e cancelar a outra, validando o disparo da `callbackURL`.

---

## Cenário 1.1 — Compra Simples: Ida com 1 Passageiro (manualConfirmation: false)

Compra simples de apenas ida para 1 passageiro em trecho de confirmação imediata (manualConfirmation: false), validando emissão de bilhete sem seguro (#99020340) e com seguro (#99020342).

### Execução 1.1 (Compra #1) — Pedido `#99020340` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T18:19:01.836Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `a6cd2142bb974f5554015a411de2f19d`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_87ebc179ec809e2a71696e69b069c2c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "a6cd2142bb974f5554015a411de2f19d",
  "expiresAt": "2026-11-05T15:29:01-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 74.82
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.82
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 37.41
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.82
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 24.94
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.82
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 18.71
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.84
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 14.96
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.8
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 12.47
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.82
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 10.69
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.83
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 9.35
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.8
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 8.31
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.79
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 74.82
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 74.82
      }
    ]
  },
  "travels": [
    {
      "id": "1_3f7dda20132b16bd842e28fa1e79abe3",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T18:19:09.395Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020340`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "a6cd2142bb974f5554015a411de2f19d",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_1-1793902744822"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020340,
  "externalId": "NCT-1_1-1793902744822",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 74.82,
    "tax": 0,
    "insurance": 0,
    "tickets": 74.82,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 15:19:05",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-11",
        "time": "02:50:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947010,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947010/a9608261794622f42a03c54e946cc02b",
          "ticket": "1B411F",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 22:00:00"
    }
  ]
}
```

---

### Execução 1.1 (Compra #2) — Pedido `#99020342` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T18:53:53.886Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `404e823b6822d28b25ad4702e1b32d28`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_87ebc179ec809e2a71696e69b069c2c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456799",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "birthDate": "1990-05-15",
          "cpf": "52998224725",
          "insurance": {
            "cpf": "52998224725",
            "birthDate": "1990-05-15",
            "cep": "80010-000"
          }
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "404e823b6822d28b25ad4702e1b32d28",
  "expiresAt": "2026-11-05T16:03:53-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 85.77
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.77
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 42.89
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.78
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 28.59
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.77
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 21.44
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.76
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 17.15
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.75
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 14.3
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.8
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 12.25
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.75
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 10.72
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.76
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 9.53
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.77
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 8.58
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.8
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 85.77
        },
        "seatPrice": 74.82,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 85.77
      }
    ]
  },
  "travels": [
    {
      "id": "1_3f7dda20132b16bd842e28fa1e79abe3",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456799",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "15/05/1990",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T18:54:02.556Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020342`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "404e823b6822d28b25ad4702e1b32d28",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_1-1793904837577"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020342,
  "externalId": "NCT-1_1-1793904837577",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 85.77,
    "tax": 0,
    "insurance": 10.95,
    "tickets": 74.82,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 15:53:59",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-11",
        "time": "02:50:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947013,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456799",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947013/ed717373e3374a03be73a4935e08fff2",
          "ticket": "83BA49",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "1990-05-15",
            "cep": "02030-000",
            "state": "processing",
            "voucher": ""
          },
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 22:00:00"
    }
  ]
}
```

---

## Cenário 1.2 — Compra Simples: Ida e Volta com 1 Passageiro (manualConfirmation: false)

Compra simples de ida e volta (2 trechos no array travels) para 1 passageiro em trechos de confirmação imediata (manualConfirmation: false).

### Execução 1.2 (Compra #1) — Pedido `#99020343` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T18:55:49.233Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `8e89a01b020736131e74e43ec20c80d6`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_87ebc179ec809e2a71696e69b069c2c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    },
    {
      "travelId": "1_260b56a031088e9ceb6fb23e4e314a89",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "25",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "8e89a01b020736131e74e43ec20c80d6",
  "expiresAt": "2026-11-05T16:05:48-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 148.64
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.64
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 74.32
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.64
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 49.55
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.65
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 37.16
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.64
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 29.73
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.65
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 24.77
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.62
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 21.23
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.61
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 18.58
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.64
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 16.52
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.68
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 14.86
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.6
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 13.51
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.61
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 12.39
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.68
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 148.64
        },
        "seatPrice": 148.64,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 148.64
      }
    ]
  },
  "travels": [
    {
      "id": "1_3f7dda20132b16bd842e28fa1e79abe3",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_0a321a3e2773edc0c5f33959a34031c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "25",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-19 23:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T18:56:00.537Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020343`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "8e89a01b020736131e74e43ec20c80d6",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_2-1793904954477"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020343,
  "externalId": "NCT-1_2-1793904954477",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 148.64,
    "tax": 0,
    "insurance": 0,
    "tickets": 148.64,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 15:55:56",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-11",
        "time": "02:50:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947014,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947014/d4d5e5122fd103b631763112d9e211ae",
          "ticket": "3F2B66",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 22:00:00"
    },
    {
      "from": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-20",
        "time": "02:00:00"
      },
      "arrival": {
        "date": "2026-11-21",
        "time": "03:50:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947015,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456723",
          "travelDocumentType": "RG",
          "seatNumber": "25",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947015/8a3d849b154b999c61a72f8f005e3773",
          "ticket": "F37D8A",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-19 23:00:00"
    }
  ]
}
```

---

### Execução 1.2 (Compra #2) — Pedido `#99020348` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T19:02:22.414Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `e24f47d473c9cc98d845462339006376`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_eb2cc7668e515b8cbf607463dd5c7d4b",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    },
    {
      "travelId": "1_ede2d19d6a3a890ef9ebf0d10af0382f",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "e24f47d473c9cc98d845462339006376",
  "expiresAt": "2026-11-05T16:12:21-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 124.49
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.49
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 62.25
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.5
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 41.5
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.5
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 31.12
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.48
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 24.9
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.5
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 20.75
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.5
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 17.78
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.46
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 15.56
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.48
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 13.83
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.47
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 12.45
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.5
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 11.32
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.52
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 10.37
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.44
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 124.49
        },
        "seatPrice": 124.49,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 124.49
      }
    ]
  },
  "travels": [
    {
      "id": "1_dc1fbe4849d0eeffd23fb47930d06566",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-10 00:30:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_42d52d655f2ba952362ba25e39f79575",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-21 01:30:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T19:02:29.942Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020348`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "e24f47d473c9cc98d845462339006376",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_2-1793905344268"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020348,
  "externalId": "NCT-1_2-1793905344268",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 124.49,
    "tax": 0,
    "insurance": 0,
    "tickets": 124.49000000000001,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 16:02:25",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "03:30:00"
      },
      "arrival": {
        "date": "2026-11-10",
        "time": "13:30:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947024,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "LEITO CAMA",
          "bpe": "",
          "ticket": "FAFFAD",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-10 00:30:00"
    },
    {
      "from": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-21",
        "time": "04:30:00"
      },
      "arrival": {
        "date": "2026-11-21",
        "time": "14:30:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947025,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456702",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "seatClass": "SEMI LEITO",
          "bpe": "",
          "ticket": "BD304D",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-21 01:30:00"
    }
  ]
}
```

---

## Cenário 1.3 — Compra Simples: Ida com 2 Passageiros — 1 com Seguro e 1 sem Seguro (manualConfirmation: false)

Compra simples de apenas ida para 2 passageiros no mesmo trecho, sendo o Passageiro 1 com objeto insurance preenchido e o Passageiro 2 sem seguro.

### Execução 1.3 — Pedido `#99020345` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T18:58:32.568Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `22028e9ad82908e2de670324c8a7497c`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_87ebc179ec809e2a71696e69b069c2c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456713",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "52998224725",
          "insurance": {
            "cpf": "52998224725",
            "birthDate": "1990-05-15",
            "cep": "80010-000"
          }
        },
        {
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1992-08-20",
          "cpf": "39053344705"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "22028e9ad82908e2de670324c8a7497c",
  "expiresAt": "2026-11-05T16:08:31-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 160.59
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.59
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 80.29
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.58
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 53.53
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.59
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 40.15
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.6
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 32.12
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.6
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 26.76
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.56
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 22.94
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.58
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 20.07
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.56
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 17.84
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.56
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 16.06
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.6
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 14.6
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.6
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 13.38
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.56
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 160.59
        },
        "seatPrice": 149.64,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 160.59
      }
    ]
  },
  "travels": [
    {
      "id": "1_3f7dda20132b16bd842e28fa1e79abe3",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456713",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "15/05/1990",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        },
        {
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1992-08-20",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T18:58:43.462Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020345`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "22028e9ad82908e2de670324c8a7497c",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_3-1793905115931"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020345,
  "externalId": "NCT-1_3-1793905115931",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 160.59,
    "tax": 0,
    "insurance": 10.95,
    "tickets": 149.64,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 15:58:37",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-11",
        "time": "02:50:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947018,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456713",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947018/2fb56f7bd045954c4e5570dec52a0d0c",
          "ticket": "1644C4",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "1990-05-15",
            "cep": "02030-000",
            "state": "processing",
            "voucher": ""
          },
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        },
        {
          "id": 947019,
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947019/9448aba1b744f77ed2eead15a0b6501f",
          "ticket": "A7838F",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1992-08-20",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 22:00:00"
    }
  ]
}
```

---

## Cenário 1.4 — Compra Simples: Ida e Volta com 2 Passageiros — 1 com Seguro e 1 sem Seguro (manualConfirmation: false)

Compra de ida e volta (2 trechos no array travels) para 2 passageiros simultâneos, sendo 1 passageiro com seguro (insurance) e 1 passageiro sem seguro.

### Execução 1.4 (Compra #1) — Pedido `#99020346` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T18:59:40.455Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `9adc5a8fca5c3faed4fd055741503670`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_5cdf53a5bbaa86f89833c7af8f8e24a8",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456711",
          "travelDocumentType": "RG",
          "seatNumber": "41",
          "birthDate": "1990-05-15",
          "cpf": "52998224725",
          "insurance": {
            "cpf": "52998224725",
            "birthDate": "1990-05-15",
            "cep": "80010-000"
          }
        },
        {
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654322",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "birthDate": "1992-08-20",
          "cpf": "39053344705"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "9adc5a8fca5c3faed4fd055741503670",
  "expiresAt": "2026-11-05T16:09:40-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 46.47
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.47
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 23.24
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.48
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 15.49
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.47
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 11.62
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.48
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 9.29
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.45
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 46.47
        },
        "seatPrice": 35.52,
        "taxPrice": 0,
        "insurancePrice": 10.95,
        "total": 46.47
      }
    ]
  },
  "travels": [
    {
      "id": "1_bdc131feaae35ece4170482cfa9cadde",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456711",
          "travelDocumentType": "RG",
          "seatNumber": "41",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "15/05/1990",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-09 23:00:00",
            "allowed": true,
            "fee": 0
          }
        },
        {
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654322",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "birthDate": "1992-08-20",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-09 23:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T18:59:48.706Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020346`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "9adc5a8fca5c3faed4fd055741503670",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-1_4-1793905183472"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020346,
  "externalId": "NCT-1_4-1793905183472",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 46.47,
    "tax": 0,
    "insurance": 10.95,
    "tickets": 35.52,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 15:59:44",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_193",
        "label": "Lages, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "02:00:00"
      },
      "arrival": {
        "date": "2026-11-11",
        "time": "03:50:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947020,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456711",
          "travelDocumentType": "RG",
          "seatNumber": "41",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947020/27dcbb1c90f791d4d1a05112c699d70b",
          "ticket": "F209A5",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1990-05-15",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "1990-05-15",
            "cep": "02030-000",
            "state": "processing",
            "voucher": ""
          },
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        },
        {
          "id": 947021,
          "name": "Maria Fernanda Souza Teste",
          "travelDocument": "987654322",
          "travelDocumentType": "RG",
          "seatNumber": "42",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947021/e17e97fdc506484d534ad826550ecf53",
          "ticket": "BC699F",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1992-08-20",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 23:00:00"
    }
  ]
}
```

---

### Execução 1.4 (Compra #2) — Pedido `#99020366` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T20:38:45.628Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `9b8e83fb62894dc94b5182dcadcadb08`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_639736ff9a86f253b16b8a0903a159ad",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "52998224725"
        },
        {
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1993-07-22",
          "cpf": "39053344705"
        }
      ]
    },
    {
      "travelId": "1_62e14ea58b7879613b75732c820ad949",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "52998224725"
        },
        {
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1993-07-22",
          "cpf": "39053344705"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "9b8e83fb62894dc94b5182dcadcadb08",
  "expiresAt": "2026-11-05T17:48:44-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 272.46
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.46
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 136.23
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.46
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 90.82
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.46
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 68.12
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.48
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 54.49
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.45
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 45.41
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.46
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 38.92
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.44
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 34.06
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.48
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 30.27
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.43
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 27.25
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.5
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 24.77
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.47
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 22.71
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.52
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 272.46
        },
        "seatPrice": 272.46,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 272.46
      }
    ]
  },
  "travels": [
    {
      "id": "1_a20621b20fd4de0540f97ff077ac8189",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-11 22:00:00",
            "allowed": false,
            "fee": 0
          }
        },
        {
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1993-07-22",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-11 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_ef834a5b714d638c3402b3a816407f24",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-18 22:00:00",
            "allowed": false,
            "fee": 0
          }
        },
        {
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1993-07-22",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-18 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T20:40:18.429Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020366`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "9b8e83fb62894dc94b5182dcadcadb08",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123"
  },
  "externalId": "NCT-1793911211061"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020366,
  "externalId": "NCT-1793911211061",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 272.46,
    "tax": 0,
    "insurance": 0,
    "tickets": 272.46,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 17:40:12",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-12",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-12",
        "time": "11:00:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947061,
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947061/737496910f9cd9269f6d91b1f6b75045",
          "ticket": "44A145",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1988-03-12",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        },
        {
          "id": 947062,
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947062/d1805cd628f5f82b18528db542da7852",
          "ticket": "584C2D",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1993-07-22",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-11 22:00:00"
    },
    {
      "from": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-19",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-19",
        "time": "11:00:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947063,
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947063/952ebd2cce27cfe5d4ca025b3b608ac9",
          "ticket": "34F9D3",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1988-03-12",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        },
        {
          "id": 947064,
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947064/76d7f0953cbf5fdff5416e50ae85b5a0",
          "ticket": "C3738D",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1993-07-22",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-18 22:00:00"
    }
  ]
}
```

---

## Cenário 2.1 — Compra com Conexão: Apenas Ida para 1 Passageiro (manualConfirmation: false)

Compra em rota com conexão (travelId composto separado por pipe | e assento do 2º trecho em connectionSeatNumber) apenas de ida para 1 passageiro.

### Execução 2.1 (Compra #1) — Pedido `#99020311` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T17:42:41.278Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `3164f344f116986af954c1d8963df346`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_ee230090b9740e84942ce07001c6a3f3",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "01234567890",
          "insurance": {
            "cpf": "01234567890",
            "birthDate": "1990-05-15",
            "cep": "80010-000"
          }
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "3164f344f116986af954c1d8963df346",
  "expiresAt": "2026-11-05T14:52:40-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 48.54
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.54
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 24.27
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.54
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 16.18
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.54
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 12.14
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.56
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 9.71
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.55
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 8.09
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.54
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 48.54
        },
        "seatPrice": 38.59,
        "taxPrice": 0,
        "insurancePrice": 9.95,
        "total": 48.54
      }
    ]
  },
  "travels": [
    {
      "id": "1_3ee96b2de57a7e16e14ea4db5324a2c9",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "012.345.678-90",
          "insurance": {
            "cpf": "012.345.678-90",
            "birthDate": "15/05/1990",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-17 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T17:42:51.867Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020311`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "3164f344f116986af954c1d8963df346",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "012.345.678-90",
    "phone": "(41) 3281-1153"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-2_1-1793900565859"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020311,
  "externalId": "NCT-2_1-1793900565859",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 48.54,
    "tax": 0,
    "insurance": 9.95,
    "tickets": 38.59,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 14:42:47",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_2501",
        "label": "Rio de Janeiro, RJ - Barra da Tijuca (Terminal Alvorada)",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-18",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-18",
        "time": "04:20:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 946956,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/946956/757598c9339cd4eaacc18e1dbc59f5b4",
          "ticket": "DA9C82",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": {
            "cpf": "012.345.678-90",
            "birthDate": "1990-05-15",
            "cep": "02030-000",
            "state": "processing",
            "voucher": ""
          },
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-17 22:00:00"
    }
  ]
}
```

---

### Execução 2.1 (Compra #2) — Pedido `#99020347` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T19:00:54.064Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `b93e0692885be0b3480e2cbea0e28adb`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_ae464fbfd51ddae73d158b5a295af417|1_b450323532ad8e20f5e72ebd89c35c3f",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456710",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "52998224725",
          "connectionSeatNumber": "38"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "b93e0692885be0b3480e2cbea0e28adb",
  "expiresAt": "2026-11-05T16:10:53-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 101.33
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.33
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 50.67
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.34
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 33.78
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.34
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 25.33
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.32
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 20.27
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.35
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 16.89
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.34
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 14.48
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.36
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 12.67
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.36
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 11.26
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.34
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 10.13
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.3
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 9.21
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.31
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 8.44
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.28
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 101.33
        },
        "seatPrice": 101.33,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 101.33
      }
    ]
  },
  "travels": [
    {
      "id": "1_9c8509c756643800ec911eef7a1e075d",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456710",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-09 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_efdaabd71843f60fb5b2abb4cec87296",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456710",
          "travelDocumentType": "RG",
          "seatNumber": "38",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-10 09:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T19:01:02.662Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020347`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "b93e0692885be0b3480e2cbea0e28adb",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-2_1-1793905256913"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020347,
  "externalId": "NCT-2_1-1793905256913",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 101.33,
    "tax": 0,
    "insurance": 0,
    "tickets": 101.33,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 16:00:58",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-10",
        "time": "10:10:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947022,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456710",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947022/630b2f0e267cb80e58aa62bf10b699b5",
          "ticket": "36470A",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-09 22:00:00"
    },
    {
      "from": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-10",
        "time": "12:00:00"
      },
      "arrival": {
        "date": "2026-11-10",
        "time": "23:20:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947023,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456710",
          "travelDocumentType": "RG",
          "seatNumber": "38",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947023/a45103b1eb679c6d32939fbd5176919c",
          "ticket": "86C8B6",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-10 09:00:00"
    }
  ]
}
```

---

## Cenário 2.2 — Compra com Conexão: Ida e Volta para 1 Passageiro (manualConfirmation: false)

Compra de ida e volta onde ambos os trechos possuem conexão (travelId composto com pipe | e connectionSeatNumber na ida e na volta).

### Execução 2.2 — Pedido `#99020365` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T20:38:48.875Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `ff3fca2abfd5e176510b33cf1f073bc0`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_22d580a053720be023b917f95085f483|1_aa5e3a91d34f38a2c7ee0c3eb81de088",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "12345678909",
          "connectionSeatNumber": "10"
        }
      ]
    },
    {
      "travelId": "1_1e4353cd260b7af787ecc775eb2d5c72|1_1c96c2aec1e3814e847fd3f01b829f51",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "12345678909",
          "connectionSeatNumber": "10"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "ff3fca2abfd5e176510b33cf1f073bc0",
  "expiresAt": "2026-11-05T17:48:47-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 214.36
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.36
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 107.18
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.36
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 71.45
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.35
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 53.59
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.36
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 42.87
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.35
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 35.73
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.38
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 30.62
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.34
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 26.79
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.32
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 23.82
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.38
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 21.44
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.4
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 19.49
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.39
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 17.86
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.32
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 214.36
        },
        "seatPrice": 214.36,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 214.36
      }
    ]
  },
  "travels": [
    {
      "id": "1_80d793c41fbfec6452257644c6786896",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "123.456.789-09",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-11 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_f59670fbc186186dcc5cf2c56d13fdf6",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "123.456.789-09",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-12 09:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_a206183b576e089d1d6fcc6cac391018",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "123.456.789-09",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-18 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_de21a875cb0be670c77cbf57a70ed080",
      "passengers": [
        {
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1985-11-04",
          "cpf": "123.456.789-09",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-19 06:30:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T20:40:11.053Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020365`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "ff3fca2abfd5e176510b33cf1f073bc0",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123"
  },
  "externalId": "NCT-1793911202802"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020365,
  "externalId": "NCT-1793911202802",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 214.36,
    "tax": 0,
    "insurance": 0,
    "tickets": 214.35999999999999,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 17:40:04",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-12",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-12",
        "time": "10:10:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947057,
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947057/599c6df5b66fc397a83105b435b71b7c",
          "ticket": "834F16",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1985-11-04",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-11 22:00:00"
    },
    {
      "from": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-12",
        "time": "12:00:00"
      },
      "arrival": {
        "date": "2026-11-12",
        "time": "23:20:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947058,
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947058/fcd4fd609b55b8c3496fab5a9c5170ba",
          "ticket": "CF6628",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1985-11-04",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-12 09:00:00"
    },
    {
      "from": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_380",
        "label": "Porto Alegre, RS",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-19",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-19",
        "time": "07:40:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947059,
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947059/c8cbe29cc6f126128aff849a6a32545d",
          "ticket": "B562AA",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1985-11-04",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-18 22:00:00"
    },
    {
      "from": {
        "id": "ROD_380",
        "label": "Porto Alegre, RS",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-19",
        "time": "09:30:00"
      },
      "arrival": {
        "date": "2026-11-20",
        "time": "03:50:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947060,
          "name": "Roberto Almeida Prado Teste",
          "travelDocument": "66778891",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "LEITO CAMA",
          "bpe": "",
          "ticket": "291C03",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1985-11-04",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-19 06:30:00"
    }
  ]
}
```

---

## Cenário 2.3 — Compra com Conexão: 2 Passageiros (manualConfirmation: false)

Compra em rota com conexão para 2 passageiros simultâneos (com seatNumber e connectionSeatNumber por passageiro).

### Execução 2.3 — Pedido `#99020364` (`status: paid`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T20:38:51.311Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `b157703423add126a976ada3f271dcbe`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_22d580a053720be023b917f95085f483|1_aa5e3a91d34f38a2c7ee0c3eb81de088",
      "passengers": [
        {
          "name": "Lucas Martins Rocha Teste",
          "travelDocument": "77889901",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1991-04-18",
          "cpf": "52998224725",
          "connectionSeatNumber": "20"
        },
        {
          "name": "Juliana Ribeiro Dias Teste",
          "travelDocument": "88990012",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "birthDate": "1994-09-25",
          "cpf": "39053344705",
          "connectionSeatNumber": "30"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "b157703423add126a976ada3f271dcbe",
  "expiresAt": "2026-11-05T17:48:50-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 202.66
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.66
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 101.33
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.66
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 67.55
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.65
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 50.67
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.68
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 40.53
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.65
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 33.78
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.68
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 28.95
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.65
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 25.33
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.64
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 22.52
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.68
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 20.27
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.7
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 18.42
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.62
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 16.89
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.68
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 202.66
        },
        "seatPrice": 202.66,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 202.66
      }
    ]
  },
  "travels": [
    {
      "id": "1_80d793c41fbfec6452257644c6786896",
      "passengers": [
        {
          "name": "Lucas Martins Rocha Teste",
          "travelDocument": "77889901",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1991-04-18",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-11 22:00:00",
            "allowed": false,
            "fee": 0
          }
        },
        {
          "name": "Juliana Ribeiro Dias Teste",
          "travelDocument": "88990012",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "birthDate": "1994-09-25",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-11 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_f59670fbc186186dcc5cf2c56d13fdf6",
      "passengers": [
        {
          "name": "Lucas Martins Rocha Teste",
          "travelDocument": "77889901",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "birthDate": "1991-04-18",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-12 09:00:00",
            "allowed": true,
            "fee": 0
          }
        },
        {
          "name": "Juliana Ribeiro Dias Teste",
          "travelDocument": "88990012",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "birthDate": "1994-09-25",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-12 09:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T20:40:02.796Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020364`
- **Status Retornado:** `paid`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "b157703423add126a976ada3f271dcbe",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123"
  },
  "externalId": "NCT-1793911195531"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020364,
  "externalId": "NCT-1793911195531",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 202.66,
    "tax": 0,
    "insurance": 0,
    "tickets": 202.66,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-05 17:39:56",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-12",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-12",
        "time": "10:10:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947053,
          "name": "Lucas Martins Rocha Teste",
          "travelDocument": "77889901",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947053/b733f5421517e6cdf2aac4e3209d4943",
          "ticket": "DA25D4",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1991-04-18",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        },
        {
          "id": 947054,
          "name": "Juliana Ribeiro Dias Teste",
          "travelDocument": "88990012",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947054/4ddd1395466869ca61387c9ead58d21c",
          "ticket": "6075FD",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1994-09-25",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-11 22:00:00"
    },
    {
      "from": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_65",
        "label": "Florianópolis, SC",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-12",
        "time": "12:00:00"
      },
      "arrival": {
        "date": "2026-11-12",
        "time": "23:20:00"
      },
      "company": {
        "id": "28",
        "name": "Sampaio"
      },
      "passengers": [
        {
          "id": 947055,
          "name": "Lucas Martins Rocha Teste",
          "travelDocument": "77889901",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947055/776d2ae36657702dd860f56d1820da59",
          "ticket": "346C65",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1991-04-18",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        },
        {
          "id": 947056,
          "name": "Juliana Ribeiro Dias Teste",
          "travelDocument": "88990012",
          "travelDocumentType": "RG",
          "seatNumber": "30",
          "seatClass": "CONVENCIONAL",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947056/ce4a7c88d8db892a3ba9854fc38b16f2",
          "ticket": "52CF4C",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": true,
          "birthDate": "1994-09-25",
          "insurance": null,
          "cancellation": {
            "allowed": true,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-12 09:00:00"
    }
  ]
}
```

---

## Cenário 3.1 — Passagens de Confirmação Posterior (manualConfirmation: true + callbackURL)

Duas compras simples em trechos onde manualConfirmation = true, retornando status in_confirmation_process e mantendo ambas pendentes (não canceladas) para aprovação/cancelamento via callbackURL pela equipe Quero Passagem.

### Execução 3.1 (Compra #1) — Pedido `#99020312` (`status: in_confirmation_process`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T17:45:49.748Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `8e92513df2c142ac6bc21958be0d350f`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_08ade04b59cb224ccb43cc0cc6013836",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "06",
          "birthDate": "1990-05-15",
          "cpf": "01234567890"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "8e92513df2c142ac6bc21958be0d350f",
  "expiresAt": "2026-11-05T14:55:49-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 100
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 50
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 33.33
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 25
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 20
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 16.67
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100.02
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 14.29
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100.03
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 12.5
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 11.11
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 10
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 9.09
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 8.33
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.96
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 100
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      }
    ]
  },
  "travels": [
    {
      "id": "1_0c803d607181a293895d427088b069c5",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "06",
          "birthDate": "1990-05-15",
          "cpf": "012.345.678-90",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-18 16:00:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T17:46:09.068Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020312`
- **Status Retornado:** `in_confirmation_process`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "8e92513df2c142ac6bc21958be0d350f",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "012.345.678-90",
    "phone": "(41) 3281-1153"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-3_1-1793900763138"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020312,
  "externalId": "NCT-3_1-1793900763138",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 100,
    "tax": 0,
    "insurance": 0,
    "tickets": 100,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "in_confirmation_process",
  "date": "2026-11-05 14:46:04",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_2501",
        "label": "Rio de Janeiro, RJ - Barra da Tijuca (Terminal Alvorada)",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-18",
        "time": "19:00:00"
      },
      "arrival": {
        "date": "2026-11-18",
        "time": "22:20:00"
      },
      "company": {
        "id": "156",
        "name": "LiraBus"
      },
      "passengers": [
        {
          "id": 946957,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "6",
          "seatClass": "EXECUTIVO ",
          "bpe": "",
          "ticket": "",
          "state": "processing",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-18 16:00:00"
    }
  ]
}
```

---

### Execução 3.1 (Compra #2) — Pedido `#99020362` (`status: in_confirmation_process`)

#### 1. Pré-Reserva (`POST /new/booking`) — HTTP 200
- **Timestamp:** `2026-11-05T20:16:17.380Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/booking`
- **Booking ID Gerado:** `9f0d13e8db78625957746c34cbe11d0f`

**Request (`POST /new/booking`):**
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_912978045ff6b0b41a1a2c932342eb78",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "31",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    }
  ]
}
```

**Response (`POST /new/booking`):**
```json
{
  "id": "9f0d13e8db78625957746c34cbe11d0f",
  "expiresAt": "2026-11-05T17:26:16-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 100
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 50
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 33.33
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 25
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 20
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 16.67
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100.02
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 14.29
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100.03
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 12.5
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 11.11
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 10
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 9.09
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.99
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 8.33
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 99.96
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 100
        },
        "seatPrice": 100,
        "taxPrice": 0,
        "insurancePrice": 0,
        "total": 100
      }
    ]
  },
  "travels": [
    {
      "id": "1_db498a84a4f2d20a155c81b84380a1f7",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "31",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-13 21:30:00",
            "allowed": true,
            "fee": 5
          }
        }
      ]
    }
  ]
}
```

#### 2. Finalização da Compra (`POST /new/checkout`) — HTTP 200
- **Timestamp:** `2026-11-05T20:16:28.290Z`
- **Endpoint:** `POST https://queropassagem.qpdevs.com/ws_v4/new/checkout`
- **Order ID Gerado:** `#99020362`
- **Status Retornado:** `in_confirmation_process`

**Request (`POST /new/checkout`):**
```json
{
  "bookingId": "9f0d13e8db78625957746c34cbe11d0f",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
    "phone": "(41) 3281-1167"
  },
  "payment": {
    "method": "creditCard",
    "cardNumber": "4111 1111 1111 1111",
    "holder": "NC TURISMO TESTE",
    "expiresAt": "2030-10",
    "securityCode": "123",
    "installment": 1
  },
  "externalId": "NCT-3_1-1793909783751",
  "callbackURL": "https://ais-dev-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback"
}
```

**Response (`POST /new/checkout`):**
```json
{
  "id": 99020362,
  "externalId": "NCT-3_1-1793909783751",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 100,
    "tax": 0,
    "insurance": 0,
    "tickets": 100,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "in_confirmation_process",
  "date": "2026-11-05 17:16:25",
  "travels": [
    {
      "from": {
        "id": "ROD_53",
        "label": "Curitiba, PR",
        "customName": null,
        "customAddress": "Rua sem fim 1001"
      },
      "to": {
        "id": "ROD_3520",
        "label": "PERDIZES, MG",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-14",
        "time": "00:30:00"
      },
      "arrival": {
        "date": "2026-11-14",
        "time": "07:10:00"
      },
      "company": {
        "id": "2",
        "name": "1001"
      },
      "passengers": [
        {
          "id": 947050,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "31",
          "seatClass": "SEMI LEITO",
          "bpe": "",
          "ticket": "",
          "state": "processing",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1990-05-15",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 5
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-13 21:30:00"
    }
  ]
}
```

---
