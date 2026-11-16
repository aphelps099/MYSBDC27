#!/usr/bin/env python3
"""Generate homepage-preview/atlas-data.js for the public Success Atlas page.

    python3 homepage-preview/atlas-data.py COUNTIES_GEOJSON PLACES_JSON

Sources (both public domain, derived from US Census Bureau files) live in the mysbdc-tools repo:
    public/data/network-map/counties.v1.geojson   36-county NorCal SBDC service area
    public/data/advisor-map/places.v1.json        Census Gazetteer places with county

The output holds three things:
    1. County outlines, projected to a flat SVG coordinate space.
    2. Town positions in the same space.
    3. A seeded SAMPLE set of milestones for design review. No real client data is used or implied.
       The four totals are scaled to the FY2025 draft figures already shown on impact.html
       ($549M capital, 712 businesses started, 3,723 jobs, $201M sales growth) so the two pages agree.
       Where each light sits is invented. Production replaces `pins` and `quotes` with verified
       milestones from Neoserra.
"""
import json, math, pathlib, random, sys

if len(sys.argv) != 3:
    sys.exit(__doc__)

ROOT = pathlib.Path(__file__).parent
counties_src = json.load(open(sys.argv[1]))
places_src = json.load(open(sys.argv[2]))['places']
rng = random.Random(2027)

# ── Projection: equirectangular, corrected for latitude at the middle of the service area ──
W = 760.0
min_lng, min_lat, max_lng, max_lat = counties_src['metadata']['bbox']
cos0 = math.cos(math.radians((min_lat + max_lat) / 2))
K = W / ((max_lng - min_lng) * cos0)
H = (max_lat - min_lat) * K

def project(lng, lat):
    return ((lng - min_lng) * cos0 * K, (max_lat - lat) * K)

# ── Which SBDC center serves each county (center names as published by NorCal SBDC) ──
CENTERS = {
    'North Coast SBDC': ['Humboldt', 'Del Norte'],
    'Mendocino SBDC': ['Mendocino'],
    'Lake County SBDC': ['Lake'],
    'Shasta-Cascade SBDC': ['Shasta', 'Siskiyou', 'Trinity', 'Modoc', 'Lassen'],
    'Butte College SBDC': ['Butte', 'Glenn', 'Tehama', 'Plumas', 'Colusa'],
    'Sierra SBDC': ['Nevada', 'Placer', 'El Dorado', 'Sierra'],
    'Sacramento Valley SBDC': ['Sacramento', 'Yolo', 'Sutter', 'Yuba'],
    'San Joaquin SBDC': ['San Joaquin', 'Amador', 'Calaveras', 'Alpine'],
    'Sonoma SBDC': ['Sonoma'],
    'Solano-Napa SBDC': ['Solano', 'Napa'],
    'Marin SBDC': ['Marin'],
    'San Francisco SBDC': ['San Francisco'],
    'San Mateo SBDC': ['San Mateo'],
    'Silicon Valley SBDC': ['Santa Clara'],
    'East Bay SBDC': ['Alameda', 'Contra Costa'],
    'Santa Cruz SBDC': ['Santa Cruz'],
}
CENTER_OF = {county: center for center, names in CENTERS.items() for county in names}

# ── Counties ──
def rings(geometry):
    polys = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    return [[[project(*pt) for pt in ring] for ring in poly] for poly in polys]

counties, polygons = [], {}
for feature in sorted(counties_src['features'], key=lambda f: f['properties']['name']):
    name = feature['properties']['name']
    polys = rings(feature['geometry'])
    polygons[name] = polys
    path, xs, ys = '', [], []
    for poly in polys:
        for ring in poly:
            path += 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in ring[:-1]) + 'Z'
            xs += [x for x, _ in ring]; ys += [y for _, y in ring]
    counties.append({'n': name, 'c': CENTER_OF[name], 'd': path,
                     'b': [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]})
COUNTY_INDEX = {c['n']: i for i, c in enumerate(counties)}

def inside(x, y, polys):
    hit = False
    for poly in polys:
        for ring in poly:
            j = len(ring) - 1
            for i in range(len(ring)):
                xi, yi = ring[i]; xj, yj = ring[j]
                if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                    hit = not hit
                j = i
    return hit

