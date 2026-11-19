<?php
/** Editable homepage section: Impact results. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_home_attributes( 'results', $args['attributes'] ?? array() );
?>
<section aria-labelledby="results-title" class="results-section"><div class="shell impact-results results-layout"><div class="results-narrative"><h2 id="results-title"><?php echo mysbdc_home_rich( $a['heading'] ); ?></h2><p><?php echo mysbdc_home_rich( $a['intro'] ); ?></p><p><?php echo mysbdc_home_rich( $a['context'] ); ?></p></div><div class="results-numbers"><p class="results-label"><?php echo esc_html( $a['label'] ); ?> <span><?php echo esc_html( $a['period'] ); ?></span></p><dl><div><dd><?php echo esc_html( $a['stat1Value'] ); ?></dd><dt><?php echo esc_html( $a['stat1Label'] ); ?></dt></div><div><dd><?php echo esc_html( $a['stat2Value'] ); ?></dd><dt><?php echo esc_html( $a['stat2Label'] ); ?></dt></div><div><dd><?php echo esc_html( $a['stat3Value'] ); ?></dd><dt><?php echo esc_html( $a['stat3Label'] ); ?></dt></div><div><dd><?php echo esc_html( $a['stat4Value'] ); ?></dd><dt><?php echo esc_html( $a['stat4Label'] ); ?></dt></div></dl></div></div></section>
