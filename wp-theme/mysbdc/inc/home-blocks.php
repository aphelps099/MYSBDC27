<?php
/** Gutenberg sections for the approved homepage. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function mysbdc_home_sections() {
	return array( 'hero', 'help', 'testimonial', 'impact-statement', 'results', 'stories', 'newsletter' );
}

function mysbdc_home_metadata( $section ) {
	static $metadata = array();
	if ( ! in_array( $section, mysbdc_home_sections(), true ) ) { return array(); }
	if ( ! isset( $metadata[ $section ] ) ) {
		$metadata[ $section ] = json_decode( file_get_contents( get_theme_file_path( 'blocks/' . $section . '/block.json' ) ), true );
	}
	return $metadata[ $section ];
}

/** Only declared string attributes reach the templates; output is escaped by context. */
function mysbdc_home_attributes( $section, $supplied = array() ) {
	$values = array();
	foreach ( mysbdc_home_metadata( $section )['attributes'] as $name => $schema ) {
		$values[ $name ] = isset( $supplied[ $name ] ) && is_string( $supplied[ $name ] ) ? $supplied[ $name ] : $schema['default'];
	}
	return $values;
}

function mysbdc_home_rich( $text ) {
	return wp_kses( $text, array( 'br' => array(), 'strong' => array(), 'em' => array() ) );
}

function mysbdc_render_home_block( $section, $attributes ) {
	ob_start();
	get_template_part( 'template-parts/home/' . $section, null, array( 'attributes' => $attributes ) );
	return ob_get_clean();
}

function mysbdc_register_home_blocks() {
	wp_register_script( 'mysbdc-home-blocks-editor', mysbdc_asset( 'js/home-blocks-editor.js' ), array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components' ), mysbdc_file_version( 'assets/js/home-blocks-editor.js' ), true );
	wp_register_style( 'mysbdc-home-blocks-editor', mysbdc_asset( 'css/home-blocks-editor.css' ), array(), mysbdc_file_version( 'assets/css/home-blocks-editor.css' ) );
	$editor = array();
	foreach ( mysbdc_home_sections() as $section ) {
		$metadata = mysbdc_home_metadata( $section );
		$fields = json_decode( file_get_contents( get_theme_file_path( 'blocks/' . $section . '/fields.json' ) ), true );
		$editor[] = array( 'metadata' => $metadata, 'fields' => $fields );
		register_block_type( get_theme_file_path( 'blocks/' . $section ), array(
			'render_callback' => static function ( $attributes ) use ( $section ) {
				return mysbdc_render_home_block( $section, $attributes );
			},
		) );
	}
	wp_add_inline_script( 'mysbdc-home-blocks-editor', 'window.mysbdcHomeBlocks = ' . wp_json_encode( $editor, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ';', 'before' );
	register_block_pattern( 'mysbdc/homepage', array(
		'title' => 'NorCal SBDC homepage',
		'description' => 'The seven approved, editable homepage sections.',
		'categories' => array( 'mysbdc' ),
		'content' => mysbdc_home_block_content(),
	) );
}
add_action( 'init', 'mysbdc_register_home_blocks' );

add_filter( 'block_categories_all', static function ( $categories ) {
	array_unshift( $categories, array( 'slug' => 'mysbdc', 'title' => 'NorCal SBDC sections' ) );
	return $categories;
} );

/** Snapshot every initial value into the page so future defaults cannot overwrite edits. */
function mysbdc_home_block_content() {
	$blocks = array();
	foreach ( mysbdc_home_sections() as $section ) {
		$attributes = mysbdc_home_attributes( $section );
		foreach ( $attributes as $key => $value ) {
			if ( 'https://demo.norcalsbdc.org/get-started/' === $value ) { $attributes[ $key ] = mysbdc_signup_url(); }
			if ( 'https://demo.norcalsbdc.org/get-started/?program=capital' === $value ) { $attributes[ $key ] = mysbdc_signup_url( 'capital' ); }
			if ( 'https://demo.norcalsbdc.org/impact/' === $value ) { $attributes[ $key ] = mysbdc_page_url( 'impact' ); }
		}
		$blocks[] = array( 'blockName' => 'mysbdc/' . $section, 'attrs' => $attributes, 'innerBlocks' => array(), 'innerHTML' => '', 'innerContent' => array() );
	}
	return serialize_blocks( $blocks );
}

/** Explicit one-time migration; never modifies content during normal web requests. */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'mysbdc homepage check', static function () {
		$content = mysbdc_home_block_content();
		$blocks = array_values( array_filter( parse_blocks( $content ), static function ( $block ) { return null !== $block['blockName']; } ) );
		if ( 7 !== count( $blocks ) ) { WP_CLI::error( 'Expected seven editable sections.' ); }
		foreach ( $blocks as $block ) {
			if ( ! WP_Block_Type_Registry::get_instance()->is_registered( $block['blockName'] ) ) { WP_CLI::error( 'Unregistered block: ' . $block['blockName'] ); }
			$html = render_block( $block );
			if ( false === strpos( $html, '<section' ) || false !== strpos( $html, 'MYSBDC_FIELD_' ) ) { WP_CLI::error( 'Invalid render: ' . $block['blockName'] ); }
		}
		$edited = $blocks[0];
		$edited['attrs']['headline'] = 'Editable headline<br>Second line';
		$edited['attrs']['buttonUrl'] = 'javascript:alert(1)';
		$edited['attrs']['description'] = '<script>alert(1)</script>Safe copy';
		$roundtrip = parse_blocks( serialize_block( $edited ) )[0];
		$html = render_block( $roundtrip );
		if ( false === strpos( $html, 'Editable headline<br>Second line' ) || false !== strpos( $html, '<script>' ) || false !== strpos( $html, 'javascript:' ) ) { WP_CLI::error( 'Editing or escaping check failed.' ); }
		WP_CLI::success( 'Seven blocks registered and rendered; edited attributes survive serialization; unsafe markup and URLs are escaped.' );
	} );
	WP_CLI::add_command( 'mysbdc homepage migrate', static function () {
		$id = (int) get_option( 'mysbdc_editable_home_id' );
		if ( $id && get_post( $id ) ) {
			WP_CLI::success( 'Editable homepage already exists: ' . $id . '. Existing edits were preserved.' );
			return;
		}
		$content = mysbdc_home_block_content();
		if ( 7 !== substr_count( $content, '<!-- wp:mysbdc/' ) ) { WP_CLI::error( 'Homepage seed is incomplete.' ); }
		$backup = array( 'show_on_front' => get_option( 'show_on_front' ), 'page_on_front' => get_option( 'page_on_front' ), 'created_at' => gmdate( 'c' ) );
		$id = wp_insert_post( wp_slash( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Home', 'post_name' => 'home', 'post_content' => $content, 'comment_status' => 'closed', 'ping_status' => 'closed' ) ), true );
		if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
		update_option( 'mysbdc_home_migration_backup', $backup, false );
		update_option( 'mysbdc_editable_home_id', $id, false );
		update_option( 'page_on_front', $id );
		update_option( 'show_on_front', 'page' );
		clean_post_cache( $id );
		WP_CLI::success( 'Created editable Home page ' . $id . ' and set it as the front page.' );
		WP_CLI::log( admin_url( 'post.php?post=' . $id . '&action=edit' ) );
	} );
}
