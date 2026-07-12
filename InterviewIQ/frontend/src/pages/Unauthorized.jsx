import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import ErrorState from '../components/ui/ErrorState';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
      <ErrorState
        icon={ShieldOff}
        title="Access restricted"
        description="You don't have permission to view this page. If you think this is a mistake, contact an administrator."
        action={
          <Link to="/dashboard" className="btn-primary">
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
