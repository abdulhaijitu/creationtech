

## PDF Header Offset + Justify Support

### File: `src/utils/proposalPdfGenerator.ts`

**1. Header content shifted down ~7mm (20px)**
- In `addHeader` (line 379+): shift the accent strip from `y=0` to remain at top, but move logo from `y=6` to `y=13` and company info from `y=8` to `y=15`. The `lineY` return value will increase accordingly by ~7.
- This affects every page since `addHeader` is called on page 1 and in `addNewPage`.

**2. Justify text alignment in rich text rendering**
- Detect `text-align: justify` from HTML `<p style="text-align: justify">` before stripping tags in `htmlToStyledParagraphs`.
- Add an alignment marker per paragraph: extend the return type to include alignment info (e.g., `{ segments: StyledSegment[], justify: boolean }`).
- In `renderStyledContent`, for justified lines: calculate total text width, distribute remaining space evenly between words (except the last line of a paragraph which stays left-aligned).
- Create a `renderJustifiedLine` helper that spaces words to fill `contentWidth`.

### Specific changes:

| Location | Change |
|---|---|
| `addHeader` lines 386-400 | Add +7 offset to logo Y (`6→13`) and info Y start (`8→15`) |
| `htmlToStyledParagraphs` | Detect `text-align:\s*justify` on `<p>` tags, return alignment per paragraph |
| `renderStyledContent` | Check alignment flag, use justified rendering when flagged |
| New helper `renderJustifiedLine` | Distribute extra horizontal space between word segments |

