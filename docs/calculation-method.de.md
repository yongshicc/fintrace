# Berechnungsmethode

## Modellannahmen

FinTrace verwendet ein vereinfachtes, gebührenfreies Annuitätendarlehen:

- fixer effektiver Jahreszins über die gesamte Laufzeit
- monatliche Zahlung
- keine Gebühren, Versicherungen, Steuern oder Verzugsfolgen
- keine tagesgenaue Zinsberechnung
- keine Rundung innerhalb der Berechnung
- einmalige Sondertilgung nach der regulären Monatsrate

Der effektive Jahreszins wird intern als Dezimalzahl angegeben, beispielsweise `0,07` für 7 %.

## Formeln

Monatszins:

```text
r = expm1(log1p(effektiver Jahreszins) / 12)
```

Monatsrate für Kapital `P` und Laufzeit `n`:

```text
A = P × r / (1 − (1 + r)^−n)
```

Die Implementierung verwendet `Math.log1p` und `Math.expm1`, um bei kleinen Zinssätzen numerisch stabil zu bleiben. Bei exakt 0 % gilt `A = P / n`.

## Tilgungsplan

Jeder Monat startet mit dem offenen Saldo. Darauf wird der Monatszins berechnet. Die reguläre Zahlung wird in Zins- und Tilgungsanteil getrennt. Die letzte reguläre Zahlung wird auf den tatsächlich offenen Betrag inklusive Monatszins begrenzt. So entstehen weder negative Restschulden noch künstliche Überzahlungen.

## Toleranzrichtlinie

Ein rechnerischer Restsaldo wird als null behandelt, wenn er höchstens dem größeren dieser Werte entspricht:

- absolute Toleranz: `1e-8` EUR
- relative Toleranz: `1e-12 × ursprünglicher Kreditbetrag`

Diese Toleranz dient ausschließlich dazu, unvermeidbare IEEE-754-Gleitkommaartefakte zu neutralisieren. Geldbeträge werden intern nicht auf Cent gerundet. Anzeige und Vergleich gerundeter Referenzwerte erfolgen getrennt.

## Sondertilgung

Die einmalige Sondertilgung wird im gewählten Monat nach der regulären Zahlung angewendet. Sie wird auf die dann offene Restschuld begrenzt. Die reguläre Rate bleibt konstant; dadurch verkürzt sich die Laufzeit.

Nicht enthalten sind eine Strategie zur Senkung der Monatsrate, Sondertilgungsgebühren, vertragliche Limits und variable Zinssätze.

## Eingabegrenzen

- Kreditbetrag: endlich und größer als null
- effektiver Jahreszins: endlich und nicht negativ
- Laufzeit: ganze Zahl von 1 bis 1.200 Monaten
- Sondertilgung: endlich und nicht negativ
- Sondertilgungsmonat: ganze Zahl innerhalb der ursprünglichen Laufzeit