# ── Town weights: larger places share more milestones; every small place keeps a little activity ──
MAJOR = {
    'san jose': 95, 'san francisco': 92, 'sacramento': 70, 'oakland': 56, 'stockton': 30, 'fremont': 22,
    'santa rosa': 22, 'hayward': 15, 'sunnyvale': 15, 'santa clara': 14, 'berkeley': 14, 'roseville': 14,
    'elk grove': 14, 'chico': 13, 'concord': 12, 'vallejo': 12, 'redding': 12, 'fairfield': 11, 'richmond': 11,
    'san mateo': 11, 'napa': 9, 'santa cruz': 9, 'mountain view': 9, 'redwood city': 9, 'daly city': 8,
    'walnut creek': 8, 'tracy': 8, 'palo alto': 8, 'vacaville': 8, 'livermore': 8, 'eureka': 7, 'davis': 7,
    'petaluma': 7, 'yuba city': 7, 'manteca': 7, 'folsom': 7, 'san rafael': 7, 'pleasanton': 7, 'lodi': 6,
    'rocklin': 6, 'woodland': 6, 'watsonville': 6, 'milpitas': 6, 'novato': 5, 'gilroy': 5, 'arcata': 4,
    'ukiah': 4, 'auburn': 4, 'grass valley': 4, 'truckee': 4, 'south lake tahoe': 4, 'oroville': 4,
    'placerville': 3, 'paradise': 3, 'red bluff': 3, 'marysville': 3, 'sonoma': 3, 'healdsburg': 3,
    'crescent city': 2.5, 'fort bragg': 2.5, 'sebastopol': 2.5, 'susanville': 2, 'lakeport': 2, 'clearlake': 2,
    'yreka': 2, 'half moon bay': 2, 'fortuna': 2, 'mckinleyville': 2, 'nevada city': 2, 'mount shasta': 1.5,
    'jackson': 1.5, 'willows': 1.5, 'colusa': 1.5, 'alturas': 1, 'weaverville': 1, 'quincy': 1, 'angels': 1,
}
towns, weights = [], []
for key, (lat, lng, county, label) in sorted(places_src.items()):
    if county not in polygons:
        continue
    x, y = project(lng, lat)
    towns.append({'key': key, 'label': label, 'county': county, 'x': x, 'y': y})
    weights.append(MAJOR.get(key, 0.62))
missing = sorted(set(MAJOR) - {t['key'] for t in towns})
assert not missing, f'not in places file: {missing}'

# ── Sample milestones ──
TYPES = ['hired', 'started', 'funding', 'sales']        # index is the type id used by the page
# Milestones of each kind, and the total their values must add up to (FY2025 draft figures from impact.html).
PLAN = {'hired': (1420, 3723), 'started': (712, 712), 'funding': (1130, 549_000_000), 'sales': (960, 201_000_000)}

def spot(town, weight):
    """A point near the town centre that stays inside the town's county (never in the ocean)."""
    spread = 1.5 + 1.5 * math.sqrt(weight)               # SVG units; roughly 1 km for a hamlet, 8 km for a city
    for _ in range(40):
        x, y = town['x'] + rng.gauss(0, spread), town['y'] + rng.gauss(0, spread * 0.92)
        if inside(x, y, polygons[town['county']]):
            return x, y
    return town['x'], town['y']

def values(kind, count, total):
    """Skewed sample values (many small, a few large) that add up to exactly `total`."""
    if kind == 'started':
        return [1] * count
    if kind == 'hired':
        out = [1] * count
        for _ in range(total - count):                   # extra jobs land unevenly: a few employers hire many
            out[int(count * rng.random() ** 2.2)] += 1
        rng.shuffle(out)
        return out
    raw = [rng.lognormvariate(0, 1.15) for _ in range(count)]
    out = [max(5, round(v * total / sum(raw) / 1000)) * 1000 for v in raw]
    out[out.index(max(out))] += total - sum(out)         # put the rounding remainder on the largest
    return out

def days_ago():
    """A gentle rise through the year, so the latest months are the busiest."""
    return int(364 * (1 - rng.random() ** 0.82))

used, pins = {}, []
for kind, (count, total) in PLAN.items():
    for town_index, v in zip(rng.choices(range(len(towns)), weights=weights, k=count), values(kind, count, total)):
        town = towns[town_index]
        x, y = spot(town, weights[town_index])
        slot = used.setdefault(town_index, len(used))
        pins.append([round(x, 1), round(y, 1), TYPES.index(kind), days_ago(), slot, v])
pins.sort(key=lambda p: -p[3])                           # oldest first, so the newest draw on top
town_list = [None] * len(used)
for town_index, slot in used.items():
    t = towns[town_index]
    town_list[slot] = [t['label'], COUNTY_INDEX[t['county']], round(t['x'], 1), round(t['y'], 1)]

