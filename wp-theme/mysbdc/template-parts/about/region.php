<?php
/** Regional About feature. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'region', $args['attributes'] ?? array() );
?>
<section class="about-section about-region about-region-feature" id="about-region">
  <img class="about-region-image" src="<?php echo esc_url( mysbdc_about_media( $a['photo2Image'] ) ); ?>" alt="<?php echo esc_attr( $a['photo2Alt'] ); ?>" width="1600" height="1000" loading="lazy">
  <div class="shell about-region-content">
    <h2><?php echo esc_html( $a['heading'] ); ?></h2>
    <div class="about-region-caption">
      <p><?php echo esc_html( $a['description'] ); ?></p>
      <a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a>
    </div>
  </div>
</section>
