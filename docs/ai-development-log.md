# KI-Entwicklungslog

## Aufgabe

Phase 0 und Phase 1 von FinTrace umsetzen: Repository-Grundlage, Branding, deterministischer Kreditrechenkern, Tilgungsplan, einmalige Sondertilgung, automatisierte Tests und Dokumentation.

## KI-unterstützte Entscheidungen

- Vite, React 19, TypeScript im Strict Mode und Tailwind CSS 4 als schlanke Frontend-Grundlage gewählt.
- Die Finanzlogik als reine TypeScript-Schicht ohne React-Abhängigkeiten umgesetzt.
- Für Zinsumrechnung und Annuitätenformel `log1p`/`expm1` verwendet.
- Eine explizite absolute und relative Restschuld-Toleranz definiert.
- Sondertilgung auf „konstante Rate, kürzere Laufzeit“ begrenzt.
- Einen minimalen Marken-/Status-Screen statt des noch nicht beauftragten vollständigen Frontends erstellt.

## Erwogene Alternativen

- Dezimalbibliothek: für dieses Bildungsmodell nicht gewählt, um Abhängigkeiten gering zu halten; stattdessen volle `number`-Präzision und dokumentierte Toleranzen.
- Cent-Rundung je Monatszeile: verworfen, weil die Aufgabenstellung volle interne Präzision verlangt.
- Senkung der Rate nach Sondertilgung: ausdrücklich außerhalb des Umfangs.
- Vollständiges Repayment Studio: auf Phase 2 verschoben.

## Validierung

Ausgeführt am 24. November 2026:

- `npm install --cache .npm-cache`: 323 Pakete installiert und `package-lock.json` erzeugt. Ein erster Versuch mit breiten Versionsbereichen traf einen npm-10-Arborist-Fehler; danach wurden die gewählten Versionen reproduzierbar fixiert. Ein weiterer Offline-Abgleich nach Entfernen von `tsx` meldete 0 Schwachstellen.
- `npm test`: 4 Testdateien, 30 Tests bestanden.
- `npm run verify:references`: 3 von 3 Referenzfällen stimmen nach Rundung auf Cent überein.
- `npm run typecheck`: erfolgreich, keine TypeScript-Fehler.
- `npm run lint`: erfolgreich, keine ESLint-Warnungen oder -Fehler.
- `npm run format:check`: erfolgreich, alle geprüften Dateien entsprechen Prettier.
- `npm run build`: erfolgreich mit Vite 7.2.4; 29 Module transformiert. Ausgabe: HTML 0,54 kB, CSS 6,94 kB, JavaScript 194,39 kB (jeweils unkomprimiert).

Der erste Referenzprüfer nutzte `tsx`, dessen IPC-Socket im Sandbox-Profil nicht erlaubt war. Da das Skript keine TypeScript-Funktionen benötigt, wurde es auf ein normales Node.js-ES-Modul umgestellt und `tsx` als direkte Abhängigkeit entfernt. Der danach ausgeführte Prüflauf war erfolgreich.

## Risiken und Grenzen

- IEEE-754-Gleitkommazahlen benötigen eine definierte Toleranz.
- Das Modell bildet reale Kreditverträge, Gebühren und regulatorische Anforderungen nicht vollständig ab.
- Öffentliche Referenzwerte können sich auf der Ursprungsseite ändern; die Fixture hält URL, Annahmen und Verifikationsmethode fest.
- Reale Kreditverträge können andere Rundungs- und Buchungsregeln verwenden als das vereinfachte Modell.

## Entscheidungen mit menschlichem Prüfbedarf

- Visuelle Richtung und konkrete UX des Repayment Studio
- Fachliche Freigabe der Modellannahmen vor einer Nutzung außerhalb des Portfolio-Kontexts
- Wahl eines Hosting-Ziels und Aktivierung von GitHub Actions in Phase 4

## Phase 2: Repayment Studio

### Aufgabe

Den vorhandenen deterministischen Rechenkern in eine vollständige, responsive und barrierearme Produktoberfläche integrieren.

### KI-unterstützte Entscheidungen

- Zwei koordinierte Designkonzepte für Desktop und Mobile mit ImageGen erstellt und als visuelle Spezifikation unter `docs/design` gesichert.
- Eine offene Zwei-Spalten-Struktur aus Eingabe-Rail und Daten-Canvas gewählt; auf Mobilgeräten wird sie zu einem priorisierten Einspaltenfluss.
- Formularentwurf und bestätigte Simulation getrennt, damit unfertige Eingaben nicht laufend ungültige Berechnungen auslösen.
- Diagramm, Vergleich und Tilgungsplanauszug in fokussierte Komponenten getrennt.
- Recharts erhält ausschließlich bereits berechnete Engine-Ergebnisse; keine Finanzformel wurde in UI-Code verschoben.

