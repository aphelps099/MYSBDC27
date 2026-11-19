<?php
/** Editable homepage section: Network impact statement. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_home_attributes( 'impact-statement', $args['attributes'] ?? array() );
?>
<section aria-labelledby="impact-statement-title" class="impact-feature impact-statement" id="impact"><div class="shell"><div class="impact-statement-copy"><h2 id="impact-statement-title"><?php echo mysbdc_home_rich( $a['heading'] ); ?></h2><p><?php echo mysbdc_home_rich( $a['description'] ); ?></p><a class="concept-button impact-statement-button" href="<?php echo esc_url( $a['buttonUrl'] ); ?>"><?php echo esc_html( $a['buttonText'] ); ?></a></div></div></section>
