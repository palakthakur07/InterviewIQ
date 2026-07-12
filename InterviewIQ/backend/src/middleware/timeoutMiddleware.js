const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Mounted globally in app.js. If a request hasn't finished within the
 * timeout window, respond with 503 and mark the request so the error
 * handler / any in-flight controller code can short-circuit.
 *
 * This is a safety net, not a replacement for the per-service timeouts
 * that already exist (e.g. Gemini's own AbortController) — it exists for
 * paths that don't have one, like a slow Mongo query.
 */
export default function requestTimeout(ms = DEFAULT_TIMEOUT_MS) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (res.headersSent) return;
      req.timedOut = true;
      res.status(503).json({
        success: false,
        message: 'The request took too long to process. Please try again.',
      });
    }, ms);

    res.once('finish', () => clearTimeout(timer));
    res.once('close', () => clearTimeout(timer));

    next();
  };
}
