<?php
/**
 * Where the theme's links point.
 *
 * Templates call these helpers so that a page can be renamed or moved in
 * WordPress without editing any template.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * URL of a file in the theme's assets folder.
 *
 * @param string $path Path below assets/, such as "img/logo-white.png".
 */
function mysbdc_asset( $path ) {
	return get_theme_file_uri( 'assets/' . ltrim( $path, '/' ) );
}

/**
 * The page templates this theme links to, and the slug used when no page has the template yet.
 *
 * @return array<string, array{template: string, slug: string}>
 */
function mysbdc_linked_pages() {
	return array(
		'about' => array( 'template' => 'page-templates/about.php', 'slug' => 'about' ),
		'impact' => array(
			'template' => 'page-templates/impact.php',
			'slug'     => 'impact',
		),
		'atlas'  => array(
			'template' => 'page-templates/atlas.php',
			'slug'     => 'atlas',
		),
		'signup' => array(
			'template' => 'page-templates/signup.php',
			'slug'     => 'get-started',
		),
	);
}

/**
 * URL of the page that uses one of the theme's page templates.
 *
 * Looks for a published page with that template. Until one exists, it
 * returns the address the page is expected to have (for example /impact/).
 *
 * @param string $key One of "impact", "atlas" or "signup".
 */
function mysbdc_page_url( $key ) {
	static $found = array();

	$pages = mysbdc_linked_pages();
	if ( ! isset( $pages[ $key ] ) ) {
		return home_url( '/' );
	}

	if ( ! isset( $found[ $key ] ) ) {
		$ids = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'orderby'        => 'ID',
				'order'          => 'ASC',
				'fields'         => 'ids',
				'meta_key'       => '_wp_page_template',
				'meta_value'     => $pages[ $key ]['template'],
			)
		);

		$found[ $key ] = $ids ? get_permalink( $ids[0] ) : ( 'about' === $key ? 'https://www.norcalsbdc.org/about/' : home_url( '/' . $pages[ $key ]['slug'] . '/' ) );
	}

	return $found[ $key ];
}

/**
 * Where "Get started" goes, with the chosen program carried along.
 *
 * A "Get started link" set in the Customizer wins, so every call to action
 * can point at the live intake form while the built-in form is a preview.
 *
 * @param string $program Optional program slug, such as "tfg" or "capital".
 */
function mysbdc_signup_url( $program = '' ) {
	$override = trim( (string) mysbdc_setting( 'signup_url' ) );
	$url      = '' !== $override ? $override : mysbdc_page_url( 'signup' );

	if ( '' !== $program ) {
		$url = add_query_arg( 'program', rawurlencode( $program ), $url );
	}

	return $url;
}

/** Address of the signed-in MySBDC dashboard. */
function mysbdc_dashboard_url() {
	return (string) mysbdc_setting( 'dashboard_url' );
}

/** True while the dashboard link still points at the design preview. */
function mysbdc_dashboard_is_preview() {
	return MYSBDC_DASHBOARD_PREVIEW_URL === untrailingslashit( mysbdc_dashboard_url() );
}

/**
 * Link to a section of the homepage: "#help" on the homepage, "/#help" elsewhere.
 *
 * @param string $id Section id without the hash.
 */
function mysbdc_home_anchor( $id ) {
	return is_front_page() ? '#' . $id : home_url( '/#' . $id );
}
