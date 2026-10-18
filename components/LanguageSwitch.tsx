"use client";

import { copy, type Lang } from "@/lib/copy";

export function LanguageSwitch({
  lang,
  onChange,
  disabled,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  disabled?: boolean;
}) {
  const t = copy[lang];
  return (
    <div id="lang-switch" className="lang-switch" role="group" aria-label={t.langAria}>
      <button
        type="button"
        className={lang === "de" ? "on" : undefined}
        aria-pressed={lang === "de"}
        disabled={disabled}
        onClick={() => onChange("de")}
      >
        DE
      </button>
      <button
        type="button"
        className={lang === "en" ? "on" : undefined}
        aria-pressed={lang === "en"}
        disabled={disabled}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
