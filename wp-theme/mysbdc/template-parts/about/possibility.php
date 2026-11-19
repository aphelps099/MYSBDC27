<?php
/** A photographic introduction to the region's business community. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'possibility', $args['attributes'] ?? array() );
?>
<section class="about-section about-possibility" id="about-possibility"><div class="shell">
  <div class="about-possibility-heading"><h2><?php foreach ( explode( "\n", $a['heading'] ) as $line ) : ?><span class="about-heading-line" data-line-reveal><?php echo esc_html( $line ); ?></span><?php endforeach; ?></h2><p data-line-reveal><?php echo esc_html( $a['description'] ); ?></p></div>
  <div class="about-business-mosaic">
  <?php for ( $i = 1; $i <= 3; $i++ ) : ?>
    <figure><img src="<?php echo esc_url( $a[ 'photo' . $i . 'Image' ] ); ?>" alt="<?php echo esc_attr( $a[ 'photo' . $i . 'Alt' ] ); ?>" width="900" height="900" loading="lazy" decoding="async"><figcaption><span><?php echo esc_html( $a[ 'photo' . $i . 'Caption' ] ); ?></span><small><?php echo esc_html( $a[ 'photo' . $i . 'Name' ] ); ?></small></figcaption></figure>
  <?php endfor; ?>
  </div>
  <div class="about-possibility-end"><p data-line-reveal><?php echo esc_html( $a['supportText'] ); ?></p><a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div>
</div></section>
