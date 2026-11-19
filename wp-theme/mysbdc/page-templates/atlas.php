<?php
/**
 * Template Name: Success Atlas
 *
 * The public map of milestones. Markup in template-parts/page-atlas.php, behaviour in assets/js/atlas.js.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main" tabindex="-1" data-atlas>
<?php get_template_part( 'template-parts/page-atlas' ); ?>
</main>
<?php
get_footer();
