import { GraduationCap } from 'lucide-react';

export default function EducationCard({ education }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10 text-mint">
          <GraduationCap size={15} />
        </span>
        <h3 className="font-display text-sm font-semibold">Education</h3>
        <span className="ml-auto font-mono text-xs text-ink/40 dark:text-paper/40">
          {education.length}
        </span>
      </div>

      {education.length === 0 ? (
        <p className="mt-4 text-sm text-ink/45 dark:text-paper/45">
          No education section was detected in this resume.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {education.map((entry, i) => (
            <div
              key={`${entry.institution}-${i}`}
              className="rounded-xl border border-paper-line p-4 dark:border-ink-line"
            >
              <p className="font-display text-sm font-semibold">{entry.degree}</p>
              <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{entry.institution}</p>
              {entry.year && (
                <span className="mt-2 inline-block rounded-full bg-paper-line/60 px-2.5 py-0.5 font-mono text-[11px] text-ink/55 dark:bg-ink-line/60 dark:text-paper/55">
                  {entry.year}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
