# Success Atlas — design logic

`atlas.html` is the public Success Atlas: the website page (`/atlas`) that shows partners, funders
and other business owners how much is happening across the NorCal SBDC network. It carries the idea
of the Atlas tools in `mysbdc-tools` (the `/atlas` totals dashboard and the `success-atlas.html`
map) onto the public website, in the refined homepage and impact page's design language.

**Two surfaces, two jobs.** Clients share milestones in the MySBDC dashboard (`../handoff/`), which
is private. The Success Atlas shows the network's milestones in aggregate, which is public. The map
does not appear in the dashboard.

## What the page is for

One sentence: **show how much is happening, without showing who.** A visitor sees a region full of
activity and four totals that add up. A client who just shared a milestone can see where it joins
everyone else's.

## Page composition

Follows the impact page: open rhythm, no decorative rules, one action per section.

1. **Paper intro.** "Success Atlas" label, a single-colour Proxima Nova headline, one sentence, and
   one action (Present full screen).
2. **One full-bleed navy band.** The map on the left; the four totals and the latest milestones on
   the right. This is the page.
3. **A voice (paper).** One client quote that fits what the map is showing, credited by county.
4. **Next step (cream).** "Add your milestone to the map", which opens MySBDC.
5. **Notes.** "Totals by county" and "About this map" as disclosures, as on the impact page.

## The map

- **Drawn on the navy band itself.** Counties are one lighter navy, separated by a gap in the band
  colour instead of drawn lines. There are no tiles from a map service, no gradients and no
  shadows, so the page has no outside dependency.
- **Every milestone is one small light.** Density is the message: about 4,200 lights read as a busy
  region before anyone reads a number. Lights keep the same size on screen at every zoom.
- **Colour means the kind of milestone, and nothing else.**

  | Milestone | Light | Token |
  | --- | --- | --- |
  | New hires (jobs created) | blue | `--atlas-hired` `#5DA4E5` |
  | New business | green | `--atlas-started` `#68D7A1` |
  | New funding (capital accessed) | gold | `--atlas-funding` `#E4B750` |
  | Sales growth | rose | `--atlas-sales` `#DB6EA5` |

  The four were checked together on navy for colour-blind separation and contrast. Change them as
  a set, not one at a time.
- **Colour is never the only cue.** Each total names its colour, the pointer names any light, and
  "Totals by county" gives the same numbers as a table.
- **Two altitudes.** The whole region shows density. Choosing a county (click it, or use the county
  menu) zooms in, dims everything outside it, enlarges the lights, and re-scopes the totals, the
  latest list and the quote. Escape or a click outside returns to the region.
- **A few place names for orientation.** Nine towns are labelled on the regional view and removed
  when zoomed, where the heading already names the county.

## The totals

- **The four totals are the legend and the filter.** Choosing a total shows only that kind of
  light; choosing it again shows all four. The totals never change with the filter.
- **They match the impact page.** Capital accessed, businesses started, jobs created, sales growth,
  in that order and with those words.
- **Latest** lists the most recent milestones in view: kind, town, county, and when.

## Time

Twelve month bars show when milestones were shared. Choosing a month shows the map "through" that
month. **Play the year** fills the map from twelve months ago to today while the totals count up.
With reduced motion it steps month by month.

## Presenting

"Present full screen" (or `atlas.html?present`) removes the site header, footer and other sections
so the navy band fills the screen with larger totals. It suits a lobby display or a partner meeting.

## Privacy rules

These are design rules, not presentation details. Keep them when the data becomes real.

1. **A light says what and where.** Kind of milestone, town, county, month. Never a person, a
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
5. A cream **Design preview** strip explains what happened. **Confirm as the advisor** turns the
   ring into a solid light, counts the totals up, and adds the milestone to Latest.
6. **Clear** (or `atlas.html?reset`) removes the preview milestones to start again.

## What is real and what is a preview

| Part | Now | Production |
| --- | --- | --- |
| County outlines, town positions | Real. US Census Bureau files (public domain), simplified | Same |
| The four network totals | The FY2025 draft figures already on the impact page | Confirmed reporting figures |
| Where each light sits, county breakdowns, dates, quotes | **Sample content**, generated by `atlas-data.py` | Verified milestones from Neoserra |
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
| `quotes[]` | `[pinIndex, text]`. Only where the owner allowed a quote |
| `labels[]` | Orientation place names |
| `home` | Preview only: the sample client's town and spots near it for preview lights |

For production, send confirmed milestones only, place each one at its town rather than its address
(the sample scatters lights around the town centre), and decide whether a town with a single light
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
