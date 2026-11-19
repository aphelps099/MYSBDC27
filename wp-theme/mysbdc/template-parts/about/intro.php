<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'intro', $args['attributes'] ?? array() );
?>
<section class="about-section about-intro">
<div class="shell about-intro-copy"><p class="about-label"><?php echo esc_html( $a['eyebrow'] ); ?></p><h1><?php echo esc_html( $a['heading'] ); ?></h1><p><?php echo esc_html( $a['description'] ); ?></p></div><div class="about-photo-strip"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo1Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo1Alt'] ); ?>" width="800" height="640" loading="eager"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo2Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo2Alt'] ); ?>" width="800" height="640" loading="eager"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo3Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo3Alt'] ); ?>" width="800" height="640" loading="eager"><img src="<?php echo esc_url( mysbdc_about_media( $a['photo4Image'] ) ); ?>" alt="<?php echo esc_html( $a['photo4Alt'] ); ?>" width="800" height="640" loading="eager"></div>
</section>
