# Web Interface Guidelines (Vercel)
# source: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## Accessibility
- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`)
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- Decorative icons need `aria-hidden="true"`
- Async updates need `aria-live="polite"`
- Semantic HTML before ARIA
- Headings hierarchical `<h1>`–`<h6>`

## Focus States
- `focus-visible:ring-*` or equivalent
- Never `outline-none` without replacement
- `:focus-visible` over `:focus`

## Forms
- Inputs need `autocomplete` and meaningful `name`
- Correct `type` (`email`, `tel`, `url`, `number`)
- Placeholders end with `…`
- Errors inline; focus first error on submit
- `autocomplete="off"` on non-auth fields

## Animation
- Honor `prefers-reduced-motion`
- Animate `transform`/`opacity` only
- Never `transition: all`

## Typography
- `…` not `...`
- Curly quotes
- Loading states end with `…`
- `tabular-nums` for number columns

## Content Handling
- `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0`
- Handle empty states

## Performance
- Large lists (>50): virtualize
- Prefer uncontrolled inputs
- `<link rel="preconnect">` for CDN

## Navigation & State
- URL reflects state
- Links use `<a>`/`<Link>`
- Destructive actions need confirmation

## Anti-patterns
- `transition: all`
- `outline-none` without replacement
- `<div>` with click handlers (should be `<button>`)
- Form inputs without labels
- Icon buttons without `aria-label`
- Hardcoded date/number formats
