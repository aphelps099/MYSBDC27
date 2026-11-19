<?php
/** A public program with a real university home. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'purpose', $args['attributes'] ?? array() );
?>
<section class="about-section about-purpose" id="about-purpose"><div class="shell about-campus-layout">
  <figure class="about-campus-photo"><a href="<?php echo esc_url( $a['hostUrl'] ); ?>"><img src="<?php echo esc_url( $a['hostImage'] ); ?>" alt="<?php echo esc_attr( $a['hostImageAlt'] ); ?>" width="900" height="1100" loading="lazy" decoding="async"></a><figcaption><?php echo esc_html( $a['hostImageCaption'] ); ?><a href="<?php echo esc_url( $a['hostPhotoSource'] ); ?>">Photo: Cal Poly Humboldt</a></figcaption></figure>
  <div class="about-campus-story"><p class="about-label"><?php echo esc_html( $a['eyebrow'] ); ?></p><h2><?php foreach ( explode( "\n", $a['heading'] ) as $line ) : ?><span class="about-heading-line" data-line-reveal><?php echo esc_html( $line ); ?></span><?php endforeach; ?></h2>
  <div class="about-purpose-story">
    <?php foreach ( array( 'historyText', 'fundingText', 'missionText' ) as $key ) : if ( '' !== trim( $a[$key] ) ) : ?><p data-line-reveal><?php echo esc_html( $a[$key] ); ?></p><?php endif; endforeach; ?>
    <h3><?php echo esc_html( $a['hostLabel'] ); ?></h3><p data-line-reveal><?php echo esc_html( $a['hostText'] ); ?></p><a class="about-link" href="<?php echo esc_url( $a['historyUrl'] ); ?>"><span>The SBDC story</span></a>
  </div></div>
</div></section>
