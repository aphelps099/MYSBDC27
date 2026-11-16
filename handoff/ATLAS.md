# The Atlas — design logic

`atlas.html` is the map of every milestone shared with NorCal SBDC over the last twelve months.
A client reaches it right after sharing a milestone, and the SBDC can put it on a screen for
partners. It carries the idea of the Atlas tools in `mysbdc-tools` (the `/atlas` totals dashboard
and the `success-atlas.html` map) into the client app, in the dashboard's own visual language.

Read [DESIGN.md](DESIGN.md) first. This note records the decisions that are specific to the map.

## What the page is for

One sentence: **show how much is happening, without showing who.** A client sees their own
milestone land among everyone else's. A partner sees a region full of activity and four totals
that add up.

## The map

- **One matte navy surface.** The map is the page's single focal dark surface
  (`--mysbdc-navy-surface`), with counties in one lighter slate. Counties are separated by a gap in
  the surface colour, not by drawn lines. There are no tiles from a map service, no gradients and
  no shadows, so the page has no outside dependency and works offline.
- **Every milestone is one small light.** Density is the message: 1,600 lights read as a busy
  region before anyone reads a number. Lights keep the same size on screen at every zoom.
- **Colour means the kind of milestone, and nothing else.**

  | Milestone | Light | Token |
  | --- | --- | --- |
  | Hired someone | blue | `--atlas-hired` `#5DA4E5` |
  | Started a business | green | `--atlas-started` `#68D7A1` |
  | Got funding | gold | `--atlas-funding` `#E4B750` |
  | Sales grew | rose | `--atlas-sales` `#DB6EA5` |

  The milestone tiles' pool, sage and sand are too close to tell apart as small dots on navy, so
  the lights use brighter relatives of the same families. The four were checked together on the
  navy surface for colour-blind separation and contrast. Change them as a set.
- **Colour is never the only cue.** Each total names its colour, the pointer names any light, and
  "Totals by county" gives the same numbers as a table.
- **Two altitudes.** The whole region shows density. Choosing a county (click it, or use the
  county menu) zooms in, dims everything outside it, enlarges the lights, and re-scopes the
  totals, the latest list and the quote. Escape or a click outside returns to the region.
- **A few place names for orientation.** Nine towns are labelled on the regional view and removed
  when zoomed, where the scope heading already names the county.

## The side column

- **The four totals are the legend and the filter.** One element does three jobs, which keeps the
  UI minimal. Choosing a total shows only that kind of light; choosing it again shows all four.
  The totals themselves never change with the filter, so the numbers stay trustworthy.
- **Latest** lists the six most recent milestones in view: kind, town, county, and when.
- **One quote** that fits the current view, credited only as "a Humboldt County business owner".

## Time

Twelve month bars show when milestones were shared. Choosing a month shows the map "through" that
month. **Play the year** fills the map from twelve months ago to today while the totals count up.
With reduced motion it steps month by month.

## Privacy rules

These are design rules, not presentation details. Keep them when the data becomes real.

1. **A light says what and where.** Kind of milestone, town, county, month. Never a person, a
   business name or an amount.
2. **Numbers live in totals.** Jobs and dollars appear only summed for the region or a county.
3. **The client chooses.** The review step of every milestone form asks "Add this to the Atlas?"
   with "Yes, without my name" or "Keep it off the map". A separate optional field invites a few
   words, credited by county only. This follows the consent model in the portal plan: numbers
   shared anonymously, a quote allowed separately.
4. **A milestone counts once an advisor confirms it.** Until then the client's own light is a
   hollow ring that only they can identify, and it is not in the totals.
5. **The receipt is private.** "Only you see this" shows the client's own sentence and its status.
   It is hidden while presenting.

## What happens when a client shares a milestone

1. Review step: the Atlas choice and the optional quote sit between "Did the SBDC help?" and the
   typed name.
2. Thank-you page: the main action becomes **See it on the Atlas** (or "See the Atlas" when the
   client kept it off the map).
3. Atlas: the map zooms to the client's county, their light pulses as a ring labelled "You", and
   the receipt says it is waiting for the advisor.
