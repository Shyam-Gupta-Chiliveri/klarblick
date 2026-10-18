/* Klarblick static app — GitHub Pages. No API keys. */
(function () {
  "use strict";

  const DATA = window.KLARBLICK_LETTERS;
  const COPY = {
    de: {
      product: "Klarblick",
      tagline: "Ihr Arztbrief. In Ruhe verstanden.",
      kicker: "CGM Challenge · Gesundheitskompetenz",
      safety: "Kein medizinischer Rat. Nur was im Brief steht — öffentlich vorgerechnet, ohne Schlüssel im Browser.",
      uploadTitle: "Brief öffnen",
      uploadHint: "PDF vom Computer oder ein Foto der Seite.",
      drop: "Datei ablegen oder auswählen",
      samples: "Oder ein CGM-Beispiel öffnen",
      analyze: "Brief verstehen",
      analyzing: "Klarblick liest den Brief…",
      analyzingSub: "Nichts erfinden. Jede Frist, jedes Medikament, jede Telefonnummer nur aus dem Original.",
      worryTitle: "Soll ich mir Sorgen machen?",
      aboutTitle: "Worum geht es — in einem Satz",
      farTitle: "Was Sie tun müssen",
      r: "Wenn Sie nichts tun",
      nextTitle: "Als Nächstes",
      nextHint: "Das Wichtigste zuerst. Nur was im Brief steht.",
      noNext: "Der Brief nennt keinen konkreten nächsten Schritt.",
      slotMorning: "morgens",
      slotNoon: "mittags",
      slotEvening: "abends",
      slotNight: "nachts",
      callTitle: "Wen Sie anrufen können",
      medsHint: "So steht es im Brief. Wir sagen nicht, was Sie einnehmen sollen.",
      decline: "Widerspruch / ablehnen",
      summary: "Zusammenfassung in einfacher Sprache",
      details: "Details 1:1 zum Original",
      viewMore: "Originaltext aus dem Brief zeigen",
      viewLess: "Originaltext verbergen",
      originalLetter: "Originaltext aus dem Brief",
      meds: "Medikamente, wie im Brief",
      faq: "Häufige Fragen",
      chat: "Fragen zum Brief",
      chatHint: "Schreiben Sie, was Ihnen zu diesem Brief durch den Kopf geht. Kein medizinischer Rat.",
      chatPlaceholder: "Was möchten Sie zu diesem Brief wissen?",
      askTitle: "Was liegt Ihnen auf dem Herzen?",
      suggested: "Vorschläge aus dem Brief",
      copyPhone: "Kopieren",
      copied: "Kopiert",
      boxHintLetter: "Kurzfassung",
      send: "Senden",
      audio: "Vorlesen",
      stopAudio: "Stopp",
      print: "Drucken",
      large: "Große Schrift",
      newLetter: "Neuer Brief",
      gaps: "Was der Brief nicht sagt",
      conflicts: "Widersprüche im Brief — wir raten nicht",
      gp: "Zettel für die nächste Ärztin / den nächsten Arzt",
      until: "bis",
      morning: "morgens–mittags–abends–nachts",
      business: "Wer zahlt",
      businessBody:
        "Krankenkassen als digitale Leistung nach Entlassmanagement § 39 SGB V. CGM spielt Klarblick direkt aus dem KIS aus — der Brief geht mit, der Patient versteht ihn.",
      disclaimer:
        "Klarblick erklärt den Brief. Klarblick behandelt nicht. Bei Beschwerden: Notaufnahme oder den im Brief genannten Kontakt.",
      nothing: "Im Brief steht keine Folge, wenn Sie nichts tun.",
      noDeadline: "Keine Frist im Brief genannt",
      eu: "Öffentliche Demo ohne Schlüssel im Browser",
      skip: "Zum Inhalt",
      langAria: "Sprache",
      may: "Im Brief: kann / vielleicht",
      must: "Im Brief: muss",
      notStated: "Steht nicht im Brief",
      takePhoto: "Foto aufnehmen",
      takePhotoHint: "Kamera öffnen — den Brief fotografieren",
      photoKicker: "Kamera",
      removeFile: "Auswahl entfernen",
      heroTitle: "Erst verstehen. Dann handeln.",
      scan1: "Foto aufnehmen oder Datei wählen.",
      scan2: "Sorge, nächste Schritte, Medikamente.",
      scan3: "Kein Rat. Nur was im Brief steht.",
      chapterWorry: "Sorge",
      chapterNext: "Was tun",
      chapterMeds: "Medikamente",
      chapterLetter: "Der Brief",
      chapterFaq: "Fragen",
      chapterCall: "Anrufen",
      journeyAria: "Kapitel des Briefes",
      noMeds: "Der Brief nennt keine Medikamente.",
      noFaq: "Der Brief wirft keine extra Fragen auf.",
      noContacts: "Der Brief nennt niemanden zum Anrufen.",
      noDetails: "Keine weiteren Details im Brief.",
      takeToDoctor: "Gesprächszettel",
      takeToDoctorHint: "Ein Blatt für die nächste Praxis — nur aus dem Brief.",
      talksheetTitle: "Gesprächszettel",
      talksheetLead: "Dieses Blatt ist für die nächste Ärztin oder den nächsten Arzt. Nur was im Brief steht. Kein Rat.",
      stayTitle: "Der Aufenthalt",
      stayAdmission: "Aufnahme",
      stayProcedure: "Eingriff",
      stayDischarge: "Entlassung",
      stayFromLetter: "Daten nur aus dem Brief",
      startHere: "Zuerst hier",
      pathwayAria: "Weg nach der Entlassung",
      chatGreeting: "Fragen Sie zum Brief. Ich rate nicht medizinisch. Was im Brief fehlt, sage ich Ihnen.",
      exhibitAria: "Entlassbrief. Klicken oder wischen, um die ruhige Seite zu sehen.",
      exhibitAriaOpen: "Ruhige Seite. Klicken oder wischen, um den Brief zurückzuholen.",
      exhibitDoc: "Entlassungsbrief",
      exhibitSlit1: "Sorge?",
      exhibitSlit2: "Was tun?",
      exhibitCue: "wischen",
      exhibitCueOpen: "zurück",
      pickFirst: "Bitte Datei oder Beispiel wählen.",
      unknown:
        "Diesen Brief kann die öffentliche Seite nicht lesen — es gibt keinen geheimen Schlüssel im Browser. Bitte ein CGM-Beispiel wählen. Die vier Musterbriefe funktionieren vollständig.",
      pagesNote: "Vier CGM-Briefe sind vorgerechnet. Unbekannte Dateien können wir hier nicht öffnen.",
      notInLetter: "Das steht nicht in diesem Brief.",
      noAdvice:
        "Ich gebe keinen medizinischen Rat. Im Brief steht nur, was geschrieben ist. Fragen Sie die nächste Ärztin oder den nächsten Arzt, die der Brief nennt.",
    },
    en: {
      product: "Klarblick",
      tagline: "Your discharge letter. Understood, calmly.",
      kicker: "CGM Challenge · health literacy",
      safety: "No medical advice. Only what the letter says — precomputed in public, no key in the browser.",
      uploadTitle: "Open the letter",
      uploadHint: "A PDF from your computer, or a photo of the page.",
      drop: "Drop a file or choose one",
      samples: "Or open a CGM sample letter",
      analyze: "Understand this letter",
      analyzing: "Klarblick is reading the letter…",
      analyzingSub: "Invent nothing. Every date, drug and phone number must come from the original.",
      worryTitle: "Should I worry?",
      aboutTitle: "What is this letter about — one sentence",
      farTitle: "What you need to do",
      r: "If you don't",
      nextTitle: "Next",
      nextHint: "Most important first. Only what the letter says.",
      noNext: "The letter does not name a concrete next step.",
      slotMorning: "morning",
      slotNoon: "noon",
      slotEvening: "evening",
      slotNight: "night",
      callTitle: "Who you can call",
      medsHint: "Copied from the letter. We do not tell you what to take.",
      decline: "Decline / object",
      summary: "Summary in plain language",
      details: "Details 1:1 with the original",
      viewMore: "Show original letter text",
      viewLess: "Hide original letter text",
      originalLetter: "Original letter text (German)",
      meds: "Medicines, as written",
      faq: "FAQ",
      chat: "Ask about this letter",
      chatHint: "Type whatever is on your mind about this letter. No medical advice.",
      chatPlaceholder: "What do you want to know about this letter?",
      askTitle: "What is on your mind?",
      suggested: "Suggestions from this letter",
      copyPhone: "Copy",
      copied: "Copied",
      boxHintLetter: "Summary",
      send: "Send",
      audio: "Listen",
      stopAudio: "Stop",
      print: "Print",
      large: "Large type",
      newLetter: "New letter",
      gaps: "What the letter does not say",
      conflicts: "Conflicts in the letter — we will not guess",
      gp: "Talking points for the next clinician",
      until: "until",
      morning: "morning–noon–evening–night",
      business: "Who pays",
      businessBody:
        "Health insurers as a digital service after discharge (§ 39 SGB V). CGM launches Klarblick from the hospital system so the letter arrives understood.",
      disclaimer:
        "Klarblick explains the letter. Klarblick does not treat. If you feel unwell: emergency department or the contact named in the letter.",
      nothing: "The letter does not say what happens if you do nothing.",
      noDeadline: "No deadline named in the letter",
      eu: "Public demo with no key in the browser",
      skip: "Skip to content",
      langAria: "Language",
      may: "The letter says may / can",
      must: "The letter says must",
      notStated: "Not stated in the letter",
      takePhoto: "Take photo",
      takePhotoHint: "Open the camera — photograph the letter",
      photoKicker: "Camera",
      removeFile: "Remove file",
      heroTitle: "Understand first. Then act.",
      scan1: "Take a photo or choose a file.",
      scan2: "Worry, next steps, medicines.",
      scan3: "No advice. Only what the letter says.",
      chapterWorry: "Worry",
      chapterNext: "Do this",
      chapterMeds: "Medicines",
      chapterLetter: "The letter",
      chapterFaq: "Questions",
      chapterCall: "Contacts",
      journeyAria: "Chapters of the letter",
      noMeds: "The letter does not name medicines.",
      noFaq: "The letter raises no extra questions.",
      noContacts: "The letter does not name anyone to call.",
      noDetails: "No further details in the letter.",
      takeToDoctor: "Take to the doctor",
      takeToDoctorHint: "One page for the next practice — only from the letter.",
      talksheetTitle: "Talking sheet",
      talksheetLead: "This page is for the next clinician. Only what the letter says. No advice.",
      stayTitle: "The hospital stay",
      stayAdmission: "Admission",
      stayProcedure: "Procedure",
      stayDischarge: "Discharge",
      stayFromLetter: "Dates only from the letter",
      startHere: "Start here",
      pathwayAria: "Path after discharge",
      chatGreeting: "Ask about this letter. I will not give medical advice. If it is not in the letter, I will say so.",
      exhibitAria: "A discharge letter. Click or swipe to see the calm side.",
      exhibitAriaOpen: "Calm side. Click or swipe to bring the letter back.",
      exhibitDoc: "Discharge letter",
      exhibitSlit1: "Worry?",
      exhibitSlit2: "Do this?",
      exhibitCue: "swipe",
      exhibitCueOpen: "back",
      pickFirst: "Choose a file or a sample.",
      unknown:
        "This public page cannot read that letter — there is no secret key in the browser. Please pick a CGM sample. The four sample letters work fully.",
      pagesNote: "Four CGM letters are precomputed. Unknown files cannot be opened here.",
      notInLetter: "That is not in this letter.",
      noAdvice:
        "I do not give medical advice. The letter only says what is written. Ask the next clinician named in the letter.",
    },
  };

  const TERMS = [
    { jargon: "Koxarthrose", plain: { de: "Hüfte abgenutzt", en: "worn hip" } },
    { jargon: "Hüft-TEP", plain: { de: "neues Gelenk", en: "new joint" } },
    { jargon: "AHB", plain: { de: "Reha", en: "rehab" } },
  ];
  const ICONS = {
    heart:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M12 19.55S4.85 14.7 4.85 9.5C4.85 6.85 6.9 5.05 9.2 5.05c1.3 0 2.4.7 2.8 1.8.4-1.1 1.5-1.8 2.8-1.8 2.3 0 4.35 1.8 4.35 4.45 0 5.2-7.15 10.05-7.15 10.05Z" stroke="currentColor" strokeWidth="1.7" stroke-linejoin="round"/></svg>',
    list: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.15" stroke="currentColor" stroke-width="1.7"/><path d="M8.15 12.2 10.7 14.75 16 9.15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pill: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><rect x="4" y="9.2" width="16" height="5.6" rx="2.8" transform="rotate(-38 12 12)" stroke="currentColor" stroke-width="1.7"/><path d="M8.3 15.2 15.7 8.8" stroke="currentColor" stroke-width="1.7"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M7 3.6h7.4L19 8.3v12.1H7z" stroke="currentColor" stroke-width="1.7"/><path d="M14.2 3.6V8.3H19" stroke="currentColor" stroke-width="1.7"/><path d="M10 12.2h6M10 15.6h6" stroke="currentColor" stroke-width="1.7"/></svg>',
    ask: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M5 6.2h14v10.2H9.4L5 19.8z" stroke="currentColor" stroke-width="1.7"/><path d="M10.1 10.3c0-1.15.9-1.95 1.95-1.95S14 9.15 14 10.3c0 1.25-1.95 1.1-1.95 2.55" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12.05" cy="15.85" r="0.75" fill="currentColor"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M7.1 4.1 9.4 3.3c.5-.2 1.05 0 1.3.5l1.25 2.35c.28.52.16 1.16-.28 1.52L10.2 9.1c.85 1.95 2.5 3.6 4.5 4.45l1.75-1.65c.38-.36 1-.44 1.5-.2l2.35 1.2c.52.26.74.86.52 1.4l-.8 2.3c-.2.58-.78.98-1.4.96C11.4 17.4 6.3 12.3 6.2 5.5c0-.6.38-1.16.9-1.4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  };

  const state = {
    lang: "de",
    large: false,
    screen: "home",
    sampleId: null,
    file: null,
    error: null,
    pack: null,
    filename: "",
    chapter: "next",
    showStartHint: true,
    openQuotes: {},
    speaking: false,
    copiedPhone: null,
    chat: [],
    chatText: "",
    exhibitOpen: false,
  };

  const URGENT = /sofort|umgehend|unverzüglich|notfall|so bald wie möglich|immediately|urgent|as soon as/i;
  const DE_DATE = /(\d{1,2}\.\d{1,2}\.\d{2,4})/;

  function t() {
    return COPY[state.lang];
  }
  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, " ")
      .trim();
  }
  function hideClinicalCodes(text) {
    return String(text || "")
      .replace(/\b[A-Z][0-9]{2}(?:\.[0-9A-Z]{1,4})?\b/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;])/g, "$1")
      .trim();
  }
  function parseWhen(value) {
    if (!value) return null;
    const iso = String(value).match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    const de = String(value).match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (de) {
      const year = de[3].length === 2 ? 2000 + Number(de[3]) : Number(de[3]);
      return Date.UTC(year, Number(de[2]) - 1, Number(de[1]));
    }
    const my = String(value).match(/(\d{1,2})[/.](\d{4})/);
    if (my) return Date.UTC(Number(my[2]), Number(my[1]) - 1, 1);
    return null;
  }
  function sortKey(text, explicit) {
    if (text && URGENT.test(text)) return 1;
    const when = parseWhen(text);
    if (when != null) return when;
    const band = typeof explicit === "number" && Number.isFinite(explicit) ? explicit : 9;
    return 1e15 + band;
  }
  function nextSteps(analysis) {
    const fromTasks = analysis.far.aufgaben
      .filter((item) => item.what)
      .map((item) => ({
        ...item,
        sortKey: Math.min(sortKey(item.byWhen, item.priority), sortKey(item.what, item.priority)),
      }));
    const fromDeadlines = analysis.far.fristen
      .filter((item) => item.label)
      .filter((item) => {
        return !fromTasks.some(
          (step) =>
            (item.dateAsWritten && step.byWhen && normalize(step.byWhen) === normalize(item.dateAsWritten)) ||
            (item.label && step.what && normalize(step.what).includes(normalize(item.label).slice(0, 24))),
        );
      })
      .map((item) => ({
        what: item.label,
        byWhen: item.dateAsWritten,
        who: null,
        canDecline: false,
        howToDecline: null,
        quote: item.quote,
        sortKey: sortKey(item.dateAsWritten || item.label, item.priority),
      }));
    return [...fromTasks, ...fromDeadlines].sort((a, b) => a.sortKey - b.sortKey || a.what.localeCompare(b.what));
  }
  function sortMedicines(meds) {
    return [...meds].sort((a, b) => {
      const aUntil = a.until ? 0 : 1;
      const bUntil = b.until ? 0 : 1;
      if (aUntil !== bUntil) return aUntil - bUntil;
      return (parseWhen(a.until) ?? Infinity) - (parseWhen(b.until) ?? Infinity);
    });
  }
  function parseDoseSlots(scheme) {
    if (!scheme) return null;
    const nums = String(scheme).match(/\d+(?:[.,]\d+)?/g);
    if (!nums || nums.length < 4) return null;
    return nums.slice(0, 4).map((n) => Number(n.replace(",", ".")));
  }
  function firstDateIn(slice) {
    const match = String(slice || "").match(DE_DATE);
    return match ? match[1] : null;
  }
  function extractStayTimeline(letterText) {
    if (!letterText || !letterText.trim()) return [];
    const text = letterText.replace(/\u00a0/g, " ");
    let admission = null;
    let discharge = null;
    let procedure = null;
    const pair = text.match(
      /Aufnahmedatum[\s\S]{0,48}?Entlass(?:ungs)?datum[\s\S]{0,64}?(\d{1,2}\.\d{1,2}\.\d{2,4})[^\d]{1,24}(\d{1,2}\.\d{1,2}\.\d{2,4})/i,
    );
    if (pair) {
      admission = pair[1];
      discharge = pair[2];
    }
    if (!admission) {
      const hit = text.match(/Aufnahmedatum[\s\S]{0,80}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i);
      admission = hit?.[1] ?? firstDateIn(text.match(/Aufnahme\s*am\b[\s\S]{0,40}/i)?.[0] || "");
    }
    if (!discharge) {
      const hit = text.match(/Entlass(?:ungs)?datum[\s\S]{0,80}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i);
      discharge = hit?.[1] ?? firstDateIn(text.match(/Entlassung\s*am\b[\s\S]{0,40}/i)?.[0] || "");
    }
    procedure =
      text.match(/Prozeduren[\s\S]{0,500}?\bZeitpunkt[:\s]+(\d{1,2}\.\d{1,2}\.\d{2,4})/i)?.[1] ||
      text.match(/(?:Operationsdatum|OP[- ]Datum|Eingriffsdatum)[\s\S]{0,40}?(\d{1,2}\.\d{1,2}\.\d{2,4})/i)?.[1] ||
      text.match(/(?:Implantation|Operation|Eingriff)[\s\S]{0,90}?\bam\s+(\d{1,2}\.\d{1,2}\.\d{2,4})/i)?.[1] ||
      null;
    const out = [];
    if (admission) out.push({ kind: "admission", date: admission });
    if (procedure && procedure !== admission && procedure !== discharge) out.push({ kind: "procedure", date: procedure });
    if (discharge && discharge !== admission) out.push({ kind: "discharge", date: discharge });
    return out;
  }
  function analysis() {
    return state.pack ? state.pack[state.lang] : null;
  }
  function lampWord(level) {
    if (level === "calm") return state.lang === "de" ? "RUHIG" : "CALM";
    if (level === "urgent") return state.lang === "de" ? "JETZT" : "NOW";
    return state.lang === "de" ? "HINSEHEN" : "LOOK";
  }
  function matchUpload(file) {
    if (!file) return null;
    const name = normalize(file.name || "");
    let best = null;
    let bestScore = 0;
    for (const sample of DATA.samples) {
      let score = 0;
      if (name.includes(sample.id)) score += 6;
      for (const token of sample.tokens) {
        if (name.includes(normalize(token))) score += 3;
      }
      if (name.includes("pia") || name.includes("paul")) {
        if (sample.id === "minimal" || sample.id === "orthopaedisch") score += 1;
      }
      if ((name.includes("hueft") || name.includes("hip") || name.includes("tep")) && (sample.id === "minimal" || sample.id === "orthopaedisch")) {
        score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = sample.id;
      } else if (score === bestScore && score > 0 && sample.id === "orthopaedisch" && best === "minimal") {
        best = "orthopaedisch";
      }
    }
    return bestScore >= 3 ? best : null;
  }
  function overlap(a, b) {
    const wa = new Set(a.split(/[^a-z0-9äöüß]+/).filter((w) => w.length > 2));
    const wb = b.split(/[^a-z0-9äöüß]+/).filter((w) => w.length > 2);
    return wb.reduce((n, w) => n + (wa.has(w) ? 1 : 0), 0);
  }
  function groundedReply(question) {
    const a = analysis();
    const c = t();
    const q = normalize(question);
    if (!a) return c.notInLetter;
    if (
      /gefahr|gefahrlich|gefaehrlich|okay|ok\b|soll ich|darf ich|should i|dangerous|prognos|absetzen|stop taking|take this/.test(
        q,
      )
    ) {
      return c.noAdvice;
    }
    let best = null;
    let bestScore = 0;
    for (const item of a.faq) {
      const score = overlap(q, normalize(item.question + " " + item.answer));
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    if (best && bestScore >= 2) return best.answer;
    if (/medikament|medicine|tablet|dosis|dose|einnahm/.test(q)) {
      if (!a.medications.length) return c.noMeds;
      return a.medications
        .map((m) => [m.name, m.dose, m.scheme, m.until ? `${c.until} ${m.until}` : "", m.note].filter(Boolean).join(" · "))
        .join("\n");
    }
    if (/anruf|telefon|phone|kontakt|call|wen/.test(q)) {
      if (!a.contacts.length) return c.noContacts;
      return a.contacts
        .map((item) => [item.role, item.name, item.phone, item.hours].filter(Boolean).join(" · "))
        .join("\n");
    }
    if (/nächst|next|tun muss|do i|frist|deadline|reha|ahb/.test(q)) {
      const steps = nextSteps(a);
      if (!steps.length) return c.noNext;
      return steps.map((s) => `${s.what}${s.byWhen ? ` — ${c.until} ${s.byWhen}` : ""}`).join("\n");
    }
    if (/sorge|worry|notfall|emergency/.test(q)) {
      return `${lampWord(a.worry.level)}. ${a.worry.label}. ${a.worry.why}`;
    }
    if (/worum|about|was ist das|what is this/.test(q)) return a.about;
    if (/widerspruch|conflict/.test(q)) {
      return a.conflicts.length ? a.conflicts.join("\n") : c.notInLetter;
    }
    return c.notInLetter;
  }

  function quoteHtml(id, quote) {
    if (!quote) return "";
    const open = Boolean(state.openQuotes[id]);
    return `<div>
      <button class="linkish" type="button" data-act="quote" data-id="${esc(id)}" aria-expanded="${open}">${open ? t().viewLess : t().viewMore}</button>
      ${open ? `<figure class="source"><figcaption class="source-label">${esc(t().originalLetter)}</figcaption><blockquote lang="de">„${esc(quote)}“</blockquote></figure>` : ""}
    </div>`;
  }

  function exhibitHtml() {
    const c = t();
    const open = state.exhibitOpen;
    const terms = TERMS.map(
      (term, i) =>
        `<span class="term term-${i}"><span class="term-jargon">${esc(term.jargon)}</span><span class="term-plain">${esc(term.plain[state.lang])}</span></span>`,
    );
    return `<button type="button" class="letter-exhibit${open ? " is-on" : ""}" data-act="exhibit" aria-pressed="${open}" aria-label="${esc(open ? c.exhibitAriaOpen : c.exhibitAria)}">
      <span class="letter-under" aria-hidden="true">
        <span class="letter-under-cue">${esc(c.exhibitCueOpen)}</span>
        <em>${esc(c.exhibitSlit1)}</em>
        <b>${esc(c.exhibitSlit2)}</b>
      </span>
      <span class="letter-stack" aria-hidden="true">
        <span class="letter-sheet">
          <span class="letter-punch"></span>
          <span class="letter-stamp">${state.lang === "de" ? "Entl." : "Disch."}<span>06.04.22</span></span>
          <span class="letter-head">
            <span class="letter-clinic">Universitätsklinikum</span>
            <span class="letter-dept">Orthopädische Klinik · Station 3</span>
            <span class="letter-doc">${esc(c.exhibitDoc)}</span>
          </span>
          <span class="letter-meta"><span>Pat. <span class="redact"></span> · *<span class="redact redact-sm"></span></span><span>01.04.–06.04.2022</span></span>
          <span class="letter-body">
            <span class="letter-line"><i>Diagnose</i>Coxarthrosis coxae sin. — ${terms[0]}</span>
            <span class="letter-line"><i>Therapie</i>Implantation einer zementfreien ${terms[1]}</span>
            <span class="letter-line"><i>Weiterbehandlung</i>${terms[2]} beantragen. WV in 6 Wochen.</span>
          </span>
        </span>
        <span class="letter-ear"></span>
        <span class="letter-cue">${esc(c.exhibitCue)}</span>
      </span>
    </button>`;
  }

  function homeHtml() {
    const c = t();
    const samples = DATA.samples
      .map((sample) => {
        const active = state.sampleId === sample.id ? " active" : "";
        return `<button type="button" class="sample${active}" data-act="sample" data-id="${sample.id}">
          <b>${esc(sample.title[state.lang])}</b>
          <small>${esc(sample.subtitle[state.lang])} · ${esc(sample.stay)}</small>
        </button>`;
      })
      .join("");
    const fileChip = state.file
      ? `<div class="file-chip"><span class="file-chip-name">${esc(state.file.name)}</span><button class="file-chip-x" type="button" data-act="clear-file" aria-label="${esc(c.removeFile)}">×</button></div>`
      : "";
    return `<section class="desk">
      <div class="desk-copy">
        <h2 class="desk-title">${esc(c.heroTitle)}</h2>
        ${exhibitHtml()}
        <ol class="scan"><li>${esc(c.scan1)}</li><li>${esc(c.scan2)}</li><li>${esc(c.scan3)}</li></ol>
      </div>
      <div class="sheet">
        <p class="kicker">${esc(c.uploadTitle)}</p>
        <input id="camera-input" class="sr-only" type="file" accept="image/*" capture="environment" aria-hidden="true" tabindex="-1">
        <button class="shutter" type="button" data-act="camera">
          <span class="shutter-lens" aria-hidden="true"></span>
          <span><span class="shutter-kicker">${esc(c.photoKicker)}</span><strong>${esc(c.takePhoto)}</strong><small>${esc(c.takePhotoHint)}</small></span>
        </button>
        <label class="drop">
          <input id="file-input" type="file" accept="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg">
          <div><strong>${esc(c.drop)}</strong><div>${esc(c.uploadHint)}</div></div>
        </label>
        ${fileChip}
        <p class="kicker" style="margin-top:22px">${esc(c.samples)}</p>
        <div class="samples">${samples}</div>
        <p class="pages-note">${esc(c.pagesNote)}</p>
        ${state.error ? `<div class="err">${esc(state.error)}</div>` : ""}
        <div class="sheet-actions"><button class="btn primary" type="button" data-act="analyze">${esc(c.analyze)}</button></div>
      </div>
    </section>`;
  }

  function workingHtml() {
    const c = t();
    return `<section class="reading" aria-live="polite">
      <p class="kicker">${esc(c.product)}</p>
      <h2>${esc(c.analyzing)}</h2>
      <p>${esc(c.analyzingSub)}</p>
      <div class="reading-line" aria-hidden="true"></div>
    </section>`;
  }

  function resultHtml() {
    const a = analysis();
    const c = t();
    if (!a) return "";
    const steps = nextSteps(a);
    const meds = sortMedicines(a.medications);
    const summary = a.summary.map((p) => p.trim()).filter(Boolean).slice(0, 5);
    const stay = extractStayTimeline(state.pack.letterText);
    const startChapter = steps.length > 0 ? "next" : "worry";
    const lamp = lampWord(a.worry.level);
    const stayLabel = { admission: c.stayAdmission, procedure: c.stayProcedure, discharge: c.stayDischarge };
    const canTalksheet = a.gpTalkingPoints.length > 0 || steps.length > 0 || meds.length > 0 || a.contacts.length > 0;
    const chapters = [
      { id: "worry", label: c.chapterWorry, hint: lamp, icon: "heart" },
      { id: "next", label: c.chapterNext, count: steps.length || undefined, icon: "list" },
      { id: "meds", label: c.chapterMeds, count: meds.length || undefined, icon: "pill" },
      { id: "letter", label: c.chapterLetter, hint: c.boxHintLetter, icon: "doc" },
      { id: "faq", label: c.chapterFaq, count: a.faq.length || undefined, icon: "ask" },
      { id: "contacts", label: c.chapterCall, count: a.contacts.length || undefined, icon: "phone" },
    ];
    const stayHtml = stay.length
      ? `<div class="stay-rail"><p class="kicker">${esc(c.stayTitle)}</p><ol class="stay-line">${stay
          .map((point) => `<li><span><small>${esc(stayLabel[point.kind])}</small><b>${esc(point.date)}</b></span></li>`)
          .join("")}</ol><p class="stay-note">${esc(c.stayFromLetter)}</p></div>`
      : "";
    const boxes = chapters
      .map((item, i) => {
        const isStart = item.id === startChapter;
        const hint = state.showStartHint && isStart ? c.startHere : item.hint;
        const on = state.chapter === item.id ? " on" : "";
        const startCls = state.showStartHint && isStart ? " is-start" : "";
        return `<button id="tab-${item.id}" type="button" role="tab" class="journey-box has-icon${on}${startCls}" data-act="chapter" data-id="${item.id}" aria-selected="${state.chapter === item.id}" aria-controls="panel-${item.id}" tabindex="${state.chapter === item.id ? 0 : -1}">
          <span class="journey-num">${i + 1}</span>
          <span class="journey-ico" aria-hidden="true">${ICONS[item.icon]}</span>
          <span class="journey-copy"><b>${esc(item.label)}</b>${hint ? `<small>${esc(hint)}</small>` : ""}</span>
          ${item.count ? `<span class="journey-count" aria-hidden="true">${item.count}</span>` : ""}
        </button>`;
      })
      .join("");

    const stepsHtml = steps.length
      ? `<ol class="do-list">${steps
          .map(
            (step, i) => `<li><span class="do-n" aria-hidden="true">${i + 1}</span><div>
          <p class="do">${esc(hideClinicalCodes(step.what))}</p>
          <p class="when${step.byWhen ? " dated" : ""}">${step.byWhen ? `${esc(c.until)} ${esc(step.byWhen)}` : esc(c.noDeadline)}${step.who ? ` · ${esc(step.who)}` : ""}</p>
          ${step.canDecline ? `<p class="meta">${esc(c.decline)}: ${esc(step.howToDecline || (state.lang === "de" ? "Im Brief vorgesehen." : "The letter allows this."))}</p>` : ""}
          ${quoteHtml(`s-${i}`, step.quote)}
        </div></li>`,
          )
          .join("")}</ol>`
      : `<p class="empty-next">${esc(c.noNext)}</p>`;

    const riskHtml = a.far.risiken.length
      ? a.far.risiken
          .map((item, i) => {
            const cert = item.certainty === "kann" ? c.may : item.certainty === "muss" ? c.must : c.notStated;
            return `<div class="risk-item"><p class="do">${esc(hideClinicalCodes(item.ifNot))}</p><p class="meta">${esc(cert)}</p>${quoteHtml(`r-${i}`, item.quote)}</div>`;
          })
          .join("")
      : `<p class="lede">${esc(c.nothing)}</p>`;

    const slots = [c.slotMorning, c.slotNoon, c.slotEvening, c.slotNight];
    const medsHtml = meds.length
      ? `<div class="daystrip" aria-label="${esc(c.morning)}">
          <div class="day-head"><span class="day-name-col" aria-hidden="true"></span>${slots
            .map((slot) => `<span>${esc(slot)}</span>`)
            .join("")}<span class="day-name-col" aria-hidden="true"></span><div class="day-bar"></div></div>
          ${meds
            .map((m) => {
              const dose = parseDoseSlots(m.scheme);
              const cells = dose
                ? dose
                    .map((n) => {
                      const dots =
                        n > 0
                          ? Array.from({ length: Math.min(4, Math.max(1, Math.round(n))) })
                              .map(() => `<i class="dot"></i>`)
                              .join("")
                          : `<i class="dot empty"></i>`;
                      return `<div class="med-cell${n > 0 ? " on" : ""}"><span class="dots" aria-hidden="true">${dots}</span><strong>${n > 0 ? n : "—"}</strong></div>`;
                    })
                    .join("")
                : slots
                    .map(
                      () =>
                        `<div class="med-cell"><span class="dots" aria-hidden="true"><i class="dot empty"></i></span><strong>—</strong></div>`,
                    )
                    .join("");
              return `<article class="med-row"><header class="med-name"><b>${esc(m.name)}</b>${m.dose ? `<span>${esc(m.dose)}</span>` : ""}${m.until ? `<span>${esc(c.until)} ${esc(m.until)}</span>` : ""}${m.note ? `<span>${esc(hideClinicalCodes(m.note))}</span>` : ""}${!dose && m.scheme ? `<span class="scheme">${esc(m.scheme)}</span>` : ""}</header>${cells}</article>`;
            })
            .join("")}
        </div>`
      : `<p class="empty-next">${esc(c.noMeds)}</p>`;

    const detailsHtml = a.details.length
      ? `<div class="letter-block"><p class="kicker">${esc(c.details)}</p>${a.details
          .map(
            (d, i) =>
              `<div class="letter-item"><b>${esc(hideClinicalCodes(d.topic))}</b><p>${esc(hideClinicalCodes(d.plain))}</p>${quoteHtml(`d-${i}`, d.originalQuote)}</div>`,
          )
          .join("")}</div>`
      : "";
    const gapsHtml =
      a.conflicts.length || a.gaps.length
        ? `<div class="letter-block"><p class="kicker">${esc(c.gaps)}</p>${
            a.conflicts.length
              ? `<h3 class="fold-h">${esc(c.conflicts)}</h3><ul class="warn-list">${a.conflicts.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`
              : ""
          }${a.gaps.length ? `<ul class="gap-list">${a.gaps.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`
        : "";
    const gpHtml = a.gpTalkingPoints.length
      ? `<div class="letter-block"><p class="kicker">${esc(c.gp)}</p><ol class="gp-list">${a.gpTalkingPoints.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>`
      : "";

    const asked = new Set(state.chat.filter((m) => m.role === "user").map((m) => m.content));
    const chips = a.faq
      .map((f) => f.question)
      .filter((q) => q && !asked.has(q))
      .slice(0, 4);
    const chatLog = (state.chat.length ? state.chat : [{ role: "assistant", content: c.chatGreeting }])
      .map((m) => `<div class="bubble ${m.role === "user" ? "user" : "bot"}">${esc(m.content)}</div>`)
      .join("");

    const contactsHtml = a.contacts.length
      ? `<ul class="call-list">${a.contacts
          .map((item, i) => {
            const phone = (item.phone || "").trim();
            const tel = phone.replace(/[^\d+]/g, "");
            const canCall = Boolean(tel && /[\d+]/.test(phone));
            return `<li><b>${esc(hideClinicalCodes(item.role))}</b>${item.name ? `<div>${esc(item.name)}</div>` : ""}${
              phone
                ? `<div class="phone"><span class="phone-ico" aria-hidden="true">${ICONS.phone}</span>${canCall ? `<a href="tel:${esc(tel)}">${esc(phone)}</a>` : `<span>${esc(phone)}</span>`}<button class="copy-phone" type="button" data-act="copy-phone" data-phone="${esc(phone)}">${state.copiedPhone === phone ? esc(c.copied) : esc(c.copyPhone)}</button></div>`
                : ""
            }${item.hours ? `<div class="meta">${esc(item.hours)}</div>` : ""}</li>`;
          })
          .join("")}</ul>`
      : `<p class="empty-next">${esc(c.noContacts)}</p>`;

    return `<div class="result-shell">
      <p class="print-only letter-print-head">${esc(c.product)} · ${esc(state.filename)}</p>
      <div class="a11y no-print">
        <button class="btn" type="button" data-act="speak">${esc(state.speaking ? c.stopAudio : c.audio)}</button>
        <button class="btn" type="button" data-act="print">${esc(c.print)}</button>
        ${canTalksheet ? `<button class="btn primary" type="button" data-act="talksheet" title="${esc(c.takeToDoctorHint)}">${esc(c.takeToDoctor)}</button>` : ""}
        <button class="btn ghost" type="button" data-act="reset">${esc(c.newLetter)}</button>
        ${state.filename ? `<span class="pill">${esc(state.filename)}</span>` : ""}
      </div>
      <div class="folio">
        <nav class="journey no-print" aria-label="${esc(c.journeyAria)}">
          ${stayHtml}
          <div class="journey-path" role="tablist" aria-label="${esc(c.pathwayAria)}">${boxes}</div>
        </nav>
        <div class="panes">
          <section id="panel-worry" role="tabpanel" class="pane${state.chapter === "worry" ? " is-on" : ""}">
            <p class="kicker">${esc(c.worryTitle)}</p>
            <p class="worry-word ${a.worry.level}">${esc(lamp)}</p>
            <h2 class="pane-title">${esc(hideClinicalCodes(a.worry.label))}</h2>
            <p class="lede">${esc(hideClinicalCodes(a.worry.why))}</p>
            ${a.about ? `<p class="kicker rule-kicker">${esc(c.aboutTitle)}</p><p class="about">${esc(hideClinicalCodes(a.about))}</p>` : ""}
          </section>
          <section id="panel-next" role="tabpanel" class="pane${state.chapter === "next" ? " is-on" : ""}">
            <p class="kicker">${esc(c.nextTitle)}</p>
            <h2 class="pane-title">${esc(c.farTitle)}</h2>
            <p class="lede">${esc(c.nextHint)}</p>
            ${stepsHtml}
            <div class="risk-block"><p class="kicker">${esc(c.r)}</p>${riskHtml}</div>
          </section>
          <section id="panel-meds" role="tabpanel" class="pane${state.chapter === "meds" ? " is-on" : ""}">
            <p class="kicker">${esc(c.morning)}</p>
            <h2 class="pane-title">${esc(c.meds)}</h2>
            <p class="lede">${esc(c.medsHint)}</p>
            ${medsHtml}
          </section>
          <section id="panel-letter" role="tabpanel" class="pane${state.chapter === "letter" ? " is-on" : ""}">
            <p class="kicker">${esc(c.chapterLetter)}</p>
            <h2 class="pane-title">${esc(c.summary)}</h2>
            ${summary.length ? summary.map((p) => `<p class="summary-p">${esc(hideClinicalCodes(p))}</p>`).join("") : `<p class="lede">${esc(c.noDetails)}</p>`}
            ${detailsHtml}${gapsHtml}${gpHtml}
            ${canTalksheet ? `<div class="talksheet-cta no-print"><p class="kicker">${esc(c.talksheetTitle)}</p><p class="lede">${esc(c.takeToDoctorHint)}</p><button class="btn primary" type="button" data-act="talksheet">${esc(c.takeToDoctor)}</button></div>` : ""}
          </section>
          <section id="panel-faq" role="tabpanel" class="pane faq-pane${state.chapter === "faq" ? " is-on" : ""}">
            <p class="kicker">${esc(c.chapterFaq)}</p>
            <h2 class="pane-title">${esc(c.faq)}</h2>
            ${
              a.faq.length
                ? `<div class="faq-list">${a.faq
                    .map(
                      (f, i) =>
                        `<details class="faq-item"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p>${quoteHtml(`f-${i}`, f.quote)}</details>`,
                    )
                    .join("")}</div>`
                : `<p class="empty-next">${esc(c.noFaq)}</p>`
            }
            <div class="faq-chat no-print">
              <section class="chat-panel in-pane" aria-label="${esc(c.chat)}">
                <header><strong>${esc(c.askTitle)}</strong></header>
                <p class="meta chat-hint">${esc(c.chatHint)}</p>
                ${chips.length ? `<div class="chat-chips" aria-label="${esc(c.suggested)}">${chips.map((q) => `<button type="button" class="chat-chip" data-act="ask" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>` : ""}
                <div class="chat-log">${chatLog}</div>
                <form class="chat-form" data-act="chat-form">
                  <textarea id="chat-input" placeholder="${esc(c.chatPlaceholder)}">${esc(state.chatText)}</textarea>
                  <button class="btn primary" type="submit">${esc(c.send)}</button>
                </form>
              </section>
            </div>
          </section>
          <section id="panel-contacts" role="tabpanel" class="pane${state.chapter === "contacts" ? " is-on" : ""}">
            <p class="kicker">${esc(c.chapterCall)}</p>
            <h2 class="pane-title">${esc(c.callTitle)}</h2>
            ${contactsHtml}
          </section>
        </div>
      </div>
      <p class="disclaimer">${esc(c.disclaimer)}</p>
      <article class="talksheet" aria-hidden="true">
        <p class="print-only">${esc(c.product)} · ${esc(c.talksheetTitle)}${state.filename ? ` · ${esc(state.filename)}` : ""}</p>
        <p class="kicker">${esc(c.talksheetTitle)}</p>
        <h2 class="pane-title">${esc(hideClinicalCodes(a.about) || c.gp)}</h2>
        <p class="lede">${esc(c.talksheetLead)}</p>
        ${steps.length ? `<div class="letter-block"><p class="kicker">${esc(c.farTitle)}</p><ol class="gp-list">${steps.map((s) => `<li>${esc(hideClinicalCodes(s.what))}${s.byWhen ? ` — ${esc(c.until)} ${esc(s.byWhen)}` : ""}</li>`).join("")}</ol></div>` : ""}
        ${meds.length ? `<div class="letter-block"><p class="kicker">${esc(c.meds)}</p><ul class="gap-list">${meds.map((m) => `<li>${esc(m.name)}${m.dose ? ` · ${esc(m.dose)}` : ""}${m.scheme ? ` · ${esc(m.scheme)}` : ""}${m.until ? ` · ${esc(c.until)} ${esc(m.until)}` : ""}</li>`).join("")}</ul></div>` : ""}
        ${a.gpTalkingPoints.length ? `<div class="letter-block"><p class="kicker">${esc(c.gp)}</p><ol class="gp-list">${a.gpTalkingPoints.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>` : ""}
        ${a.contacts.length ? `<div class="letter-block"><p class="kicker">${esc(c.callTitle)}</p><ul class="gap-list">${a.contacts.map((x) => `<li>${esc(hideClinicalCodes(x.role))}${x.name ? ` · ${esc(x.name)}` : ""}${x.phone ? ` · ${esc(x.phone)}` : ""}</li>`).join("")}</ul></div>` : ""}
        <p class="disclaimer">${esc(c.disclaimer)}</p>
      </article>
    </div>`;
  }

  function render() {
    const c = t();
    const root = document.getElementById("app");
    document.documentElement.lang = state.lang;
    document.documentElement.classList.toggle("xl", state.large);
    document.body.classList.toggle("xl", state.large);
    document.title =
      state.lang === "de"
        ? "Klarblick — Ihr Arztbrief. In Ruhe verstanden."
        : "Klarblick — Your discharge letter. Understood, calmly.";
    const main = state.screen === "result" ? resultHtml() : state.screen === "working" ? workingHtml() : homeHtml();
    root.innerHTML = `
      <a class="skip" href="#main">${esc(c.skip)}</a>
      <div class="banner">${esc(c.safety)}</div>
      <main class="${state.screen === "result" ? "wrap wrap-wide" : "wrap"}" id="main">
        <header class="topbar">
          <div class="brand">
            <p class="kicker">${esc(c.kicker)}</p>
            <h1>${esc(c.product)}</h1>
            <p>${esc(c.tagline)}</p>
          </div>
          <div class="tools no-print">
            <div id="lang-switch" class="lang-switch" role="group" aria-label="${esc(c.langAria)}">
              <button type="button" data-act="lang" data-lang="de" class="${state.lang === "de" ? "on" : ""}" aria-pressed="${state.lang === "de"}">DE</button>
              <button type="button" data-act="lang" data-lang="en" class="${state.lang === "en" ? "on" : ""}" aria-pressed="${state.lang === "en"}">EN</button>
            </div>
            <button class="btn" type="button" data-act="large" aria-pressed="${state.large}">${esc(c.large)}</button>
          </div>
        </header>
        ${main}
        ${state.error && state.screen === "result" ? `<div class="err">${esc(state.error)}</div>` : ""}
        <section class="business">
          <h2>${esc(c.business)}</h2>
          <p>${esc(c.businessBody)}</p>
          <p class="eu-note">${esc(c.eu)}</p>
        </section>
      </main>`;
    bind();
  }

  function bind() {
    const fileInput = document.getElementById("file-input");
    const cameraInput = document.getElementById("camera-input");
    if (fileInput) {
      fileInput.addEventListener("change", () => {
        state.file = fileInput.files?.[0] || null;
        if (state.file) state.sampleId = null;
        state.error = null;
        render();
      });
    }
    if (cameraInput) {
      cameraInput.addEventListener("change", () => {
        state.file = cameraInput.files?.[0] || null;
        if (state.file) state.sampleId = null;
        state.error = null;
        render();
      });
    }
    const chatInput = document.getElementById("chat-input");
    if (chatInput) {
      chatInput.addEventListener("input", () => {
        state.chatText = chatInput.value;
      });
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendChat(state.chatText);
        }
      });
    }
    const log = document.querySelector(".chat-log");
    if (log) log.scrollTop = log.scrollHeight;

    const exhibit = document.querySelector(".letter-exhibit");
    if (exhibit) {
      let start = null;
      let skipClick = false;
      exhibit.addEventListener("pointerdown", (e) => {
        start = { x: e.clientX, y: e.clientY };
        skipClick = false;
        exhibit.setPointerCapture(e.pointerId);
      });
      exhibit.addEventListener("pointerup", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 46 || Math.abs(dx) <= Math.abs(dy)) return;
        skipClick = true;
        state.exhibitOpen = !state.exhibitOpen;
        render();
      });
      exhibit.addEventListener("click", (e) => {
        if (skipClick) {
          skipClick = false;
          e.preventDefault();
        }
      });
    }
  }

  function openLetter(id, filename) {
    const pack = DATA.byId[id];
    if (!pack) return;
    state.screen = "working";
    state.error = null;
    state.pack = pack;
    state.filename = filename || pack.filename;
    state.openQuotes = {};
    state.chat = [];
    state.chatText = "";
    state.speaking = false;
    window.speechSynthesis?.cancel();
    render();
    window.setTimeout(() => {
      const a = pack[state.lang];
      const steps = nextSteps(a);
      state.chapter = steps.length > 0 ? "next" : "worry";
      state.showStartHint = true;
      state.screen = "result";
      render();
    }, 700);
  }

  function sendChat(raw) {
    const message = String(raw || "").trim();
    if (!message) return;
    const c = t();
    if (!state.chat.length) state.chat = [{ role: "assistant", content: c.chatGreeting }];
    state.chat.push({ role: "user", content: message });
    state.chat.push({ role: "assistant", content: groundedReply(message) });
    state.chatText = "";
    render();
  }

  function speak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (state.speaking) {
      state.speaking = false;
      render();
      return;
    }
    const a = analysis();
    if (!a) return;
    const steps = nextSteps(a);
    const bits = [a.worry.label, a.worry.why, a.about, ...steps.map((s) => `${s.what}. ${s.byWhen || ""}`), ...a.summary];
    const utter = new SpeechSynthesisUtterance(bits.filter(Boolean).join(". "));
    utter.lang = state.lang === "de" ? "de-DE" : "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => (state.lang === "de" ? v.lang.startsWith("de") : v.lang.startsWith("en")));
    if (match) utter.voice = match;
    utter.rate = 0.92;
    utter.onend = () => {
      state.speaking = false;
      render();
    };
    state.speaking = true;
    window.speechSynthesis.speak(utter);
    render();
  }

  function printTalksheet() {
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

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    if (act === "lang") {
      state.lang = btn.getAttribute("data-lang") === "en" ? "en" : "de";
      window.speechSynthesis?.cancel();
      state.speaking = false;
      if (state.screen === "result" && state.pack) {
        const steps = nextSteps(state.pack[state.lang]);
        state.chapter = steps.length > 0 ? "next" : "worry";
      }
      render();
    } else if (act === "large") {
      state.large = !state.large;
      render();
    } else if (act === "sample") {
      state.sampleId = btn.getAttribute("data-id");
      state.file = null;
      state.error = null;
      const fileInput = document.getElementById("file-input");
      const cameraInput = document.getElementById("camera-input");
      if (fileInput) fileInput.value = "";
      if (cameraInput) cameraInput.value = "";
      render();
    } else if (act === "clear-file") {
      state.file = null;
      state.error = null;
      render();
    } else if (act === "camera") {
      document.getElementById("camera-input")?.click();
    } else if (act === "analyze") {
      if (state.sampleId) {
        openLetter(state.sampleId);
        return;
      }
      if (state.file) {
        const matched = matchUpload(state.file);
        if (matched) {
          openLetter(matched, state.file.name);
          return;
        }
        state.error = t().unknown;
        render();
        return;
      }
      state.error = t().pickFirst;
      render();
    } else if (act === "exhibit") {
      state.exhibitOpen = !state.exhibitOpen;
      render();
    } else if (act === "chapter") {
      state.chapter = btn.getAttribute("data-id");
      state.showStartHint = false;
      render();
    } else if (act === "quote") {
      const id = btn.getAttribute("data-id");
      state.openQuotes[id] = !state.openQuotes[id];
      render();
    } else if (act === "reset") {
      window.speechSynthesis?.cancel();
      state.screen = "home";
      state.pack = null;
      state.error = null;
      state.file = null;
      state.sampleId = null;
      state.chat = [];
      render();
    } else if (act === "speak") {
      speak();
    } else if (act === "print") {
      window.print();
    } else if (act === "talksheet") {
      printTalksheet();
    } else if (act === "copy-phone") {
      const phone = btn.getAttribute("data-phone") || "";
      navigator.clipboard
        ?.writeText(phone)
        .then(() => {
          state.copiedPhone = phone;
          render();
          window.setTimeout(() => {
            if (state.copiedPhone === phone) {
              state.copiedPhone = null;
              render();
            }
          }, 1600);
        })
        .catch(() => {});
    } else if (act === "ask") {
      sendChat(btn.getAttribute("data-q") || "");
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-act=chat-form]")) {
      e.preventDefault();
      sendChat(state.chatText);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (state.screen !== "result") return;
    if (!e.target.closest(".journey-path")) return;
    const ids = ["worry", "next", "meds", "letter", "faq", "contacts"];
    const i = ids.indexOf(state.chapter);
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(i + 1, ids.length - 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(i - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    else return;
    e.preventDefault();
    state.chapter = ids[next];
    state.showStartHint = false;
    render();
    document.getElementById(`tab-${ids[next]}`)?.focus();
  });

  render();
})();
