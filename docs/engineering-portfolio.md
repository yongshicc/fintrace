# FinTrace als Engineering-Portfolio

## Kurzfassung

FinTrace ist ein transparenter Kreditkosten-Simulator und ein Fallbeispiel für eine zentrale Engineering-Frage: Wie lässt sich eine erklärende Produktoberfläche bauen, ohne finanzielle Berechnungen an UI-Code oder ein Sprachmodell zu delegieren?

Die Antwort des Projekts ist eine harte Architekturgrenze:

```text
Eingaben → deterministischer Rechenkern → typisierte Ergebnisse
                                      ↘ UI, Diagramme und Erklärungen
```

Jede finanzielle Zahl entsteht in `src/engine`. React, Recorded Assistant, REST und MCP konsumieren dieselben Ergebnisse. Dadurch bleiben Berechnung, Darstellung und Erklärung separat prüfbar.

## Problem und Produktziel

Kreditrechner zeigen häufig eine Monatsrate, erklären aber weder Herkunft noch Modellgrenzen. FinTrace priorisiert deshalb:

- nachvollziehbare Annahmen statt scheinbarer Vollständigkeit;
- deterministische Ergebnisse statt generierter Finanzwerte;
- Szenarioverständnis statt reiner Angebotsrangliste;
- eine credential-freie öffentliche Demo;
- sichtbare Grenzen statt impliziter Beratung.

Das Ergebnis ist bewusst kein Kreditangebot und kein vollständiges Vertragsmodell.

## Systemüberblick

| Schicht            | Verantwortung                                                               | Darf nicht                                     |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------- |
| `src/engine`       | Validierung, Annuitätenrechnung, Tilgungsplan, Sondertilgung, Zinsszenarien | React, Netzwerk oder generierte Texte kennen   |
| Repayment Studio   | Eingaben, Darstellung, Diagramme, responsive Interaktion                    | Finanzformeln duplizieren                      |
| Recorded Assistant | geprüfte Texte mit Engine-Fakten und Feldquellen verbinden                  | Zahlen erfinden oder freie Beratung simulieren |
| `src/adapters`     | REST-/MCP-Verträge und lokale Dokumentensuche                               | eigene Finanzberechnungen ausführen            |
| Tests und CI       | Invarianten, Referenzwerte, Browserpfade und Build prüfen                   | nicht ausgeführte Qualität behaupten           |

Weitere technische Details stehen in der [Architektur](architecture.md) und der [Berechnungsmethode](calculation-method.de.md).

## Zentrale Engineering-Entscheidungen

### Ein Rechenkern als einzige Zahlenquelle

Der Kern ist React-unabhängig und exportiert kleine, reine Funktionen. Das reduziert Kopplung und erlaubt dieselben Resultate in UI, REST und MCP. Die Kehrseite ist zusätzliche Übersetzungsarbeit an jeder Adaptergrenze; diese wird bewusst akzeptiert, um Finanzlogik nicht zu vervielfachen.

### Volle interne Präzision, Rundung nur in der Darstellung

Tilgungszeilen werden nicht monatlich auf Cent gerundet. So bleibt der Rechenweg konsistent und reproduzierbar. Reale Verträge können andere Buchungsregeln besitzen; diese Abweichung ist dokumentiert und Teil des Disclaimers.

### Recorded Assistant vor Live-KI

Die öffentliche Demo verwendet drei vorab geprüfte Erklärpfade. Jeder Wert nennt sein konkretes Engine-Feld. Das begrenzt die Konversation, verhindert aber unkontrollierte Finanzzahlen, externe Kosten und Secret-Management im Browser.

### Transportneutrale Adapter statt vorgetäuschter Infrastruktur

REST und MCP sind als getestete Handler und Verträge implementiert, nicht als angeblich produktionsreifer Server. Authentifizierung, Rate Limits, Telemetrie und Datenschutz bleiben sichtbare Host-Verantwortung.

Die vollständige Entscheidungsmatrix steht in [Architekturentscheidungen](decisions.md).

## Nachweisbare Qualitätsstrategie

FinTrace kombiniert mehrere Ebenen:

- Engine-Tests für Formeln, Nullzins, Grenzen und Toleranzen;
- Referenzfälle gegen dokumentierte öffentliche Beispielwerte;
- Komponenten-Tests für Formular, Szenarien und Quellenanzeige;
- Adaptertests für Engine-Gleichheit, Fehlerverträge und Retrieval-Quellen;
- Playwright-Smoke-Tests in Desktop- und Mobile-Chromium;
- TypeScript Strict Mode, ESLint, Prettier und Produktions-Build;
- GitHub Actions als wiederholbarer Quality Gate.

