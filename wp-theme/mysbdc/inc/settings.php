<?php
/**
 * Site settings: one list of defaults, read through mysbdc_setting().
 *
 * Every value here can be changed in Appearance > Customize > MySBDC site.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Adobe Fonts kit: Proxima Nova and Proxima Sera. */
const MYSBDC_FONT_KIT_URL = 'https://use.typekit.net/pkl5rjs.css';

/** The dashboard preview the design currently links to. Replace it in the Customizer at launch. */
const MYSBDC_DASHBOARD_PREVIEW_URL = 'https://mysbdc-calm-dashboard.aaron150395.chatgpt.site';

/**
 * Default values for every setting.
 *
 * @return array<string, string|bool>
 */
function mysbdc_setting_defaults() {
	return array(
		'announcement_show'       => true,
		'announcement_text'       => 'Practical workshops. Fresh ideas.',
		'announcement_link_label' => 'Explore training',
		'announcement_link_url'   => 'https://www.norcalsbdc.org/events/',
		'dashboard_url'           => MYSBDC_DASHBOARD_PREVIEW_URL,
		'signup_url'              => '',
		'contact_email'           => 'info@norcalsbdc.org',
		'contact_phone_label'     => '(833) ASK-SBDC',
		'contact_phone_number'    => '18332757232',
		'contact_hours'           => 'Mon – Fri, 9 AM – 5 PM',
		'social_linkedin'         => 'https://www.linkedin.com/company/norcalsbdc',
		'social_instagram'        => '',
		'social_facebook'         => '',
	);
}

/**
 * Read one setting, falling back to its default.
 *
 * @param string $key Setting name without the "mysbdc_" prefix.
 * @return string|bool
 */
function mysbdc_setting( $key ) {
	$defaults = mysbdc_setting_defaults();
	$default  = $defaults[ $key ] ?? '';

	return get_theme_mod( 'mysbdc_' . $key, $default );
}
