# Architekturentscheidungen

## Entscheidungsrahmen

Diese Übersicht dokumentiert bewusst getroffene Trade-offs. Sie ersetzt keine nachträgliche Erfolgserzählung: Alternativen, Nachteile und Revisionssignale bleiben sichtbar.

## ADR-001: Deterministischer Rechenkern außerhalb von React

**Status:** angenommen

**Entscheidung:** Sämtliche Finanzberechnungen liegen in reinen TypeScript-Funktionen unter `src/engine`.

**Warum:** UI, Tests und optionale Adapter benötigen identische Zahlen. Ein unabhängiger Kern verhindert divergierende Formeln.

**Verworfene Alternative:** Berechnung direkt in Hooks oder Komponenten. Das wäre anfangs kürzer, erschwert aber Wiederverwendung und isolierte Prüfung.

**Kosten:** Zusätzliche Typen und Adaptergrenzen.

**Revisionssignal:** keines für die Verantwortungsgrenze; die konkrete numerische Implementierung darf nach fachlicher Prüfung versioniert weiterentwickelt werden.

## ADR-002: JavaScript `number` mit dokumentierter Toleranz

**Status:** angenommen für den Bildungsprototyp

**Entscheidung:** Interne Berechnung nutzt `number`, `log1p`/`expm1` und eine definierte Restschuld-Toleranz. Rundung erfolgt nur für Darstellung und Referenzvergleich.

**Warum:** Keine zusätzliche Dezimalabhängigkeit, kleine nachvollziehbare Implementierung und ausreichende Reproduzierbarkeit für den dokumentierten Scope.

**Verworfene Alternative:** Decimal-/Money-Bibliothek oder Cent-Rundung jeder Monatszeile.

**Kosten:** IEEE-754-Artefakte und mögliche Abweichung von realen Buchungsregeln.

**Revisionssignal:** verbindliche Vertragsregeln, regulatorische Anforderungen oder fachliche Freigabe für reale Entscheidungen.

## ADR-003: Formularentwurf und bestätigte Simulation trennen

**Status:** angenommen

**Entscheidung:** Unfertige Eingaben verändern die Ergebnisfläche erst nach expliziter Aktualisierung; ausgewählte Zinsszenarien werden dagegen als bewusste Aktion sofort übernommen.

**Warum:** Ungültige Zwischenzustände sollen keine Berechnungsfehler oder visuelles Flackern erzeugen.

**Verworfene Alternative:** Berechnung bei jedem Tastendruck.

**Kosten:** Zwei koordinierte Zustände und ein zusätzlicher Submit-Schritt.

**Revisionssignal:** Nutzerforschung zeigt, dass unmittelbare Berechnung wichtiger ist als stabile Zwischenzustände.

## ADR-004: Recorded Assistant statt Live-LLM

**Status:** angenommen für die öffentliche Demo

**Entscheidung:** Drei vorab geprüfte Erklärpfade kombinieren statische Texte mit unveränderten Engine-Fakten und sichtbaren Feldquellen.

**Warum:** Keine Halluzination finanzieller Zahlen, keine bezahlten Credentials, reproduzierbare Tests und klare Modellgrenzen.

**Verworfene Alternative:** direkter LLM-Aufruf aus dem Browser.

**Kosten:** Keine freie Konversation und begrenzte Themenabdeckung.

**Revisionssignal:** serverseitige Sicherheitsarchitektur, Quellenverifikation, Evaluationsdatensatz und klarer fachlicher Owner sind vorhanden.

## ADR-005: Recharts lazy laden

**Status:** angenommen

**Entscheidung:** Diagrammkomponenten werden über React `lazy` erst für die Ergebnisfläche geladen.

**Warum:** Die vergleichsweise große Diagrammbibliothek soll den initialen Haupt-Chunk nicht vergrößern.

**Verworfene Alternative:** statischer Import aller Diagramme.

**Kosten:** Suspense-Fallback und zusätzliche Chunks.

**Revisionssignal:** Messungen zeigen, dass Chunking die reale Ladeerfahrung verschlechtert oder eine leichtere Diagrammlösung verfügbar ist.

## ADR-006: Framework-unabhängige REST- und MCP-Adapter

**Status:** angenommen

**Entscheidung:** Phase 6 implementiert Verträge und Handler, aber keinen fest gekoppelten Servertransport.

**Warum:** Engine-Wiederverwendung bleibt testbar, während Hosting- und Sicherheitsentscheidungen nicht vorgetäuscht werden.

**Verworfene Alternative:** vollständigen Express- oder MCP-Server nur für die Demo hinzufügen.

**Kosten:** Kein sofort deploybarer API-Prozess.

**Revisionssignal:** Ein konkretes Hosting-Ziel und nichtfunktionale Anforderungen liegen vor.

## ADR-007: Lokale lexikalische Suche vor Vektor-RAG

**Status:** angenommen als Retrieval-Basis

**Entscheidung:** Ein kleiner geprüfter Wissenskatalog wird deterministisch nach Begriffen bewertet und liefert Repository-Quellen.

**Warum:** Credential-frei, transparent, reproduzierbar und passend zur geringen Dokumentmenge.

**Verworfene Alternative:** Embedding-API und Vektordatenbank.

**Kosten:** Synonyme und semantisch ähnliche Formulierungen werden nur eingeschränkt gefunden.

**Revisionssignal:** Der Wissensbestand wächst deutlich und ein evaluierter semantischer Retrieval-Ansatz übertrifft die Baseline messbar.
