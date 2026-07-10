import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/auth/FormField';
import PasswordInput from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { validateSignup } from '../utils/validators';

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' };

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as soon as the person starts fixing it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateSignup(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Upload a resume and run your first mock interview in a couple of minutes."
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
          id="name"
          name="name"
          label="Full name"
          placeholder="Jordan Patel"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isSubmitting}
        />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-signal-600 hover:underline dark:text-cyan">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
