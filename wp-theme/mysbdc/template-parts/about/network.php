<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'network', $args['attributes'] ?? array() );
?>
<section class="about-section about-network">
<div class="shell"><div class="about-section-heading"><h2><?php echo esc_html( $a['heading'] ); ?></h2><p><?php echo esc_html( $a['description'] ); ?></p></div><div class="about-stats"><div><strong><?php echo esc_html( $a['stat1Value'] ); ?></strong><h3><?php echo esc_html( $a['stat1Label'] ); ?></h3><p><?php echo esc_html( $a['stat1Copy'] ); ?></p></div><div><strong><?php echo esc_html( $a['stat2Value'] ); ?></strong><h3><?php echo esc_html( $a['stat2Label'] ); ?></h3><p><?php echo esc_html( $a['stat2Copy'] ); ?></p></div><div><strong><?php echo esc_html( $a['stat3Value'] ); ?></strong><h3><?php echo esc_html( $a['stat3Label'] ); ?></h3><p><?php echo esc_html( $a['stat3Copy'] ); ?></p></div></div><div class="about-partner-note"><p><?php echo esc_html( $a['note'] ); ?></p><a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div><?php if ( $a['reportingNote'] ) : ?><p class="about-reporting-note"><?php echo esc_html( $a['reportingNote'] ); ?></p><?php endif; ?></div>
</section>
