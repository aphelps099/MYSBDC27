<?php
/**
 * A page written in the editor: cream header with the title, then the content.
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
while ( have_posts() ) :
	the_post();
	$mysbdc_parent = wp_get_post_parent_id( get_the_ID() );
	?>
<article <?php post_class( 'entry' ); ?>>
  <header class="entry-hero"><div class="shell">
    <p class="eyebrow"><?php echo esc_html( $mysbdc_parent ? get_the_title( $mysbdc_parent ) : __( 'Northern California SBDC', 'mysbdc' ) ); ?></p>
    <?php the_title( '<h1>', '</h1>' ); ?>
	<?php if ( has_excerpt() ) : ?>
    <p class="entry-lede"><?php echo esc_html( get_the_excerpt() ); ?></p>
	<?php endif; ?>
  </div></header>
  <div class="entry-content">
	<?php the_content(); ?>
  </div>
</article>
<?php endwhile; ?>
</main>
<?php
get_footer();
