"""Copy the approved marketing designs into the isolated /view preview.

Dashboard, sign-in, intake and calendar are native HTML/JS; the retained
marketing pages use the repository's existing design runtime and tokens.
"""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'view'
ROUTES={
 'MySBDC Homepage.dc.html':'index.html','Advising.dc.html':'advising.html',
 'Trainings.dc.html':'training.html','Funding.dc.html':'funding.html',
 'Stories.dc.html':'stories.html','About.dc.html':'about.html',
 'Resources.dc.html':'resources.html','Partners.dc.html':'partners.html',
 'Careers.dc.html':'careers.html','Role - Business Advisor.dc.html':'business-advisor.html',
 'Story - Jump Aero.dc.html':'story-jump-aero.html','Story - Yarrow Goods.dc.html':'story-yarrow-goods.html',
 'AWS Initiative.dc.html':'aws-initiative.html',
 'MySBDC Dashboard.dc.html':'dashboard.html','MySBDC Sign In.dc.html':'sign-in.html',
 'MySBDC Intake.dc.html':'intake.html','Training Calendar.dc.html':'calendar.html',
}
NATIVE={'MySBDC Dashboard.dc.html','MySBDC Sign In.dc.html','MySBDC Intake.dc.html','Training Calendar.dc.html'}
FOOTER=(OUT/'templates/footer.html').read_text()
HEADER=(OUT/'templates/header.html').read_text()
for source,target in ROUTES.items():
 if source in NATIVE: continue
 text=(ROOT/source).read_text()
 text=text.replace('<html>','<html lang="en">').replace('<body>','<body id="page-top" class="public-preview">')
 title='NorCal SBDC · Your business, better' if target=='index.html' else source.replace('.dc.html','')+' · NorCal SBDC'
 text=text.replace('<head>',f'<head>\n<title>{title}</title>\n<meta name="robots" content="noindex,nofollow">')
 text=text.replace('src="./support.js"','src="../support.js"')
 text=text.replace('src="./image-slot.js"','src="../image-slot.js"')
 text=text.replace('href="_ds/','href="../_ds/').replace('src="_ds/','src="../_ds/')
 text=text.replace('src="assets/','src="../assets/').replace('src="uploads/','src="../uploads/')
 for old,new in ROUTES.items(): text=text.replace(old,new)
 # User direction: no decorative numbering, arrows, or hairline rules.
 text=re.sub(r'(>\s*)0\d\s*[—–-]\s*',r'\1',text)
 text=re.sub(r'<(span|strong)\b[^>]*>\s*0\d\s*</\1>','',text)
 text=re.sub(r'\{\{\s*\w+\.num\s*\}\}\s*[—–-]\s*','',text)
 text=text.replace('grid-template-columns:96px 1fr','grid-template-columns:1fr')
 text=re.sub(r'<x-import\b[^>]*component-from-global-scope="[^"]*\.Arrow"[^>]*></x-import>','',text)
 text=text.replace(' arrow="{{ true }}"','')
 text=re.sub(r"border(?:-(?:top|right|bottom|left))?:1px[^;\"'\n}<]*",lambda m:m.group(0).split(':')[0]+':0',text)
 text=re.sub(r"'1px solid [^']*'","'none'",text)
 # One shared footer, with the newsletter built into it, across the public preview.
 text=re.sub(r'<section\b[^>]*data-screen-label="Newsletter"[\s\S]*?</section>', '', text)
 text=re.sub(r'<footer\b[\s\S]*?</footer>', lambda _: FOOTER, text)
 # Retain the light/dark brand context, with one shared navigation layout.
 def header(m):
  dark='norcal-white' in m.group(0)
  logo='americas-sbdc-norcal-white-180h.png' if dark else 'americas-sbdc-norcal-400w.png'
  return HEADER.replace('{{THEME}}','site-header--dark' if dark else '').replace('{{LOGO}}','https://www.norcalsbdc.org/wp-content/themes/norcal-sbdc/assets/img/logos/'+logo)
 text=re.sub(r'<header\b[\s\S]*?</header>',header,text)
 # Page-specific refinements live inside /view so the original designs are preserved.
 # Keep the homepage headline's sentences together for a calmer silhouette.
 if target=='index.html':
  announcement=(OUT/'templates/home/announcement.html').read_text()
  text=re.sub(r'<sc-if value="{{ showAnnouncement }}"[\s\S]*?</sc-if>',lambda _: announcement,text)
  text=text.replace('</helmet>','<link rel="stylesheet" href="assets/homepage.css?v=20261025-motion">\n</helmet>')
  text=text.replace('</body>','<script type="module" src="assets/homepage.js?v=20261025-motion"></script>\n</body>')
  text=re.sub(r'<h1([^>]*)>Business is personal\. The advice should be, too\.</h1>',r'<h1\1 class="homepage-hero-title"><span class="hero-sentence">Business is personal.</span> <span class="hero-sentence">The advice should be, too.</span></h1>',text)
 if target=='advising.html':
  for label,filename in {'Core services':'core-services.html','Find your specialist':'specialists.html','Client voice':'client-voice.html'}.items():
   section=(OUT/'templates/advising'/filename).read_text()
   text=re.sub(r'<section\b[^>]*data-screen-label="'+re.escape(label)+r'"[\s\S]*?</section>',lambda _: section,text)
  text=text.replace('</helmet>','<link rel="stylesheet" href="assets/advising.css?v=20261023-advising">\n</helmet>')
 if target=='training.html':
  saved_header=re.search(r'<header\b[\s\S]*?</header>',text).group(0)
  for label,filename in {'Hero':'hero.html','Upcoming trainings':'upcoming.html'}.items():
   section=(OUT/'templates/training'/filename).read_text().replace('{{HEADER}}',saved_header)
   text=re.sub(r'<section\b[^>]*data-screen-label="'+re.escape(label)+r'"[\s\S]*?</section>',lambda _: section,text)
  text=text.replace('</helmet>','<link rel="stylesheet" href="assets/training-cards.css?v=20261023-progress">\n</helmet>')
  text=text.replace('</body>','<script type="module" src="assets/training-public.js?v=20261023-progress"></script>\n</body>')
 if target=='story-yarrow-goods.html':
  saved_header=re.search(r'<header\b[\s\S]*?</header>',text).group(0)
  content=(OUT/'templates/story/yarrow.html').read_text().replace('{{HEADER}}',saved_header)
  start=text.index('<section data-screen-label="Story hero"')
  end=text.index('<footer',start)
  text=text[:start]+content+text[end:]
  text=text.replace('</helmet>','<link rel="stylesheet" href="assets/story.css?v=20261023-progress">\n</helmet>')
 # Load responsive overrides after the design component's own styles.
 text=text.replace('</helmet>','<link rel="stylesheet" href="assets/public.css?v=20261025-motion">\n<link rel="stylesheet" href="assets/navigation.css?v=20261025-navspace">\n</helmet>')
 text=text.replace('</body>','<script type="module" src="assets/public.js?v=20261025-motion"></script>\n</body>')
 # Classify retained inline layouts so mobile behavior is explicit and repeatable.
 def classify(m):
  tag,attrs=m.group(1),m.group(2)
  style=re.search(r'style="([^"]*)"',attrs)
  if not style:return m.group(0)
  s=style.group(1);classes=[]
  if 'var(--sera)' in s and tag not in {'h1','blockquote'}:
   classes.append('preview-sans-title')
   if tag=='strong':classes.append('preview-stat')
  if 'width:min(' in s and '100% - ' in s: classes.append('preview-shell')
  if 'display:flex' in s and 'margin-top:44px' in s: classes.append('preview-actions')
  if 'display:grid' in s:
   classes.append('preview-compact-grid' if re.search(r'grid-template-columns:(?:112px|56px|80px)',s) else 'preview-grid')
  if tag=='section' and re.search(r'padding:(?:[789]\d|1\d\d)px',s):classes.append('preview-section')
  if classes:
   if 'class="' in attrs:attrs=attrs.replace('class="','class="'+' '.join(classes)+' ',1)
   else:attrs+=' class="'+' '.join(classes)+'"'
  return '<'+tag+attrs+'>'
 text=re.sub(r'<([\w-]+)(\s[^<>]*?)>',classify,text)
 text=text.replace('About 20 minutes.','About 10 minutes.').replace('in about 20 minutes','in about 10 minutes')
 if target=='training.html':
  text=text.replace('Tue, Sep 1 · 10:00 AM','Wed, Oct 28 · 10:00 AM')
  text=re.sub(r"const events = \[[\s\S]*?\];", """const events = [
      { day: '28', month: 'Oct', title: 'Pricing for profit', meta: 'Wed · 10:00 AM · 90 minutes', format: 'Online' },
      { day: '30', month: 'Oct', title: 'Marketing on a $0 budget', meta: 'Fri · 12:00 PM · 60 minutes', format: 'Online' },
      { day: '03', month: 'Nov', title: 'Cash flow clinic: bring your numbers', meta: 'Tue · 9:00 AM · Eureka · 90 minutes', format: 'In person' },
      { day: '04', month: 'Nov', title: 'Business plan in a day', meta: 'Wed · 10:00 AM · 2 hours', format: 'Online' }
    ];""",text)
 (OUT/target).write_text('\n'.join(line.rstrip() for line in text.splitlines())+'\n')
