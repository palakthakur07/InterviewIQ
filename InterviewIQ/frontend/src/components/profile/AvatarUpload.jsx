import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function AvatarUpload({ name, avatarUrl, onUpload, isUploading }) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const initials = (name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    onUpload(file);
    e.target.value = '';
  }

  const resolvedSrc = localPreview || (avatarUrl ? `${API_ORIGIN}${avatarUrl}` : null);

  return (
    <div className="relative h-24 w-24 shrink-0">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-signal-gradient font-display text-2xl font-semibold text-white">
        {resolvedSrc ? (
          <img src={resolvedSrc} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label="Change photo"
        className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper bg-ink-surface text-paper shadow-lg transition-transform hover:scale-105 disabled:opacity-60 dark:border-ink dark:bg-paper-surface dark:text-ink"
      >
        {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
