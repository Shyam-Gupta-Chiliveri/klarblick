export type WorryLevel = "calm" | "attention" | "urgent";

export type Quoted = {
  text: string;
  quote: string | null;
};

export type Frist = {
  label: string;
  dateAsWritten: string | null;
  quote: string | null;
  priority?: number | null;
};

export type Aufgabe = {
  what: string;
  byWhen: string | null;
  who: string | null;
  canDecline: boolean;
  howToDecline: string | null;
  quote: string | null;
  priority?: number | null;
};

export type Risiko = {
  ifNot: string;
  certainty: "kann" | "muss" | "steht_nicht_im_brief";
  quote: string | null;
};

export type Detail = {
  topic: string;
  plain: string;
  originalQuote: string | null;
  term: string | null;
};

export type Medication = {
  name: string;
  dose: string | null;
  scheme: string | null;
  until: string | null;
  note: string | null;
  quote: string | null;
};

export type FaqItem = {
  question: string;
  answer: string;
  quote: string | null;
};

export type Contact = {
  role: string;
  name: string | null;
  phone: string | null;
  hours: string | null;
};

export type LetterAnalysis = {
  language: "de" | "en";
  documentType: string;
  worry: {
    level: WorryLevel;
    label: string;
    why: string;
  };
  about: string;
  far: {
    fristen: Frist[];
    aufgaben: Aufgabe[];
    risiken: Risiko[];
  };
  summary: string[];
  details: Detail[];
  medications: Medication[];
  faq: FaqItem[];
  gpTalkingPoints: string[];
  gaps: string[];
  contacts: Contact[];
  conflicts: string[];
};

export const emptyAnalysis = (): LetterAnalysis => ({
  language: "de",
  documentType: "Unbekannt",
  worry: {
    level: "attention",
    label: "Noch unklar",
    why: "Der Brief konnte nicht vollständig gelesen werden.",
  },
  about: "",
  far: { fristen: [], aufgaben: [], risiken: [] },
  summary: [],
  details: [],
  medications: [],
  faq: [],
  gpTalkingPoints: [],
  gaps: ["Keine verwertbare Analyse."],
  contacts: [],
  conflicts: [],
});
