<?php
/**
 * MySBDC theme bootstrap.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MYSBDC_VERSION', '0.1.0' );

require get_theme_file_path( 'inc/settings.php' );
require get_theme_file_path( 'inc/urls.php' );
require get_theme_file_path( 'inc/setup.php' );
require get_theme_file_path( 'inc/assets.php' );
require get_theme_file_path( 'inc/nav.php' );
require get_theme_file_path( 'inc/customizer.php' );

require get_theme_file_path( 'inc/home-blocks.php' );
