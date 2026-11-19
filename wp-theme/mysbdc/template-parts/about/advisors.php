<?php
/** Personal advisor introduction. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'advisors', $args['attributes'] ?? array() );
?>
<section class="about-section about-advisors about-people" id="about-people">
<div class="shell">
  <div class="about-people-heading"><h2 data-line-reveal><?php echo esc_html( $a['heading'] ); ?></h2>
    <div class="about-faces" aria-label="Meet a few of our advisors">
    <?php for ( $i = 1; $i <= 3; $i++ ) : ?>
      <a href="<?php echo esc_url( $a[ 'person' . $i . 'Url' ] ); ?>"><img src="<?php echo esc_url( $a[ 'person' . $i . 'Image' ] ); ?>" alt="<?php echo esc_attr( $a[ 'person' . $i . 'Alt' ] ); ?>" width="144" height="144" loading="lazy"></a>
    <?php endfor; ?>
    </div>
  </div>
  <div class="about-people-story"><p class="about-personal-statement" data-line-reveal><?php echo esc_html( $a['storyText'] ); ?></p>
    <div class="about-people-invitation"><p data-line-reveal><?php echo esc_html( $a['supportText'] ); ?></p><a class="about-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><?php echo esc_html( $a['linkText'] ); ?></a></div>
  </div>
  <p class="about-portrait-caption"><?php echo esc_html( $a['portraitCaption'] ); ?></p>
</div>
</section>
