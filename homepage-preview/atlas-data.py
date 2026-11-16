#!/usr/bin/env python3
"""Generate homepage-preview/atlas-data.js for the public Success Atlas page.

    python3 homepage-preview/atlas-data.py US_ATLAS_COUNTIES_10M PLACES_JSON

Sources, both public domain and derived from US Census Bureau files:
    US_ATLAS_COUNTIES_10M   counties-10m.json from the us-atlas package (TopoJSON of the Census cartographic
                            boundary files): https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json
    PLACES_JSON             mysbdc-tools public/data/advisor-map/places.v1.json (Census Gazetteer places)

The output holds four things:
    1. The 36 service-area county outlines, projected to a flat SVG coordinate space.
    2. The surroundings, for context only: the rest of California and the neighbouring states.
    3. Town positions in the same space.
    4. A seeded SAMPLE set of milestones for design review. No real client data is used or implied.
       The four totals are scaled to the FY2025 draft figures already shown on impact.html
       ($549M capital, 712 businesses started, 3,723 jobs, $201M sales growth) so the two pages agree.
       Where each mark sits is invented. Production replaces `pins` with verified milestones from Neoserra.
"""
import json, math, pathlib, random, sys

if len(sys.argv) != 3:
    sys.exit(__doc__)

ROOT = pathlib.Path(__file__).parent
topo = json.load(open(sys.argv[1]))
places_src = json.load(open(sys.argv[2]))['places']
rng = random.Random(2027)

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

# ── Read the topology. Counties and states share the same arcs, so their borders always agree. ──
sx, sy = topo['transform']['scale']
tx, ty = topo['transform']['translate']

def decode(arc):
    x = y = 0
    out = []
    for dx, dy in arc:
        x += dx; y += dy
        out.append((x * sx + tx, y * sy + ty))
    return out

arcs_ll = [decode(a) for a in topo['arcs']]

def geometry_polys(geometry):
    """A geometry as a list of polygons, each a list of rings, each a list of arc references."""
    if geometry['type'] == 'Polygon':
        return [geometry['arcs']]
    if geometry['type'] == 'MultiPolygon':
        return geometry['arcs']
    return []

def ring_points(ring, arcs):
    pts = []
    for ref in ring:
        arc = arcs[ref] if ref >= 0 else arcs[~ref][::-1]
        pts += arc if not pts else arc[1:]
    return pts

def area(pts):
    return abs(sum(pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1] for i in range(len(pts) - 1))) / 2

def mainland(geometry):
    """Drop small offshore islands (the Farallones, for one) so they do not stretch the map or float in the sea."""
    polys = geometry_polys(geometry)
    sized = [(area(ring_points(poly[0], arcs_ll)), poly) for poly in polys]
    biggest = max(a for a, _ in sized)
    return [poly for a, poly in sized if a == biggest or a >= 0.002]   # 0.002 square degrees is about 19 km²

CA = [g for g in topo['objects']['counties']['geometries'] if g['id'].startswith('06')]
service_geoms = sorted((g for g in CA if g['properties']['name'] in CENTER_OF), key=lambda g: g['properties']['name'])
assert len(service_geoms) == 36, len(service_geoms)
other_ca = [g for g in CA if g['properties']['name'] not in CENTER_OF]
NEIGHBOURS = {'41': 'Oregon', '32': 'Nevada', '16': 'Idaho', '49': 'Utah', '04': 'Arizona'}
states = [g for g in topo['objects']['states']['geometries'] if g['id'] in NEIGHBOURS]

# ── Projection: equirectangular, corrected for latitude at the middle of the service area ──
lls = [pt for g in service_geoms for poly in mainland(g) for pt in ring_points(poly[0], arcs_ll)]
min_lng, max_lng = min(p[0] for p in lls), max(p[0] for p in lls)
min_lat, max_lat = min(p[1] for p in lls), max(p[1] for p in lls)
W = 760.0
cos0 = math.cos(math.radians((min_lat + max_lat) / 2))
K = W / ((max_lng - min_lng) * cos0)
H = (max_lat - min_lat) * K

def project(lng, lat):
    return ((lng - min_lng) * cos0 * K, (max_lat - lat) * K)

# ── Simplify every arc once (Douglas–Peucker), so shared borders stay shared. ──
def simplify(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy) or 1e-12
        far, at = 0.0, -1
        for i in range(a + 1, b):
            d = abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / norm if norm > 1e-9 else math.hypot(pts[i][0] - ax, pts[i][1] - ay)
            if d > far:
                far, at = d, i
        if far > tol:
            keep[at] = True
            stack += [(a, at), (at, b)]
    return [p for p, k in zip(pts, keep) if k]

