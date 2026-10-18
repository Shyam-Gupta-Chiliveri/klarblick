import { emptyAnalysis, type LetterAnalysis } from "./schema";
import { CHAT_SYSTEM_PROMPT, SYSTEM_PROMPT, TRANSLATE_PROMPT } from "./prompt";
import type { Lang } from "./copy";

const BASE_URL =
  process.env.TRUSTEDTOKENS_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  "https://api.openai.com/v1";
const MODEL =
  process.env.TRUSTEDTOKENS_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4o-mini";
const VISION_MODEL = process.env.TRUSTEDTOKENS_VISION_MODEL || MODEL;
const TEXT_ONLY =
  process.env.TRUSTEDTOKENS_TEXT_ONLY === "1" ||
  process.env.TRUSTEDTOKENS_TEXT_ONLY === "true";

function apiKey(): string {
  const key =
    process.env.TRUSTEDTOKENS_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "No LLM key in .env.local (TRUSTEDTOKENS_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY)",
    );
  }
  return key;
}

export function providerLabel(): string {
  try {
    const host = new URL(BASE_URL).host;
    if (host.includes("127.0.0.1") || host.includes("localhost")) return `Local LLM (${MODEL})`;
    if (host.includes("openai.com")) return `OpenAI (${MODEL})`;
    if (host.includes("groq.com")) return `Groq (${MODEL})`;
    if (host.includes("trustedtokens")) return "TrustedTokens EU";
    return `${host} (${MODEL})`;
  } catch {
    return MODEL;
  }
}

function visionSupported(): boolean {
  if (TEXT_ONLY) return false;
  const model = VISION_MODEL.toLowerCase();
  if (/llava|vision|gpt-4o|gpt-4\.1|gpt-5|gemini|claude|glm/.test(model)) return true;
  try {
    const host = new URL(BASE_URL).host;
    if (host.includes("127.0.0.1") || host.includes("localhost")) return false;
  } catch {
    /* keep default */
  }
  return true;
}

type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
    };

function looksLikeFormatError(data: unknown): boolean {
  const msg = JSON.stringify(data).toLowerCase();
  return /response_format|json_object|unknown.?param|not supported|unsupported/.test(msg);
}

function withJsonInstruction(messages: ChatMessage[]): ChatMessage[] {
  const extra =
    "Return ONLY valid JSON. No markdown fences, no commentary. If you cannot fill a field, use an empty string, empty array, or null as the schema allows.";
  return messages.map((message, i) => {
    if (i === 0 && message.role === "system" && typeof message.content === "string") {
      if (/return only valid json/i.test(message.content)) return message;
      return { role: "system", content: `${message.content}\n\n${extra}` };
    }
    return message;
  });
}

async function complete(opts: {
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  useResponseFormat?: boolean;
  temperature?: number;
  max_tokens?: number;
}): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model ?? MODEL,
      temperature: opts.temperature ?? 0,
      max_tokens: opts.max_tokens ?? 4000,
      response_format: opts.useResponseFormat ? { type: "json_object" } : undefined,
      messages: opts.messages,
    }),
  });
  const data = (await res.json()) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

async function chat(opts: {
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const messages = opts.json ? withJsonInstruction(opts.messages) : opts.messages;
  let result = await complete({
    ...opts,
    messages,
    useResponseFormat: Boolean(opts.json),
  });

  if (!result.ok && opts.json && looksLikeFormatError(result.data)) {
    result = await complete({
      ...opts,
      messages,
      useResponseFormat: false,
    });
  }

  if (!result.ok) {
    const err = result.data?.error as { message?: string } | undefined;
    const msg = err?.message || (result.data?.message as string) || JSON.stringify(result.data).slice(0, 400);
    throw new Error(`LLM: ${msg}`);
  }

  const choice = (result.data?.choices as Array<{ message?: { content?: unknown } }>)?.[0];
  const content = choice?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("LLM lieferte keine Antwort");
  }
  return content.trim();
}

