<?php
/**
 * Theme supports, menu locations and body classes.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Register what the theme supports and where menus can go. */
function mysbdc_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );

	// The editor shows the same type and colour as the site.
	add_theme_support( 'editor-styles' );
	add_editor_style( array( 'assets/css/refined.css', 'assets/css/theme.css' ) );

	// Pages can carry a short summary, shown under the title.
	add_post_type_support( 'page', 'excerpt' );

	register_nav_menus(
		array(
			'primary'        => __( 'Header', 'mysbdc' ),
			'footer-work'    => __( 'Footer, first column', 'mysbdc' ),
			'footer-network' => __( 'Footer, second column', 'mysbdc' ),
		)
	);
}
add_action( 'after_setup_theme', 'mysbdc_setup' );

/**
 * Which page-specific design is showing: "home", "impact", "atlas", "signup" or "inner".
 */
function mysbdc_view() {
	if ( is_front_page() ) {
		return 'home';
	}

	foreach ( mysbdc_linked_pages() as $key => $page ) {
		if ( is_page_template( $page['template'] ) ) {
			return $key;
		}
	}

	return 'inner';
}

/**
 * The body classes the stylesheets are written against.
 *
 * @param string[] $classes Classes WordPress already added.
 * @return string[]
 */
function mysbdc_body_classes( $classes ) {
	$by_view = array(
		'home'   => array( 'homepage-header-preview', 'video-hero-preview' ),
		'impact' => array( 'impact-page' ),
		'about' => array( 'about-page', 'about-brand-study' ),
		'atlas'  => array( 'atlas-page' ),
		'signup' => array( 'signup-page' ),
		'inner'  => array( 'inner-page' ),
	);

	return array_merge( $classes, $by_view[ mysbdc_view() ] );
}
add_filter( 'body_class', 'mysbdc_body_classes' );

/** Name the pattern group that holds this theme's page sections. */
function mysbdc_register_pattern_category() {
	register_block_pattern_category( 'mysbdc', array( 'label' => __( 'MySBDC sections', 'mysbdc' ) ) );
}
add_action( 'init', 'mysbdc_register_pattern_category' );

/**
 * A page description for search engines, unless an SEO plugin provides one.
 */
function mysbdc_meta_description() {
	if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' ) ) {
		return;
	}

	$description = '';
	if ( is_front_page() ) {
		$description = __( 'Your business, better. No-fee, confidential business advising, practical training, and specialist support across Northern California.', 'mysbdc' );
	} elseif ( is_singular() && has_excerpt() ) {
		$description = get_the_excerpt();
	}

	if ( '' !== $description ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( wp_strip_all_tags( $description ) ) );
	}
}
add_action( 'wp_head', 'mysbdc_meta_description', 1 );
