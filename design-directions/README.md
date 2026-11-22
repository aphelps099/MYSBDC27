# MySBDC 2.0 public website: design directions, round 2

November 22, 2026. Research is in [RESEARCH.md](RESEARCH.md). Open [index.html](index.html) to
browse the mockups, or the JPEGs in `screenshots/` (each page at 1440px and 390px).

## What changed after round 1

Round 1 (a type-led serif direction, a map-led direction and the tile-based "Front Counter") was
rejected: predictable, not enough good type, too much going on. Front Counter's colour was the part
that worked, so it is kept in `front-counter/` for reference. Round 2 starts from four instructions
and from the Brand House at brand.norcalsbdc.org:

1. **Proxima Nova does the work.** Sans throughout. Sera survives as one italic word in one
   direction, which is the brand's own recipe.
2. **Far simpler.** Each home page is five moves: say it, route it, prove it, next workshops, start.
3. **Texture and layout carry as much as type.** Each direction is one texture and one layout idea.
4. **Colour from Front Counter**: sand, sage, pool and the two navies as solid fields on paper.

All three share one type system, so the choice is about surface and structure.

| | Size and weight |
|---|---|
| Display | Proxima Nova 700, up to 160px (Block) or 192px (Dot), line height 0.84 to 0.86, tracking -0.05em |
| Section head | Proxima Nova 700, 28 to 80px, tracking -0.04em |
| Numerals | Proxima Nova 900, 40 to 208px, tracking -0.055em |
| Body | Proxima Nova 500, 18px on 1.45 |
| Label | Proxima Nova Wide 700, 12px caps, tracking 0.14em. The only small type |
| Emphasis | Proxima Sera 300 italic, one word, Block hero only |

## 1. Block

**Thesis.** The page is a wall of solid colour blocks, edge to edge, printed on paper stock.

**Tension it resolves.** Entrepreneurs get four one-word doors (Start, Fund, Grow, Learn). Funders
get the same wall carrying the numbers at poster scale. It is the Brand House templates page turned
into a website.

- **Layout.** No shell and no gutters. Blocks tile the full width; content sits on the floor of each
  block with the label at the top and empty field between. Hero is a 2:1 pair, then four doors,
  then a figure mosaic.
- **Texture.** Paper grain on every colour block: one 220px SVG noise tile set to multiply, about
  1KB, no image request. Never on paper sections, never on photographs.
- **Colour.** Cream, sand, pool, sage, slate navy and navy as blocks; paper only for lists.
- **Navigation.** Four links, Español, MySBDC sign in, a square navy "Get started". Mobile: a "Menu"
  button that opens a navy panel with 32px links.
- **Buttons and links.** Square, navy, 56px tall, arrow inside. Hover inverts to paper with a navy
  border. Links are bold with a 2px underline that thickens to 4px. Focus: 3px navy outline, pool on
  dark.
- **Photography.** One photograph per page, natural colour, cropped tight to fill a block, captioned
  on a navy tab.
- **Motion.** The arrow in a block leaves for its corner on hover and focus. Nothing else moves.

**Blocks an editor would see**

| Block | Fields | On a phone |
|---|---|---|
| Statement block | Label, headline (one optional italic word), line, button, colour | Stacks; button goes full width |
| Photo block | Image, alt text, caption | 4:3 under the statement |
| Doors | 2 to 4 doors: label, word, line, link, colour | Two by two |
| Figure mosaic | Period label; 4 figures with labels; which one leads | Lead figure full width, others two up |
| Workshop rows | Count, link to calendar (rows come from the events source) | Date beside title, details beneath |
| Service bands | Per band: tag, name, line, link text, colour | Stacked text, arrow at right |
| Steps | 3 steps: title, line, colour | One column |
| Closing block | Label, headline, line, button | Stacks |

**CLAUDE.md.** Keeps 5 (colour-block mosaic, now the whole grammar), 6, 7's no-fixed-widths, 8, 12,
14. Breaks 1 (no numbered spine, to match the dashboard), 2 (bands are blocks of many colours), 3
(no meta column), 7's 1400px shell (blocks are full bleed), 13 (no gradient hero).

