# Dossiê de Resolução de Pendências — Homologação Quero Passagem (ws_v4)
**NC Turismo** · Afiliado: `NCT`
Data da Reexecução: `2026-11-16T17:02:19.535Z`
Ambiente: `https://queropassagem.qpdevs.com/ws_v4`
Endpoint de Callback: `https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback`

---

## 📊 Resumo Executivo das Pendências Corrigidas

| Cenário | Pedido (`orderId`) | `bookingId` | Status Retornado | Trechos / Conexão | Passageiros / Seguro | Viação | Callback URL Enviada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.4** | **#99020686** | `f9a5b5669592e1052085b5e7f00467ca` | `paid` | 2 trechos (Ida + Volta) | 2 pax (1 c/ seguro, 1 s/ seguro) | Progresso + Progresso | N/A (confirmação imediata) |
| **3.1 (Compra #1)** | **#99020687** | `8c615ac24ced706d78b15825970212bb` | `in_confirmation_process` | 1 trecho (ROD_55 → CIT_1) | 1 pax (manualConfirmation: true) | 1001 | `https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback` |
| **3.1 (Compra #2)** | **#99020688** | `9f111be1683182ed363c2d95af015997` | `in_confirmation_process` | 1 trecho (ROD_55 → CIT_1) | 1 pax (manualConfirmation: true) | LiraBus | `https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback` |

> **Nota Operacional sobre o Cenário 3.1:**
> Ambos os pedidos (**#99020687** e **#99020688**) retornaram status `in_confirmation_process` com a `callbackURL` configurada no payload root de checkout. **Nenhum endpoint de cancelamento foi acionado**, mantendo as reservas ativas para aprovação ou cancelamento pela equipe técnica da Quero Passagem.

---

## 1. Cenário 1.4 — Compra Simples: Ida e Volta com 2 Passageiros (1 com Seguro e 1 sem Seguro)

- **Regra:** Compra de ida e volta (2 trechos no array `travels`) para 2 passageiros simultâneos onde exatamente 1 passageiro possui seguro (`insurance`) com `cpf`, `bithDate` e `cep`, e 1 passageiro não possui seguro.
- **Trecho de Ida:** Rio de Janeiro, RJ (Novo Rio [ROD_55]) → São Paulo, SP (Tietê [CIT_1]) (Progresso) · Partida: `2026-11-22 01:00:00` · Poltronas: `10, 20`
- **Trecho de Volta:** São Paulo, SP (Tietê [CIT_1]) → Rio de Janeiro, RJ (Novo Rio [ROD_55]) (Progresso) · Partida: `2026-11-24 01:00:00` · Poltronas: `10, 20`
- **Order ID Gerado:** `#99020686`
- **Status Retornado:** `paid`

### 1.1 Pré-Reserva (`POST /new/booking`)
- **Booking ID:** `f9a5b5669592e1052085b5e7f00467ca`

#### Request Payload:
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_e0aeb791a1f72dbf6163adb380800bdc",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "52998224725",
          "insurance": {
            "cpf": "52998224725",
            "bithDate": "1988-03-12",
            "birthDate": "1988-03-12",
            "cep": "80010-000"
          }
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
      "travelId": "1_8fc9829a6dc064166460dde2bf0eef27",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "52998224725",
          "insurance": {
            "cpf": "52998224725",
            "bithDate": "1988-03-12",
            "birthDate": "1988-03-12",
            "cep": "80010-000"
          }
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

#### Response Payload:
```json
{
  "id": "f9a5b5669592e1052085b5e7f00467ca",
  "expiresAt": "2026-11-16T14:13:04-03:00",
  "paymentMethods": {
    "creditCard": [
      {
        "instalment": {
          "instalments": 1,
          "value": 169.68
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 2,
          "value": 84.84
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 3,
          "value": 56.56
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 4,
          "value": 42.42
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 5,
          "value": 33.94
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.7
      },
      {
        "instalment": {
          "instalments": 6,
          "value": 28.28
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 7,
          "value": 24.24
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 8,
          "value": 21.21
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      },
      {
        "instalment": {
          "instalments": 9,
          "value": 18.85
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.65
      },
      {
        "instalment": {
          "instalments": 10,
          "value": 16.97
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.7
      },
      {
        "instalment": {
          "instalments": 11,
          "value": 15.43
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.73
      },
      {
        "instalment": {
          "instalments": 12,
          "value": 14.14
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      }
    ],
    "pix": [
      {
        "instalment": {
          "instalments": 1,
          "value": 169.68
        },
        "seatPrice": 149.78,
        "taxPrice": 0,
        "insurancePrice": 19.9,
        "total": 169.68
      }
    ]
  },
  "travels": [
    {
      "id": "1_22781158214785ab3beaf5f3d177e4d5",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "529.982.247-25",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "12/03/1988",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-21 22:00:00",
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
            "limitDate": "2026-11-21 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    },
    {
      "id": "1_d21116d62c51d5920e7cc6da6a9b227f",
      "passengers": [
        {
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "birthDate": "1988-03-12",
          "cpf": "529.982.247-25",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "12/03/1988",
            "cep": "02030-000"
          },
          "cancellation": {
            "limitDate": "2026-11-23 22:00:00",
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
            "limitDate": "2026-11-23 22:00:00",
            "allowed": false,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

### 1.2 Checkout (`POST /new/checkout`)

#### Request Payload:
```json
{
  "bookingId": "f9a5b5669592e1052085b5e7f00467ca",
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
  "externalId": "NCT-1_4-1794848587875"
}
```

#### Response Payload:
```json
{
  "id": 99020686,
  "externalId": "NCT-1_4-1794848587875",
  "email": "homologacao@ncturismo.com.br",
  "buyer": {
    "name": "NC Turismo Homologacao"
  },
  "payment": {
    "total": 169.68,
    "tax": 0,
    "insurance": 19.9,
    "tickets": 149.78,
    "discount": 0,
    "method": "creditCard",
    "refunded": 0,
    "installment": 1,
    "toll": 0,
    "authorizationCode": "145803"
  },
  "status": "paid",
  "date": "2026-11-16 14:03:09",
  "travels": [
    {
      "from": {
        "id": "ROD_55",
        "label": "Rio de Janeiro, RJ - Novo Rio",
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
        "date": "2026-11-22",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-22",
        "time": "10:30:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947605,
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947605/f705f4b485d38baa00beb16a6743f8d3",
          "ticket": "2B1CBA",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1988-03-12",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "1988-03-12",
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
          "id": 947606,
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947606/4305ae338a498f2171c4c45376cf604c",
          "ticket": "16B0C6",
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
      "travelCancellationLimitDate": "2026-11-21 22:00:00"
    },
    {
      "from": {
        "id": "ROD_1",
        "label": "São Paulo - Tietê NEW IBE",
        "customName": null,
        "customAddress": null
      },
      "to": {
        "id": "ROD_55",
        "label": "Rio de Janeiro, RJ - Novo Rio",
        "customName": null,
        "customAddress": null
      },
      "departure": {
        "date": "2026-11-24",
        "time": "01:00:00"
      },
      "arrival": {
        "date": "2026-11-24",
        "time": "10:30:00"
      },
      "company": {
        "id": "33",
        "name": "Progresso"
      },
      "passengers": [
        {
          "id": 947607,
          "name": "Carlos Eduardo Mendes Teste",
          "travelDocument": "44556671",
          "travelDocumentType": "RG",
          "seatNumber": "10",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947607/a3badcc26e85f85eabb46e778360a2b2",
          "ticket": "7F7D2D",
          "state": "emitted",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1988-03-12",
          "insurance": {
            "cpf": "529.982.247-25",
            "birthDate": "1988-03-12",
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
          "id": 947608,
          "name": "Fernanda Lima Costa Teste",
          "travelDocument": "55667782",
          "travelDocumentType": "RG",
          "seatNumber": "20",
          "seatClass": "EXECUTIVO ",
          "bpe": "https://queropassagem.qpdevs.com//bilhete-eletronico/947608/8c4914b934281ebde1713753eaad938e",
          "ticket": "25226D",
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
      "travelCancellationLimitDate": "2026-11-23 22:00:00"
    }
  ]
}
```

---

## 2. Cenário 3.1 — Compras com Confirmação Posterior (`manualConfirmation: true` + `callbackURL`)

Duas compras simples completas em viagens de confirmação posterior com a propriedade `callbackURL` informada no root do payload de checkout. Ambas mantidas pendentes (`in_confirmation_process`).

### 2.1 Compra #1 — Pedido `#99020687` (`status: in_confirmation_process`)
- **Viação:** 1001 · Trecho: Rio de Janeiro, RJ (Novo Rio [ROD_55]) → São Paulo, SP (Tietê [CIT_1])
- **Data/Hora:** `2026-11-22 00:30:00` · Poltrona: `02`
- **Booking ID:** `8c615ac24ced706d78b15825970212bb`

#### Request `POST /new/booking`:
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_476459e8e21ec863d3ccb7a33d0be330",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "02",
          "birthDate": "1990-05-15",
          "cpf": "52998224725"
        }
      ]
    }
  ]
}
```

#### Response `POST /new/booking`:
```json
{
  "id": "8c615ac24ced706d78b15825970212bb",
  "expiresAt": "2026-11-16T14:13:24-03:00",
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
      "id": "1_3d8356b74c45d0e8d3499b1958a66eab",
      "passengers": [
        {
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "02",
          "birthDate": "1990-05-15",
          "cpf": "529.982.247-25",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-21 21:30:00",
            "allowed": true,
            "fee": 5
          }
        }
      ]
    }
  ]
}
```

#### Request `POST /new/checkout` (com `callbackURL`):
```json
{
  "bookingId": "8c615ac24ced706d78b15825970212bb",
  "email": "homologacao@ncturismo.com.br",
  "callbackURL": "https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "52998224725",
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
  "externalId": "NCT-3_1-1-1794848606960"
}
```

#### Response `POST /new/checkout`:
```json
{
  "id": 99020687,
  "externalId": "NCT-3_1-1-1794848606960",
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
  "date": "2026-11-16 14:03:27",
  "travels": [
    {
      "from": {
        "id": "ROD_55",
        "label": "Rio de Janeiro, RJ - Novo Rio",
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
        "date": "2026-11-22",
        "time": "00:30:00"
      },
      "arrival": {
        "date": "2026-11-22",
        "time": "10:00:00"
      },
      "company": {
        "id": "2",
        "name": "1001"
      },
      "passengers": [
        {
          "id": 947609,
          "name": "Joao Carlos Silva Teste",
          "travelDocument": "123456789",
          "travelDocumentType": "RG",
          "seatNumber": "2",
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
      "travelCancellationLimitDate": "2026-11-21 21:30:00"
    }
  ]
}
```

---

### 2.2 Compra #2 — Pedido `#99020688` (`status: in_confirmation_process`)
- **Viação:** LiraBus · Trecho: Rio de Janeiro, RJ (Novo Rio [ROD_55]) → São Paulo, SP (Tietê [CIT_1])
- **Data/Hora:** `2026-11-22 01:30:00` · Poltrona: `02`
- **Booking ID:** `9f111be1683182ed363c2d95af015997`

#### Request `POST /new/booking`:
```json
{
  "affiliateCode": "NCT",
  "travels": [
    {
      "travelId": "1_77a9d62500519ed67081e5d29b95f34b",
      "passengers": [
        {
          "name": "Mariana Ribeiro Alves Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "02",
          "birthDate": "1992-11-20",
          "cpf": "39053344705"
        }
      ]
    }
  ]
}
```

#### Response `POST /new/booking`:
```json
{
  "id": "9f111be1683182ed363c2d95af015997",
  "expiresAt": "2026-11-16T14:13:35-03:00",
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
      "id": "1_6df801b4d92cf2a0f3e6ac68152d09aa",
      "passengers": [
        {
          "name": "Mariana Ribeiro Alves Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "02",
          "birthDate": "1992-11-20",
          "cpf": "390.533.447-05",
          "insurance": false,
          "cancellation": {
            "limitDate": "2026-11-21 22:30:00",
            "allowed": true,
            "fee": 0
          }
        }
      ]
    }
  ]
}
```

#### Request `POST /new/checkout` (com `callbackURL`):
```json
{
  "bookingId": "9f111be1683182ed363c2d95af015997",
  "email": "homologacao@ncturismo.com.br",
  "callbackURL": "https://ais-pre-xw33vky72lvznb4lx4uf7w-56607652372.us-west2.run.app/api/rodoviario/callback",
  "buyer": {
    "name": "NC Turismo Homologacao",
    "cpf": "39053344705",
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
  "externalId": "NCT-3_1-2-1794848617817"
}
```

#### Response `POST /new/checkout`:
```json
{
  "id": 99020688,
  "externalId": "NCT-3_1-2-1794848617817",
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
  "date": "2026-11-16 14:03:38",
  "travels": [
    {
      "from": {
        "id": "ROD_55",
        "label": "Rio de Janeiro, RJ - Novo Rio",
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
        "date": "2026-11-22",
        "time": "01:30:00"
      },
      "arrival": {
        "date": "2026-11-22",
        "time": "11:00:00"
      },
      "company": {
        "id": "156",
        "name": "LiraBus"
      },
      "passengers": [
        {
          "id": 947610,
          "name": "Mariana Ribeiro Alves Teste",
          "travelDocument": "987654321",
          "travelDocumentType": "RG",
          "seatNumber": "2",
          "seatClass": "LEITO CAMA",
          "bpe": "",
          "ticket": "",
          "state": "processing",
          "canceled_by": null,
          "modifiable": false,
          "birthDate": "1992-11-20",
          "insurance": null,
          "cancellation": {
            "allowed": false,
            "fee": 0
          }
        }
      ],
      "travelCancellationLimitDate": "2026-11-21 22:30:00"
    }
  ]
}
```
