<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

class SAFIPostThumbnail {
    public function enqueueAssets( $hook_suffix ) {
        $enabled_post_types = safi_get_option( 'enable_safi_post_types' );
        // $disabled_post_types = safi_get_option('disable_safi_post_types');
        //do not load the SAFI module for disabled post types
        if ( !is_array( $enabled_post_types ) || !in_array( get_post_type(), $enabled_post_types ) ) {
            return;
        }
        wp_enqueue_style(
            'wpjoli-safi-featured-image-styles',
            SAFI()->url( 'assets/admin/css/safi-featured-image.css', SAFI()::USE_MINIFIED_ASSETS ),
            [],
            SAFI()::VERSION
        );
        wp_enqueue_script(
            'wpjoli-safi-featured-image-scripts',
            SAFI()->url( 'assets/admin/jsr/safi-featured-image.js', SAFI()::USE_MINIFIED_ASSETS ),
            [
                'editor',
                'wp-edit-post',
                'wp-data',
                'wp-components',
                'wp-element',
                'media',
                'wp-i18n',
                'wp-polyfill',
                'wp-api-fetch'
            ],
            // same as template editopr
            SAFI()::VERSION . time()
        );
        $tpl_ctl = SAFI()->requestService( TemplatesController::class );
        $demo_templates = $tpl_ctl->getStarterTemplates();
        $templates = $tpl_ctl->getTemplates();
        //load template;
        $user_templates_screenshots = $tpl_ctl->pullTemplatesScreenshots();
        wp_localize_script( 'wpjoli-safi-featured-image-scripts', 'SafiData', [
            'templates' => $templates,
        ] );
        wp_enqueue_media();
        wp_enqueue_style(
            'wpjoli-safi-template-editor-styles',
            SAFI()->url( 'assets/admin/css/wpjoli-safi-template-editor.css', SAFI()::USE_MINIFIED_ASSETS ),
            [],
            SAFI()::VERSION
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
        $user_templates = $tpl_ctl->pullTemplates();
        $license = null;
        $fs_user = null;
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
                'defaultTemplate'        => safi_get_option( 'default_template' ),
                'defaultBackgroundColor' => safi_get_option( 'template_background_color' ),
                'imageFormat'            => safi_get_option( 'image_format' ),
                'imageQuality'           => (int) safi_get_option( 'image_quality' ),
                'imageHD'                => (bool) safi_get_option( 'image_hd' ),
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
        if ( safi_xy()->is_trial() ) {
            $fs_install = safi_xy()->get_site();
            $safi_data['install'] = $fs_install->id;
        }
        wp_localize_script( 'wpjoli-safi-featured-image-scripts', 'SAFI', $safi_data );
    }

    public function registerMetas() {
        $posttypes = safi_get_option( 'enable_safi_post_types' );
        // SAFI()->log($posttypes);
        if ( !is_array( $posttypes ) ) {
            return;
        }
        foreach ( $posttypes as $posttype ) {
            register_post_meta( $posttype, '_safi_template', [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => 'string',
                'auth_callback' => function () {
                    return current_user_can( 'edit_posts' );
                },
            ] );
            register_post_meta( $posttype, '_safi_template_id', [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => 'string',
                'auth_callback' => function () {
                    return current_user_can( 'edit_posts' );
                },
            ] );
            register_post_meta( $posttype, '_safi_thumb', [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => 'string',
                'auth_callback' => function () {
                    return current_user_can( 'edit_posts' );
                },
            ] );
        }
        // register_post_meta('post', '_safi_generate_on_save', [
        //     'show_in_rest' => true,
        //     'single' => true,
        //     'type' => 'boolean',
        //     'auth_callback' => function () {
        //         return current_user_can('edit_posts');
        //     }
        // ]);
        // register_post_meta('post', 'myprefix_text_metafield', [
        //     'show_in_rest' => true,
        //     'single' => true,
        //     'type' => 'string',
        //     'auth_callback' => function () {
        //         return current_user_can('edit_posts');
        //     }
        // ]);
    }

    // public function removeTinyMCECSS($stylesheets)
    // {
    //     $stylesheets = explode(',',$stylesheets);
    //     foreach ($stylesheets as $key => $sheet) {
    //         if (preg_match('/wp\-includes/',$sheet)) {
    //             unset($stylesheets[$key]);
    //         }
    //     }
    //     $stylesheets = implode(',',$stylesheets);
    //     return $stylesheets;
    // }
    // public function cdils_change_mce_block_formats( $init ) {
    //     $init['content_css'] = 'http://localhost/wordpress/wp-includes/css/dashicons.min.css?ver=6.4.3,http://localhost/wordpress/wp-content/themes/astra/assets/css/minified/editor-style.min.css';
    //     SAFI()->log($init);
    //     return $init;
    // }
}
