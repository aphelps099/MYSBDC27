<?php
/**
 * Page not found.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main" tabindex="-1">
  <header class="entry-hero"><div class="shell">
    <p class="eyebrow"><?php esc_html_e( 'Page not found', 'mysbdc' ); ?></p>
    <h1><?php esc_html_e( 'We can’t find that page.', 'mysbdc' ); ?></h1>
    <p class="entry-lede"><?php esc_html_e( 'It may have moved. The homepage is a good place to start again.', 'mysbdc' ); ?></p>
    <a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Go to the homepage', 'mysbdc' ); ?></a>
  </div></header>
</main>
<?php
get_footer();
