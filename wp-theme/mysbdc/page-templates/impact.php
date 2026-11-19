<?php
/**
 * Template Name: Impact
 *
 * Editable Impact page; empty legacy pages retain their original layout.
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
while ( have_posts() ) : the_post();
	if ( '' !== trim( get_the_content() ) ) { the_content(); }
	else { get_template_part( 'template-parts/page-impact' ); }
endwhile;
?>
</main>
<?php
get_footer();
