import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaBand() {
  return (
    <section className="border-t border-paper-line py-20 dark:border-ink-line">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-signal-gradient px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative font-display text-3xl font-semibold text-white sm:text-4xl">
            Your resume is ready for its first real interview.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Upload it, pick a company mode if you like, and get scored feedback on your very
            first answer.
          </p>
          <Link
            to="/signup"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-display text-sm font-semibold text-signal-700 transition-transform hover:-translate-y-0.5"
          >
            Start free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
