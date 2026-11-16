# Success Atlas — design logic

`atlas.html` is the public Success Atlas: the website page (`/atlas`) that shows partners, funders
and other business owners how much is happening across the NorCal SBDC network. It carries the idea
of the Atlas tools in `mysbdc-tools` (the `/atlas` totals dashboard and the `success-atlas.html`
map) onto the public website. Its visual language is the MySBDC dashboard's: calm, editorial, warm
paper and serif numbers.

**Two surfaces, two jobs.** Clients share milestones in the MySBDC dashboard (`../handoff/`), which
is private. The Success Atlas shows the network's milestones in aggregate, which is public. The map
does not appear in the dashboard.

## What the page is for

One sentence: **show how much is happening, without showing who.** A visitor sees a region full of
activity and four totals that add up. A few ringed marks open into the people behind them. A client
who just shared a milestone can see where it joins everyone else's.

## The approach (third version)

The first version put the map on a full-bleed navy band with bright lights. It worked, and it was
busy. The second made the page light and typographic. This third version keeps that restraint and
asks what a studio like Pentagram would do with the same features, using the MySBDC dashboard's
design logic (`../handoff/DESIGN.md`):

- **The totals are the dashboard's tiles.** The public sees the same four coloured tiles and
  pictograms a client taps to share a milestone. One object, two places: where the result is
  reported and where it is shown.
- **Words and map share the page.** Headline and tiles on the left, the map on the right at about
  half the width, and never taller than the window, so the whole region is seen at once.
- **A cream page with a map window.** The page ground is cream. The map sits in a field that
  runs the full height of the section and bleeds off the right edge of the browser. The field is
  a real map: sea, neighbouring land, and the service area. Flat tones, no gradient.
- **The stories continue the tiles.** Two stories, each a photograph beside a colour block with
  one figure at display size.
- **Colour has jobs.** Tile colours name the four kinds of milestone. Berry does one thing: it
  marks people (the ringed marks, and the rule under each story photograph).
- **It arrives.** On load the year fills in once and the totals count up.

Earlier versions: `atlas-v1.html` (navy band) is kept for comparison; the second version is in the
repository history.

## Page composition

1. **The composition (white).** Left: label, serif headline, one sentence, the four tiles, and a
   single "Latest" line. Right: the county menu, the map, and the timeline.
2. **Stories.** "Two of 4,222." (the number is the live count), then two success stories as a row
   of four tiles.
3. **Next step.** One slim slate-navy band: "Add your milestone to the map", one sentence and
   the button on a single line, which opens MySBDC.
4. **Notes.** "Totals by county" and "About this map" as disclosures.

## The tiles

- **Order:** capital accessed, sales growth, businesses started, jobs created.
- **Same tiles as the dashboard.** Sand with the coins for capital, sage with the rising columns
  for sales, slate navy with the storefront for starts, pool with the two people for jobs. The
  pictograms are copied from `handoff/src/_icons.svg` and stay small; the number is the subject.
- **Each tile is a legend entry and a filter.** A tile's colour is the family of its marks on the
  map. Choosing a tile shows only that kind of mark, rings the tile, and fades the others; choosing
  it again shows all four. The numbers never change with the filter.
- **They follow the view.** Choosing a county re-totals all four for that county.

## The map

- **The region sits in its surroundings.** A cut-out floating on a blank field felt unanchored,
  so the field is drawn as a map: the Pacific in pale pool, Oregon, Nevada and the rest of
  California as quiet neighbouring land, and the 36 counties in white as the service area. The
  field bleeding off the right edge is Nevada running off the page. San Francisco Bay reads as
  water.
- **Three flat tones.** Sea, neighbouring land, service area. No terrain, roads or shading, so
  the milestone marks stay the loudest thing on the map.
- **Shallows, not a gradient.** Two pale bands follow every shore, as a printed atlas would draw
  them. They give the coast depth with flat colour.
- **The service area is lifted.** Its own shape sits beneath it, offset down and to the right in
  flat ink, so the region reads as a sheet of paper raised off the map. A hard-edged plate, not
  a blurred shadow. When a county is opened, that county is the one that lifts.
- **Atlas labels.** "Pacific Ocean" in spaced italic serif; "Oregon", "Nevada" and
  "California" in small muted capitals; "Point Arena" and "Monterey Bay" in small italic.
  None of the surroundings are interactive.
- **A crisp shoreline.** A fine line in deeper pool traces the coast inside the two bands of
  shallows.
- **Map furniture.** A north mark and a scale bar sit in the sea at the lower left. The scale
  bar is real: it re-measures when a county is opened.
- **Borders that agree.** Counties and states come from one topology, so county, state and
  coast lines meet exactly. County borders are a quiet warm line.
- **About half the page.** The map panel takes up to half the page width, and its height is
  capped so the whole region fits in the window.
- **Every milestone is one small mark.** About 4,200 of them read as a texture of activity before
  anyone reads a number. Marks keep the same size on screen at every zoom.
