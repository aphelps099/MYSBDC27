<?php
/**
 * The announcement bar above the header.
 *
 * app.js remembers a dismissal for the browser tab under the data-announcement
 * key. The key is made from the message, so a new message shows again.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mysbdc_text = trim( (string) mysbdc_setting( 'announcement_text' ) );
if ( ! mysbdc_setting( 'announcement_show' ) || '' === $mysbdc_text ) {
	return;
}

$mysbdc_label    = trim( (string) mysbdc_setting( 'announcement_link_label' ) );
$mysbdc_url      = trim( (string) mysbdc_setting( 'announcement_link_url' ) );
$mysbdc_key      = substr( md5( $mysbdc_text . '|' . $mysbdc_url ), 0, 8 );
$mysbdc_external = '' !== $mysbdc_url && wp_parse_url( $mysbdc_url, PHP_URL_HOST ) !== wp_parse_url( home_url(), PHP_URL_HOST );
?>
<aside class="announcement" aria-label="<?php esc_attr_e( 'Announcement', 'mysbdc' ); ?>" data-announcement="<?php echo esc_attr( $mysbdc_key ); ?>">
  <div class="shell announcement-inner">
    <p class="announcement-copy"><span><?php echo esc_html( $mysbdc_text ); ?></span><?php if ( '' !== $mysbdc_label && '' !== $mysbdc_url ) : ?><a class="announcement-link" href="<?php echo esc_url( $mysbdc_url ); ?>"><?php echo esc_html( $mysbdc_label ); ?><?php if ( $mysbdc_external ) : ?> <span aria-hidden="true">↗</span><?php endif; ?></a><?php endif; ?></p>
    <button class="announcement-close" type="button" aria-label="<?php esc_attr_e( 'Dismiss announcement', 'mysbdc' ); ?>" hidden><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="m5 5 10 10M15 5 5 15"/></svg></button>
  </div>
</aside>
