# Roadmap

- [x] Phase 0: Repository-Initialisierung
- [x] Phase 1: Deterministischer Rechenkern
- [x] Phase 2: Interaktives Repayment Studio
- [x] Phase 3: Interest Range Explorer und Mobile UX
- [x] Phase 4: Tests, CI und öffentliche Bereitstellung
- [x] Phase 5: Verifizierter KI-Assistent im aufgezeichneten Modus
- [x] Phase 6: Optionale REST-API, MCP und RAG
- [x] Phase 7: Engineering-Portfolio-Dokumentation

## Phase 2: umgesetzt

Das responsive Repayment Studio verwendet den bestehenden Rechenkern ausschließlich über seine öffentliche Schnittstelle. Es enthält barrierearme Eingaben, eine Ergebniszusammenfassung mit Herkunftsnachweis, einen Recharts-basierten Tilgungsverlauf, den Vergleich von Basis und Sondertilgung sowie einen mobilen Tilgungsplanauszug. Finanzformeln bleiben vollständig in `src/engine`.

## Phase 3: umgesetzt

Der Interest Range Explorer erzeugt deterministische Zinsszenarien über die Engine, visualisiert Monatsraten und erlaubt die direkte Übernahme eines Szenarios. Auf Mobilgeräten ersetzt eine aufklappbare Monatsansicht die breite Tilgungstabelle. Fokuszustände, Touch-Ziele, native Eingaben und semantische Strukturen wurden weiter verfeinert.

## Phase 4: umgesetzt

GitHub Actions prüft Unit-, Integrations- und Browser-Smoke-Tests, öffentliche Referenzfälle, TypeScript, ESLint, Prettier und den Produktions-Build. Desktop-Chromium und ein mobiles Chromium-Profil decken den wichtigsten Studio-Pfad ab. Nach einem erfolgreichen Quality-Lauf auf `main` kann ein statischer, credential-freier GitHub-Pages-Build veröffentlicht werden.

## Phase 5: umgesetzt

Der FinTrace Assistent bietet drei vorab geprüfte Erklärpfade für Monatsrate, Gesamtzinsen und Sondertilgung. Jede dargestellte Zahl stammt aus einem typisierten Engine-Ergebnis und nennt das konkrete Quellfeld. Der Modus ist sichtbar als aufgezeichnete Demo ohne Live-KI gekennzeichnet, zeigt Modellgrenzen und funktioniert ohne API-Zugangsdaten.

## Phase 6: umgesetzt

Framework-unabhängige Adapter stellen versionierte REST-Routen, drei MCP-Toolverträge und eine lokale dokumentengestützte Suche bereit. Finanzantworten werden ausschließlich durch die bestehende Engine erzeugt. Retrieval-Treffer verweisen auf geprüfte Repository-Dokumente; es gibt keine Live-KI, keine Embeddings, keine Persistenz und keine Client-Zugangsdaten.

## Phase 7: umgesetzt

Ein technisches Review-Paket dokumentiert Problem, Systemgrenzen, Architekturentscheidungen, Trade-offs, Teststrategie, Accessibility, Sicherheit, bekannte Lücken und einen reproduzierbaren Demo-Ablauf. Reviewer erhalten kurze Einstiegspfade zu Rechenkern, Recorded Assistant, Adaptern und CI-Nachweisen.

## Projektstatus

Die geplanten Phasen 0 bis 7 sind abgeschlossen. Weitere Arbeit sollte nicht als neue Phase fortgeschrieben werden, sondern aus konkretem Review-Feedback, fachlicher Modellprüfung, Accessibility-Audit oder einem realen Hosting-Ziel entstehen.
