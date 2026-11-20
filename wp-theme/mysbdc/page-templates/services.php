<?php
/**
 * Template Name: Services
 * Approved Services study, rendered from saved WordPress content.
 * @package MySBDC
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<main id="main" class="services-page-content" tabindex="-1">
<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
</main>
<?php get_footer(); ?>