export async function analyzeLetter(opts: {
  text: string;
  imageBase64?: string;
  mime?: string;
  language: "de" | "en";
}): Promise<LetterAnalysis> {
  const langLine =
    opts.language === "en"
      ? "Write every patient-facing string in simple English. Keep German medical terms in parentheses."
      : "Schreibe alle patientennahen Texte in einfachem Deutsch (Leichte Sprache, kurze Sätze). Fachwörter einmal erklären.";

  const userText = opts.text?.trim()
    ? `LETTER TEXT:\n${opts.text}`
    : "The letter is attached as an image. Read every visible line. Transcribe names, dates, diagnoses, therapy, recommendations exactly, then analyse.";

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (opts.imageBase64 && visionSupported()) {
    const mime = opts.mime || "image/jpeg";
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `${langLine}\n\n${userText}`,
        },
        {
          type: "image_url",
          image_url: { url: `data:${mime};base64,${opts.imageBase64}` },
        },
      ],
    });
  } else {
    const visionNote =
      opts.imageBase64 && !visionSupported()
        ? "\n\n(An image was attached, but this local/text-only model cannot read pixels. Analyse the extracted text only.)"
        : "";
    messages.push({
      role: "user",
      content: `${langLine}\n\n${userText}${visionNote}`,
    });
  }

  const raw = await chat({
    model: opts.imageBase64 && visionSupported() ? VISION_MODEL : MODEL,
    messages,
    json: true,
    temperature: 0,
    max_tokens: 5000,
  });

  return parseAnalysis(raw);
}

export async function translateAnalysis(opts: {
  analysis: LetterAnalysis;
  language: Lang;
}): Promise<LetterAnalysis> {
  if (opts.analysis.language === opts.language) return opts.analysis;
  const target =
    opts.language === "en"
      ? "Translate every patient-facing string into simple English. Keep German medical terms in parentheses."
      : "Übersetze alle patientennahen Texte in einfaches Deutsch (Leichte Sprache). Fachwörter in Klammern behalten.";
  const raw = await chat({
    messages: [
      { role: "system", content: TRANSLATE_PROMPT },
      {
        role: "user",
        content: `${target}\nSet "language" to "${opts.language}".\n\nJSON:\n${JSON.stringify(opts.analysis)}`,
      },
    ],
    json: true,
    temperature: 0,
    max_tokens: 5000,
  });
  return keepOriginalFacts(opts.analysis, parseAnalysis(raw), opts.language);
}

export async function chatAboutLetter(opts: {
  letterText: string;
  analysis: LetterAnalysis;
  history: { role: "user" | "assistant"; content: string }[];
  message: string;
  language: Lang;
}): Promise<string> {
  const langLine =
    opts.language === "en"
      ? "Reply in simple English. Keep German quotes from the letter untranslated."
      : "Antworte in einfachem Deutsch. Zitate aus dem Brief nicht übersetzen.";
  const messages: ChatMessage[] = [
    { role: "system", content: `${CHAT_SYSTEM_PROMPT}\n${langLine}` },
    {
      role: "user",
      content: `STRUCTURED ANALYSIS JSON:\n${JSON.stringify(opts.analysis)}\n\nLETTER (may be truncated):\n${opts.letterText.slice(0, 24000)}`,
    },
    {
      role: "assistant",
      content:
        opts.language === "en"
          ? "I have the letter and the analysis. I will answer only from that, with no medical advice."
          : "Ich habe den Brief und die Analyse. Ich antworte nur daraus, ohne medizinischen Rat.",
    },
    ...opts.history.slice(-8),
    { role: "user", content: opts.message },
  ];
  return chat({ messages, temperature: 0.2, max_tokens: 900 });
}

function looksLikeDate(value: string | null | undefined): boolean {
  if (!value) return false;
  return /(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}[/.]\d{4})/.test(value);
}

