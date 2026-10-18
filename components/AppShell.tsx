"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copy, type Lang } from "@/lib/copy";
import { SAMPLE_LETTERS } from "@/lib/samples";
import type { LetterAnalysis } from "@/lib/schema";
import { LanguageSwitch } from "./LanguageSwitch";
import { LetterExhibit } from "./LetterExhibit";
import { ResultView } from "./ResultView";

type Screen = "home" | "working" | "result";
type Cache = Partial<Record<Lang, LetterAnalysis>>;

export function AppShell() {
  const [lang, setLang] = useState<Lang>("de");
  const [large, setLarge] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LetterAnalysis | null>(null);
  const [cache, setCache] = useState<Cache>({});
  const [letterText, setLetterText] = useState("");
  const [filename, setFilename] = useState("");
  const [translating, setTranslating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const switchGen = useRef(0);
  const langRef = useRef(lang);
  const t = copy[lang];

  useEffect(() => {
    langRef.current = lang;
    document.documentElement.lang = lang;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle("xl", large);
    body.classList.toggle("xl", large);
    return () => {
      root.classList.remove("xl");
      body.classList.remove("xl");
    };
  }, [large]);

  const chosen = useMemo(() => {
    if (file) return file.name;
    const sample = SAMPLE_LETTERS.find((s) => s.id === sampleId);
    return sample ? sample.title[lang] : "";
  }, [file, sampleId, lang]);

  function clearInputs() {
    if (inputRef.current) inputRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  }

  function pickFile(next: File | null, source: "camera" | "file") {
    setError(null);
    setFile(next);
    if (next) setSampleId(null);
    if (source === "camera" && inputRef.current) inputRef.current.value = "";
    if (source === "file" && cameraRef.current) cameraRef.current.value = "";
  }

  function clearChosen() {
    setFile(null);
    setSampleId(null);
    setError(null);
    clearInputs();
  }

  async function switchLanguage(next: Lang) {
    if (next === lang) return;
    setLang(next);
    setError(null);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    if (screen !== "result" || !analysis) return;
    const cached = cache[next];
    if (cached && cached.language === next) {
      setAnalysis(cached);
      return;
    }
    const gen = ++switchGen.current;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, language: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.translatingError);
      if (gen !== switchGen.current) return;
      const translated = { ...(data.analysis as LetterAnalysis), language: next };
      setCache((prev) => ({ ...prev, [next]: translated }));
      setAnalysis(translated);
    } catch (err) {
      if (gen !== switchGen.current) return;
      setError(err instanceof Error ? err.message : t.translatingError);
      setLang(analysis.language === "en" ? "en" : "de");
    } finally {
      if (gen === switchGen.current) setTranslating(false);
    }
  }

  async function run() {
    setError(null);
    if (!file && !sampleId) {
      setError(lang === "de" ? "Bitte Datei oder Beispiel wählen." : "Choose a file or a sample.");
      return;
    }
    const requested = lang;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setScreen("working");
    const form = new FormData();
    form.set("language", requested);
    if (sampleId) form.set("sampleId", sampleId);
    if (file) form.set("file", file);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analyse fehlgeschlagen");
      const nextAnalysis = {
        ...(data.analysis as LetterAnalysis),
        language: requested,
      } as LetterAnalysis;
      setLetterText(data.letterText || "");
      setFilename(data.filename || chosen);
      setCache({ [requested]: nextAnalysis });
      setAnalysis(nextAnalysis);
      setScreen("result");
      const want = langRef.current;
      if (want !== requested) {
        const gen = ++switchGen.current;
        setTranslating(true);
        try {
          const tr = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ analysis: nextAnalysis, language: want }),
          });
          const translated = await tr.json();
          if (!tr.ok) throw new Error(translated.error || t.translatingError);
          if (gen !== switchGen.current) return;
          const nextTranslated = { ...(translated.analysis as LetterAnalysis), language: want };
          setCache((prev) => ({ ...prev, [want]: nextTranslated }));
          setAnalysis(nextTranslated);
        } catch (translateErr) {
          if (gen !== switchGen.current) return;
          setError(translateErr instanceof Error ? translateErr.message : t.translatingError);
        } finally {
          if (gen === switchGen.current) setTranslating(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
      setScreen("home");
    }
  }

  return (
    <div>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <div className="banner">{t.safety}</div>
      <main className={screen === "result" ? "wrap wrap-wide" : "wrap"} id="main">
        <header className="topbar">
          <div className="brand">
            <p className="kicker">{t.kicker}</p>
            <h1>{t.product}</h1>
            <p>{t.tagline}</p>
          </div>
          <div className="tools no-print">
            <LanguageSwitch lang={lang} onChange={switchLanguage} disabled={translating} />
            <button
              className="btn"
              type="button"
              aria-pressed={large}
              onClick={() => setLarge((v) => !v)}
            >
              {t.large}
            </button>
          </div>
        </header>

        {translating && (
          <div className="translate-banner" role="status">
            {t.translating}
          </div>
        )}

        {screen === "home" && (
          <section className="desk">
            <div className="desk-copy">
              <h2 className="desk-title">{t.heroTitle}</h2>
              <LetterExhibit lang={lang} />
              <ol className="scan">
                <li>{t.scan1}</li>
                <li>{t.scan2}</li>
                <li>{t.scan3}</li>
              </ol>
            </div>

            <div className="sheet">
              <p className="kicker">{t.uploadTitle}</p>

              <input
                ref={cameraRef}
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                aria-hidden="true"
                tabIndex={-1}
                onChange={(e) => pickFile(e.target.files?.[0] || null, "camera")}
              />
              <button
                className="shutter"
                type="button"
                onClick={() => cameraRef.current?.click()}
              >
                <span className="shutter-lens" aria-hidden="true" />
                <span>
                  <span className="shutter-kicker">{t.photoKicker}</span>
                  <strong>{t.takePhoto}</strong>
                  <small>{t.takePhotoHint}</small>
                </span>
              </button>

              <label className="drop">
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg"
                  onChange={(e) => pickFile(e.target.files?.[0] || null, "file")}
                />
                <div>
                  <strong>{t.drop}</strong>
                  <div>{t.uploadHint}</div>
                </div>
              </label>

              {file && (
                <div className="file-chip">
                  <span className="file-chip-name">{file.name}</span>
                  <button
                    className="file-chip-x"
                    type="button"
                    aria-label={t.removeFile}
                    onClick={clearChosen}
                  >
                    ×
                  </button>
                </div>
              )}

              <p className="kicker" style={{ marginTop: 22 }}>
                {t.samples}
              </p>
              <div className="samples">
                {SAMPLE_LETTERS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className={sampleId === sample.id ? "sample active" : "sample"}
                    onClick={() => {
                      setSampleId(sample.id);
                      setFile(null);
                      clearInputs();
                    }}
                  >
                    <b>{sample.title[lang]}</b>
                    <small>
                      {sample.subtitle[lang]} · {sample.stay}
                    </small>
                  </button>
                ))}
              </div>
              {error && <div className="err">{error}</div>}
              <div className="sheet-actions">
                <button className="btn primary" type="button" onClick={run}>
                  {t.analyze}
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === "working" && (
          <section className="reading" aria-live="polite">
            <p className="kicker">{t.product}</p>
            <h2>{t.analyzing}</h2>
            <p>{t.analyzingSub}</p>
            <div className="reading-line" aria-hidden="true" />
          </section>
        )}

        {screen === "result" && analysis && (
          <ResultView
            analysis={analysis}
            letterText={letterText}
            filename={filename}
            lang={lang}
            translating={translating}
            onReset={() => {
              setScreen("home");
              setAnalysis(null);
              setCache({});
              setLetterText("");
              setError(null);
            }}
          />
        )}

        {error && screen === "result" && <div className="err">{error}</div>}

        <section className="business">
          <h2>{t.business}</h2>
          <p>{t.businessBody}</p>
          <p className="eu-note">{t.eu}</p>
        </section>
      </main>
    </div>
  );
}