**Risk.** A wall of blocks can read as a poster, not a tool, if editors add more than one block row
per idea. **Tradeoff.** Long-form pages (a story, a policy page) need a plain reading block that is
deliberately quieter than everything around it.

## 2. Dot

**Thesis.** One column, with the words as the layout and halftone dots as the only texture.

**Tension it resolves.** The simplest possible reading for someone on a phone, at a scale and finish
that looks deliberate to a funder. The services are the navigation: four words you can press.

- **Layout.** A single column inside a 1360px shell. Headline up to 192px. Services are full-width
  rows of 150px words. Sections are separated by space and a dotted rule.
- **Texture.** Halftone: two offset dot screens drawn with CSS gradients and masked so they fade out
  before they reach any text. Used in a corner of the hero, a corner of the navy figures band, the
  closing field, and as the edge where the photograph dissolves into the page. No image files.
- **Colour.** Cream and paper lead; pool, sand and sage are page-head and closing fields; navy for
  the figures band.
- **Navigation.** Same items as Block; pill-shaped "Get started".
- **Buttons and links.** Pills, 60px tall. Register buttons are outlined pills. Filters are pills
  with a tick when selected.
- **Photography.** One full-bleed band at 21:9 (4:3 on phones), natural colour, with the dot edge
  and a caption line beneath.
- **Motion.** A service row floods with its colour from the bottom on hover and focus.

**Blocks an editor would see**

| Block | Fields | On a phone |
|---|---|---|
| Headline field | Label, headline, line, button, secondary link, field colour, dots on or off | Stacks; dots shrink to the corner |
| Big rows | Per row: optional tag, word, line, link, flood colour; large or medium size | Word and arrow, line beneath |
| Photo band | Image, alt text, caption, link | 4:3 |
| Figures band | Period label, statement, 4 figures | Two by two |
| Workshop rows | Count, link to calendar | Date beside title, details beneath |
| Steps | Headline, 3 steps | One column |
| Closing field | Label, headline, line, button, colour | Stacks |

**CLAUDE.md.** Keeps 4, 6, 7 (shell and clip), 8, 12, and 2 in spirit (light, navy, light). Breaks
1, 3 (no two-column grid at all), 5 (no mosaic), 13, and 14 in one respect: the dotted rules are
back as dividers, because they are this direction's texture.

**Risk.** It depends on short words. "Food & hospitality" already needs the medium size, and Spanish
labels will be longer. **Tradeoff.** It is the least dense of the three; a funder scanning for
programs scrolls further.

## 3. Line

**Thesis.** A fixed colour panel holds the one thing to know; a quiet column beside it holds
everything else. The texture is drawn line: rings and the county map.

**Tension it resolves.** The message and the action never leave the screen while a funder reads the
evidence or an owner reads the list. It is the closest of the three to the signed-in dashboard's
calm.

- **Layout.** A 5:7 split. The left panel is sticky at full height: logo, label, headline, line,
  button. The right column carries navigation and content as open lists. On phones the panel
  becomes the first screen and the column follows.
- **Texture.** Concentric rings from the panel's lower corner (one repeating CSS gradient), and on
  the home page the 36-county outline from the Success Atlas data as fine linework. Only on the
  panel.
- **Colour.** The panel changes by page: navy for home, pool for Services, sand for Trainings. The
  column is always paper.
- **Navigation.** In the column header. On phones it overlays the panel.
- **Buttons and links.** Square, with the arrow pushed to the far edge.
- **Photography.** One 3:2 photograph in the column with a caption label.
- **Motion.** A 3px navy line draws under a list row on hover and focus.

**Blocks an editor would see**

| Block | Fields | On a phone |
|---|---|---|
| Page panel | Colour, label, headline, line, button, secondary link, map on or off | Becomes the first screen |
| List | Heading; per row: optional tag, title, line, link; large or medium | Title and arrow, line beneath |
| Figures | Period label, 4 figures | Two by two |
| Photo | Image, alt text, caption | Full width |
| Workshop rows | Heading, count, link | Date beside title |
| Steps | Heading, 3 steps | Number beside text |
| End cap | Line, button | Stacks |