Die aktuelle Testanzahl ist kein statisches Marketingversprechen. Maßgeblich ist immer der tatsächlich ausgeführte CI-Lauf. Befehle, Abdeckungsschwerpunkte und bewusste Lücken stehen in der [Teststrategie](test-strategy.md).

## Accessibility und responsive UX

- native Formularfelder mit sichtbaren Labels;
- semantische Überschriften, Tabellen, Definition Lists und `details`;
- Tastaturfokus und ausreichend große Touch-Ziele;
- gezielte Live-Regionen für Ergebnis- und Erklärungswechsel;
- mobile Tilgungsdetails statt horizontal erzwungener Datentabelle;
- Respekt für `prefers-reduced-motion`.

Die Implementierung wurde in einem kleinen mobilen Chromium-Profil sowie Desktop-Chromium geprüft. Eine vollständige WCAG-Konformitätsprüfung durch unabhängige Menschen wurde nicht durchgeführt und wird nicht behauptet.

## Sicherheit und Datenschutz

Die statische Demo speichert keine personenbezogenen Eingaben, enthält keine Client-Secrets und ruft keine Live-Finanz- oder KI-API auf. Adapter lehnen ungültige Typen und unbekannte Felder ab. Für eine produktive Bereitstellung fehlen bewusst:

- Authentifizierung und Autorisierung;
- Request-Größenlimits und Rate Limiting;
- Security Header und explizite CORS-Policy;
- Abuse Monitoring, Audit Logs und Incident-Prozess;
- Datenschutz- und regulatorische Prüfung.

## Performance-Entscheidungen

Recharts wird verzögert geladen, damit die Diagrammbibliothek nicht Teil des initialen Haupt-Chunks ist. Die statische Anwendung benötigt zur Laufzeit kein Backend. Es wurden keine belastbaren Web-Vitals- oder Lasttest-Messungen erhoben; daher nennt das Projekt keine erfundenen Performance-Ziele.

## Bekannte Modellgrenzen

- keine Gebühren, Versicherungen, Steuern oder Verzugsfolgen;
- fixer Zinssatz und monatliche Zahlung;
- keine tagesgenaue Zinsrechnung;
- eine einmalige, gebührenfreie Sondertilgung;
- keine Persistenz, Nutzerkonten oder echten Kreditangebote;
- kein Live-LLM und kein produktiver REST-/MCP-Transport;
- lokale lexikalische Suche statt semantischem Vektor-RAG.

## Fünf-Minuten-Review

1. Mit dem [Demo-Guide](demo-guide.md) den Hauptpfad durchspielen.
2. In `src/engine/calculateLoan.ts` und `src/engine/extraPayment.ts` die Zahlenquelle prüfen.
3. In `VerifiedAssistant.tsx` und `recordedExplanations.ts` die Trennung von Text und Fakten nachvollziehen.
4. In `src/adapters/rest.ts` und `src/adapters/mcp.ts` kontrollieren, dass Adapter nur delegieren.
5. `npm test`, `npm run verify:references` und `npm run test:e2e` ausführen.

## Was ich als Nächstes produktivisieren würde

1. Fachliche Modellprüfung und verbindliche Rundungsregeln mit Domain-Experten.
2. Bedrohungsmodell und Datenschutzkonzept vor jeder Datenspeicherung.
3. Serverseitigen Host mit Authentifizierung, Limits, Telemetrie und versioniertem OpenAPI-Vertrag.
4. Firefox-/WebKit-Matrix, automatisierte Accessibility-Checks und manuelle Screenreader-Prüfung.
5. Messbare Performance-Budgets erst nach reproduzierbarer Web-Vitals-Baseline.

## Reviewer-Navigation

| Interesse               | Einstieg                                       |
| ----------------------- | ---------------------------------------------- |
| Produkt und Scope       | [Produktkonzept](product-concept.de.md)        |
| Mathematik und Annahmen | [Berechnungsmethode](calculation-method.de.md) |
| Systemstruktur          | [Architektur](architecture.md)                 |
| Trade-offs              | [Architekturentscheidungen](decisions.md)      |
| Testbarkeit             | [Teststrategie](test-strategy.md)              |
| Live-Demo               | [Demo-Guide](demo-guide.md)                    |
| REST, MCP und Retrieval | [Optionale Integrationen](integrations.md)     |
| Entwicklungsverlauf     | [KI-Entwicklungslog](ai-development-log.md)    |
