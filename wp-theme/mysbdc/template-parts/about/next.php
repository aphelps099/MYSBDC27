<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'next', $args['attributes'] ?? array() );
?>
<section id="about-next" class="about-section about-next">
<div class="shell about-next-layout"><h2><?php if ( 'A dream with a plan is a business.' === $a['heading'] ) : ?><span>A dream with a plan</span><span>is a business.</span><?php else : ?><?php echo esc_html( $a['heading'] ); ?><?php endif; ?></h2><div class="about-next-action"><p><?php echo esc_html( $a['description'] ); ?></p><a class="about-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a><p class="about-next-note"><?php echo esc_html( $a['note'] ); ?></p></div></div>
</section>