def closed_ok(pts, raw):
    """A ring made of a single arc must keep enough points to stay a shape."""
    return pts if len(pts) >= 4 or raw[0] != raw[-1] else raw[:: max(1, len(raw) // 6)] + [raw[-1]]

TOLERANCE = 0.75                                         # SVG units: about one screen pixel on a laptop
arcs_xy = []
for raw in arcs_ll:
    # Only arcs anywhere near the map are worth the work; the rest are never referenced.
    if not any(-128 < lng < -108 and 30 < lat < 50 for lng, lat in raw[:: max(1, len(raw) // 8)] + [raw[-1]]):
        arcs_xy.append(None); continue
    xy = [project(*p) for p in raw]
    arcs_xy.append(closed_ok(simplify(xy, TOLERANCE), xy))

def path_of(polys):
    d, xs, ys, rings = '', [], [], []
    for poly in polys:
        out = []
        for ring in poly:
            pts = ring_points(ring, arcs_xy)
            d += 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts[:-1]) + 'Z'
            xs += [x for x, _ in pts]; ys += [y for _, y in pts]
            out.append(pts)
        rings.append(out)
    return d, xs, ys, rings

# ── The service area: 36 counties ──
counties, polygons = [], {}
for g in service_geoms:
    name = g['properties']['name']
    d, xs, ys, rings = path_of(mainland(g))
    polygons[name] = rings
    counties.append({'n': name, 'c': CENTER_OF[name], 'd': d,
                     'b': [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]})
COUNTY_INDEX = {c['n']: i for i, c in enumerate(counties)}

# ── The surroundings, for context only: the rest of California and the neighbouring states ──
context_land = ''.join(path_of(mainland(g))[0] for g in other_ca) + ''.join(path_of(mainland(g))[0] for g in states)
state_lines = ''.join(path_of(mainland(g))[0] for g in states)
# kind: sea (the ocean), water (a smaller coastal feature), land (a neighbour). Then the text anchor.
GEO_LABELS = [('Pacific', -124.22, 38.16, 'sea', 'middle'), ('Ocean', -124.22, 37.98, 'sea', 'middle'),
              ('Oregon', -121.05, 42.15, 'land', 'start'), ('Nevada', -119.84, 40.75, 'land', 'start'),
              ('California', -120.62, 37.2, 'land', 'start'),
              ('Point Arena', -123.8, 38.93, 'water', 'end'), ('Monterey Bay', -122.16, 36.71, 'water', 'middle')]
geo_labels = [[text, round(project(lng, lat)[0], 1), round(project(lng, lat)[1], 1), kind, anchor] for text, lng, lat, kind, anchor in GEO_LABELS]

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
    town_list[slot] = [t['label'], COUNTY_INDEX[t['county']], round(t['x'], 1), round(t['y'], 1), int(MAJOR.get(t['key'], 0) >= 2)]

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

# ── Featured marks: a few success stories and testimonies, each tied to a place ──
# The two success stories are existing client stories from the website draft (Stories.dc.html and the
# homepage). `tone` is the milestone tile the story's headline figure belongs to. The three "voice"
# quotes are sample content, credited by county only.
FEATURED = [
    dict(kind='story', at='petaluma', place='Petaluma', name='Jump Aero', meta='Advanced aviation · Petaluma',
         title='$12M raised. A faster path to first flight.',
         tone='funding', figure='$12M', line='raised. A faster path to first flight.',
         img='https://www.norcalsbdc.org/wp-content/uploads/2026/05/jump-aero-1198x1200.jpeg',
         alt='Jump Aero first-response aircraft in flight', pos='50% 50%',
         href='https://www.norcalsbdc.org/client-stories/jump-aero-raises-12m-to-build-the-worlds-fastest-first-response-aircraft/'),
    dict(kind='voice', at='redding',
         title='We went from just me to a team of four this year. My advisor helped me work out when I could afford each hire.'),
    dict(kind='story', at='san rafael', place='Marin County', name='Yarrow Goods', meta='Ecommerce · Marin County',
         title='$138K raised. Sales up 20%.',
         tone='sales', figure='+20%', line='in sales, with $138K raised.',
         img='https://www.norcalsbdc.org/wp-content/uploads/sites/9/2024/07/2024-Client-Success-Story-Yarrow-Goods-Owners.jpeg',
         alt='The owners of Yarrow Goods with one of their products', pos='50% 100%', zoom=1.5,
         # The photograph is square with the two owners in its lower half. The small card on the map is
         # wide, so it needs its own crop, centred on their faces.
         popPos='50% 73%', popOrigin='65% 50%', popZoom=1.5,
         href='https://www.norcalsbdc.org/shared/client-stories/yarrow-goods/'),
    dict(kind='voice', at='sacramento',
         title='I came in with an idea and a lot of questions. Nine months later I had a licence, a lease and my first customers.'),
    dict(kind='voice', at='truckee',
         title='The grant covered equipment we had put off for three years. We found it through a training I almost skipped.'),
]
stories = []
for f in FEATURED:
    at = f.pop('at')
    t = next(t for t in towns if t['key'] == at)
    stories.append(dict(f, x=round(t['x'], 1), y=round(t['y'], 1), town=t['label'], county=COUNTY_INDEX[t['county']]))

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
    'miles': round(69.05 / K, 5),      # miles per map unit, for the scale bar
    'types': TYPES,
    'counties': counties,
    'context': {'land': context_land, 'lines': state_lines, 'labels': geo_labels},
    'towns': town_list,
    'pins': [v for p in pins for v in p],
    'quotes': quotes,
    'stories': stories,
    'labels': labels,
    'home': {'town': 'Eureka', 'county': COUNTY_INDEX['Humboldt'], 'slots': slots},
}
out = ROOT / 'atlas-data.js'
out.write_text('/* Generated by homepage-preview/atlas-data.py. County and state outlines and town positions derive from\n'
               '   US Census Bureau files (public domain). Every milestone and quote here is SAMPLE content for design review. */\n'
               'window.MYSBDC_ATLAS_DATA=' + json.dumps(data, separators=(',', ':'), ensure_ascii=False) + ';\n')
by_type = {t: sum(1 for p in pins if p[2] == i) for i, t in enumerate(TYPES)}
print('wrote', out.name, out.stat().st_size, 'bytes ·', len(pins), 'milestones', by_type, '·', len(town_list), 'towns ·', len(quotes), 'quotes')
print('jobs', sum(p[5] for p in pins if p[2] == 0), 'capital', sum(p[5] for p in pins if p[2] == 2), 'sales', sum(p[5] for p in pins if p[2] == 3))
