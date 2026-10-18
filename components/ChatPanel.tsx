"use client";

import { useEffect, useRef, useState } from "react";
import { copy, type Lang } from "@/lib/copy";
import type { LetterAnalysis } from "@/lib/schema";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatPanel({
  analysis,
  letterText,
  lang,
  suggestions = [],
  embedded = false,
  onClose,
}: {
  analysis: LetterAnalysis;
  letterText: string;
  lang: Lang;
  suggestions?: string[];
  embedded?: boolean;
  onClose?: () => void;
}) {
  const t = copy[lang];
  const logRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: t.chatGreeting },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMessages((msgs) => {
      if (msgs.length === 1 && msgs[0].role === "assistant") {
        return [{ role: "assistant", content: t.chatGreeting }];
      }
      return msgs;
    });
  }, [lang, t.chatGreeting]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function send(raw?: string) {
    const message = (raw ?? text).trim();
    if (!message || busy) return;
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          letterText,
          analysis,
          history: next.slice(1, -1),
          language: lang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat fehlgeschlagen");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Chat fehlgeschlagen",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const chips = suggestions.filter((q) => q && !asked.has(q)).slice(0, 4);

  return (
    <section className={embedded ? "chat-panel in-pane" : "chat-panel"} aria-label={t.chat}>
      <header>
        <strong>{embedded ? t.askTitle : t.chat}</strong>
        {onClose ? (
          <button className="btn" type="button" onClick={onClose} style={{ color: "#1c1914" }}>
            ×
          </button>
        ) : null}
      </header>
      <p className="meta chat-hint">{t.chatHint}</p>
      {chips.length > 0 && (
        <div className="chat-chips" aria-label={t.suggested}>
          {chips.map((q) => (
            <button
              key={q}
              type="button"
              className="chat-chip"
              disabled={busy}
              onClick={() => void send(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="bubble bot">…</div>}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.chatPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button className="btn primary" type="submit" disabled={busy}>
          {t.send}
        </button>
      </form>
    </section>
  );
}
