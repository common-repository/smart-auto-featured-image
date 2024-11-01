<?php

use WPJoli\SAFI\Application;
/**
 * @package safi
 */
/*
 * Plugin Name: Smart Auto Featured Image
 * Plugin URI: https://wpjoli.com/smart-auto-featured-image
 * Description: Design & Generate Featured Images automatically. Create dynamic templates with the built-in editor, based on your post content (title, etc).
 * Version: 1.0.4
 * Author: WPJoli
 * Author URI: https://wpjoli.com
 * License: GPLv2 or later
 * Text Domain: smart-auto-featured-image
 * Domain Path: /languages
 * 
 */
defined( 'ABSPATH' ) or die( 'Wrong path bro!' );
if ( function_exists( 'safi_xy' ) ) {
    safi_xy()->set_basename( false, __FILE__ );
} else {
    if ( !function_exists( 'safi_xy' ) ) {
        function safi_xy() {
            global $safi_xy;
            if ( !isset( $safi_xy ) ) {
                require_once dirname( __FILE__ ) . '/includes/fs/start.php';
                $safi_xy = fs_dynamic_init( array(
                    'id'             => '10001',
                    'slug'           => 'smart-auto-featured-image',
                    'premium_slug'   => 'smart-auto-featured-image-pro',
                    'type'           => 'plugin',
                    'public_key'     => 'pk_2bd0ea915b521ebc7710c7a73dc02',
                    'is_premium'     => false,
                    'premium_suffix' => 'Pro',
                    'has_addons'     => false,
                    'has_paid_plans' => true,
                    'trial'          => array(
                        'days'               => 7,
                        'is_require_payment' => false,
                    ),
                    'menu'           => array(
                        'slug'       => 'smart-auto-featured-image_template_editor',
                        'first-path' => 'admin.php?page=smart-auto-featured-image_template_editor',
                        'account'    => false,
                        'contact'    => false,
                        'support'    => false,
                    ),
                    'is_live'        => true,
                ) );
            }
            return $safi_xy;
        }

        safi_xy();
        do_action( 'safi_xy_loaded' );
    }
    require_once dirname( __FILE__ ) . '/helpers.php';
    require_once dirname( __FILE__ ) . '/fs-helpers.php';
    require_once dirname( __FILE__ ) . '/autoload.php';
    $app = new Application();
    $app->run();
    register_activation_hook( __FILE__, [$app, 'activate'] );
    register_deactivation_hook( __FILE__, [$app, 'deactivate'] );
    safi_xy()->add_action( 'after_uninstall', 'safi_xy_uninstall_cleanup' );
}
if ( !function_exists( 'safi_xy_uninstall_cleanup' ) ) {
    /**
     * Clean all smart auto featured image related data from the install
     *
     * @return void
     */
    function safi_xy_uninstall_cleanup() {
        $option = safi_get_option( 'uninstall_app' );
        $uninstall = (bool) safi_sanitize_var( $option );
        if ( $uninstall === true ) {
            //. 1 Delete thumbnails and our custom folder
            $upload_dir = wp_upload_dir();
            $dir = $upload_dir['basedir'] . "/safi-thumbnails/";
            safi_delete_thumbnail_directory( $dir );
            //2. Delete the table in the database
            global $wpdb;
            $prefix = $wpdb->prefix . SAFI()::PREFIX;
            $sql = "DROP TABLE IF EXISTS {$prefix}fi_records";
            $wpdb->query( $sql );
            // delete post meta
            $myplugin_post_args = array(
                'posts_per_page' => -1,
                'meta_query'     => array(array(
                    'key'     => '_safi_template_id',
                    'compare' => 'EXISTS',
                )),
            );
            $myplugin_posts = get_posts( $myplugin_post_args );
            foreach ( $myplugin_posts as $post ) {
                delete_post_meta( $post->ID, '_safi_template' );
                delete_post_meta( $post->ID, '_safi_template_id' );
                delete_post_meta( $post->ID, '_safi_thumb' );
            }
            //3. Delete options and templates
            delete_option( SAFI()::SETTINGS_SLUG );
            delete_option( SAFI()::TEMPLATES_OPT );
            delete_option( SAFI()::SCREENSHOT_TEMPLATES_OPT );
            delete_option( SAFI()::SLUG . '_gopro_time' );
            delete_option( SAFI()::SLUG . '_rating_time' );
        }
    }

}
if ( !function_exists( 'safi_delete_thumbnail_directory' ) ) {
    function safi_delete_thumbnail_directory(  $dirPath  ) {
        if ( is_dir( $dirPath ) ) {
            $files = scandir( $dirPath );
            foreach ( $files as $file ) {
                if ( $file !== '.' && $file !== '..' ) {
                    $filePath = $dirPath . '/' . $file;
                    if ( is_dir( $filePath ) ) {
                        safi_delete_thumbnail_directory( $filePath );
                    } else {
                        unlink( $filePath );
                    }
                }
            }
            rmdir( $dirPath );
        }
    }

}