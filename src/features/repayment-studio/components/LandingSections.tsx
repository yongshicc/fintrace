import { calculateLoan } from '../../../engine';
import { formatEuro } from '../formatters';

const PRINCIPLES = [
  [
    '01',
    'Deterministischer Rechenkern',
    'Reine, streng typisierte Funktionen berechnen Rate, Zinskosten und Tilgungsplan. Gerundet wird erst für die Anzeige.',
  ],
  [
    '02',
    'Verifizierte Erklärungen',
    'Der Assistent erklärt ausschließlich Werte, die der Rechenkern bereits geliefert hat. Die Demo benötigt keine Live-KI.',
  ],
  [
    '03',
    'Nachvollziehbar getestet',
    'Öffentliche Referenzfälle, Unit-Tests und Browser-Tests prüfen Rechenweg und Benutzeroberfläche automatisch.',
  ],
] as const;

export function PrincipleSection() {
  return (
    <section
      className="principle-section"
      id="prinzip"
      aria-labelledby="principle-heading"
    >
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="principle-heading">
            Die Rechnung gehört dem Code. Die Erklärung bleibt nachvollziehbar.
          </h2>
          <p>
            FinTrace trennt finanzielle Berechnung konsequent von sprachlicher
            Erklärung.
          </p>
        </div>
        <div className="principle-list">
          {PRINCIPLES.map(([number, title, body]) => (
            <article className="principle-item" key={number}>
              <span aria-hidden="true">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReferenceCases() {
  const cases = [36, 60, 84].map((durationMonths) => ({
    durationMonths,
    result: calculateLoan({
      principal: 30_000,
      annualEffectiveRate: 0.07,
      durationMonths,
    }),
  }));
  return (
    <section
      className="reference-section"
      id="referenzfaelle"
      aria-labelledby="reference-heading"
    >
      <div className="page-shell">
        <div className="section-intro section-intro-row">
          <div>
            <h2 id="reference-heading">
              Referenzfälle, direkt im Browser berechnet
            </h2>
            <p>
              30.000 € bei 7,00 % effektivem Jahreszins — identische Engine,
              drei Laufzeiten.
            </p>
          </div>
          <a href="https://github.com/yongshicc/fintrace/blob/main/docs/calculation-method.de.md">
            Methode ansehen <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div
          className="reference-table-wrap"
          tabIndex={0}
          aria-label="Referenzfälle, seitlich scrollbar"
        >
          <table className="reference-table">
            <thead>
              <tr>
                <th scope="col">Laufzeit</th>
                <th scope="col">Monatsrate</th>
                <th scope="col">Gesamtzinsen</th>
                <th scope="col">Gesamtrückzahlung</th>
                <th scope="col">Quelle</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(({ durationMonths, result }) => (
                <tr key={durationMonths}>
                  <td>{durationMonths} Monate</td>
                  <td>{formatEuro(result.monthlyInstallment)}</td>
                  <td>{formatEuro(result.totalInterest)}</td>
                  <td>{formatEuro(result.totalRepayment)}</td>
                  <td>
                    <span className="verified-state">Engine-verifiziert</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const LINKS = [
  [
    'Engineering-Portfolio',
    'Technischer Überblick für Reviews',
    'engineering-portfolio.md',
  ],
  [
    'Architekturentscheidungen',
    'Warum der Code so aufgebaut ist',
    'decisions.md',
  ],
  [
    'Berechnungsmethode',
    'Formeln, Annahmen und Rundung',
    'calculation-method.de.md',
  ],
  ['Teststrategie', 'Was geprüft wird und wie', 'test-strategy.md'],
] as const;

export function EngineeringSection() {
  return (
    <section
      className="engineering-section"
      id="engineering"
      aria-labelledby="engineering-heading"
    >
      <div className="page-shell engineering-layout">
        <div className="section-intro">
          <h2 id="engineering-heading">Offen für technische Prüfung</h2>
          <p>
            Architektur, Annahmen und Tests sind Teil des Produkts — nicht nur
            Begleitmaterial.
          </p>
          <a className="text-link" href="https://github.com/yongshicc/fintrace">
            Quellcode auf GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="engineering-links">
          {LINKS.map(([title, description, file]) => (
            <a
              href={`https://github.com/yongshicc/fintrace/blob/main/docs/${file}`}
              key={file}
            >
              <span>{title}</span>
              <small>{description}</small>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
