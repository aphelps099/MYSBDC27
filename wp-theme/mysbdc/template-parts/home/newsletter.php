<?php
/**
 * Homepage: newsletter section.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="newsletter-section" aria-labelledby="newsletter-title"><div class="shell newsletter-grid"><div class="newsletter-copy"><p class="eyebrow">SBDC Intel</p><h2 id="newsletter-title">Good advice.<span>In your inbox.</span></h2><p>Workshops, funding opportunities, and practical ideas for your business.</p></div><form id="newsletter-form" class="newsletter-form"><div class="email-row"><div class="email-field"><label for="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@business.com" aria-describedby="newsletter-note" required></div><button type="submit" class="button" disabled>Subscribe</button></div><p id="newsletter-note" class="form-note">Preview only. No email will be sent or saved.</p><p id="newsletter-status" class="form-status" role="status" hidden></p><a class="text-link" id="newsletter-live-link" href="https://www.norcalsbdc.org/about/newsletter/" hidden>Subscribe on NorCal SBDC</a><noscript><p class="form-note">Please <a href="https://www.norcalsbdc.org/about/newsletter/">use the live newsletter page</a> to subscribe.</p></noscript></form></div></section>
