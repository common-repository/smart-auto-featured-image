<?php

/**
 * @package safi
 */

namespace WPJoli\SAFI;

use WPJoli\SAFI\Application;

class Log
{

    const ALERT = 'alert';
    const CRITICAL = 'critical';
    const DEBUG = 'debug';
    const EMERGENCY = 'emergency';
    const ERROR = 'error';
    const INFO = 'info';
    const NOTICE = 'notice';
    const WARNING = 'warning';
    
    protected $file;
    protected $log;
    protected $app;

    public function __construct( Application $app )
    {
        $this->app = $app;
        $this->file = $this->app->path( 'safi-debug.log' );
    }

    public function log( $message, $level = 'info', $logfile = null )
    {
        $entry = $this->buildLogEntry( $level, $message );
        
        $log = $this->file; //default log
    
        file_put_contents( $log, $entry, FILE_APPEND | LOCK_EX );
    }

    protected function buildLogEntry( $level, $message )
    {
        $backtrace = $this->getBacktrace();
        return sprintf( '[%s|%s] %s: %s' . PHP_EOL,
                current_time( 'mysql' ),
                substr($backtrace, strpos($backtrace, Application::ID)),
                // "", //substr($backtrace, strpos($backtrace, Application::ID)),
                strtoupper( $level ),
                $message
        );
    }

    /**
     * @return void|string
     */
    protected function getBacktrace()
    {
        $backtrace = debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS, 4 );
        $entry = array_pop( $backtrace );
        $path = str_replace( [ $this->app->path( 'plugin/' ), $this->app->path() ], '', $entry[ 'file' ] );
        return $path . ':' . $entry[ 'line' ];
    }

}