### Risiken und Grenzen

- Der Tilgungsplan zeigt bewusst einen kuratierten Auszug statt aller Monatszeilen.
- CSV-Export, URL-Teilbarkeit und persistierte Szenarien gehören nicht zu Phase 2.

### Tatsächliche Validierung

- `npm test`: 5 Testdateien, 32 Tests bestanden; darin zwei UI-Tests für Referenzwerte und Formularaktualisierung.
- `npm run typecheck`: erfolgreich.
- `npm run lint`: erfolgreich ohne Warnungen.
- `npm run format:check`: erfolgreich.
- `npm run verify:references`: alle drei öffentlichen Referenzfälle stimmen weiterhin überein.
- `npm run build`: erfolgreich; Recharts wird als eigener Lazy-Chunk geladen, der Haupt-Chunk bleibt bei rund 209 kB unkomprimiert.
- Browser/IAB bei 1.440 × 1.000 px: korrekter Seitentitel, sichtbarer vollständiger Arbeitsbereich, keine Fehler-Overlays und keine Console-Warnungen oder -Fehler.
- Browser/IAB bei 390 × 844 px: `scrollWidth` und `innerWidth` jeweils 390 px, keine Console-Warnungen oder -Fehler, vollständiger Einspaltenfluss geprüft.
- Interaktionspfad im Browser: Kreditbetrag auf 12.000 EUR, Zins auf 0 %, Laufzeit auf 24 Monate gesetzt, Sondertilgung deaktiviert und Formular abgeschickt; Ergebnis aktualisierte sich auf 500 EUR Monatsrate, 12.000 EUR Gesamtrückzahlung und 0 EUR Gesamtzinsen.

### Während der Browserprüfung behobene Abweichungen

- Die Kombination `min=1` und `step=100` machte runde Kreditbeträge in der nativen Browservalidierung ungültig; die UI-Untergrenze wurde auf 100 EUR korrigiert.
- Mobile Formularfelder wurden entsprechend dem Konzept paarweise angeordnet.
- Mobile Außenkarten wurden entfernt, um den offenen Layoutcharakter und die Informationsdichte des Konzepts zu treffen.
- Recharts wurde verzögert geladen, damit die Diagrammbibliothek nicht im Haupt-Chunk liegt.

## Phase 3: Interest Range Explorer und Mobile UX

### Aufgabe

Deterministische Zinsspannen sichtbar und auswählbar machen sowie die Tilgungsdetails auf kleinen Bildschirmen ohne breite Seitentabelle nutzbar machen.

### KI-unterstützte Entscheidungen

- Das vorhandene Phase-2-Designsystem wurde ohne neue Bildgenerierung erweitert.
- Zinsszenarien werden ausschließlich mit `compareInterestRates` in `src/engine` berechnet und auf maximal 101 Punkte begrenzt.
- Der Explorer zeigt eine Monatsratenkurve sowie drei direkt übernehmbare Orientierungsszenarien.
- Die mobile Tilgungsansicht verwendet semantische, aufklappbare Monatszeilen; die vollständige Tabelle bleibt für größere Bildschirme erhalten.
- Die Explorer-Diagramme werden im bestehenden verzögert geladenen Recharts-Chunk gebündelt.

### Risiken und Grenzen

- Die Zinsspanne ist eine Sensitivitätsanalyse und keine Marktprognose.
- Die Übernahme eines Zinsszenarios ändert nur den effektiven Jahreszins; alle übrigen Annahmen bleiben unverändert.
- Persistenz, URL-Freigabe und Export bleiben außerhalb von Phase 3.

### Tatsächliche Validierung

