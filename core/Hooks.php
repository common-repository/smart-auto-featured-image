<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI;

use WPJoli\SAFI\Application;
use WPJoli\SAFI\Controllers\AdminController;
use WPJoli\SAFI\Controllers\TemplateEditorController;
use WPJoli\SAFI\Controllers\TemplatesController;
use WPJoli\SAFI\Controllers\MenuController;
use WPJoli\SAFI\Controllers\SettingsController;
use WPJoli\SAFI\Controllers\NoticesFreeController;
use WPJoli\SAFI\Controllers\RestApi;
use WPJoli\SAFI\Controllers\SAFIPostThumbnail;
class Hooks {
    protected $app;

    protected $admin;

    protected $menu;

    protected $settings;

    protected $notices;

    protected $notices_free;

    protected $template_editor;

    protected $templates;

    protected $post_thumbnail;

    protected $rest;

    protected $fi;

    protected $cc;

    public function __construct( Application &$app ) {
        $this->app = $app;
        $this->admin = $app->requestService( AdminController::class );
        $this->menu = $app->requestService( MenuController::class );
        $this->template_editor = $app->requestService( TemplateEditorController::class );
        $this->templates = $app->requestService( TemplatesController::class );
        $this->settings = $app->requestService( SettingsController::class );
        $this->post_thumbnail = $app->requestService( SAFIPostThumbnail::class );
        $this->rest = $app->requestService( RestApi::class );
        if ( safi_xy()->is_free_plan() ) {
            $this->notices_free = $app->requestService( NoticesFreeController::class );
        }
    }

    /**
     * Registers all the plugin hooks and filters
     */
    public function run() {
        $this->registerAdminHooks();
    }

    private function registerAdminHooks() {
        // add_filter('mce_css', [$this->post_thumbnail, 'removeTinyMCECSS']);
        // add_filter('tiny_mce_before_init', [$this->post_thumbnail, 'cdils_change_mce_block_formats']);
        //actions
        if ( safi_xy()->is_free_plan() ) {
            add_action( 'init', [$this->notices_free, 'initNotices'] );
            add_action( 'wp_ajax_wpjoli_safi_handle_notice', [$this->notices_free, 'safiHandleNotice'] );
        }
        // add_action( 'plugins_loaded',                       [ $this->app,           'registerLanguages' ] );
        add_action( 'admin_enqueue_scripts', [$this->admin, 'enqueueAssets'] );
        add_action( 'admin_menu', [$this->menu, 'addAdminMenu'] );
        add_action( 'admin_init', [$this->settings, 'registerSettings'] );
        add_action( 'admin_enqueue_scripts', [$this->template_editor, 'enqueueAssets'] );
        //filters
        add_filter( 'plugin_action_links_' . plugin_basename( SAFI()->path( 'smart-auto-featured-image.php' ) ), [$this->admin, 'addSettingsLink'] );
        add_action( 'wp_ajax_safi_templates', [$this->templates, 'ajaxTemplatesRouteAction'] );
        add_filter( 'init', [$this->post_thumbnail, 'registerMetas'] );
        add_action( 'init', [$this->settings, 'handleResetSettings'] );
        add_filter( 'enqueue_block_editor_assets', [$this->post_thumbnail, 'enqueueAssets'] );
        // add_filter('admin_post_thumbnail_html',             [$this->post_thumbnail, 'filterPostThumbnail'], 10, 2);
        add_action( 'rest_api_init', [$this->rest, 'registerRestRoutes'] );
    }

}
