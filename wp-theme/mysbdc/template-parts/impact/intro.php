<?php
/** Editable Impact section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_impact_attributes( 'intro', $args['attributes'] ?? array() );
?>
<section aria-labelledby="impact-title" class="is-intro"><div class="is-shell">
<p class="is-label"><?php echo esc_html( $a['eyebrow'] ); ?></p><div class="is-intro-layout"><h1 id="impact-title"><?php echo mysbdc_home_rich( $a['heading'] ); ?></h1><div><p><?php echo mysbdc_home_rich( $a['description'] ); ?></p><a class="is-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div></div>
</div></section>
