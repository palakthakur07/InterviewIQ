import { FileSearch, BrainCircuit, Gauge, Building2, LineChart, FileDown } from 'lucide-react';

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Resume intelligence',
    description:
      'Drop in a PDF or DOCX and the parser extracts your real skills, projects, and tech stack — no manual tagging.',
    accent: 'text-signal-600 bg-signal-50 dark:bg-signal-500/10 dark:text-signal-300',
  },
  {
    icon: BrainCircuit,
    title: 'Questions built from your work',
    description:
      'Gemini generates technical and project-specific questions tied to what you actually shipped, plus live follow-ups.',
    accent: 'text-cyan bg-cyan/10',
  },
  {
    icon: Gauge,
    title: 'Scored in real time',
    description:
      'Every answer is evaluated instantly against a role rubric, with a score and one concrete way to improve it.',
    accent: 'text-mint bg-mint/10',
  },
  {
    icon: Building2,
    title: 'Company mode',
    description:
      'Switch the interview style and difficulty to match Google, Amazon, Microsoft, or Atlassian conventions.',
    accent: 'text-amber bg-amber/10',
  },
  {
    icon: LineChart,
    title: 'Progress dashboard',
    description:
      'Track score trends across sessions and see which skill areas need another round before the real thing.',
    accent: 'text-coral bg-coral/10',
  },
  {
    icon: FileDown,
    title: 'Hiring-style report',
    description:
      'Finish with a downloadable PDF report: overall score, strengths, weaknesses, and next steps — ready to share.',
    accent: 'text-signal-600 bg-signal-50 dark:bg-signal-500/10 dark:text-signal-300',
  },
];

export default function Features() {
  return (
    <section className="border-t border-paper-line py-24 dark:border-ink-line">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">What it does</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything a real interview loop needs, minus the scheduling.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 dark:text-paper/70">
            InterviewIQ isn't a chatbot with a question bank. It's a pipeline: parse your
            resume, generate a tailored interview, score every response, and hand you a report
            you can act on.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-signal-500/40 hover:shadow-lg hover:shadow-signal-500/10"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
              >
                <Icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
