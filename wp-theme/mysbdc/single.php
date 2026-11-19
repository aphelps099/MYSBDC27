<?php
/**
 * A single post: the same header as a page, with its category and date above the title.
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
	$mysbdc_categories = get_the_category();
	$mysbdc_kicker     = array_filter( array( $mysbdc_categories ? $mysbdc_categories[0]->name : '', get_the_date() ) );
	?>
<article <?php post_class( 'entry' ); ?>>
  <header class="entry-hero"><div class="shell">
    <p class="eyebrow"><?php echo esc_html( implode( ' · ', $mysbdc_kicker ) ); ?></p>
    <?php the_title( '<h1>', '</h1>' ); ?>
	<?php if ( has_excerpt() ) : ?>
    <p class="entry-lede"><?php echo esc_html( get_the_excerpt() ); ?></p>
	<?php endif; ?>
  </div></header>
  <div class="entry-content">
	<?php
	if ( has_post_thumbnail() ) {
		echo '<figure class="alignwide">';
		the_post_thumbnail( 'large' );
		echo '</figure>';
	}
	the_content();
	?>
  </div>
</article>
<?php endwhile; ?>
</main>
<?php
get_footer();
