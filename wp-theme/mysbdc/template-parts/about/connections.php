<?php
/** Approved About composition: saved content remains authoritative. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'connections', $args['attributes'] ?? array() );
?>
<section aria-labelledby="network-title" class="bs-network">
<div class="bs-shell">
<div class="bs-network-heading"><h2 id="network-title"><?php echo esc_html( $a['headingLine1'] ); ?><br/><?php echo esc_html( $a['headingLine2'] ); ?></h2><p data-line-reveal=""><?php echo esc_html( $a['description'] ); ?></p></div>
<div class="bs-network-details">
<div class="bs-reach"><strong><?php echo esc_html( $a['reachNumber'] ); ?></strong><p><?php echo esc_html( $a['reachLabel'] ); ?><br/><?php echo esc_html( $a['reachContext'] ); ?></p></div>
<div class="bs-network-context"><p data-line-reveal=""><?php echo esc_html( $a['fundingText'] ); ?></p><a class="bs-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div>
</div>
<div aria-label="Client stories" class="bs-carousel" id="client-stories" role="region">
<div class="bs-carousel-track">
<div class="bs-client-story" data-story-name="<?php echo esc_attr( $a['story1Name'] . ', ' . $a['story1Business'] ); ?>" id="client-story-1">
<figure class="bs-client-photo"><img alt="<?php echo esc_attr( $a['story1Alt'] ); ?>" decoding="async" height="1181" loading="lazy" src="<?php echo esc_url( $a['story1Image'] ); ?>" width="1200"/></figure>
<div class="bs-client-words"><span aria-hidden="true" class="bs-quote-mark">“</span><blockquote cite="<?php echo esc_url( $a['story1Url'] ); ?>"><p><?php echo esc_html( $a['story1Quote'] ); ?></p></blockquote><p class="bs-attribution"><strong><?php echo esc_html( $a['story1Name'] ); ?></strong><span><?php echo esc_html( $a['story1Business'] ); ?></span></p><a class="bs-link" href="<?php echo esc_url( $a['story1Url'] ); ?>"><span><?php echo esc_html( $a['story1LinkText'] ); ?></span></a></div>
</div>
<div class="bs-client-story" data-story-name="<?php echo esc_attr( $a['story2Name'] . ', ' . $a['story2Business'] ); ?>" id="client-story-2">
<figure class="bs-client-photo bs-photo-hella"><img alt="<?php echo esc_attr( $a['story2Alt'] ); ?>" decoding="async" height="2208" loading="lazy" src="<?php echo esc_url( $a['story2Image'] ); ?>" width="1242"/></figure>
<div class="bs-client-words"><span aria-hidden="true" class="bs-quote-mark">“</span><blockquote cite="<?php echo esc_url( $a['story2Url'] ); ?>"><p><?php echo esc_html( $a['story2Quote'] ); ?></p></blockquote><p class="bs-attribution"><strong><?php echo esc_html( $a['story2Name'] ); ?></strong><span><?php echo esc_html( $a['story2Business'] ); ?></span></p><a class="bs-link" href="<?php echo esc_url( $a['story2Url'] ); ?>"><span><?php echo esc_html( $a['story2LinkText'] ); ?></span></a></div>
</div>
<div class="bs-client-story" data-story-name="<?php echo esc_attr( $a['story3Name'] . ', ' . $a['story3Business'] ); ?>" id="client-story-3">
<figure class="bs-client-photo"><img alt="<?php echo esc_attr( $a['story3Alt'] ); ?>" decoding="async" height="900" loading="lazy" src="<?php echo esc_url( $a['story3Image'] ); ?>" width="1200"/></figure>
<div class="bs-client-words"><span aria-hidden="true" class="bs-quote-mark">“</span><blockquote cite="<?php echo esc_url( $a['story3Url'] ); ?>"><p><?php echo esc_html( $a['story3Quote'] ); ?></p></blockquote><p class="bs-attribution"><strong><?php echo esc_html( $a['story3Name'] ); ?></strong><span><?php echo esc_html( $a['story3Business'] ); ?></span></p><a class="bs-link" href="<?php echo esc_url( $a['story3Url'] ); ?>"><span><?php echo esc_html( $a['story3LinkText'] ); ?></span></a></div>
</div>
</div>
<div aria-label="Choose a client story" class="bs-carousel-dots" hidden="" role="group">
<button aria-controls="client-story-1" aria-label="<?php echo esc_attr( 'Show story 1 of 3: ' . $a['story1Name'] ); ?>" class="bs-carousel-dot" type="button"></button>
<button aria-controls="client-story-2" aria-label="<?php echo esc_attr( 'Show story 2 of 3: ' . $a['story2Name'] ); ?>" class="bs-carousel-dot" type="button"></button>
<button aria-controls="client-story-3" aria-label="<?php echo esc_attr( 'Show story 3 of 3: ' . $a['story3Name'] ); ?>" class="bs-carousel-dot" type="button"></button>
</div>
<p aria-atomic="true" aria-live="polite" class="about-motion-sr bs-carousel-status"></p>
</div>
</div>
</section>
