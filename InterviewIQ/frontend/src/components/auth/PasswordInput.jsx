import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormField from './FormField';

export default function PasswordInput({ id, label, error, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      id={id}
      label={label}
      error={error}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="text-ink/40 transition-colors hover:text-signal-600 dark:text-paper/40 dark:hover:text-cyan"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
      {...inputProps}
    />
  );
}
