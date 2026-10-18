import type { Frist, LetterAnalysis, Medication } from "./schema";

export type NextStep = {
  what: string;
  byWhen: string | null;
  who: string | null;
  canDecline: boolean;
  howToDecline: string | null;
  quote: string | null;
  sortKey: number;
};

const URGENT = /sofort|umgehend|unverzüglich|notfall|so bald wie möglich|immediately|urgent|as soon as/i;

export function parseWhen(value: string | null | undefined): number | null {
  if (!value) return null;
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const de = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
  if (de) {
    const year = de[3].length === 2 ? 2000 + Number(de[3]) : Number(de[3]);
    return Date.UTC(year, Number(de[2]) - 1, Number(de[1]));
  }
  const my = value.match(/(\d{1,2})[/.](\d{4})/);
  if (my) return Date.UTC(Number(my[2]), Number(my[1]) - 1, 1);
  return null;
}

function sortKey(text: string | null, explicit?: number | null): number {
  if (text && URGENT.test(text)) return 1;
  const when = parseWhen(text);
  if (when != null) return when;
  const band = typeof explicit === "number" && Number.isFinite(explicit) ? explicit : 9;
  return 1e15 + band;
}

export function nextSteps(analysis: LetterAnalysis): NextStep[] {
  const fromTasks: NextStep[] = analysis.far.aufgaben
    .filter((item) => item.what)
    .map((item) => ({
      what: item.what,
      byWhen: item.byWhen,
      who: item.who,
      canDecline: item.canDecline,
      howToDecline: item.howToDecline,
      quote: item.quote,
      sortKey: Math.min(sortKey(item.byWhen, item.priority), sortKey(item.what, item.priority)),
    }));

  const covered = new Set(
    fromTasks.map((step) => normalize(step.byWhen || "") + "|" + normalize(step.what)),
  );

  const fromDeadlines: NextStep[] = analysis.far.fristen
    .filter((item) => item.label)
    .filter((item) => {
      const key = normalize(item.dateAsWritten || "") + "|" + normalize(item.label);
      if (covered.has(key)) return false;
      return !fromTasks.some(
        (step) =>
          (item.dateAsWritten && step.byWhen && normalize(step.byWhen) === normalize(item.dateAsWritten)) ||
          (item.label && step.what && normalize(step.what).includes(normalize(item.label).slice(0, 24))),
      );
    })
    .map((item: Frist) => ({
      what: item.label,
      byWhen: item.dateAsWritten,
      who: null,
      canDecline: false,
      howToDecline: null,
      quote: item.quote,
      sortKey: sortKey(item.dateAsWritten || item.label, item.priority),
    }));

  return [...fromTasks, ...fromDeadlines].sort((a, b) => a.sortKey - b.sortKey || a.what.localeCompare(b.what));
}

export function sortMedicines(meds: Medication[]): Medication[] {
  return [...meds].sort((a, b) => {
    const aUntil = a.until ? 0 : 1;
    const bUntil = b.until ? 0 : 1;
    if (aUntil !== bUntil) return aUntil - bUntil;
    const aDate = parseWhen(a.until) ?? Number.POSITIVE_INFINITY;
    const bDate = parseWhen(b.until) ?? Number.POSITIVE_INFINITY;
    return aDate - bDate;
  });
}

export function parseDoseSlots(scheme: string | null): number[] | null {
  if (!scheme) return null;
  const nums = scheme.match(/\d+(?:[.,]\d+)?/g);
  if (!nums || nums.length < 4) return null;
  return nums.slice(0, 4).map((n) => Number(n.replace(",", ".")));
}

export function shortSummary(paragraphs: string[]): string[] {
  return paragraphs.map((block) => block.trim()).filter(Boolean).slice(0, 5);
}

export function hideClinicalCodes(text: string): string {
  return text
    .replace(/\b[A-Z][0-9]{2}(?:\.[0-9A-Z]{1,4})?\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;])/g, "$1")
    .trim();
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export type StayKind = "admission" | "procedure" | "discharge";

export type StayPoint = {
  kind: StayKind;
  date: string;
};

const DE_DATE = /(\d{1,2}\.\d{1,2}\.\d{2,4})/;

function firstDateIn(slice: string): string | null {
  const match = slice.match(DE_DATE);
  return match ? match[1] : null;
}

/** Stay dates only when the letter labels them. Never invent appointments. */
export function extractStayTimeline(letterText: string): StayPoint[] {
  if (!letterText.trim()) return [];
  const text = letterText.replace(/\u00a0/g, " ");

  let admission: string | null = null;
  let discharge: string | null = null;
  let procedure: string | null = null;

  const pair = text.match(
    /Aufnahmedatum[\s\S]{0,48}?Entlass(?:ungs)?datum[\s\S]{0,64}?(\d{1,2}\.\d{1,2}\.\d{2,4})[^\d]{1,24}(\d{1,2}\.\d{1,2}\.\d{2,4})/i,
  );
  if (pair) {
    admission = pair[1];
    discharge = pair[2];
  }

  if (!admission) {
    const hit = text.match(/Aufnahmedatum[\s\S]{0,80}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i);
    admission = hit?.[1] ?? firstDateIn(text.match(/Aufnahme\s*am\b[\s\S]{0,40}/i)?.[0] || "");
  }
  if (!discharge) {
    const hit = text.match(/Entlass(?:ungs)?datum[\s\S]{0,80}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i);
    discharge = hit?.[1] ?? firstDateIn(text.match(/Entlassung\s*am\b[\s\S]{0,40}/i)?.[0] || "");
  }

  const fromProcedureBlock = text.match(
    /Prozeduren[\s\S]{0,500}?\bZeitpunkt[:\s]+(\d{1,2}\.\d{1,2}\.\d{2,4})/i,
  );
  const fromOpLabel = text.match(
    /(?:Operationsdatum|OP[- ]Datum|Eingriffsdatum)[\s\S]{0,40}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i,
  );
  const fromImplant = text.match(
    /(?:Implantation|Operation|Eingriff)[\s\S]{0,90}?\bam\s+(\d{1,2}\.\d{1,2}\.\d{2,4})/i,
  );
  procedure = fromProcedureBlock?.[1] || fromOpLabel?.[1] || fromImplant?.[1] || null;

  const out: StayPoint[] = [];
  if (admission) out.push({ kind: "admission", date: admission });
  if (procedure && procedure !== admission && procedure !== discharge) {
    out.push({ kind: "procedure", date: procedure });
  }
  if (discharge && discharge !== admission) out.push({ kind: "discharge", date: discharge });
  return out;
}
