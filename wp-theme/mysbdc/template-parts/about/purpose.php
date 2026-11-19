<?php
/** Public partnership story. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'purpose', $args['attributes'] ?? array() );
?>
<section class="about-section about-purpose" id="about-purpose"><div class="shell">
  <p class="about-label"><?php echo esc_html( $a['eyebrow'] ); ?></p>
  <div class="about-purpose-layout"><div><h2 data-line-reveal><?php echo esc_html( $a['heading'] ); ?></h2><a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><?php echo esc_html( $a['linkText'] ); ?></a></div>
    <div class="about-purpose-story">
      <p data-line-reveal><?php echo esc_html( $a['historyText'] ); ?></p>
      <p data-line-reveal><?php echo esc_html( $a['missionText'] ); ?></p>
      <p data-line-reveal><?php echo esc_html( $a['fundingText'] ); ?></p>
      <a class="about-history-source" href="<?php echo esc_url( $a['historyUrl'] ); ?>">The history of America’s SBDC</a>
    </div>
  </div>
  <div class="about-host"><a href="<?php echo esc_url( $a['hostUrl'] ); ?>"><img src="<?php echo esc_url( mysbdc_asset( 'img/partners/cal-poly-humboldt.png' ) ); ?>" alt="Cal Poly Humboldt" width="768" height="53" loading="lazy"></a><div><h3><?php echo esc_html( $a['hostLabel'] ); ?></h3><p data-line-reveal><?php echo esc_html( $a['hostText'] ); ?></p></div></div>
</div></section>
