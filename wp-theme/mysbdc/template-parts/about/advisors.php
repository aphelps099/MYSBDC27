<?php
/** Real people, woven into an editorial conversation. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'advisors', $args['attributes'] ?? array() );
?>
<section class="about-section about-advisors about-people" id="about-people"><div class="shell">
  <h2 class="about-people-title"><?php echo esc_html( $a['heading'] ); ?></h2>
  <div class="about-conversation">
    <?php for ( $i = 1; $i <= 3; $i++ ) : ?>
    <div class="about-conversation-line"><div class="about-advisor-words"><p data-line-reveal><?php echo esc_html( $a[ 'line' . $i ] ); ?></p><?php if ( ! empty( $a[ 'person' . $i . 'Caption' ] ) ) : ?><p class="about-advisor-expertise"><?php echo esc_html( $a[ 'person' . $i . 'Caption' ] ); ?></p><?php endif; ?></div><a class="about-person" href="<?php echo esc_url( $a[ 'person' . $i . 'Url' ] ); ?>"><img src="<?php echo esc_url( $a[ 'person' . $i . 'Image' ] ); ?>" alt="<?php echo esc_attr( $a[ 'person' . $i . 'Alt' ] ); ?>" width="144" height="144" loading="lazy" decoding="async"></a></div>
    <?php endfor; ?>
  </div>
  <div class="about-people-end"><div><p class="about-personal-statement" data-line-reveal><?php echo esc_html( $a['storyText'] ); ?></p><p class="about-people-assurance"><?php echo esc_html( $a['supportText'] ); ?></p></div><div class="about-people-action"><a class="about-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><?php echo esc_html( $a['linkText'] ); ?></a><p class="about-portrait-caption"><?php echo esc_html( $a['portraitCaption'] ); ?></p></div></div>
</div></section>
