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

## The approach (second version)

The first version put the map on a full-bleed navy band with bright lights. It worked, and it was
busy. This version asks what a studio like Pentagram would do with the same features, using the
MySBDC dashboard's design logic (`../handoff/DESIGN.md`):

- **Subtract until one idea is left.** The page is one composition: words and four numbers on the
  left, the map on the right. Section labels, sub-lines under each number, a hint line and a second
  heading were removed. Nothing was added to replace them.
- **Typography carries the hierarchy.** Proxima Sera sets the headline and the four numbers;
  Proxima Nova sets everything functional. Size and position do the work that boxes and colour
  bands did before.
- **Warm paper, white surfaces, one navy card.** The page is the dashboard's warm paper. Counties
  are white tiles; the paper showing between them is the border. The only dark surface is the
  slate-navy next-step card.
- **Colour is quiet and earns its place.** Marks use deeper relatives of the dashboard's milestone
  tile colours. Berry appears in exactly one role: the story marks.
- **One control does several jobs.** The four totals are the legend and the filter. The county menu
  is also the map's title. The timeline is one line.

The first version is kept for comparison as `atlas-v1.html`.

## Page composition

1. **The composition (warm paper).** Left: label, serif headline, one sentence, the four totals as
   an index, and the three latest milestones. Right: the map, with its county menu above and the
   timeline below.
2. **Stories.** "Behind the marks, people." A small card collection, as on the dashboard's
   Resources page: three success stories, then three testimonies.
3. **Next step.** One slate-navy card: "Add your milestone to the map", which opens MySBDC.
4. **Notes.** "Totals by county" and "About this map" as disclosures.

## The map

- **White counties on warm paper.** No drawn borders: the gap between counties is the page
  showing through. There are no tiles from a map service, no gradients and no shadows, so the page
  has no outside dependency.
- **Every milestone is one small mark.** About 4,200 of them read as a texture of activity before
  anyone reads a number. Marks keep the same size on screen at every zoom.
- **Colour means the kind of milestone, and nothing else.** The mapping follows the dashboard's
  milestone tiles (pool for hired, sage for sales, sand for funding, navy for started), deepened so
  small marks hold on white.

  | Milestone | Mark | Token |
  | --- | --- | --- |
  | Capital accessed (new funding) | ochre | `--atlas-funding` `#B98A2B` |
  | Businesses started | navy | `--atlas-started` `#243B50` |
  | Jobs created (new hires) | pool blue | `--atlas-hired` `#3292B3` |
  | Sales growth | sage green | `--atlas-sales` `#397247` |

  The four were checked together on white for colour-blind separation and 3:1 contrast. Change
  them as a set, not one at a time.
- **Colour is never the only cue.** Each total names its colour, the pointer names any mark, and
  "Totals by county" gives the same numbers as a table.
- **Two altitudes.** The whole region shows density. Choosing a county (click it, or use the menu
  above the map) zooms in, lets the other counties recede into the paper, enlarges the marks, and
  re-scopes the totals and the latest list. Escape or a click outside returns to the region.
- **A few place names for orientation.** Nine towns are labelled on the regional view and removed
  when zoomed, where the menu already names the county.

## Story marks

A few marks are ringed in berry. Each is a person, not a count.

- **Two kinds.** A **success story** is a published client story: photo, one-line result, business
  name and a link to read it. A **testimony** ("In their words") is a short quote credited by
  county only.
- **On the map** a story mark is a ring, larger than a milestone, so it differs by shape and size
  as well as colour. It is a real button: pointer, touch and keyboard all open it.
- **Opening one** shows a single card beside the mark, on a solid pool plate, the dashboard's one
  emphasis device. Escape or Close dismisses it and returns focus to the mark.
- **Below the map** the same six appear as cards. "Show on the map" on a card opens its mark;
  resting on a card lights its mark.
- **Keep them few.** Six is about the limit before the map reads as two competing layers. Rotate
  them rather than adding more.
- **Sources.** The three success stories are existing client stories from the website draft
  (Jump Aero in Petaluma, Yarrow Goods in Marin County, Liquid Fusion Kayaking in Fort Bragg). The
  three testimonies are sample quotes. In production, testimonies come from the optional quote on
  the milestone forms, and a named story needs the owner's agreement.

## The totals

- **The four totals are the legend and the filter.** Choosing a total shows only that kind of
  mark; choosing it again shows all four. The totals never change with the filter.
- **They match the impact page.** Capital accessed, businesses started, jobs created, sales growth,
  in that order and with those words.
- **Latest** is three quiet lines: kind, town, county, and when.

## Time

One line under the map: a Play control, twelve month bars, and the period in words. Choosing a
month shows the map "through" that month. **Play the year** fills the map from twelve months ago to
today while the totals count up. With reduced motion it steps month by month.

## Presenting

"Present full screen" (or `atlas.html?present`) removes the site header, footer and the sections
below, so the composition fills the screen. While presenting, the story marks take turns opening
every few seconds; any click or key press stops the tour. It suits a lobby display or a partner
meeting.

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
| County outlines, town positions | Real. US Census Bureau files (public domain), simplified | Same |
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
| `counties[]` | `n` name, `c` SBDC center, `d` SVG path, `b` bounding box |
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

To regenerate the sample data:

```sh
python3 homepage-preview/atlas-data.py \
  path/to/mysbdc-tools/public/data/network-map/counties.v1.geojson \
  path/to/mysbdc-tools/public/data/advisor-map/places.v1.json
```

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
