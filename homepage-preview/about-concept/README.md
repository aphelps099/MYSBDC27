# About — separate design concept

November 24, 2026. Local study following the user-approved Advising V3 / Training direction. Original `About.dc.html`, existing `homepage-preview/about.html`, other concepts and WordPress remain unchanged.

Preview: http://127.0.0.1:8784/homepage-preview/about-concept/

## Design

Navy About title band, image-led opening with The Early Rise, network introduction with new original connected-businesses SVG, regional composition pairing 36 counties with the Golden Gate, dated impact results, partner/host explanation and one primary closing advising action. Proxima Nova / Proxima Sera, existing navy/cream/pool tokens, clean photo edges, no decorative eyebrows/numbering, no duplicate footer signup prompt. Header retains MySBDC and English dropdown (additional languages explicitly coming soon). Footer retains partner logos, nonitalic serif heading, large sans wordmark, social links and disclaimer.

References shared refined.css/home-design.css, Advising V3 concept.css (navigation/button primitives) and concept-page-headers.css. About-specific rules are isolated in concept.css. No mapped sync assets changed; no theme sync needed. Links to the Advising and Training concepts permit local review; external intake/center finder/program links use existing destinations.

## Content and imagery

- Design/content reference: https://aphelps099.github.io/MYSBDC27/About.dc.html — rendered live page reviewed in browser; local source also read. The unverified Laila quote, vague “last two years” framing, registration-duration claim, decorative numbering and placeholder `#` links were not carried over.
- Actual Laila O’Boyle / The Early Rise photograph and identity: https://www.norcalsbdc.org/shared/client-stories/from-oven-to-online-local-baker-scales-to-global-reach/ . Image uses its existing public NorCal media URL. No testimonial or outcome attributed beyond that source. Hero caption and story link identify her as the business owner, not an advisor.
- 36 counties, 2006 history, multilingual support and geographic scope: https://www.norcalsbdc.org/our-region/ . Omitted precise language/population/center counts rather than mixing older and newer figures.
- Impact values $1.56B capital, 111K jobs supported and 99% satisfaction retained from supplied prototype and checked against https://www.norcalsbdc.org/about/ . Visible reporting period is FFY 2022–2024, matching that source; these are historical results, not a current rolling-period claim. Link under results goes to source. No multipliers or causation claims added.
- Network host / funding: https://www.norcalsbdc.org/about/ and https://www.norcalsbdc.org/partners/ . Financial-disclosure link goes to official About page. Existing footer logos/disclaimer preserved.
- Golden Gate image reuses `../assets/about-golden-gate.webp`, already present in the supplied About studies. Visually reviewed; no new image generated or downloaded. Asset's original acquisition/license history was not independently established in this design pass.
- `assets/connected-businesses.svg` is new code-native decorative vector art; hidden from assistive technology. Buildings/connectors are illustrative, not a geographic map or a count of actual network offices.

## Validation and status

HTTP200; JS syntax, SVG XML, local asset paths, unique IDs, fragment destinations and Git whitespace checked. Desktop994/1440 opening and all sections visually reviewed; mobile390 opening/network/impact reviewed; width/overflow checks at320/768. All8 images loaded. Adjusted mobile heading/art layout after initial review. One H1; no empty placeholder links. Our region anchor works; English dropdown opens via Enter and closes with Escape, returning focus. Reduced-motion handling inherited from shared concept.css, reviewed in source (not OS-emulated).

Screenshots: desktop-preview.jpg, mobile-preview.jpg, network-preview.jpg, region-impact-preview.jpg. Temporary viewport reset; About preview retained at opening. Local only: no push, PR, deployment, WordPress writes or production changes. User review pending.
