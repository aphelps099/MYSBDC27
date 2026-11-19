<?php
/**
 * Success Atlas page body.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- The dashboard's four milestone pictograms (handoff/src/_icons.svg), so the public totals are the same objects a client taps to share. -->
<svg class="atlas-sprite" aria-hidden="true" focusable="false" width="0" height="0">
  <symbol id="m-funding" viewBox="0 0 64 64"><path d="M21.4 21.4a18 18 0 1 1 19.9 21.5"/><circle class="icon-tone" cx="25" cy="38" r="17"/><circle cx="25" cy="38" r="17"/><path d="M29.5 31H24a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-5.5M25 28v20"/></symbol>
  <symbol id="m-growth" viewBox="0 0 64 64"><rect x="9" y="37" width="11" height="16" rx="3"/><rect x="27" y="26" width="11" height="27" rx="3"/><rect class="icon-tone" x="45" y="11" width="11" height="42" rx="3"/><rect x="45" y="11" width="11" height="42" rx="3"/></symbol>
  <symbol id="m-business" viewBox="0 0 64 64"><path class="icon-tone" d="m9 24 5-12h36l5 12a7.7 7.7 0 0 1-15.3 0 7.7 7.7 0 0 1-15.4 0A7.7 7.7 0 0 1 9 24Z"/><path d="m9 24 5-12h36l5 12H9Zm0 0a7.7 7.7 0 0 0 15.3 0 7.7 7.7 0 0 0 15.4 0A7.7 7.7 0 0 0 55 24M24.3 24 27 12m12.7 12L37 12M14 36v17h36V36M27 53V39h10v14"/></symbol>
  <symbol id="m-people" viewBox="0 0 64 64"><circle cx="23" cy="19" r="8"/><circle cx="45" cy="24" r="6"/><path class="icon-tone" d="M9 53v-6a14 14 0 0 1 28 0v6Z"/><path d="M9 53v-6a14 14 0 0 1 28 0v6ZM43 37a12 12 0 0 1 12 12v4H44"/></symbol>
</svg>

<section class="atlas-hero" aria-labelledby="atlas-title">
  <div class="shell">
    <!-- Design preview only. A milestone shared from the MySBDC dashboard preview in this browser. Not part of the public page. -->
    <aside class="atlas-preview" data-atlas-preview hidden aria-label="Design preview">
      <p><strong>Design preview.</strong> <span data-atlas-preview-text></span></p>
      <div class="atlas-preview-actions"><button class="atlas-link" type="button" data-atlas-clear>Clear</button></div>
    </aside>

    <div class="atlas-grid">
      <div class="atlas-lede">
        <p class="atlas-label">Success Atlas</p>
        <h1 id="atlas-title">Where Northern California is <em>growing.</em></h1>
        <p class="atlas-intro">Every mark is a milestone a local business shared with its SBDC over the last twelve months.</p>

        <!-- The four totals, as the dashboard's milestone tiles. Each is also the map's legend and its filter. -->
        <ul class="atlas-tiles" aria-label="Totals. Choose one to show only those milestones on the map.">
          <li><button class="atlas-tile is-funding" type="button" data-atlas-type="funding" aria-pressed="false"><svg class="pictogram" aria-hidden="true" focusable="false"><use href="#m-funding"/></svg><strong data-atlas-total="funding">$0</strong><span>Capital accessed</span></button></li>
          <li><button class="atlas-tile is-sales" type="button" data-atlas-type="sales" aria-pressed="false"><svg class="pictogram" aria-hidden="true" focusable="false"><use href="#m-growth"/></svg><strong data-atlas-total="sales">$0</strong><span>Sales growth</span></button></li>
          <li><button class="atlas-tile is-started" type="button" data-atlas-type="started" aria-pressed="false"><svg class="pictogram" aria-hidden="true" focusable="false"><use href="#m-business"/></svg><strong data-atlas-total="started">0</strong><span>Businesses started</span></button></li>
          <li><button class="atlas-tile is-hired" type="button" data-atlas-type="hired" aria-pressed="false"><svg class="pictogram" aria-hidden="true" focusable="false"><use href="#m-people"/></svg><strong data-atlas-total="hired">0</strong><span>Jobs created</span></button></li>
        </ul>

        <p class="atlas-latest"><span class="atlas-label">Latest</span><span class="atlas-latest-line" data-atlas-latest aria-live="off"></span></p>
      </div>

      <div class="atlas-map">
        <svg class="atlas-svg" data-atlas-svg viewBox="-24 -24 808 1091" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Map of milestones shared across Northern California">
          <g class="atlas-context" data-atlas-context aria-hidden="true"></g>
          <g class="atlas-counties" data-atlas-counties aria-hidden="true"></g>
          <g class="atlas-pins" data-atlas-pins aria-hidden="true"></g>
          <g class="atlas-places" data-atlas-places aria-hidden="true"></g>
          <g class="atlas-mine" data-atlas-mine aria-hidden="true"></g>
          <g class="atlas-story-pins" data-atlas-story-pins></g>
        </svg>
        <div class="atlas-map-top">
          <div class="atlas-scope">
            <label class="visually-hidden" for="atlas-county">Show the whole region or one county</label>
            <select id="atlas-county" data-atlas-county><option value="">All of Northern California</option></select>
            <p class="atlas-scope-sub" data-atlas-scope-sub aria-live="polite"></p>
          </div>
          <button class="atlas-link atlas-present-on" type="button" data-atlas-present aria-pressed="false">Present</button>
          <button class="atlas-link atlas-present-off" type="button" data-atlas-present-exit>Exit</button>
        </div>
        <div class="atlas-stage" data-atlas-stage>
          <div class="atlas-furniture" aria-hidden="true"><span class="atlas-north">N</span><span class="atlas-scale"><i data-atlas-scale-bar></i><span data-atlas-scale-label>50 mi</span></span></div>
          <p class="atlas-tip" data-atlas-tip hidden></p>
          <!-- One story or testimony at a time, shown from a ringed mark. -->
          <div class="atlas-pop" data-atlas-pop hidden>
            <div class="atlas-pop-photo" data-atlas-pop-photo hidden><img alt="" data-atlas-pop-img></div>
            <p class="atlas-pop-title" data-atlas-pop-title></p>
            <div class="atlas-pop-who"><span class="atlas-avatar" data-atlas-pop-avatar hidden aria-hidden="true"></span><p class="atlas-pop-by" data-atlas-pop-by></p></div>
            <a class="atlas-link" data-atlas-pop-link target="_blank" rel="noopener">Read story</a>
          </div>
        </div>
        <div class="atlas-time">
          <ol class="atlas-months" data-atlas-months aria-label="Show milestones through a month"></ol>
          <div class="atlas-time-row">
            <button class="atlas-play" type="button" data-atlas-play aria-pressed="false"><span class="atlas-play-mark" aria-hidden="true"></span><span data-atlas-play-label>Play the year</span></button>
            <p class="atlas-through" data-atlas-through aria-live="polite">The last 12 months</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Live notices for milestones as they arrive: the kind, the figure and the town. Never a name or a business. -->
<div class="atlas-toasts" data-atlas-toasts role="status" aria-live="polite"></div>

<section class="atlas-stories" aria-labelledby="atlas-stories-title">
  <div class="shell">
    <div class="atlas-stories-head">
      <h2 id="atlas-stories-title">Two of <span data-atlas-count>4,222</span>.</h2>
      <p>Every mark on the map is a business moving forward. Here are two of them.</p>
    </div>
    <ul class="atlas-cards" data-atlas-cards></ul>
    <a class="atlas-link atlas-stories-more" href="https://www.norcalsbdc.org/about/clients/">Explore more client stories</a>
  </div>
</section>

<section class="atlas-next" aria-labelledby="atlas-next-title">
  <div class="shell"><div class="atlas-next-card">
    <div><p class="atlas-label">Your business, better.</p><h2 id="atlas-next-title">Add your milestone to the map.</h2></div>
    <p class="atlas-next-say">Working with an SBDC advisor? Share what’s new in MySBDC. It takes about four minutes, and your name stays private.</p>
    <div class="atlas-next-actions"><a class="button button-pool" href="<?php echo esc_url( mysbdc_dashboard_url() ); ?>" aria-label="Share a milestone in the MySBDC dashboard preview">Share a milestone</a><a class="atlas-link" href="<?php echo esc_url( mysbdc_signup_url() ); ?>">New here? Find your advisor</a></div>
  </div></div>
</section>

<section class="atlas-notes shell" aria-label="About this map">
  <details class="atlas-table"><summary>Totals by county</summary><div class="atlas-table-scroll"><table><caption class="visually-hidden">Milestones by county for the period shown on the map</caption><thead><tr><th scope="col">County</th><th scope="col">SBDC center</th><th scope="col" class="num">Milestones</th><th scope="col" class="num">Capital accessed</th><th scope="col" class="num">Sales growth</th><th scope="col" class="num">Businesses started</th><th scope="col" class="num">Jobs created</th></tr></thead><tbody data-atlas-rows></tbody></table></div></details>
  <details><summary>About this map</summary><div><p>This page is a design preview. The four network totals match the FY2025 draft figures on the impact page. County and state outlines are simplified from US Census Bureau files. Where each mark sits, the county breakdowns and the dates are sample content and need real reporting data before public release.</p><p>The two named success stories are existing client stories from the website draft, placed at their town or county. The three quotes on the map are sample content.</p><p>A mark shows a town and a kind of milestone. It never shows a person, a business name or an amount. Jobs and dollars appear only as totals for the region or a county, and a milestone is added once an SBDC advisor confirms it. Business owners choose whether their milestone appears here, and a named story appears only with the owner’s agreement.</p><p>Capital accessed, sales growth, jobs created, and businesses started are different measures and should not be added together.</p><p>Questions about our results? <a href="mailto:info@norcalsbdc.org">Contact NorCal SBDC</a>.</p></div></details>
</section>
