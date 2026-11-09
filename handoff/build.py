#!/usr/bin/env python3
"""Assemble the handoff pages.

    python3 handoff/build.py

Each file in src/ is one page body. The first line names its layout:
    <!-- layout: app | active: dashboard | title: Dashboard -->
The layouts below are the shared template parts (header.php, the rail, footer.php in theme terms).
Output is plain static HTML in handoff/ with no build tooling needed to view it.
"""
import pathlib, re, hashlib
ROOT = pathlib.Path(__file__).parent
ICONS = (ROOT / 'src' / '_icons.svg').read_text()
VER = hashlib.md5((ROOT / 'assets' / 'mysbdc.css').read_bytes() + (ROOT / 'assets' / 'mysbdc.js').read_bytes()).hexdigest()[:8]

def icon(name, cls=''):
    return f'<svg class="icon {cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>{title} · MySBDC</title>
<link rel="stylesheet" href="assets/mysbdc.css?v={ver}">
<script defer src="assets/mysbdc.js?v={ver}"></script>
</head>
'''

NAV = [('dashboard', 'dashboard.html', 'home', 'Home'), ('events', 'events.html', 'calendar', 'Training'),
       ('milestones', 'milestones.html', 'flag', 'Milestones'), ('resources', 'resources.html', 'book', 'Resources')]

def app(body, m):
    home = 'dashboard-new.html' if m.get('state') == 'new' else 'dashboard.html'
    def item(key, href, ic, label, extra=''):
        act = ' active' if m['active'] == key else ''
        cur = ' aria-current="page"' if act else ''
        href = home if key == 'dashboard' else href
        return f'<li class="menu-item{act}{extra}"><a href="{href}"{cur}><span class="icon-wrap">{icon(ic)}</span><span class="label">{label}</span></a></li>'
    items = '\n        '.join(item(*n) for n in NAV)
    return HEAD.format(title=m['title'], ver=VER) + f'''<body>
{ICONS}
<a class="skip-link" href="#main-content">Skip to content</a>

<header id="header">
  <button id="site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu"><span class="burger-icon"><span class="bar"></span><span class="bar"></span></span><span class="visually-hidden">Menu</span></button>
  <a id="site-branding" href="{home}" aria-label="MySBDC home, North Coast SBDC"><span id="site-logo"><b>My</b>SBDC</span><span id="site-title">North Coast SBDC</span></a>
  <div id="site-utility-navigation">
    <a class="util-btn" href="#help" aria-label="Help">{icon('help')}<span class="label">Help</span></a>
    <button class="util-btn" type="button" aria-label="Language: English. Change language">{icon('globe')}<span class="label">English</span></button>
    <div class="site-user-navigation">
      <details>
        <summary aria-label="Your account, Avery"><span class="avatar">AP</span><span class="name">Avery</span></summary>
        <div class="dropdown-menu">
          <p class="who"><strong>Avery Phelps</strong>avery@example.com</p>
          <a class="dropdown-item" href="settings.html">{icon('settings')}Settings</a>
          <a class="dropdown-item" href="settings.html#business">{icon('briefcase')}Your business</a>
          <a class="dropdown-item" href="login.html">{icon('signout')}Sign out</a>
        </div>
      </details>
    </div>
  </div>
</header>

<!-- Menu rail (Crown's #site-menu). Icon + word; the toggle widens it to a labelled sidebar. On phones it is a four-item bottom tab bar. -->
<div id="site-menu">
  <nav class="primary-navigation" aria-label="Main">
    <ul class="menu">
        {items}
    </ul>
    <ul class="menu bottom">
        {item('settings', 'settings.html', 'settings', 'Settings', ' desktop-only')}
    </ul>
  </nav>
</div>

<div id="page">
  <main id="main-content" class="container {m.get("main","reveal")}">
{body}
  </main>
</div>

<footer id="footer">
  <div class="container">
    <p>Funded in part through a Cooperative Agreement with the U.S. Small Business Administration.</p>
    <p><a href="#privacy">Privacy</a> &nbsp;·&nbsp; <a href="#accessibility">Accessibility</a> &nbsp;·&nbsp; <a href="#help">Get help</a></p>
  </div>
</footer>
</body>
</html>
'''

def bare(body, m):
    return HEAD.format(title=m['title'], ver=VER) + f'<body>\n{ICONS}\n<a class="skip-link" href="#main-content">Skip to content</a>\n{body}\n</body>\n</html>\n'

LAYOUTS = {'app': app, 'bare': bare}

for src in sorted((ROOT / 'src').glob('[!_]*.html')):
    text = src.read_text()
    first, body = text.split('\n', 1)
    meta = dict(kv.strip().split(': ', 1) for kv in first.strip('<!- >\n').split('|'))
    body = re.sub(r'\{\{icon:([\w-]+)(?: ([\w -]+))?\}\}', lambda x: icon(x[1], x[2] or ''), body)
    (ROOT / src.name).write_text(LAYOUTS[meta['layout']](body.rstrip(), meta))
    print('built', src.name)
