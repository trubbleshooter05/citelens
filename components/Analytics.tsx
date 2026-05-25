"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export type AttributionPayload = {
  landing_page: string;
  referrer: string;
  ga_client_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const ATTRIBUTION_KEY = "citelens_attribution_v1";
const GA_CLIENT_ID_KEY = "citelens_ga_client_id_v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function readAttribution(): AttributionPayload | null {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as AttributionPayload) : null;
  } catch {
    return null;
  }
}

function writeAttribution(value: AttributionPayload) {
  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
  } catch {
    // Attribution must never block the page.
  }
}

function captureGaClientId() {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("get", GA_MEASUREMENT_ID, "client_id", (clientId: string) => {
    if (!clientId) return;
    try {
      window.localStorage.setItem(GA_CLIENT_ID_KEY, clientId);
    } catch {
      // Storage can be blocked; GA pageview still works.
    }
  });
}

export function getAttributionPayload(): AttributionPayload | null {
  if (typeof window === "undefined") return null;
  const stored = readAttribution();
  const gaClientId = window.localStorage.getItem(GA_CLIENT_ID_KEY) || stored?.ga_client_id;
  if (!stored && !gaClientId) return null;
  return {
    ...(stored ?? {
      landing_page: window.location.href,
      referrer: document.referrer || "",
    }),
    ...(gaClientId ? { ga_client_id: gaClientId } : {}),
  };
}

export function trackConversion(eventName: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    ...params,
    ...(getAttributionPayload() ?? {}),
  });
}

export function Analytics() {
  useEffect(() => {
    const current = new URL(window.location.href);
    const existing = readAttribution();
    const hasUtm = UTM_KEYS.some((key) => current.searchParams.has(key));

    if (!existing || hasUtm) {
      const next: AttributionPayload = {
        landing_page: existing?.landing_page || current.href,
        referrer: existing?.referrer || document.referrer || "",
      };
      UTM_KEYS.forEach((key) => {
        const value = current.searchParams.get(key) || existing?.[key];
        if (value) next[key] = value;
      });
      writeAttribution(next);
    }

    captureGaClientId();
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