4. When the advisor confirms: the ring becomes a solid light, the totals count up, and the
   milestone joins Latest.

## Presenting

"Present full screen" (or `atlas.html?present`) removes the app frame and turns the page into one
navy field with larger totals. If a milestone is shared in another tab or window of the same
browser while the Atlas is open, the light arrives without a reload and the map moves to it.

## What is real and what is a preview

| Part | Now | Production |
| --- | --- | --- |
| County outlines, town positions | Real. US Census Bureau files (public domain), simplified | Same |
| The 1,640 milestones, totals and quotes | **Sample data**, generated by `atlas-data.py` | Verified milestones from Neoserra |
| A shared milestone | Kept in this browser (`localStorage`, key `mysbdc-atlas-v1`). Nothing is sent | Posted with the milestone; read back from the server |
| "Preview: confirm as Dana" | Stands in for the advisor | Removed. The advisor confirms in Neoserra |
| "Clear preview milestones", `?reset` | Lets a presenter start again | Removed |
| Live arrival | Same browser only (`storage` event) | Server push or polling |

The page states "Sample data for design review" in its closing note.

## Data contract

`assets/atlas-data.js` sets `window.MYSBDC_ATLAS_DATA`. A production endpoint can return the same
shape, or the page script can be pointed at one.

| Field | Meaning |
| --- | --- |
| `view` | Width and height of the map's coordinate space |
| `types` | `["hired","started","funding","sales"]`. The position is the type id |
| `counties[]` | `n` name, `c` SBDC center, `d` SVG path, `b` bounding box |
| `towns[]` | `[label, countyIndex, x, y]` |
| `pins` | Flat list, six numbers per milestone: `x, y, typeId, daysAgo, townIndex, value`. Oldest first. `value` is jobs, dollars, or 1 for a start |
| `quotes[]` | `[pinIndex, text]`. Only where the client allowed a quote |
| `labels[]` | Orientation place names |
| `home` | The signed-in client's town, county and a few spots near it for their own lights |

For production, send verified milestones only, place each one at its town rather than its address
(the sample scatters lights around the town centre), and leave out any town where a single light
could identify a business if that matters to the center.

To regenerate the sample data:

```sh
python3 handoff/atlas-data.py \
  path/to/mysbdc-tools/public/data/network-map/counties.v1.geojson \
  path/to/mysbdc-tools/public/data/advisor-map/places.v1.json
python3 handoff/build.py
```

## How these milestone forms differ from `mysbdc-tools`

The Milestone Collection wizard in `mysbdc-tools` (`src/components/milestones`) is what feeds
Neoserra today. The handoff forms ask for the same four outcomes in a different shape. These
differences need a decision before build; the Atlas work did not change them.

| Topic | `mysbdc-tools` wizard | Handoff forms |
| --- | --- | --- |
| Shape | One wizard. Tick every milestone that applies, answer each, sign once | One short form per milestone. "Did anything else change?" afterwards |
| Who and which business | Email lookup, then choose a business | Signed in. No business choice for a client with more than one |
| Hired | **Current totals**: full-time and part-time, including the owner. The change is worked out from the number on file | **The change**: how many were hired, the start month, and jobs kept |
| Sales | Last year's gross revenue, with tax-form line guidance | Year, total sales, and where the number comes from |
| Started | A criteria check (registered, plus one of four activities), eight legal structures, an exact start date | Open or not yet, business name, month, six structures |
| Funding | Own money in the last 12 months, then any number of other sources from eleven types | One source per form: five kinds, amount, month, lender, received or approved |
| Funding types missing here | — | Venture capital, crowd funding and SSBCI-backed loans have no option |
| Closing step | Optional testimonial, an attestation sentence, full-name signature | "Did the SBDC help?", typed name. Now also the Atlas choice and optional quote |
| Languages | English, Spanish, Vietnamese, Chinese, French | English only |

The two that matter most for data: **hired** (totals versus change) and **funding** (one source
versus several, and the shorter type list). Whichever shape wins, the Atlas needs only the type,
the town and one number per milestone.
