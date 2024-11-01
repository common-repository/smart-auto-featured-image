<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

class TemplateEditorController {
    public function enqueueAssets( $hook_suffix ) {
        $editor_suffix = 'toplevel_page_' . SAFI()::SLUG . '_template_editor';
        //enqueues Template editor assets only on the editor's page
        if ( $hook_suffix === $editor_suffix ) {
            wp_enqueue_media();
            wp_enqueue_style(
                'wpjoli-safi-template-editor-styles',
                SAFI()->url( 'assets/admin/css/wpjoli-safi-template-editor.css', SAFI()::USE_MINIFIED_ASSETS ),
                [],
                SAFI()::VERSION
            );
            wp_enqueue_script(
                'wpjoli-safi-template-editor-scripts',
                SAFI()->url( 'assets/admin/jsr/safi-template-editor.js', SAFI()::USE_MINIFIED_ASSETS ),
                [
                    'wp-element',
                    'wp-components',
                    'media',
                    'wp-i18n',
                    'wp-polyfill',
                    'wp-api-fetch'
                ],
                SAFI()::VERSION,
                true
            );
            wp_enqueue_style( 'wpjoli-safi-template-editor-google-material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', [] );
            wp_enqueue_script(
                'html2canvas',
                SAFI()->url( 'vendor/html2canvas/html2canvas.min.js' ),
                [],
                '1.4.1',
                true
            );
            wp_enqueue_script(
                'driver.js-scripts',
                SAFI()->url( 'vendor/driver.js/driver.js.iife.js' ),
                [],
                '1.0.1',
                true
            );
            wp_enqueue_style(
                'driver.js-styles',
                SAFI()->url( 'vendor/driver.js/driver.css', SAFI()::USE_MINIFIED_ASSETS ),
                [],
                SAFI()::VERSION
            );
            $tpl_ctl = SAFI()->requestService( \WPJoli\SAFI\Controllers\TemplatesController::class );
            $demo_templates = $tpl_ctl->getStarterTemplates();
            $user_templates = $tpl_ctl->pullTemplates();
            $user_templates_screenshots = $tpl_ctl->pullTemplatesScreenshots();
            $license = null;
            $fs_user = null;
            $fs_install = null;
            $google_fonts = [];
            //Get the current categories and return it in a custom array
            $categories = get_categories( [
                "hide_empty" => 0,
            ] );
            $cat = array_values( array_map( function ( $category ) {
                return [
                    'value' => $category->name,
                    'label' => $category->name,
                ];
            }, $categories ) );
            $grid_opacity = (int) safi_get_option( 'template_grid_opacity' );
            $grid_opacity = ( safi_sanitize_var( $grid_opacity ) && $grid_opacity > 0 ? $grid_opacity / 100 : 0.15 );
            $can = false;
            $safi_data = [
                'editor_nonce'              => wp_create_nonce( 'SAFITemplateEditor' ),
                'ajaxurl'                   => admin_url( 'admin-ajax.php' ),
                'gopro_url'                 => sprintf( '%sadmin.php?page=' . 'smart-auto-featured-image_template_editor' . '-pricing', get_admin_url() ),
                'options'                   => [
                    'pluginUrl'              => SAFI()->url(),
                    'defaultGridSize'        => safi_get_option( 'template_grid_size' ),
                    'gridColor'              => safi_get_option( 'template_grid_color' ),
                    'gridOpacity'            => $grid_opacity,
                    'defaultWidth'           => safi_get_option( 'template_width' ),
                    'defaultHeight'          => safi_get_option( 'template_height' ),
                    'defaultBackgroundColor' => safi_get_option( 'template_background_color' ),
                    'googleFonts'            => $google_fonts,
                    'can'                    => (bool) $can,
                ],
                'demo_templates'            => $demo_templates,
                'templates'                 => $user_templates,
                'templates_screenshots'     => $user_templates_screenshots,
                'templates_screenshots_url' => SAFI_TEMPLATE_THUMB_URL,
                'license'                   => [
                    'id'            => ( is_object( $license ) ? $license->id : null ),
                    'hash'          => ( is_object( $license ) ? sha1( $license->secret_key ) : null ),
                    'user_id'       => ( is_object( $license ) ? $license->user_id : null ),
                    'trial_user_id' => ( is_object( $fs_user ) ? $fs_user->id : null ),
                ],
                'categories'                => $cat,
            ];
            wp_localize_script( 'wpjoli-safi-template-editor-scripts', 'SAFI', $safi_data );
        }
    }

}
