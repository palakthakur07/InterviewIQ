import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/auth/FormField';
import PasswordInput from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validators';

const INITIAL_FORM = { email: '', password: '' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Could not log you in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to InterviewIQ"
      subtitle="Pick up where you left off and keep sharpening your interview answers."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral"
          >
            {serverError}
          </div>
        )}

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
        />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              Log in
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-signal-600 hover:underline dark:text-cyan">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
