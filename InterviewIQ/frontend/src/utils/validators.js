const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!/\d/.test(password)) errors.password = 'Password must contain at least one number';

  if (!confirmPassword) errors.confirmPassword = 'Confirm your password';
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';

  return errors;
}
