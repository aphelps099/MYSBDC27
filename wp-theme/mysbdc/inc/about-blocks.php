<?php
/** Editable About page. No page content is changed by theme activation or deployment. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function mysbdc_about_sections() {
	return array( 'intro', 'advisors', 'network', 'region', 'story', 'next', 'purpose', 'possibility' );
}
function mysbdc_about_metadata( $section ) {
	if ( ! in_array( $section, mysbdc_about_sections(), true ) ) { return array(); }
	return json_decode( file_get_contents( get_theme_file_path( 'blocks/about-' . $section . '/block.json' ) ), true );
}
function mysbdc_about_attributes( $section, $supplied = array() ) {
	$values = array();
	foreach ( mysbdc_about_metadata( $section )['attributes'] as $name => $schema ) {
		$values[ $name ] = isset( $supplied[ $name ] ) && is_string( $supplied[ $name ] ) ? $supplied[ $name ] : $schema['default'];
	}
	return $values;
}
function mysbdc_about_media( $url ) {
	return str_starts_with( $url, '@theme/' ) ? mysbdc_asset( 'img/' . basename( $url ) ) : $url;
}

/** Initial pattern copy only; existing saved block defaults stay intact. */
function mysbdc_about_study_copy( $section ) {
	$copy = array(
		'intro' => array(
			'heading' => 'We’re here to help',
			'description' => 'NorCal SBDC empowers entrepreneurs on their journey with advising, training and capital that lead to prosperous local communities.',
		),
		'possibility' => array(
			'heading' => "Good ideas\ncome from\neverywhere",
			'description' => 'From the neighborhood gym to the next way we fly, ambition takes all kinds of shapes in Northern California.',
			'supportText' => 'Business advising, training and connections to capital help turn that ambition into a next step.',
			'photo1Caption' => 'In the neighborhood',
			'photo2Caption' => 'Out in the field',
			'photo3Caption' => 'Up in the air',
		),
		'advisors' => array(
			'heading' => 'We’re your business people',
			'line1' => 'Big questions',
			'line2' => 'Fresh perspectives',
			'line3' => 'Your next chapter',
			'storyText' => 'Bring your big idea, your next challenge or the question that keeps you up at night. We’ll work through it together.',
			'supportText' => 'Confidential advice at no fee',
			'portraitCaption' => 'Meet Melanie, Paul & Amandeep · North Coast SBDC',
		),
		'purpose' => array(
			'hostImage' => 'https://live.staticflickr.com/65535/55506344631_ba89df0f9b_h.jpg',
			'hostImageAlt' => 'Cal Poly Humboldt campus buildings and trees across College Creek Field',
			'hostImageCaption' => 'College Creek Field · Cal Poly Humboldt',
			'hostPhotoSource' => 'https://www.flickr.com/photos/calpolyhumboldtgalleries/55506344631/',
			'eyebrow' => 'Public support, personal possibility',
			'heading' => "A national idea\nAt home in Humboldt",
			'historyText' => 'In 1980, the national SBDC network was established in law to connect small businesses with the expertise of government, universities and business.',
			'fundingText' => 'Support from the SBA, CalOSBA and local partners makes our no-fee advising possible today.',
			'missionText' => '',
			'hostLabel' => 'Our home base',
			'hostText' => 'Cal Poly Humboldt’s Sponsored Programs Foundation hosts the Northern California SBDC network, connecting a public university with the people building our local economy.',
		),
		'region' => array(
			'heading' => 'Rooted here',
		),
	);
	return $copy[ $section ] ?? array();
}
function mysbdc_about_block_content() {
	$blocks = array();
	foreach ( array( 'intro', 'possibility', 'advisors', 'purpose', 'region' ) as $section ) {
		$attrs = array_merge( mysbdc_about_attributes( $section ), mysbdc_about_study_copy( $section ) );
		foreach ( $attrs as $key => $value ) {
			if ( str_starts_with( $value, '@theme/' ) ) { $attrs[ $key ] = mysbdc_about_media( $value ); }
		}
		$blocks[] = array( 'blockName' => 'mysbdc/about-' . $section, 'attrs' => $attrs, 'innerBlocks' => array(), 'innerHTML' => '', 'innerContent' => array() );
	}
	return serialize_blocks( $blocks );
}
function mysbdc_register_about_blocks() {
	wp_register_style( 'mysbdc-about', mysbdc_asset( 'css/about.css' ), array( 'mysbdc-refined' ), mysbdc_file_version( 'assets/css/about.css' ) );
	$editor = array();
	foreach ( mysbdc_about_sections() as $section ) {
		$metadata = mysbdc_about_metadata( $section );
		// Resolve bundled media for the editor; saved content always retains its own URL.
		foreach ( $metadata['attributes'] as &$schema ) { $schema['default'] = mysbdc_about_media( $schema['default'] ); }
		unset( $schema );
		$editor[] = array( 'metadata' => $metadata, 'fields' => json_decode( file_get_contents( get_theme_file_path( 'blocks/about-' . $section . '/fields.json' ) ), true ) );
		register_block_type( get_theme_file_path( 'blocks/about-' . $section ), array(
			'attributes' => $metadata['attributes'],
			'render_callback' => static function ( $attributes ) use ( $section ) {
				ob_start();
				get_template_part( 'template-parts/about/' . $section, null, array( 'attributes' => $attributes ) );
				return ob_get_clean();
			},
		) );
	}
	wp_add_inline_script( 'mysbdc-home-blocks-editor', 'window.mysbdcHomeBlocks = (window.mysbdcHomeBlocks || []).concat(' . wp_json_encode( $editor, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ');', 'before' );
	register_block_pattern( 'mysbdc/about', array( 'title' => 'NorCal SBDC About page', 'categories' => array( 'mysbdc' ), 'description' => 'Five editable sections. Use with the About page template.', 'content' => mysbdc_about_block_content() ) );
}
add_action( 'init', 'mysbdc_register_about_blocks', 11 );

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'mysbdc about create', static function () {
		if ( 'demo.norcalsbdc.org' !== wp_parse_url( home_url(), PHP_URL_HOST ) ) { WP_CLI::error( 'This creation command is scoped to demo.norcalsbdc.org. Supply the explicit --url.' ); }
		$existing = get_page_by_path( 'about' );
		if ( $existing ) { WP_CLI::success( 'About already exists (' . $existing->ID . '); content and status preserved.' ); return; }
		$id = wp_insert_post( wp_slash( array( 'post_type' => 'page', 'post_status' => 'draft', 'post_title' => 'About', 'post_name' => 'about', 'post_content' => mysbdc_about_block_content(), 'meta_input' => array( '_wp_page_template' => 'page-templates/about.php' ), 'comment_status' => 'closed', 'ping_status' => 'closed' ) ), true );
		if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
		WP_CLI::success( 'Created editable About draft ' . $id . '. Review figures and publish when ready.' );
	} );
	WP_CLI::add_command( 'mysbdc about check', static function () {
		$blocks = array_values( array_filter( parse_blocks( mysbdc_about_block_content() ), static function ( $b ) { return null !== $b['blockName']; } ) );
		if ( 5 !== count( $blocks ) ) { WP_CLI::error( 'Expected five sections.' ); }
		foreach ( $blocks as $block ) {
			if ( ! WP_Block_Type_Registry::get_instance()->is_registered( $block['blockName'] ) || false === strpos( render_block( $block ), '<section' ) ) { WP_CLI::error( 'Registration or rendering failed: ' . $block['blockName'] ); }
			foreach ( $block['attrs'] as $key => $value ) {
				$edited = $block;
				$edited['attrs'][ $key ] = 'Edited value <script>alert(1)</script>';
				$roundtrip = parse_blocks( serialize_block( $edited ) )[0];
				if ( $roundtrip['attrs'][ $key ] !== $edited['attrs'][ $key ] || str_contains( render_block( $roundtrip ), '<script>' ) ) { WP_CLI::error( 'Persistence or escaping failed: ' . $key ); }
			}
		}
		$blocks[2]['attrs']['linkUrl'] = 'javascript:alert(1)';
		if ( str_contains( render_block( $blocks[2] ), 'javascript:' ) ) { WP_CLI::error( 'Unsafe URL escaped incorrectly.' ); }
		WP_CLI::success( 'Five About blocks registered and rendered; all fields survive serialization; unsafe markup and URLs escaped.' );
	} );
}