- **Colour means the kind of milestone, and nothing else.** Each mark is a deeper relative of its
  tile, so small marks hold on the cream counties.

  | Milestone | Tile | Mark | Token |
  | --- | --- | --- | --- |
  | Capital accessed | sand | ochre | `--atlas-funding` `#A97C1F` |
  | Sales growth | sage | green | `--atlas-sales` `#397247` |
  | Businesses started | slate navy | navy | `--atlas-started` `#243B50` |
  | Jobs created | pool | blue | `--atlas-hired` `#2E8CAD` |

  The four were checked together for colour-blind separation and 3:1 contrast on the county
  colour. Change them as a set, not one at a time.
- **Colour is never the only cue.** Each tile names its kind, the pointer names any mark, and
  "Totals by county" gives the same numbers as a table.
- **Two altitudes.** The whole region shows density. Choosing a county (click it, or use the menu
  above the map) zooms in, lets the other counties recede into the neighbouring land, enlarges the
  marks, and re-scopes the
  tiles and the latest line. Escape or a click outside returns to the region.
- **Five place names for orientation,** removed when zoomed, where the menu names the county.

## Ringed marks: stories and testimonies

A few marks are ringed in berry. Each is a person, not a count.

- **A bullseye is a success story:** a published client story. Hover or focus shows a small card
  with its photograph, result, name and a "Read story" link.
- **A plain ring is a testimony:** a short quote credited by county. It lives on the map and
  nowhere else on the page. Hover or focus shows the quote, with a circular avatar beside the
  credit: initials in the dashboard's pool circle, or a photo when one is supplied. The three
  sets of initials here are sample content. Initials say more than a county does, so in
  production show them (or a photo) only when the owner agrees; without them the card shows
  the county credit alone.
- **Behaviour.** Hover or keyboard focus shows a card; moving away closes it. A click or Enter
  keeps it open, and for a story moves focus to "Read story". Escape closes it. On touch, a tap
  opens it.
- **The card** sits beside its mark on a solid pool plate, the dashboard's one emphasis device.
- **Keep them few.** Five or six is about the limit before the map reads as two competing layers. Rotate
  them rather than adding more.
- **Sources.** The two success stories are existing client stories from the website draft
  (Jump Aero in Petaluma, Yarrow Goods in Marin County). The three testimonies are sample quotes. In production, testimonies come from the optional quote on
  the milestone forms, and a named story needs the owner's agreement.

## The story row

Two stories, set as four tiles in one row: photograph, colour block, photograph, colour block.

- **One line above:** "Two of 4,222." The count is live, so it grows as milestones do.
- **Each story is a pair.** A photograph in natural colour, and beside it a solid block in the
  tile colour of the story's headline figure: sand for capital, sage for sales. The row reads as a
  continuation of the four totals above, in the same tile language (6px corners, 12px gaps).
- **One figure per story, at display size.** "$12M" and "+20%", then one line that finishes the
  sentence, then the business name. The place sits at the top of the block with the same bullseye
  as the story's mark on the map.
- **The pair is the link.** Resting on it lights its mark on the map.
- **Keep it to two.** Three made the row read as a card grid.

## Latest

One quiet line under the tiles that takes turns through the most recent milestones in view.
Each time it changes, a soft ring opens on the map where that milestone is, so the words and the
map move together. The ring is skipped with reduced motion.
Across the region it favours towns a visitor will recognise.

## Time

A thin strip of twelve month bars under the map, then one line with Play and the period in words.
Choosing a month shows the map "through" that month. **Play the year** fills the map from twelve
months ago to today while the tiles count up. With reduced motion it steps month by month, and the
arrival animation on load is skipped.

## Presenting

"Present" (or `atlas.html?present`) removes the site header, footer and the sections below, so the
composition fills the screen. While presenting, the ringed marks take turns opening every few
seconds; any click or key press stops the tour. It suits a lobby display or a partner meeting.

## Privacy rules

These are design rules, not presentation details. Keep them when the data becomes real.

1. **A mark says what and where.** Kind of milestone, town, county, month. Never a person, a
   business name or an amount.
2. **Numbers live in totals.** Jobs and dollars appear only summed for the region or a county.
3. **The business owner chooses.** The review step of every milestone form in the dashboard asks
   "Add this to the Success Atlas?" with "Yes, without my name" or "Keep it off the map". A separate
   optional field invites a few words, credited by county only.
4. **A milestone appears once an advisor confirms it.** Nothing unverified reaches the public page.

## Demo walkthrough

For design review, a milestone shared in the dashboard preview is kept in the browser, and this
page reads it. Both previews must be open in the same browser.

1. Open `atlas.html` (optionally in a second tab or window with `?present`).
2. Choose **Share a milestone**. It opens the MySBDC dashboard preview.
3. Complete a form. The review step has the Success Atlas choice. Choose **Share milestone**.
4. On the thank-you page choose **See the Success Atlas**. The map moves to Humboldt County and a
   ring labelled "New" pulses at Eureka, the sample client's town. An Atlas already open in
   another tab does the same without a reload.
