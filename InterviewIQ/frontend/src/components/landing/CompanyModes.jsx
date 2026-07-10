const COMPANIES = [
  { name: 'Google', note: 'Systems depth, clarifying questions, whiteboard-style reasoning' },
  { name: 'Amazon', note: 'Leadership-principle framing woven into technical follow-ups' },
  { name: 'Microsoft', note: 'Design-oriented, collaborative problem walkthroughs' },
  { name: 'Atlassian', note: 'Values-driven, product-sense-aware technical discussion' },
];

export default function CompanyModes() {
  return (
    <section id="company-mode" className="border-t border-paper-line py-24 dark:border-ink-line">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow">Bonus · Company mode</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Same resume, different interview loop.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70 dark:text-paper/70">
              Difficulty, pacing, and question style shift to match the company you pick — so
              the practice you get actually resembles the room you'll be in.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {COMPANIES.map((company) => (
              <div
                key={company.name}
                className="card p-5 transition-colors duration-300 hover:border-signal-500/40"
              >
                <span className="font-display text-base font-semibold">{company.name}</span>
                <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                  {company.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
