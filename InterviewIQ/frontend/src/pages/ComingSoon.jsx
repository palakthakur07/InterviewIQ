import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink dark:bg-ink dark:text-paper">
      <span className="eyebrow">Under construction</span>
      <h1 className="mt-4 font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
        This part of InterviewIQ is being built next. The landing page comes first.
      </p>
      <Link to="/" className="btn-secondary mt-8">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  );
}
