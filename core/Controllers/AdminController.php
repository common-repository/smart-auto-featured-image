<?php

/**
 * @package safi
 */

namespace WPJoli\SAFI\Controllers;


class AdminController
{

    public function enqueueAssets($hook_suffix)
    {
        
        $editor_suffix =  '_page_' . SAFI()::SLUG ; 

        $safi = SAFI();

        //load admin resource if the $hook_suffix starts with $editor_suffix
        if (stripos($hook_suffix, $editor_suffix) !== false){
            wp_enqueue_style('wpjoli-safi-admin-styles', SAFI()->url('assets/admin/css/wpjoli-safi-admin.css', SAFI()::USE_MINIFIED_ASSETS), [], $safi::VERSION);
            wp_enqueue_script('wpjoli-safi-admin-scripts', SAFI()->url('assets/admin/js/wpjoli-safi-admin.js', SAFI()::USE_MINIFIED_ASSETS), ['jquery', 'wp-color-picker'], $safi::VERSION, true);
            wp_localize_script('wpjoli-safi-admin-scripts', 'safiAdmin', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce($safi::SLUG),
            ]);
            // wp_enqueue_style('wpjoli-safi-template-editor-google-material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', []);
            
            wp_enqueue_style('wp-color-picker');
            wp_enqueue_script('wpjoli-wp-color-picker-alpha', SAFI()->url('vendor/wp-color-picker-alpha/wp-color-picker-alpha.min.js'), ['wp-color-picker'], '3.0.3', true);
        }
        
        wp_enqueue_script('wpjoli-safi-admin-notice-scripts', SAFI()->url('assets/admin/js/wpjoli-safi-admin-notices.js', $safi::USE_MINIFIED_ASSETS), ['jquery'], $safi::VERSION, true);
        wp_localize_script('wpjoli-safi-admin-notice-scripts', 'safiAdminNotice', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('safi_admin_notices'),
        ]);
    }

    public function addSettingsLink($links)
    {
        $joli_link = '<a href="' .
            admin_url('admin.php?page=' . SAFI()::SETTINGS_SLUG) .
            '">' . __('Settings') . '</a>';

        array_unshift($links, $joli_link);

        return $links;
    }


}
