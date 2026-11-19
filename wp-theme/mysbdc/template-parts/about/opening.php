<?php
/** Approved About composition: saved content remains authoritative. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'opening', $args['attributes'] ?? array() );
?>
<section aria-labelledby="study-title" class="bs-opening">
<div class="bs-shell bs-introduction">
<p class="bs-label"><?php echo esc_html( $a['eyebrow'] ); ?></p>
<h1 id="study-title"><?php echo esc_html( $a['heading'] ); ?></h1>
<p><?php echo esc_html( $a['description'] ); ?></p>
</div>
<div aria-label="Meet Northern California business owners" class="bs-shell bs-photo-ribbon">
<figure><img alt="<?php echo esc_attr( $a['photo1Alt'] ); ?>" decoding="async" fetchpriority="high" height="800" src="<?php echo esc_url( $a['photo1Image'] ); ?>" width="800"/><figcaption><?php echo esc_html( $a['photo1Caption'] ); ?></figcaption></figure>
<figure><img alt="<?php echo esc_attr( $a['photo2Alt'] ); ?>" decoding="async" height="800" src="<?php echo esc_url( $a['photo2Image'] ); ?>" width="800"/><figcaption><?php echo esc_html( $a['photo2Caption'] ); ?></figcaption></figure>
<figure><img alt="<?php echo esc_attr( $a['photo3Alt'] ); ?>" decoding="async" height="800" src="<?php echo esc_url( $a['photo3Image'] ); ?>" width="800"/><figcaption><?php echo esc_html( $a['photo3Caption'] ); ?></figcaption></figure>
<figure><img alt="<?php echo esc_attr( $a['photo4Alt'] ); ?>" decoding="async" height="800" src="<?php echo esc_url( $a['photo4Image'] ); ?>" width="800"/><figcaption><?php echo esc_html( $a['photo4Caption'] ); ?></figcaption></figure>
</div>
</section>
