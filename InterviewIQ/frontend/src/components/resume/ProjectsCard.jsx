import { FolderGit2 } from 'lucide-react';

export default function ProjectsCard({ projects }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
          <FolderGit2 size={15} />
        </span>
        <h3 className="font-display text-sm font-semibold">Projects</h3>
        <span className="ml-auto font-mono text-xs text-ink/40 dark:text-paper/40">
          {projects.length}
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="mt-4 text-sm text-ink/45 dark:text-paper/45">
          No project section was detected in this resume.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {projects.map((project, i) => (
            <div
              key={`${project.title}-${i}`}
              className="rounded-xl border border-paper-line p-4 dark:border-ink-line"
            >
              <p className="font-display text-sm font-semibold">{project.title}</p>
              {project.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                  {project.description}
                </p>
              )}
              {project.technologies?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-signal-50 px-2.5 py-0.5 text-[11px] font-medium text-signal-700 dark:bg-signal-500/10 dark:text-cyan"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
