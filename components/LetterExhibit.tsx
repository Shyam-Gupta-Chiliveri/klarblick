"use client";

import { useRef, useState } from "react";
import { copy, type Lang } from "@/lib/copy";

const TERMS = [
  { jargon: "Koxarthrose", plain: { de: "Hüfte abgenutzt", en: "worn hip" } },
  { jargon: "Hüft-TEP", plain: { de: "neues Gelenk", en: "new joint" } },
  { jargon: "AHB", plain: { de: "Reha", en: "rehab" } },
] as const;

const SWIPE = 46;

export function LetterExhibit({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const skipClick = useRef(false);
  const t = copy[lang];

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    start.current = { x: e.clientX, y: e.clientY };
    skipClick.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) <= Math.abs(dy)) return;
    skipClick.current = true;
    setOpen((v) => !v);
  }

  function onClick() {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    setOpen((v) => !v);
  }

  return (
    <button
      type="button"
      className={open ? "letter-exhibit is-on" : "letter-exhibit"}
      aria-pressed={open}
      aria-label={open ? t.exhibitAriaOpen : t.exhibitAria}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        start.current = null;
      }}
    >
      <span className="letter-under" aria-hidden="true">
        <span className="letter-under-cue">{t.exhibitCueOpen}</span>
        <em>{t.exhibitSlit1}</em>
        <b>{t.exhibitSlit2}</b>
      </span>
      <span className="letter-stack" aria-hidden="true">
        <span className="letter-sheet">
          <span className="letter-punch" />
          <span className="letter-stamp">
            {lang === "de" ? "Entl." : "Disch."}
            <span>06.04.22</span>
          </span>
          <span className="letter-head">
            <span className="letter-clinic">Universitätsklinikum</span>
            <span className="letter-dept">Orthopädische Klinik · Station 3</span>
            <span className="letter-doc">{t.exhibitDoc}</span>
          </span>
          <span className="letter-meta">
            <span>
              Pat. <span className="redact" /> · *<span className="redact redact-sm" />
            </span>
            <span>01.04.–06.04.2022</span>
          </span>
          <span className="letter-body">
            <span className="letter-line">
              <i>Diagnose</i>
              Coxarthrosis coxae sin. — <Term i={0} lang={lang} />
            </span>
            <span className="letter-line">
              <i>Therapie</i>
              Implantation einer zementfreien <Term i={1} lang={lang} />
            </span>
            <span className="letter-line">
              <i>Weiterbehandlung</i>
              <Term i={2} lang={lang} /> beantragen. WV in 6 Wochen.
            </span>
          </span>
        </span>
        <span className="letter-ear" />
        <span className="letter-cue">{t.exhibitCue}</span>
      </span>
    </button>
  );
}

function Term({ i, lang }: { i: 0 | 1 | 2; lang: Lang }) {
  const term = TERMS[i];
  return (
    <span className={`term term-${i}`}>
      <span className="term-jargon">{term.jargon}</span>
      <span className="term-plain">{term.plain[lang]}</span>
    </span>
  );
}
