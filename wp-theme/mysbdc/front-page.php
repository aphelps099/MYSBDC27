<?php
/**
 * The homepage. Each section is a file in template-parts/home/.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main" tabindex="-1">
<?php
if ( is_page() ) {
	while ( have_posts() ) {
		the_post();
		the_content();
	}
} else {
	// Preserve the approved page until the explicit Gutenberg migration is run.
	foreach ( mysbdc_home_sections() as $mysbdc_section ) {
		get_template_part( 'template-parts/home/' . $mysbdc_section );
	}
}
?>
</main>
<?php
get_footer();
