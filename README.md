# FinTrace — Traceable Financial Intelligence

**Jede Zahl hat einen Ursprung.**

FinTrace ist ein unabhängiges Engineering-Portfolio-Projekt für transparente Kreditberechnungen. Das Produkt macht nicht nur Ergebnisse sichtbar, sondern auch deren Herkunft, Annahmen und Rechenweg.

> Kredite verstehen. Nicht nur vergleichen.

## Status

Phase 0 bis Phase 7 sind umgesetzt. FinTrace umfasst einen deterministischen Rechenkern, ein responsives Repayment Studio, Zinsszenarien, einen verifizierten Recorded Assistant, automatisierte Qualitäts- und Bereitstellungsprozesse, optionale REST-/MCP-/Retrieval-Adapter sowie ein vollständiges technisches Review-Paket.

Für einen schnellen technischen Einstieg:

1. [Engineering-Portfolio](docs/engineering-portfolio.md)
2. [5-Minuten-Demo](docs/demo-guide.md)
3. [Architekturentscheidungen](docs/decisions.md)
4. [Teststrategie](docs/test-strategy.md)

## Lokale Entwicklung

Voraussetzung: Node.js 22 und npm 10 oder kompatible neuere Versionen.

```bash
npm install
npm run dev
```

Qualitätsprüfung:

```bash
npm test
npm run test:e2e
npm run verify:references
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Der erste lokale Browser-Test benötigt einmalig Chromium:

```bash
npx playwright install chromium
```

## CI und öffentliche Bereitstellung

`.github/workflows/ci.yml` führt für jeden Push und Pull Request Tests, Referenzprüfung, Typecheck, Linting, Formatprüfung, Build und Browser-Smoke-Tests aus. Nach einem erfolgreichen Quality-Lauf auf `main` erstellt `.github/workflows/deploy-pages.yml` eine statische GitHub-Pages-Ausgabe. Alternativ lässt sich die Bereitstellung manuell starten.

Im GitHub-Repository muss unter **Settings → Pages → Build and deployment** einmalig **GitHub Actions** als Quelle gewählt werden. Die Veröffentlichung verwendet ausschließlich GitHub-OIDC und benötigt keine bezahlten API-Zugangsdaten oder Client-Secrets.

## Architektur

Alle Finanzlogik liegt in `src/engine`. Die Funktionen sind rein, strikt typisiert und unabhängig von React. UI-Code darf keine Finanzformeln duplizieren. Intern wird mit voller JavaScript-`number`-Präzision gerechnet; Rundung erfolgt erst in der Darstellung.

Weitere Details:

- [Architektur](docs/architecture.md)
- [Engineering-Portfolio](docs/engineering-portfolio.md)
- [Architekturentscheidungen](docs/decisions.md)
- [Berechnungsmethode](docs/calculation-method.de.md)
- [Teststrategie](docs/test-strategy.md)
- [Demo-Guide](docs/demo-guide.md)
- [Produktkonzept](docs/product-concept.de.md)
- [Roadmap](docs/roadmap.md)
- [Optionale Integrationen](docs/integrations.md)
- [KI-Entwicklungslog](docs/ai-development-log.md)

## KI-Prinzip

**KI erklärt. Der Rechner rechnet.** Finanzielle Zahlen entstehen ausschließlich im deterministischen Rechenkern, niemals in einem Sprachmodell.

Der aktuelle Assistent ist eine öffentliche Recorded Demo: Er verwendet vorab geprüfte Erklärungstexte und zeigt ausschließlich Werte aus typisierten Engine-Ergebnissen. Es findet kein Live-Aufruf eines Sprachmodells statt.

## Disclaimer

FinTrace ist ein unabhängiges Portfolio-Projekt zur Simulation von Kreditkosten. Keine Kreditberatung und kein Kreditangebot. Es besteht keine Verbindung zu CHECK24.

## Lizenz

[MIT](LICENSE)
