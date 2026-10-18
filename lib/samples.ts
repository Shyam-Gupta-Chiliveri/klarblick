import type { Lang } from "./copy";

export type SampleLetter = {
  id: string;
  title: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  file: string;
  mime: string;
  stay: string;
};

export const SAMPLE_LETTERS: SampleLetter[] = [
  {
    id: "minimal",
    title: { de: "Hüft-TEP — Kurzbrief", en: "Hip replacement — short letter" },
    subtitle: { de: "Pia Paul · Orthopädie · 5 Tage", en: "Pia Paul · orthopaedics · 5 days" },
    file: "minimal.pdf",
    mime: "application/pdf",
    stay: "01.04.–06.04.2022",
  },
  {
    id: "orthopaedisch",
    title: { de: "Hüft-TEP — voller Entlassbrief", en: "Hip replacement — full discharge letter" },
    subtitle: { de: "Pia Paul · inkl. Medikation & AHB", en: "Pia Paul · including medicines & rehab" },
    file: "orthopaedisch.pdf",
    mime: "application/pdf",
    stay: "01.04.–06.04.2022",
  },
  {
    id: "kardiologisch",
    title: { de: "Herzkatheter & Stent", en: "Heart catheter & stent" },
    subtitle: { de: "Ludger Königsstein · Kardiologie", en: "Ludger Königsstein · cardiology" },
    file: "kardiologisch.pdf",
    mime: "application/pdf",
    stay: "22.06.–24.06.2022",
  },
  {
    id: "herzchirurgie",
    title: { de: "Herzchirurgie — Scan", en: "Heart surgery — scan" },
    subtitle: { de: "Aortenklappen-OP · Foto-Arztbrief", en: "Aortic valve surgery · photo letter" },
    file: "herzchirurgie.jpg",
    mime: "image/jpeg",
    stay: "Oktober",
  },
];

export function getSample(id: string): SampleLetter | undefined {
  return SAMPLE_LETTERS.find((s) => s.id === id);
}
