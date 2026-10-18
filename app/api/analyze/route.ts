import { NextResponse } from "next/server";
import { extractPdfText, loadSample, looksEmpty } from "@/lib/extract";
import { analyzeLetter, providerLabel } from "@/lib/trustedtokens";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const language = form.get("language") === "en" ? "en" : "de";
    const sampleId = String(form.get("sampleId") || "");
    const imageBase64Field = String(form.get("imageBase64") || "");
    const mimeField = String(form.get("mime") || "");

    let filename = "upload";
    let text = "";
    let imageBase64: string | undefined;
    let mime: string | undefined;

    if (sampleId) {
      const sample = await loadSample(sampleId);
      filename = sample.filename;
      text = sample.text;
      imageBase64 = sample.imageBase64;
      mime = sample.mime;
    }

    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      filename = file.name;
      mime = file.type || mime;
      const buf = Buffer.from(await file.arrayBuffer());
      if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
        imageBase64 = buf.toString("base64");
        mime = file.type || "image/jpeg";
      } else {
        text = await extractPdfText(buf);
        if (looksEmpty(text) && imageBase64Field) {
          imageBase64 = imageBase64Field;
          mime = mimeField || "image/png";
        }
      }
    } else if (imageBase64Field) {
      imageBase64 = imageBase64Field;
      mime = mimeField || "image/png";
      filename = filename === "upload" ? "scan.png" : filename;
    }

    if (!text.trim() && !imageBase64) {
      return NextResponse.json(
        { error: "Bitte einen Brief hochladen oder ein Beispiel wählen." },
        { status: 400 },
      );
    }

    const analysis = await analyzeLetter({ text, imageBase64, mime, language });
    return NextResponse.json({
      analysis,
      letterText: text,
      filename,
      provider: providerLabel(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analyse fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