# The native calendar shares the same footer and its lightweight interactions.
calendar=(OUT/'calendar.html').read_text()
calendar=calendar.replace('<body class="public-preview">','<body id="page-top" class="public-preview">')
calendar=re.sub(r'<footer\b[\s\S]*?</footer>',lambda _: FOOTER,calendar)
calendar=re.sub(r'<header\b[\s\S]*?</header>',lambda _: HEADER.replace('{{THEME}}','').replace('{{LOGO}}','https://www.norcalsbdc.org/wp-content/themes/norcal-sbdc/assets/img/logos/americas-sbdc-norcal-400w.png'),calendar)
if 'assets/navigation.css' not in calendar:calendar=calendar.replace('</head>','<link rel="stylesheet" href="assets/navigation.css?v=20261025-navspace"></head>')
calendar=re.sub(r'(assets/(?:public|navigation)\.(?:css|js)\?v=)[^"]+',r'\g<1>20261025-motion',calendar)
calendar=calendar.replace('assets/navigation.css?v=20261025-motion','assets/navigation.css?v=20261025-navspace')
if 'src="assets/public.js' not in calendar:
 calendar=calendar.replace('</body>','<script type="module" src="assets/public.js?v=20261023-footer"></script></body>')
(OUT/'calendar.html').write_text(calendar)
print(f'Prepared {len(ROUTES)-len(NATIVE)} marketing pages in {OUT}')
