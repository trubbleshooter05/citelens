"use client";

import { FormEvent, useState } from "react";

const FORMSPREE_ID = "xbdwogda";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="email-capture">
        <p className="email-capture-confirm">
          Got it. We&apos;ll email you when live audits open for your site.
        </p>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <p className="email-capture-label">
        Get a free AI visibility audit — join the waitlist for your site.
      </p>
      <form className="email-capture-form" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="you@yourbrand.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Get free audit"}
        </button>
      </form>
      {status === "error" && (
        <p className="email-capture-error">Something went wrong. Email hello@citelens.app directly.</p>
      )}
    </div>
  );
}
