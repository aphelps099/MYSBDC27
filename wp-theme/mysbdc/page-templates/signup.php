<?php
/**
 * Template Name: Get started
 *
 * The signup flow, with its own quiet header and footer. Today this is the
 * design preview: assets/js/signup.js sends and saves nothing.
 *
 * @package MySBDC
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header( null, array( 'minimal' => true ) );
?>
<main id="main" class="shell signup-layout" tabindex="-1">
<?php get_template_part( 'template-parts/page-signup' ); ?>
</main>
<?php
get_footer( null, array( 'minimal' => true ) );
