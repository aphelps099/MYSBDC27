<?php
/** A photographic introduction to the region's business community. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'possibility', $args['attributes'] ?? array() );
?>
<section class="about-section about-possibility" id="about-possibility"><div class="shell">
  <?php if ( '' !== trim( $a['heading'] ) ) : ?><div class="about-possibility-heading"><h2><?php echo esc_html( $a['heading'] ); ?></h2></div><?php endif; ?>
  <?php if ( '' !== trim( $a['introText'] . $a['contextText'] ) ) : ?><div class="about-possibility-intro">
    <?php foreach ( array( 'introText', 'contextText' ) as $key ) : if ( '' !== trim( $a[$key] ) ) : ?><p data-line-reveal><?php echo esc_html( $a[$key] ); ?></p><?php endif; endforeach; ?>
  </div><?php endif; ?>
  <div class="about-business-mosaic">
  <?php for ( $i = 1; $i <= 3; $i++ ) : ?>
    <figure><img src="<?php echo esc_url( $a[ 'photo' . $i . 'Image' ] ); ?>" alt="<?php echo esc_attr( $a[ 'photo' . $i . 'Alt' ] ); ?>" width="900" height="900" loading="lazy" decoding="async"><figcaption><span><?php echo esc_html( $a[ 'photo' . $i . 'Caption' ] ); ?></span><small><?php echo esc_html( $a[ 'photo' . $i . 'Name' ] ); ?></small></figcaption></figure>
  <?php endfor; ?>
  </div>
  <div class="about-possibility-end">
    <?php if ( '' !== trim( $a['quoteText'] ) ) : ?>
    <figure class="about-client-quote"><blockquote cite="<?php echo esc_url( $a['linkUrl'] ); ?>"><p data-line-reveal>“<?php echo esc_html( $a['quoteText'] ); ?>”</p></blockquote><figcaption><?php echo esc_html( $a['quoteAttribution'] ); ?></figcaption></figure>
    <?php else : ?><div><p class="about-possibility-description" data-line-reveal><?php echo esc_html( $a['description'] ); ?></p><p data-line-reveal><?php echo esc_html( $a['supportText'] ); ?></p></div><?php endif; ?><a class="about-link" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div>
</div></section>
