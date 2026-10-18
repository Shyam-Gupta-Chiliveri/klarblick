import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSample } from "./samples";

export type ExtractedLetter = {
  filename: string;
  text: string;
  imageBase64?: string;
  mime?: string;
};

const SAMPLES_DIR = path.join(process.cwd(), "samples");

export async function loadSample(id: string): Promise<ExtractedLetter> {
  const sample = getSample(id);
  if (!sample) throw new Error("Unbekanntes Beispiel");
  const filePath = path.join(SAMPLES_DIR, sample.file);
  const buf = await readFile(filePath);
  if (sample.mime.startsWith("image/")) {
    return {
      filename: sample.file,
      text: "",
      imageBase64: buf.toString("base64"),
      mime: sample.mime,
    };
  }
  const text = await extractPdfText(buf);
  return { filename: sample.file, text, mime: sample.mime };
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  if (Array.isArray(text)) return text.join("\n\n").trim();
  return String(text ?? "").trim();
}

export function looksEmpty(text: string): boolean {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length < 80;
}
