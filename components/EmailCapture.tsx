"use client";

import { FormEvent, useState } from "react";

// To activate: sign up at formspree.io (free), create a form, paste your form ID below
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
          ✓ You&apos;re on the list — we&apos;ll send your sample report within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <p className="email-capture-label">
        Get a sample audit report for your site — free.
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
          {status === "loading" ? "Sending…" : "Send me the report"}
        </button>
      </form>
      {status === "error" && (
        <p className="email-capture-error">Something went wrong — email hello@citelens.app directly.</p>
      )}
    </div>
  );
}
