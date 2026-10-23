"""Validate preview files without network writes or browser state mutation."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
VIEW=ROOT/'view'
errors=[]
class Links(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for attr in ('href','src'):
   raw=a.get(attr,'')
   if not raw or '{{' in raw:continue
   link=urlsplit(raw)
   if link.scheme or link.netloc or not link.path:continue
   dest=(self.path.parent/unquote(link.path)).resolve()
   if not dest.is_relative_to(ROOT):errors.append(f'{self.path.name}: path escapes repository: {raw}')
   elif not dest.exists():errors.append(f'{self.path.name}: missing {raw}')
for html in VIEW.glob('*.html'):
 p=Links(html);p.feed(html.read_text())
 if '<title>' not in html.read_text():errors.append(f'{html.name}: missing title')
for js in (VIEW/'assets').glob('*.js'):
 result=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
 if result.returncode:errors.append(result.stderr)
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(list(VIEW.glob("*.html")))} page routes/assets and {len(list((VIEW/"assets").glob("*.js")))} JavaScript modules.')
