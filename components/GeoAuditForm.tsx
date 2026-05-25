"use client";

import { FormEvent, useState } from "react";
import { trackConversion } from "@/components/Analytics";

export function GeoAuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [site, setSite] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const eventKey = `citelens_demo_report_${site.trim().toLowerCase()}`;
    if (!window.sessionStorage.getItem(eventKey)) {
      window.sessionStorage.setItem(eventKey, "1");
      trackConversion("demo_report_view", {
        method: "demo_audit_form",
        item_name: "CiteLens demo report",
        item_id: "demo_report",
        quantity: 1,
        value: 0,
        currency: "USD",
      });
    }
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
        <button type="submit">View demo report</button>
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
