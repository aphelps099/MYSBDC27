<?php
/**
 * The document head, announcement bar and site header.
 *
 * Pass array( 'minimal' => true ) to get_header() for the quiet header used by
 * the Get started form: logo and a way back, no menu.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mysbdc_minimal = ! empty( $args['minimal'] );

// The homepage header sits on navy and takes the white logo. Every other page is light.
$mysbdc_dark_header = 'home' === mysbdc_view();
$mysbdc_logo        = $mysbdc_dark_header
	? array( 'img/logo-white.png', 262, 180 )
	: array( 'img/logo-color.png', 400, 275 );

$mysbdc_dashboard_label = mysbdc_dashboard_is_preview() ? __( 'MySBDC dashboard preview', 'mysbdc' ) : __( 'MySBDC, your client dashboard', 'mysbdc' );
$mysbdc_dashboard_title = mysbdc_dashboard_is_preview() ? __( 'Open the MySBDC dashboard preview', 'mysbdc' ) : __( 'Open MySBDC', 'mysbdc' );
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main"><?php echo esc_html( $mysbdc_minimal ? __( 'Skip to signup', 'mysbdc' ) : __( 'Skip to content', 'mysbdc' ) ); ?></a>
<?php
if ( ! $mysbdc_minimal ) {
	get_template_part( 'template-parts/announcement' );
}
?>
<header class="site-header<?php echo $mysbdc_minimal ? ' signup-header' : ''; ?>"><div class="shell header-inner">
  <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'NorCal SBDC home', 'mysbdc' ); ?>"><img src="<?php echo esc_url( mysbdc_asset( $mysbdc_logo[0] ) ); ?>" alt="<?php esc_attr_e( 'America’s SBDC, Northern California', 'mysbdc' ); ?>" width="<?php echo (int) $mysbdc_logo[1]; ?>" height="<?php echo (int) $mysbdc_logo[2]; ?>"></a>
<?php if ( $mysbdc_minimal ) : ?>
  <a class="text-link" href="<?php echo esc_url( mysbdc_home_anchor( 'programs' ) ); ?>"><?php esc_html_e( 'Back to homepage', 'mysbdc' ); ?></a>
<?php else : ?>
  <nav class="primary-nav" id="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'mysbdc' ); ?>">
    <?php mysbdc_menu_links( 'primary' ); ?>
    <a class="mobile-login" href="<?php echo esc_url( mysbdc_dashboard_url() ); ?>" aria-label="<?php echo esc_attr( $mysbdc_dashboard_label ); ?>" title="<?php echo esc_attr( $mysbdc_dashboard_title ); ?>">MySBDC</a>
    <a class="button mobile-start" href="<?php echo esc_url( mysbdc_signup_url() ); ?>"><?php esc_html_e( 'Get started', 'mysbdc' ); ?></a>
  </nav>
  <div class="header-actions">
    <a class="login" href="<?php echo esc_url( mysbdc_dashboard_url() ); ?>" aria-label="<?php echo esc_attr( $mysbdc_dashboard_label ); ?>" title="<?php echo esc_attr( $mysbdc_dashboard_title ); ?>">MySBDC</a>
    <a class="button button-small" href="<?php echo esc_url( mysbdc_signup_url() ); ?>"><?php esc_html_e( 'Get started', 'mysbdc' ); ?></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><?php esc_html_e( 'Menu', 'mysbdc' ); ?></button>
  </div>
<?php endif; ?>
</div></header>
