const STEPS = [
  {
    number: '01',
    title: 'Upload your resume',
    description:
      'Drag in a PDF or DOCX. InterviewIQ extracts your skills, projects, and technologies in seconds.',
  },
  {
    number: '02',
    title: 'AI builds your interview',
    description:
      'Pick a company mode if you want one, and Gemini assembles a question set from your actual background.',
  },
  {
    number: '03',
    title: 'Answer, get feedback, repeat',
    description:
      'Type your answer, get an instant score and critique, then move to the next question or a follow-up.',
  },
  {
    number: '04',
    title: 'Walk away with a report',
    description:
      'Overall score, strengths, weaknesses, and improvement suggestions — exportable as a PDF.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-paper-line py-24 dark:border-ink-line">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">The flow</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            From resume to results in four steps.
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
                <span className="font-mono text-sm text-signal-600 dark:text-cyan">
                  {step.number}
                </span>
                <span className="hidden h-px flex-1 bg-paper-line dark:bg-ink-line lg:hidden" />
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold lg:mt-4">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
                {step.description}
              </p>
              <span className="mt-6 hidden h-px w-full bg-gradient-to-r from-paper-line to-transparent dark:from-ink-line lg:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
