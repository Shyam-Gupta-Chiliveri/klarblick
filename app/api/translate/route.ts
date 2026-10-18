import { NextResponse } from "next/server";
import { emptyAnalysis, type LetterAnalysis } from "@/lib/schema";
import { translateAnalysis } from "@/lib/trustedtokens";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const language = body.language === "en" ? "en" : "de";
    const analysis = (body.analysis as LetterAnalysis) || emptyAnalysis();
    const translated = await translateAnalysis({ analysis, language });
    return NextResponse.json({ analysis: translated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Übersetzung fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
