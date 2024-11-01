<?php

/**
 * @package safi
 */
namespace WPJoli\SAFI\Controllers;

use Freemius_Api_WordPress;
use WPJoli\SAFI\Application;
use WPJoli\SAFI\Controllers\SettingsController;
use WPJoli\SAFI\Controllers\CreditsController;
use WPJoli\SAFI\Controllers\DBController;
class MenuController {
    public $admin_pages = [];

    public $admin_subpages = [];

    public $pages = [];

    public $subpages = [];

    protected $option_group;

    protected $logo_url;

    private $capability;

    private $pro_features;

    private $params;

    private $wpjoli_url = 'https://wpjoli.com/';

    private $base_url = 'https://wpjoli.com/smart-auto-featured-image/';

    public function __construct() {
        //Registers the menu afters functions.php has been processed to allow custom filter hooks for joli_toc_settings_capability
        add_action( 'after_setup_theme', [$this, 'setup'] );
    }

    public function setup() {
        $this->pro_features = [
            __( "Dozens of Pro templates", "wpjoli-safi" ),
            __( "All design tools", "wpjoli-safi" ),
            __( "Unlimited layers", "wpjoli-safi" ),
            __( "Conditional layers", "wpjoli-safi" ),
            __( ".WEBP & .PNG image formats", "wpjoli-safi" ),
            __( "Dynamic images", "wpjoli-safi" ),
            __( "Unsplash images HD/HQ", "wpjoli-safi" ),
            __( "HD image generation", "wpjoli-safi" ),
            __( "Google fonts", "wpjoli-safi" ),
            __( "ACF support", "wpjoli-safi" ),
            __( "Custom CSS in templates", "wpjoli-safi" ),
            __( "Rotate layers", "wpjoli-safi" ),
            __( "Rounded corners", "wpjoli-safi" )
        ];
        $this->params = '?utm_source=' . safi_get_host_url() . '&utm_medium=admin-settings&utm_campaign=smart-auto-featured-image-settings';
        $this->option_group = Application::SLUG . '_settings';
        $this->capability = apply_filters( 'safi_editor_capability', 'manage_options' );
        $allowed_cap = ['manage_options', 'edit_pages'];
        //allow custom capability only if current user is allowed
        if ( !in_array( $this->capability, $allowed_cap ) ) {
            $this->capability = 'manage_options';
            // default value
        }
        //Wordpress filter that allows saving settings
        $capability = $this->capability;
        add_filter( 'option_page_capability_' . Application::SETTINGS_SLUG, function ( $cap ) use($capability) {
            return $capability;
        } );
        $this->setPages();
        $this->setSubpages();
        $this->addPages( $this->pages )->withSubPage( 'Template manager' )->addSubPages( $this->subpages );
        $this->logo_url = SAFI()->url( 'assets/admin/img/wpjoli-logo-2023.svg' );
    }

    /**
     * Array of menu pages
     * To be defined manually
     */
    public function setPages() {
        // $capability = apply_filters('safi_editor_capability', 'manage_options');
        // $allowed_cap = ['manage_options', 'edit_pages'];
        // //allow custom capability only if current user is allowed
        // if (!in_array($capability, $allowed_cap)) {
        //     $capability = 'manage_options'; // default value
        // }
        // //Wordpress filter that allows saving settings
        // add_filter(
        //     'option_page_capability_' . Application::SETTINGS_SLUG,
        //     function ($cap) use ($capability) {
        //         return $capability;
        //     }
        // );
        $this->pages = [[
            'page_title' => Application::NAME,
            'menu_title' => Application::NAME,
            'capability' => $this->capability,
            'menu_slug'  => Application::SLUG . '_template_editor',
            'callback'   => [$this, 'displayTemplateEditorPage'],
            'icon_url'   => 'data:image/svg+xml;base64,' . 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMntmaWxsOiNmZmY7fS5jbHMtMXtvcGFjaXR5OjAuNTt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkZsYW1lIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNjEuMiwxOTYuNzFDMjAxLjE5LDEwOCwxNjYsMzkuMzIsMTczLDMyLjU4YzMwLjQ5LTI5LjQ1LDE1Ny44Niw3OS42LDE5Ny4wOSwxNTkuNzYsNTEuMSwxMDQuMiw1Ni44LDE3NS4xNSwzNC42NywyMTctMTkuMDksMzYuMjgtNzYsODYuMjQtMTc4LjU3LDc3QzE1NS4xMiw0ODAsNDcuNjksNDQ4LjcxLDE2MS4yLDE5Ni43MVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNzkuMzQsMTgwLjI4YzUyLTY4LDUwLjM0LTE0OS4xMyw1Ny43NS0xNTMuNSwzMi0xOC43MSwxMDUsMTE4LjI2LDEyMi44MSwxOTYuNTMsMjMuMTgsMTAxLjgyLDEzLjg3LDE2NC43LTEzLjQ4LDE5Ni4wNS0yMy42NSwyNy4xNi04Mi41NCw1Ny43NS0xNjksMjYuNzhDMTE3LjUsNDI0LjY4LDMxLjM1LDM3My40OCwxNzkuMzQsMTgwLjI4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE4OC4wOCwyMjZjMzMuMjQtNzAuODYsMTYuMjQtMTQxLjcyLDIyLTE0Ny4xMywyNC44OS0yMy4zNywxMTUuNDEsODEsMTQ2LDE0NiwzOS43OSw4NC4zNCw0My41LDE0MS41MiwyNS4yNiwxNzQuODYtMTUuNzcsMjktNjIuMTIsNjguNDktMTQ0LjQ3LDU5Ljk0QzE3OS44MSw0NTMuNzQsOTMuNzYsNDI3LjMzLDE4OC4wOCwyMjZaIi8+PC9nPjwvc3ZnPg==',
            'position'   => 110,
        ]];
    }