- `npm test`: 6 Testdateien, 41 Tests bestanden; darunter Engine-Grenzfälle und die Übernahme eines Zinsszenarios in das Hauptformular.
- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run verify:references` und `npm run build`: erfolgreich.
- Browser/IAB bei 1.440 × 1.000 px: 9-%-Szenario ausgewählt; das Hauptformular aktualisierte den effektiven Jahreszins auf 9 %, die Simulation berechnete die Ergebnisse neu und die Console blieb ohne Warnungen oder Fehler.
- Browser/IAB bei 390 × 844 px: Monatsdetail geöffnet, alle Werte sichtbar, `scrollWidth` und `innerWidth` jeweils 390 px und keine Console-Warnungen oder -Fehler.
- Der erste Browser-Aufruf traf auf einen beendeten lokalen Dev-Server; nach dem Neustart wurde die vollständige Prüfung erfolgreich wiederholt.

## Phase 4: Tests, CI und öffentliche Bereitstellung

### Aufgabe

Den bisherigen Qualitätsprozess reproduzierbar automatisieren, den kritischen Nutzerpfad in echten Browserprofilen prüfen und eine öffentliche statische Bereitstellung ohne bezahlte Zugangsdaten vorbereiten.

### KI-unterstützte Entscheidungen

- Playwright als einzige neue Entwicklungsabhängigkeit gewählt, weil jsdom keinen echten Browser-Smoke-Test ersetzt.
- Desktop Chrome und Pixel 5 als kleine, nachvollziehbare Browser-Matrix definiert.
- Den Smoke-Test auf Laden, Formularaktualisierung, Übernahme eines Zinsszenarios und mobile Überlaufkontrolle begrenzt.
- Die Pages-Bereitstellung an einen erfolgreichen Quality-Lauf auf `main` gekoppelt; ein manueller Start bleibt möglich.
- Den projektspezifischen Pages-Basispfad zur Build-Zeit gesetzt, ohne die lokale Root-Entwicklung zu verändern.

### Risiken und Grenzen

- Die CI-Browsermatrix enthält Chromium, nicht Firefox oder WebKit.
- GitHub Pages muss im Ziel-Repository einmalig auf „GitHub Actions“ als Quelle gestellt werden.
- Ohne konfiguriertes Git-Remote konnte in dieser Arbeitskopie keine reale öffentliche URL erzeugt oder ein GitHub-Lauf beobachtet werden.

### Tatsächliche Validierung

- `npm test`: 6 Testdateien und 41 Tests bestanden.
- `npm run test:e2e`: drei Browser-Smoke-Tests bestanden; der ausschließlich mobile Detailtest wurde im Desktop-Projekt erwartungsgemäß übersprungen.
- `npm run verify:references`: alle drei öffentlichen Referenzfälle stimmen weiterhin überein.
- `npm run typecheck`, `npm run lint`, `npm run format:check` und `npm run build`: erfolgreich.

- Ein Pages-Build mit `VITE_BASE_PATH=/fintrace/` erzeugte korrekte Asset-URLs unter `/fintrace/assets/`.
- Browser/IAB: korrekte URL und Seitentitel, sichtbarer Hauptinhalt, kein Framework-Overlay und keine Console-Warnungen oder -Fehler.
- Interaktionspfad im Browser: 9-%-Szenario ausgewählt; das Hauptformular aktualisierte den effektiven Jahreszins auf 9 %.

## Phase 5: Verifizierter Assistent im aufgezeichneten Modus

### Aufgabe

Eine öffentlich demonstrierbare Erklärschicht ergänzen, ohne finanzielle Zahlen durch ein Sprachmodell erzeugen zu lassen oder API-Zugangsdaten vorauszusetzen.

### KI-unterstützte Entscheidungen

- Drei klar begrenzte, vorab geprüfte Fragen für Monatsrate, Gesamtzinsen und Sondertilgung gewählt.
- Erklärungstext und Finanzwerte getrennt: Texte sind statisch, Fakten referenzieren unveränderte Felder aus `LoanCalculation` oder `ExtraRepaymentResult`.
- Für jede dargestellte Zahl den konkreten typisierten Feldnamen als Herkunft sichtbar gemacht.
- Den Modus prominent als „aufgezeichnet · keine Live-KI“ gekennzeichnet.
- Ohne aktives Sondertilgungsszenario bewusst keine hypothetische Ersparnis angezeigt.

### Risiken und Grenzen

- Die Antworten sind keine freie Konversation und decken nur drei vorab definierte Themen ab.
- Die Erklärungen übernehmen die Grenzen des vereinfachten Kreditmodells und ersetzen keine Beratung oder Vertragsprüfung.
- Eine spätere Live-KI benötigt eine zusätzliche serverseitige Sicherheits-, Quellen- und Verifikationsarchitektur.

### Tatsächliche Validierung

- `npm test`: 7 Testdateien und 45 Tests bestanden; darin Herkunftsmapping, fehlendes Alternativszenario und Assistenteninteraktion.
- `npm run test:e2e`: drei Browser-Smoke-Tests bestanden; der mobile Detailtest wurde im Desktop-Projekt erwartungsgemäß übersprungen. Der Hauptpfad prüft zusätzlich die Sondertilgungserklärung und deren Engine-Quelle.
- `npm run verify:references`: alle drei öffentlichen Referenzfälle stimmen weiterhin überein.
- `npm run typecheck`, `npm run lint`, `npm run format:check` und `npm run build`: erfolgreich.

## Phase 6: Optionale REST-, MCP- und Retrieval-Adapter

### Aufgabe

Den Rechenkern über optionale, transportneutrale Integrationsgrenzen verfügbar machen und eine dokumentengestützte Suchbasis ergänzen, ohne Finanzformeln zu duplizieren oder Zugangsdaten vorauszusetzen.

### KI-unterstützte Entscheidungen

- Einen reinen REST-Handler statt eines fest gekoppelten Webservers implementiert, damit Hosting, CORS, Authentifizierung und Rate Limits explizite Host-Verantwortung bleiben.
- MCP-Tools über kleine JSON-Schemas beschrieben und ihre Ausführung an denselben REST-Adapter delegiert.
- Eine lokale lexikalische Suche über vier geprüfte Wissenseinträge gewählt; jeder Treffer enthält einen Repository-Quellpfad.
- Finanzantworten mit `source: fintrace-engine` und Wissensantworten mit `source: fintrace-reviewed-knowledge` gekennzeichnet.
- Keine zusätzliche Laufzeitabhängigkeit, kein Embedding-Modell und keine externe API hinzugefügt.

### Risiken und Grenzen

- Die REST-Schicht ist ein transportneutraler Handler, kein produktionsfertiger HTTP-Server.
- Der MCP-Adapter implementiert Toolkatalog und Ausführung, aber keinen Protokolltransport oder Server-Lifecycle.
- Die lokale Suche ist eine kleine reproduzierbare Retrieval-Basis, kein semantisches Vektor-RAG.
- Ein produktiver Host benötigt Größenlimits, Rate Limiting, CORS, Authentifizierung, Telemetrie und Datenschutzprüfung.

### Tatsächliche Validierung

- `npm test`: 10 Testdateien und 56 Tests bestanden; darunter Engine-Gleichheit für REST/MCP, Fehlerpfade, Toolkatalog und Retrieval-Quellen.
- `npm run test:e2e`: drei Browser-Smoke-Tests bestanden; der ausschließlich mobile Detailtest wurde im Desktop-Projekt erwartungsgemäß übersprungen.
- `npm run verify:references`: alle drei öffentlichen Referenzfälle stimmen weiterhin überein.
- `npm run typecheck`, `npm run lint`, `npm run format:check` und `npm run build`: erfolgreich.

## Phase 7: Engineering-Portfolio-Dokumentation

### Aufgabe

Das implementierte System als prüfbares Engineering-Fallbeispiel abschließen und technischen Reviewern einen kurzen Zugang zu Problem, Architektur, Trade-offs, Tests, Demo und bekannten Grenzen geben.

### KI-unterstützte Entscheidungen

- Eine zentrale Portfolio-Fallstudie statt einer marketingorientierten Feature-Liste erstellt.
- Architekturentscheidungen mit verworfenen Alternativen, Kosten und Revisionssignalen dokumentiert.
- Teststrategie und Demo-Ablauf in getrennte, ausführbare Dokumente ausgelagert.
- Accessibility-, Sicherheits- und Performance-Aussagen bewusst auf tatsächlich vorhandene Nachweise begrenzt.
- Produktionslücken und mögliche nächste Schritte sichtbar gemacht, statt den Prototyp als produktionsreif darzustellen.

### Risiken und Grenzen

- Die Portfolio-Dokumentation ersetzt keine unabhängige fachliche, regulatorische oder Accessibility-Prüfung.
- Ohne konfiguriertes Remote und öffentliche Pages-URL kann der Review in dieser Arbeitskopie nur lokal durchgeführt werden.
- Testanzahl und Build-Größen sind Momentaufnahmen des ausgeführten Stands und keine dauerhaften Produktversprechen.

### Tatsächliche Validierung

- `npm test`: 10 Testdateien und 56 Tests bestanden.
- `npm run test:e2e`: drei Browser-Smoke-Tests bestanden; der ausschließlich mobile Detailtest wurde im Desktop-Projekt erwartungsgemäß übersprungen.
- `npm run verify:references`: alle drei öffentlichen Referenzfälle stimmen weiterhin überein.
- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` und `git diff --check`: erfolgreich.
- Roadmap und Entwicklungslog führen die Phasen 0 bis 7 in abgeschlossener Reihenfolge.
