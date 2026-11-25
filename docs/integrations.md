# Optionale Integrationen

Phase 6 stellt framework-unabhängige Adapter bereit. Sie starten bewusst keinen Netzwerkserver, öffnen keine Ports und benötigen keine Zugangsdaten. Ein späterer Host kann die Adapter in eine Node-, Serverless- oder MCP-Laufzeit einbinden.

## REST-Vertrag

`handleRestRequest` aus `src/adapters/rest.ts` akzeptiert ein kleines transportneutrales Request-Objekt und liefert Status, JSON-Header und Body. Die Host-Anwendung bleibt für HTTP-Parsing, Größenlimits, Rate Limiting, CORS, Authentifizierung und Logging verantwortlich.

Unterstützte Routen:

| Methode | Pfad                        | Ergebnisquelle                   |
| ------- | --------------------------- | -------------------------------- |
| `GET`   | `/v1/health`                | Adapterstatus                    |
| `POST`  | `/v1/loans/calculate`       | `calculateLoan`                  |
| `POST`  | `/v1/loans/extra-repayment` | `simulateExtraRepayment`         |
| `POST`  | `/v1/knowledge/search`      | geprüfter lokaler Wissenskatalog |

Beispiel für eine Berechnung:

```ts
import { handleRestRequest } from './src/adapters';

const response = handleRestRequest({
  method: 'POST',
  path: '/v1/loans/calculate',
  body: {
    principal: 30000,
    annualEffectiveRate: 0.07,
    durationMonths: 60,
  },
});
```

Erfolgreiche Finanzantworten tragen `source: "fintrace-engine"`. Ungültige Typen oder Engine-Grenzen liefern einen `400`-Fehler; der Adapter schätzt oder korrigiert keine Eingaben.

## MCP-Vertrag

`FINTRACE_MCP_TOOLS` veröffentlicht drei JSON-Schema-basierte Tooldefinitionen:

- `calculate_loan`
- `simulate_extra_repayment`
- `search_fintrace_knowledge`

`callFinTraceTool` führt diese Tools transportneutral aus. Finanztools verwenden intern denselben REST-Adapter und damit ausschließlich den Rechenkern. Erfolgreiche Aufrufe liefern identische Daten als Text- und `structuredContent`-Block; Fehler setzen `isError`.

Ein realer MCP-Server muss zusätzlich Protokolltransport, Initialisierung, Capability Negotiation und Lifecycle implementieren. Diese Infrastruktur ist absichtlich nicht Teil des Frontend-Projekts.

## Lokale dokumentengestützte Suche

`searchKnowledge` durchsucht einen kleinen, geprüften Katalog zu Berechnungsmethode, Sondertilgung, Disclaimer und verifizierten Erklärungen. Jeder Treffer enthält:

- stabile Dokument-ID;
- Titel und geprüften Textauszug;
- Repository-Quellpfad;
- transparenten lexikalischen Score.

Die Suche verwendet weder Embeddings noch ein Sprachmodell und erzeugt keine Finanzwerte. Sie ist eine reproduzierbare Retrieval-Basis, kein vollständiges produktives RAG-System. Ein späterer Generator darf Treffer nur als zitierte Erklärungskontexte verwenden; berechnete Zahlen müssen weiterhin aus `src/engine` stammen.

## Sicherheitsgrenzen

- Keine Zugangsdaten im Browser oder Adaptercode.
- Keine Live-Finanzdaten oder externen Kreditangebote.
- Keine automatische Beratung oder Vertragsbewertung.
- Keine Persistenz personenbezogener Eingaben.
- Keine stillschweigende Änderung der dokumentierten Finanzannahmen.
