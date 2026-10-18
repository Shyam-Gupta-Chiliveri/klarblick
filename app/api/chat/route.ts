import { NextResponse } from "next/server";
import { emptyAnalysis, type LetterAnalysis } from "@/lib/schema";
import { chatAboutLetter } from "@/lib/trustedtokens";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "Leere Frage" }, { status: 400 });
    }
    const letterText = String(body.letterText || "");
    const analysis = (body.analysis as LetterAnalysis) || emptyAnalysis();
    const history = Array.isArray(body.history) ? body.history : [];
    const language = body.language === "en" ? "en" : "de";
    const reply = await chatAboutLetter({
      letterText,
      analysis,
      history,
      message,
      language,
    });
    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
