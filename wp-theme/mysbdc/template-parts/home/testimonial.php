<?php
/** Editable homepage section: Client testimonial. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_home_attributes( 'testimonial', $args['attributes'] ?? array() );
?>
<section aria-label="Client testimonial" class="client-testimonial" id="laila-story"><div class="shell testimonial-layout"><div class="testimonial-copy"><span aria-hidden="true" class="testimonial-quote-mark">“</span><blockquote cite="<?php echo esc_url( $a['storyUrl'] ); ?>"><p><?php echo mysbdc_home_rich( $a['quote'] ); ?></p></blockquote><p class="testimonial-attribution"><strong><?php echo esc_html( $a['clientName'] ); ?></strong><span><?php echo esc_html( $a['attribution'] ); ?></span></p><a class="testimonial-link" href="<?php echo esc_url( $a['storyUrl'] ); ?>" rel="noopener" target="_blank"><span class="link-label"><?php echo esc_html( $a['linkText'] ); ?></span></a></div><figure class="testimonial-portrait"><img alt="<?php echo esc_attr( $a['imageAlt'] ); ?>" height="1181" loading="lazy" src="<?php echo esc_url( $a['imageUrl'] ); ?>" width="1200"/></figure></div></section>
