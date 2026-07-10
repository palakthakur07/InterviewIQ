import { useEffect, useRef, useState } from 'react';

/**
 * Count-up timer in seconds. Resets to 0 whenever `resetKey` changes
 * (pass the current question id) and pauses when `paused` is true.
 */
export function useInterviewTimer(resetKey, paused = false) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return undefined;
    }
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [resetKey, paused]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return { seconds, formatted };
}
