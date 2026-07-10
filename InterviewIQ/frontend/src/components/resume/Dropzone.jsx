import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function validateFile(file) {
  const ext = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return 'Only PDF and DOCX files are supported.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'File is too large. Maximum size is 5MB.';
  }
  return null;
}

export default function Dropzone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError('');
      onFileSelected(file);
    },
    [onFileSelected],
  );

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) inputRef.current?.click();
        }}
        aria-disabled={disabled}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors duration-200 ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${
          isDragging
            ? 'border-signal-500 bg-signal-50 dark:bg-signal-500/10'
            : 'border-paper-line hover:border-signal-500/50 dark:border-ink-line'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-gradient text-white">
          {isDragging ? <FileText size={24} /> : <UploadCloud size={24} />}
        </span>
        <p className="mt-4 font-display text-base font-semibold">
          Drag &amp; drop your resume here
        </p>
        <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">
          or click to browse — PDF or DOCX, up to 5MB
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
    </div>
  );
}
