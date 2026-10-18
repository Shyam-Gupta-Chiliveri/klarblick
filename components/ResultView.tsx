"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { copy, type Lang } from "@/lib/copy";
import {
  extractStayTimeline,
  hideClinicalCodes,
  nextSteps,
  parseDoseSlots,
  shortSummary,
  sortMedicines,
} from "@/lib/patient-order";
import type { LetterAnalysis } from "@/lib/schema";
import { ChatPanel } from "./ChatPanel";

type ChapterId = "worry" | "next" | "meds" | "letter" | "faq" | "contacts";
type ChapterIcon = "none" | "heart" | "list" | "pill" | "doc" | "ask" | "phone";

export function ResultView({
  analysis,
  letterText,
  filename,
  lang,
  translating,
  onReset,
}: {
  analysis: LetterAnalysis;
  letterText: string;
  filename: string;
  lang: Lang;
  translating?: boolean;
  onReset: () => void;
}) {
  const t = copy[lang];
  const [openQuotes, setOpenQuotes] = useState<Record<string, boolean>>({});
  const [speaking, setSpeaking] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const steps = useMemo(() => nextSteps(analysis), [analysis]);
  const meds = useMemo(() => sortMedicines(analysis.medications), [analysis.medications]);
  const summary = useMemo(() => shortSummary(analysis.summary), [analysis.summary]);
  const stay = useMemo(() => extractStayTimeline(letterText), [letterText]);
  const startChapter: ChapterId = steps.length > 0 ? "next" : "worry";
  const [chapter, setChapter] = useState<ChapterId>(startChapter);
  const [showStartHint, setShowStartHint] = useState(true);
  const slots = [t.slotMorning, t.slotNoon, t.slotEvening, t.slotNight];
  const faqChips = useMemo(() => analysis.faq.map((f) => f.question).filter(Boolean), [analysis.faq]);
  const canTalksheet =
    analysis.gpTalkingPoints.length > 0 ||
    steps.length > 0 ||
    meds.length > 0 ||
    analysis.contacts.length > 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setOpenQuotes({});
  }, [lang, analysis]);

  useEffect(() => {
    setChapter(startChapter);
    setShowStartHint(true);
  }, [filename, letterText, startChapter]);

  const spoken = useMemo(() => {
    const bits = [
      analysis.worry.label,
      analysis.worry.why,
      analysis.about,
      ...steps.map((s) => `${s.what}. ${s.byWhen || ""}`),
      ...analysis.far.risiken.map((r) => r.ifNot),
      ...summary,
    ];
    return bits.filter(Boolean).join(". ");
  }, [analysis, steps, summary]);

  function toggleQuote(id: string) {
    setOpenQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(spoken);
    utter.lang = lang === "de" ? "de-DE" : "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) =>
      lang === "de" ? v.lang.startsWith("de") : v.lang.startsWith("en"),
    );
    if (match) utter.voice = match;
    utter.rate = 0.92;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  async function copyPhone(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      window.setTimeout(() => {
        setCopiedPhone((cur) => (cur === phone ? null : cur));
      }, 1600);
    } catch {
      /* clipboard may be blocked; tel: link still works */
    }
  }

  const lampWord =
    analysis.worry.level === "calm"
      ? lang === "de"
        ? "RUHIG"
        : "CALM"
      : analysis.worry.level === "urgent"
        ? lang === "de"
          ? "JETZT"
          : "NOW"
        : lang === "de"
          ? "HINSEHEN"
          : "LOOK";

  const chapters: {
    id: ChapterId;
    label: string;
    hint?: string;
    count?: number;
    icon: ChapterIcon;
  }[] = [
    { id: "worry", label: t.chapterWorry, hint: lampWord, icon: "heart" },
    {
      id: "next",
      label: t.chapterNext,
      count: steps.length || undefined,
      icon: "list",
    },
    {
      id: "meds",
      label: t.chapterMeds,
      count: meds.length || undefined,
      icon: "pill",
    },
    {
      id: "letter",
      label: t.chapterLetter,
      hint: t.boxHintLetter,
      icon: "doc",
    },
    {
      id: "faq",
      label: t.chapterFaq,
      count: analysis.faq.length || undefined,
      icon: "ask",
    },
    {
      id: "contacts",
      label: t.chapterCall,
      count: analysis.contacts.length || undefined,
      icon: "phone",
    },
  ];

  function openChapter(id: ChapterId) {
    setChapter(id);
    setShowStartHint(false);
  }

  function onJourneyKey(e: KeyboardEvent<HTMLElement>) {
    const ids = chapters.map((c) => c.id);
    const i = ids.indexOf(chapter);
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(i + 1, ids.length - 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(i - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    else return;
    e.preventDefault();
    openChapter(ids[next]);
    document.getElementById(`tab-${ids[next]}`)?.focus();
  }

  function printTalksheet() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("print-talksheet");
    const cleanup = () => {
      root.classList.remove("print-talksheet");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.setTimeout(() => window.print(), 40);
    window.setTimeout(cleanup, 1500);
  }

  const stayLabel = {
    admission: t.stayAdmission,
    procedure: t.stayProcedure,
    discharge: t.stayDischarge,
  };

  const quoteProps = { open: openQuotes, toggle: toggleQuote, t };

  return (
    <div className={translating ? "result-shell busy" : "result-shell"}>
      <p className="print-only letter-print-head">
        {t.product} · {filename}
      </p>

      <div className="a11y no-print">
        <button className="btn" type="button" onClick={speak} disabled={translating}>
          {speaking ? t.stopAudio : t.audio}
        </button>
        <button className="btn" type="button" onClick={() => window.print()}>
          {t.print}
        </button>
        {canTalksheet ? (
          <button className="btn primary" type="button" onClick={printTalksheet} title={t.takeToDoctorHint}>
            {t.takeToDoctor}
          </button>
        ) : null}
        <button className="btn ghost" type="button" onClick={onReset}>
          {t.newLetter}
        </button>
        {filename ? <span className="pill">{filename}</span> : null}
      </div>

      <div className="folio">
        <nav className="journey no-print" aria-label={t.journeyAria}>
          {stay.length > 0 ? (
            <div className="stay-rail">
              <p className="kicker">{t.stayTitle}</p>
              <ol className="stay-line">
                {stay.map((point, i) => (
                  <li key={point.kind}>
                    {i > 0 ? <span className="stay-arrow" aria-hidden="true" /> : null}
                    <span>
                      <small>{stayLabel[point.kind]}</small>
                      <b>{point.date}</b>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="stay-note">{t.stayFromLetter}</p>
            </div>
          ) : null}

          <div
            className="journey-path"
            role="tablist"
            aria-label={t.pathwayAria}
            onKeyDown={onJourneyKey}
          >
            {chapters.map((item, i) => {
              const isStart = item.id === startChapter;
              const hint =
                showStartHint && isStart ? t.startHere : item.hint;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  type="button"
                  role="tab"
                  className={`journey-box${chapter === item.id ? " on" : ""}${item.icon === "none" ? " text-only" : " has-icon"}${showStartHint && isStart ? " is-start" : ""}`}
                  aria-selected={chapter === item.id}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={chapter === item.id ? 0 : -1}
                  onClick={() => openChapter(item.id)}
                >
                  <span className="journey-num">
                    {i + 1}
                  </span>
                  {item.icon !== "none" ? (
                    <span className="journey-ico" aria-hidden="true">
                      <ChapterGlyph kind={item.icon} />
                    </span>
                  ) : null}
                  <span className="journey-copy">
                    <b>{item.label}</b>
                    {hint ? <small>{hint}</small> : null}
                  </span>
                  {item.count ? (
                    <span className="journey-count" aria-hidden="true">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="panes">
          <section
            id="panel-worry"
            role="tabpanel"
            aria-labelledby="tab-worry"
            className={chapter === "worry" ? "pane is-on" : "pane"}
            {...(chapter !== "worry" ? { inert: true } : {})}
          >
            <p className="kicker">{t.worryTitle}</p>
            <p className={`worry-word ${analysis.worry.level}`}>{lampWord}</p>
            <h2 className="pane-title">{hideClinicalCodes(analysis.worry.label)}</h2>
            <p className="lede">{hideClinicalCodes(analysis.worry.why)}</p>
            {analysis.about ? (
              <>
                <p className="kicker rule-kicker">{t.aboutTitle}</p>
                <p className="about">{hideClinicalCodes(analysis.about)}</p>
              </>
            ) : null}
          </section>

          <section
            id="panel-next"
            role="tabpanel"
            aria-labelledby="tab-next"
            className={chapter === "next" ? "pane is-on" : "pane"}
            {...(chapter !== "next" ? { inert: true } : {})}
          >
            <p className="kicker">{t.nextTitle}</p>
            <h2 className="pane-title">{t.farTitle}</h2>
            <p className="lede">{t.nextHint}</p>
            {steps.length === 0 ? (
              <p className="empty-next">{t.noNext}</p>
            ) : (
              <ol className="do-list">
                {steps.map((step, i) => (
                  <li key={`s-${i}`}>
                    <span className="do-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <p className="do">{hideClinicalCodes(step.what)}</p>
                      <p className={`when ${step.byWhen ? "dated" : ""}`}>
                        {step.byWhen ? `${t.until} ${step.byWhen}` : t.noDeadline}
                        {step.who ? ` · ${step.who}` : ""}
                      </p>
                      {step.canDecline && (
                        <p className="meta">
                          {t.decline}:{" "}
                          {step.howToDecline ||
                            (lang === "de" ? "Im Brief vorgesehen." : "The letter allows this.")}
                        </p>
                      )}
                      {step.quote && <Quote id={`s-${i}`} quote={step.quote} {...quoteProps} />}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div className="risk-block">
              <p className="kicker">{t.r}</p>
              {analysis.far.risiken.length === 0 ? (
                <p className="lede">{t.nothing}</p>
              ) : (
                analysis.far.risiken.map((item, i) => (
                  <div key={`r-${i}`} className="risk-item">
                    <p className="do">{hideClinicalCodes(item.ifNot)}</p>
                    <p className="meta">
                      {item.certainty === "kann" ? t.may : item.certainty === "muss" ? t.must : t.notStated}
                    </p>
                    {item.quote && <Quote id={`r-${i}`} quote={item.quote} {...quoteProps} />}
                  </div>
                ))
              )}
            </div>
          </section>

          <section
            id="panel-meds"
            role="tabpanel"
            aria-labelledby="tab-meds"
            className={chapter === "meds" ? "pane is-on" : "pane"}
            {...(chapter !== "meds" ? { inert: true } : {})}
          >
            <p className="kicker">{t.morning}</p>
            <h2 className="pane-title">{t.meds}</h2>
            <p className="lede">{t.medsHint}</p>
            {meds.length === 0 ? (
              <p className="empty-next">{t.noMeds}</p>
            ) : (
              <div className="daystrip" aria-label={t.morning}>
                <div className="day-head">
                  <span className="day-name-col" aria-hidden="true" />
                  {slots.map((slot) => (
                    <span key={slot}>{slot}</span>
                  ))}
                  <span className="day-name-col" aria-hidden="true" />
                  <div className="day-bar" />
                </div>
                {meds.map((m, i) => {
                  const dose = parseDoseSlots(m.scheme);
                  return (
                    <article className="med-row" key={i}>
                      <header className="med-name">
                        <b>{m.name}</b>
                        {m.dose && <span>{m.dose}</span>}
                        {m.until && (
                          <span>
                            {t.until} {m.until}
                          </span>
                        )}
                        {m.note && <span>{hideClinicalCodes(m.note)}</span>}
                        {!dose && m.scheme && <span className="scheme">{m.scheme}</span>}
                      </header>
                      {dose
                        ? dose.map((n, si) => (
                            <div className={n > 0 ? "med-cell on" : "med-cell"} key={si}>
                              <span className="dots" aria-hidden="true">
                                {n > 0 ? (
                                  Array.from({ length: Math.min(4, Math.max(1, Math.round(n))) }).map((_, k) => (
                                    <i className="dot" key={k} />
                                  ))
                                ) : (
                                  <i className="dot empty" />
                                )}
                              </span>
                              <strong>{n > 0 ? n : "—"}</strong>
                            </div>
                          ))
                        : slots.map((slot) => (
                            <div className="med-cell" key={slot}>
                              <span className="dots" aria-hidden="true">
                                <i className="dot empty" />
                              </span>
                              <strong>—</strong>
                            </div>
                          ))}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section
            id="panel-letter"
            role="tabpanel"
            aria-labelledby="tab-letter"
            className={chapter === "letter" ? "pane is-on" : "pane"}
            {...(chapter !== "letter" ? { inert: true } : {})}
          >
            <p className="kicker">{t.chapterLetter}</p>
            <h2 className="pane-title">{t.summary}</h2>
            {summary.length > 0 ? (
              summary.map((p, i) => (
                <p className="summary-p" key={i}>
                  {hideClinicalCodes(p)}
                </p>
              ))
            ) : (
              <p className="lede">{t.noDetails}</p>
            )}

            {analysis.details.length > 0 && (
              <div className="letter-block">
                <p className="kicker">{t.details}</p>
                {analysis.details.map((d, i) => (
                  <div className="letter-item" key={`d-${i}`}>
                    <b>{hideClinicalCodes(d.topic)}</b>
                    <p>{hideClinicalCodes(d.plain)}</p>
                    {d.originalQuote && <Quote id={`d-${i}`} quote={d.originalQuote} {...quoteProps} />}
                  </div>
                ))}
              </div>
            )}

            {(analysis.conflicts.length > 0 || analysis.gaps.length > 0) && (
              <div className="letter-block">
                <p className="kicker">{t.gaps}</p>
                {analysis.conflicts.length > 0 && (
                  <>
                    <h3 className="fold-h">{t.conflicts}</h3>
                    <ul className="warn-list">
                      {analysis.conflicts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </>
                )}
                {analysis.gaps.length > 0 && (
                  <ul className="gap-list">
                    {analysis.gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {analysis.gpTalkingPoints.length > 0 && (
              <div className="letter-block">
                <p className="kicker">{t.gp}</p>
                <ol className="gp-list">
                  {analysis.gpTalkingPoints.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ol>
              </div>
            )}

            {canTalksheet ? (
              <div className="talksheet-cta no-print">
                <p className="kicker">{t.talksheetTitle}</p>
                <p className="lede">{t.takeToDoctorHint}</p>
                <button className="btn primary" type="button" onClick={printTalksheet}>
                  {t.takeToDoctor}
                </button>
              </div>
            ) : null}
          </section>

          <section
            id="panel-faq"
            role="tabpanel"
            aria-labelledby="tab-faq"
            className={chapter === "faq" ? "pane faq-pane is-on" : "pane faq-pane"}
            {...(chapter !== "faq" ? { inert: true } : {})}
          >
            <p className="kicker">{t.chapterFaq}</p>
            <h2 className="pane-title">{t.faq}</h2>
            {analysis.faq.length === 0 ? (
              <p className="empty-next">{t.noFaq}</p>
            ) : (
              <div className="faq-list">
                {analysis.faq.map((f, i) => (
                  <details key={i} className="faq-item">
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                    {f.quote && <Quote id={`f-${i}`} quote={f.quote} {...quoteProps} />}
                  </details>
                ))}
              </div>
            )}
            <div className="faq-chat no-print">
              <ChatPanel
                key={lang}
                analysis={analysis}
                letterText={letterText}
                lang={lang}
                suggestions={faqChips}
                embedded
              />
            </div>
          </section>

          <section
            id="panel-contacts"
            role="tabpanel"
            aria-labelledby="tab-contacts"
            className={chapter === "contacts" ? "pane is-on" : "pane"}
            {...(chapter !== "contacts" ? { inert: true } : {})}
          >
            <p className="kicker">{t.chapterCall}</p>
            <h2 className="pane-title">{t.callTitle}</h2>
            {analysis.contacts.length === 0 ? (
              <p className="empty-next">{t.noContacts}</p>
            ) : (
              <ul className="call-list">
                {analysis.contacts.map((c, i) => {
                  const phone = c.phone?.trim() || "";
                  const tel = phone.replace(/[^\d+]/g, "");
                  const canCall = Boolean(tel && /[\d+]/.test(phone));
                  return (
                    <li key={i}>
                      <b>{hideClinicalCodes(c.role)}</b>
                      {c.name ? <div>{c.name}</div> : null}
                      {phone ? (
                        <div className="phone">
                          <span className="phone-ico" aria-hidden="true">
                            <ChapterGlyph kind="phone" />
                          </span>
                          {canCall ? (
                            <a href={`tel:${tel}`}>{phone}</a>
                          ) : (
                            <span>{phone}</span>
                          )}
                          <button
                            className="copy-phone"
                            type="button"
                            onClick={() => void copyPhone(phone)}
                          >
                            {copiedPhone === phone ? t.copied : t.copyPhone}
                          </button>
                        </div>
                      ) : null}
                      {c.hours ? <div className="meta">{c.hours}</div> : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>

      <p className="disclaimer">{t.disclaimer}</p>

      <article className="talksheet" aria-hidden="true">
        <p className="print-only">
          {t.product} · {t.talksheetTitle}
          {filename ? ` · ${filename}` : ""}
        </p>
        <p className="kicker">{t.talksheetTitle}</p>
        <h2 className="pane-title">{hideClinicalCodes(analysis.about) || t.gp}</h2>
        <p className="lede">{t.talksheetLead}</p>

        {steps.length > 0 ? (
          <div className="letter-block">
            <p className="kicker">{t.farTitle}</p>
            <ol className="gp-list">
              {steps.map((step, i) => (
                <li key={`ts-${i}`}>
                  {hideClinicalCodes(step.what)}
                  {step.byWhen ? ` — ${t.until} ${step.byWhen}` : ""}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {meds.length > 0 ? (
          <div className="letter-block">
            <p className="kicker">{t.meds}</p>
            <ul className="gap-list">
              {meds.map((m, i) => (
                <li key={`tm-${i}`}>
                  {m.name}
                  {m.dose ? ` · ${m.dose}` : ""}
                  {m.scheme ? ` · ${m.scheme}` : ""}
                  {m.until ? ` · ${t.until} ${m.until}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.gpTalkingPoints.length > 0 ? (
          <div className="letter-block">
            <p className="kicker">{t.gp}</p>
            <ol className="gp-list">
              {analysis.gpTalkingPoints.map((g, i) => (
                <li key={`tg-${i}`}>{g}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {analysis.contacts.length > 0 ? (
          <div className="letter-block">
            <p className="kicker">{t.callTitle}</p>
            <ul className="gap-list">
              {analysis.contacts.map((c, i) => (
                <li key={`tc-${i}`}>
                  {hideClinicalCodes(c.role)}
                  {c.name ? ` · ${c.name}` : ""}
                  {c.phone ? ` · ${c.phone}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="disclaimer">{t.disclaimer}</p>
      </article>
    </div>
  );
}

function ChapterGlyph({ kind }: { kind: Exclude<ChapterIcon, "none"> }) {
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path
          d="M12 19.55S4.85 14.7 4.85 9.5C4.85 6.85 6.9 5.05 9.2 5.05c1.3 0 2.4.7 2.8 1.8.4-1.1 1.5-1.8 2.8-1.8 2.3 0 4.35 1.8 4.35 4.45 0 5.2-7.15 10.05-7.15 10.05Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "list") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.15" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8.15 12.2 10.7 14.75 16 9.15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "pill") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="9.2"
          width="16"
          height="5.6"
          rx="2.8"
          transform="rotate(-38 12 12)"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M8.3 15.2 15.7 8.8" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (kind === "doc") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M7 3.6h7.4L19 8.3v12.1H7z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M14.2 3.6V8.3H19" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 12.2h6M10 15.6h6" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (kind === "ask") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M5 6.2h14v10.2H9.4L5 19.8z" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M10.1 10.3c0-1.15.9-1.95 1.95-1.95S14 9.15 14 10.3c0 1.25-1.95 1.1-1.95 2.55"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="12.05" cy="15.85" r="0.75" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M7.1 4.1 9.4 3.3c.5-.2 1.05 0 1.3.5l1.25 2.35c.28.52.16 1.16-.28 1.52L10.2 9.1c.85 1.95 2.5 3.6 4.5 4.45l1.75-1.65c.38-.36 1-.44 1.5-.2l2.35 1.2c.52.26.74.86.52 1.4l-.8 2.3c-.2.58-.78.98-1.4.96C11.4 17.4 6.3 12.3 6.2 5.5c0-.6.38-1.16.9-1.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Quote({
  id,
  quote,
  open,
  toggle,
  t,
}: {
  id: string;
  quote: string;
  open: Record<string, boolean>;
  toggle: (id: string) => void;
  t: (typeof copy)[Lang];
}) {
  return (
    <div>
      <button
        className="linkish"
        type="button"
        aria-expanded={Boolean(open[id])}
        onClick={() => toggle(id)}
      >
        {open[id] ? t.viewLess : t.viewMore}
      </button>
      {open[id] && (
        <figure className="source">
          <figcaption className="source-label">{t.originalLetter}</figcaption>
          <blockquote lang="de">„{quote}“</blockquote>
        </figure>
      )}
    </div>
  );
}
