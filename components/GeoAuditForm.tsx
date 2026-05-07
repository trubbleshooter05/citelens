"use client";

import { FormEvent, useState } from "react";

export function GeoAuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [site, setSite] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }

  return (
    <form className="audit-form" onSubmit={handleSubmit}>
      <label htmlFor="site">Brand or website</label>
      <div>
        <input
          id="site"
          onChange={(event) => setSite(event.target.value)}
          placeholder="yourbrand.com"
          required
          value={site}
        />
        <button type="submit">Run sample audit</button>
      </div>
      {submitted ? (
        <p>
          Demo report loaded using sample data for {site}. A real audit will
          connect live AI results after early access.
        </p>
      ) : null}
    </form>
  );
}
