# Architektur

## Zielbild

FinTrace trennt deterministische Finanzberechnung strikt von Darstellung und künftigen erklärenden KI-Funktionen.

```text
UI / Features → src/engine → typisierte Ergebnisse
Recorded-Erklärung → nur verifizierte Engine-Ergebnisse
REST / MCP       → src/adapters → src/engine
Lokale Suche     → geprüfter Wissenskatalog mit Quellen
```

## Rechenkern

`src/engine` ist die einzige Quelle finanzieller Werte:

- `types.ts`: öffentliche Ein- und Ausgabetypen
- `validation.ts`: zentrale Eingabevalidierung
- `calculateLoan.ts`: Monatszins, Rate, Gesamtzins und Gesamtbetrag
- `amortization.ts`: monatlicher Tilgungsplan und Toleranzbehandlung
- `extraPayment.ts`: Vergleich von Original- und Sondertilgungsszenario
- `index.ts`: öffentliche Engine-Schnittstelle

Die Funktionen haben keinen React-, Browser- oder Netzwerkbezug. Dadurch sind sie separat testbar und könnten später in einem REST- oder MCP-Adapter wiederverwendet werden.

## Abgrenzung

Das Projekt enthält keine Persistenz, Authentifizierung, Datenbank, externe Finanz-API oder Live-KI-Integration. Recharts visualisiert ausschließlich typisierte Ergebnisse des Rechenkerns.

## Repayment Studio

`src/features/repayment-studio` kapselt Phase 2. `RepaymentStudio.tsx` verwaltet Entwurfs- und bestätigten Formularzustand und ruft ausschließlich die öffentliche Engine-Schnittstelle auf. Fokussierte Komponenten besitzen Eingabeformular, Kennzahlen, Restschuld-Diagramm, Szenariovergleich und Tilgungsplanauszug. Formatierung bleibt eine reine Darstellungsschicht; finanzielle Formeln werden nicht dupliziert.

## Interest Range Explorer

`src/engine/compareInterestRates.ts` erzeugt eine begrenzte, sortierte Reihe deterministischer Zinsszenarien. Der UI-Explorer visualisiert ausschließlich diese typisierten Ergebnisse und kann einen ausgewählten effektiven Jahreszins an den bestätigten Studio-Zustand zurückgeben. Recharts-Komponenten werden verzögert geladen, damit die Diagrammbibliothek nicht Teil des initialen Haupt-Chunks ist.

## Qualität und Bereitstellung

Vitest prüft Rechenkern und React-Integration. Playwright führt denselben kritischen Nutzerpfad in Desktop- und Mobile-Chromium aus und kontrolliert auf kleinen Viewports zusätzlich horizontales Überlaufen. Die CI wiederholt Referenzprüfung, Typprüfung, Linting, Formatprüfung und Produktions-Build, bevor der GitHub-Pages-Workflow auf `main` ausgelöst wird.

Der Vite-Basispfad wird ausschließlich beim Pages-Build über `VITE_BASE_PATH` gesetzt. Der veröffentlichte Build bleibt statisch und benötigt weder Laufzeit-Backend noch Zugangsdaten.

## Verifizierter Erklärassistent

`recordedExplanations.ts` bildet drei fest definierte Themen auf typisierte `LoanCalculation`- und `ExtraRepaymentResult`-Felder ab. Die Texte berechnen keine Werte und geben für jede dargestellte Zahl den konkreten Feldnamen als Herkunft an. `VerifiedAssistant.tsx` übernimmt ausschließlich Auswahl, Formatierung und barrierearme Darstellung.

Der Modus ist ausdrücklich als „aufgezeichnet · keine Live-KI“ gekennzeichnet. Ohne berechnetes Sondertilgungsszenario wird keine mögliche Ersparnis angezeigt. Damit funktioniert die öffentliche Demo vollständig ohne API-Schlüssel und wahrt die Grenze „KI erklärt. Der Rechner rechnet.“

## Optionale Adapter

`src/adapters` kapselt transportneutrale Integrationsgrenzen:

- `rest.ts` validiert JSON-Strukturen, routet Berechnungen ausschließlich an die öffentliche Engine-Schnittstelle und liefert explizite HTTP-ähnliche Statusobjekte.
- `mcp.ts` veröffentlicht drei kleine Tool-Schemas und verwendet für die Ausführung denselben REST-Adapter, damit keine zweite Berechnungslogik entsteht.
- `knowledge.ts` durchsucht einen statischen, geprüften Wissenskatalog und liefert Repository-Quellpfade sowie transparente lexikalische Scores.

Die Adapter enthalten keinen HTTP- oder MCP-Transport, keine Authentifizierung und keine Persistenz. Diese Host-Verantwortlichkeiten müssen bei einer realen Bereitstellung separat umgesetzt werden. Die lokale Suche verwendet weder Embeddings noch ein Sprachmodell und ist deshalb reproduzierbar sowie credential-frei.
