const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;
const MAX_TRACKED_KEYS = 10_000;

const windows = new Map<string, { count: number; resetAt: number }>();

// Best effort: the counters live in the memory of one instance, which is enough to blunt a single noisy client.
export function isRateLimited(key: string, now = Date.now()): boolean {
  if (windows.size > MAX_TRACKED_KEYS) {
    for (const [trackedKey, entry] of windows) if (entry.resetAt <= now) windows.delete(trackedKey);
    if (windows.size > MAX_TRACKED_KEYS) windows.clear();
  }

  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}