**CLAUDE.md.** Keeps 3 (asymmetric two columns, taken to its limit), 4, 6, 8, 12, 14. Breaks 1, 2
(no alternating bands), 5, 7 (no centred shell), 13.

**Risk.** The page panel is a template-level block: one per page, always first. That is a real
constraint for editors, and the sticky panel takes 42% of a laptop screen. **Tradeoff.** The right
column is narrow, so tables and wide photography have less room than in the other two.

## Checked

- Rendered at 1440px, 720px and 390px: no horizontal overflow on any of the nine pages, including
  with button, link and headline text lengthened by 40% to stand in for Spanish.
- Every link, button, summary and select measures at least 44px tall.
- Proxima Nova and Proxima Nova Wide load from kit `pkl5rjs` on every page.
- Filters work by keyboard, state is in `aria-pressed` and a tick, and the count is announced.
- Motion is transform, background-size or nothing, and is off under `prefers-reduced-motion`.
- Contrast was measured against the rendered pixels behind every text element, texture included,
  at both widths. No real text fell below 4.5:1 (3:1 for large type). The palette pairs in use:

| Text on field | Ratio | | Text on field | Ratio |
|---|---|---|---|---|
| Navy on paper | 16.9 | | Paper on navy | 16.9 |
| Navy on cream | 15.2 | | Cream on slate navy | 10.3 |
| Navy on sage | 12.0 | | Pool on navy (labels) | 9.1 |
| Navy on sand | 11.8 | | Slate on paper (legal text) | 10.0 |
| Navy on soft pool | 10.3 | | Navy on pool | 9.1 |

- Weight, gzipped: about 2.4KB shared CSS, 2KB per direction, 2 to 3KB of HTML per page (8KB for
  Line's home page, which carries the map). Textures add no requests.

Not done: screen-reader testing, real-device testing, and browsers other than Chromium. In Line,
the page headline sits in the panel outside `<main>`; that needs fixing in the build.

## Comparison

| | Block | Dot | Line |
|---|---|---|---|
| Layout idea | Edge-to-edge block wall | One column of oversized words | Sticky panel and list column |
| Texture | Paper grain | Halftone dots | Rings and map linework |
| Closest to the Brand House | Yes, directly | In type, not layout | In restraint |
| Colour presence | Highest | Medium | One colour per page |
| Density | Medium | Lowest | Highest in the column |
| Phone | Blocks stack two by two | Strongest; it is already one column | Panel, then list |
| Editor freedom | High; any block order works | High | Lower; panel is fixed per page |
| Spanish and long labels | Good; blocks grow | Weakest; depends on short words | Good |
| Long-form pages | Needs a quiet reading block | Natural | Natural |
| Main risk | Poster, not tool | Runs out of short words | Panel eats the screen |

## Recommendation

**Block.** It is the direction that could only be NorCal SBDC: it uses the brand's own block
grammar, the colour you liked, and the heaviest, most confident Nova. It gives the figures the
scale funders respond to, and its blocks map one to one onto Gutenberg blocks that are hard to
assemble badly. I would take two things into it from the others: Dot's flood-on-hover for the
service bands, and Dot's dotted photo edge as a second, rarer texture.

The case for **Dot**: it is the simplest and the most distinctive on a phone, and if "way more
simple" is the main instruction, it is the truest answer. The case for **Line**: it sits closest to
the dashboard, and it is the best at keeping one action in view.

## Open items

- Which blue and berry are correct: `theme.json` or the Brand House (see RESEARCH.md)?
- Is GT America Mono licensed for web? If so it replaces Proxima Nova Wide for labels.
- "Español" is shown as a live link and should ship only with a real Spanish path.
- Workshop rows are the repo's sample events, moved to December 2026 and January 2027.

**Which direction should go forward: Block, Dot or Line?**
