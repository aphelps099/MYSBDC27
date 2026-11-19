<?php
/** Editable Impact section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_impact_attributes( 'feature', $args['attributes'] ?? array() );
?>
<section aria-labelledby="feature-title" class="is-feature"><div class="is-shell is-feature-layout">
<a aria-label="<?php echo esc_attr( $a['photoLinkLabel'] ); ?>" class="is-feature-photo" href="<?php echo esc_url( $a['storyUrl'] ); ?>"><img alt="<?php echo esc_attr( $a['imageAlt'] ); ?>" decoding="async" fetchpriority="high" height="1200" src="<?php echo esc_url( $a['imageUrl'] ); ?>" width="1198"/><span class="is-category"><?php echo esc_html( $a['category'] ); ?></span></a>
<div class="is-feature-copy"><p class="is-business"><?php echo esc_html( $a['business'] ); ?></p><h2 id="feature-title"><?php echo mysbdc_home_rich( $a['heading'] ); ?></h2><p data-line-reveal=""><?php echo esc_html( $a['description'] ); ?></p><a class="is-link" href="<?php echo esc_url( $a['storyUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div>
</div></section>
