<?php
/** Editable Impact section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_impact_attributes( 'results', $args['attributes'] ?? array() );
?>
<section aria-labelledby="results-heading" class="is-results"><div class="is-shell"><div class="is-section-heading"><h2 id="results-heading"><?php echo esc_html( $a['heading'] ); ?><span><?php echo esc_html( $a['period'] ); ?></span></h2></div><dl class="is-results-grid"><div><dd><?php echo esc_html( $a['result1Value'] ); ?></dd><dt><?php echo esc_html( $a['result1Label'] ); ?></dt></div><div><dd><?php echo esc_html( $a['result2Value'] ); ?></dd><dt><?php echo esc_html( $a['result2Label'] ); ?></dt></div><div><dd><?php echo esc_html( $a['result3Value'] ); ?></dd><dt><?php echo esc_html( $a['result3Label'] ); ?></dt></div></dl><p class="is-results-note"><?php echo esc_html( $a['description'] ); ?></p></div></section>
