<?php
/**
 * Homepage: stories section.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="stories-section" id="stories" aria-labelledby="stories-title"><div class="shell"><div class="section-heading"><div><p class="eyebrow">The people behind the progress</p><h2 id="stories-title">Better looks different<br>for every business.</h2></div><a class="text-link" href="https://www.norcalsbdc.org/about/clients/">Meet our clients</a></div>
<?php get_template_part( 'template-parts/stories-grid' ); ?>
</div></section>
