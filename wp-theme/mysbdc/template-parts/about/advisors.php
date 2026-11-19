<?php
/** Editable About section. @package MySBDC */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$a = mysbdc_about_attributes( 'advisors', $args['attributes'] ?? array() );
?>
<section class="about-section about-advisors">
<div class="shell about-advisor-layout"><div><h2><?php echo esc_html( $a['heading'] ); ?></h2><a class="about-button" href="<?php echo esc_url( $a['linkUrl'] ); ?>"><span><?php echo esc_html( $a['linkText'] ); ?></span></a></div><div class="about-points"><div><h3><?php echo esc_html( $a['point1Title'] ); ?></h3><p><?php echo esc_html( $a['point1Copy'] ); ?></p></div><div><h3><?php echo esc_html( $a['point2Title'] ); ?></h3><p><?php echo esc_html( $a['point2Copy'] ); ?></p></div><div><h3><?php echo esc_html( $a['point3Title'] ); ?></h3><p><?php echo esc_html( $a['point3Copy'] ); ?></p></div><div><h3><?php echo esc_html( $a['point4Title'] ); ?></h3><p><?php echo esc_html( $a['point4Copy'] ); ?></p></div></div></div>
</section>
