<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'story', $args['attributes'] ?? array() );
?>
<section class="about-section about-story">
<div class="shell about-story-layout"><figure><img src="<?php echo esc_url( mysbdc_about_media( $a['imageUrl'] ) ); ?>" alt="<?php echo esc_html( $a['imageAlt'] ); ?>" width="800" height="640" loading="lazy"></figure><div><p class="about-label"><?php echo esc_html( $a['eyebrow'] ); ?></p><blockquote><p>“<?php echo esc_html( $a['quote'] ); ?>”</p></blockquote><p class="about-attribution"><strong><?php echo esc_html( $a['clientName'] ); ?></strong><span><?php echo esc_html( $a['attribution'] ); ?></span></p><a class="about-link" href="<?php echo esc_url( $a['storyUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div></div>
</section>