    /**
     * Array of submenu pages
     * To be defined manually
     */
    public function setSubpages() {
        $this->subpages = [[
            'parent_slug' => Application::SLUG . '_template_editor',
            'page_title'  => 'Settings',
            'menu_title'  => 'Settings',
            'capability'  => $this->capability,
            'menu_slug'   => $this->option_group,
            'callback'    => [$this, 'displaySettingsPage'],
        ]];
    }

    public function addPages( array $pages ) {
        $this->admin_pages = $pages;
        return $this;
    }

    public function withSubPage( string $title = null ) {
        if ( empty( $this->admin_pages ) ) {
            return $this;
        }
        $admin_page = $this->admin_pages[0];
        $subpage = [[
            'parent_slug' => $admin_page['menu_slug'],
            'page_title'  => $admin_page['page_title'],
            'menu_title'  => ( $title ? $title : $admin_page['menu_title'] ),
            'capability'  => $admin_page['capability'],
            'menu_slug'   => $admin_page['menu_slug'],
            'callback'    => $admin_page['callback'],
        ]];
        $this->admin_subpages = $subpage;
        return $this;
    }

    public function addSubPages( array $pages ) {
        $this->admin_subpages = array_merge( $this->admin_subpages, $pages );
        return $this;
    }

    public function addAdminMenu() {
        foreach ( $this->admin_pages as $page ) {
            add_menu_page(
                $page['page_title'],
                $page['menu_title'],
                $page['capability'],
                $page['menu_slug'],
                $page['callback'],
                $page['icon_url'],
                $page['position']
            );
        }
        foreach ( $this->admin_subpages as $page ) {
            add_submenu_page(
                $page['parent_slug'],
                $page['page_title'],
                $page['menu_title'],
                $page['capability'],
                $page['menu_slug'],
                $page['callback']
            );
        }
    }

    public function displayMainPage() {
        SAFI()->render( [
            'admin' => 'main',
        ] );
    }

    public function displayTemplateEditorPage() {
        //Fetches templates
        $tpl = SAFI()->requestService( TemplatesController::class );
        $user_templates = $tpl->getTemplates();
        //load template;
        $data = [
            'logo_url'     => $this->logo_url,
            'templates'    => $user_templates,
            'pro_url'      => $this->base_url . $this->params,
            'pro_features' => $this->pro_features,
        ];
        SAFI()->render( [
            'admin' => 'template-editor',
        ], $data );
    }

    public function displaySettingsPage() {
        // $tabs = [
        //     'general' => __('General', 'wpjoli-safi'), //id must match tab-general in the "class" args
        //     'appearance' => __('Appearance', 'wpjoli-safi'),
        //     'dimensions' => __('Dimensions', 'wpjoli-safi'),
        // ];
        $settings = SAFI()->requestService( SettingsController::class );
        $groups = $settings->getGroups();
        $tabs = [];
        foreach ( $groups as $group ) {
            $tabs[$group['id']] = [
                'label' => $group['label'],
                'args'  => $group['args'],
            ];
        }
        $plugin_info = get_plugin_data( SAFI()->path( 'smart-auto-featured-image.php' ) );
        $admin_url = get_admin_url();
        $data = [
            'option_group'            => $this->option_group,
            'tabs'                    => $tabs,
            'logo_url'                => $this->logo_url,
            'version'                 => ( isset( $plugin_info['Version'] ) ? $plugin_info['Version'] : '' ),
            'pro_url'                 => $this->base_url . $this->params,
            'pro_features'            => $this->pro_features,
            'joli_toc_url'            => $this->wpjoli_url . 'joli-table-of-contents/' . $this->params,
            'joli_faq_seo_url'        => $this->wpjoli_url . 'joli-faq-seo/' . $this->params,
            'joli_clear_lightbox_url' => $this->wpjoli_url . 'joli-clear-lightbox/' . $this->params,
            'safi_review_url'         => 'https://wordpress.org/support/plugin/' . SAFI()::WP_ORG_SLUG . '/reviews/?rate=5#new-post',
            'safi_doc_url'            => $this->wpjoli_url . 'docs/smart-auto-featured-image/' . $this->params,
            'admin_url'               => $admin_url,
            'safi_settings_url'       => sprintf( '%sadmin.php?page=' . SAFI()::SETTINGS_SLUG, $admin_url ),
        ];
        SAFI()->render( [
            'admin' => 'settings',
        ], $data );
    }

}
