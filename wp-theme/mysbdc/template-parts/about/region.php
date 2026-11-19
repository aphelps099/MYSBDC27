<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'region', $args['attributes'] ?? array() );
?>
<section class="about-section about-region">
<div class="shell"><div class="about-section-heading"><h2><?php echo esc_html( $a['heading'] ); ?></h2><div><p><?php echo esc_html( $a['description'] ); ?></p><a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div></div><div class="about-stats"><div><strong><?php echo esc_html( $a['stat1Value'] ); ?></strong><h3><?php echo esc_html( $a['stat1Label'] ); ?></h3><p><?php echo esc_html( $a['stat1Copy'] ); ?></p></div><div><strong><?php echo esc_html( $a['stat2Value'] ); ?></strong><h3><?php echo esc_html( $a['stat2Label'] ); ?></h3><p><?php echo esc_html( $a['stat2Copy'] ); ?></p></div><div><strong><?php echo esc_html( $a['stat3Value'] ); ?></strong><h3><?php echo esc_html( $a['stat3Label'] ); ?></h3><p><?php echo esc_html( $a['stat3Copy'] ); ?></p></div></div></div><div class="about-region-photos"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo1Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo1Alt'] ); ?>" width="800" height="640" loading="lazy"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo2Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo2Alt'] ); ?>" width="800" height="640" loading="lazy"></div>
</section>
