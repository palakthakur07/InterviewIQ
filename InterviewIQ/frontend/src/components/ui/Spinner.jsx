const SIZES = { sm: 14, md: 18, lg: 24 };

export default function Spinner({ size = 'md', label = 'Loading', className = '' }) {
  const px = SIZES[size] || SIZES.md;

  return (
    <span role="status" aria-label={label} className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
