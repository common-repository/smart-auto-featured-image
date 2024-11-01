<?php

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    safi
 */
namespace WPJoli\SAFI;

class Activator {
    protected $db;

    protected $prefix;

    public function activate() {
        global $wpdb;
        $this->db = $wpdb;
        $this->prefix = $wpdb->prefix . Application::PREFIX;
        //app settings
        $settings = SAFI()->requestService( \WPJoli\SAFI\Controllers\SettingsController::class );
        $settings->setupSettings();
        $this->addDemos();
    }

    public function deactivate() {
    }

    public function addDemos() {
        $demo_templates = file_get_contents( SAFI()->path( 'assets/admin/data/demo-templates.json' ) );
        $demo_templates_thumbs = file_get_contents( SAFI()->path( 'assets/admin/data/demo-templates-thumbs.json' ) );
        $templates = get_option( SAFI()::TEMPLATES_OPT );
        //If templates have not been set yet
        if ( !$templates && $demo_templates ) {
            update_option( SAFI()::TEMPLATES_OPT, $demo_templates );
            update_option( SAFI()::SCREENSHOT_TEMPLATES_OPT, $demo_templates_thumbs );
            //get the wp upload dir
            $upload_dir = wp_upload_dir();
            $dir = $upload_dir['basedir'] . "/safi-thumbnails/";
            if ( !is_dir( $dir ) ) {
                // dir doesn't exist, make it
                wp_mkdir_p( $dir );
            }
            $demo_template_thumbs_path = SAFI()->path( 'assets/admin/img/template-thumbnails/' );
            $files = scandir( $demo_template_thumbs_path );
            if ( count( $files ) > 0 ) {
                //copy the demo thumbnails
                foreach ( $files as $file ) {
                    if ( $file == '.' || $file == '..' ) {
                        continue;
                    }
                    copy( $demo_template_thumbs_path . $file, $dir . $file );
                }
            }
        }
    }

}
