<?php
/**
 * Styles, scripts and fonts.
 *
 * refined.css, impact.css, atlas.css and the scripts are copies of the files in
 * homepage-preview/ (see wp-theme/sync-assets.sh). theme.css holds only what
 * WordPress adds: editor-built pages, posts and the section patterns.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Version for a theme file, so browsers pick up a change as soon as it is uploaded.
 *
 * @param string $path Path below the theme folder.
 */
function mysbdc_file_version( $path ) {
	$file = get_theme_file_path( $path );

	return file_exists( $file ) ? (string) filemtime( $file ) : MYSBDC_VERSION;
}

/** Load a stylesheet from assets/css. */
function mysbdc_enqueue_style( $handle, $file, $deps = array() ) {
	wp_enqueue_style( $handle, mysbdc_asset( 'css/' . $file ), $deps, mysbdc_file_version( 'assets/css/' . $file ) );
}

/** Load a deferred script from assets/js. */
function mysbdc_enqueue_script( $handle, $file, $deps = array() ) {
	wp_enqueue_script(
		$handle,
		mysbdc_asset( 'js/' . $file ),
		$deps,
		mysbdc_file_version( 'assets/js/' . $file ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
}

/** Load what the current page needs. */
function mysbdc_enqueue_assets() {
	$view = mysbdc_view();

	wp_enqueue_style( 'mysbdc-fonts', MYSBDC_FONT_KIT_URL, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	mysbdc_enqueue_style( 'mysbdc-refined', 'refined.css', array( 'mysbdc-fonts' ) );
	mysbdc_enqueue_style( 'mysbdc-theme', 'theme.css', array( 'mysbdc-refined' ) );

	if ( 'signup' === $view ) {
		mysbdc_enqueue_script( 'mysbdc-signup', 'signup.js' );
		return;
	}

	mysbdc_enqueue_script( 'mysbdc-app', 'app.js' );
	if ( in_array( $view, array( 'home', 'about' ), true ) ) {
		mysbdc_enqueue_script( 'mysbdc-footer-reveal', 'footer-reveal.js' );
	}

	if ( 'home' === $view ) {
		mysbdc_enqueue_style( 'mysbdc-home-design', 'home-design.css', array( 'mysbdc-theme' ) );
		mysbdc_enqueue_script( 'mysbdc-home-design', 'home-design.js', array( 'mysbdc-app' ) );
		return;
	}

	if ( 'about' === $view ) {
		mysbdc_enqueue_style( 'mysbdc-home-design', 'home-design.css', array( 'mysbdc-theme' ) );
		wp_enqueue_style( 'mysbdc-about' );
	}

	if ( 'impact' === $view ) {
		mysbdc_enqueue_style( 'mysbdc-impact', 'impact.css', array( 'mysbdc-refined' ) );
	}

	if ( 'atlas' === $view ) {
		mysbdc_enqueue_style( 'mysbdc-atlas', 'atlas.css', array( 'mysbdc-refined' ) );
		mysbdc_enqueue_script( 'mysbdc-atlas-data', 'atlas-data.js' );
		mysbdc_enqueue_script( 'mysbdc-atlas', 'atlas.js', array( 'mysbdc-atlas-data' ) );
	} else {
		mysbdc_enqueue_script( 'mysbdc-motion', 'motion.js' );
	}
}
add_action( 'wp_enqueue_scripts', 'mysbdc_enqueue_assets' );

/** The editor loads the same fonts, so headings and tiles look as they will on the site. */
function mysbdc_enqueue_editor_fonts() {
	if ( is_admin() ) {
		wp_enqueue_style( 'mysbdc-fonts', MYSBDC_FONT_KIT_URL, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	}
}
add_action( 'enqueue_block_assets', 'mysbdc_enqueue_editor_fonts' );

/**
 * Connect early to the font host.
 *
 * @param array  $urls          Hosts already listed.
 * @param string $relation_type Hint type.
 * @return array
 */
function mysbdc_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = 'https://use.typekit.net';
	}

	return $urls;
}
add_filter( 'wp_resource_hints', 'mysbdc_resource_hints', 10, 2 );

/** Browser colour, and a usable menu when scripts are off. */
function mysbdc_head_extras() {
	$light = in_array( mysbdc_view(), array( 'signup', 'inner' ), true );
	printf( '<meta name="theme-color" content="%s">' . "\n", esc_attr( $light ? '#f5f1e8' : '#0f1c2d' ) );
	echo '<noscript><style>.primary-nav{display:flex;position:static;flex-wrap:wrap}.header-inner{flex-wrap:wrap;padding-block:20px}.menu-toggle{display:none}.primary-nav .mobile-start{display:flex}</style></noscript>' . "\n";
}
add_action( 'wp_head', 'mysbdc_head_extras', 2 );
