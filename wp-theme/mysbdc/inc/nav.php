<?php
/**
 * Menus.
 *
 * The header and footer menus are edited in Appearance > Menus. The design
 * uses plain links inside <nav>, so menus print as links without list markup.
 * Until a menu is assigned, each location shows the links from the design.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Prints each menu item as a single link.
 */
class MySBDC_Link_Walker extends Walker_Nav_Menu {

	/** Sub-menus are not part of the design. */
	public function start_lvl( &$output, $depth = 0, $args = null ) {}

	/** Sub-menus are not part of the design. */
	public function end_lvl( &$output, $depth = 0, $args = null ) {}

	/** Nothing to close: there is no list item. */
	public function end_el( &$output, $data_object, $depth = 0, $args = null ) {}

	/** One link. */
	public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
		$item = $data_object;

		$atts = array(
			'href'         => ! empty( $item->url ) ? $item->url : '',
			'title'        => ! empty( $item->attr_title ) ? $item->attr_title : '',
			'target'       => ! empty( $item->target ) ? $item->target : '',
			'rel'          => ! empty( $item->xfn ) ? $item->xfn : '',
			'aria-current' => ! empty( $item->current ) ? 'page' : '',
		);
		if ( '_blank' === $atts['target'] && '' === $atts['rel'] ) {
			$atts['rel'] = 'noopener';
		}

		// Classes typed into the menu item's "CSS Classes" field.
		$own_classes = array_filter( (array) get_post_meta( $item->ID, '_menu_item_classes', true ) );
		if ( $own_classes ) {
			$atts['class'] = implode( ' ', array_map( 'sanitize_html_class', $own_classes ) );
		}

		/** This filter is documented in wp-includes/class-walker-nav-menu.php */
		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$html = '';
		foreach ( $atts as $name => $value ) {
			if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
				$html .= sprintf( ' %s="%s"', $name, 'href' === $name ? esc_url( $value ) : esc_attr( $value ) );
			}
		}

		/** This filter is documented in wp-includes/post-template.php */
		$title = apply_filters( 'the_title', $item->title, $item->ID );
		/** This filter is documented in wp-includes/class-walker-nav-menu.php */
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$output .= '<a' . $html . '>' . $title . '</a>';
	}
}

/**
 * The links each menu location shows before a menu is assigned.
 *
 * @param string $location Menu location.
 * @return array<int, array{label: string, url: string, external?: bool}>
 */
function mysbdc_default_menu( $location ) {
	$menus = array(
		'primary'        => array(
			array( 'label' => __( 'Services', 'mysbdc' ), 'url' => mysbdc_home_anchor( 'help' ) ),
			array( 'label' => __( 'Programs', 'mysbdc' ), 'url' => mysbdc_home_anchor( 'programs' ) ),
			array( 'label' => __( 'Impact', 'mysbdc' ), 'url' => mysbdc_page_url( 'impact' ) ),
			array( 'label' => __( 'Atlas', 'mysbdc' ), 'url' => mysbdc_page_url( 'atlas' ) ),
		),
		'footer-work'    => array(
			array( 'label' => __( 'Advising', 'mysbdc' ), 'url' => mysbdc_home_anchor( 'advising' ) ),
			array( 'label' => __( 'Training', 'mysbdc' ), 'url' => 'https://www.norcalsbdc.org/events/' ),
			array( 'label' => __( 'Funding', 'mysbdc' ), 'url' => mysbdc_home_anchor( 'funding' ) ),
			array( 'label' => __( 'Resources', 'mysbdc' ), 'url' => 'https://www.norcalsbdc.org/services/', 'external' => true ),
		),
		'footer-network' => array(
			array( 'label' => __( 'Stories', 'mysbdc' ), 'url' => mysbdc_home_anchor( 'stories' ) ),
			array( 'label' => __( 'Success Atlas', 'mysbdc' ), 'url' => mysbdc_page_url( 'atlas' ) ),
			array( 'label' => __( 'About', 'mysbdc' ), 'url' => mysbdc_page_url( 'about' ) ),
			array( 'label' => __( 'Become a partner', 'mysbdc' ), 'url' => 'https://www.norcalsbdc.org/partnerships/', 'external' => true ),
		),
	);

	return $menus[ $location ] ?? array();
}

/** True when $url is the page being viewed. */
function mysbdc_is_current_url( $url ) {
	if ( str_contains( $url, '#' ) || ! is_singular() ) {
		return false;
	}

	return untrailingslashit( $url ) === untrailingslashit( (string) get_permalink() );
}

/**
 * Print the links for a menu location.
 *
 * @param string $location Menu location.
 */
function mysbdc_menu_links( $location ) {
	if ( has_nav_menu( $location ) ) {
		wp_nav_menu(
			array(
				'theme_location' => $location,
				'container'      => false,
				'items_wrap'     => '%3$s',
				'depth'          => 1,
				'walker'         => new MySBDC_Link_Walker(),
				'fallback_cb'    => false,
			)
		);
		return;
	}

	foreach ( mysbdc_default_menu( $location ) as $link ) {
		printf(
			'<a href="%1$s"%2$s%3$s>%4$s</a>',
			esc_url( $link['url'] ),
			empty( $link['external'] ) ? '' : ' target="_blank" rel="noopener"',
			mysbdc_is_current_url( $link['url'] ) ? ' aria-current="page"' : '',
			esc_html( $link['label'] )
		);
	}
}

/**
 * Heading for a footer column: the assigned menu's name, or the design's wording.
 *
 * @param string $location Menu location.
 * @param string $fallback Heading used when no menu is assigned.
 */
function mysbdc_menu_heading( $location, $fallback ) {
	$locations = get_nav_menu_locations();
	$menu      = isset( $locations[ $location ] ) ? wp_get_nav_menu_object( $locations[ $location ] ) : false;

	return $menu ? $menu->name : $fallback;
}
