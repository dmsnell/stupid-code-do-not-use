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
			'wp-edit-post',
			'wp-editor',
			'wp-element',
			'wp-i18n',
			'wp-plugins',
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

				if ( 'fse_layout' === get_post_type( $post_id ) ) {
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

				if ( 'fse_layout' === get_post_type( $post_id ) ) {
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

	register_post_type(
		'fse_layout',
		[
			'description'   => 'Reusable pieces of a site from small to large',
			'label'         => 'Layouts',
			'menu_icon'     => 'dashicons-layout',
			'menu_position' => 3,
			'public'        => true,
			'show_in_rest'  => true,
			'show_ui'       => true,
			'supports'      => [ 'title', 'editor', 'revisions' ],
		]
	);

	register_meta(
		'post',
		'fse_template_id',
		[
			'show_in_rest' => true,
			'single' => true,
			'type' => 'integer'
		]
	);

	register_meta(
		'page',
		'fse_template_id',
		[
			'show_in_rest' => true,
			'single' => true,
			'type' => 'integer'
		]
	);

	register_rest_route(
		'fse',
		'/post-template',
		[
			'methods'  => [ 'GET', 'POST' ],
			'callback' => function() {
				$post_id     = (int) $_GET['post_id'];
				$template_id = (int) $_GET['template_id'];

				if ( ! $post_id ) {
					return null;
				}

				if ( 'POST' === $_SERVER['REQUEST_METHOD'] && $template_id > 0 )  {
					$meta_id = update_post_meta( $post_id, 'fse_template_id', $template_id );
					
					if ( $meta_id ) {
						return [
							'template_id' => $template_id,
							'did_succeed' => true,
						];
					}
				}

				return [
					'template_id' => get_post_meta(
						$post_id,
						'fse_template_id',
						/*single */ true
					) ?: null,
					'did_succeed' => 'POST' !== $_SERVER['REQUEST_METHOD'],
				];
			}
		]
	);

	// add_meta_box(
	// 	'fse_template_selector',
	// 	'Layout Template',
	// 	function() {},
	// 	'post',
	// 	'normal',
	// 	'high',
	// );
} );