5. A white **Design preview** strip explains what happened. **Confirm as the advisor** turns the
   ring into a solid mark, counts the totals up, and adds the milestone to Latest.
6. **Clear** (or `atlas.html?reset`) removes the preview milestones to start again.

## What is real and what is a preview

| Part | Now | Production |
| --- | --- | --- |
| County and state outlines, town positions | Real. US Census Bureau files (public domain), simplified | Same |
| The four network totals | The FY2025 draft figures already on the impact page | Confirmed reporting figures |
| Where each mark sits, county breakdowns, dates | **Sample content**, generated by `atlas-data.py` | Verified milestones from Neoserra |
| Success stories | Existing client stories from the website draft | Published stories, with the owner's agreement |
| Testimonies | **Sample quotes** | Quotes shared on the milestone forms, credited by county |
| A shared milestone | Kept in this browser (`localStorage`, key `mysbdc-atlas-v1`). Nothing is sent | Posted by the dashboard; published after confirmation |
| The "Design preview" strip and its buttons | Stand in for the advisor's confirmation | Removed |
| Live arrival | Same browser only (`storage` event) | Server push or polling |

The page states its sample status under "About this map".

## Data contract

`atlas-data.js` sets `window.MYSBDC_ATLAS_DATA`. A production endpoint can return the same shape.

| Field | Meaning |
| --- | --- |
| `view` | Width and height of the map's coordinate space |
| `types` | `["hired","started","funding","sales"]`. The position is the type id |
| `counties[]` | The 36 service-area counties: `n` name, `c` SBDC center, `d` SVG path, `b` bounding box |
| `context` | The surroundings, for drawing only: `land` (rest of California and neighbouring states, one path), `lines` (state outlines), `labels` (`[text, x, y, kind]`) |
| `towns[]` | `[label, countyIndex, x, y]` |
| `pins` | Flat list, six numbers per milestone: `x, y, typeId, daysAgo, townIndex, value`. Oldest first. `value` is jobs, dollars, or 1 for a start |
| `stories[]` | Featured marks: `kind` (`story` or `voice`), `x`, `y`, `town`, `county`, `title`, and for a story `name`, `meta`, `img`, `alt`, `pos`, `href` |
| `quotes[]` | Used only by the first version (`atlas-v1.html`) |
| `labels[]` | Orientation place names |
| `home` | Preview only: the sample client's town and spots near it for preview marks |

For production, send confirmed milestones only, place each one at its town rather than its address
(the sample scatters marks around the town centre), and decide whether a town with a single mark
should be merged into its county. The page does not state a number of SBDC centers; the county to
center names come from `atlas-data.py` and should be checked against the current network list.

To regenerate the data (outlines and sample milestones):

```sh
curl -L -o counties-10m.json https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json
python3 homepage-preview/atlas-data.py counties-10m.json \
  path/to/mysbdc-tools/public/data/advisor-map/places.v1.json
```

`counties-10m.json` is the us-atlas TopoJSON of the US Census Bureau cartographic boundary
files. It is read at build time only and is not shipped with the page.

## How the dashboard's milestone forms differ from `mysbdc-tools`

The Milestone Collection wizard in `mysbdc-tools` (`src/components/milestones`) is what feeds
Neoserra today. The dashboard forms in `../handoff/` ask for the same four outcomes in a different
shape. These differences need a decision before build; the Atlas work did not change them.

| Topic | `mysbdc-tools` wizard | Dashboard forms |
| --- | --- | --- |
| Shape | One wizard. Tick every milestone that applies, answer each, sign once | One short form per milestone. "Did anything else change?" afterwards |
| Who and which business | Email lookup, then choose a business | Signed in. No business choice for a client with more than one |
| Hired | **Current totals**: full-time and part-time, including the owner. The change is worked out from the number on file | **The change**: how many were hired, the start month, and jobs kept |
| Sales | Last year's gross revenue, with tax-form line guidance | Year, total sales, and where the number comes from |
| Started | A criteria check (registered, plus one of four activities), eight legal structures, an exact start date | Open or not yet, business name, month, six structures |
| Funding | Own money in the last 12 months, then any number of other sources from eleven types | One source per form: five kinds, amount, month, lender, received or approved |
| Funding types missing in the dashboard | — | Venture capital, crowd funding and SSBCI-backed loans have no option |
| Closing step | Optional testimonial, an attestation sentence, full-name signature | "Did the SBDC help?", typed name. Now also the Success Atlas choice and optional quote |
| Languages | English, Spanish, Vietnamese, Chinese, French | English only |

The two that matter most for data: **hired** (totals versus change) and **funding** (one source
versus several, and the shorter type list). Whichever shape wins, the Atlas needs only the type,
the town and one number per milestone.
