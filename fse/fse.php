<?php
/*
Plugin Name: Full-Site Editing
Plugin URI: http://localhost
Description: Exploring a blank theme and block-in-a-block
Version: 1.0
Author: Dennis Snell <dennis.snell@automattic.com>
Author URI: https://dmsnell.blog
License: MIT
*/

add_action( 'init', function() {
	wp_register_script(
		'fse-js',
		plugins_url( 'fse.js', __FILE__ ),
		[
			'wp-api-fetch',
			'wp-blocks',
			'wp-components',
			'wp-editor',
			'wp-element',
			'wp-i18n',
		],
		filemtime( plugin_dir_path( __FILE__ ) . 'fse.js' )
	);

	register_block_type(
		'fse/post-renderer',
		[
			'editor_script' => 'fse-js',
			'render_callback' => function( $attributes, $content ) {
				if ( ! isset( $attributes['postId'] ) ) {
					return 'Some post will eventually render here.';
				}

				$post_id = (int) $attributes['postId'];

				if ( 81315 === $post_id || 80426 === $post_id || 81228 === $post_id ) {
					return "Can't render own template";
				}

				$post    = get_post( $post_id );

				if ( ! $post ) {
					return "Tried to render post $post_id but couldn't find it.";
				}

				return do_blocks( $post->post_content );
			}
		]
	);

	wp_register_script(
		'fse-js-post-content',
		plugins_url( 'post-content.js', __FILE__ ),
		[
			'wp-api-fetch',
			'wp-blocks',
			'wp-components',
			'wp-editor',
			'wp-element',
			'wp-i18n',
			'fse-js',
		],
		filemtime( plugin_dir_path( __FILE__ ) . 'post-content.js' )
	);

	register_block_type(
		'fse/post-content',
		[
			'editor_script' => 'fse-js-post-content',
			'render_callback' => function( $attributes, $content ) {
				global $post_id;

				if ( 81315 === $post_id || 80426 === $post_id || 81228 === $post_id ) {
					return "Can't render own template";
				}

				$post = get_post( $post_id );

				if ( ! $post ) {
					return 'No content found, sorry!';
				}

				return do_blocks( $post->post_content );
			}
		]
	);

	// register_meta(
	// 	'post',
	// 	'fse_template_id',
	// 	[
	// 		'show_in_rest' => true,
	// 		'single' => true,
	// 		'type' => 'integer'
	// 	]
	// );
} );
