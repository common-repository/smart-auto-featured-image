<?php

namespace WPJoli\SAFI;

use WPJoli\SAFI\JoliApplication;
use WPJoli\SAFI\Activator;
use WPJoli\SAFI\Hooks;

class Application extends JoliApplication
{
    const VERSION = '1.0.4';
    const NAME = 'Smart Auto Featured Image';
    const SLUG = 'smart-auto-featured-image';
    const WP_ORG_SLUG = 'smart-auto-featured-image';
    const SETTINGS_SLUG = 'smart-auto-featured-image_settings';
    const TEMPLATES_OPT = 'smart-auto-featured-image_templates';
    const SCREENSHOT_TEMPLATES_OPT = 'smart-auto-featured-image_templates_screenshots';
    const DOMAIN = 'smart-auto-featured-image';
    const ID = 'safi';
    const PREFIX = "safi_"; //db prefix
    const USE_MINIFIED_ASSETS = true;

    protected $log;
    protected $hooks;

    public $options;

    public function __construct()
    {
        // static::$instance = $this;
        parent::__construct();

        //get the wp upload dir
        $upload_dir = wp_upload_dir();

        $dir = $upload_dir['basedir'] . "/safi-thumbnails/";
        $url = $upload_dir['baseurl'] . "/safi-thumbnails/";

        //Templaate thumbnail directory
        define('SAFI_TEMPLATE_THUMB_DIR', $dir);
        define('SAFI_TEMPLATE_THUMB_URL', $url);

        load_plugin_textdomain(
            'wpjoli-safi',
            false,
            trailingslashit(plugin_basename($this->path()) . '/languages')
        );

        $this->log = new Log($this);
    }

    public function run()
    {
        $this->hooks = new Hooks($this);
        $this->hooks->run();
    }

    public function activate()
    {
        $activator = new Activator();
        $activator->activate();
    }

    public function deactivate()
    {
    }

    public function getPlans()
    {
        return [
            '16821' => [
                'plan' => 'Pro',

                'segments' => [
                    // pricing_id
                    '0' => [
                        'name' => 'Trial',
                        'credits' => 10,
                    ],
                    '18866' => [
                        'name' => '1 site',
                        'credits' => 20,
                    ],
                    // '26206' => [
                    //     'name' => '2 sites',
                    //     'credits' => 65,
                    // ],
                    // '26207' => [
                    //     'name' => '3 sites',
                    //     'credits' => 100,
                    // ],
                    '26208' => [
                        'name' => '5 sites',
                        'credits' => 100,
                    ],
                    '26209' => [
                        'name' => '10 sites',
                        'credits' => 300,
                    ],
                    // '26211' => [
                    //     'name' => '25 sites',
                    //     'credits' => 1000,
                    // ],
                ],
            ],
        ];
    }
}
