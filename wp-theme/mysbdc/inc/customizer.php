<?php
/**
 * Appearance > Customize > MySBDC site.
 *
 * The announcement bar, the links the header and footer share, contact
 * details and social profiles. Menus are edited under Appearance > Menus.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Sanitize a checkbox. */
function mysbdc_sanitize_checkbox( $value ) {
	return (bool) $value;
}

/** Keep only the digits of a phone number, for the tel: link. */
function mysbdc_sanitize_phone_number( $value ) {
	return preg_replace( '/[^0-9+]/', '', (string) $value );
}

/**
 * Register the settings and their controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer.
 */
function mysbdc_customize_register( $wp_customize ) {
	$wp_customize->add_panel(
		'mysbdc',
		array(
			'title'    => __( 'MySBDC site', 'mysbdc' ),
			'priority' => 30,
		)
	);

	$sections = array(
		'mysbdc_announcement' => array(
			'title'       => __( 'Announcement bar', 'mysbdc' ),
			'description' => __( 'The slim cream bar above the header. Visitors who close it see it again when the message changes.', 'mysbdc' ),
			'fields'      => array(
				'announcement_show'       => array( __( 'Show the announcement', 'mysbdc' ), 'checkbox' ),
				'announcement_text'       => array( __( 'Message', 'mysbdc' ), 'text' ),
				'announcement_link_label' => array( __( 'Link text', 'mysbdc' ), 'text' ),
				'announcement_link_url'   => array( __( 'Link address', 'mysbdc' ), 'url' ),
			),
		),
		'mysbdc_links'        => array(
			'title'  => __( 'MySBDC and Get started links', 'mysbdc' ),
			'fields' => array(
				'dashboard_url' => array( __( 'MySBDC dashboard address', 'mysbdc' ), 'url', __( 'Where the “MySBDC” link in the header and footer goes.', 'mysbdc' ) ),
				'signup_url'    => array( __( 'Get started link (optional)', 'mysbdc' ), 'url', __( 'Leave empty to use the page with the “Get started” template. Enter an address to send every “Get started” button there instead.', 'mysbdc' ) ),
			),
		),
		'mysbdc_contact'      => array(
			'title'  => __( 'Contact details', 'mysbdc' ),
			'fields' => array(
				'contact_email'        => array( __( 'Email address', 'mysbdc' ), 'email' ),
				'contact_phone_label'  => array( __( 'Phone number, as shown', 'mysbdc' ), 'text' ),
				'contact_phone_number' => array( __( 'Phone number, digits only', 'mysbdc' ), 'tel', __( 'Used when someone taps the number on a phone.', 'mysbdc' ) ),
				'contact_hours'        => array( __( 'Hours', 'mysbdc' ), 'text' ),
			),
		),
		'mysbdc_social'       => array(
			'title'       => __( 'Social profiles', 'mysbdc' ),
			'description' => __( 'A mark appears in the footer for each profile with an address.', 'mysbdc' ),
			'fields'      => array(
				'social_linkedin'  => array( __( 'LinkedIn', 'mysbdc' ), 'url' ),
				'social_instagram' => array( __( 'Instagram', 'mysbdc' ), 'url' ),
				'social_facebook'  => array( __( 'Facebook', 'mysbdc' ), 'url' ),
			),
		),
	);

	$sanitizers = array(
		'checkbox' => 'mysbdc_sanitize_checkbox',
		'text'     => 'sanitize_text_field',
		'url'      => 'esc_url_raw',
		'email'    => 'sanitize_email',
		'tel'      => 'mysbdc_sanitize_phone_number',
	);
	$defaults   = mysbdc_setting_defaults();

	foreach ( $sections as $section_id => $section ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'       => $section['title'],
				'description' => $section['description'] ?? '',
				'panel'       => 'mysbdc',
			)
		);

		foreach ( $section['fields'] as $key => $field ) {
			list( $label, $type ) = $field;

			$wp_customize->add_setting(
				'mysbdc_' . $key,
				array(
					'default'           => $defaults[ $key ],
					'sanitize_callback' => $sanitizers[ $type ],
				)
			);
			$wp_customize->add_control(
				'mysbdc_' . $key,
				array(
					'label'       => $label,
					'description' => $field[2] ?? '',
					'section'     => $section_id,
					'type'        => $type,
				)
			);
		}
	}
}
add_action( 'customize_register', 'mysbdc_customize_register' );
