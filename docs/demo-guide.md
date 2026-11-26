# Demo-Guide

## Ziel

Dieser Ablauf zeigt in ungefähr fünf Minuten Produktwert, technische Trennung und bekannte Grenzen. Er setzt die lokal gestartete Anwendung voraus:

```bash
npm install
npm run dev
```

Alternativ steht die credential-freie [öffentliche Live-Demo](https://yongshicc.github.io/fintrace/) bereit.

## 1. Herkunft statt Black Box

Öffne das Repayment Studio mit den Standardwerten. Zeige Monatsrate, Gesamtrückzahlung und Gesamtzinsen sowie die Herkunftszeile direkt darunter.

**Kernaussage:** Die Werte stammen aus dem deterministischen FinTrace-Rechenkern, nicht aus React oder einem Sprachmodell.

## 2. Bestätigte Simulation

Ändere den Kreditbetrag auf `12000`, den effektiven Jahreszins auf `0` und die Laufzeit auf `24`. Deaktiviere die Sondertilgung und wähle „Simulation aktualisieren“.

Erwartete sichtbare Ergebnisse:

- Monatsrate: `€ 500,00`;
- Gesamtrückzahlung: `€ 12.000,00`;
- Gesamtzinsen: `€ 0,00`.

**Kernaussage:** Der Nullzins-Pfad ist explizit implementiert und getestet; unfertige Formulareingaben werden erst nach Bestätigung übernommen.

## 3. Zinssensitivität

Stelle die Standardwerte wieder her oder lade die Seite neu. Wähle im Interest Range Explorer das 9-%-Szenario.

Prüfe, dass der effektive Jahreszins im Hauptformular auf `9` wechselt und Ergebnisse sowie Diagramme aktualisiert werden.

**Kernaussage:** Der Explorer prognostiziert keinen Markt. Er visualisiert deterministisch, wie derselbe Kredit unter anderen Zinssätzen aussieht.

## 4. Sondertilgung verstehen

Öffne im FinTrace Assistenten „Was bringt die Sondertilgung?“.

Zeige unter den Fakten die Quellen:

- `ExtraRepaymentResult.interestSavings`;
- `ExtraRepaymentResult.alternativeInterest`;
- `ExtraRepaymentResult.monthsSaved`.

**Kernaussage:** Der Text ist vorab geprüft. Finanzwerte werden unverändert aus der Engine übernommen und der Modus ist sichtbar als „keine Live-KI“ gekennzeichnet.

## 5. Mobile Nachvollziehbarkeit

Wechsle auf einen kleinen mobilen Viewport. Öffne eine Monatszeile im Tilgungsplan.

Zeige Anfangssaldo, Rate, Zins, Tilgung und gegebenenfalls Sondertilgung ohne horizontales Scrollen.

**Kernaussage:** Die mobile Ansicht reduziert keine Finanzdaten, sondern ändert ihre semantische Darstellung.

## 6. Engineering-Nachweis

Im Repository:

1. `src/engine` als einzige Berechnungsschicht zeigen.
2. `tests/engine` und `tests/fixtures/public-reference-cases.ts` öffnen.
3. `src/adapters` als delegierende REST-/MCP-Grenze zeigen.
4. `.github/workflows/ci.yml` als Quality Gate zeigen.

Optional die komplette Prüfung ausführen:

```bash
npm test
npm run verify:references
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

## Abschluss und Grenzen

FinTrace ist ein Bildungsprototyp, keine Kreditberatung. Das Modell enthält keine Gebühren, Versicherungen, variablen Zinsen oder vertragsspezifischen Rundungsregeln. REST und MCP sind getestete Adapterverträge, aber kein öffentlich laufender Produktionsserver.