# ── Sample quotes, credited by county only (the consent the forms ask for) ──
QUOTES = [
    ('hired', 'We went from just me to a team of four this year. My advisor helped me work out when I could afford each hire.'),
    ('funding', 'I didn’t know a loan like this existed for a business my size. Having someone walk through the application with me made the difference.'),
    ('sales', 'We reworked our pricing together in two sessions. It was the first year the numbers felt like they were on our side.'),
    ('started', 'I came in with an idea and a lot of questions. Nine months later I had a licence, a lease and my first customers.'),
    ('hired', 'Bringing on our first full-time employee felt like a leap. The planning we did beforehand made it a step.'),
    ('funding', 'The grant covered equipment we had put off for three years. We found it through a training I almost skipped.'),
    ('sales', 'A clearer marketing plan and cleaner books. Sales followed, and for once I can see why.'),
    ('started', 'Opening day was the best day. Getting there was a hundred small steps, and I never took one alone.'),
    ('hired', 'Two part-time roles became two full-time jobs. Those are neighbours of mine, working close to home.'),
    ('funding', 'A line of credit carried us through the slow season. We kept everyone on, and came back stronger.'),
    ('sales', 'We added wholesale this year. My advisor asked the questions I hadn’t thought to ask myself.'),
    ('started', 'I registered the business in the spring and made my first sale in the summer. It still feels new.'),
]
quotes, taken = [], set()
recent = [i for i, p in enumerate(pins) if 3 <= p[3] <= 150]
rng.shuffle(recent)
for kind, text in QUOTES:
    for i in recent:
        county = town_list[pins[i][4]][1]
        if pins[i][2] == TYPES.index(kind) and county not in taken:
            taken.add(county); quotes.append([i, text]); break

# ── Orientation labels and the signed-in sample client's town ──
def town_xy(key):
    t = next(t for t in towns if t['key'] == key)
    return t['x'], t['y']

LABELS = [('Eureka', 'eureka', 10, 4, 'start'), ('Redding', 'redding', 9, -7, 'start'), ('Chico', 'chico', 9, -6, 'start'),
          ('Santa Rosa', 'santa rosa', -10, -6, 'end'), ('Sacramento', 'sacramento', 10, -8, 'start'),
          ('San Francisco', 'san francisco', -11, 3, 'end'), ('Stockton', 'stockton', 10, 4, 'start'),
          ('San Jose', 'san jose', 11, 9, 'start'), ('Truckee', 'truckee', -9, -7, 'end')]
labels = []
for label, key, dx, dy, anchor in LABELS:
    x, y = town_xy(key)
    labels.append([label, round(x + dx, 1), round(y + dy, 1), anchor])

home_x, home_y = town_xy('eureka')
home_town = {'label': 'Eureka', 'county': 'Humboldt', 'x': home_x, 'y': home_y}
slots = []
while len(slots) < 12:
    x, y = spot(home_town, 3)
    if all(math.hypot(x - a, y - b) > 2.2 for a, b in slots):
        slots.append((round(x, 1), round(y, 1)))

data = {
    'note': 'Sample data for design review. Replace pins and quotes with verified milestones in production.',
    'view': [round(W), round(H)],
    'types': TYPES,
    'counties': counties,
    'towns': town_list,
    'pins': [v for p in pins for v in p],
    'quotes': quotes,
    'labels': labels,
    'home': {'town': 'Eureka', 'county': COUNTY_INDEX['Humboldt'], 'slots': slots},
}
out = ROOT / 'atlas-data.js'
out.write_text('/* Generated by homepage-preview/atlas-data.py. County outlines and town positions derive from US Census Bureau\n'
               '   files (public domain). Every milestone and quote here is SAMPLE content for design review. */\n'
               'window.MYSBDC_ATLAS_DATA=' + json.dumps(data, separators=(',', ':'), ensure_ascii=False) + ';\n')
by_type = {t: sum(1 for p in pins if p[2] == i) for i, t in enumerate(TYPES)}
print('wrote', out.name, out.stat().st_size, 'bytes ·', len(pins), 'milestones', by_type, '·', len(town_list), 'towns ·', len(quotes), 'quotes')
print('jobs', sum(p[5] for p in pins if p[2] == 0), 'capital', sum(p[5] for p in pins if p[2] == 2), 'sales', sum(p[5] for p in pins if p[2] == 3))
