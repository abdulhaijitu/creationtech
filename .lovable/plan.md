

## Fix: Service Description Rendering Raw HTML

### Problem
Line 54 renders description as plain text (`{tab.description}`), but the database stores HTML content. This causes raw HTML tags to show up visually.

### Solution
Replace the `<p>` tag with a `<div>` using `dangerouslySetInnerHTML` to properly render the HTML content, with appropriate prose styling.

### File Changed
- `src/components/ui/accordion-feature-section.tsx` — Line 54: Replace `<p>{tab.description}</p>` with `<div dangerouslySetInnerHTML={{ __html: tab.description }} className="prose prose-sm ..." />`

