import { GeoAuditForm } from "@/components/GeoAuditForm";

export function LandingCta({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="final-cta landing-cta-block" id="try-citelens">
      <h2>{title}</h2>
      <p>{description}</p>
      <GeoAuditForm />
    </section>
  );
}
