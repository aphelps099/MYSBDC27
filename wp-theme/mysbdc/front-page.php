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
foreach ( array( 'hero', 'help', 'testimonial', 'impact-statement', 'results', 'stories', 'newsletter' ) as $mysbdc_section ) {
	get_template_part( 'template-parts/home/' . $mysbdc_section );
}
?>
</main>
<?php
get_footer();
