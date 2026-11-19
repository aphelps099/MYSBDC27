<?php
/** The public investment behind a personal service. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'purpose', $args['attributes'] ?? array() );
?>
<section class="about-section about-purpose" id="about-purpose"><div class="shell">
  <div class="about-purpose-layout"><div class="about-purpose-heading"><p class="about-label"><?php echo esc_html( $a['eyebrow'] ); ?></p><h2><?php foreach ( explode( "\n", $a['heading'] ) as $line ) : ?><span class="about-heading-line" data-line-reveal><?php echo esc_html( $line ); ?></span><?php endforeach; ?></h2><a class="about-link" href="<?php echo esc_url( $a['historyUrl'] ); ?>"><span>The SBDC story</span></a></div>
    <div class="about-purpose-story"><p data-line-reveal><?php echo esc_html( $a['historyText'] ); ?></p><p data-line-reveal><?php echo esc_html( $a['fundingText'] ); ?></p><p data-line-reveal><?php echo esc_html( $a['missionText'] ); ?></p></div>
  </div>
  <div class="about-host"><a href="<?php echo esc_url( $a['hostUrl'] ); ?>"><img src="<?php echo esc_url( mysbdc_asset( 'img/partners/cal-poly-humboldt.png' ) ); ?>" alt="Cal Poly Humboldt" width="768" height="53" loading="lazy"></a><div><h3><?php echo esc_html( $a['hostLabel'] ); ?></h3><p data-line-reveal><?php echo esc_html( $a['hostText'] ); ?></p></div></div>
</div></section>
