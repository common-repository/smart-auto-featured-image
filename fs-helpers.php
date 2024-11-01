<?php

defined( 'ABSPATH' ) or die( 'Wrong path bro!' );
function safi_xy_custom_connect_message(
    $message,
    $user_first_name,
    $plugin_title,
    $user_login,
    $site_link,
    $freemius_link
) {
    return sprintf(
        __( 'Hey %1$s', 'wpjoli-safi' ) . ',<br>' . __( 'Welcome aboard %2$s! We are very pleased to count you as a new user! 
        In order to provide the best experience for our plugins, we like to understand how our users interact.
        If you opt-in, some data about your usage of %2$s will be sent to %5$s. 
        If you skip this, that\'s okay too! %2$s will still work just fine.', 'wpjoli-safi' ),
        $user_first_name,
        '<b>' . $plugin_title . '</b>',
        '<b>' . $user_login . '</b>',
        $site_link,
        $freemius_link
    );
}

safi_xy()->add_filter(
    'connect_message',
    'safi_xy_custom_connect_message',
    10,
    6
);
function safi_fs_uninstall_cleanup() {
    delete_option( SAFI()::SLUG . '_rating_time' );
    delete_option( SAFI()::SLUG . '_gopro_time' );
}

safi_xy()->add_action( 'after_uninstall', 'safi_fs_uninstall_cleanup' );
if ( !function_exists( 'fs_file' ) ) {
    function fs_file(  $file  ) {
        return $file;
    }

}
if ( !function_exists( 'wpjoli_fs_custom_icon' ) ) {
    function wpjoli_fs_custom_icon() {
        return dirname( __FILE__ ) . '/assets/icon-256x256.png';
    }

    safi_xy()->add_filter( 'plugin_icon', 'wpjoli_fs_custom_icon' );
}