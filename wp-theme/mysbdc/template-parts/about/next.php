<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'next', $args['attributes'] ?? array() );
?>
<section class="about-section about-next">
<div class="shell"><h2><?php echo esc_html( $a['heading'] ); ?></h2><p><?php echo esc_html( $a['description'] ); ?></p><a class="about-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a><p class="about-next-note"><?php echo esc_html( $a['note'] ); ?></p></div>
</section>
