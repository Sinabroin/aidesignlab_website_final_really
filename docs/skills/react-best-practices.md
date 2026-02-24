# Vercel React Best Practices
# source: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md

## Priority 1: Eliminating Waterfalls (CRITICAL)
- `async-parallel` — Use Promise.all() for independent operations
- `async-defer-await` — Move await into branches where actually used
- `async-suspense-boundaries` — Use Suspense to stream content

## Priority 2: Bundle Size (CRITICAL)
- `bundle-barrel-imports` — Import directly, avoid barrel files
- `bundle-dynamic-imports` — Use next/dynamic for heavy components
- `bundle-defer-third-party` — Load analytics/logging after hydration

## Priority 3: Server-Side (HIGH)
- `server-auth-actions` — Authenticate server actions like API routes
- `server-cache-react` — Use React.cache() for per-request dedup
- `server-serialization` — Minimize data passed to client components
- `server-parallel-fetching` — Parallelize fetches

## Priority 4: Client-Side Data (MEDIUM-HIGH)
- `client-swr-dedup` — SWR for request dedup
- `client-passive-event-listeners` — Passive listeners for scroll

## Priority 5: Re-render (MEDIUM)
- `rerender-memo` — Extract expensive work into memoized components
- `rerender-derived-state` — Subscribe to derived booleans, not raw values
- `rerender-lazy-state-init` — Pass function to useState for expensive values
- `rerender-functional-setstate` — Functional setState for stable callbacks

## Priority 6: Rendering (MEDIUM)
- `rendering-content-visibility` — Use for long lists
- `rendering-hoist-jsx` — Extract static JSX outside components
- `rendering-conditional-render` — Use ternary, not && for conditionals

## Priority 7: JS Performance (LOW-MEDIUM)
- `js-set-map-lookups` — O(1) lookups
- `js-early-exit` — Return early from functions
- `js-combine-iterations` — Combine filter/map into one loop
