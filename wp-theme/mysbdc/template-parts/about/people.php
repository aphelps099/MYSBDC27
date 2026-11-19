<?php
/** Approved About composition: saved content remains authoritative. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'people', $args['attributes'] ?? array() );
?>
<section aria-labelledby="people-title" class="bs-people" id="our-people">
<div class="bs-shell bs-advisor-layout">
<div class="bs-advisor-intro"><h2 id="people-title"><?php echo esc_html( $a['headingLine1'] ); ?><br/><?php echo esc_html( $a['headingLine2'] ); ?> <span><?php echo esc_html( $a['headingAccent'] ); ?></span></h2>
<div aria-label="<?php echo esc_attr( $a['portraitCaption'] ); ?>" class="bs-faces">
<a aria-label="<?php echo esc_attr( $a['person1Label'] ); ?>" class="bs-portrait" href="<?php echo esc_url( $a['person1Url'] ); ?>"><img alt="" decoding="async" height="144" loading="lazy" src="<?php echo esc_url( $a['person1Image'] ); ?>" width="144"/></a>
<a aria-label="<?php echo esc_attr( $a['person2Label'] ); ?>" class="bs-portrait" href="<?php echo esc_url( $a['person2Url'] ); ?>"><img alt="" decoding="async" height="144" loading="lazy" src="<?php echo esc_url( $a['person2Image'] ); ?>" width="144"/></a>
<a aria-label="<?php echo esc_attr( $a['person3Label'] ); ?>" class="bs-portrait" href="<?php echo esc_url( $a['person3Url'] ); ?>"><img alt="" decoding="async" height="144" loading="lazy" src="<?php echo esc_url( $a['person3Image'] ); ?>" width="144"/></a>
</div>
<a class="bs-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><?php echo esc_html( $a['linkText'] ); ?></a>
</div>
<div class="bs-advisor-copy">
<p><strong><?php echo esc_html( $a['point1Heading'] ); ?></strong> <?php echo esc_html( $a['point1Text'] ); ?></p>
<p><strong><?php echo esc_html( $a['point2Heading'] ); ?></strong> <?php echo esc_html( $a['point2Text'] ); ?></p>
<p><strong><?php echo esc_html( $a['point3Heading'] ); ?></strong> <?php echo esc_html( $a['point3Text'] ); ?></p>
<p><strong><?php echo esc_html( $a['point4Heading'] ); ?></strong> <?php echo esc_html( $a['point4Text'] ); ?></p>
</div>
</div>
</section>