function keepOriginalFacts(source: LetterAnalysis, translated: LetterAnalysis, language: Lang): LetterAnalysis {
  const zip = <T, U>(a: T[], b: U[]) => a.map((item, i) => [item, b[i]] as const);
  return {
    ...translated,
    language,
    worry: { ...translated.worry, level: source.worry.level },
    far: {
      fristen: zip(translated.far.fristen, source.far.fristen).map(([item, orig]) => ({
        ...item,
        dateAsWritten: orig?.dateAsWritten ?? item.dateAsWritten,
        quote: orig?.quote ?? item.quote,
        priority: orig?.priority ?? item.priority,
      })),
      aufgaben: zip(translated.far.aufgaben, source.far.aufgaben).map(([item, orig]) => ({
        ...item,
        byWhen: looksLikeDate(orig?.byWhen) ? orig?.byWhen ?? null : item.byWhen || orig?.byWhen || null,
        canDecline: orig?.canDecline ?? item.canDecline,
        quote: orig?.quote ?? item.quote,
        priority: orig?.priority ?? item.priority,
      })),
      risiken: zip(translated.far.risiken, source.far.risiken).map(([item, orig]) => ({
        ...item,
        certainty: orig?.certainty ?? item.certainty,
        quote: orig?.quote ?? item.quote,
      })),
    },
    details: zip(translated.details, source.details).map(([item, orig]) => ({
      ...item,
      originalQuote: orig?.originalQuote ?? item.originalQuote,
      term: orig?.term ?? item.term,
    })),
    medications: zip(translated.medications, source.medications).map(([item, orig]) => ({
      ...item,
      name: orig?.name ?? item.name,
      dose: orig?.dose ?? item.dose,
      scheme: orig?.scheme ?? item.scheme,
      until: looksLikeDate(orig?.until) ? orig?.until ?? null : item.until || orig?.until || null,
      quote: orig?.quote ?? item.quote,
    })),
    faq: zip(translated.faq, source.faq).map(([item, orig]) => ({
      ...item,
      quote: orig?.quote ?? item.quote,
    })),
    contacts: zip(translated.contacts, source.contacts).map(([item, orig]) => ({
      ...item,
      name: orig?.name ?? item.name,
      phone: orig?.phone ?? item.phone,
    })),
  };
}

function parseAnalysis(raw: string): LetterAnalysis {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) parsed = JSON.parse(cleaned.slice(start, end + 1));
    else throw new Error("Antwort war kein JSON");
  }
  return coerceAnalysis(parsed);
}

function coerceAnalysis(value: unknown): LetterAnalysis {
  const base = emptyAnalysis();
  if (!value || typeof value !== "object") return base;
  const v = value as Record<string, unknown>;
  const worry = (v.worry || {}) as Record<string, unknown>;
  const far = (v.far || {}) as Record<string, unknown>;
  const level = worry.level === "calm" || worry.level === "urgent" ? worry.level : "attention";

  return {
    language: v.language === "en" ? "en" : "de",
    documentType: str(v.documentType) || base.documentType,
    worry: {
      level,
      label: str(worry.label) || (level === "calm" ? "Kein Alarm im Brief" : "Bitte den Brief ansehen"),
      why: str(worry.why),
    },
    about: str(v.about),
    far: {
      fristen: asArray(far.fristen).map((item) => ({
        label: str(item.label),
        dateAsWritten: str(item.dateAsWritten) || null,
        quote: str(item.quote) || null,
        priority: num(item.priority),
      })),
      aufgaben: asArray(far.aufgaben).map((item) => ({
        what: str(item.what),
        byWhen: str(item.byWhen) || null,
        who: str(item.who) || null,
        canDecline: Boolean(item.canDecline),
        howToDecline: str(item.howToDecline) || null,
        quote: str(item.quote) || null,
        priority: num(item.priority),
      })),
      risiken: asArray(far.risiken).map((item) => ({
        ifNot: str(item.ifNot),
        certainty:
          item.certainty === "kann" || item.certainty === "muss" || item.certainty === "steht_nicht_im_brief"
            ? item.certainty
            : "steht_nicht_im_brief",
        quote: str(item.quote) || null,
      })),
    },
    summary: asStringArray(v.summary),
    details: asArray(v.details).map((item) => ({
      topic: str(item.topic),
      plain: str(item.plain),
      originalQuote: str(item.originalQuote) || null,
      term: str(item.term) || null,
    })),
    medications: asArray(v.medications).map((item) => ({
      name: str(item.name),
      dose: str(item.dose) || null,
      scheme: str(item.scheme) || null,
      until: str(item.until) || null,
      note: str(item.note) || null,
      quote: str(item.quote) || null,
    })),
    faq: asArray(v.faq).map((item) => ({
      question: str(item.question || item.q),
      answer: str(item.answer || item.a),
      quote: str(item.quote) || null,
    })),
    gpTalkingPoints: asStringArray(v.gpTalkingPoints),
    gaps: asStringArray(v.gaps),
    contacts: asArray(v.contacts).map((item) => ({
      role: str(item.role),
      name: str(item.name) || null,
      phone: str(item.phone) || null,
      hours: str(item.hours) || null,
    })),
    conflicts: asStringArray(v.conflicts),
  };
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (!Array.isArray(value)) return [];
  return value.map(str).filter(Boolean);
}

export { MODEL };
