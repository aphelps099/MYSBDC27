<?php
/**
 * Lists of posts: the blog, archives and search results.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

if ( is_search() ) {
	/* translators: %s: what the visitor searched for. */
	$mysbdc_heading = sprintf( __( 'Results for “%s”', 'mysbdc' ), get_search_query() );
} elseif ( is_archive() ) {
	$mysbdc_heading = get_the_archive_title();
} elseif ( is_home() && get_option( 'page_for_posts' ) ) {
	$mysbdc_heading = get_the_title( (int) get_option( 'page_for_posts' ) );
} else {
	$mysbdc_heading = __( 'News', 'mysbdc' );
}
?>
<main id="main" tabindex="-1">
  <header class="entry-hero"><div class="shell">
    <p class="eyebrow"><?php esc_html_e( 'Northern California SBDC', 'mysbdc' ); ?></p>
    <h1><?php echo wp_kses_post( $mysbdc_heading ); ?></h1>
  </div></header>
<?php if ( have_posts() ) : ?>
  <div class="shell entry-list">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
    <article <?php post_class( 'entry-card' ); ?>>
      <p class="eyebrow"><?php echo esc_html( get_the_date() ); ?></p>
      <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
      <p><?php echo esc_html( get_the_excerpt() ); ?></p>
      <a class="text-link" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( sprintf( /* translators: %s: post title. */ __( 'Read “%s”', 'mysbdc' ), get_the_title() ) ); ?>"><?php esc_html_e( 'Read more', 'mysbdc' ); ?></a>
    </article>
	<?php endwhile; ?>
  </div>
  <nav class="shell entry-pagination" aria-label="<?php esc_attr_e( 'More posts', 'mysbdc' ); ?>">
    <span><?php previous_posts_link( __( 'Newer', 'mysbdc' ) ); ?></span>
    <span><?php next_posts_link( __( 'Older', 'mysbdc' ) ); ?></span>
  </nav>
<?php else : ?>
  <div class="shell entry-list">
    <p><?php esc_html_e( 'Nothing here yet.', 'mysbdc' ); ?></p>
    <a class="text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to the homepage', 'mysbdc' ); ?></a>
  </div>
<?php endif; ?>
</main>
<?php
get_footer();
