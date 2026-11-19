<?php
/**
 * Template Name: Impact
 *
 * The results page: capital, businesses started, jobs and sales, with client stories.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main" tabindex="-1">
<?php get_template_part( 'template-parts/page-impact' ); ?>
</main>
<?php
get_footer();
