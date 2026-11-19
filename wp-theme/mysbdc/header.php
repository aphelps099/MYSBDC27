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

// Full navigation uses the approved navy header and white logo.
$mysbdc_dark_header = ! $mysbdc_minimal;
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
if ( ! $mysbdc_minimal && ! is_front_page() ) {
	get_template_part( 'template-parts/announcement' );
}
?>
<header class="site-header<?php echo $mysbdc_minimal ? ' signup-header' : ''; ?>"><div class="shell header-inner">
  <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'NorCal SBDC home', 'mysbdc' ); ?>"><img src="<?php echo esc_url( mysbdc_asset( $mysbdc_logo[0] ) ); ?>" alt="<?php esc_attr_e( 'America’s SBDC, Northern California', 'mysbdc' ); ?>" width="<?php echo (int) $mysbdc_logo[1]; ?>" height="<?php echo (int) $mysbdc_logo[2]; ?>"><?php if ( is_front_page() ) : ?><span class="scroll-brand" aria-hidden="true">Norcal SBDC</span><?php endif; ?></a>
<?php if ( $mysbdc_minimal ) : ?>
  <a class="text-link" href="<?php echo esc_url( mysbdc_home_anchor( 'programs' ) ); ?>"><?php esc_html_e( 'Back to homepage', 'mysbdc' ); ?></a>
<?php else : ?>
  <nav class="primary-nav" id="primary-nav" aria-label="Primary"><?php if ( has_nav_menu( 'primary' ) ) { mysbdc_menu_links( 'primary' ); } else { ?><details class="header-dropdown"><summary>Services</summary><div class="header-dropdown-links"><a href="https://www.norcalsbdc.org/events/">Training</a><a href="<?php echo esc_url( home_url( '/' ) ); ?>#advising">Advising</a><a href="<?php echo esc_url( home_url( '/' ) ); ?>#funding">Capital</a></div></details><details class="header-dropdown"><summary>Programs</summary><div class="header-dropdown-links"><a href="<?php echo esc_url( mysbdc_signup_url( 'tfg' ) ); ?>">Tech</a><span aria-disabled="true">Health <small>Coming soon</small></span><a href="<?php echo esc_url( mysbdc_signup_url( 'probiz' ) ); ?>">Contracting</a><a href="<?php echo esc_url( mysbdc_signup_url( 'ai' ) ); ?>">AI</a></div></details><a href="<?php echo esc_url( mysbdc_page_url( 'impact' ) ); ?>">Impact</a><a href="<?php echo esc_url( mysbdc_page_url( 'about' ) ); ?>">About</a><?php } ?></nav><div class="header-actions"><details class="header-dropdown"><summary><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>MySBDC</summary><div class="header-dropdown-links"><a href="<?php echo esc_url( mysbdc_dashboard_url() ); ?>">Sign in</a><a href="<?php echo esc_url( mysbdc_signup_url() ); ?>">Create an account</a></div></details><details class="header-dropdown"><summary><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>English</summary><div class="header-dropdown-links"><span aria-current="true">English</span><span aria-disabled="true">More languages coming soon</span></div></details><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button></div>
<?php endif; ?>
</div></header>
