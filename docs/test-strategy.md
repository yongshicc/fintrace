# Teststrategie

## Ziel

Die Teststrategie schützt zuerst finanzielle Korrektheit und Herkunft, danach Integrationsverträge und sichtbare Nutzerpfade. Ein grüner Produktions-Build allein gilt nicht als ausreichender Nachweis.

## Testpyramide

| Ebene                  | Werkzeuge                    | Schwerpunkt                                                                           |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| Rechenkern             | Vitest                       | Formeln, Nullzins, Eingabegrenzen, Tilgungsinvarianten, Sondertilgung, Szenariolimits |
| Öffentliche Referenzen | Node-Skript                  | auf Cent gerundeter Vergleich mit dokumentierten Beispielwerten                       |
| React-Integration      | Testing Library              | bestätigte Eingaben, Ergebnisupdate, Szenarioübernahme, Recorded Assistant            |
| Adapter                | Vitest                       | REST-/MCP-Gleichheit mit Engine, Fehlerverträge, Quellen und Retrieval-Ranking        |
| Browser-Smoke          | Playwright                   | kritischer Desktop-/Mobile-Pfad, sichtbare Zustandsänderung, horizontaler Overflow    |
| Statische Qualität     | TypeScript, ESLint, Prettier | Typgrenzen, Hooks-Regeln, konsistenter Quelltext                                      |
| Artefakt               | Vite Build                   | reproduzierbarer Produktions-Build und Pages-Basispfad                                |

## Kritische Invarianten

- Monatsrate, Gesamtzins und Gesamtrückzahlung stammen aus `calculateLoan`.
- Ein Tilgungsplan endet innerhalb der dokumentierten Toleranz bei null und erzeugt keine negative Restschuld.
- Sondertilgung überschreitet die offene Restschuld nicht.
- REST und MCP liefern dieselben Engine-Ergebnisse, nicht neu berechnete Adapterwerte.
- Recorded Assistant zeigt nur vorhandene Engine-Felder; ohne Alternativszenario nennt er keine Ersparnis.
- Retrieval-Treffer besitzen stabile IDs und Repository-Quellpfade.

## Lokale Ausführung

```bash
npm test
npm run verify:references
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

Vor dem ersten E2E-Lauf:

```bash
npx playwright install chromium
```

## CI-Verhalten

Der Quality-Workflow verwendet Node.js 22, installiert Abhängigkeiten mit `npm ci`, lädt Chromium und führt alle Qualitätsbefehle aus. Playwright-Artefakte werden nur bei einem Fehler für sieben Tage hochgeladen. Die Pages-Bereitstellung auf `main` wird erst nach einem erfolgreichen Quality-Lauf gestartet.

## Bewusste Lücken

- keine Firefox- oder WebKit-Matrix;
- keine Mutation Tests;
- keine automatisierte vollständige WCAG-Prüfung;
- keine Last-, Soak- oder Web-Vitals-Baseline;
- keine produktive REST-/MCP-Transportprüfung;
- keine Tests realer Kreditverträge oder regulatorischer Regeln.

Diese Lücken werden dokumentiert, nicht durch unbelegte Qualitätsaussagen ersetzt.

## Freigabekriterium

Eine Änderung gilt erst als technisch geprüft, wenn alle für ihren Scope relevanten Befehle tatsächlich ausgeführt wurden. Änderungen an Engine-Annahmen erfordern zusätzlich aktualisierte Methodendokumentation, Referenzfälle und eine explizite fachliche Prüfung; ein grüner Testlauf allein ist dafür nicht ausreichend.
