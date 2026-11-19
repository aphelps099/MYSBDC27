<?php
/**
 * Template Name: About
 * @package MySBDC
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<main id="main" tabindex="-1">
<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
</main>
<?php get_footer(); ?>
