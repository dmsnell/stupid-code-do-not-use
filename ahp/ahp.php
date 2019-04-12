<?php
/**
* Plugin Name: Page Templates by Dennis
* Plugin URI: http://wordpress.com/
* Description: Playing with block templates for page layout
* Version: 1.0
* Author: Dennis Snell <dennis.snell@automattic.com>
* Author URI: wordpress.com
* License: GPL-2.0
**/
defined( 'ABSPATH' ) or die( 'Cannot access script directly' );
add_action( 'init', function() {
	wp_enqueue_script(
		'ahp-js',
		plugins_url( 'ahp.js', __FILE__ ),
		[
			'wp-api-fetch',
			'wp-blocks',
			'wp-editor',
			'wp-element',
			'wp-i18n',
		],
		filemtime( plugin_dir_path( __FILE__ ) . 'ahp.js' )
	);
} );