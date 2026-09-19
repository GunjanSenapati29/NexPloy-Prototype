// ============================================================
// API MODE FLAG
// "mock" (default) — every src/lib/api/*.ts domain function resolves
// from src/data/mock + src/lib/simulate.ts, synchronously wrapped in a
// resolved Promise. No network call happens in this mode.
// "live" — reserved for when a real backend exists. Domain files would
// then route through client.ts's apiRequest() instead of the mock
// wrap. Nothing in this codebase branches on API_MODE yet; it exists so
// that swap is a single flag flip, not a rewrite.
// ============================================================

export const API_MODE: "mock" | "live" =
  (process.env.NEXT_PUBLIC_API_MODE as "mock" | "live") ?? "mock";
