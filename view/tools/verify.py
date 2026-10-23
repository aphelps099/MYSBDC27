"""Validate preview files without network writes or browser state mutation."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import subprocess
import sys
import re

ROOT=Path(__file__).resolve().parents[2]
VIEW=ROOT/'view'
errors=[]
class DesignRules(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.footer=0;self.ignore=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="footer":self.footer+=1
  if tag in ("script","style"):self.ignore+=1
  if not self.footer and re.search(r"border(?:-(?:top|bottom|left|right))?:\s*1px",a.get("style","")):errors.append(f"{self.path.name}: hairline outside footer")
  if a.get("component-from-global-scope","").endswith(".Arrow"):errors.append(f"{self.path.name}: decorative arrow component")
 def handle_endtag(self,tag):
  if tag=="footer":self.footer=max(0,self.footer-1)
  if tag in ("script","style"):self.ignore=max(0,self.ignore-1)
 def handle_data(self,data):
  if not self.ignore and re.match(r"^\s*0[1-9](?:\s*[—–-]\s*|\s*$)",data):errors.append(f"{self.path.name}: decorative section number: {data.strip()[:50]}")
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
 DesignRules(html).feed(html.read_text())
 if '<title>' not in html.read_text():errors.append(f'{html.name}: missing title')
for js in (VIEW/'assets').glob('*.js'):
 result=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
 if result.returncode:errors.append(result.stderr)
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(list(VIEW.glob("*.html")))} page routes/assets and {len(list((VIEW/"assets").glob("*.js")))} JavaScript modules.')
