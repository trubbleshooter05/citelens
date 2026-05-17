type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection({
  headingId = "faq-heading",
  items,
}: {
  headingId?: string;
  items: FaqItem[];
}) {
  return (
    <section className="dashboard landing-faq" aria-labelledby={headingId}>
      <h2 id={headingId}>Frequently asked questions</h2>
      <dl className="faq-list">
        {items.map((item) => (
          <div key={item.question} className="faq-item">
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
