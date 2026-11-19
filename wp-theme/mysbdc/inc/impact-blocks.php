<?php
/** Editable Impact sections. Deployment never changes saved page content. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function mysbdc_impact_sections() {
	return array( 'intro', 'feature', 'stories', 'results' );
}
function mysbdc_impact_metadata( $section ) {
	if ( ! in_array( $section, mysbdc_impact_sections(), true ) ) { return array(); }
	return json_decode( file_get_contents( get_theme_file_path( 'blocks/impact-' . $section . '/block.json' ) ), true );
}
function mysbdc_impact_attributes( $section, $supplied = array() ) {
	$values = array();
	foreach ( mysbdc_impact_metadata( $section )['attributes'] as $name => $schema ) {
		$values[ $name ] = isset( $supplied[ $name ] ) && is_string( $supplied[ $name ] ) ? $supplied[ $name ] : $schema['default'];
	}
	return $values;
}
function mysbdc_has_impact_blocks() {
	foreach ( mysbdc_impact_sections() as $section ) {
		if ( has_block( 'mysbdc/impact-' . $section ) ) { return true; }
	}
	return false;
}
/** Snapshot initial attributes; this pattern is only inserted by an editor. */
function mysbdc_impact_block_content() {
	$blocks = array();
	foreach ( mysbdc_impact_sections() as $section ) {
		$blocks[] = array( 'blockName' => 'mysbdc/impact-' . $section, 'attrs' => mysbdc_impact_attributes( $section ), 'innerBlocks' => array(), 'innerHTML' => '', 'innerContent' => array() );
	}
	return serialize_blocks( $blocks );
}
function mysbdc_register_impact_blocks() {
	wp_register_style( 'mysbdc-impact-study', mysbdc_asset( 'css/impact-study.css' ), array( 'mysbdc-home-design' ), mysbdc_file_version( 'assets/css/impact-study.css' ) );
	$editor = array();
	foreach ( mysbdc_impact_sections() as $section ) {
		$metadata = mysbdc_impact_metadata( $section );
		$editor[] = array( 'metadata' => $metadata, 'fields' => json_decode( file_get_contents( get_theme_file_path( 'blocks/impact-' . $section . '/fields.json' ) ), true ) );
		register_block_type( get_theme_file_path( 'blocks/impact-' . $section ), array(
			'render_callback' => static function ( $attributes ) use ( $section ) {
				ob_start();
				get_template_part( 'template-parts/impact/' . $section, null, array( 'attributes' => $attributes ) );
				return ob_get_clean();
			},
		) );
	}
	wp_add_inline_script( 'mysbdc-home-blocks-editor', 'window.mysbdcHomeBlocks = (window.mysbdcHomeBlocks || []).concat(' . wp_json_encode( $editor, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ');', 'before' );
	register_block_pattern( 'mysbdc/impact', array( 'title' => 'NorCal SBDC Impact page', 'categories' => array( 'mysbdc' ), 'description' => 'Four editable sections. Use with the Impact page template.', 'content' => mysbdc_impact_block_content() ) );
}
add_action( 'init', 'mysbdc_register_impact_blocks', 12 );
