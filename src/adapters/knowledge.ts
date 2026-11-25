export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  sourcePath: string;
  tags: readonly string[];
}

export interface KnowledgeMatch extends KnowledgeDocument {
  score: number;
}

const KNOWLEDGE_DOCUMENTS: readonly KnowledgeDocument[] = [
  {
    id: 'calculation-model',
    title: 'Berechnungsmodell',
    content:
      'FinTrace verwendet ein Festzins-Annuitätenmodell mit monatlicher Zahlung. Der effektive Jahreszins wird als Jahreskonvention behandelt; intern wird erst für die Darstellung gerundet.',
    sourcePath: 'docs/calculation-method.de.md',
    tags: ['annuität', 'monatsrate', 'jahreszins', 'rundung', 'modell'],
  },
  {
    id: 'extra-repayment-model',
    title: 'Sondertilgung',
    content:
      'Das Sondertilgungsszenario behält die reguläre Monatsrate bei und verkürzt die Laufzeit. Es unterstellt eine gebührenfreie einmalige Sondertilgung.',
    sourcePath: 'docs/calculation-method.de.md',
    tags: ['sondertilgung', 'laufzeit', 'zinsersparnis', 'monatsrate'],
  },
  {
    id: 'scope-and-disclaimer',
    title: 'Geltungsbereich und Disclaimer',
    content:
      'FinTrace ist ein Bildungs- und Portfolio-Projekt zur Simulation von Kreditkosten. Es ist weder Kreditberatung noch Kreditangebot und bildet reale Verträge nicht vollständig ab.',
    sourcePath: 'docs/product-concept.de.md',
    tags: ['disclaimer', 'beratung', 'vertrag', 'grenzen'],
  },
  {
    id: 'verified-explanations',
    title: 'Verifizierte Erklärungen',
    content:
      'Erklärungstexte und Finanzwerte sind getrennt. Finanzielle Zahlen stammen ausschließlich aus typisierten Engine-Ergebnissen und nennen ihr konkretes Quellfeld.',
    sourcePath: 'docs/architecture.md',
    tags: ['quelle', 'engine', 'ki', 'erklärung', 'verifikation'],
  },
];

export function searchKnowledge(query: string, limit = 3): KnowledgeMatch[] {
  const terms = tokenize(query);
  if (
    terms.length === 0 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 10
  ) {
    return [];
  }

  return KNOWLEDGE_DOCUMENTS.map((document) => ({
    ...document,
    score: scoreDocument(document, terms),
  }))
    .filter((document) => document.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.title.localeCompare(right.title, 'de'),
    )
    .slice(0, limit);
}

function scoreDocument(
  document: KnowledgeDocument,
  terms: readonly string[],
): number {
  const title = normalize(document.title);
  const content = normalize(document.content);
  const tags = document.tags.map(normalize);

  return terms.reduce((score, term) => {
    if (tags.some((tag) => tag.includes(term))) {
      return score + 4;
    }
    if (title.includes(term)) {
      return score + 3;
    }
    if (content.includes(term)) {
      return score + 1;
    }
    return score;
  }, 0);
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      normalize(value)
        .split(/[^\p{L}\p{N}]+/u)
        .filter((term) => term.length >= 2),
    ),
  );
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('de-AT').normalize('NFKC');
}
