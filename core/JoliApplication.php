<?php

namespace WPJoli\SAFI;

use WPJoli\SAFI\Log;

class JoliApplication
{

    const JOLI_DOMAIN = 'wpjoli';
    const JOLI_DASHNAME = 'Joli Dashboard';

    protected static $instance;
    protected $services = [];
    protected $log;

    public function __construct()
    {
        static::$instance = $this;
        
        // load_plugin_textdomain('joli-faq',false,
        //             trailingslashit(plugin_basename($this->path()) . '/languages')
        //         );
        
        $this->log = new Log($this);
    }
    
    /**
     * Singleton
     */
    public static function instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    

    /**
     * Request or creates a service
     * Use example:
     * SAFI()->requestService( WPJoli\SAFI\Controllers\MenuController::class );
     */
    public function requestService($service)
    {

        if (!isset($this->services[$service])) {
            $this->services[$service] = new $service;
        }

        return $this->services[$service];
    }


    /**
     * Renders a view file 
     * @param array [ 'folder' => 'view' ]
     * @return type
     */
    public function render(array $args, array $data = [], $return = false)
    {
        if (!is_array($args) || !$args) {
            return;
        }

        foreach ($args as $folder => $view) {
            $file = $this->path() . 'views/' . $folder . '/' . $view . '.php';
            //            echo $file;
            if (!file_exists($file)) {
                return;
            }

            extract($data);

            if ($return) {
                ob_start();
                include $file;
                $output = ob_get_contents();
                ob_end_clean();
                return $output;
            }

            include $file;
        }
    }

    /**
     * Returns the plugin path
     * @return string
     */
    public function path($file = '')
    {
        return plugin_dir_path(dirname(__FILE__)) . ltrim(trim($file), '/');
    }


    /**
     * Gets a plugin's file url
     *
     * @param string $file
     * @param boolean $min_first if set to true, it will try to fetch the minified file in priority
     * @return void
     */
    public function url($file = '', $min_first = false)
    {
        $requested_file_path = plugin_dir_path(dirname(__FILE__)) . ltrim(trim($file), '/');
        $requested_file_url = plugin_dir_url(dirname(__FILE__)) . ltrim(trim($file), '/');
        
        if ($min_first){
            
            $file = ltrim(trim($file), '/');
            $details =  explode('.', $file);
            $ext = end($details);
            $filename = substr($file, 0, strlen($file) - strlen($ext) - 1);
            $min_filename = $filename . '.min.' . $ext;
            $min_filepath = plugin_dir_path(dirname(__FILE__)) . $min_filename; 
            $min_fileurl = plugin_dir_url(dirname(__FILE__)) . $min_filename; 
            
            if (file_exists($min_filepath)){
                //If we are admin and both normal and minified coexist, we get the normal file
                if (is_super_admin() && file_exists($requested_file_path)){
                    return $requested_file_url;
                }

                return $min_fileurl;
            }
        }

        return $requested_file_url;
    }

    public function log($message, $level = 'info', $logfile = null)
    {
        if (is_array($message) || is_object($message)) {
            $message = json_encode($message);
        }else if (is_bool($message)){
            $message = $message ? 'TRUE' : 'FALSE';
        }else if (!isset($message)){
            $message = '-NOT SET-';
        }else if (is_null($message)){
            $message = '-NULL-';
        }
        $this->log->log($message, $level, $logfile);
    }
}

